import { Route, Routes } from "react-router-dom";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import Signin from "./components/auth/SignIn";
import { Box } from "@mui/material";
import Alert from "./components/library/Alert";
import { useSelector } from "react-redux";
import Home from "./components/feedback/Home";
import Feedback from "./components/feedback/Feedback";


function AppPublic() {
    
    return(
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100%">
            <Alert />
         <Routes>
            <Route path="/admin/signin" Component={Signin} />
            <Route path="/admin/forgot-password" Component={ForgotPassword} />
            <Route path="/admin/reset-password/:resetCode" Component={ResetPassword} />
            <Route path="/" Component={Home} />
            <Route path="/employee/feedback/:employeeId" Component={Feedback} />

         </Routes>
        </Box>
     
    )
    
}

export default AppPublic;