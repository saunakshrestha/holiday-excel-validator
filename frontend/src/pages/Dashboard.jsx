import CheckHolidays from '../components/CheckHolidays'
import FetchHolidays from '../components/FetchHolidays'
import FetchSaturdays from '../components/FetchSaturdays'
import UploadExcel from '../components/UploadExcel'

const Dashboard = () => (
  <div className='grid grid-cols-1 gap-4 p-4 max-w-2xl mx-auto'>
    <CheckHolidays />
    <FetchSaturdays />
    <FetchHolidays />
    <UploadExcel />
  </div>
)

export default Dashboard
