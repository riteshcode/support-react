import React, { useState } from "react";
import POST from "axios/post";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Trans } from "lang";
import Content from "layouts/content";
import PageHeader from "component/PageHeader";
import {
  LoaderButton,
  FormGroup,
  Label,
  Row,
  Col,
  Radio,
  TextBox,
  Email,
  Checkbox,
  SwitchCheckbox,
  SingleImagePreview,
  MultipleImagePreview,
} from "component/UIElement/UIElement";
import Alert from "component/UIElement/Alert";
import { demoUrl } from "config";
import Notify from "component/Notify";
import ImageCropper from "component/ImageCropper";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Create = ({ ...props }) => {
  const animatedComponents = makeAnimated();

  const { apiToken, language } = useSelector((state) => state.login);
  const [msgType, setMsgType] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [formloadingStatus, SetformloadingStatus] = useState(false);
  const imageToCrop = useState(undefined);
  const [croppedImage, setCroppedImage] = useState(undefined);

  const { register, handleSubmit } = useForm();

  const [singleImage, SetSingleImage] = useState({});
  const [multipleImage, SetMultipleImage] = useState([]);

  const onSubmit = (formData) => {
    formData.api_token = apiToken;
    formData.multiImage = multipleImage.length;
    formData.croppedImageProfile = croppedImage;
    console.log(formData);
    // binfing all json file to form data so that we can send as multipart\form-data, sending file
    var form_data = new FormData();
    for (var key in formData) {
      form_data.append(key, formData[key]);
    }
    // pushing ,mmultiple select data to fromdata
    const multiSelect = document.querySelectorAll('input[name="multiselect"]');
    let multiItem = [];
    if (multiSelect.length > 0) {
      for (let index = 0; index < multiSelect.length; index++) {
        multiItem.push(multiSelect[index].value);
      }
    }

    // pushing ,mmultiple select data to fromdata
    const AniSelect = document.querySelectorAll(
      'input[name="animated_select"]'
    );
    let aniItem = [];
    if (AniSelect.length > 0) {
      for (let index = 0; index < AniSelect.length; index++) {
        aniItem.push(AniSelect[index].value);
      }
    }

    // appending single image
    form_data.append("profile_image", singleImage);
    // form_data.append('croppedImageProfile', croppedImage);
    form_data.append("multiItem", multiItem);
    form_data.append("aniItem", aniItem);

    // appending multiple/gallery image key
    if (multipleImage.length > 0) {
      for (let i = 0; i < multipleImage.length; i++) {
        form_data.append("image_key_" + i, multipleImage[i]);
      }
    }
    // cal ajax to submit data
    POST(demoUrl, form_data)
      .then((response) => {
        console.log(response);
        SetformloadingStatus(false);
        const { message } = response.data;
        Notify(true, message);
      })
      .catch((error) => {
        setMsgType("danger");
        setErrorMsg("Something went wrong !");
      });
  };

  const imageHandleComp = (type, operation, data) => {
    if (type === "single") {
      if (operation === "add") SetSingleImage(data);
      else SetSingleImage({});
    } else {
      if (operation === "add") SetMultipleImage([...multipleImage, data]);
      else {
        const NewList = multipleImage.filter((image, key) => {
          return key !== data;
        });
        SetMultipleImage(NewList);
      }
    }

    return true;
  };
  console.log(multipleImage);

  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  return (
    <Content>
      <PageHeader
        breadcumbs={[
          { title: Trans("DASHBOARD", language), link: "/", class: "" },
          { title: "Demo", link: "", class: "active" },
        ]}
        heading="Demo"
      />
      <Row>
        <Col col={12}>
          <div className="card">
            <div className="card-header">
              <h5>Form Elelemnt Demo</h5>
            </div>
            <div className="card-body">
              {msgType.length > 2 &&
                (msgType === "success" ? (
                  <Alert type="success">{errorMsg}</Alert>
                ) : (
                  <Alert type="danger">{errorMsg}</Alert>
                ))}
              <form
                action="#"
                onSubmit={handleSubmit(onSubmit)}
                id="submitForm"
                noValidate
              >
                <Row>
                  <PayPalScriptProvider
                    options={{
                      "client-id":
                        "AZoK2isU25D_oBhH6BNfPkriQCpdNKz4-su9frNmFduk7YANjtFr5mrb2fMuLdn3aRXiBB19x6S1Yysd",
                    }}
                  >
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: "1.99",
                              },
                            },
                          ],
                        });
                      }}
                      onApprove={(data, actions) => {
                        return actions.order.capture().then((details) => {
                          console.log("transaction_details", details);
                          const name = details.payer.name.given_name;
                          alert(`Transaction completed by ${name}`);
                        });
                      }}
                    />
                  </PayPalScriptProvider>
                  <Col col={3}>
                    <FormGroup mb="20px">
                      <TextBox
                        id="SORT"
                        label="Normal TextBox"
                        placeholder="TextBox"
                        hint="Enter text" // for bottom hint
                        className="form-control"
                        {...register("normal_text[]", {
                          required: "Sort order is required",
                        })}
                        multiple
                      />
                    </FormGroup>
                  </Col>
                  <Col col={3}>
                    <FormGroup mb="20px">
                      <Email
                        id="email"
                        label="Email box"
                        placeholder="hint: ab@ad.com"
                        hint="Enter email" // for bottom hint
                        className="form-control"
                        {...register("email_box", {
                          required: "Enter email",
                        })}
                      />
                    </FormGroup>
                  </Col>
                  <Col col={3}>
                    <Label>Single select</Label>
                    <Select options={options} name="single_select" />
                  </Col>
                  <Col col={3}>
                    <Label>Multi select</Label>
                    <Select
                      defaultValue={[options[2], options[3]]}
                      isMulti
                      name="multiselect"
                      options={options}
                      className="basic-multi-select"
                      classNamePrefix="select"
                    />
                  </Col>
                  <Col col={4}>
                    <Label>Animated select</Label>
                    <Select
                      name="animated_select"
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      defaultValue={[options[2], options[3]]}
                      isMulti
                      options={options}
                    />
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col col={2}>
                    <FormGroup mb="20px">
                      <Radio
                        id="SORT"
                        label={Trans("SORT", language)}
                        placeholder="Enter sort order"
                        {...register("radio")}
                      />
                    </FormGroup>
                  </Col>
                  <Col col={2}>
                    <FormGroup mb="20px">
                      <Checkbox
                        id="checkbox"
                        label="Checkbox"
                        className="custom-control-input"
                        {...register("normal_checkbox", {
                          required: "Sort order is required",
                        })}
                      />
                    </FormGroup>
                  </Col>
                  <Col col={2}>
                    <FormGroup mb="20px">
                      <SwitchCheckbox
                        id="checkbox1"
                        label="Switch Checkbox"
                        className="custom-control-input"
                        {...register("switchcheckbox", {
                          required: "Sort order is required",
                        })}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col col={6}>
                    <Label display="block" mb="5px" htmlFor="role_name">
                      Profile Image
                    </Label>
                    <FormGroup mb="20px">
                      <SingleImagePreview
                        label="SingleImagePreview"
                        className="form-control"
                        {...register("singleimage")}
                        imageHandleComp={imageHandleComp}
                      />
                    </FormGroup>
                  </Col>
                  <Col col={12}>
                    <Label display="block" mb="5px" htmlFor="role_name">
                      Gallery Image
                    </Label>
                    <FormGroup mb="20px">
                      <MultipleImagePreview
                        label="multipleImage"
                        className="form-control"
                        {...register("multipleImage")}
                        imageHandleComp={imageHandleComp}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col col={12}>
                    <Label display="block" mb="5px" htmlFor="role_name">
                      Profile Image Cropper
                    </Label>
                    <ImageCropper
                      imageToCrop={imageToCrop}
                      onImageCropped={(croppedImage) =>
                        setCroppedImage(croppedImage)
                      }
                    />
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col col={12}>
                    <LoaderButton
                      formLoadStatus={formloadingStatus}
                      btnName={Trans("CREATE", language)}
                      className="btn btn-primary btn-block"
                    />
                  </Col>
                </Row>
              </form>
            </div>
          </div>
        </Col>
      </Row>
    </Content>
  );
};

export default Create;
