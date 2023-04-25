import React, { useState } from "react";
import FeatherIcon from "feather-icons-react";
function Messages() {
  const [DropShow, SetDropShow] = useState(false);
  const showDropdown = (e) => {
    e.preventDefault();
    SetDropShow(true);
  };
  return (
    <>
      <div className="dropdown dropdown-message">
        <a
          href="/"
          onClick={showDropdown}
          onMouseEnter={showDropdown}
          className="dropdown-link new-indicator"
          data-toggle="dropdown"
        >
          <FeatherIcon icon="message-square" fill="white" />
          <span>5</span>
        </a>
        {DropShow && (
          <>
            <div
              className="dropdown-menu dropdown-menu-right dropdown-message-sub"
              style={{ display: "block" }}
              onMouseLeave={() => {
                SetDropShow(false);
              }}
            >
              <div className="dropdown-header">New Messages</div>
              <a href="/" className="dropdown-item">
                <div className="media">
                  <div className="avatar avatar-sm avatar-online">
                    <img
                      src="../https://via.placeholder.com/350"
                      className="rounded-circle"
                      alt=""
                    />
                  </div>
                  <div className="media-body mg-l-15">
                    <strong>Socrates Itumay</strong>
                    <p>nam libero tempore cum so...</p>
                    <span>Mar 15 12:32pm</span>
                  </div>
                </div>
              </a>
              <div className="dropdown-footer">
                <a href="/">View all Messages</a>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Messages;
