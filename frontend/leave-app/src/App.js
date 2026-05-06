import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/login';
import AdminPortal from './pages/admin';
import LeaveDashboard from './pages/dashboard';
import Logout from './pages/logout';
import ProtectedRoutes from './components/protectedRoutes';
function App() {
  return (
    <div className="App">
      <Routes>
<Route path="/" element={<Login />}/> 

<Route path='/dashboard' element={<ProtectedRoutes allowedRoles={['employee']}><LeaveDashboard/> </ProtectedRoutes>}/>
     <Route path='/admin' element={ <ProtectedRoutes allowedRoles={['admin']}> <AdminPortal /> </ProtectedRoutes>}/>
     <Route path='/logout' element={<Logout />}/>
      </Routes>
    </div>
  );
}

export default App;
