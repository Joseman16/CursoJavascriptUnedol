const express = require("express");
const multer = require("multer");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const app = express();

// Crear carpeta temporal uploads si no existe
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer para recibir archivos
const upload = multer({ dest: "uploads/" });

// Configuración Google API con cuenta de servicio
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json", // tu JSON
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

// ID de la carpeta en Shared Drive
const FOLDER_ID = "1wceZUoCjkr1Zi-fWUanDtlXFXMs2qvya";

// Servir HTML estático
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Endpoint para subir archivo
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const fileMetadata = {
      name: file.originalname,
      parents: [FOLDER_ID], // carpeta compartida
    };

    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    fs.unlinkSync(file.path); // borrar temporal
    res.json({ fileId: response.data.id }); // devuelve ID real
  } catch (err) {
    console.error("Error en /upload:", err);
    res.status(500).json({ error: err.message });
  }
});

// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
