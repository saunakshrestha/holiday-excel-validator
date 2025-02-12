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
      <h2 className='text-lg font-semibold mb-2'>Check Holidays from Excel</h2>
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
        <pre className='mt-2 text-sm bg-gray-100 p-2'>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  )
}

export default CheckHolidays
