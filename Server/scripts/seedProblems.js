import mongoose from "mongoose";
import axios from "axios";
import Problem from '../Models/problemModel.js'
import dotenv from "dotenv";

dotenv.config();

const PROBLEM_API =
  "https://raw.githubusercontent.com/CoderShivam2005/skillengine-problems/main/leet_problems_150.json";

const sanitizeJSON = (raw) => {
  let cleaned = raw;

  cleaned = cleaned.replace(/\\"/g, '"');

  cleaned = cleaned.replace(/^\uFEFF/, "");

  return cleaned;
};

const seedProblems = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected");

    const res = await axios.get(PROBLEM_API);
    let data = res.data;

    if (typeof data === "string") {
      console.log("Sanitizing JSON...");
      data = sanitizeJSON(data);
      data = JSON.parse(data);
    }

    if (!Array.isArray(data)) {
      throw new Error("Problem data is not an array");
    }

    await Problem.deleteMany({});
    console.log("Old problems cleared");

    await Problem.insertMany(data);
    console.log(`${data.length} problems inserted successfully`);

    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

seedProblems();
