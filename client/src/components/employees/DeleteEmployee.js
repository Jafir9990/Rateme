import { Box, Button, IconButton, Popover, Typography } from '@mui/material'
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { deletEmployee } from '../../store/actions/departmentActions';
import { hideProgressBar, showProgressBar } from '../../store/actions/progressBarAction';
import { showError, showSuccess } from '../../store/actions/alertActions';
import axios from 'axios';

export default function DeleteEmployee({ employeeId, name }) {

    const [anchorEl, setAnchorEl] = React.useState(null);
    const dispatch = useDispatch();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const deleteEmployee = () => {
        dispatch(showProgressBar())
        axios.post('/api/employees/delete',{id: employeeId}).then(({data}) => {
            if(data.success)
                dispatch(showSuccess("Employee Deleted successfuly"))
                 dispatch(hideProgressBar())
        }).catch(error => {
            let message = error && error.response && error.response.data ? error.response.data.error : error.message;
            dispatch(hideProgressBar())
            dispatch(showError(message))
        })
    }

    const open = Boolean(anchorEl);
    
    return (
        <>
            <IconButton onClick={handleClick}><DeleteIcon /> </IconButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Typography sx={{ p: 2 }}>All employees data including employee rating will be deleted. Do you want to delete this <b>{name}</b> department?</Typography>
                <Box textAlign="center" pb={2}>
                    <Button onClick={handleClose} variant='contained' color='primary'>Close</Button>
                    <Button onClick={deleteEmployee} sx={{ ml: 2 }} variant="contained" color="error">Delete</Button>
                </Box>
            </Popover>
        </>
    )
}