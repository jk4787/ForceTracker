import React from "react";
import {
  getOrganizationWorkers,
  searchOrganizationWorkers,
} from "../../services/organizationService";
import WorkerList from "../organizations/WorkerList";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { Container, Draggable } from "react-smooth-dnd";
import * as contactServices from "../../services/contactServices";
import debug from "sabio-debug";

const _logger = debug.extend("OrganizationWorkers");

class OrganizationWorkers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      totalCount: 0,
      pageSize: 5,
      query: "",
      workers: [],
      mappedWorkers: [],
      items3: [],
    };
  }

  componentDidMount() {
    this.getAllWorkers();
  }

  getAllWorkers = () => {
    getOrganizationWorkers(this.state.current, this.state.pageSize)
      .then(this.onGetOrganizationWorkersSuccess)
      .catch(this.onGetOrganizationWorkersError);
  };

  onGetOrganizationWorkersSuccess = (response) => {
    _logger(response);
    this.setState((prevState) => {
      return {
        ...prevState,
        workers: response.item.pagedItems,
        mappedWorkers: response.item.pagedItems.map(this.mapWorkers),
        totalCount: response.item.totalCount,
      };
    });
  };

  onGetOrganizationWorkersError = (response) => {
    _logger(response);
  };

  mapWorkers = (worker) => <WorkerList key={worker.id} worker={worker} />;

  changePage = (page) => {
    this.setState(
      (prevState) => {
        return {
          ...prevState,
          current: page - 1,
        };
      },
      () => {
        this.onSearch();
      }
    );
  };

  searchChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      this.onSearch();
    });
  };

  onSearch() {
    if (this.state.query) {
      searchOrganizationWorkers(
        this.state.current,
        this.state.pageSize,
        this.state.query
      )
        .then(this.onGetOrganizationWorkersSuccess)
        .catch(this.onGetOrganizationWorkersError);
    } else {
      getOrganizationWorkers(this.state.current, this.state.pageSize)
        .then(this.onGetOrganizationWorkersSuccess)
        .catch(this.onGetOrganizationWorkersError);
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="col-justify-content-right">
          <form className="form-inline my-2 my-md-2">
            <input
              onChange={this.searchChange}
              value={this.state.query}
              className="form-control mr-md-2"
              type="text"
              placeholder="Search Workers"
              name="query"
            />
          </form>
        </div>

        <ul className="list-group list-group-flush">
          {this.state.mappedWorkers}
        </ul>
        <Pagination
          className="col-lg-5 offset-lg-5 d-flex"
          current={this.state.current + 1}
          total={this.state.totalCount}
          pageSize={this.state.pageSize}
          onChange={this.changePage}
        />

        <Container
          dragClass="opacity-ghost"
          dropClass="opacity-ghost-drop"
          groupName="1"
          getChildPayload={(i) => this.state.items3[i]}
          onDrop={(e) =>
            this.setState({
              items3: contactServices.applyDrag(this.state.items3, e),
            })
          }
        >
          {this.state.items3.map((p, i) => {
            return (
              <Draggable key={i}>
                <div className="draggable-item">
                  <img
                    alt="avatar"
                    width="40"
                    className="rounded-circle"
                    src={
                      this.state.items3[i].imageUrl
                        ? this.state.items3[i].imageUrl
                        : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQc1Wd3qBRHXaLBGOfHVlSNdo2tawEyHdYFb7vTpS9_VSY9BaLG&usqp=CAU"
                    }
                  />
                </div>
              </Draggable>
            );
          })}
        </Container>
      </React.Fragment>
    );
  }
}

export default OrganizationWorkers;
