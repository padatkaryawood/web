const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const userPath = path.join(__dirname, "../data/users.json");
const requestPath = path.join(__dirname, "../data/request.json");
const historyPath = path.join(__dirname, "../data/history.json");

router.get("/balance/:username", (req, res) => {
  const users = JSON.parse(fs.readFileSync(userPath));
  const user = users.find(u => u.username === req.params.username);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ balance: user.balance });
});

router.post("/deposit", (req, res) => {
  const { username, amount } = req.body;
  const requests = JSON.parse(fs.readFileSync(requestPath));
  requests.push({ username, amount, type: "deposit", status: "pending" });
  fs.writeFileSync(requestPath, JSON.stringify(requests, null, 2));
  res.json({ message: "Deposit request sent" });
});

router.post("/withdraw", (req, res) => {
  const { username, amount } = req.body;
  const requests = JSON.parse(fs.readFileSync(requestPath));
  requests.push({ username, amount, type: "withdraw", status: "pending" });
  fs.writeFileSync(requestPath, JSON.stringify(requests, null, 2));
  res.json({ message: "Withdraw request sent" });
});

router.get("/history/:username", (req, res) => {
  const history = JSON.parse(fs.readFileSync(historyPath));
  const userHistory = history.filter(h => h.username === req.params.username);
  res.json(userHistory);
});

router.post("/play", (req, res) => {
  const { username, bet, choice } = req.body;
  const users = JSON.parse(fs.readFileSync(userPath));
  const user = users.find(u => u.username === username);
  if (!user || user.balance < bet) return res.status(400).json({ error: "Insufficient balance or user not found" });

  const result = Math.random() < 0.5 ? "tiger" : "dragon";
  const win = result === choice;
  user.balance += win ? bet : -bet;

  const history = JSON.parse(fs.readFileSync(historyPath));
  history.push({ username, bet, choice, result, win, time: new Date().toISOString() });

  fs.writeFileSync(userPath, JSON.stringify(users, null, 2));
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  res.json({ result, win });
});

module.exports = router;