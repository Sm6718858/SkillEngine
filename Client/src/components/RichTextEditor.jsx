import React, { useEffect } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

const RichTextEditor = ({ input, setInput }) => {
  const { quill, quillRef } = useQuill({
    theme: "snow",
    modules: {
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
      ],
    },
  });

  useEffect(() => {
    if (!quill) return;
    const handler = () => setInput((prev) => ({ ...prev, description: quill.root.innerHTML }));
    quill.on("text-change", handler);
    return () => quill.off("text-change", handler);
  }, [quill, setInput]);

  useEffect(() => {
    if (quill && typeof input.description === "string") {
      const current = quill.root.innerHTML;
      if (input.description !== current) quill.root.innerHTML = input.description;
    }
  }, [quill, input.description]);

  return (
    <div style={{ background: "white" }}>
      <div ref={quillRef} style={{ minHeight: 180 }} />
    </div>
  );
};

export default RichTextEditor;
