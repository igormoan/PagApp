import * as React from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { UserContext } from "../../context/dashboard_context";

const successMessageStyle = {
  button: { width: "50px" },
  display: "flex",
  alignItems: "center",
  width: "23rem",
  position: "fixed",
  borderRadius: "10px",
  backgroundColor: "var(--feedback-sucesso-light, #c3d4fe)",
  boxShadow: "0px 4px 42px 0px rgba(0, 0, 0, 0.2)",
  color: "var(--feedback-sucesso-dark, #243F80)",
  fontFamily: "Nunito",
  fontSize: "14px",
  fontWeight: 400,
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SuccessMessage() {
  const {successMessageContent, openSuccessMessage, setOpenSuccessMessage} = React.useContext(UserContext);
  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Snackbar
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        open={openSuccessMessage}
        autoHideDuration={4000}
        onClose={() => setOpenSuccessMessage(false)}
      >
        <Alert onClose={() => setOpenSuccessMessage(false)} sx={successMessageStyle}>
          {successMessageContent}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
