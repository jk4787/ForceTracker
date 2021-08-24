import React from "react";
import PropTypes from "prop-types";
// import { Row, Col, Container } from "reactstrap";

//const _logger = debug.extend("OrganizationForm");

const OrganizationCard = (props) => {
  const handleEdit = () => {
    props.redirectToEdit(props.currentOrganization);
  };

  const handleDetails = () => {
    props.redirectToDetails(props.currentOrganization);
  };

  return (
    <div className="col-md-4">
      <div className="card-hover-shadow card-border mr-3 mb-3 card">
        <div className="dropdown-menu-header">
          <div className="dropdown-menu-header-inner bg-primary">
            <div className="menu-header-content">
              <div>
                <a className="avatar-icon-wrapper btn-hover-shine avatar-icon-xl">
                  <div className="avatar-icon rounded">
                    <img
                      src={
                        props.currentOrganization.logo
                          ? props.currentOrganization.logo
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSkvABiseEakv174TAY6aJGMeBVbHDc2HbV9DlV4P0aa8Em9ndo&usqp=CAU"
                      }
                      alt="No Pic"
                    />
                  </div>
                </a>
              </div>
              <div>
                <h5 className="menu-header-title">
                  {props.currentOrganization.name}
                </h5>
              </div>
            </div>
          </div>
        </div>
        <li className="p-0 list-group-item">
          <div className="grid-menu grid-menu-2col">
            <div className="no-gutters row">
              <div className="col-sm-6">
                <button className="btn-icon-vertical btn-square btn-transition btn btn-outline-link">
                  <a
                    className="lnr-screen btn-icon-wrapper btn-icon-lg mb-3"
                    href={props.currentOrganization.siteUrl}
                  >
                    {" "}
                  </a>
                  View Website
                </button>
              </div>
              <div className="col-sm-6">
                <button
                  className="btn-icon-vertical btn-square btn-transition btn btn-outline-link"
                  onClick={handleEdit}
                >
                  <i className="lnr-pencil btn-icon-wrapper btn-icon-lg mb-3">
                    {" "}
                  </i>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </li>
        <button
          style={{ minHeight: 60 }}
          className="btn-shadow-primary btn btn-primary btn-lg"
          onClick={handleDetails}
        >
          Additional Details
        </button>
      </div>
    </div>
  );
};

OrganizationCard.propTypes = {
  currentOrganization: PropTypes.shape({
    logo: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    siteUrl: PropTypes.string,
    description: PropTypes.string,
    id: PropTypes.number.isRequired,
  }),
  redirectToEdit: PropTypes.func,
  redirectToDetails: PropTypes.func,
  history: PropTypes.shape({ push: PropTypes.func }),
};

export default OrganizationCard;
