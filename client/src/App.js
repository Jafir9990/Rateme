import logo from './logo.svg';
import './App.css';
import Alert from './components/library/Alert';
import { connect, useDispatch } from 'react-redux';
import { Box, Button } from '@mui/material';
import { showSuccess } from './store/actions/alertActions';
import { hideProgressBar, showProgressBar } from './store/actions/progressBarAction';
import ProgressBar from './components/library/ProgressBar';
import AppPublic from './AppPublic';
import { useEffect } from 'react';
import { loadAuth, signout } from './store/actions/authActions';
import AppPreLoader from './components/library/AppPreLoader';

function App({ user, isAuthLoaded, loadAuth, signout }) {
  useEffect(() => {
    loadAuth()
  }, [])
  if (!isAuthLoaded) {
    return <AppPreLoader message="loading App....." />
  }
  if (!user)
    return <AppPublic />
  return (
    <Box height="100%" className="App">
      you are SIGNED In
      <Button onClick={signout}>Logout</Button>
    </Box>

  );
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    isAuthLoaded: state.auth.isLoaded,
  }
}

export default connect(mapStateToProps, { loadAuth, signout })(App);