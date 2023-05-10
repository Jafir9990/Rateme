import { Route, Routes } from "react-router-dom";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Signin from "./components/auth/SignIn";
import { Box } from "@mui/material";


function AppPublic() {
    return(
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
         <Routes>
            <Route path="/admin/signin" Component={Signin} />
            <Route path="/admin/forgot-password" Component={ForgotPassword} />
            <Route path="/admin/reset-password/:resetCode" Component={ResetPassword} />
         </Routes>
        </Box>
     
    )
    
}

export default AppPublic;