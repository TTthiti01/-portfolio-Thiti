import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Portfolio from './pages/Portfolio';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
