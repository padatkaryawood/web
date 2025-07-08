const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const userPath = path.join(__dirname, "../data/users.json");
const requestPath = path.join(__dirname, "../data/request.json");

router.get("/requests", (req, res) => {
  const requests = JSON.parse(fs.readFileSync(requestPath));
  res.json(requests);
});

router.post("/confirm", (req, res) => {
  const { username, amount, type } = req.body;
  const users = JSON.parse(fs.readFileSync(userPath));
  const requests = JSON.parse(fs.readFileSync(requestPath));

  const user = users.find(u => u.username === username);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (type === "deposit") user.balance += amount;
  if (type === "withdraw") user.balance -= amount;

  const newRequests = requests.filter(r => !(r.username === username && r.amount === amount && r.type === type));
  fs.writeFileSync(userPath, JSON.stringify(users, null, 2));
  fs.writeFileSync(requestPath, JSON.stringify(newRequests, null, 2));
  res.json({ message: "Request confirmed" });
});

module.exports = router;