import { Box, Button, CircularProgress } from '@mui/material'
import React from 'react'
import { Field, Form } from 'react-final-form'
import TextInput from '../library/form/TextInput';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { showError, showSuccess } from '../../store/actions/alertActions';

//forgot password form ......
export default function ForgotPassword() {
  const dispatch = useDispatch();
  const navigator = useNavigate()

  return (
    <Box borderRadius="5px" boxShadow="0px 0px 17px 5px #dbdada" p={3} bgcolor='#fff' textAlign="center" minWidth="350px">
      <h3>Rate Me</h3>
      <Form
      onSubmit={(data) =>{
        return axios.post('/users/forgot-password', data).then(({data}) => {
          if(data.success)
          {
            navigator('/admin/signin')
            dispatch(showSuccess("an email has been sent successfully to your inbox. please check your inbox"))
          }


        }).catch(err => {
          let message = err && err.response && err.response.data ? err.response.data.error : err.message
          dispatch( showError(message));
          
        })
      }}
      validate={(data) =>{
        const errors = {};
        if(!data.email)
        errors.email = "please enter a valid Email adress"

        else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email))
        errors.email = "invalid Email adress"
        
        return errors
      }}
      >
        {
          (props) =>{
            const { submitting,invalid } = props;
            return(
              <form onSubmit={props.handleSubmit}>
                <Field name='email' type='email' component={TextInput} placeholder='Enter Email Adress...' label="Email" autoFocus/>
                <Button type='submit' variant='outlined' disabled={submitting || invalid}>Reset Password {submitting && <CircularProgress style={{marginLeft:"10px"}} size={15} /> } </Button>
                <Box mt={2}>
                <Link style={{textDecoration:"none"}} to="/admin/signin">Sign In</Link>
                </Box>
              </form>
            )
          }
        }
      </Form>
    </Box>
  )
}
