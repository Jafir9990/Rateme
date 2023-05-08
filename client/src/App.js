import logo from './logo.svg';
import './App.css';
import Alert from './components/library/Alert';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { showSuccess } from './store/actions/alertActions';
import { hideProgressBar, showProgressBar } from './store/actions/progressBarAction';
import ProgressBar from './components/library/ProgressBar';
import AppPublic from './AppPublic';

function App() {
  const dispatch = useDispatch();

  return (
    <div className="App">
     <AppPublic />
    </div>
  );
}

export default App;