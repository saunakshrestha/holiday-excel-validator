import { useState } from 'react'
import axios from 'axios'

const CheckHolidays = () => {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)

  const handleFileUpload = async () => {
    if (!file) return alert('Please select a file')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(
        'http://localhost:8000/api/check/excel/holidays',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      setResult(response.data)
    } catch (error) {
      console.error('Error validating holidays', error)
    }
  }

  return (
    <div className='p-4 bg-white rounded-lg shadow'>
      <h2 className='text-lg font-semibold mb-2'>
        छुट्टिहरू जाँच गर्नुहोस् (Check Holidays from Excel)
      </h2>
      <input
        type='file'
        onChange={(e) => setFile(e.target.files[0])}
        className='mb-2'
      />
      <button
        onClick={handleFileUpload}
        className='bg-blue-500 text-white p-2 rounded'
      >
        Upload
      </button>
      {result && (
        <div className='mt-4'>
          <div
            className={`p-3 rounded mb-4 ${
              result.success ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            <p
              className={`font-semibold ${
                result.success ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {result.message}
              {result.success
                ? ' (Passed 🎉 ✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅)'
                : ' (Failed)'}
            </p>
          </div>

          {result.holiday_dates && result.holiday_dates.length > 0 && (
            <div>
              <h3 className='font-semibold text-gray-700 mb-2'>
                तलका सार्वजनिक छुट्टी मिति गलत छन्::
              </h3>
              <div className='bg-gray-50 p-2 rounded'>
                <div className='flex flex-wrap gap-1'>
                  {result.holiday_dates.map((date, index) => (
                    <span key={index} className='text-sm'>
                      {date}
                      {index !== result.holiday_dates.length - 1 ? ',' : ''}
                      &nbsp;
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {result.invalid_dates && result.invalid_dates.length > 0 && (
            <div className='mb-4'>
              <h3 className='font-semibold text-red-600 mb-2'>
                Invalid Entries:
              </h3>
              <div className='bg-gray-50 p-2 rounded'>
                {result.invalid_dates.map((date, index) => (
                  <div key={index} className='text-sm text-red-600'>
                    {date}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CheckHolidays