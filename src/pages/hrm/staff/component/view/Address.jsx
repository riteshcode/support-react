import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Trans } from "lang/index";
import FeatherIcon from "feather-icons-react";
import { Modal, Button } from "react-bootstrap";
import POST from "axios/post";
import {
  staffUpdateUrl,
  staffCreateUrl,
  tempUploadFileUrl,
} from "config/index";
import { useForm } from "react-hook-form";
import Notify from "component/Notify";
import {
  Row,
  Col,
  LoaderButton,
  FormGroup,
  Label,
  TextArea,
} from "component/UIElement/UIElement";

function Address({ EditData, refreshInfo }) {
  const { apiToken, language } = useSelector((state) => state.login);
  const [showAddressModal, SetShowAddressModal] = useState(false);
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const { register, getValues, setValue, handleSubmit, reset } = useForm();

  const [DynamicData, SetDynamicData] = useState([]);
  useEffect(() => {
    let abortController = new AbortController();
    function getDynamicData() {
      const filterData = { api_token: apiToken };
      POST(staffCreateUrl, filterData)
        .then((response) => {
          console.log("response", response);
          const { status, data, message } = response.data;
          if (status) SetDynamicData(data);
          else Notify(false, Trans(message, language));
        })
        .catch((error) => {
          Notify(false, error.message);
          console.error("There was an error!", error);
        });
    }
    getDynamicData();
    return () => {
      abortController.abort();
    };
  }, [apiToken, language]);

  const onSubmit = (formData) => {
    SetformloadingStatus(true);
    formData.api_token = apiToken;

    POST(staffUpdateUrl, formData)
      .then((response) => {
        SetformloadingStatus(false);
        console.log(response);
        const { status, message } = response.data;
        if (status) {
          document.querySelector("form").reset();
          Notify(true, Trans(message, language));
          refreshInfo();
          SetShowAddressModal(false);
        } else {
          if (typeof message === "object") {
            let errMsg = "";
            Object.keys(message).map((key) => {
              errMsg += Trans(message[key][0], language);
              return errMsg;
            });
            Notify(false, errMsg);
          } else {
            Notify(false, Trans(message, language));
          }
        }
      })
      .catch((error) => {
        console.log(error);
        Notify(false, error.message);
        SetformloadingStatus(false);
      });
  };

  const editAddress = (CurrentData) => {
    const InputData = JSON.parse(CurrentData);
    const fieldList = getValues();
    for (const key in fieldList) {
      console.log(key, InputData[key]);
      setValue(key, InputData[key]);
    }
    setValue("updateType", "old");
  };

  return (
    <>
      {EditData.staff_address &&
        EditData.staff_address.map((address, idx) => {
          const { address_type, street_address, city, state, postcode } =
            address;
          const add_type = address_type === 1 ? "PERMANENT" : "PRESENT";
          return (
            <div className="updated-biography" key={idx}>
              <span>
                {add_type} ADDRESS{" "}
                <FeatherIcon
                  icon="edit"
                  size={15}
                  fill="#ffc107"
                  color="black"
                  onClick={() => {
                    SetShowAddressModal(true);
                    editAddress(JSON.stringify(address));
                  }}
                />{" "}
              </span>
              <ul className="list-unstyled profile-info-list">
                <li>
                  <span className="tx-color-03">
                    {street_address},<br />
                    {city},{state}
                    <br />
                    {address?.country?.countries_name} - ({postcode})
                  </span>
                </li>
              </ul>
              <p>{EditData.bio}</p>
            </div>
          );
        })}

      {/* add address modal */}
      <Modal
        show={showAddressModal}
        onHide={() => {
          SetShowAddressModal(false);
        }}
        size="lg"
      >
        <Modal.Header>
          <Modal.Title>{Trans("EDIT_ADDRESS", language)}</Modal.Title>
          <Button
            variant="danger"
            onClick={() => {
              SetShowAddressModal(false);
            }}
          >
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
            <input
              type="hidden"
              {...register("updateSection")}
              defaultValue="address"
            />
            <input type="hidden" {...register("address_id")} />
            <input
              type="hidden"
              {...register("staff_id")}
              defaultValue={EditData?.staff_id}
            />

            <Row>
              <Col col={6}>
                <FormGroup>
                  <Label
                    display="block"
                    mb="5px"
                    htmlFor={Trans("CONTACT_NUMBER", language)}
                  >
                    {Trans("CONTACT_NUMBER", language)}{" "}
                    <span className="required">*</span>
                  </Label>
                  <input
                    id={Trans("CONTACT_NUMBER", language)}
                    type="number"
                    placeholder={Trans("CONTACT_NUMBER", language)}
                    className="form-control"
                    {...register("phone_no", {
                      required: "Is required",
                    })}
                  />
                </FormGroup>
              </Col>
              <Col col={6}>
                <FormGroup>
                  <Label
                    display="block"
                    mb="5px"
                    htmlFor={Trans("STREET_ADDRESS", language)}
                  >
                    {Trans("STREET_ADDRESS", language)}{" "}
                    <span className="required">*</span>
                  </Label>
                  <input
                    id={Trans("STREET_ADDRESS", language)}
                    type="text"
                    placeholder={Trans("STREET_ADDRESS", language)}
                    className="form-control"
                    {...register("street_address", {
                      required: Trans("STREET_ADDRESS_REQUIRED", language),
                    })}
                  />
                </FormGroup>
              </Col>
              <Col col={6}>
                <FormGroup>
                  <Label
                    display="block"
                    mb="5px"
                    htmlFor={Trans("CITY", language)}
                  >
                    {Trans("CITY", language)}{" "}
                    <span className="required">*</span>
                  </Label>
                  <input
                    id={Trans("CITY", language)}
                    type="text"
                    placeholder={Trans("CITY", language)}
                    className="form-control"
                    {...register("city", {
                      required: "Is required",
                    })}
                  />
                </FormGroup>
              </Col>
              <Col col={6}>
                <FormGroup>
                  <Label
                    display="block"
                    mb="5px"
                    htmlFor={Trans("STATE", language)}
                  >
                    {Trans("STATE", language)}{" "}
                    <span className="required">*</span>
                  </Label>
                  <input
                    id={Trans("STATE", language)}
                    type="text"
                    placeholder={Trans("STATE", language)}
                    className="form-control"
                    {...register("state", {
                      required: "Is required",
                    })}
                  />
                </FormGroup>
              </Col>
              <Col col={6}>
                <FormGroup>
                  <Label
                    display="block"
                    mb="5px"
                    htmlFor={Trans("COUNTRY", language)}
                  >
                    {Trans("COUNTRY", language)}{" "}
                    <span className="required">*</span>
                  </Label>
                  <select
                    id={Trans("COUNTRY", language)}
                    className="form-control"
                    {...register("countries_id", {
                      required: Trans("ROLE_REQUIRED", language),
                    })}
                  >
                    <option>{Trans("SELECT_COUNTRY", language)}</option>
                    {DynamicData?.country_list &&
                      DynamicData?.country_list.map((INFO) => {
                        const { countries_id, countries_name } = INFO;
                        return (
                          <option key={countries_id} value={countries_id}>
                            {countries_name}
                          </option>
                        );
                      })}
                  </select>
                </FormGroup>
              </Col>
              <Col col={6}>
                <FormGroup>
                  <Label
                    display="block"
                    mb="5px"
                    htmlFor={Trans("POSTCODE", language)}
                  >
                    {Trans("POSTCODE", language)}{" "}
                    <span className="required">*</span>
                  </Label>
                  <input
                    id={Trans("POSTCODE", language)}
                    type="number"
                    placeholder={Trans("POSTCODE", language)}
                    className="form-control"
                    {...register("postcode", {
                      required: "Is required",
                    })}
                  />
                </FormGroup>
              </Col>
              <Col col={12}>
                <LoaderButton
                  formLoadStatus={formloadingStatus}
                  btnName={Trans("SUBMIT", language)}
                  className="btn btn-primary btn-sm"
                />
              </Col>
            </Row>
          </form>
        </Modal.Body>
      </Modal>
      {/* end education modal */}
    </>
  );
}

export default Address;
