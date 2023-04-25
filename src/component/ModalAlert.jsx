import React from "react";
import { Modal, Button } from "react-bootstrap";

function ModalAlert({ ModalObject }) {
  console.log("ModalObject", ModalObject);
  const { msg, functionName, closeModal, param } = ModalObject;

  const HandleClick = () => {
    functionName(param);
    closeModal();
  };

  return (
    <>
      <Modal size="sm" show={true} onHide={closeModal}>
        <Modal.Header>
          <Modal.Title>{msg}</Modal.Title>
          <Button variant="danger" onClick={closeModal}>
            X
          </Button>
        </Modal.Header>
        {/* <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body> */}
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            No
          </Button>
          <Button variant="primary" onClick={HandleClick}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalAlert;
