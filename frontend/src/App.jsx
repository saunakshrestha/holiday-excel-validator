import { ApiProvider } from './context/ApiContext'
import Dashboard from './pages/Dashboard'

const App = () => {
  return (
    <ApiProvider>
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <Dashboard />
      </div>
    </ApiProvider>
  )
}

export default App
