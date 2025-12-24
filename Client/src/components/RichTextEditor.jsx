import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const RichTextEditor = ({ input, setInput }) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
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

    quillRef.current.on("text-change", () => {
      setInput((prev) => ({
        ...prev,
        description: quillRef.current.root.innerHTML,
      }));
    });
  }, [setInput]);

  useEffect(() => {
    if (
      quillRef.current &&
      input.description !== quillRef.current.root.innerHTML
    ) {
      quillRef.current.root.innerHTML = input.description || "";
    }
  }, [input.description]);

  return (
    <div style={{ background: "white" }}>
      <div ref={editorRef} style={{ minHeight: 180 }} />
    </div>
  );
};

export default RichTextEditor;
