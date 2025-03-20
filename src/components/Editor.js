import React from 'react';
import { Editor as TinyMCEEditor } from '@tinymce/tinymce-react';

const Editor = ({ value, onChange }) => {
  return (
    <TinyMCEEditor
      apiKey="no-api-key" // Replace with your TinyMCE API key for production
      value={value}
      onEditorChange={onChange}
      init={{
        height: 300,
        menubar: false,
        plugins: ['lists link image'],
        toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | link image',
      }}
    />
  );
};

export default Editor;