import { Box, Button, CircularProgress } from '@mui/material'
import React from 'react'
import { Field, Form } from 'react-final-form'

import { Link } from 'react-router-dom';
import axios from 'axios';
import { connect, useDispatch } from 'react-redux';
import { showError, showSuccess } from '../store/actions/alertActions';
import { signin, updateUser } from '../store/actions/authActions';
import TextInput from './library/form/TextInput';
import { hideProgressBar, showProgressBar } from '../store/actions/progressBarAction';
import FileInput from './library/form/FileInput';

function AccountSettings({user,loading}) {
  const dispatch = useDispatch()
  return (
    <Box textAlign="center" sx={{width:{sm:"100%",md:"50%"}, mx:"auto"}} >
      <h3>Account Settings</h3>
      <Form
      onSubmit={(data) =>{
        dispatch( showProgressBar())
        return axios.postForm('api/users/profile-update', data).then(({data}) => {
          if(data.user)
          {
            dispatch(updateUser(data.user))
            dispatch(showSuccess('Acount Settings Update Successfuly'))
          }
          dispatch(hideProgressBar())
        }).catch(err => {
            console.log(err)
          let message = err && err.response && err.response.data ? err.response.data.error : err.message
          dispatch( showError(message));
          dispatch(hideProgressBar())
          
        })
      }}
      validate={(data) =>{
        const errors = {};
        if(!data.name)errors.name = "Name is Required"

        if(data.newPassword)
        {
            if(!data.currentPassword)
            errors.currentPassword = "Current Password Is Required"
    
            if(!data.newPassword.length < 6)
            errors.newPassword = "Password should at least 6 characters"

            if(!data.confirmPassowrd)
            errors.confirmPassowrd = "Confirm Password is Required" 

            else if(data.newPassword !== data.confirmPassowrd)
            errors.confirmPassowrd = "Password are not same" 
        }
        return errors
      }}
      initialValues={{
        name:user.name,
        email:user.email,
        phoneNumber:user.phoneNumber
      }}
      >
        {
          (props) =>{
            const {invalid} = props;
            return(
              <form onSubmit={props.handleSubmit}>
                <Field name='name' type='text' component={TextInput} placeholder='Enter Name...' />
                <Field name='email' type='email' component={TextInput} placeholder='Enter Email Adress...'/>
                <Field name='phoneNumber' type='text' component={TextInput} placeholder='Enter Email Adress...'/>
                <Field name='profilePicture'  component={FileInput} inputProps={{accept:"image/*"}}/>
                <Field name='currentPassword' type='password' component={TextInput} placeholder='Enter Current Password...' />
                <Field name='newPassword' type='password' component={TextInput} placeholder='Enter New Password...' />
                <Field name='confirmPassword' type='password' component={TextInput} placeholder='Confirm New Password...' />
                <Button type='submit' variant='outlined' disabled={invalid}> Update </Button>
             </form>
            )
          }
        }
      </Form>
    </Box>
  )
}

const mapStateToProps = (state) => {
    return{
        user:state.auth.user,
        loading: state.progressBar.loading,
    };
};

export default connect(mapStateToProps,{})(AccountSettings);