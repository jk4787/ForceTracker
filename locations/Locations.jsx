import React from "react";
import LocationCard from "./LocationCard";
import { getLocations } from "../../services/locationService";
import Pagination from "rc-pagination";
import("rc-pagination/assets/index.css");

class Locations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      mappedLocations: [],
      current: 1,
      pageSize: 5,
      totalCount: 0,
      query: "",
      address: "",
    };
  }

  componentDidMount() {
    this.getLocationsPaginated();
  }

  getLocationsPaginated = () => {
    getLocations(0, this.state.pageSize)
      .then(this.onGetLocationsSuccess)
      .catch(this.onGetLocationsError);
  };

  onGetLocationsSuccess = (response) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        totalCount: response.item.totalCount,
        locations: response.item.pagedItems,
        mappedLocations: response.item.pagedItems.map(this.mapLocations),
      };
    });
  };

  onGetLocationsError = (response) => {
    return response;
  };

  onPageChange = (page) => {
    this.setState(
      {
        current: page,
      },
      () => {
        getLocations(this.state.current - 1, this.state.pageSize)
          .then(this.onGetLocationsSuccess)
          .catch(this.onGetLocationsError);
      }
    );
  };

  mapLocations = (location) => {
    return <LocationCard key={location.id} location={location} />;
  };

  render() {
    return (
      <div className="container">
        <div className="row justify-content-center">
          <div className="card-deck m-4">{this.state.mappedLocations}</div>
        </div>
        <div className="row justify-content-center">
          <Pagination
            onChange={this.onPageChange}
            current={this.state.current}
            total={this.state.totalCount}
            pageSize={this.state.pageSize}
          />
        </div>
      </div>
    );
  }
}

export default Locations;
