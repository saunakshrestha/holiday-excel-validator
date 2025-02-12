import CheckHolidays from '../components/CheckHolidays'
import FetchHolidays from '../components/FetchHolidays'
import FetchSaturdays from '../components/FetchSaturdays'
import UploadExcel from '../components/UploadExcel'

const Dashboard = () => (
  <div
    className='grid grid-cols-1 gap-4 p-4 max-w-2xl mx-auto shadow-lg
    md:grid-cols-2 md:max-w-none md:mx-0 md:p-8 md:gap-8'
  >
    <CheckHolidays />
    <FetchSaturdays />
    <FetchHolidays />
    <UploadExcel />
  </div>
)

export default Dashboard
