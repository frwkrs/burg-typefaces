"use strict";
require("dotenv").config();
// file uploading via request
const multer = require("multer");
// express serve
const express = require("express");
const mongoose = require("mongoose");
const limit = require("express-limit").limit;
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://font:FetterMolch3000@localhost/fontarchive", {
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.once("open", () => console.log("Connected to DB"));
const limiter = 10000000;
// const { body, validationResult } = require('express-validator');
const bcrypt = require("bcrypt");
const hash = "$2a$12$SEWyvSTjXibeAtzX2wrbve0m.m40qO8dY.sxn6SruaV5nYLffJD4S";

// file handling for database
const fs = require("fs");
const path = require("path");
const { nextTick } = require("process");
// const file = require('./result.json');
const length = 0;
const app = express();
const fontarchiv = require("./models/fontarchiv");
var id = 0;
let nextId = 1;

let pictureCount = 1;

// file upload handling
// write original name of file to scratchdisc
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    if (file.fieldname === "fontFile") {
      callback(null, "./fonts");
    } else if (file.fieldname === "styleFiles") {
      callback(null, "./font_styles");
    } else if (file.fieldname === "pictures") {
      callback(null, `./upload/`);
    }
  },
  filename: function (req, file, callback) {
    if (file.fieldname === "pictures") {
      callback(
        null,
        req.files["fontFile"][0].originalname +
          "-" +
          pictureCount +
          path.extname(file.originalname)
      );
      pictureCount++;
    } else {
      callback(null, file.originalname);
    }
  },
});

var upload = multer({ storage: storage });
// file upload handling //

app.set("view engine", "ejs");
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
// app.use(countFilejs);
app.use(express.json());
// updating @font faces from within ./fonts

//handling requests

app.get(
  ["/", "/library"],
  limit({
    max: limiter, // 5 requests
    period: 60 * 1000, // per minute (60 seconds)
  }),
  async (req, res) => {
    // Add font faces to styles/font.css
    addFontFaces("./fonts", "./styles/font.css");
    // Create an array of font divs
    let fonts = await createFontDivs("styles/font.css");
    let families = [];
    fonts.forEach((font) => {
      let family = font.font.split("-")[0];
      const stylesPath = `./styles/families/${family}.css`;
      let obj = {};
      obj[family] = getFontFamilies(stylesPath);
      families.push(obj);
    });

    // console.log(families);
    // var countArr = families.map(function(subArr) {
    //   return subArr.length;
    // });
    // console.log(countArr);
    // // let fontcss =
    // try {
    // const stylesPath = `./styles/families/${fontcss}.css`;
    // const selector = getFontFamilies(stylesPath)
    // fs.readFile(stylesPath, 'utf8', (err, data) => {
    //   if (err) {
    //     console.log(err);
    //     return;
    //   }

    // Find all fonts in the collection
    let data = await fontarchiv.find();
    console.log(data);

    // Create an empty object to store the matching data from the database
    // Loop through the fonts array

    // Render the library view, passing in the fonts and matching data
    res.render("library", {
      fonts: fonts,
      data: data,
      selector: families,
      active: "library",
    });
  }
);

app.get(
  "/about",
  limit({
    max: limiter, // 5 requests
    period: 60 * 1000, // per minute (60 seconds)
  }),
  (req, res) => {
    res.render("about", { active: "about" });
  }
);

//handle specimen requests
app.get(
  "/specimen/:id",
  limit({
    max: limiter, // 5 requests
    period: 60 * 1000, // per minute (60 seconds)
  }),
  async (req, res) => {
    // sets font of specimen page to font that was clicked by user
    let font = await fontarchiv.findOne({ id: req.params.id });
    let fontcss = req.params.id.split("-")[0];
    try {
      const stylesPath = `./styles/families/${fontcss}.css`;
      const selector = getFontFamilies(stylesPath);
      fs.readFile(stylesPath, "utf8", (err, data) => {
        if (err) {
          console.log(err);
          return;
        }
        // let picturePaths;
        fs.readdir("./upload", (err, files) => {
          if (err) {
            console.log(err);
            return;
          }
          // console.log("font"+fontcss)
          let pictures = files.filter(
            (file) =>
              file.startsWith(fontcss) &&
              (file.endsWith(".jpg") ||
                file.endsWith(".jpeg") ||
                file.endsWith(".png") ||
                file.endsWith(".JPG"))
          );
          let picturePaths = pictures.map((picture) => `../upload/${picture}`);
          // console.log(picturePaths);
          res.render("specimen", {
            font: font,
            active: "specimen",
            css: data,
            selector: selector,
            pictures: picturePaths,
          });
        });
      });
      // console.log(picturePaths);
      // returns specimen ejs with correct font

      // console.log("why");
    } catch (err) {
      res.render("404", { active: "", id: req.params.id });
    }
    // console.log(fontno);
    // Read the CSS file
  }
);

app.get(
  "/upload",
  limit({
    max: limiter, // 5 requests
    period: 60 * 1000, // per minute (60 seconds)
  }),
  async (req, res) => {
    // console.log(divs);
    // res.render('test', {divs: divs});
    res.render("upload", { active: "upload" });
  }
);

app.get(
  "*",
  limit({
    max: limiter, // 5 requests
    period: 60 * 1000, // per minute (60 seconds)
  }),
  (req, res) => {
    res.render("404", { active: "active" });
  }
);
// upload

app.post(
  "/upload",
  upload.fields([
    { name: "fontFile", maxCount: 1 },
    { name: "styleFiles", maxCount: 12 },
    { name: "pictures", maxCount: 5 },
  ]),
  limit({
    max: 5, // 5 requests
    period: 60 * 1000, // per minute (60 seconds)
  }),
  async (req, res) => {
    // if (!checkPasswords ) return;
    console.log(checkPasswords(req.body.password));
    // Check if the font already exists in the database
    let existingFont = await fontarchiv.findOne({
      filename: req.files["fontFile"][0].originalname,
    });
    if (existingFont) {
      // redirect again to the same site
      res.render("upload", {
        message: "Font already exists",
        active: "upload",
      });
      return;
      // todo: only be able to upload with password
    }

    const allowedFileTypes = ["ttf", "otf", "woff", "woff2"];
    const fontFileType = req.files["fontFile"][0].originalname.split(".").pop();
    if (!allowedFileTypes.includes(fontFileType)) {
      res.render("upload", {
        message:
          "Invalid font file type. Allowed file types: ttf, otf, woff, woff2",
        active: "upload",
      });
      return;
    }

    const allowedPictureFileTypes = ["jpg", "jpeg", "png"];
    if (req.files["pictures"]) {
      for (let i = 0; i < req.files["pictures"].length; i++) {
        const pictureFileType = req.files["pictures"][i].originalname
          .split(".")
          .pop();
        if (!allowedPictureFileTypes.includes(pictureFileType)) {
          res.render("upload", {
            message:
              "Invalid picture file type. Allowed file types: jpg, jpeg, png",
            active: "upload",
          });
          return;
        }
      }
    }
    // console.log(req.files)
    let selectedCategories = [];
    const checkboxes = [
      "categorie1",
      "categorie2",
      "categorie3",
      "categorie4",
      "categorie5",
      "categorie6",
      "categorie7",
    ];
    for (let i = 0; i < checkboxes.length; i++) {
      if (req.body[checkboxes[i]]) {
        selectedCategories.push(req.body[checkboxes[i]]);
      }
    }
    let data = req.body;
    try {
      // use the path.parse() function to remove the file extension from the original name
      const { name: id } = path.parse(req.files["fontFile"][0].originalname);
      const font = new fontarchiv({
        filename: req.files["fontFile"][0].originalname,
        id: id,
        category: selectedCategories,
        author: req.body.fname,
        fontinfo: req.body.description,
        teacher: req.body.teachername,
        website: req.body.fontlink,
        instagram: req.body.social,
        otherSocial: req.body.otherSocial,
      });
      await font.save();
    } catch (error) {
      console.log(error);
      res.render("upload", {
        message: "Error while saving font. Please try again",
      });
      return;
    }

    addFontFaces("./fonts", "./styles/font.css");
    // Create an array of font divs
    let fonts = await createFontDivs("styles/font.css");
    // Find all fonts in the collection
    data = await fontarchiv.find();
    pictureCount = 0;
    // Render the library view, passing in the fonts and data
    res.set(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    res.render("library", { fonts: fonts, data: data, active: "library" });
  }
);

app.listen(3000, (err) => {
  if (err) {
    console.log("error", err);
    return;
  } else {
    console.log("listening on port 3000");
  }
});

function checkPasswords(password) {
  const match = bcrypt.compareSync(password, hash);
  return match;
}
// main font faces are added here
function addFontFaces(fontDir, cssFile) {
  // Read the directory contents
  fs.readdir(fontDir, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    // Filter the list of files to get only the font files
    const fontFiles = files.filter((file) =>
      file.match(/\.(woff|woff2|ttf|otf)$/)
    );

    // Add a font-face rule for each font file
    const fontFaces = fontFiles
      .map((fontFile) => {
        const fontName = fontFile.split(".")[0];
        const fontPath = `${fontDir}/${fontFile}`;
        return `@font-face {
  font-family: '${fontName}';
  src: url('.${fontPath}') format('truetype');
}`;
      })
      .join("\n");

    // Write the font-face rules to the CSS file
    fs.writeFile(cssFile, fontFaces, "utf8", (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
  // then the css files for the families are created
  createCSSFiles("./fonts", "./font_styles", "./styles/families");
}

async function createCSSFiles(fontsFolder, stylesFolder, cssFile) {
  // Get all font files in the fonts folder
  const fontFiles = fs.readdirSync(fontsFolder);

  // Iterate over each font file
  for (const fontFile of fontFiles) {
    // Get the font name without the file extension
    const fontName = fontFile.split(".")[0].split("-")[0];
    // dont create css files if no fontName
    if (!fontName) continue;

    // Check if the CSS file for the font already exists
    if (fs.existsSync(`${cssFile}/${fontName}.css`)) {
      console.log(`CSS file for font ${fontName} already exists, skipping...`);
      continue;
    }

    // Create the CSS file
    fs.appendFileSync(
      `${cssFile}/${fontName}.css`,
      `@font-face {
        font-family: '${fontName}';
        src: url('.${fontsFolder}/${fontFile}');
    }`
    );

    // Get all the matching style files in the styles folder
    const styleFiles = fs
      .readdirSync(stylesFolder)
      .filter((file) => file.startsWith(`${fontName}-`));

    // Iterate over each style file
    for (const styleFile of styleFiles) {
      const style = styleFile.split(".")[0];
      fs.appendFileSync(
        `${cssFile}/${fontName}.css`,
        `\n@font-face {
            font-family: '${style}';
            src: url('.${stylesFolder}/${styleFile}');
            font-weight: ${style};
        }`
      );
    }
  }
}

function getFontFamilies(filePath) {
  let fontFamilies = [];
  let css = fs.readFileSync(filePath, "utf8"); //read the css file
  let fontFamiliesRegex = /font-family: '(.+?)'/g; // regular expression to match font-families
  let match;
  while ((match = fontFamiliesRegex.exec(css))) {
    fontFamilies.push(match[1]); // push font-family to the array
  }
  return fontFamilies;
}

async function createFontDivs(cssFile) {
  // Read the contents of the CSS file
  const cssText = fs.readFileSync(cssFile, "utf8");

  // Create a regular expression to match font-family declarations
  const fontFamilyRegex = /font-family:\s*(.*?);/g;

  // Use the regular expression to find all font-family declarations
  let match;
  const fontFamilies = [];
  while ((match = fontFamilyRegex.exec(cssText))) {
    fontFamilies.push(match[1]);
  }

  // Shuffle the font families using the Fisher-Yates shuffle algorithm
  for (let i = fontFamilies.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [fontFamilies[i], fontFamilies[j]] = [fontFamilies[j], fontFamilies[i]];
  }

  // For each font-family, create a div element with that font-family as the style
  let i = 1;
  const divs = [];
  for (const fontFamily of fontFamilies) {
    let updatedStr = fontFamily.replace(/'/g, "");
    // updatedStr = updatedStr.replace(/-/g, ' ');
    let div = { font: updatedStr };
    divs.push(div);
    i++;
  }

  return divs;
}

function createCharList() {
  var capitals = "";
  var lower = "";
  var numbers = "";
  for (var i = 65; i <= 90; i++) capitals += String.fromCharCode(i); // Capitals
  for (var i = 97; i <= 122; i++) lower += String.fromCharCode(i); //Lower
  for (var i = 48; i <= 57; i++) numbers += String.fromCharCode(i);
  return { capitals, lower, numbers };
}
