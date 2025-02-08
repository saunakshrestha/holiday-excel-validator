import { useEffect, useState } from 'react';
import { Holiday } from '../../types/types';
import { fetchHolidays } from '../../services/api';

const HolidayDisplay = () => {
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHolidays = async () => {
      try {
        const data = await fetchHolidays();
        setHolidays(data);
      } catch (err) {
        setError('Failed to load holidays');
        console.error('Error loading holidays:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHolidays();
  }, []);

  if (loading) {
    return <div>Loading holidays...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="holiday-display">
      <h3>Holidays</h3>
      <div className="holiday-list">
        {holidays.map((holiday, index) => (
          <div key={index} className="holiday-item">
            <span>{holiday.date}</span>
            <span>{holiday.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HolidayDisplay;