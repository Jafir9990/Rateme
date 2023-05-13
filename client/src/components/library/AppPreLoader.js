import { Box, CircularProgress } from '@mui/material'
import React from 'react'
import ProgressBar from './ProgressBar'

export default function AppPreLoader({message}) {
  return (
    <Box display={'flex'} maxWidth={'100%'} justifyContent={'center'} alignItems={'center'}  height='100%' >
        <Box>
            <CircularProgress />
            <h3>{message}</h3>
        </Box>
    </Box>
  )
}
