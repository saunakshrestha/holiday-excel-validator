import { useApi } from '../context/ApiContext'

const FetchHolidays = () => {
  const { holidays } = useApi()

  return (
    <div className='p-4 bg-white rounded-lg shadow'>
      <h2 className='text-lg font-semibold mb-2'>Holidays</h2>
      {holidays.length === 0 ? (
        <p className='text-gray-500'>No holidays found</p>
      ) : (
        <ul>
          {holidays.map((holiday, index) => (
            <li key={index} className='text-sm'>
              {holiday?.name || 'Holiday'} -{' '}
              {holiday?.date || 'No Date'}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FetchHolidays
