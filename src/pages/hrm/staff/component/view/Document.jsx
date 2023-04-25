import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import FeatherIcon from "feather-icons-react";

function Document({ EditData }) {
  const [DocumentData, SetDocumentData] = useState([]);
  console.log("Context staffDetails", DocumentData);

  useEffect(() => {
    SetDocumentData(EditData.staff_document);
  }, [EditData.staff_document]);
  return (
    <div className="card mg-b-20 mg-lg-b-25">
      <div className="card-header pd-y-15 pd-x-20 d-flex align-items-center justify-content-between">
        <h6 className="tx-uppercase tx-semibold mg-b-0">Document</h6>
      </div>
      <div className="card-body pd-25">
        <div className="row row-xxs">
          {DocumentData &&
            DocumentData.map((doc, idx) => {
              const { document_file, document_file_name, document_file_type } =
                doc;
              return (
                <div className="col-2" key={idx}>
                  <a
                    href={document_file}
                    download={true}
                    target="_blank"
                    className="d-block"
                    rel="noreferrer"
                    title={document_file_name}
                  >
                    {document_file_name && (
                      <>
                        {document_file_type === "image" ? (
                          <img
                            src={document_file}
                            className="img-fit-cover"
                            alt={document_file_name}
                          />
                        ) : (
                          <div className="documentPreview">
                            <p>
                              <FeatherIcon icon="file-text" size={40} />
                              {document_file_name}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </a>
                </div>
              );
            })}
        </div>
      </div>
      <div className="card-footer bg-transparent pd-y-15 pd-x-20">
        <nav className="nav nav-with-icon tx-13">
          <a href="#!" className="nav-link">
            Show More (2)
            <i data-feather="chevron-down" className="mg-l-2 mg-r-0 mg-t-2"></i>
          </a>
        </nav>
      </div>
    </div>
  );
}

export default Document;
