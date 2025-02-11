import { useState, useEffect } from 'react';
import FileUpload from '../common/FileUpload';
import { Holiday } from '../../types/types';
import { uploadHolidays, validateHolidayExcel, fetchHolidays } from '../../services/api';
import axios from 'axios';

interface HolidayListProps {
  onUpdateComplete?: () => void;
  initialHolidays?: string[];
}

interface ValidationResult {
  isValid: boolean;
  message: string;
  errors?: string[];
}

const HolidayList: React.FC<HolidayListProps> = ({ onUpdateComplete }) => {
  const [holidays, setHolidays] = useState<string[]>([]);
  const [saturdays, setSaturdays] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationData, setValidationData] = useState<ValidationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    console.log('Initializing holiday list...');
    fetchHolidayData();
    fetchSaturdayData();
  }, []);

  const fetchHolidayData = async () => {
    try {
      const response = await fetchHolidays();
      console.log('Holiday data received:', response);
      if (Array.isArray(response)) {
        // Convert Holiday objects to strings (assuming each Holiday has a date property)
        const holidayStrings = response.map((holiday: Holiday) => holiday.date);
        setHolidays(holidayStrings);
      } else {
        console.error('Invalid holiday data format:', response);
        setHolidays([]);
      }
    } catch (error) {
      console.error('Error fetching holidays:', error);
      setHolidays([]);
    }
  };

  const fetchSaturdayData = async () => {
    try {
      const response = await axios.get('/api/saturdays');
      console.log('Saturday data received:', response.data);
      if (response.data?.success && Array.isArray(response.data.saturdays)) {
        setSaturdays(response.data.saturdays);
      } else {
        console.error('Invalid saturday data format:', response.data);
        setSaturdays([]);
      }
    } catch (error) {
      console.error('Error fetching saturdays:', error);
      setSaturdays([]);
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
    const confirmUpload = window.confirm(
      'Are you sure you want to upload this file? This action will update the holiday database.'
    );

    if (!confirmUpload) return;

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
      <div className="upload-section">
        <div className="upload-box admin-upload">
          <h3>Admin Upload</h3>
          <div className="holiday-upload">
            <FileUpload
              onFileSelect={handleFileUpload}
              label="Upload Holidays/Saturdays"
              accept=".xlsx,.xls"
              disabled={isUploading}
              className="admin-upload-button"
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

      <div className="data-display">
        <div className="data-box holidays-box">
          <h3>Holidays</h3>
          <div className="data-content">
            {Array.isArray(holidays) && holidays.length > 0 ? (
              holidays.map((holiday, index) => (
                <div key={index} className="data-item">
                  <span className="date">{holiday}</span>
                </div>
              ))
            ) : (
              <p>No holidays available</p>
            )}
          </div>
        </div>
        
        <div className="data-box saturdays-box">
          <h3>Saturdays</h3>
          <div className="data-content" style={{
            maxHeight: '200px',
            overflowY: 'auto',
            padding: '8px',
            margin: '4px',
            fontSize: '14px',
            lineHeight: '1.4',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px'
          }}>
            {Array.isArray(saturdays) && saturdays.length > 0 ? (
              <div style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                {saturdays.join(', ')}
              </div>
            ) : (
              <p>No saturdays available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HolidayList;