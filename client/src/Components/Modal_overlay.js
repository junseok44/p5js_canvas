import React from "react";
import styled from "styled-components";

const Styled_Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Modal_overlay = ({ children }) => {
  return <Styled_Modal>{children}</Styled_Modal>;
};

export default Modal_overlay;
