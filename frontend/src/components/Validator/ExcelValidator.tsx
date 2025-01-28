import { useState } from 'react';
import FileUpload from '../common/FileUpload';
import { FileUploadResponse } from '../../types/types';
import { validateExcel } from '../../services/api';

const ExcelValidator = () => {
  const [validationResponse, setValidationResponse] = useState<FileUploadResponse | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleFileUpload = async (file: File) => {
    setIsValidating(true);
    try {
      const response = await validateExcel(file);
      setValidationResponse(response);
    } catch (error) {
      console.error('Error validating file:', error);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="excel-validator">
      <FileUpload
        onFileSelect={handleFileUpload}
        label="Upload Excel for Validation"
        accept=".xlsx,.xls"
      />
      {isValidating && <div className="loading">Validating...</div>}
      {validationResponse && (
        <div className="validation-results">
          <h3>Validation Results:</h3>
          <ul>
            {validationResponse.dates.map((date, index) => (
              <li key={index}>{date}</li>
            ))}
          </ul>
          {validationResponse.message && (
            <p className="validation-message">{validationResponse.message}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExcelValidator;