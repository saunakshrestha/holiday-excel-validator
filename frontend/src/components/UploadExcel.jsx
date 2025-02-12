import { useState } from 'react'
import axios from 'axios'

const UploadExcel = () => {
  const [file, setFile] = useState(null)

  const handleUpload = async () => {
    if (!file) return alert('Please select a file')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'holiday')

    try {
      await axios.post(
        'http://localhost:8000/api/upload/excel/holidays',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      )
      alert('File uploaded successfully')
    } catch (error) {
      console.error('Error uploading file', error)
    }
  }

  return (
    <div className='p-4 bg-white rounded-lg shadow'>
      <h2 className='text-lg font-semibold mb-2'>
        {' '}
        🔴 ⚠️ Only New Holidays(xlsx){' '}
      </h2>
      <input type='file' onChange={(e) => setFile(e.target.files[0])} />
      <button
        onClick={handleUpload}
        className='bg-green-500 text-white p-2 rounded mt-2'
      >
        Upload
      </button>
    </div>
  )
}

export default UploadExcel
