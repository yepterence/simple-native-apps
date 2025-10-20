const multer = require('multer');
const express = require('express');
const path = require('path');
const libre = require('libreoffice-convert');
const cors = require("cors");
const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port = 3000;
app.use(cors());
libre.convertAsync = require('util').promisify(libre.convert);

/**
 * Converts a document buffer to PDF using LibreOffice.
 *
 * @param {Buffer} buffer - The input file buffer (e.g., DOCX, PPTX).
 * @param {string} ext - The target file extension (default is ".pdf").
 * @returns {Promise<Buffer>} - A promise that resolves with the converted PDF buffer.
 * @throws {Error} - If the conversion fails or the input is invalid.
 */
async function convertBufferToFileType(buffer, ext = ".pdf") {
  try {
    return await libre.convertAsync(buffer, ext, undefined);
  } catch (err) {
    throw new Error(`LibreOffice conversion failed: ${err.message}`);
  }
}

app.post("/convert", upload.single("file"), async (req, res) => {

    const baseName = path.basename(req.file.originalname, path.extname(req.file.originalname));
    const ext = req.body.targetFormat.startsWith(".")
      ? req.body.targetFormat
      : `.${req.body.targetFormat}`;
    try {
      const converted = await convertBufferToFileType(req.file.buffer, ext);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${baseName}.pdf"`);
      res.send(converted);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  });

app.get("/", (req, res) => {
  console.log({req});
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
