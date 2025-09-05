const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // <-- This serves public/index.html

// In-memory label storage (temporary)
const labelStore = {};

// Root route (optional — handled by index.html now)
app.get("/", (req, res) => {
  res.send("QuickBids AI Server is running!");
});

// File upload route
app.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.send({ message: "Upload successful", filename: req.file.filename });
});

// Label submission route
app.post("/label", (req, res) => {
  const { filename, label } = req.body;
  if (!filename || !label) {
    return res.status(400).json({ error: "Missing filename or label." });
  }
  labelStore[filename] = label;
  res.json({ message: "Label received", filename, label });
});

// Label lookup route (GET by filename)
app.get("/label/:filename", (req, res) => {
  const { filename } = req.params;
  const label = labelStore[filename];
  if (!label) {
    return res.status(404).json({ error: "Label not found." });
  }
  res.json({ filename, label });
});

// Health check route
app.get("/health", (req, res) => {
  res.send({ status: "ok", timestamp: Date.now() });
});

// Optional: Twilio webhook
app.post("/twilio", express.urlencoded({ extended: false }), (req, res) => {
  console.log("Twilio webhook received:", req.body);
  res.send("<Response><Say>QuickBids AI webhook received!</Say></Response>");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
