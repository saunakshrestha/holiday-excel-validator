import { useState, useEffect } from 'react';
import FileUpload from '../common/FileUpload';
import { Holiday } from '../../types/types';
import { uploadHolidays, validateHolidayExcel, fetchHolidays } from '../../services/api';

interface HolidayListProps {
  onUpdateComplete?: () => void;
}

const HolidayList: React.FC<HolidayListProps> = ({ onUpdateComplete }) => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [saturdays, setSaturdays] = useState<Holiday[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  // Add this interface at the top of the file
  interface ValidationResult {
    isValid: boolean;
    message: string;
    errors?: string[];
  }
  
  // Update the state definition
  const [validationData, setValidationData] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchHolidayData();
    fetchSaturdayData();
  }, []);

  const fetchHolidayData = async () => {
    try {
      const data = await fetchHolidays();
      setHolidays(data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error fetching holidays:', errorMessage);
    }
  };

  const fetchSaturdayData = async () => {
    try {
      const response = await api.get('/api/saturdays');
      setSaturdays(response.data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error fetching saturdays:', errorMessage);
    }
  };

  const handleFileValidation = async (file: File) => {
    setIsValidating(true);
    setError(null);
    try {
      const response = await validateHolidayExcel(file);
      setValidationData(response);
    } catch (error) {
      setError('Failed to validate file. Please try again.');
      console.error('Error validating file:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      await uploadHolidays(file);
      await Promise.all([fetchHolidayData(), fetchSaturdayData()]);
      setSuccessMessage('Data uploaded successfully!');
      onUpdateComplete?.();
    } catch (error) {
      setError('Failed to upload file. Please try again.');
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="holiday-container">
      <div className="data-display">
        <div className="validation-section">
          <div className="validation-box">
            <h3>Validate Excel</h3>
            <FileUpload
              onFileSelect={handleFileValidation}
              label="Validate Excel File"
              accept=".xlsx,.xls"
              disabled={isValidating}
            />
            {isValidating && (
              <div className="validation-status">
                <div className="loading-spinner" />
                <span>Validating...</span>
              </div>
            )}
            {validationData && (
              <div className="validation-results">
                <h4>Validation Results</h4>
                <div className="results-content">
                  {Array.isArray(validationData) && validationData.map((item, index) => (
                    <div key={index} className="validation-item">
                      {JSON.stringify(item)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="data-box holidays-box">
          <h3>Holidays</h3>
          <div className="data-content">
            {holidays.map((holiday, index) => (
              <div key={index} className="data-item">
                <span className="date">{holiday.date}</span>
                <span className="description">{holiday.description}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="data-box saturdays-box">
          <h3>Saturdays</h3>
          <div className="data-content">
            {saturdays.map((saturday, index) => (
              <div key={index} className="data-item">
                <span className="date">{saturday.date}</span>
                <span className="description">{saturday.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="upload-section">
        <div className="upload-box">
          <h3>Upload Data</h3>
          <FileUpload
            onFileSelect={handleFileUpload}
            label="Upload Excel File"
            accept=".xlsx,.xls"
            disabled={isUploading}
          />
          {isUploading && (
            <div className="upload-status">
              <div className="loading-spinner" />
              <span>Uploading...</span>
            </div>
          )}
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
          {error && (
            <div className="error-message">{error}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HolidayList;