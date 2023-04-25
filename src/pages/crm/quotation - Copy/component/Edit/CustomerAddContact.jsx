import React from "react";
import { useFormContext } from "react-hook-form";
import { FormGroup, Row, Col } from "component/UIElement/UIElement";
import { useSelector } from "react-redux";
import { ErrorMessage } from "@hookform/error-message";
import { Trans } from "lang";
import { Card } from "react-bootstrap";

function CustomerAddContact({
  customerAddress,
  customerContact,
  editItemData,
}) {
  const { language } = useSelector((state) => state.login);
  const { billing_contact_id, billing_address_id } = editItemData;

  const {
    register,
    formState: { errors },
    control,
    setValue,
    getValues,
  } = useFormContext();

  return (
    <Row>
      <Col col="6">
        <Card>
          <Card.Body>
            <div className="mb-3">
              <b>{Trans("CHOOSE_CUSTOMER_ADDRESS", language)}</b>{" "}
              {/* <button className="btn btn-info">Add</button> */}
            </div>
            {customerAddress &&
              customerAddress.map((add, idx) => {
                let checkedd = "";
                if (add?.address_id === billing_address_id) checkedd = true;

                return (
                  <FormGroup className="mb-2" key={idx}>
                    <input
                      type="radio"
                      id="billing_address_id"
                      {...register("billing_address_id", {
                        required: Trans("ADDRESS_REQUIRED", language),
                      })}
                      defaultValue={add?.address_id}
                      defaultChecked={checkedd}
                    />
                    {"   "}
                    {add?.street_address}, {add?.city}, {add?.state} -{" "}
                    {add?.zipcode}
                    <span className="required">
                      <ErrorMessage errors={errors} name="billing_address_id" />
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
              <b>{Trans("CHOOSE_CUSTOMER_CONTACT", language)}</b>{" "}
              {/* <button className="btn btn-info">Add</button> */}
            </div>
            {customerContact &&
              customerContact.map((add, idx) => {
                let checkedd = "";
                if (add?.contact_id === billing_contact_id) checkedd = true;

                return (
                  <FormGroup className="mb-2" key={idx}>
                    <input
                      type="radio"
                      id="billing_contact_id"
                      {...register("billing_contact_id", {
                        required: Trans("CONTACT_REQUIRED", language),
                      })}
                      defaultValue={add?.contact_id}
                      defaultChecked={checkedd}
                    />
                    {"  "}
                    {add?.contact_name} - ({add?.contact_email} )
                    <span className="required">
                      <ErrorMessage errors={errors} name="billing_contact_id" />
                    </span>
                  </FormGroup>
                );
              })}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default CustomerAddContact;
