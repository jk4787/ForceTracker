import React from "react";
import EmployeeCard from "./EmployeeCard";
//import EmployeeProfile from "./EmployeeProfile";
import {
  getEmployees,
  searchEmployees,
  //updateEmployee,
} from "../../services/employeeService";
import PropTypes from "prop-types";
import logger from "sabio-debug";
import Pagination from "rc-pagination";

//import EmployeeForm from "./EmployeeForm";
import("rc-pagination/assets/index.css");
const _logger = logger.extend("PaginatedEmployees");

class Employees extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIndex: 1,
      pageSize: 3,
      totalCount: "",
      totalPages: "",
      query: "",
      pagedItems: [],
      hasPreviousPage: false,
      hasNextPage: true,
    };
  }

  componentDidMount() {
    getEmployees(0, this.state.pageSize)
      .then(this.onGetEmployeesSuccess)
      .catch(this.onGetEmployeesError);
  }

  onGetEmployeesSuccess = (response) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        totalCount: response.item.totalCount,
        employees: response.item.pagedItems,
        mappedEmployees: response.item.pagedItems.map(this.mapEmployees),
      };
    });
  };

  onGetEmployeesError = (response) => {
    return response;
  };

  handleSearchChange = (e) => {
    const query = e.target.value;
    this.setState({ query }, () => {
      if (query) {
        searchEmployees(
          this.state.pageIndex - 1,
          this.state.pageSize,
          this.state.query
        )
          .then(this.onGetEmployeesSuccess)
          .catch(this.onGetEmployeesError);
      } else {
        getEmployees(this.state.pageIndex - 1, this.state.pageSize)
          .then(this.onGetEmployeesSuccess)
          .catch(this.onGetEmployeesError);
      }
    });
  };

  onPageChange = (page) => {
    this.setState({ pageIndex: page }, () => {
      if (this.state.query) {
        searchEmployees(page - 1, this.state.pageSize, this.state.query)
          .then(this.onGetEmployeesSuccess)
          .catch(this.onGetEmployeesError);
      } else {
        getEmployees(page - 1, this.state.pageSize)
          .then(this.onGetEmployeesSuccess)
          .catch(this.onGetEmployeesError);
      }
    });
  };

  createEmployee = () => {
    this.props.history.push("/employees/create");
  };

  redirectToProfile = (employee) => {
    this.props.history.push(`/employees/${employee.id}/profile`, employee);
  };

  redirectToEdit = (employee) => {
    this.props.history.push(`/employees/${employee.id}/edit`, employee);
  };

  mapEmployees = (employee) => (
    <EmployeeCard
      key={employee.id}
      employee={employee}
      redirectToProfile={this.redirectToProfile}
      redirectToEdit={this.redirectToEdit}
    />
  );

  render() {
    _logger("this is the logger");
    return (
      <React.Fragment>
        <div id="header" className="app-page-title">
          <div className="page-title-wrapper">
            <div className="page-title-heading">
              <div className="page-title-icon">
                <i className="lnr-user icon-gradient bg-ripe-malin"></i>
              </div>
              <div>
                Employees
                <div className="page-title-subheading">Employees on file.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="search-wrapper active" style={{ padding: "10px" }}>
            <div className="input-holder">
              <input
                value={this.state.query}
                onChange={this.handleSearchChange}
                type="text"
                name="query"
                className="search-input"
                placeholder="Type to search"
              />
              <button className="search-icon">
                <span />
              </button>
            </div>
          </div>
          <br />

          <div className="col-md-12 row">{this.state.mappedEmployees}</div>
          <div className="container">
            <Pagination
              className="col-lg-5 offset-lg-5 d-flex"
              onChange={this.onPageChange}
              current={this.state.pageIndex}
              total={this.state.totalCount}
              pageSize={this.state.pageSize}
            />
          </div>
        </div>
        <br />
        <button
          className="btn-shadow-primary btn btn-primary btn-lg"
          onClick={this.createEmployee}
        >
          Create New
        </button>
      </React.Fragment>
    );
  }
}

Employees.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default Employees;
