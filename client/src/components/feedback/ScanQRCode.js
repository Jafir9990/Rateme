import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import { useState } from "react";
import qrious from "qrious";
import {Html5QrcodeScanner} from "html5-qrcode";
import { useNavigate } from "react-router-dom";



function ScanQRCode({employeeId,name}) {
    const [open, setOpen] =useState(false)
    const navigator = useNavigate()
    const handleClose = () => {
        setOpen(false)
    }

    function onScanSuccess(decodedText, decodedResult) {
        // handle the scanned code as you like, for example:
        console.log(`Code matched = ${decodedText}`, decodedResult);
      }
      
      function onScanFailure(error) {
        // handle scan failure, usually better to ignore and keep scanning.
        // for example:
        console.warn(`Code scan error = ${error}`);
      }

    const scanQrCode = () => {
        setOpen(true)
        setTimeout(() => {

            let html5QrcodeScanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } }, false);
            html5QrcodeScanner.render(onScanSuccess, onScanFailure);
        }, 300);
    }
    
    return(
        <>
        <Button sx={{mx: 2}} variant="contained" onClick={scanQrCode} color="primary" startIcon={<QrCode2Icon />}>Scan QR Code</Button>
        <Dialog
        open={open}
        onClose={handleClose}
         >
            <DialogTitle>
                Scan Employee QR Code
            </DialogTitle>
            <DialogContent sx={{textAlign:"center"}}>
                <div id="reader" width="400px"></div>
            </DialogContent>
            <DialogActions sx={{justifyContent:"center"}}>
            <Button onClick={handleClose} autoFocus>Close</Button>
            </DialogActions>
        </Dialog>
        </>
    )
}

export default ScanQRCode;