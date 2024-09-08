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
import AdminCreateUser from '../components/Admin/AdminUserUtils/AdminCreateUser';
import Register from '../components/Auth/Register';
import EditUserFormComponent from '../components/Admin/AdminUserUtils/EditUserFormComponent';
import UserListComponent from '../components/Admin/AdminUserUtils/UserListComponent';
import ResetPassword from '../components/Auth/ResetPassword';
import ForgotPassword from '../components/Auth/ForgotPassword';


function MainRouter() {

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Forgot-Password" element={<ForgotPassword />} />
          <Route path="/Reset-Password" element={<ResetPassword />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/Tables" element={<TableList />} />
          <Route path="/create-table" element={<TablePage />} />
          <Route path="/edit-table/:tableId" element={<TablePage />} />
          <Route path="/AdminMenuEdit" element={<AdminMenu />} />
          <Route path="/waiter/tables" element={<WaiterTableList/>} />
          <Route path="/create-order/:tableId" element={<OrderForm/>} />
          <Route path="/Admin/Create-User" element={<AdminCreateUser />} />
          <Route path="/Admin/Users" element={<UserListComponent />} />
          <Route path="/Admin/Edit-User/:id" element={<EditUserFormComponent />} />
          <Route path="/Kitchen" element={<Kitchen/>} />
          <Route path="/complete-registration" element={<Register />} /> 
        </Routes>
    </Router>
  );
}

export default MainRouter;
