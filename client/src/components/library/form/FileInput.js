import { Box, FormHelperText, TextField } from '@mui/material'
import React from 'react'

 function FileInput(props) {
    const {input, meta:{error, touched}, ...rest} = props;
  return (
   <Box width="100%">
    <TextField type='file' onChange={(event) => input.onChange(event.target.files[0])} fullWidth {...rest} size='small' error={touched && error ? true : false}/>
    <FormHelperText error={true}>
        {touched && error ? error : <span>&nbsp;</span>}
    </FormHelperText>
   </Box>
  )
}
export default FileInput;