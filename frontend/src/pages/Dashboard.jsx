import CheckHolidays from '../components/CheckHolidays'
import FetchHolidays from '../components/FetchHolidays'
import FetchSaturdays from '../components/FetchSaturdays'
import UploadExcel from '../components/UploadExcel'

const Dashboard = () => (
  <div className='grid grid-cols-2 gap-4 p-4'>
    <CheckHolidays />
    <FetchHolidays />
    <FetchSaturdays />
    <UploadExcel />
  </div>
)

export default Dashboard
