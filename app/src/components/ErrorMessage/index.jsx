import * as React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { UserContext } from "../../context/dashboard_context";

const errorMessageStyle = {
  button: { width: "50px" },
  display: "flex",
  alignItems: "center",
  width: "23rem",
  position: "fixed",
  borderRadius: "10px",
  backgroundColor: "#F2D6D0",
  boxShadow: "0px 4px 42px 0px rgba(0, 0, 0, 0.2)",
  color: "#AE1100",
  fontFamily: "Nunito",
  fontSize: "14px",
  fontWeight: 400,
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ErrorMessage() {
  const {errorMessageContent, openErrorMessage, setOpenErrorMessage} = React.useContext(UserContext);
  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        open={openErrorMessage}
        autoHideDuration={4000}
        onClose={() => setOpenErrorMessage(false)}
      >
        <Alert onClose={() => setOpenErrorMessage(false)} sx={errorMessageStyle}>
          {errorMessageContent}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
