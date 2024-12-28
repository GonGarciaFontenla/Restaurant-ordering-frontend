import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Menu from './components/Menu';
import Orders from './components/Orders';
import AddMenuItem from './components/AddMenuItem'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/addMenuItem" element={<AddMenuItem />} /> 
        <Route path="/" element={<Login />} />  {/* Ruta por defecto */}
      </Routes>
    </Router>
  );
}

export default App;
