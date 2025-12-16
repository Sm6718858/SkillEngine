import axios from "axios";

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

const LANG_CONFIG = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.10.0" },
  cpp: { language: "cpp", version: "10.2.0" },
  c: { language: "c", version: "10.2.0" },
  java: { language: "java", version: "15.0.2" },
};

export const submitSolution = async (req, res) => {
  try {
    const { code, language, stdin } = req.body;

    if (!LANG_CONFIG[language]) {
      return res.status(400).json({ success: false, message: "Unsupported language" });
    }

    const pistonRes = await axios.post(PISTON_URL, {
      ...LANG_CONFIG[language],
      files: [{ content: code }],
      stdin: stdin || "",
    });

    const { stdout, stderr, code: exitCode } = pistonRes.data.run;

    return res.json({
      success: true,
      stdout,
      stderr,
      exitCode,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Compilation / Runtime Error",
      error: err.message,
    });
  }
};
