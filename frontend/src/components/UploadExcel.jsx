import { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Use env variable for base URL

const UploadExcel = () => {
  const [file, setFile] = useState(null)
  const [type, setType] = useState('Holiday')

  const handleUpload = async () => {
    if (!file) return alert('Please select a file')
    if (!type) return alert('Please select a type (Holiday or Saturday)')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    try {
      await axios.post(`${API_BASE_URL}/upload/excel/holidays`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      alert('✅ File uploaded successfully')
      setFile(null) // Reset file input after upload
      setType('') // Reset type selection
    } catch (error) {
      console.error('❌ Error uploading file:', error)

      // Handle different error scenarios
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Upload failed. Please try again.'

      if (error.response?.status === 409) {
        alert('⚠️ Some dates already exist in the database')
      } else if (error.response?.status === 400) {
        alert(`❌ Error: ${errorMessage}`)
      } else {
        alert(`❌ ${errorMessage}`)
      }
    }
  }

  return (
    <div className='p-4 bg-white rounded-lg shadow'>
      <h2 className='text-lg font-semibold mb-2'>
        🔴 ⚠️ Only New Holidays (Excel should have 'Dates' column)
      </h2>

      {/* Type selection dropdown */}
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className='border p-2 rounded w-full mb-2'
      >
        <option value=''>-- Select Type --</option>
        <option value='holiday'>Holiday</option>
        <option value='saturday'>Saturday</option>
      </select>

      {/* File input */}
      <input
        type='file'
        accept='.xlsx, .xls'
        onChange={(e) => setFile(e.target.files[0])}
        className='mb-2'
      />

      {/* Upload button */}
      <button
        onClick={handleUpload}
        className='bg-green-500 text-white p-2 rounded w-full mt-2 hover:bg-green-600'
      >
        Upload
      </button>
    </div>
  )
}

export default UploadExcel