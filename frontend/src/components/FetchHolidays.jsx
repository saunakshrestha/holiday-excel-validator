import { useApi } from '../context/ApiContext'

const FetchHolidays = () => {
  const { holidays } = useApi()

  return (
    <div className='p-4 bg-white rounded-lg shadow'>
      <h2 className='text-lg font-semibold mb-2'>तलका मितिहरू सार्बजनिक बिदाहरू हुन। </h2>
      {holidays.length === 0 ? (
        <p className='text-gray-500'>No holidays found</p>
      ) : (
        <div className='flex flex-wrap gap-1'>
          {holidays.map((holiday, index) => (
            <span key={index}>
              {holiday}{index !== holidays.length - 1 ? ',' : ''}&nbsp;
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default FetchHolidays
