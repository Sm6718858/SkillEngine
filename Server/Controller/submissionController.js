import axios from "axios";

const JUDGE0_URL = "https://ce.judge0.com/submissions?base64_encoded=false&wait=true";

const LANG_CONFIG = {
  javascript: 63,
  python: 71,
  cpp: 54,
  c: 50,
  java: 62
};

export const submitSolution = async (req, res) => {
  try {
    const { code, language, stdin } = req.body;

    if (!LANG_CONFIG[language]) {
      return res.status(400).json({
        success: false,
        message: "Unsupported language"
      });
    }

    const response = await axios.post(JUDGE0_URL, {
      source_code: code,
      language_id: LANG_CONFIG[language],
      stdin: stdin || ""
    });

    const result = response.data;

    return res.json({
      success: true,
      stdout: result.stdout,
      stderr: result.stderr,
      compile_output: result.compile_output,
      status: result.status.description
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Execution failed",
      error: error.message
    });
  }
};