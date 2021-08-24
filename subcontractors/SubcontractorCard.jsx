import React from "react";
import propTypes from "prop-types";

const SubcontractorCard = (props) => {
  const onProfileButtonClicked = () => {
    props.subcontractorProfile(props.subcontractor);
  };

  const onDeactiveButtonClicked = () => {
    props.subcontractorStatus(props.subcontractor);
  };

  const onEditButtonClicked = () => {
    props.editSubcontractor(props.subcontractor);
  };

  return (
    <div className="col-sm-12 col-lg-6 col-xl-4 justify-content-between d-inline-flex">
      <div className="mb-3 profile-responsive card">
        <div className="dropdown-menu-header">
          <div className="dropdown-menu-header-inner bg-dark">
            <div
              className="menu-header-image opacity-2"
              style={{
                backgroundImage:
                  'url("assets/images/dropdown-header/abstract2.jpg")',
              }}
            />
            <div className="menu-header-content btn-pane-right">
              <div className="avatar-icon-wrapper mr-3 avatar-icon-xl btn-hover-shine">
                <div className="avatar-icon rounded">
                  <img
                    src={props.subcontractor.userProfile.avatarUrl}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSkvABiseEakv174TAY6aJGMeBVbHDc2HbV9DlV4P0aa8Em9ndo&usqp=CAU";
                    }}
                    alt="No Pic"
                  />
                </div>
              </div>
              <div>
                <h5 className="menu-header-title">
                  {props.subcontractor.userProfile.firstName}{" "}
                  {props.subcontractor.userProfile.lastName}
                </h5>
                <h6 className="menu-header-subtitle">
                  {props.subcontractor.phone}
                </h6>
              </div>
              <div className="menu-header-btn-pane">
                <button
                  className="btn btn-success"
                  onClick={onEditButtonClicked}
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <div className="widget-content pt-1 pl-0 pr-0">
              <div className="text-center">
                <h5 className="widget-heading opacity-8 mb-0">
                  {props.subcontractor.name}
                </h5>
              </div>
            </div>
            <div className="widget-content pt-1 pl-0 pr-0">
              <div className="text-center">
                <h5 className="widget-heading opacity-7 text-success mb-0">
                  {props.subcontractor.siteUrl}
                </h5>
              </div>
            </div>
            <div className="widget-content pt-1 pl-0 pr-0">
              <div className="text-center">
                <h6 className="widget-heading opacity-6 mb-0">
                  {props.subcontractor.industryType}
                </h6>
              </div>
            </div>
          </li>
          <li className="p-0 list-group-item">
            <div className="grid-menu grid-menu-2col">
              <div className="no-gutters row">
                <div className="col-sm-6">
                  <button
                    className="btn-icon-vertical btn-square btn-transition br-bl btn btn-outline-link"
                    onClick={onProfileButtonClicked}
                  >
                    <i className="lnr-license btn-icon-wrapper btn-icon-lg mb-3">
                      {" "}
                    </i>
                    View Profile
                  </button>
                </div>
                <div className="col-sm-6">
                  <button
                    className="btn-icon-vertical btn-square btn-transition br-br btn btn-outline-link"
                    onClick={onDeactiveButtonClicked}
                  >
                    <i className="lnr-cross-circle btn-icon-wrapper btn-icon-lg mb-3">
                      {" "}
                    </i>
                    Inactivate User
                  </button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

SubcontractorCard.propTypes = {
  subcontractor: propTypes.shape({
    userProfile: propTypes.shape({
      avatarUrl: propTypes.string,
      firstName: propTypes.string,
      lastName: propTypes.string,
    }),
    avatarUrl: propTypes.string,
    firstName: propTypes.string,
    lastName: propTypes.string,
    phone: propTypes.string,
    name: propTypes.string,
    id: propTypes.number,
    siteUrl: propTypes.string,
    industryType: propTypes.string,
  }),
  subcontractorProfile: propTypes.func,
  subcontractorStatus: propTypes.func,
  editSubcontractor: propTypes.func,
};

export default SubcontractorCard;
