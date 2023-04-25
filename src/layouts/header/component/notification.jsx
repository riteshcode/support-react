import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import FeatherIcon from "feather-icons-react";
import POST from "axios/post";
import { Image, Anchor } from "component/UIElement/UIElement";
import { notificationUrl, notificationReadStatusUrl } from "config";
import Moment from "react-moment";

function Notification() {
  const [notificationList, SetnotificationList] = useState([]);
  const [notificationCount, SetNotificationCount] = useState(0);
  const { apiToken } = useSelector((state) => state.login);

  const getUnreadNotificationInfo = () => {
    const formData = {
      api_token: apiToken,
    };

    POST(notificationUrl, formData)
      .then((response) => {
        const { status, data, message } = response.data;

        if (status) {
          SetnotificationList(data);
          SetNotificationCount(data.length);
        } else alert(message);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const notificationData = (notification_user_id) => {
    const formData = {
      api_token: apiToken,
      notification_user_id: notification_user_id,
    };
    POST(notificationReadStatusUrl, formData)
      .then((response) => {
        const { status, message } = response.data;
        if (status) getUnreadNotificationInfo();
        else alert(message);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  useEffect(() => {
    getUnreadNotificationInfo();
    return () => {
      getUnreadNotificationInfo();
    };
  }, []);

  const [DropShow, SetDropShow] = useState(false);
  const showDropdown = (e) => {
    e.preventDefault();
    SetDropShow(true);
  };

  return (
    <>
      <div className="dropdown dropdown-notification">
        <a
          href="/"
          onClick={showDropdown}
          onMouseEnter={showDropdown}
          className="dropdown-link new-indicator"
          data-toggle="dropdown"
        >
          <FeatherIcon icon="bell" fill="white" />
          <span>{notificationCount}</span>
        </a>
        {DropShow && (
          <>
            <div
              className="dropdown-menu dropdown-menu-right dropdown-notification-sub"
              style={{ display: "block" }}
              onMouseLeave={() => {
                SetDropShow(false);
              }}
            >
              <div className="dropdown-header">Notifications</div>
              {notificationList.length > 0 &&
                notificationList.map((data, idx) => {
                  return (
                    <Anchor path="/" className="dropdown-item" key={idx}>
                      <div className="media">
                        <div className="avatar avatar-sm avatar-online">
                          <Image
                            src="https://via.placeholder.com/350"
                            className="rounded-circle"
                            alt=""
                          />
                        </div>
                        <div className="media-body mg-l-15">
                          <p
                            onClick={(e) => {
                              e.preventDefault();
                              notificationData(data.notification_user_id);
                            }}
                          >
                            {data.message.n_title}
                            <br></br>
                            <strong>{data.message.n_message}</strong> <br></br>
                            <span>
                              <Moment parse="YYYY-MM-DD HH:mm">
                                {data.message.created_at}
                              </Moment>
                            </span>
                          </p>
                        </div>
                      </div>
                    </Anchor>
                  );
                })}
              <div className="dropdown-footer">
                <Anchor path="/">View all Notifications</Anchor>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Notification;
