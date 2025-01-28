import ExcelValidator from '../Validator/ExcelValidator';
import HolidayList from '../Holidays/HolidayList';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="dashboard__left">
        <ExcelValidator />
      </div>
      
      <div className="dashboard__right">
        <div className="dashboard__right-top">
          <HolidayList />
        </div>
        
        <div className="dashboard__right-bottom">
          <div className="validation-status">
            {/* Additional status or information can be added here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;