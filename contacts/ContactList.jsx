import React, { useState } from "react";
import PropTypes from "prop-types";
import { Container, Draggable } from "react-smooth-dnd";
import * as contactServices from "../../services/contactServices";
const ContactList = (props) => {
  // const onClickDetails = () => {
  //     props.clickDetails(props.contact)
  // }

  const [contactInfo, setInfo] = useState(
    contactServices.generateItems(1, () => ({
      id: props.contact.id,
      name: props.contact.name,
      imageUrl: props.contact.imageUrl,
    }))
  );

  return (
    <li className="list-group-item">
      <div className="widget-content p-0">
        <div className="widget-content-wrapper">
          <div className="widget-content-left mr-3">
            <div className="widget-content-left">
              <Container
                groupName="1"
                behaviour="copy"
                getChildPayload={(i) => contactInfo[i]}
                onDrop={(e) =>
                  setInfo({
                    contactInfo: contactServices.applyDrag(props.contact, e),
                  })
                }
              >
                {contactInfo.map((p, i) => {
                  return (
                    <Draggable key={i}>
                      <div className="draggable-item">
                        <img
                          width="40"
                          className="rounded-circle"
                          src={
                            props.contact.imageUrl
                              ? props.contact.imageUrl
                              : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQc1Wd3qBRHXaLBGOfHVlSNdo2tawEyHdYFb7vTpS9_VSY9BaLG&usqp=CAU"
                          }
                          alt="user images"
                        />
                      </div>
                    </Draggable>
                  );
                })}
              </Container>
            </div>
          </div>
          <div className="widget-content-left flex2">
            <div className="widget-heading">{props.contact.name}</div>
            <div className="widget-subheading opacity-7">
              {props.contact.email}
            </div>
          </div>
          <div className="widget-content-left flex2">
            <div className="widget-subheading opacity-7">
              {props.contact.phone}
            </div>
          </div>
        </div>
      </div>

      {/* <div className="widget-content p-0">
                <div className="widget-content-wrapper">
                    <Container onDrop={props.onDrop} behaviour="copy">
                        <Draggable key={props.contact.id}>
                            <div className="widget-content-left mr-3">

                                <img

                                    width={42}
                                    className="rounded-circle"
                                    src={props.contact.imageUrl ? props.contact.imageUrl : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQc1Wd3qBRHXaLBGOfHVlSNdo2tawEyHdYFb7vTpS9_VSY9BaLG&usqp=CAU"}
                                />

                            </div>
                        </Draggable>
                    </Container>
                    <div className="col-sm-3">
                        <div className="widget-heading">{props.contact.name}</div>
                    </div>
                    <div className="col-sm-3">
                        <div className="widget-heading">{props.contact.email}</div>
                    </div>
                    <div className="col-sm-2">
                        <div className="widget-heading">{props.contact.phone}</div>
                    </div>
                    <div className="widget-content-right">
                        <button onClick={onClickDetails} className="btn-pill btn-hover-shine btn btn-focus btn-sm">
                            Details
                                        </button>
                    </div>

                </div>
            </div> */}
    </li>
  );
};

ContactList.propTypes = {
  contact: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    imageUrl: PropTypes.string,
    id: PropTypes.number,
  }),
  clickDetails: PropTypes.func,
  onDrop: PropTypes.func,
  contactId: PropTypes.func,
  contactDetails: PropTypes.func,
  renderItem: PropTypes.func,
  data: PropTypes.shape({
    items1: PropTypes.array,
  }),
  state: PropTypes.shape({
    items1: PropTypes.shape,
  }),
};

export default ContactList;
