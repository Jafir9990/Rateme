import { Box, FormHelperText, Rating, TextField } from '@mui/material'
import React from 'react'

 function RatingInput(props) {
    const {input, meta:{error}, ...rest} = props;
  return (
   <Box width="100%" textAlign="center">
    <Rating precision={0.5} value={parseFloat(input.value)} onChange={(event,newValue) => input.onChange(newValue)} />
    <FormHelperText error={true} sx={{textAlign:"center", mb:2}}>
        {error ? error : <span>&nbsp;</span>}
    </FormHelperText>
   </Box>
  )
}
export default RatingInput;