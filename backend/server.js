import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("SERVER OK");
});

const PORT = 5001;

app.listen(PORT, () => {
  console.log("SERVER STARTED ON PORT", PORT);
});

