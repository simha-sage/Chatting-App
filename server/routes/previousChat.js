import express from "express";
const router = express.Router();
import { mongoose } from "mongoose";
const recordSchema = new mongoose.Schema({
  index: { type: String, required: true, unique: true },
  messages: { type: [{ sender: String, text: String }], default: [] },
});

const Record = mongoose.model("records", recordSchema);

router.post("/updatePreviousChat", async (req, res) => {
  try {
    const { userId, friendId, messageStore } = req.body;
    const index = [userId, friendId].sort().join("_");

    const updatedRecord = await Record.findOneAndUpdate(
      { index }, // filter by unique chat index
      { $set: { messages: messageStore } }, // replace messages with new data
      { new: true, upsert: true } // return updated doc & create if not exists
    );
    res.send({ message: "chat saved" });
  } catch (error) {
    console.error(error);
    if (error.name === "ValidationError") {
      res.status(400).send({ message: "invalid input" });
    } else {
      res.status(500).send({ messaage: "internal server error" });
    }
  }
});

router.get("/getPreviousChat", async (req, res) => {
  try {
    const { userId, friendId } = req.query;
    const index = [userId, friendId].sort().join("_");
    const record = await Record.findOne({ index });
    res.json(record ? record.messages : []);
  } catch (error) {
    console.error(error);
    res.status(500).send({ messaage: "internal server error" });
  }
});
export default router;
