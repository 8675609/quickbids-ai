const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

// Root route
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
    return res.status(400).send({ error: "Missing filename or label." });
  }

  console.log(`Label received for ${filename}: ${label}`);
  // TODO: Save this to a DB or file

  res.send({ message: "Label received", filename, label });
});

// Health check route
app.get("/health", (req, res) => {
  res.send({ status: "ok", timestamp: Date.now() });
});

// (Optional) Twilio webhook
app.post("/twilio", express.urlencoded({ extended: false }), (req, res) => {
  console.log("Twilio webhook received:", req.body);
  res.send("<Response><Say>QuickBids AI webhook received!</Say></Response>");
});

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
