import { Box, Button, CircularProgress } from '@mui/material'
import React from 'react'
import { Field, Form } from 'react-final-form'
import TextInput from '../library/form/TextInput';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { showError } from '../../store/actions/alertActions';
import { useDispatch } from 'react-redux';
import { signin } from '../../store/actions/authActions';

export default function Signin() {
  const dispatch = useDispatch()
  return (
    <Box borderRadius="5px" boxShadow="0px 0px 17px 5px #dbdada" p={3} bgcolor='#fff' textAlign="center" minWidth="350px">
      <h3>Rate Me</h3>
      <Form
      onSubmit={(data) =>{
        return axios.post('/users/signin', data).then(({data}) => {
          dispatch(signin(data.user, data.token))
          localStorage.setItem('token',data.token)
        }).catch(err => {
          let message = err && err.response && err.response.data ? err.response.data.error : err.message
          dispatch( showError(message));
          
        })
      }}
      validate={(data) =>{
        const errors = {};
        if(!data.email)
        errors.email = "Email  adress Is Required"

        else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email))
        errors.email = "invalid Email adress"
        
        if(!data.password)
        errors.password = "Password Is Required"
        return errors
      }}
      >
        {
          (props) =>{
            const {invalid, submitting} = props;
            return(
              <form onSubmit={props.handleSubmit}>
                <Field name='email' type='email' component={TextInput} placeholder='Enter Email Adress...' autoFocus/>
                <Field name='password' type='password' component={TextInput} placeholder='Enter Your Password...' />
                <Button type='submit' variant='outlined' disabled={invalid || submitting}>Sign In {submitting && <CircularProgress style={{marginLeft:"10px"}} size={15} /> } </Button>
                <Box mt={2}>
                <Link style={{textDecoration:"none"}} to="/admin/forgot-password">Forgot Password</Link>
                </Box>
              </form>
            )
          }
        }
      </Form>
    </Box>
  )
}
