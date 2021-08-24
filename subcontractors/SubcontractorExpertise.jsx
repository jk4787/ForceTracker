import React from "react";
import propTypes from "prop-types";

const SubcontractorExpertise = (props) => {
  return (
    <div className="form-row">
      <div className="col-md-10">
        <div className="position-relative form-group">
          {/* <label htmlFor="expertise" className>
            Expertise
          </label> */}
          <input
            name="expertise"
            id="expertise"
            placeholder="Expertise"
            type="text"
            className="form-control"
            value={props.expertise.expertise}
            style={{ paddingRight: 153 }}
          />
        </div>
      </div>
    </div>
  );
};

SubcontractorExpertise.propTypes = {
  expertise: propTypes.shape({
    expertise: propTypes.string,
  }),
};

export default SubcontractorExpertise;
