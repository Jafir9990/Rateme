import { Box, Button } from '@mui/material'
import React from 'react'
import { Field, Form } from 'react-final-form'
import TextInput from '../library/form/TextInput';
import { Link } from 'react-router-dom';

export default function Signin() {
  return (
    <Box borderRadius="5px" boxShadow="0px 0px 17px 5px #dbdada" p={3} bgcolor='#fff' textAlign="center" minWidth="350px">
      <h3>Rate Me</h3>
      <Form
      onSubmit={(data) =>{
        console.log('sumbitting',data);
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
            return(
              <form onSubmit={props.handleSubmit}>
                <Field name='email' type='email' component={TextInput} placeholder='Enter Email Adress...' />
                <Field name='password' type='password' component={TextInput} placeholder='Enter Your Password...' />
                <Button type='submit' variant='outlined'>Sign In</Button>
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
