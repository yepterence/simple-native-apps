const multer = require('multer');
const express = require('express');
const path = require('path');
const fs = require('fs');
const libre = require('libreoffice-convert');
const cors = require("cors");
const app = express();
const upload = multer({ dest: "uploads/" });
const port = 3000;
app.use(cors());

app.post("/convert", upload.single("file"), (req, res) => {
  const filePath = req.file.path;
  console.log("File path provided", filePath);
  const file = fs.readFileSync(filePath, (err, file)=> {
    if (err) return res.status(500).send("Failed to read file");
  })
  const ext = req.targetFormat;
  libre.convert(file, ext, undefined, (err, done) => {
    if (err) {
      console.error("Conversion error", err);
      return res.status(400).send("Failed to convert file");
    }
    res.setHeader("Content-Type", "application/pdf");
    res.send(done);
  });
});

app.get("/", (req, res) => {
  console.log({req});
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
