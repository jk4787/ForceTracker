import React from "react";
import * as contactServices from "../../services/contactServices";
import ContactList from "./ContactList";
import logger from "sabio-debug";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import Swal from "sweetalert2";
import ContactDetails from "./ContactDetails";
import { Container, Draggable } from "react-smooth-dnd";

const _logger = logger.extend("Contacts");
class Contacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      pageIndex: 0,
      pageSize: 10,
      currentPage: 0,
      searchQuery: "",
      isVisible: false,
      // items1: contactServices.generateItems(1, (i) => ({ id: '1' + i, data: `Draggable source 1 - ${i}` })),
      // items2: contactServices.generateItems(3, (i) => ({ id: '2' + i, data: `Draggable 2 - ${i}` })),
      items3: [],
    };
  }

  componentDidMount() {
    contactServices
      .getAll(this.state.pageIndex, this.state.pageSize)
      .then(this.getAllContactsSuccess)
      .catch(this.getAllContactsError);
  }

  getAllContactsSuccess = (response) => {
    _logger(response);
    this.setState(() => {
      return {
        contacts: response.item.pagedItems,
        contactData: response.item.pagedItems.map(this.mapContacts),
        totalCount: response.item.totalCount,
        items1: contactServices.generateItems(10, (i) => ({
          id: response.item.pagedItems[i].id,
          name: response.item.pagedItems[i].name,
          image: response.item.pagedItems[i].imageUrl,
        })),
      };
    });
  };

  getAllContactsError = () => {
    Swal.fire({ icon: "error", title: "No Contacts Found" });
  };

  onChangePage = (page) => {
    console.log(page);
    this.setState({ currentPage: page - 1 }, () => {
      if (this.state.searchQuery) {
        contactServices
          .search(
            this.state.currentPage,
            this.state.pageSize,
            this.state.searchQuery
          )
          .then(this.getAllContactsSuccess)
          .catch(this.getAllContactsSuccess);
      } else {
        contactServices
          .getAll(this.state.currentPage, this.state.pageSize)
          .then(this.getAllContactsSuccess)
          .catch(this.getAllContactsSuccess);
      }
    });
  };

  searchChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      if (this.state.searchQuery) {
        contactServices
          .search(0, this.state.pageSize, this.state.searchQuery)
          .then(this.getAllContactsSuccess)
          .catch(this.getAllContactsError);
      } else {
        contactServices
          .getAll(0, this.state.pageSize)
          .then(this.getAllContactsSuccess)
          .catch(this.getAllContactsError);
      }
    });
  };

  onDetailClick = (contact) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        isVisible: !this.state.isVisible,
        contact: contact,
      };
    });
  };

  closeModal = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        isVisible: !this.state.isVisible,
      };
    });
  };

  mapContacts = (contactData) => (
    <ContactList
      key={contactData.id}
      contact={contactData}
      state={this.state}
      clickDetails={this.onDetailClick}
    />
  );

  render() {
    return (
      <div className="col-md-12">
        <div className="main-card mb-8 card">
          <div className="widget-content p-0">
            <div className="widget-content-wrapper">
              <div style={{ paddingTop: 10 }} className="col-sm-7">
                <button className="mb-3 mr-3 btn-pill btn btn-primary">
                  Create Contact
                </button>

                <div className="col-justify-content-right">
                  <form className="form-inline my-2 my-md-2">
                    <input
                      onChange={this.searchChange}
                      value={this.state.searchQuery}
                      className="form-control mr-md-2"
                      type="text"
                      placeholder="Search Contacts"
                      aria-label="Search"
                      name="searchQuery"
                    />
                  </form>
                  {this.state.contact && this.state.isVisible ? (
                    <ContactDetails
                      modalClose={this.closeModal}
                      contact={this.state.contact}
                    />
                  ) : (
                    false
                  )}
                </div>
              </div>
            </div>
          </div>

          <ul className="list-group list-group-flush">
            {this.state.contactData}
          </ul>
          <Pagination
            style={{ paddingTop: 10 }}
            className="row justify-content-center"
            onChange={this.onChangePage}
            current={this.state.currentPage + 1}
            total={this.state.totalCount}
            pageSize={this.state.pageSize}
          />
        </div>
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
        {/* <Container groupName="1" behaviour="copy" getChildPayload={i => this.state.items1[i]} onDrop={e => this.setState({ items1: contactServices.applyDrag(this.state.items1, e) })}>
                    {
                        this.state.items1.map((p, i) => {
                            return (
                                <Draggable key={i}>
                                    <div className="draggable-item">
                                        <img width="40" className="rounded-circle" src={"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQc1Wd3qBRHXaLBGOfHVlSNdo2tawEyHdYFb7vTpS9_VSY9BaLG&usqp=CAU"} alt="user images" />
                                    </div>
                                </Draggable>
                            );
                        })
                    }
                </Container> */}
      </div>
    );
  }
}

export default Contacts;
