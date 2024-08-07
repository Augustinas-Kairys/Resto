import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Index from '../components/Index';
import Admin from '../components/Admin/Admin';
import AdminMenu from '../components/Admin/AdminMenu';
import TableList from '../components/Admin/TableList';
import TablePage from '../components/Admin/TablePage';
import WaiterTableList from '../components/Waiter/WaiterTableList';
import OrderForm from '../components/Waiter/OrderForm';
import Kitchen from '../components/Kitchen/Kitchen';
import Login from '../components/Auth/Login';
import AdminCreateUser from '../components/Admin/AdminCreateUser';


function MainRouter() {

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/Tables" element={<TableList />} />
          <Route path="/create-table" element={<TablePage />} />
          <Route path="/edit-table/:tableId" element={<TablePage />} />
          <Route path="/AdminMenuEdit" element={<AdminMenu />} />
          <Route path="/waiter/tables" element={<WaiterTableList/>} />
          <Route path="/create-order/:tableId" element={<OrderForm/>} />
          <Route path="/Admin/Create-User" element={<AdminCreateUser />} />
          <Route path="/Kitchen" element={<Kitchen/>} />
        </Routes>
    </Router>
  );
}

export default MainRouter;
