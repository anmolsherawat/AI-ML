import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DashboardLayout from './layouts/DashboardLayout';
import Explorer from './pages/Explorer';
import Predict from './pages/Predict';
import Advisory from './pages/Advisory';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Dashboard Shell */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Default overview redirects to explorer for now */}
          <Route index element={<Explorer />} />
          <Route path="explorer" element={<Explorer />} />
          <Route path="predict" element={<Predict />} />
          <Route path="advisory" element={<Advisory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
