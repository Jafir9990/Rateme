import logo from './logo.svg';
import './App.css';
import Alert from './components/library/Alert';
import { connect, useDispatch } from 'react-redux';
import { Box, Button, Container } from '@mui/material';
import { showSuccess } from './store/actions/alertActions';
import { hideProgressBar, showProgressBar } from './store/actions/progressBarAction';
import ProgressBar from './components/library/ProgressBar';
import AppPublic from './AppPublic';
import { useEffect } from 'react';
import { loadAuth, signout } from './store/actions/authActions';
import AppPreLoader from './components/library/AppPreLoader';
import { Navigate, Route, Routes, useLocation,  } from 'react-router-dom';
import AppBar from './components/AppBar';
import AccountSettings from './components/AccountSettings';
import Dashboard from './components/Dashbord'
import BloackInterface from './components/library/BloackInterface';
import AddDepartment from './components/departments/AddDepartment';
import EditDepartment from './components/departments/EditDepartment';
import Departments from './components/departments/Departments';
import AddUser from './components/users/AddUser';
import Users from './components/users/Users';
import EditUser from './components/users/EditUser';
import { userTypes } from './utils/constants';
 
const publicRoutes = ['/admin/signin', '/admin/forgot-password', '/admin/reset-password/']

function App({ user, isAuthLoaded, loadAuth, userType }) {
  const location = useLocation();
  useEffect(() => {
    loadAuth()
  }, [])
  if (!isAuthLoaded) {
    return <AppPreLoader message="loading App....." />
  }

if(user && publicRoutes.find(url  => location.pathname.startsWith(url)) )
  return <Navigate to="/admin/dashboard"/>
if(!user && !publicRoutes.find(url  => location.pathname.startsWith(url)) )
  return <Navigate to="/admin/signin"/>
if(location.pathname === '/' || location.pathname === '/admin')
  return <Navigate to="/admin/signin"/>



  if (!user)
    return <AppPublic />
  return (
    <Box height="100%" className="App">
      <AppBar />
      <Alert />
      <Container sx={{mt:10, p:3, position: "relative", backgroundColor:"#fff" ,borderRadius:"5px",boxShadow:"0px 0px 17px 5px #dbdada"}} maxWidth='lg'>
        <BloackInterface />
        <Routes>
          <Route path='/admin/account-settings' Component={AccountSettings}/>
          <Route path='/admin/dashboard' Component={Dashboard}/>

          {/* Departments routes */}

          {
            userType === userTypes.USER_TYPE_SUPER &&
              <>
                <Route path="/admin/departments" Component={Departments} />
                <Route path="/admin/departments/add" Component={AddDepartment} />
              </>
          }
          <Route path="/admin/departments/edit/:deptId" Component={EditDepartment} />

          {/* users routes */}
          <Route path="/admin/users" Component={Users} />
          <Route path="/admin/users/add" Component={AddUser} />
          <Route path="/admin/users/edit/:userId" Component={EditUser} />
        </Routes>
      </Container>
   
    </Box>

  );
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    userType:state.auth.userType,
    isAuthLoaded: state.auth.isLoaded,
  }
}

export default connect(mapStateToProps, { loadAuth, signout })(App);