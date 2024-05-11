import { Box } from "@mui/material";
import React from "react";

const Modal_Input = ({ label, children }) => {
  return (
    <Box sx={{ mb: 0.5 }} flexDirection={"row"}>
      <label style={{ marginRight: "0.3rem" }}>{label}</label>
      {children}
    </Box>
  );
};

export default Modal_Input;
