# burg-typefaces

Datenbankschema-Name: Typefaces

Datenbank-Tabelle: 
CREATE TABLE `typefaces` (
  `filename` text NOT NULL,
  `id` text NOT NULL,
  `category` json NOT NULL,
  `author` text NOT NULL,
  `fontinfo` text,
  `teacher` text,
  `website` text NOT NULL,
  `instagram` text,
  `__v` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


systemd:

[Unit]
Description=Burg Typefaces
After=mysql.service

[Service]
Environment=MYSQL_PASSWORD=FetterMolch3000
ExecStart=/usr/bin/node /path/to/index.js
Restart=always
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=myapp
User=node
Group=node

[Install]
WantedBy=multi-user.target
