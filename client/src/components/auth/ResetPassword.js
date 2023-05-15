import { Box, Button, CircularProgress } from '@mui/material'
import React, { useEffect } from 'react'
import { Field, Form } from 'react-final-form'
import TextInput from '../library/form/TextInput';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { showError, showSuccess } from '../../store/actions/alertActions';

function ResetPassword() {
  const {resetCode} = useParams();
  const navigator = useNavigate();
  const dispatch = useDispatch();
  useEffect(() =>{
    axios.post('/users/verify-reset-code', { code: resetCode }).then(result => {

    }).catch(err => {
      dispatch(showError('invalid Request'))
      navigator('/admin/signin')
    })
  },[])
  return (
    <Box borderRadius="5px" boxShadow="0px 0px 17px 5px #dbdada" p={3} bgcolor='#fff' textAlign="center" minWidth="350px">
      <h3>Rate Me</h3>
      <Form
        onSubmit={(data) =>{
          return axios.post('/users/reset-password', {...data,code:resetCode}).then(({data}) => {
            if(data.success)
            {
              dispatch(showSuccess('Password changed successfully. please signin with new Password'))
              navigator('/admin/signin')
            }
          }).catch(err => {
            let message = err && err.response && err.response.data ? err.response.data.error : err.message
            dispatch( showError(message));
            
          })
        }}
      validate={(data) =>{
        const errors = {};
        if(!data.newPassword)
          errors.newPassword = "Password is Required"
        else if(data.newPassword.length < 6)
          errors.newPassword = "Password should atleat 6 characters"

        if(!data.confirmPassword)
          errors.confirmPassword = "Please enter confirm password"
       
       else if(data.newPassword !== data.confirmPassword)
          errors.confirmPassword = "Password are not same"

        return errors
      }}
      >
        {
          (props) =>{
            const {submitting, invalid} = props;
            return(
              <form onSubmit={props.handleSubmit}>
                <Field name='newPassword' type='password' component={TextInput} placeholder='Enter Your Password...' />
                <Field name='confirmPassword' type='password' component={TextInput} placeholder='Enter Your Password...' />
                <Button type='submit' variant='outlined'>Change Password</Button>
                <Box mt={2}>
                <Link style={{textDecoration:"none"}} to="/admin/signin"  disabled={submitting || invalid}>Sign In {submitting && <CircularProgress style={{marginLeft:"10px"}} size={15} /> }</Link>
                </Box>
              </form>
            )
          }
        }
      </Form>
    </Box>
  )
}
export default ResetPassword;