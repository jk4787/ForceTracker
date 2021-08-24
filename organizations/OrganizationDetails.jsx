import React from "react";
import { Collapse } from "reactstrap";
import PropTypes from "prop-types";

class OrganizationDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locationOpen: true,
      generalOpen: true,
    };
  }
  toggleLocation = () =>
    this.setState((prevState) => ({ locationOpen: !prevState.locationOpen }));

  toggleGeneral = () => {
    this.setState((prevState) => ({ generalOpen: !prevState.generalOpen }));
  };

  render() {
    return (
      <React.Fragment>
        <div className="main p-0">
          <div className="app-inner-layout chat-layout">
            <div className="app-inner-layout__header text-white bg-alternate">
              <div className="app-page-title">
                <div className="page-title-wrapper">
                  <div className="page-title-heading">
                    <a className="avatar-icon-wrapper btn-hover-shine avatar-icon-xl">
                      <div className="avatar-icon rounded">
                        <img
                          src={
                            this.props.location.state.logo
                              ? this.props.location.state.logo
                              : "https://jewish.sfsu.edu/sites/default/files/people/images/placeholder-person-300x300_1.jpg"
                          }
                          alt="logo"
                        />
                      </div>
                    </a>
                    <div className="ml-3">
                      {this.props.location.state.name}
                      <div className="page-title-subheading">
                        {this.props.location.state.organizationType.name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="app-inner-layout__wrapper row-fluid no-gutters">
              <div className="app-inner-layout__sidebar bg-transparent card">
                <div className="p-3">
                  <h1>Contact go here</h1>
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
                        <span className="hamburger-inner"></span>
                      </span>
                    </button>
                  </div>
                  <div className="tab-content">
                    <div className="tab-pane active show" id="tab-faq-1">
                      <div id="accordion" className="accordion-wrapper mb-3">
                        <div className="card">
                          <div className="card-header">
                            <button
                              type="button"
                              id="generalOpen"
                              className="text-left m-0 p-0 btn btn-link btn-block"
                              onClick={this.toggleGeneral}
                            >
                              <h5 className="m-0 p-0">Organization Details</h5>
                            </button>
                          </div>
                          <div>
                            <Collapse isOpen={this.state.generalOpen}>
                              <div className="card">
                                <div className="card-body">
                                  <h5 className="card-title">
                                    Organization Description
                                  </h5>
                                  <p>{this.props.location.state.description}</p>
                                </div>
                              </div>
                              <div className="card">
                                <div className="card-body">
                                  <h5 className="card-title">
                                    Business Phone Number
                                  </h5>
                                  <p>
                                    {this.props.location.state.businessPhone}
                                  </p>
                                </div>
                              </div>
                              <div className="card">
                                <div className="card-body">
                                  <h5 className="card-title">
                                    Number of Employees
                                  </h5>
                                  <p>
                                    {this.props.location.state.employeesNumber}
                                  </p>
                                </div>
                              </div>
                            </Collapse>
                          </div>
                        </div>

                        <div className="card">
                          <div className="b-radius-0 card-header">
                            <button
                              type="button"
                              className="text-left m-0 p-0 btn btn-link btn-block"
                              onClick={this.toggleLocation}
                            >
                              <h5 className="m-0 p-0">Primary Location</h5>
                            </button>
                          </div>
                          <div>
                            <Collapse isOpen={this.state.locationOpen}>
                              <div className="card">
                                <div className="card-body">
                                  <h5 className="card-title">
                                    Primary Location
                                  </h5>
                                  <p>
                                    {this.props.location.state.location.lineOne}{" "}
                                    <br />
                                    {
                                      this.props.location.state.location.lineTwo
                                    }{" "}
                                    <br />
                                    {
                                      this.props.location.state.location.city
                                    }{" "}
                                    {this.props.location.state.location.state}{" "}
                                    {this.props.location.state.location.zip}
                                  </p>
                                </div>
                              </div>
                            </Collapse>
                          </div>
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

OrganizationDetails.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      organizationType: PropTypes.shape({ name: PropTypes.string }),
      name: PropTypes.string,
      description: PropTypes.string,
      logo: PropTypes.string,
      businessPhone: PropTypes.string,
      employeesNumber: PropTypes.number,
      location: PropTypes.shape({
        lineOne: PropTypes.string,
        lineTwo: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        zip: PropTypes.string,
      }),
    }),
  }),
};

export default OrganizationDetails;
