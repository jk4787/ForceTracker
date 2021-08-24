import React from "react";
import LocationMapModal from "../locations/LocationMapModal";
import {
  Form,
  Label,
  FormGroup,
  Button,
  Row,
  Col,
  Card,
  CardBody,
} from "reactstrap";
import { Formik, Field } from "formik";
import { addSubcontractorSchema } from "./addSubcontractorSchema";
import {
  mergeLocationData,
  getLocationQuery,
  verifyGeoLocation,
  isLocationValid,
} from "../../services/locationFormService";
import { getTypes } from "../../services/locationService";
import { getAllIndustryTypes } from "../../services/subcontractorServices";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import fileUploadService from "../../services/fileUploadService";
import { updateSubcontractor } from "../../services/subcontractorServices";
import debug from "sabio-debug";
const _logger = debug.extend("LocationForm");
const feedback = "input-feedback text-danger pl-2";

class SubcontractorEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        id: this.props.location.state.id,
        userProfileId: this.props.location.state.userProfile.userId,
        firstName: this.props.location.state.userProfile.firstName,
        mi: this.props.location.state.userProfile.mi,
        lastName: this.props.location.state.userProfile.lastName,
        avatarUrl: this.props.location.state.userProfile.avatarUrl,
        lineOne: this.props.location.state.location.lineOne,
        lineTwo: this.props.location.state.location.lineTwo,
        city: this.props.location.state.location.city,
        //stateId: 0,
        stateId: this.props.location.state.location.stateId,
        zip: this.props.location.state.location.zip,
        //locationTypeId: 0,
        locationTypeId: this.props.location.state.location.locationTypeId,
        name: this.props.location.state.name,
        phone: this.props.location.state.phone,
        industryId: this.props.location.state.industryId,
        siteUrl: this.props.location.state.siteUrl,
        locationId: this.props.location.state.location.id,
        isActive: this.props.location.state.isActive,
        acceptLocation: false,
        mappedLocationTypes: [],
        mappedStateTypes: [],
        mappedIndustryTypes: [],
        locationTypes: [],
      },
      isAddressVerifying: false,
      isAddressVerified: false,
      isMapShown: false,
    };
  }

  componentDidMount() {
    this.getDropdownTypes();
  }

  getDropdownTypes = () => {
    let industryTypes = [];
    getAllIndustryTypes()
      .then((resp) => {
        industryTypes = resp.items;
        //return getTypes();
      })
      .then(getTypes)
      .then((response) => {
        const { states, locationTypes } = response.item;
        this.setState((prevState) => {
          return {
            ...prevState,
            states,
            locationTypes,
            industryTypes,
            mappedStates: states.map(this.mapSelectOptions),
            mappedLocationTypes: locationTypes.map(this.mapSelectOptions),
            mappedIndustryTypes: industryTypes.map(this.mapSelectOptions),
          };
        });
      });
  };

  onGetTypesError = () => {
    Swal.fire({
      icon: "error",
      title: "Types Not Accessed",
      //text: 'Status needs to be "1"',
    });
  };

  mapSelectOptions = (type) => {
    return (
      <option key={`${type.id}.${type.name}`} value={type.id}>
        {type.name}
      </option>
    );
  };

  onSubcontractorUpdatedSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Subcontractor Profile Updated",
    });
  };

  onSubcontractorUpdatedError = () => {
    Swal.fire({
      icon: "error",
      title: "Subcontractor Profile Not Updated",
    });
  };

  onUploadFile = (event) => {
    const files = event.target.files;
    const data = new FormData();
    data.append("files", files[0]);

    fileUploadService
      .upload(data)
      .then(this.onFileUploadSuccess)
      .catch(this.onFileUploadError);
  };

  onFileUploadSuccess = (response) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        formData: {
          ...prevState.formData,
          avatarUrl: response.items[0].url,
        },
      };
    });
  };

  onFileUploadError = () => { };

  toggleMap = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        isMapShown: !this.state.isMapShown,
      };
    });
  };

  setAddressVerified = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        isAddressVerified: true,
        isAddressVerifying: false,
      };
    });
  };

  resetAddressVerified = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        isAddressVerified: false,
        isAddressVerifying: false,
      };
    });
  };

  handleVerify = (values, setSubmitting, setValues) => {
    const statesArray = this.state.states;
    const setValidLocationFormData = (validLocationData) => {
      return new Promise((resolve, reject) => {
        if (validLocationData) {
          const mergedData = { ...values, ...validLocationData };
          setValues(mergedData);
          resolve("Able to set valid location data to form");
        } else {
          reject(
            "validLocationData is undefined, unable to set values of location fields in Formik"
          );
        }
      });
    };

    const setSubmittingToFalse = () => {
      setSubmitting(false);
    };

    const onVerifyGeoLocationFail = (e) => {
      setSubmittingToFalse();
      this.resetAddressVerified();
      return e;
    };

    const putValidLocationInState = (results) => {
      const onSetValidLocationFormDataSuccess = () => {
        this.setState((prevState) => {
          return {
            ...prevState,
            isMapShown: false,
            formattedAddress: results.formattedAddress,
            validAddress: results.validAddress,
            isAddressVerified: true,
            isAddressVerifying: false,
          };
        }, setSubmittingToFalse);
      };

      return setValidLocationFormData(results.newFormAddress)
        .then(onSetValidLocationFormDataSuccess)
        .catch(this.onSetValidLocationToFormFail);
    };

    const onCatch = (e) => {
      setSubmittingToFalse();
      _logger("tryCatchSequence; fail", e);
    };

    const tryCatchSequence = () => {
      try {
        verifyGeoLocation(getLocationQuery(values, statesArray))
          .then((response) => {
            return mergeLocationData(response, values, statesArray);
          })
          .then(putValidLocationInState)
          .catch(onVerifyGeoLocationFail);
      } catch (e) {
        onCatch(e);
      }
    };

    this.setState((prevState) => {
      return {
        ...prevState,
        isAddressVerifying: true,
        isAddressVerified: false,
      };
    }, tryCatchSequence);
  };

  handleNotValidSubmit = (e, setTouched) => {
    e.preventDefault();
    const touchedFields = {};
    Object.keys(this.state.formData).forEach((key) => {
      touchedFields[key] = true;
    });
    Swal.fire(
      "Uh Oh!",
      "There are issues with your form, verify inputs and all required fields are filled",
      "error"
    );
    setTouched(touchedFields);
  };

  handleSubmit = (values, { setSubmitting }) => {
    _logger("handleSubmit", values);
    values.locationTypeId = parseInt(values.locationTypeId);
    values.stateId = parseInt(values.stateId);
    values.industryId = parseInt(values.industryId);
    values.latitude = this.state.validAddress.latitude;
    values.longitude = this.state.validAddress.longitude;
    values.siteUrl = values.siteUrl ? values.siteUrl : null;

    updateSubcontractor(values)
      .then(this.onSubcontractorUpdatedSuccess)
      .catch(this.onSubcontractorUpdatedError);
    // redirect to their profile page
    // if it errors you will want to run setSubmitting(false)
    setSubmitting(false);
  };

  render() {
    return (
      <React.Fragment>
        {this.state.isAddressVerified &&
          this.state.validAddress &&
          this.state.validAddress.latitude &&
          this.state.validAddress.longitude &&
          this.state.formattedAddress && (
            <LocationMapModal
              lat={this.state.validAddress.latitude}
              lng={this.state.validAddress.longitude}
              formattedAddress={this.state.formattedAddress}
              isMapShown={this.state.isMapShown}
              toggleMap={this.toggleMap}
            />
          )}
        <Formik
          enableReinitialize={true}
          validationSchema={addSubcontractorSchema}
          initialValues={this.state.formData}
          onSubmit={this.handleSubmit}
        >
          {(formikProps) => {
            const {
              values,
              touched,
              errors,
              handleSubmit,
              isSubmitting,
              isValid,
              setSubmitting,
              setValues,
              setTouched,
            } = formikProps;
            return (
              <Form
                onSubmit={
                  isValid
                    ? handleSubmit
                    : (e) => {
                      this.handleNotValidSubmit(e, setTouched);
                    }
                }
              >
                <Card className="col-md-9 my-3">
                  <CardBody>
                    <h5 className="card-title">Register a Subcontractor</h5>
                    <div>
                      <div>
                        <img
                          alt="avatar"
                          className="mb-2"
                          style={{ maxHeight: 200 }}
                          src={
                            this.state.formData.avatarUrl &&
                            this.state.formData.avatarUrl
                          }
                        />
                      </div>
                      <FormGroup>
                        <Label>Bio Picture</Label>

                        <input
                          multiple
                          name="file"
                          type="file"
                          className="form-control-file"
                          onChange={this.onUploadFile}
                          values={values.avatarUrl}
                        />
                      </FormGroup>
                      <div className="form-row">
                        <div className="col-md-5">
                          <div className="position-relative form-group">
                            <FormGroup>
                              <Label>First Name</Label>
                              <Field
                                name="firstName"
                                type="text"
                                values={values.firstName}
                                placeholder="Name"
                                autoComplete="off"
                                className={
                                  errors.firstName && touched.firstName
                                    ? "form-control error"
                                    : "form-control"
                                }
                              />
                              {errors.firstName && touched.firstName && (
                                <span
                                  className="input-feedback"
                                  style={{
                                    color: "#d62e2e",
                                    paddingLeft: 20,
                                  }}
                                >
                                  {errors.firstName}
                                </span>
                              )}
                            </FormGroup>
                          </div>
                        </div>
                        <div className="col-md-2">
                          <FormGroup>
                            <Label>Middle Initial</Label>
                            <Field
                              name="mi"
                              type="text"
                              values={values.mi}
                              placeholder="Middle"
                              autoComplete="off"
                              className={
                                errors.mi && touched.mi
                                  ? "form-control error"
                                  : "form-control"
                              }
                            />
                            {errors.mi && touched.mi && (
                              <span className="input-feedback">
                                {errors.mi}
                              </span>
                            )}
                          </FormGroup>
                        </div>
                        <div className="col-md-5">
                          <FormGroup>
                            <Label>Last Name</Label>
                            <Field
                              name="lastName"
                              type="text"
                              values={values.lastName}
                              placeholder="Name"
                              autoComplete="off"
                              className={
                                errors.lastName && touched.lastName
                                  ? "form-control error"
                                  : "form-control"
                              }
                            />
                            {errors.lastName && touched.lastName && (
                              <span
                                className="input-feedback"
                                style={{
                                  color: "#d62e2e",
                                  paddingLeft: 20,
                                }}
                              >
                                {errors.lastName}
                              </span>
                            )}
                          </FormGroup>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <FormGroup style={{ display: "none" }}>
                  <Label>Id</Label>
                  <Field
                    name="Id"
                    type="number"
                    values={values.id}
                    placeholder="Id"
                    autoComplete="off"
                    className={
                      errors.id && touched.id
                        ? "form-control error"
                        : "form-control"
                    }
                  />
                  {errors.id && touched.id && (
                    <span className="input-feedback">{errors.id}</span>
                  )}
                </FormGroup>
                <FormGroup style={{ display: "none" }}>
                  <Label>User Profile Id</Label>
                  <Field
                    name="userProfileId"
                    type="number"
                    values={values.userProfileId}
                    placeholder="User Profile Id"
                    autoComplete="off"
                    className={
                      errors.userProfileId && touched.userProfileId
                        ? "form-control error"
                        : "form-control"
                    }
                  />
                  {errors.userProfileId && touched.userProfileId && (
                    <span className="input-feedback">
                      {errors.userProfileId}
                    </span>
                  )}
                </FormGroup>
                {/* <FormGroup style={{ display: "none" }}> */}
                <FormGroup style={{ display: "none" }}>
                  <Label>Location Id</Label>
                  <Field
                    name="locationId"
                    type="number"
                    values={values.locationId}
                    placeholder="Location Id"
                    autoComplete="off"
                    className={
                      errors.locationId && touched.locationId
                        ? "form-control error"
                        : "form-control"
                    }
                  />
                  {errors.locationId && touched.locationId && (
                    <span className="input-feedback">{errors.locationId}</span>
                  )}
                </FormGroup>
                <Card className="col-md-9 my-3">
                  <CardBody>
                    <h5 className="card-title">Address Verification</h5>
                    <Row form className="mt-n1">
                      <Col>
                        <FormGroup>
                          <Label>Address</Label>
                          <Field
                            value={values.lineOne}
                            name="lineOne"
                            id="lineOne"
                            placeholder="1234 Main St"
                            type="text"
                            className={
                              errors.lineOne && touched.lineOne
                                ? "form-control error"
                                : "form-control"
                            }
                            autoComplete="on"
                          />
                          <span className={feedback}>
                            {errors.lineOne &&
                              touched.lineOne &&
                              `${errors.lineOne}`}
                          </span>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row form className="mt-n1">
                      <Col>
                        <FormGroup>
                          <Label htmlFor="locationLineTwo2">Address 2</Label>
                          <Field
                            value={values.lineTwo}
                            name="lineTwo"
                            id="locationLineTwo2"
                            placeholder="Apartment, studio, or floor"
                            type="text"
                            className={
                              errors.name && touched.name
                                ? "form-control error"
                                : "form-control"
                            }
                            autoComplete="on"
                          />
                          <span className={feedback}>
                            {errors.lineTwo &&
                              touched.lineTwo &&
                              `${errors.lineTwo}`}
                          </span>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row form className="mt-n1">
                      <Col md={3}>
                        <FormGroup>
                          <Label htmlFor="locationCity2">City</Label>
                          <Field
                            value={values.city}
                            name="city"
                            id="locationCity2"
                            type="text"
                            className={
                              errors.city && touched.city
                                ? "form-control error"
                                : "form-control"
                            }
                            autoComplete="on"
                          />
                          <span className={feedback}>
                            {errors.city && touched.city && `${errors.city}`}
                          </span>
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label htmlFor="locationStates">States</Label>
                          <Field
                            value={values.stateId}
                            name="stateId"
                            component="select"
                            id="locationStates"
                            className={
                              errors.stateId && touched.stateId
                                ? "form-control error"
                                : "form-control"
                            }
                            autoComplete="on"
                          >
                            <option value="0"></option>
                            {this.state.mappedStates}
                          </Field>
                          <span className={feedback}>
                            {errors.stateId &&
                              touched.stateId &&
                              `${errors.stateId}`}
                          </span>
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label>Zip</Label>
                          <Field
                            value={values.zip}
                            name="zip"
                            id="locationZip2"
                            type="text"
                            className={
                              errors.zip && touched.zip
                                ? "form-control error"
                                : "form-control"
                            }
                            autoComplete="on"
                          />
                          <span className={feedback}>
                            {errors.zip && touched.zip && `${errors.zip}`}
                          </span>
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label>Location Type</Label>
                          <Field
                            value={values.locationTypeId}
                            name="locationTypeId"
                            component="select"
                            id="locationType2"
                            className={
                              errors.locationTypeId && touched.locationTypeId
                                ? "form-control error"
                                : "form-control"
                            }
                          >
                            <option value="0"></option>
                            {this.state.mappedLocationTypes}
                          </Field>
                          <span className={feedback}>
                            {errors.locationTypeId &&
                              touched.locationTypeId &&
                              `${errors.locationTypeId}`}
                          </span>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row form>
                      <FormGroup className="pr-2">
                        <Button
                          type="button"
                          color="secondary"
                          onClick={() => {
                            this.handleVerify(values, setSubmitting, setValues);
                          }}
                          disabled={
                            isSubmitting ||
                            this.state.isAddressVerifying ||
                            !isLocationValid(errors, values)
                          }
                        >
                          Verify
                        </Button>
                      </FormGroup>
                      <FormGroup className="pr-2">
                        <Button
                          className="ml-2"
                          type="button"
                          color="success"
                          onClick={this.toggleMap}
                          disabled={
                            isSubmitting ||
                            this.state.isAddressVerifying ||
                            !isLocationValid(errors, values) ||
                            !this.state.isMapShown
                          }
                        >
                          View Map
                        </Button>
                      </FormGroup>
                      <FormGroup className="inline-block pl-2 float-left">
                        <Label className="pt-2 pb-2">
                          <Field
                            name="acceptLocation"
                            type="checkbox"
                            id="acceptLocation"
                            disabled={!this.state.validAddress}
                            value={values.acceptLocation}
                            className={
                              errors.acceptLocation && touched.acceptLocation
                                ? "form-control error"
                                : "form-control"
                            }
                            style={{
                              width: "22px",
                              height: "22px",
                              display: "inline-block",
                            }}
                          />
                          <span className="pl-2">
                            Accept Address
                            <div className="input-feedback text-danger pl-2">
                              {errors.acceptLocation &&
                                touched.acceptLocation &&
                                `${errors.acceptLocation}`}
                            </div>
                          </span>
                        </Label>
                      </FormGroup>
                    </Row>
                  </CardBody>
                </Card>

                <Card className="main-card my-3 card col-md-9">
                  <CardBody>
                    <FormGroup>
                      <Label>Subcontractor Company Name</Label>
                      <Field
                        name="name"
                        type="text"
                        values={values.name}
                        placeholder="Name"
                        autoComplete="off"
                        className={
                          errors.name && touched.name
                            ? "form-control error"
                            : "form-control"
                        }
                      />
                      {errors.name && touched.name && (
                        <span
                          className="input-feedback"
                          style={{ color: "#d62e2e", paddingLeft: 20 }}
                        >
                          {errors.name}
                        </span>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <Label>Phone Number</Label>
                      <Field
                        name="phone"
                        type="text"
                        values={values.phone}
                        placeholder="Phone"
                        autoComplete="off"
                        className={
                          errors.phone && touched.phone
                            ? "form-control error"
                            : "form-control"
                        }
                      />
                      {errors.phone && touched.phone && (
                        <span
                          className="input-feedback"
                          style={{ color: "#d62e2e", paddingLeft: 20 }}
                        >
                          {errors.phone}
                        </span>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <Label>Industry Type</Label>
                      <Field
                        name="industryId"
                        type="number"
                        component="select"
                        values={values.industryId}
                        label="Industry Type"
                        className={
                          errors.industryId && touched.industryId
                            ? "form-control error"
                            : "form-control"
                        }
                        as="select"
                      >
                        <option value="">Select Industry Type</option>
                        {this.state.mappedIndustryTypes}
                      </Field>
                      {errors.industryId && touched.industryId && (
                        <span
                          className="input-feedback"
                          style={{ color: "#d62e2e", paddingLeft: 20 }}
                        >
                          {errors.industryId}
                        </span>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <Label>Website</Label>
                      <Field
                        name="siteUrl"
                        type="text"
                        values={values.siteUrl}
                        placeholder="Website Url"
                        autoComplete="off"
                        className={
                          errors.siteUrl && touched.siteUrl
                            ? "form-control error"
                            : "form-control"
                        }
                      />
                      {errors.siteUrl && touched.siteUrl && (
                        <span
                          className="input-feedback"
                          style={{ color: "#d62e2e", paddingLeft: 20 }}
                        >
                          {errors.siteUrl}
                        </span>
                      )}
                    </FormGroup>
                    <FormGroup style={{ display: "none" }}>
                      <Label>Status</Label>
                      <Field
                        name="isActive"
                        component="select"
                        values={values.isActive}
                        label="isActive"
                        className={
                          errors.isActive && touched.isActive
                            ? "form-control error"
                            : "form-control"
                        }
                        as="select"
                      >
                        {/* <option value="">Select Status</option> */}
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </Field>
                      {errors.isActive && touched.isActive && (
                        <span className="input-feedback">
                          {errors.isActive}
                        </span>
                      )}
                    </FormGroup>
                    <Row form>
                      <Col>
                        <Button
                          color="primary"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Form>
            );
          }}
        </Formik>
      </React.Fragment>
    );
  }
}

SubcontractorEdit.propTypes = {
  mappedStates: PropTypes.arrayOf(PropTypes.object),
  mappedLocationTypes: PropTypes.arrayOf(PropTypes.object),
  location: PropTypes.shape({
    state: PropTypes.shape({
      location: PropTypes.shape({
        lineOne: PropTypes.string,
        lineTwo: PropTypes.string,
        city: PropTypes.string,
        zip: PropTypes.string,
        stateId: PropTypes.number,
        locationTypeId: PropTypes.number,
        id: PropTypes.number,
      }),
      userProfile: PropTypes.shape({
        avatarUrl: PropTypes.string,
        firstName: PropTypes.string,
        mi: PropTypes.string,
        lastName: PropTypes.string,
        userId: PropTypes.number,
      }),
      id: PropTypes.number,
      userProfileId: PropTypes.number,
      name: PropTypes.string,
      locationId: PropTypes.number,
      phone: PropTypes.string,
      industryId: PropTypes.number,
      siteUrl: PropTypes.string,
      isActive: PropTypes.bool,
      firstName: PropTypes.string,
      mi: PropTypes.string,
      lastName: PropTypes.string,
      avatarUrl: PropTypes.string,
      locationTypeId: PropTypes.number,
      lineOne: PropTypes.string,
      lineTwo: PropTypes.string,
      city: PropTypes.string,
      zip: PropTypes.string,
      stateId: PropTypes.number,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }),
  }),
  initialValues: PropTypes.shape({
    locationTypeId: PropTypes.number,
    lineOne: PropTypes.string,
    lineTwo: PropTypes.string,
    city: PropTypes.string,
    zip: PropTypes.string,
    stateId: PropTypes.number,
  }),
};

export default SubcontractorEdit;
