import React from "react";
import PropTypes from "prop-types";

const LocationCard = (props) => {
  return (
    <div className="main-card mb-3 card">
      <div className="card-header">{props.location.locationType}</div>
      <div className="card-body">
        <p>
          With supporting text below as a natural lead-in to additional content.
        </p>
        <p className="mb-0">
          Lorem Ipsum has been the industrys standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled.
        </p>
      </div>
      <div className="d-block text-right card-footer">Footer</div>
    </div>
  );
};

LocationCard.propTypes = {
  location: PropTypes.shape({
    id: PropTypes.number.isRequired,
    locationType: PropTypes.string.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }),
};

export default LocationCard;
