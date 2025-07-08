const express = require("express");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const router = express.Router();
const userPath = path.join(__dirname, "../data/users.json");
const historyPath = path.join(__dirname, "../data/history.json");
const requestPath = path.join(__dirname, "../data/request.json");
const auth = require("../middleware/auth");

const SECRET = "RYZORT_SECRET";

router.post("/register", (req, res) => {
  const { username, password, email, phone, fullname, bank, bank_number } = req.body;
  const users = JSON.parse(fs.readFileSync(userPath));
  if (users.find(u => u.username === username)) return res.status(400).json({ error: "Username already exists" });

  const newUser = {
    username,
    password,
    email,
    phone,
    fullname,
    bank,
    bank_number,
    balance: 10000,
    role: "user"
  };
  users.push(newUser);
  fs.writeFileSync(userPath, JSON.stringify(users, null, 2));
  res.json({ message: "Registration successful" });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const users = JSON.parse(fs.readFileSync(userPath));
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ username: user.username, role: user.role }, SECRET, { expiresIn: "3h" });
  res.json({ token });
});

router.get("/balance", auth, (req, res) => {
  const users = JSON.parse(fs.readFileSync(userPath));
  const user = users.find(u => u.username === req.user.username);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ balance: user.balance });
});

router.post("/deposit", auth, (req, res) => {
  const { amount } = req.body;
  const requests = JSON.parse(fs.readFileSync(requestPath));
  requests.push({ username: req.user.username, amount, type: "deposit", status: "pending" });
  fs.writeFileSync(requestPath, JSON.stringify(requests, null, 2));
  res.json({ message: "Deposit request sent" });
});

router.post("/withdraw", auth, (req, res) => {
  const { amount } = req.body;
  const requests = JSON.parse(fs.readFileSync(requestPath));
  requests.push({ username: req.user.username, amount, type: "withdraw", status: "pending" });
  fs.writeFileSync(requestPath, JSON.stringify(requests, null, 2));
  res.json({ message: "Withdraw request sent" });
});

router.get("/history", auth, (req, res) => {
  const history = JSON.parse(fs.readFileSync(historyPath));
  const userHistory = history.filter(h => h.username === req.user.username);
  res.json(userHistory);
});

router.post("/play", auth, (req, res) => {
  const { bet, choice } = req.body;
  const users = JSON.parse(fs.readFileSync(userPath));
  const user = users.find(u => u.username === req.user.username);
  if (!user || user.balance < bet) return res.status(400).json({ error: "Insufficient balance or user not found" });

  const result = Math.random() < 0.5 ? "tiger" : "dragon";
  const win = result === choice;
  user.balance += win ? bet : -bet;

  const history = JSON.parse(fs.readFileSync(historyPath));
  history.push({ username: req.user.username, bet, choice, result, win, time: new Date().toISOString() });

  fs.writeFileSync(userPath, JSON.stringify(users, null, 2));
  fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
  res.json({ result, win });
});

module.exports = router;