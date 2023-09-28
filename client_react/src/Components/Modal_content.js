import React from "react";
import styled from "styled-components";

const Styled_ModalContent = styled.div`
  width: 15rem;
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
`;

const Modal_content = ({ children }) => {
  return <Styled_ModalContent>{children}</Styled_ModalContent>;
};

export default Modal_content;
