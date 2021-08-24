import React from "react";
import { getAllSubcontractors } from "../../services/subcontractorServices";
import { searchSubcontractors } from "../../services/subcontractorServices";
import { updateActiveStatus } from "../../services/subcontractorServices";
import Swal from "sweetalert2";
//import logger from "sabio-debug";
import PropTypes from "prop-types";
import SubcontractorCard from "./SubcontractorCard";
import Pagination from "rc-pagination";
import("rc-pagination/assets/index.css");

class Subcontractors extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subcontractors: [],
      mappedSubcontractors: [],
      currentBegin: 0,
      pageSize: 9,
      current: 1,
      totalCount: 0,
      searchQuery: "",
    };
  }

  componentDidMount() {
    getAllSubcontractors(this.state.currentBegin, this.state.pageSize)
      .then(this.onGetAllContractorsSuccess)
      .catch(this.onGetAllContractorsError);
  }

  onGetAllContractorsSuccess = (response) => {
    const subcontractors = response.item.pagedItems;
    this.setState({
      subcontractors,
      mappedSubcontractors: subcontractors.map(this.mapSubcontractors),
      totalCount: response.item.totalCount,
    });
  };

  mapSubcontractors = (subcontractor) => {
    return (
      <SubcontractorCard
        key={subcontractor.id}
        subcontractor={subcontractor}
        subcontractorProfile={this.subcontractorProfile}
        subcontractorStatus={this.subcontractorStatus}
        editSubcontractor={this.editSubcontractor}
      />
    );
  };

  subcontractorProfile = (subcontractor) => {
    this.props.history.push(
      `/subcontractors/profile/${subcontractor.id}`,
      subcontractor
    );
  };

  editSubcontractor = (subcontractor) => {
    this.props.history.push(
      `/subcontractors/${subcontractor.id}/edit/`,
      subcontractor
    );
  };

  subcontractorStatus = (subcontractor) => {
    updateActiveStatus(subcontractor.id)
      .then(this.onUpdateSuccess)
      .catch(this.onUpdateError);
  };

  onUpdateSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Subcontractor's status updated",
      text: "Navigate to update profile page to re-activate",
    });
  };

  onUpdateError = () => {
    Swal.fire({
      icon: "error",
      title: "Subcontractor's status not updated",
      //text: 'Status needs to be "1"',
    });
  };

  // editSubcontractor = (subcontractor) => {
  //   this.props.history.push(
  //     `/subcontractors/edit/${subcontractor.id}`,
  //     subcontractor
  //   );
  // };

  onChange = (page) => {
    this.setState(
      {
        current: page,
      },
      () => {
        if (this.state.searchQuery) {
          searchSubcontractors(
            this.state.current - 1,
            this.state.pageSize,
            this.state.searchQuery
          )
            .then(this.onGetAllContractorsSuccess)
            .catch(this.onGetAllContractorsError);
        } else {
          getAllSubcontractors(this.state.current - 1, this.state.pageSize)
            .then(this.onGetAllContractorsSuccess)
            .catch(this.onGetAllContractorsError);
        }
      }
    );
  };

  updateSearch = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (this.state.searchQuery) {
        searchSubcontractors(
          this.state.currentBegin,
          this.state.pageSize,
          this.state.searchQuery
        )
          .then(this.onGetAllContractorsSuccess)
          .catch(this.onGetAllContractorsError);
      } else {
        getAllSubcontractors(this.state.current - 1, this.state.pageSize)
          .then(this.onGetAllContractorsSuccess)
          .catch(this.onGetAllContractorsError);
      }
    });
  };

  render() {
    return (
      <div>
        <div className="container">
          <form className="form-inline my-2 my-lg-3">
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Search Subcontractors"
              aria-label="Search"
              value={this.state.searchQuery}
              onChange={this.updateSearch}
              name="searchQuery"
            ></input>
            {/* <button
              className="btn btn-outline-success my-2 my-sm-0"
              type="button"
            >
              Friends
            </button> */}
          </form>
        </div>
        <div className="row">
          <div className="card-deck">{this.state.mappedSubcontractors}</div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-lg-5 offset-lg-5 d-flex">
              <Pagination
                onChange={this.onChange}
                current={this.state.current}
                total={this.state.totalCount}
                //changing default from 10 with pageSize below:
                pageSize={this.state.pageSize}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Subcontractors.propTypes = {
  avatarUrl: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  phone: PropTypes.string,
  name: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  subcontractorProfile: PropTypes.func,
};

export default Subcontractors;
