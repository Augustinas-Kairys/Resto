import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Index from '../primary_comps/Index';
import Admin from '../primary_comps/Admin/Admin';
import AdminMenu from '../primary_comps/Admin/AdminMenu';
import TableList from '../primary_comps/Admin/TableList';
import TablePage from '../primary_comps/Admin/TablePage';
import WaiterTableList from '../primary_comps/Waiter/WaiterTableList';
import OrderForm from '../primary_comps/Waiter/OrderForm';
import Kitchen from '../primary_comps/Kitchen/Kitchen';


function MainRouter() {

  return (
    <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/Admin" element={<Admin />} />
          <Route path="/Tables" element={<TableList />} />
          <Route path="/create-table" element={<TablePage />} />
          <Route path="/edit-table/:tableId" element={<TablePage />} />
          <Route path="/AdminMenuEdit" element={<AdminMenu />} />
          <Route path="/waiter/tables" element={<WaiterTableList/>} />
          <Route path="/create-order/:tableId" element={<OrderForm/>} />
          <Route path="/Kitchen" element={<Kitchen/>} />
        </Routes>
    </Router>
  );
}

export default MainRouter;
