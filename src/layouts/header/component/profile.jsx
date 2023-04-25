import React, { useState } from "react";
import FeatherIcon from "feather-icons-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutState } from "redux/slice/loginSlice";
import { Anchor } from "component/UIElement/UIElement";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, role, isAuthenticated } = useSelector((state) => state.login);
  /* logout function */
  const logoutUser = () => {
    dispatch(logoutState());
    navigate("/login");
  };

  const [DropShow, SetDropShow] = useState(false);
  const showDropdown = (e) => {
    e.preventDefault();
    SetDropShow(true);
  };
  return (
    <>
      <div className="dropdown dropdown-profile">
        <a
          href="/"
          className="dropdown-link"
          data-toggle="dropdown"
          data-display="static"
          onClick={showDropdown}
          onMouseEnter={showDropdown}
        >
          <div className="avatar avatar-sm">
            <img
              src="https://via.placeholder.com/500"
              className="rounded-circle"
              alt=""
            />
          </div>
        </a>
        {DropShow && (
          <>
            <div
              className="dropdown-menu dropdown-menu-right dropdown-profile-sub tx-13"
              style={{ display: "block" }}
              onMouseLeave={() => {
                SetDropShow(false);
              }}
            >
              <div className="avatar avatar-lg mg-b-15">
                <img
                  src="https://via.placeholder.com/500"
                  className="rounded-circle"
                  alt=""
                />
              </div>
              <h6 className="tx-semibold mg-b-5">
                {name === null || name === "" ? "Guest" : name}
              </h6>
              <p className="mg-b-25 tx-12 tx-color-03">
                {role === null ? "Guest" : role}
              </p>
              {isAuthenticated === false ? (
                <Anchor path="/superadmin/login" className="dropdown-item">
                  Sign-in
                </Anchor>
              ) : (
                <>
                  <Anchor
                    path="/superadmin/edit-profile"
                    className="dropdown-item"
                  >
                    <FeatherIcon icon="edit-3" fill="white" />
                    Edit Profile
                  </Anchor>
                  <Anchor
                    path="/superadmin/view-profile"
                    className="dropdown-item"
                  >
                    <FeatherIcon icon="user" fill="white" />
                    View Profile
                  </Anchor>
                  <button className="dropdown-item" onClick={logoutUser}>
                    <FeatherIcon icon="log-out" fill="white" />
                    Logout
                  </button>
                </>
              )}
              <div className="dropdown-divider"></div>
              <Anchor path="/superadmin/help" className="dropdown-item">
                <FeatherIcon icon="help-circle" fill="white" />
                Help Center
              </Anchor>
              <Anchor path="/superadmin/edit-profile" className="dropdown-item">
                <FeatherIcon icon="life-buoy" fill="white" />
                Forum
              </Anchor>
              <Anchor path="/superadmin/setting" className="dropdown-item">
                <FeatherIcon icon="settings" fill="white" />
                Account Settings
              </Anchor>
              <Anchor
                path="/superadmin/setting/privacy"
                className="dropdown-item"
              >
                <FeatherIcon icon="settings" fill="white" />
                Privacy Settings
              </Anchor>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Profile;
