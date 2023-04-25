import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
  FormGroup,
  Row,
  Col,
  Input,
  Label,
} from "component/UIElement/UIElement";
import { useSelector } from "react-redux";
import { ErrorMessage } from "@hookform/error-message";
import { Trans } from "lang";
import { Card } from "react-bootstrap";
import Select from "react-select";
import AddAddressContact from "./AddAddressContact";
import { Modal, Button } from "react-bootstrap";

function CustomerAddContact({
  customerAddress,
  customerContact,
  customerId,
  country,
}) {
  const { language } = useSelector((state) => state.login);
  const {
    register,
    formState: { errors },
    control,
    setValue,
    getValues,
  } = useFormContext();

  const [addAddress, SetaddAddress] = useState(false);
  const [addContact, SetaddContact] = useState(false);

  const pushElement = (objectdata, type) => {
    if (type === "address") customerAddress.push(objectdata);
    else customerContact.push(objectdata);
  };

  return (
    <>
      <Row>
        <Col col="6">
          <Card>
            <Card.Body>
              <div className="mb-3">
                <b>{Trans("CHOOSE_ADDRESS", language)}</b>{" "}
                <button
                  className="btn btn-info"
                  type="button"
                  onClick={() => {
                    SetaddAddress(true);
                  }}
                >
                  Add
                </button>
              </div>
              {customerAddress &&
                customerAddress.map((add, idx) => {
                  return (
                    <FormGroup className="mb-2" key={idx}>
                      <input
                        type="radio"
                        id="billing_address_id"
                        {...register("billing_address_id", {
                          required: Trans("ADDRESS_REQUIRED", language),
                        })}
                        defaultValue={add?.address_id}
                      />
                      {"  "}
                      {add?.street_address}, {add?.city}, {add?.state} -{" "}
                      {add?.zipcode}
                      <span className="required">
                        <ErrorMessage
                          errors={errors}
                          name="billing_address_id"
                        />
                      </span>
                    </FormGroup>
                  );
                })}
            </Card.Body>
          </Card>
        </Col>
        <Col col="6">
          <Card>
            <Card.Body>
              <div className="mb-3">
                <b>{Trans("CHOOSE_CONTACT", language)}</b>{" "}
                <button
                  className="btn btn-info"
                  type="button"
                  onClick={() => {
                    SetaddContact(true);
                  }}
                >
                  Add
                </button>
              </div>
              {customerContact &&
                customerContact.map((add, idx) => {
                  return (
                    <FormGroup className="mb-2" key={idx}>
                      <input
                        type="radio"
                        id="billing_contact_id"
                        {...register("billing_contact_id", {
                          required: Trans("CONTACT_REQUIRED", language),
                        })}
                        defaultValue={add?.contact_id}
                      />
                      {"  "}
                      {add?.contact_name} - ({add?.contact_email} )
                      <span className="required">
                        <ErrorMessage
                          errors={errors}
                          name="billing_contact_id"
                        />
                      </span>
                    </FormGroup>
                  );
                })}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Modal */}

      <Modal
        show={addAddress}
        onHide={() => {
          SetaddAddress(false);
        }}
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>{Trans("ADD_ADDRESS", language)}</Modal.Title>
          <Button
            variant="danger"
            onClick={() => {
              SetaddAddress(false);
            }}
          >
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <AddAddressContact
            customerId={customerId}
            contactType="address"
            pushElement={pushElement}
            country={country}
          />
        </Modal.Body>
      </Modal>
      {/* {conatc} */}
      <Modal
        show={addContact}
        onHide={() => {
          SetaddContact(false);
        }}
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>{Trans("ADD_CUSTOMER", language)}</Modal.Title>
          <Button
            variant="danger"
            onClick={() => {
              SetaddContact(false);
            }}
          >
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <AddAddressContact
            country=""
            customerId={customerId}
            contactType="contact"
            pushElement={pushElement}
          />
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CustomerAddContact;
