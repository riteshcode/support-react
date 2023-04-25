import React from "react";
import { Col } from "component/UIElement/UIElement";
import { Trans } from "lang/index";
import { useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import EnquiryDetails from "./EnquiryDetails";
import FeatherIcon from "feather-icons-react";

function Table({ dataList }) {
  const { language } = useSelector((state) => state.login);
  const [currentItem, setcurrentItem] = React.useState([]);
  const [ImportLeadModalShow, SetImportLeadModalShow] = React.useState(false);

  return (
    <React.Fragment>
      <Col col={12}>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>{Trans("SL_NO", language)}</th>
                <th>{Trans("ENQUIRY_NO", language)}</th>
                <th>{Trans("CUSTOMER_NAME", language)}</th>
                <th>{Trans("CUSTOMER_EMAIL", language)}</th>
                <th>{Trans("SUBJECT", language)}</th>
                <th className="text-center">{Trans("ACTION", language)}</th>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 &&
                dataList.map((cat, idx) => {
                  const {
                    enquiry_no,
                    email_address,
                    customers_name,
                    subject,
                    message,
                  } = cat;
                  console.log("cat", cat);
                  idx++;
                  return (
                    <React.Fragment key={idx}>
                      <tr>
                        <td>{idx}</td>
                        <td>
                          <a
                            href="#!"
                            onClick={(e) => {
                              e.preventDefault();
                              setcurrentItem(cat);
                              SetImportLeadModalShow(true);
                            }}
                          >
                            {enquiry_no}
                          </a>
                        </td>
                        <td>{customers_name}</td>
                        <td>{email_address}</td>
                        <td>{subject}</td>
                        <td className="text-center">
                          <a
                            href="#!"
                            onClick={(e) => {
                              e.preventDefault();
                              setcurrentItem(cat);
                              SetImportLeadModalShow(true);
                            }}
                            className="btn btn-info btn-xs btn-icon"
                          >
                            <FeatherIcon icon="eye" />
                          </a>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Col>
      {/* IMPORT modal */}
      <Modal
        show={ImportLeadModalShow}
        onHide={() => SetImportLeadModalShow(false)}
      >
        <Modal.Header>
          <Modal.Title>{Trans("ENQUIRY_DETAILS", language)}</Modal.Title>
          <Button
            variant="danger"
            onClick={() => SetImportLeadModalShow(false)}
          >
            X
          </Button>
        </Modal.Header>
        <Modal.Body>
          <EnquiryDetails enquiryDetails={currentItem} />
        </Modal.Body>
      </Modal>
      {/* IMPORT end modal */}
    </React.Fragment>
  );
}

export default Table;
