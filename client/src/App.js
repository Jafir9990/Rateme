import logo from './logo.svg';
import './App.css';
import Alert from './components/library/Alert';
import { useDispatch } from 'react-redux';
import { Box, Button } from '@mui/material';
import { showSuccess } from './store/actions/alertActions';
import { hideProgressBar, showProgressBar } from './store/actions/progressBarAction';
import ProgressBar from './components/library/ProgressBar';
import AppPublic from './AppPublic';
import { useEffect } from 'react';
import { loadAuth, loadToken } from './store/actions/authActions';

function App() {
const dispatch = useDispatch();
useEffect(() => {
  dispatch(loadToken())
  dispatch(loadAuth() )
},[])
return <AppPublic />
  return (
    <Box height="100%" className="App">
     <ProgressBar />
    </Box>
   
  );
}

export default App;