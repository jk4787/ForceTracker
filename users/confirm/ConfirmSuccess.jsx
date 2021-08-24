import React from "react";
import debug from "sabio-debug";
import PropTypes from "prop-types";

const _logger = debug.extend("ConfirmUser");

const ConfirmSuccess = (props) => {
  _logger("ConfirmSuccess: props", props);

  return (
    <React.Fragment>
      <h1 className="display-3">
        <strong>THANK YOU!</strong>
      </h1>
      <p className="lead">
        <h3>Hello new Force Tracker user, your account is ready to go</h3>
        <span>
          <div className="loader">
            <div className="ball-beat">
              <div />
              <div />
              <div />
            </div>
          </div>
        </span>
        <strong>You are now being redirected to the login page</strong>
      </p>
      <p className="lead">
        <button
          onClick={props.redirectToLogin}
          className="mb-2 mr-2 btn-hover-shine btn btn-shadow btn-primary"
        >
          Continue to login
        </button>
      </p>
    </React.Fragment>
  );
};

ConfirmSuccess.propTypes = {
  redirectToLogin: PropTypes.func,
};

export default ConfirmSuccess;
