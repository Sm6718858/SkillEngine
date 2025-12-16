// import Problem from "../Models/problemModel.js";
import Problem from "../Models/problemModel.js";


export const fetchProblems = async (req, res) => {
  try {
    const problems = await Problem.find();

    return res.status(200).json({
      success: true,
      count: problems.length,
      problems,
    });
  } catch (error) {
    console.error("Error from fetchProblems:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const fetchProblemById = async (req, res) => {
  try {
    const { id } = req.params;

    const problem = await Problem.findOne({ id });

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    return res.status(200).json({
      success: true,
      problem,
    });
  } catch (error) {
    console.error("Error from fetchProblemById:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
