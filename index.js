const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("QuickBids AI Server is running!");
});

app.post("/upload", (req, res) => {
  upload.single("video")(req, res, function (err) {
    if (err) {
      return res.status(500).send({ error: "Upload failed", details: err.message });
    }
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    res.send({ message: "Upload successful", filename: req.file.filename });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
// Trigger rebuild
