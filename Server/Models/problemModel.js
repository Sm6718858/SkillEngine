import mongoose from "mongoose";
const TestcaseSchema = new mongoose.Schema(
  {
    input: {
      type: mongoose.Schema.Types.Mixed, 
      required: true
    },
    output: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    }
  },
  { _id: false }
);

const ProblemSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
      index: true
    },

    tags: {
      type: [String],
      default: []
    },
     boilerplate: {
    cpp: String,
    javascript: String,
    python: String
  },

    testcases: {
      type: [TestcaseSchema],
      required: true,
      validate: v => Array.isArray(v) && v.length > 0
    },

    hiddenTestcases: {
      type: [TestcaseSchema],
      default: []
    },

    constraints: {
      type: String,
      default: ""
    },

    examples: {
      type: [
        {
          input: mongoose.Schema.Types.Mixed,
          output: mongoose.Schema.Types.Mixed
        }
      ],
      default: []
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Problem", ProblemSchema);
