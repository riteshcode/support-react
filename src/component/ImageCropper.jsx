import React, { useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import FeatherIcon from "feather-icons-react";
import { Row, Col } from "component/UIElement/UIElement";

function ImageCropper(props) {
  const styleComponent = {
    background: "#00000047",
    color: "#fff",
    width: 100,
    fontSize: 0,
    height: 100,
    borderRadius: "1%",
    border: "1px solid #cccccc",
    cursor: "pointer",
    backgroundPosition: "center",
    backgroundSize: "cover",
    textAlign: "center",
    padding: "2%",
  };

  //   const { imageToCrop, onImageCropped } = props;
  const [chooseStatus, SetChooseState] = useState(false);
  const [src, setSrc] = useState(null);
  const [cropConfig, setCropConfig] = useState(
    // default crop config
    {
      unit: "%",
      width: 30,
      aspect: 1 / 1,
    }
  );

  const [imageRef, setImageRef] = useState();

  async function cropImage(crop) {
    SetChooseState(true);
    console.log("imageRef", imageRef);
    console.log("crop", crop);
    if (imageRef && crop.width && crop.height) {
      const croppedImage = await getCroppedImage(
        imageRef,
        crop,
        "croppedImage.jpeg" // destination filename
      );
      console.log("croppedImage", croppedImage);
      document.querySelector(
        ".profile-imgae-crop"
      ).style.backgroundImage = `url(${croppedImage})`;
      // calling the props function to expose
      // croppedImage to the parent component
      //   onImageCropped(croppedImage);
    }
  }

  function getCroppedImage(sourceImage, cropConfig, fileName) {
    console.log("sourceImage", sourceImage);
    console.log("fileName", fileName);
    // creating the cropped image from the source image
    const canvas = document.createElement("canvas");
    const scaleX = sourceImage.naturalWidth / sourceImage.width;
    const scaleY = sourceImage.naturalHeight / sourceImage.height;
    canvas.width = cropConfig.width;
    canvas.height = cropConfig.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      sourceImage,
      cropConfig.x * scaleX,
      cropConfig.y * scaleY,
      cropConfig.width * scaleX,
      cropConfig.height * scaleY,
      0,
      0,
      cropConfig.width,
      cropConfig.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        // returning an error
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }

        blob.name = fileName;
        console.log("blob", blob);
        // creating a Object URL representing the Blob object given
        const croppedImageUrl = window.URL.createObjectURL(blob);
        console.log("croppedImageUrl", croppedImageUrl);

        resolve(croppedImageUrl);
      }, "image/jpeg");
    });
  }

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <Row>
      <Col col={2}>
        <label
          className="profile-imgae-crop"
          htmlFor="profile-imgae-crop"
          style={styleComponent}
        >
          {chooseStatus ? (
            <></>
          ) : (
            <FeatherIcon icon="image" stroke="grey" size="50" />
          )}
        </label>
        <input
          type="file"
          id="profile-imgae-crop"
          accept="image/*"
          onChange={onSelectFile}
          style={{ display: "none" }}
        />
      </Col>
      <Col col={2}>
        <ReactCrop
          src={src}
          crop={cropConfig}
          ruleOfThirds
          onImageLoaded={(imageRef) => setImageRef(imageRef)}
          onComplete={(cropConfig) => cropImage(cropConfig)}
          onChange={(cropConfig) => setCropConfig(cropConfig)}
          crossorigin="anonymous" // to avoid CORS-related problems
        />
      </Col>
    </Row>
  );
}

ImageCropper.defaultProps = {
  onImageCropped: () => {},
};

export default ImageCropper;
