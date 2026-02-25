
import mongoose from "mongoose";

export async function connectDB() {
  await mongoose.connect("mongodb://127.0.0.1/crypto_empire");
  console.log("MongoDB conectado");
}

const userSchema = new mongoose.Schema({
  username: String,
  balance: { type: Number, default: 1000 },
  upgrades: { type: Object, default: {} },
  lastClaim: { type: Date, default: Date.now }
});

export const User = mongoose.model("User", userSchema);
