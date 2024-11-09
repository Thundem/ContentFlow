import React from "react";
import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  const apiKey = 'qxqh875g34belgxi9x7tgdn7xekgfy8gq2x1c6wcm31avszg';

  return (
    <TinyMCEEditor
      apiKey={apiKey}
      value={value}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code help wordcount",
        ],
        toolbar:
          "undo redo | formatselect | bold italic underline | " +
          "alignleft aligncenter alignright alignjustify | " +
          "bullist numlist outdent indent | removeformat | help",
        content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
      }}
      onEditorChange={(content) => {
        onChange(content);
      }}
    />
  );
};

export default Editor;