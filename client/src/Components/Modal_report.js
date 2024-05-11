import React from "react";
import Modal_content from "./Modal_content";
import Modal_overlay from "./Modal_overlay";
import { Box, Button, Typography } from "@mui/material";

const Modal_report = ({
  onPressCancel,
  onPressConfirm,
  report,
  onChangeReport,
}) => {
  return (
    <Modal_overlay>
      <Modal_content>
        <Typography variant="h5" sx={{ mb: 1 }}>
          버그신고 & 원하는 기능
        </Typography>

        <textarea
          onChange={onChangeReport}
          placeholder=""
          style={{
            width: "100%",
            height: "10rem",
          }}
          maxLength={200}
          value={report}
        ></textarea>
        <Box sx={{ mb: 1 }}></Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button color="error" variant="outlined" onClick={onPressCancel}>
            취소
          </Button>
          <Button variant="outlined" onClick={onPressConfirm}>
            보내기
          </Button>
        </Box>
      </Modal_content>
    </Modal_overlay>
  );
};

export default Modal_report;
