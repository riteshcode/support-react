import React from "react";
import ReactToPrint from "react-to-print";
import FeatherIcon from "feather-icons-react";

class ExportPrint extends React.Component {
  render() {
    return (
      <div>
        <ReactToPrint
          trigger={() => (
            <a href="!">
              <FeatherIcon icon="printer" fill="#fff" /> Print
            </a>
          )}
          content={() => this.componentRef}
        />
      </div>
    );
  }
}

export default ExportPrint;
