import React from "react";
import PropTypes from "prop-types";

const EmployeeCard = (props) => {
  const handleEditClick = () => {
    props.redirectToEdit(props.employee);
  };

  const handleProfileClick = () => {
    props.redirectToProfile(props.employee);
  };

  return (
    <div className="col-md-4">
      <div className="card-hover-shadow card-border mr-3 mb-3 profile-responsive card">
        <div className="dropdown-menu-header">
          <div className="dropdown-menu-header-inner bg-warning">
            <div className="menu-header-content">
              <div>
                <a
                  //href="javascript:void(0);"
                  className="avatar-icon-wrapper btn-hover-shine avatar-icon-xl"
                >
                  <div className="avatar-icon rounded">
                    <img
                      src={props.employee.avatarUrl}
                      alt={props.employee.firstName}
                    />
                  </div>
                </a>
              </div>
              <div>
                <h5 className="menu-header-title">
                  {props.employee.firstName} {props.employee.lastName}
                </h5>
                <h6 className="menu-header-subtitle">
                  ID: {props.employee.id}
                </h6>
              </div>
              <div className="menu-header-btn-pane">
                <button
                  className="mr-2 btn btn-dark btn-md"
                  onClick={handleProfileClick}
                >
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="text-center">
            <h5 className="widget-heading mb-0 opacity-10">
              <b>Department: </b>
              {props.employee.department}
              <br />
              <b>Position: </b> {props.employee.position}
              <br />
              <b>Supervisor: </b> {props.employee.supervisor}
            </h5>
          </div>
        </div>
        <div className="d-block text-right card-footer">
          <button
            className="btn-shadow-primary btn btn-primary btn-lg"
            onClick={handleEditClick}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

EmployeeCard.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  employee: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    avatarUrl: PropTypes.string,
    department: PropTypes.PropTypes.string.isRequired,
    position: PropTypes.string,
    supervisor: PropTypes.string,

    // IsActive: PropTypes.bool.isRequired,
  }),
  redirectToEdit: PropTypes.func.isRequired,
  redirectToProfile: PropTypes.func.isRequired,
};

export default EmployeeCard;
