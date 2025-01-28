import { useState } from 'react';
import Dashboard from './components/Layout/Dashboard';
import './styles/components/_app.scss';
import './styles/components/_dashboard.scss';

function App() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="app">
      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

export default App;