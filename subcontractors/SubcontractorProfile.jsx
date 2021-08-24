import React from "react";
import PropTypes from "prop-types";
//import SubcontractorExpertise from "./SubcontractorExpertise";
import { Collapse } from "reactstrap";
//import { getSubById } from "../../services/subcontractorServices";
//import Swal from "sweetalert2";

class SubcontractorProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.location.state.id,
      firstName: this.props.location.state.userProfile.firstName,
      mi: this.props.location.state.userProfile.mi,
      lastName: this.props.location.state.userProfile.lastName,
      //expertise: this.props.location.state.expertise,
      avatarUrl: this.props.location.state.userProfile.avatarUrl,
      phone: this.props.location.state.phone,
      lineOne: this.props.location.state.location.lineOne,
      lineTwo: this.props.location.state.location.lineTwo,
      city: this.props.location.state.location.city,
      state: this.props.location.state.state,
      zip: this.props.location.state.location.zip,
      name: this.props.location.state.name,
      siteUrl: this.props.location.state.siteUrl,
      industryType: this.props.location.state.industryType,
      locationOpen: true,
      generalOpen: true,
      //expertiseOpen: true,
      //licenseOpen: true,
    };
  }

  toggleLocation = () =>
    this.setState((prevState) => ({ locationOpen: !prevState.locationOpen }));
  toggleGeneral = () => {
    this.setState((prevState) => ({ generalOpen: !prevState.generalOpen }));
  };
  toggleExpertise = () => {
    this.setState((prevState) => ({ expertiseOpen: !prevState.expertiseOpen }));
  };
  toggleLicense = () => {
    this.setState((prevState) => ({ licenseOpen: !prevState.licenseOpen }));
  };

  //put that info in here

  render() {
    return (
      <React.Fragment>
        <div className="app-main__inner p-0">
          <div className="app-inner-layout chat-layout">
            <div className="app-inner-layout__header text-white bg-premium-dark">
              <div className="app-page-title">
                <div className="page-title-wrapper">
                  <div className="page-title-heading">
                    <div className="avatar-icon-wrapper mr-3 avatar-icon-xl btn-hover-shine">
                      <div className="avatar-icon rounded">
                        <img
                          alt="avatar"
                          src={this.state.avatarUrl && this.state.avatarUrl}
                        />
                      </div>
                    </div>
                    <div>
                      {this.state.firstName} {this.state.lastName}
                      <div className="page-title-subheading">
                        {this.state.phone}
                      </div>
                    </div>
                  </div>
                  <div className="page-title-actions">
                    <button
                      className="ladda-button btn btn-pill btn-wide btn-success"
                      data-style="expand-right"
                      //onClick={this.editSubcontractor}
                      // onClick={() =>
                      //   this.props.history.push(
                      //     `/subcontractors/${this.state.id}/edit/`
                      //   )
                      // }
                      type="submit"
                    >
                      <span className="ladda-label">Edit Profile</span>
                      <span className="ladda-spinner" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="app-inner-layout__wrapper row-fluid no-gutters">
              <div className="app-inner-layout__sidebar bg-transparent card">
                <div className="p-3">
                  <h3>Profile Details</h3>
                </div>
              </div>
              <div className="col-md-12 app-inner-layout__content card">
                <div className="pb-5 pl-5 pr-5 pt-3">
                  <div className="mobile-app-menu-btn mb-3">
                    <button
                      type="button"
                      className="hamburger hamburger--elastic"
                    >
                      <span className="hamburger-box">
                        <span className="hamburger-inner" />
                      </span>
                    </button>
                  </div>
                  <div className="tab-content">
                    <div className="tab-pane show active" id="tab-faq-1">
                      <div id="accordion" className="accordion-wrapper mb-3">
                        <div className="card">
                          <div id="headingOne" className="card-header">
                            <button
                              type="button"
                              data-toggle="collapse"
                              id="locationOpen"
                              data-target="#collapseOne1"
                              aria-expanded="false"
                              aria-controls="collapseOne"
                              className="text-left m-0 p-0 btn btn-link btn-block collapsed"
                              onClick={this.toggleLocation}
                            >
                              <h5 className="m-0 p-0">Name & Address</h5>
                            </button>
                          </div>
                          <Collapse isOpen={this.state.locationOpen}>
                            <div className="card-body">
                              <h5>
                                {this.state.firstName} {this.state.lastName}
                              </h5>
                              <h6>{this.state.lineOne}</h6>
                              <h6>{this.state.lineTwo}</h6>
                              <h6>
                                {this.state.city}, {this.state.state}{" "}
                                {this.state.zip}
                              </h6>
                            </div>
                          </Collapse>
                        </div>
                        <div className="card">
                          <div
                            id="headingTwo"
                            className="b-radius-0 card-header"
                          >
                            <button
                              type="button"
                              data-toggle="collapse"
                              data-target="#collapseOne2"
                              aria-expanded="false"
                              aria-controls="collapseTwo"
                              className="text-left m-0 p-0 btn btn-link btn-block collapsed"
                              id="generalOpen"
                              onClick={this.toggleGeneral}
                            >
                              <h5 className="m-0 p-0">
                                Subcontractor Company Details (If applicable)
                              </h5>
                            </button>
                          </div>
                          <Collapse isOpen={this.state.generalOpen}>
                            <div className="card-body">
                              <h5>{this.state.name}</h5>
                              <h6>{this.state.siteUrl}</h6>
                              <h6>{this.state.phone}</h6>
                              <h6>{this.state.industryType}</h6>
                            </div>
                          </Collapse>
                        </div>
                        {/* //code below commented out but will be used ---> */}
                        {/* <div className="card">
                          <div id="headingThree" className="card-header">
                            <button
                              type="button"
                              data-toggle="collapse"
                              id="expertiseOpen"
                              data-target="#collapseOne3"
                              aria-expanded="false"
                              aria-controls="collapseThree"
                              className="text-left m-0 p-0 btn btn-link btn-block collapsed"
                              onClick={this.toggleExpertise}
                            >
                              <h5 className="m-0 p-0">Expertise</h5>
                            </button>
                          </div>
                          <Collapse isOpen={this.state.expertiseOpen}>
                            <div className="card-body">
                              <h6>
                                Hard-coded values: Heating, cooling, plumbing
                              </h6>
                            </div>
                          </Collapse>
                        </div>
                        <div className="card">
                          <div id="headingFour" className="card-header">
                            <button
                              type="button"
                              data-toggle="collapse"
                              id="licenseOpen"
                              data-target="#collapseOne3"
                              aria-expanded="false"
                              aria-controls="collapseThree"
                              className="text-left m-0 p-0 btn btn-link btn-block collapsed"
                              onClick={this.toggleLicense}
                            >
                              <h5 className="m-0 p-0">License(s)</h5>
                            </button>
                          </div>
                          <Collapse isOpen={this.state.licenseOpen}>
                            <div className="card-body">
                              <h6>
                                Hard-coded values: HVAC, Ohio, expires: January,
                                23, 2028
                              </h6>
                            </div>
                          </Collapse>
                        </div> */}
                      </div>
                      {/* //End of profile divs */}
                      <div className="mt-5" />
                      <div className="clearfix">
                        <div className="text-center">
                          <button
                            type="button"
                            className="btn-pill btn-wide btn-shadow btn btn-primary btn-lg"
                          >
                            Button
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

SubcontractorProfile.propTypes = {
  //   subcontractor: PropTypes.shape({
  //     id: PropTypes.number,
  //   }),
  history: PropTypes.string,
  editSubcontractor: PropTypes.func,
  push: PropTypes.string,

  location: PropTypes.shape({
    state: PropTypes.shape({
      location: PropTypes.shape({
        lineOne: PropTypes.string,
        lineTwo: PropTypes.string,
        city: PropTypes.string,
        zip: PropTypes.string,
      }),
      userProfile: PropTypes.shape({
        avatarUrl: PropTypes.string,
        firstName: PropTypes.string,
        mi: PropTypes.string,
        lastName: PropTypes.string,
      }),
      id: PropTypes.number,
      firstName: PropTypes.string,
      mi: PropTypes.string,
      lastName: PropTypes.string,
      avatarUrl: PropTypes.string,
      phone: PropTypes.string,
      lineOne: PropTypes.string,
      lineTwo: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      zip: PropTypes.string,
      name: PropTypes.string,
      siteUrl: PropTypes.string,
      industryType: PropTypes.string,
      history: PropTypes.string,
      push: PropTypes.string,
      expertise: PropTypes.shape({
        expertise: PropTypes.string,
        map: PropTypes.func,
      }),
    }),
  }),
};

export default SubcontractorProfile;
