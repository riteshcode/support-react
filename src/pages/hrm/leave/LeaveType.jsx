import React, { useState, useEffect } from "react";
import { Trans } from "lang/index";
import POST from "axios/post";
import { useSelector } from "react-redux";
import { leaveTypeUrl, leaveTypeEditUrl } from "config";
import { Modal, Button } from "react-bootstrap";
import AddLeaveType from "./AddLeaveType";
import EditLeaveType from "./EditLeaveType";

export default function LeaveType() {
  const { apiToken, language } = useSelector((state) => state.login);

  const [leaveInfo, setLeaveInfo] = useState([]);

  const getList = () => {
    const filterData = {
      api_token: apiToken,
    };
    POST(leaveTypeUrl, filterData)
      .then((response) => {
        console.log(response);
        const { status, data, message } = response.data;
        if (status) {
          setLeaveInfo(data);
        } else alert(message);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };
  useEffect(() => {
    getList();
    return () => {
      getList();
    };
  }, []);

  const [show, setShow] = useState(false);
  const handleModalClose = () => setShow(false);
  const handleModalShow = () => setShow(true);

  const [editModalShow, setEditModalShow] = useState(false);
  const handleEditModalClose = () => setEditModalShow(false);
  const [editData, SetEditData] = useState();

  const editFun = (updateId) => {
    const editData = {
      api_token: apiToken,
      updateId: updateId,
    };
    POST(leaveTypeEditUrl, editData)
      .then((response) => {
        const { data } = response.data;
        console.log(data);
        SetEditData(data);
        setEditModalShow(true);
      })
      .catch((error) => {
        console.log(error);
        alert(error.message);
      });
  };
  return (
    <>
      <div className="row row-xs">
        <div className="col-sm-6 col-lg-3" onClick={handleModalShow}>
          <div
            className="card card-body"
            style={{ border: "2px dashed", borderColor: "grey" }}
          >
            <div className="d-flex d-lg-block d-xl-flex align-items-end">
              <h6
                className="tx-normal tx-rubik mg-b-0 mg-r-5 lh-1 text-center"
                style={{ margin: "12%" }}
              >
                {Trans("ADD_LEAVE_TYPE", language)}
              </h6>
            </div>
          </div>
        </div>
        {leaveInfo &&
          leaveInfo.map((leave, idx) => {
            return (
              <div className="col-sm-6 col-lg-3" key={idx}>
                <div className="card card-body">
                  <h6 className="tx-uppercase tx-11 tx-spacing-1 tx-color-02 tx-semibold mg-b-8">
                    {leave.name}
                  </h6>
                  <div className="d-flex d-lg-block d-xl-flex align-items-end">
                    <h3 className="tx-normal tx-rubik mg-b-0 mg-r-5 lh-1">
                      {leave.no_of_days}
                    </h3>
                  </div>
                  <div className="chart-three">
                    <span>Days</span>
                    <div
                      id="flotChart3"
                      className="flot-chart ht-30"
                      style={{ float: "right" }}
                    >
                      <button
                        className="btn btn-primary"
                        onClick={() => editFun(leave.leave_type_id)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {/* edit leave application modal */}
      <Modal show={show} onHide={handleModalClose}>
        <Modal.Header>
          <Modal.Title>{Trans("ADD_LEAVE_TYPE", language)}</Modal.Title>
          <Button variant="danger" onClick={handleModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <AddLeaveType handleModalClose={handleModalClose} getList={getList} />
        </Modal.Body>
      </Modal>
      {/* end end modal */}
      {/* edit leave application modal */}
      <Modal show={editModalShow} onHide={handleEditModalClose}>
        <Modal.Header>
          <Modal.Title>{Trans("UPDATE_LEAVE_TYPE", language)}</Modal.Title>
          <Button variant="danger" onClick={handleEditModalClose}>
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <EditLeaveType
            editData={editData}
            handleModalClose={handleEditModalClose}
            getList={getList}
          />
        </Modal.Body>
      </Modal>
      {/* end end modal */}
    </>
  );
}
