import React from "react";
import Header from "./header";
import Footer from "./footer";
function Index(props) {
  return (
    <React.Fragment>
      <Header />
      {props.children}
      <Footer />
    </React.Fragment>
  );
}

export default Index;
