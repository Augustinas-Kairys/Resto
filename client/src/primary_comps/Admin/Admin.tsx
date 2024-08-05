import { Link } from 'react-router-dom';

const Admin: React.FC = () => {

  return (
    <div>
      <h1>Admin Menu Management</h1>
      <Link to="/AdminMenuEdit">Create New Menu Items</Link>
      <br />
      <Link to="/Tables">Create New Tables</Link>
    </div>
  );
};

export default Admin;
