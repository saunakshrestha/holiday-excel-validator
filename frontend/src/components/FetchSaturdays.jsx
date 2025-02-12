import { useApi } from '../context/ApiContext'

const FetchSaturdays = () => {
  const { saturdays } = useApi()

  return (
    <div className='p-4 bg-white rounded-lg shadow'>
      <h2 className='text-lg font-semibold mb-2'>Saturdays</h2>
      {saturdays.length === 0 ? (
        <p className='text-gray-500'>No Saturdays found</p>
      ) : (
        <ul>
          {saturdays.map((date, index) => (
            <li key={index} className='text-sm'>
              {date || 'No Date'}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FetchSaturdays
