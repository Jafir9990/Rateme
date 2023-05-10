import { Box, Button } from '@mui/material'
import React from 'react'
import { Field, Form } from 'react-final-form'
import TextInput from '../library/form/TextInput';
import { Link } from 'react-router-dom';

//forgot password form ......
export default function ForgotPassword() {
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
        errors.email = "please enter a valid Email adress"

        else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email))
        errors.email = "invalid Email adress"
        
        return errors
      }}
      >
        {
          (props) =>{
            return(
              <form onSubmit={props.handleSubmit}>
                <Field name='email' type='email' component={TextInput} placeholder='Enter Email Adress...' label="Email"/>
                <Button type='submit' variant='outlined'>ForgotPassword</Button>
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
