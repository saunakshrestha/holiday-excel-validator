import { useState } from 'react';
import FileUpload from '../common/FileUpload';
import { FileUploadResponse } from '../../types/types';
import { validateExcel } from '../../services/api';
import '../../styles/components/_excel-validator.scss';

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
      <div className="validator-content">
        <FileUpload
          onFileSelect={handleFileUpload}
          label="Upload Excel for Validation"
          accept=".xlsx,.xls"
          className="validator-upload"
        />
        {isValidating && <div className="loading">Validating...</div>}
        {validationResponse && (
          <div className="validation-results">
            <h4>Validation Results:</h4>
            {validationResponse.holiday_dates && validationResponse.holiday_dates.length > 0 && (
              <div className="holiday-dates">
                <p>Found holidays on:</p>
                <ul>
                  {validationResponse.holiday_dates.map((date: string, index: number) => (
                    <li key={index}>{date}</li>
                  ))}
                </ul>
              </div>
            )}
            {validationResponse.message && (
              <p className={`validation-message ${validationResponse.success ? 'success' : 'warning'}`}>
                {validationResponse.message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelValidator;