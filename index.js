const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

app.use(express.json());
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("RYZORT JWT Backend Active");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));