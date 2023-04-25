import React, { useEffect, useState } from "react";
import POST from "axios/post";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import { tempUploadFileUrl } from "config/index";
import { useSelector } from "react-redux";
import Notify from "component/Notify";

export const Image = (props) => {
  const { src, className, alt, custumstyle } = props;
  return (
    <>
      <img src={src} className={className} alt={alt} style={custumstyle} />
    </>
  );
};

export const Badge = (props) => {
  const { color, children } = props;
  return (
    <>
      <span className={`badge badge-pill badge-${color}`}>{children}</span>
    </>
  );
};

export const BadgeShow = ({ type, content }) => {
  let color = "";
  if (typeof type === "string") {
    switch (type.toLowerCase()) {
      case "approved":
      case "active":
      case "success":
      case "paid":
        color = "success";
        break;
      case "failed":
      case "deactive":
      case "inactive":
      case "rejected":
      case "reject":
        color = "danger";
        break;
      default:
        color = "warning";
        break;
    }
  }

  return (
    <>
      <span className={`badge badge-pill badge-${color}`}>{content}</span>
    </>
  );
};

export const IconButton = (props) => {
  const { color, children } = props;
  return (
    <>
      <button type="button" className={`btn btn-${color} btn-xs btn-icon`}>
        {children}
      </button>
    </>
  );
};

export const Col = (props) => {
  const { col, className, children } = props;
  return (
    <div
      className={
        className !== undefined ? `col-md-${col} ${className}` : `col-md-${col}`
      }
    >
      {children}
    </div>
  );
};

export const Row = (props) => {
  const { className, children } = props;
  return (
    <div className={className !== undefined ? `row ${className}` : "row"}>
      {children}
    </div>
  );
};

export const Radio = React.forwardRef((props, ref) => {
  const { id, label } = props;
  return (
    <>
      <div className="custom-control custom-radio">
        <input type="radio" {...props} ref={ref} />
        &nbsp;
        <label htmlFor={id}>{label}</label>
      </div>
    </>
  );
});

export const Checkbox = React.forwardRef((props, ref) => {
  const { id, label } = props;
  return (
    <>
      <div className="custom-control custom-checkbox">
        <input type="checkbox" {...props} ref={ref} />
        &nbsp;
        <label htmlFor={id} className="custom-control-label">
          {label}
        </label>
      </div>
    </>
  );
});
export const SwitchCheckbox = React.forwardRef((props, ref) => {
  const { id, label } = props;
  return (
    <>
      <div className="custom-control custom-switch">
        <input type="checkbox" {...props} ref={ref} /> &nbsp;
        <label htmlFor={id} className="custom-control-label">
          {label}
        </label>
      </div>
    </>
  );
});

export const TextBox = React.forwardRef((props, ref) => {
  const { id, label } = props;
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input type="text" {...props} ref={ref} />
      &nbsp;
      <span className="hint">{props.hint}</span>
    </>
  );
});

export const Email = React.forwardRef((props, ref) => {
  const { id, label } = props;
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input type="email" {...props} ref={ref} />
      &nbsp;
      <span className="hint">{props.hint}</span>
    </>
  );
});

export const Anchor = (props) => {
  const { path, className, custumstyle } = props;
  return (
    <>
      <Link to={path} className={className} style={custumstyle}>
        {props.children}
      </Link>
    </>
  );
};

export const FormGroup = (props) => {
  return (
    <>
      <div className="form-group" {...props}>
        {props.children}
      </div>
    </>
  );
};
export const Label = (props) => {
  return (
    <>
      <label {...props}>
        <b>{props.children}</b>
      </label>
    </>
  );
};

export const Input = React.forwardRef((props, ref) => {
  return (
    <>
      <label htmlFor={props.label}>
        <b>{props.label}</b>
      </label>
      <input {...props} ref={ref} />
    </>
  );
});
export const TextArea = React.forwardRef((props, ref) => {
  return (
    <>
      <label htmlFor={props.label}>
        <b>{props.label}</b>
      </label>
      <textarea {...props} ref={ref}></textarea>
    </>
  );
});

export const StatusSelect = React.forwardRef((props, ref) => {
  return (
    <>
      <label htmlFor={props.label}>
        <b>{props.label}</b>
      </label>
      <select {...props} ref={ref}>
        <option value="">Select Status</option>
        <option value={1}>Active</option>
        <option value={0}>Deactive</option>
      </select>
    </>
  );
});

export const IsFeatured = React.forwardRef((props, ref) => {
  return (
    <>
      <label htmlFor={props.label}>{props.label}</label>
      <select {...props} ref={ref}>
        <option value="">Select Featured</option>
        <option value={1}>Yes</option>
        <option value={0}>No</option>
      </select>
    </>
  );
});

export const ImagewithPreview = React.forwardRef((props, ref) => {
  const styleComponent = {
    background: "#cccccc47",
    color: "#fff",
    width: "100%",
    fontSize: 0,
    height: 100,
    borderRadius: "1%",
    border: "1px solid #cccccc",
    cursor: "pointer",
    backgroundPosition: "center",
    backgroundSize: "cover",
  };
  const Imagechange = (event) => {
    console.log(event);
    if (event.target.files[0] === "" || event.target.files[0] === undefined)
      return;
    var readers = new FileReader();
    readers.onload = function (e) {
      document.querySelector(
        `#${props.label}`
      ).style.backgroundImage = `url(${e.target.result})`;
    };

    readers.readAsDataURL(event.target.files[0]);
    console.log(readers);
  };

  return (
    <>
      <label htmlFor={props.label}>{props.label}</label>
      <input
        type="file"
        id={props.label}
        ref={ref}
        onChange={Imagechange}
        style={styleComponent}
      />
      <span className="hint">Choose image</span>
    </>
  );
});

export const SingleImagePreview = React.forwardRef((props, ref) => {
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
  const [chooseStatus, SetChooseState] = useState(false);
  const Imagechange = (event) => {
    console.log(event);
    if (event.target.files[0] === "" || event.target.files[0] === undefined)
      return;
    var readers = new FileReader();
    readers.onload = function (e) {
      SetChooseState(true);
      document.querySelector(
        `.${props.label}`
      ).style.backgroundImage = `url(${e.target.result})`;
    };
    readers.readAsDataURL(event.target.files[0]);
    props.imageHandleComp("single", "add", event.target.files[0]);
    console.log(readers);
  };
  const RemoveImage = (e) => {
    e.preventDefault();
    SetChooseState(false);
    document.querySelector(`#${props.label}`).value = "";
    document.querySelector(`.${props.label}`).style.backgroundImage = ``;
    props.imageHandleComp("single", "remove", "");
    return true;
  };

  return (
    <>
      <label
        className={props.label}
        htmlFor={props.label}
        style={styleComponent}
      >
        {chooseStatus ? (
          <FeatherIcon
            icon="x"
            stroke="white"
            size="50"
            onClick={RemoveImage}
          />
        ) : (
          <FeatherIcon icon="image" stroke="grey" size="50" />
        )}
      </label>
      <input
        type="file"
        id={props.label}
        ref={ref}
        onChange={Imagechange}
        style={{ display: "none" }}
      />
      <div id="resizer-demo"></div>
    </>
  );
});

export const MultipleImagePreview = React.forwardRef((props, ref) => {
  // add some css here
  const styleComponent = {
    background: "#00000047",
    color: "#fff",
    width: "100%",
    fontSize: 0,
    height: "100%",
    borderRadius: "1%",
    border: "1px solid #cccccc",
    cursor: "pointer",
    backgroundPosition: "center",
    backgroundSize: "cover",
    textAlign: "center",
    padding: "2%",
  };
  const [imageList, SetImageList] = useState([]);

  const Imagechange = (event) => {
    if (event.target.files[0] === "" || event.target.files[0] === undefined)
      return;
    var readers = new FileReader();
    readers.onload = function (e) {
      SetImageList([...imageList, e.target.result]);
    };
    readers.readAsDataURL(event.target.files[0]);
    props.imageHandleComp("multiple", "add", event.target.files[0]);
  };

  const RemoveImage = (index) => {
    const NewList = imageList.filter((image, key) => {
      return key !== index;
    });
    SetImageList(NewList);
    props.imageHandleComp("multiple", "remove", index);
  };

  return (
    <>
      <label
        className={props.label}
        htmlFor={props.label}
        style={styleComponent}
        onDragOver={Imagechange}
      >
        <FeatherIcon icon="film" stroke="grey" size="50" />
      </label>
      <input
        type="file"
        id={props.label}
        ref={ref}
        onChange={Imagechange}
        style={{ display: "none" }}
      />
      <div className="GalleryList">
        {imageList.map((imagepath, index) => (
          <div
            className="imagelistItem"
            style={{ backgroundImage: `url(${imagepath})` }}
            key={index}
          >
            <FeatherIcon
              icon="x-circle"
              stroke="white"
              fill="black"
              size="30"
              style={{ marginLeft: "32%" }}
              onClick={() => RemoveImage(index)}
            />
          </div>
        ))}
      </div>
    </>
  );
});

export const GalleryImagePreviewWithUpload = React.forwardRef((props, ref) => {
  // console.log("props.selectedImageList", props.selectedImageList);
  const { apiToken, language } = useSelector((state) => state.login);
  // add some css here
  const styleComponent = {
    background: "#00000047",
    color: "#fff",
    width: "100%",
    fontSize: 0,
    height: "100%",
    borderRadius: "1%",
    border: "1px solid #cccccc",
    cursor: "pointer",
    backgroundPosition: "center",
    backgroundSize: "cover",
    textAlign: "center",
    padding: "2%",
  };
  const [imageList, SetImageList] = useState(
    props.selectedImageList ? props.selectedImageList : []
  );
  // const [imageList, SetImageList] = useState(props.selectedImageList);

  const Imagechange = (event) => {
    if (event.target.files[0] === "" || event.target.files[0] === undefined)
      return;
    var readers = new FileReader();
    readers.onload = function (e) {
      SetImageList([...imageList, e.target.result]);
    };
    readers.readAsDataURL(event.target.files[0]);

    // upload temp image and bind value to array
    const formdata = new FormData();
    formdata.append("api_token", apiToken);
    formdata.append("fileInfo", event.target.files[0]);
    formdata.append("images_type", 1);
    POST(tempUploadFileUrl, formdata)
      .then((response) => {
        props.imageHandleComp("multiple", "add", response.data.data);
      })
      .catch((error) => {
        Notify(false, error.message);
      });
  };

  const RemoveImage = (index) => {
    const NewList = imageList.filter((image, key) => {
      return key !== index;
    });
    SetImageList(NewList);
    props.imageHandleComp("multiple", "remove", index);
  };

  useEffect(() => {
    let abortController = new AbortController();

    return () => abortController.abort();
  }, [imageList]);

  return (
    <>
      <label
        className={props.label}
        htmlFor={props.label}
        style={styleComponent}
        onDragOver={Imagechange}
      >
        <FeatherIcon icon="film" stroke="grey" size="50" />
      </label>
      <input
        type="file"
        id={props.label}
        ref={ref}
        onChange={Imagechange}
        style={{ display: "none" }}
      />
      <div className="GalleryList">
        {imageList.map((imagepath, index) => (
          <div
            className="imagelistItem"
            style={{ backgroundImage: `url(${imagepath})` }}
            key={index}
          >
            <FeatherIcon
              icon="x-circle"
              stroke="white"
              fill="black"
              size="30"
              style={{ marginLeft: "32%" }}
              onClick={() => RemoveImage(index)}
            />
          </div>
        ))}
      </div>
    </>
  );
});

export const GalleryImagePreviewWithUploadWithItem = React.forwardRef(
  (props, ref) => {
    // console.log("props.selectedImageList", props.selectedImageList);
    const { apiToken, language } = useSelector((state) => state.login);
    // add some css here
    const styleComponent = {
      background: "#00000047",
      color: "#fff",
      width: "100%",
      fontSize: 0,
      height: "100%",
      borderRadius: "1%",
      border: "1px solid #cccccc",
      cursor: "pointer",
      backgroundPosition: "center",
      backgroundSize: "cover",
      textAlign: "center",
      padding: "2%",
    };
    const [imageList, SetImageList] = useState([]);

    const Imagechange = (event) => {
      if (event.target.files[0] === "" || event.target.files[0] === undefined)
        return;
      var readers = new FileReader();
      readers.onload = function (e) {
        SetImageList([...imageList, e.target.result]);
      };
      readers.readAsDataURL(event.target.files[0]);

      // upload temp image and bind value to array
      const formdata = new FormData();
      formdata.append("api_token", apiToken);
      formdata.append("fileInfo", event.target.files[0]);
      formdata.append("images_type", 1);
      POST(tempUploadFileUrl, formdata)
        .then((response) => {
          props.imageHandleComp("multiple", "add", response.data.data);
        })
        .catch((error) => {
          Notify(false, error.message);
        });
    };

    const RemoveImage = (index) => {
      const NewList = imageList.filter((image, key) => {
        return key !== index;
      });
      SetImageList(NewList);
      props.imageHandleComp("multiple", "remove", index);
    };

    useEffect(() => {
      SetImageList(props.selectedImageList);
    }, [props.selectedImageList]);

    return (
      <>
        <label
          className={props.label}
          htmlFor={props.label}
          style={styleComponent}
          onDragOver={Imagechange}
        >
          <FeatherIcon icon="film" stroke="grey" size="50" />
        </label>
        <input
          type="file"
          id={props.label}
          ref={ref}
          onChange={Imagechange}
          style={{ display: "none" }}
        />
        <div className="GalleryList">
          {imageList.map((imagepath, index) => (
            <div
              className="imagelistItem"
              style={{ backgroundImage: `url(${imagepath})` }}
              key={index}
            >
              <FeatherIcon
                icon="x-circle"
                stroke="white"
                fill="black"
                size="30"
                style={{ marginLeft: "32%" }}
                onClick={() => RemoveImage(index)}
              />
            </div>
          ))}
        </div>
      </>
    );
  }
);

export const Button = (props) => {
  return (
    <>
      <button {...props}>{props.children}</button>
    </>
  );
};

export const LoaderButton = (props) => {
  const { formLoadStatus, btnName, className } = props;
  return (
    <>
      {!formLoadStatus ? (
        <button className={className}>{btnName}</button>
      ) : (
        <button className={className} type="button" disabled>
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          Loading...
        </button>
      )}
    </>
  );
};

function UIElement() {
  return <></>;
}

export default UIElement;
