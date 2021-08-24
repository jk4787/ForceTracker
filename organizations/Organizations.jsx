import React from "react";
import debug from "sabio-debug";
import {
  getOrganizations,
  searchOrganizations,
} from "../../services/organizationService";
import OrganizationCard from "./OrganizationCard";
import OrganizationNav from "./OrganizationNav";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

const _logger = debug.extend("Organizations");

class Organizations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      pageSize: 3,
      totalCount: 0,
      query: "",
      organizations: [],
      mappedOrganizations: [],
    };
  }

  componentDidMount() {
    this.getAllOrganizations();
  }

  getAllOrganizations = () => {
    getOrganizations(this.state.current, this.state.pageSize)
      .then(this.onGetOrganizationSuccess)
      .catch(this.onGetOrganizationError);
  };

  onGetOrganizationSuccess = (response) => {
    _logger(response);
    this.setState((prevState) => {
      return {
        ...prevState,
        totalCount: response.item.totalCount,
        organizations: response.item.pagedItems,
        mappedOrganizations: response.item.pagedItems.map(
          this.mapOrganizations
        ),
      };
    });
    _logger(this.state);
  };

  onGetOrganizationError = (response) => {
    _logger(response);
  };

  redirectToEdit = (org) => {
    this.props.history.push(`/organizations/${org.id}/edit`, org);
  };

  redirectToDetails = (org) => {
    this.props.history.push(`/organizations/${org.id}/details`, org);
  };

  mapOrganizations = (organization) => (
    <OrganizationCard
      key={organization.id}
      currentOrganization={organization}
      redirectToEdit={this.redirectToEdit}
      redirectToDetails={this.redirectToDetails}
    />
  );

  changePage = (page) => {
    this.setState((prevState) => {
      let newState = { ...prevState };
      newState.current = page - 1;
      return newState;
    }, this.search());
  };

  handleInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, this.search());
  };

  redirectToNew = () => {
    this.props.history.push("/organizations/create");
  };

  search() {
    return () => {
      if (this.state.query) {
        searchOrganizations(
          this.state.current,
          this.state.pageSize,
          this.state.query
        )
          .then(this.onGetOrganizationSuccess)
          .catch(this.onGetOrganizationError);
      } else {
        getOrganizations(this.state.current, this.state.pageSize)
          .then(this.onGetOrganizationSuccess)
          .catch(this.onGetOrganizationError);
      }
    };
  }

  render() {
    return (
      <React.Fragment>
        <OrganizationNav redirectToNew={this.redirectToNew} />
        <div className="search-wrapper active mb-3 mt-3 float-right">
          <div className="input-holder">
            <input
              type="text"
              name="query"
              value={this.state.query}
              onChange={this.handleInputChange}
              className="search-input"
              placeholder="Type to search"
            />
            <button className="search-icon">
              <span />
            </button>
          </div>
        </div>

        <div className="col-md-12 row">
          <>{this.state.mappedOrganizations}</>
        </div>

        <Pagination
          className="col-lg-5 offset-lg-5 d-flex"
          current={this.state.current + 1}
          total={this.state.totalCount}
          pageSize={this.state.pageSize}
          onChange={this.changePage}
        />
      </React.Fragment>
    );
  }
}

Organizations.propTypes = {
  getOrganizationById: PropTypes.func,
  history: PropTypes.shape({ push: PropTypes.func }),
};

export default withRouter(Organizations);
