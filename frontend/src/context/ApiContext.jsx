import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const ApiContext = createContext()

const ApiProvider = ({ children }) => {
  const [holidays, setHolidays] = useState([])
  const [saturdays, setSaturdays] = useState([])

  // Fetch Holidays
  const fetchHolidays = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/holidays`)
      setHolidays(response.data.holidays || []) // ✅ Extract array safely
    } catch (error) {
      console.error('Error fetching holidays', error)
    }
  }

  // Fetch Saturdays
  const fetchSaturdays = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/saturdays`)
      setSaturdays(response.data.saturdays || []) // ✅ Extract array safely
    } catch (error) {
      console.error('Error fetching Saturdays', error)
    }
  }

  useEffect(() => {
    fetchHolidays()
    fetchSaturdays()
  }, [])

  return (
    <ApiContext.Provider
      value={{ holidays, saturdays, fetchHolidays, fetchSaturdays }}
    >
      {children}
    </ApiContext.Provider>
  )
}

const useApi = () => useContext(ApiContext)

export { ApiProvider, useApi }
