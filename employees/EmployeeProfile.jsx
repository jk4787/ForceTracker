import React from "react";
import PropTypes from "prop-types";

import { Collapse } from "reactstrap";

class EmployeeProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lineOne: this.props.location.state.location.lineOne,
      lineTwo: this.props.location.state.location.lineTwo,
      city: this.props.location.state.location.city,
      state: this.props.location.state.location.state,
      zip: this.props.location.state.location.zip,

      firstName: this.props.location.state.firstName,
      mi: this.props.location.state.mi,
      lastName: this.props.location.state.lastName,
      //email: "",

      organizationId: this.props.location.state.organizationId,
      phone: this.props.location.state.phone,
      dob: this.props.location.state.dob,
      salaryTypeId: this.props.location.state.salaryTypeId,
      position: this.props.location.state.position,
      departmentId: this.props.location.state.departmentId,
      supervisor: this.props.location.state.supervisor,
      startDate: this.props.location.state.startDate,
      endDate: this.props.location.state.endDate,
      avatarUrl: this.props.location.state.avatarUrl,
      locationOpen: true,
      affiliationOpen: true,
      contactInfoOpen: true,
    };
  }

  toggleLocation = () => {
    this.setState((prevState) => ({
      locationOpen: !prevState.locationOpen,
    }));
  };

  toggleAffiliation = () => {
    this.setState((prevState) => ({
      affiliationOpen: !prevState.affiliationOpen,
    }));
  };

  toggleContactInfo = () => {
    this.setState((prevState) => ({
      contactInfoOpen: !prevState.contactInfoOpen,
    }));
  };

  // handleEditClick = (employee) => {
  //   this.props.history.push(`/employees/${employee.id}/edit`, employee);
  // };

  render() {
    return (
      <React.Fragment>
        <div className="app-inner-layout__header">
          <div className="app-page-title">
            <div className="page-title-wrapper">
              <div className="page-title-heading">
                <div className="avatar-icon-wrapper mr-3 avatar-icon-xl btn-hover-shine">
                  <div className="avatar-icon rounded">
                    <img src={this.state.avatarUrl} alt="" />
                  </div>
                </div>
                <div>
                  <div>
                    {this.state.firstName} {this.state.lastName}
                  </div>
                  <div className="page-title-subheading">Employee Profile</div>
                </div>
              </div>
              <div className="page-title-actions">
                <button
                  disable={true}
                  className="ladda-button btn btn-pill btn-wide btn-alternate"
                  data-style="expand-right"
                  onClick={this.handleEditClick}
                  type="submit"
                >
                  <span className="ladda-label">Edit Profile</span>
                  <span className="ladda-spinner"></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div id="accordion" className="accordion-wrapper mb-3">
          <div className="card">
            <div className="card-header">
              <button
                type="button"
                data-toggle="collapse"
                data-target="#collapseOne1"
                aria-expanded="false"
                aria-controls="collapseOne"
                className="text-left m-0 p-0 btn btn-link btn-block"
                onClick={this.toggleLocation}
              >
                {" "}
                <h5 className="m-0 p-0">Employee Address</h5>
              </button>
            </div>
            <Collapse isOpen={this.state.locationOpen}>
              <div className="card-body">
                <h6>{this.state.lineOne}</h6>
                <h6>{this.state.lineTwo}</h6>
                <h6>
                  {this.state.city}, {this.state.state} {this.state.zip}
                </h6>
              </div>
            </Collapse>
          </div>
          <div className="card">
            <div id="headingTwo" className="b-radius-0 card-header">
              <button
                type="button"
                data-toggle="collapse"
                data-target="#collapseOne2"
                aria-expanded="false"
                aria-controls="collapseTwo"
                className="text-left m-0 p-0 btn btn-link btn-block collapsed"
                onClick={this.toggleAffiliation}
              >
                <h5 className="m-0 p-0">Employee Affiliation</h5>
              </button>
            </div>

            <Collapse isOpen={this.state.affiliationOpen}>
              <div className="card-body">
                <h6>
                  <b>Organization Id: </b> {this.state.organizationId}
                </h6>
                <h6>
                  <b>Department: </b> {this.state.departmentId}
                </h6>
                <h6>
                  <b>Position: </b> {this.state.position}
                </h6>
                <h6>
                  <b>Supervisor: </b> {this.state.supervisor}
                </h6>
              </div>
            </Collapse>
          </div>
          <div className="card">
            <div id="headingThree" className="card-header">
              <button
                type="button"
                data-toggle="collapse"
                data-target="#collapseOne3"
                aria-expanded="false"
                aria-controls="collapseThree"
                className="text-left m-0 p-0 btn btn-link btn-block collapsed"
                onClick={this.toggleContactInfo}
              >
                <h5 className="m-0 p-0">Contact Info</h5>
              </button>
            </div>
            <Collapse isOpen={this.state.contactInfoOpen}>
              <div className="card-body">
                <h6>
                  <b>Phone Number: </b>
                  {this.state.phone}
                </h6>
                {/* <h6>{this.state.email}</h6> */}

                <h6>
                  <b>Start Date: </b>
                  {this.state.startDate}
                </h6>
              </div>
            </Collapse>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

EmployeeProfile.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  location: PropTypes.shape({
    state: PropTypes.shape({
      lineOne: PropTypes.string,
      location: PropTypes.shape({
        lineOne: PropTypes.string,
        lineTwo: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        zip: PropTypes.string,
      }),

      firstName: PropTypes.string,
      mi: PropTypes.string,
      lastName: PropTypes.string,
      organizationId: PropTypes.number,
      phone: PropTypes.string,
      dob: PropTypes.string,
      salaryTypeId: PropTypes.number,
      position: PropTypes.string,
      departmentId: PropTypes.number,
      supervisor: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      avatarUrl: PropTypes.string,
    }),
  }),
};

export default EmployeeProfile;
