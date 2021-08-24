import React from "react";
import { confirm } from "../../../services/userServices";
import queryString from "query-string";
import PropTypes from "prop-types";
import ConfirmSuccess from "./ConfirmSuccess";
import ConfirmError from "./ConfirmError";
import { Col, Row } from "reactstrap";

class ConfirmUser extends React.Component {
  state = {
    isConfirmed: false,
    isError: false,
  };

  componentDidMount() {
    if (this.props.location && this.props.location.search) {
      this.handleConfirm();
    }
  }

  redirectToLogin = () => {
    this.props.history.push("/login");
  };

  timedRedirectToLogin = () => {
    setTimeout(() => this.props.history.push("/login"), 8000);
  };

  getQueryParams = () => {
    return queryString.parse(this.props.location.search);
  };

  handleConfirm = () => {
    let query = this.getQueryParams();
    let token = query ? query.token : null;
    confirm(token).then(this.onConfirmSuccess).catch(this.onConfirmError);
  };

  onConfirmSuccess = () => {
    this.setState((prevState) => {
      return { ...prevState, isConfirmed: true, isLoaded: true };
    }, this.timedRedirectToLogin());
  };

  onConfirmError = () => {
    this.setState((prevState) => {
      return { ...prevState, isError: true, isLoaded: true };
    });
  };

  render() {
    return (
      <div className="jumbotron text-center">
        <Row>
          <Col>
            {!this.state.isConfirmed && !this.state.isError && (
              <div style={{ height: "175px" }}></div>
            )}
            {this.state.isConfirmed && (
              <ConfirmSuccess redirectToLogin={this.redirectToLogin} />
            )}
            {this.state.isError && <ConfirmError />}
            <hr />
            <p>
              Having trouble? <a href="/register">Contact us</a>
            </p>
          </Col>
        </Row>
      </div>
    );
  }
}

ConfirmUser.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
};

export default ConfirmUser;
