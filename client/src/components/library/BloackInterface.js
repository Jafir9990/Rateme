import { Box } from '@mui/material'
import { useSelector } from 'react-redux'

function BloackInterface() {
    const loading = useSelector(state => state.progressBar.loading)
      if(!loading) return null;
    return (
    <Box height="100%" width="100%" bgcolor="#ffffff8a" position="absolute" top="0px" left="0px" zIndex={1}>
        
    </Box>
  )
}
export default BloackInterface