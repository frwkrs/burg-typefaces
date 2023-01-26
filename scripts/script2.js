// let activeButton = $('.filter-container button').first();
const contenteditableElements = document.querySelectorAll(
  "[contenteditable=true]"
);

// Add a change event listener to each element
contenteditableElements.forEach((element) => {
  element.addEventListener("input", (event) => {
    // Get the new text content
    const newText = event.target.textContent;
    // Update the text content of all other elements
    contenteditableElements.forEach((otherElement) => {
      if (otherElement !== event.target) {
        otherElement.textContent = newText;
      }
    });
  });
});

$("#font-style-selector").on("change", function () {
  console.log($(this).val());
  var selectedStyle = $(this).val();
  var fontName = selectedStyle.split("-")[0];
  $(".bigfontcolumn").css("font-family", selectedStyle);
  $(".charset").css("font-family", selectedStyle);
  $(".size3").css("font-family", selectedStyle);
  $(".size2").css("font-family", selectedStyle);
  $(".size1").css("font-family", selectedStyle);
  $(".small-size").css("font-family", selectedStyle);
  $(".min-size").css("font-family", selectedStyle);
});

var filterButtons = $(".filter-container button");

filterButtons.click(function () {
  var activeButton = $(this);
  filterButtons.removeClass("filter-active");
  activeButton.addClass("filter-active");
});

$(".slider").on("input", function () {
  const classes = $(this).attr("class").split(" ");
  const secondClass = classes[1];
  $("#font" + secondClass).css("font-size", $(this).val() + "rem");
});

$("#fontSize").on("input", function () {
  $(".bigfontcolumn").css("font-size", $(this).val() + "rem");
  $(".bigfontcolumn").css("line-height", $(this).val() + "rem");
});
$("#spacing").on("input", function () {
  $(".bigfontcolumn").css("letter-spacing", $(this).val() + "px");
  // $('.bigfontcolumn').css("line-height", $(this).val() + "rem");
});

$("#line-height").on("input", function () {
  $(".bigfontcolumn").css("line-height", $(this).val() + "px");
});
$("#reset").on("click", function () {
  $(".bigfontcolumn").css("font-size", "15vh");
  $(".bigfontcolumn").css("letter-spacing", "0");
  $(".bigfontcolumn").css("line-height", "15vh");
});

$(".bigfont").on("input", () => {
  console.log($(this).val());
  $("bigfont").text($(this).val());
});

// darkmode
const darkmodeSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="black" viewBox="0 0 16 16">
    <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z " stroke-width="10"/>`;
const lightmodeSVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-sun" viewBox="0 0 16 16"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/></svg>';
var dark = false;

$("#darkmode-button").on("click", function () {
  if (dark == true) {
    $("body").css("background", "white");
    $("body").css("color", "black");
    $("p-about-text").css("color", "black");
    $(".slider").css("background", "blue");
    $(".slider").css("color", "blue");
    $(".slider").removeClass("white-thumb");
    $(".hr-specimen").css("background", "black");
    $("hr").css("background", "black");
    $("a").css("color", "black");
    // $( "button").css("color", "black");
    $("select").css("color", "blue");
    $("label").css("color", "blue");
    $(".reset").css("color", "blue");
    $(this).html(darkmodeSVG);
    dark = false;
  } else {
    $("body").css("background", "#000a00");
    $("body").css("color", "white");
    $("p-about-text").css("color", "white");
    // $( ".slider").css("background", "white");
    // $( ".slider").css("color", "white");
    // $(".slider").addClass("white-thumb");
    $(".hr-specimen").css("background", "white");
    $("hr").css("background", "white");
    $("a").css("color", "white");
    $(this).html(lightmodeSVG);
    // $( "button").css("color", "white");
    // $("select").css("color", 'white');
    // $("label").css("color", 'white')
    // $(".reset").css("color", 'white');

    dark = true;
  }
});

$("#specimen-slider").on("input", function () {
  $("#font1").css("font-size", $(this).val() + "rem");
});

$("#lineHeight").on("input", function () {
  $("#font1").css("line-height", $(this).val() + "rem");
});

$("#charsetButton").click(function () {
  var s = "";
  for (var i = 65; i <= 90; i++) s += String.fromCharCode(i);
  for (var i = 97; i <= 120; i++) s += String.fromCharCode(i);
  for (var i = 48; i <= 57; i++) s += String.fromCharCode(i);

  $("#font1").text(s);
});

let container = document.getElementById("charset");

function getCharacterSet(font) {
  opentype.load("../fonts/" + font, function (err, font) {
    if (err) {
      console.error(err);
      return;
    }
    // Get all available characters in the font
    const glyphs = Object.values(font.glyphs.glyphs);
    glyphs.forEach((glyph) => {
      let char = String.fromCharCode(glyph.unicode);
      let charElement = document.createElement("span");
      charElement.textContent = char;
      container.appendChild(charElement);
      // do something with each glyph
    });
  });
}

function validateForm() {
  var checkBox = document.getElementById("termsCheckbox");
  var errorMessage = document.getElementById("errorMessage");
  if (!checkBox.checked) {
    errorMessage.textContent =
      "You must agree to the terms and conditions before submitting the form.";
    return false;
  }
  errorMessage.textContent = "";
  return true;
}

const form = $("form");
const username = $("username");
const email = $("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  checkInputs();
});
