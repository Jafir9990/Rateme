import { Box, Pagination, Rating, Typography } from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { hideProgressBar, showProgressBar } from '../../store/actions/progressBarAction'
import { showError } from '../../store/actions/alertActions'
import moment from 'moment/moment'

export default function EmployeeFeedback({employeeId}) {

    const dispatch = useDispatch()
    const [employees,setEmployees] = useState([])
    const [page,setPage] = useState(1)
    const [numOfPages,setNumOfpages] = useState(1)
    const [ratings,setRatings] = useState([])
    
    const loadRatings = () => {
      dispatch(showProgressBar());
      axios.post('/api/employees/ratings',{employeeId, page}).then(result => {
          setRatings(result.data.ratings);
          setNumOfpages(result.data.numOfPages)
          dispatch(hideProgressBar())
      }).catch(error => {
          let message = error && error.response && error.response.data ? error.response.data.error : error.message;
          dispatch(hideProgressBar())
          dispatch(showError(message))
      })
    }
    useEffect(() =>{
        loadRatings()
    },[page])
  return (
   <Box mt={4}>
    <Typography variant='h5' gutterBottom>Recent feedbacks</Typography>
        {
            ratings.map(rating => (
              <Box bgcolor="#ececec" p={3} borderRadius={2} mb={2} key={rating._id}>
                <Typography>{rating.name}<span style={{color:'#7a7a7a', marginLeft:'15px'}}>({moment(rating.createdOn).fromNow() })</span></Typography>
                {
                    rating.phone &&
                    <Typography color='#7a7a7a'>{rating.phone}</Typography>
                }
                <Rating value={rating.rating} readOnly />
                {/* <Typography color='#7a7a7a'>({rating.rating})</Typography> */}

                {
                    rating.message &&
                    <Typography sx={{mt:2}}>{rating.message}</Typography>
                }

                </Box>
            ))
        }
         <Box display="flex" justifyContent="center" mt={3}>
            <Pagination count={numOfPages}  color="primary" page={page} onChange={(event,value) => setPage(value)} />
           </Box>
        </Box>

  )
}
