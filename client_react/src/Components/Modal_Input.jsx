import { Box } from "@mui/material";
import React from "react";

const Modal_Input = ({
  value,
  placeholder,
  name,
  onChange,
  type,
  label,
  radioValues,
  radioLabels,
}) => {
  return (
    <Box sx={{ mb: 0.5 }}>
      <label style={{ marginRight: "0.3rem" }}>{label}</label>
      {type === "text" ? (
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
        />
      ) : type === "radio" ? (
        <>
          {radioValues.map((radioValue, index) => {
            return (
              <>
                <input
                  type="radio"
                  name={name}
                  value={radioValue}
                  onChange={onChange}
                  checked={radioValue == value}
                />
                {radioLabels[radioValues.indexOf(radioValue)]}
              </>
            );
          })}
        </>
      ) : null}
    </Box>
  );
};

export default Modal_Input;
