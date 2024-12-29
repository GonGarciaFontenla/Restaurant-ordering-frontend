import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Menu from './components/Menu';
import Orders from './components/Orders';
import AddMenuItem from './components/AddMenuItem'; 
import CreateUser from './components/CreateUser';
import DeleteMenuItem from './components/DeleteMenuItem';
import CreateOrder from './components/CreateOrder';
import ModifyOrder from './components/ModifyOrder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/addMenuItem" element={<AddMenuItem />} /> 
        <Route path="/deleteMenuItem" element={<DeleteMenuItem />} />
        <Route path="/createUser" element={<CreateUser />} />
        <Route path="/createOrder" element={<CreateOrder />} />
        <Route path="/modifyOrder" element={<ModifyOrder />} />
        <Route path="/" element={<Login />} />  {/* Ruta por defecto */}
      </Routes>
    </Router>
  );
}

export default App;
