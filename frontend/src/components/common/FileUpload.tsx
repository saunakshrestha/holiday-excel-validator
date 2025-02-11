import React from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label: string;
  disabled?: boolean;
  className?: string; // Add className prop
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, accept = '*', label, disabled = false }) => { // Modify this line
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="file-upload">
      <label className="file-upload__label">
        {label}
        <input
          type="file"
          onChange={handleFileChange}
          accept={accept}
          className="file-upload__input"
          disabled={disabled} // Add this line
        />
      </label>
    </div>
  );
};

export default FileUpload;