import ExcelValidator from '../Validator/ExcelValidator';
import HolidayList from '../Holidays/HolidayList';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { fetchHolidays, api } from '../../services/api';

interface HolidayResponse {
  holidays: string[];
  message: string;
  success: boolean;
}

interface SaturdayResponse {
  saturdays: string[];
  message: string;
  success: boolean;
}

const Dashboard = () => {
  const [holidayData, setHolidayData] = useState<HolidayResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHolidays = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching holidays...');
      const response = await fetchHolidays();
      console.log('Holidays response:', response);
      
      if (response?.success && Array.isArray(response.holidays)) {
        setHolidayData(response);
        console.log('Holidays data set:', response);
      } else {
        console.error('Invalid response format:', response);
        setError(response?.message || 'Failed to fetch holidays');
      }
    } catch (err) {
      console.error('Error in loadHolidays:', err);
      setError('Failed to load holidays');
    } finally {
      setLoading(false);
    }
  }, []);

  const [saturdayData, setSaturdayData] = useState<SaturdayResponse | null>(null);
  const [loadingSaturdays, setLoadingSaturdays] = useState(true);
  const [saturdayError, setSaturdayError] = useState<string | null>(null);

  const loadSaturdays = useCallback(async () => {
    setLoadingSaturdays(true);
    setSaturdayError(null);
    try {
      const response = await api.get('/api/saturdays');
      console.log('Saturdays response:', response);
      
      if (response.data?.success && Array.isArray(response.data.saturdays)) {
        setSaturdayData(response.data);
        console.log('Saturdays data set:', response.data);
      } else {
        console.error('Invalid saturdays data format:', response.data);
        setSaturdayError(response.data?.message || 'Failed to fetch saturdays');
      }
    } catch (err) {
      console.error('Error loading saturdays:', err);
      setSaturdayError('Failed to load saturdays. Please check if the server is running.');
    } finally {
      setLoadingSaturdays(false);
    }
  }, []);

  useEffect(() => {
    console.log('Dashboard mounted, loading holidays...');
    loadHolidays();
    loadSaturdays();
  }, [loadHolidays, loadSaturdays]);

  const handleUpdateComplete = useCallback(() => {
    console.log('Update complete, reloading holidays...');
    loadHolidays();
  }, [loadHolidays]);

  console.log('Current state:', { holidayData, loading, error });

  return (
    <div className="dashboard">
      <div className="dashboard__grid">
        <div className="dashboard__grid-item">
          <div className="content-box">
            <h3>Validate Excel</h3>
            <ExcelValidator />
          </div>
        </div>
        
        <div className="dashboard__grid-item">
          <div className="content-box">
            <h3>Upload Holidays/Saturdays</h3>
            <HolidayList 
              onUpdateComplete={handleUpdateComplete}
              initialHolidays={holidayData?.holidays || []}
            />
          </div>
        </div>
        
        <div className="dashboard__grid-item">
          <div className="content-box">
            <h3>Public Holidays</h3>
            <div 
              className="data-list holidays-list" 
              style={{
                maxHeight: '200px',
                overflowY: 'auto',
                padding: '8px',
                margin: '4px',
                fontSize: '14px',
                lineHeight: '1.4',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px'
              }}
            >
              {loading ? (
                <p className="loading-message">Loading holidays...</p>
              ) : error ? (
                <p className="error-message" style={{ color: '#dc3545' }}>{error}</p>
              ) : !holidayData?.holidays?.length ? (
                <p className="no-data-message">No holidays found</p>
              ) : (
                <div style={{ 
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}>
                  {Array.isArray(holidayData.holidays) 
                    ? holidayData.holidays.join(', ')
                    : 'Invalid holidays data'}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="dashboard__grid-item">
          <div className="content-box">
            <h3>Saturdays</h3>
            <div 
              className="data-list saturdays-list"
              style={{
                maxHeight: '200px',
                overflowY: 'auto',
                padding: '8px',
                margin: '4px',
                fontSize: '14px',
                lineHeight: '1.4',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px'
              }}
            >
              {loadingSaturdays ? (
                <p className="loading-message">Loading saturdays...</p>
              ) : saturdayError ? (
                <p className="error-message" style={{ color: '#dc3545' }}>{saturdayError}</p>
              ) : !saturdayData?.saturdays?.length ? (
                <p className="no-data-message">No saturdays found</p>
              ) : (
                <div style={{ 
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}>
                  {Array.isArray(saturdayData.saturdays) 
                    ? saturdayData.saturdays.join(', ')
                    : 'Invalid saturdays data'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;