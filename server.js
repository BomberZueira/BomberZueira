
import express from "express";
import cors from "cors";
import { connectDB, User } from "./database.js";
import { upgrades } from "./upgrades.js";

const app = express();
app.use(cors());
app.use(express.json());

await connectDB();

app.post("/login", async (req, res) => {
  const { username } = req.body;

  let user = await User.findOne({ username });

  if (!user) {
    user = await User.create({ username });
  }

  res.json(user);
});

app.post("/upgrade", async (req, res) => {
  const { username, upgradeId } = req.body;

  const user = await User.findOne({ username });
  const upgrade = upgrades.find(u => u.id === upgradeId);

  const level = user.upgrades[upgradeId] || 0;
  const cost = upgrade.baseCost * Math.pow(1.5, level);

  if (user.balance < cost)
    return res.status(400).json({ error: "Saldo insuficiente" });

  user.balance -= cost;
  user.upgrades[upgradeId] = level + 1;

  await user.save();

  res.json(user);
});

app.get("/upgrades", (req, res) => {
  res.json(upgrades);
});

app.listen(5000, () =>
  console.log("Servidor rodando na porta 5000")
);
