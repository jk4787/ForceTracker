import React from "react";
import debug from "sabio-debug";

const _logger = debug.extend("ConfirmUser");

const ConfirmError = (props) => {
  _logger("ConfirmSuccess: props", props);

  return (
    <React.Fragment>
      <h1 className="display-3">
        <strong>UH OH!</strong>
      </h1>
      <p className="lead">
        <h3>
          Something went wrong with verifying your account. Please contact
          customer support for assistance.
        </h3>
      </p>
    </React.Fragment>
  );
};

export default ConfirmError;
