import React, { useState } from "react";
import PropTypes from "prop-types";
import { Container, Draggable } from "react-smooth-dnd";
import * as contactServices from "../../services/contactServices";

const WorkerList = (props) => {
  const [workerInfo, setInfo] = useState(
    contactServices.generateItems(1, () => ({
      id: props.worker.id,
      name: props.worker.firstName,
      imageUrl: props.worker.avatarUrl,
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
                getChildPayload={(i) => workerInfo[i]}
                onDrop={(e) =>
                  setInfo({
                    workerInfo: contactServices.applyDrag(props.worker, e),
                  })
                }
              >
                {workerInfo.map((p, i) => {
                  return (
                    <Draggable key={i}>
                      <div className="draggable-item">
                        <img
                          width="40"
                          height="40"
                          className="rounded-circle"
                          src={
                            props.worker.avatarUrl
                              ? props.worker.avatarUrl
                              : "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSkvABiseEakv174TAY6aJGMeBVbHDc2HbV9DlV4P0aa8Em9ndo&usqp=CAU"
                          }
                          alt="No Pic"
                        />
                      </div>
                    </Draggable>
                  );
                })}
              </Container>
            </div>
          </div>
          <div className="widget-content-left flex2">
            <div className="widget-heading">{props.worker.firstName}</div>
            <div className="widget-subheading opacity-7">
              {props.worker.email}
            </div>
          </div>
          <div className="widget-content-left flex2">
            <div className="widget-subheading opacity-7">
              {props.worker.phone}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
};

WorkerList.propTypes = {
  worker: PropTypes.shape({
    id: PropTypes.number,
    firstName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    avatarUrl: PropTypes.string,
  }),
};

export default WorkerList;
