import { Box, Button } from '@mui/material'
import React from 'react'
import { Field, Form } from 'react-final-form'
import TextInput from '../library/form/TextInput';
import { Link } from 'react-router-dom';

function ResetPassword() {
  return (
    <Box borderRadius="5px" boxShadow="0px 0px 17px 5px #dbdada" p={3} bgcolor='#fff' textAlign="center" minWidth="350px">
      <h3>Rate Me</h3>
      <Form
      onSubmit={(data) =>{
        console.log('sumbitting',data);
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
            return(
              <form onSubmit={props.handleSubmit}>
                <Field name='newPassword' type='password' component={TextInput} placeholder='Enter Your Password...' />
                <Field name='confirmPassword' type='password' component={TextInput} placeholder='Enter Your Password...' />
                <Button type='submit' variant='outlined'>Change Password</Button>
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
export default ResetPassword;