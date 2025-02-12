import { useApi } from '../context/ApiContext'

const FetchSaturdays = () => {
  const { saturdays } = useApi()

  return (
    <div className='p-4 bg-white rounded-lg shadow'>
      <h2 className='text-lg font-semibold mb-2 font-serif'>
        तलका मितिहरू शनिबारका बिदाहरू हुन।
      </h2>
      {saturdays.length === 0 ? (
        <p className='text-gray-500'>No Saturdays found</p>
      ) : (
        <div className='flex flex-wrap gap-1'>
          {saturdays.map((date, index) => (
            <span key={index}>
              {date}
              {index !== saturdays.length - 1 ? ',' : ''}&nbsp;
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default FetchSaturdays
