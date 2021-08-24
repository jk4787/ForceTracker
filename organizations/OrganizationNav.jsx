import React from "react";
import PropTypes from "prop-types";

const OrganizationNav = (props) => {
  const handleAdd = () => {
    props.redirectToNew();
  };

  return (
    <div className="app-main__inner p-0">
      <div className="app-inner-layout chat-layout">
        <div className="app-inner-layout__header text-white bg-alternate">
          <div className="app-page-title">
            <div className="page-title-wrapper">
              <div className="page-title-heading">
                <div className="page-title-icon bg-happy-fisher">
                  <i className="pe-7s-folder text-white"></i>
                </div>
                <div>
                  Organizations
                  <div className="page-title-subheading">
                    Organization Listing
                  </div>
                </div>
              </div>
              <div className="page-title-actions">
                <button
                  className="ladda-button btn btn-pill btn-wide btn-alternate"
                  onClick={handleAdd}
                  data-style="expand-right"
                >
                  <i className="pe-7s-plus mr-2"> </i>
                  <span className="ladda-label">Add Organization</span>
                  <span className="ladda-spinner"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

OrganizationNav.propTypes = {
  redirectToNew: PropTypes.func,
};

export default OrganizationNav;
