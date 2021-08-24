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
import { Formik, Field, FieldArray } from "formik";
import { addSubcontractorSchema } from "./addSubcontractorSchema";
import {
  mergeLocationData,
  getLocationQuery,
  verifyGeoLocation,
  isLocationValid,
} from "../../services/locationFormService";
import { getTypes } from "../../services/locationService";
//import { getAllIndustryTypes } from "../../services/subcontractorServices";
import { getIndExpTypes } from "../../services/subcontractorServices";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import fileUploadService from "../../services/fileUploadService";
import { createSubcontractor } from "../../services/subcontractorServices";
import DatePicker from "react-datepicker";

const _logger = debug.extend("LocationForm");
const feedback = "input-feedback text-danger pl-2";

class SubcontractorRegister extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        firstName: "",
        mi: "",
        lastName: "",
        avatarUrl: "",
        lineOne: "",
        lineTwo: "",
        city: "",
        stateId: 0,
        zip: "",
        locationTypeId: 0,
        latitude: "",
        longitude: "",
        name: "",
        phone: "",
        industryId: "",
        siteUrl: "",
        expertise: [],
        licenses: [
          {
            licenseStateId: "",
            licenseNumber: "",
            dateExpires: "",
          },
          {
            licenseStateId: "",
            licenseNumber: "",
            dateExpires: "",
          },
          {
            licenseStateId: "",
            licenseNumber: "",
            dateExpires: "",
          },
        ],
        acceptLocation: false,
        mappedLocationTypes: [],
        mappedStateTypes: [],
        mappedIndustryTypes: [],
        locationTypes: [],
        mappedExpertiseTypes: [],
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
    let expertiseTypes = [];
    getIndExpTypes()
      .then((resp) => {
        industryTypes = resp.item.industryTypes;
        expertiseTypes = resp.item.expertiseTypes;
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
            expertiseTypes,
            mappedStates: states.map(this.mapSelectOptions),
            mappedLocationTypes: locationTypes.map(this.mapSelectOptions),
            mappedIndustryTypes: industryTypes.map(this.mapSelectOptions),
            mappedExpertiseTypes: expertiseTypes.map(this.mapSelectOptions),
          };
        });
      });
  };

  // getDropdownTypes = () => {
  //   let industryTypes = [];
  //   getAllIndustryTypes()
  //     .then((resp) => {
  //       industryTypes = resp.items;
  //     })
  //     .then(getTypes)
  //     .then((response) => {
  //       const { states, locationTypes } = response.item;
  //       this.setState((prevState) => {
  //         return {
  //           ...prevState,
  //           states,
  //           locationTypes,
  //           industryTypes,
  //           mappedStates: states.map(this.mapSelectOptions),
  //           mappedLocationTypes: locationTypes.map(this.mapSelectOptions),
  //           mappedIndustryTypes: industryTypes.map(this.mapSelectOptions),
  //         };
  //       });
  //     });
  // };

  onGetTypesError = () => {
    Swal.fire({
      icon: "error",
      title: "Types Not Accessed",
    });
  };

  mapSelectOptions = (type) => {
    return (
      <option key={`${type.id}.${type.name}`} value={type.id}>
        {type.name}
      </option>
    );
  };

  onSubcontractorCreatedSuccess = () => {
    Swal.fire({
      icon: "success",
      title: "Subcontractor Successfully Created",
      //text: "Great Job!!",
    });
  };

  onSubcontractorCreatedError = () => {
    Swal.fire({
      icon: "error",
      title: "No subcontractor created",
      //text: 'Status needs to be "1"',
    });
  };

  onUploadFile = (e, values, setValues) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("files", files[0]);
    fileUploadService
      .upload(data)
      .then((response) => {
        const avatarUrl = response.items[0].url;
        _logger(avatarUrl);
        this.setState(
          (prevState) => {
            return {
              ...prevState,
              formData: {
                ...prevState.formData,
                avatarUrl: response.items[0].url,
              },
            };
          },
          () => {
            setValues({
              ...values,
              avatarUrl,
            });
          }
        );
      })
      .catch(this.onFileUploadError);
  };

  // onUploadFile = (event) => {
  //   const files = event.target.files;
  //   const data = new FormData();
  //   data.append("files", files[0]);

  //   fileUploadService
  //     .upload(data)
  //     .then(this.onFileUploadSuccess)
  //     .catch(this.onFileUploadError);
  // };

  // onFileUploadSuccess = (response) => {
  //   this.setState((prevState) => {
  //     return {
  //       ...prevState,
  //       formData: {
  //         ...prevState.formData,
  //         avatarUrl: response.items[0].url,
  //       },
  //     };
  //   });
  // };

  onFileUploadError = () => {};

  toggleMap = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        isMapShown: !this.state.isMapShown,
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

  onSetValidLocationToFormFail = (e) => {
    _logger("putValidLocationInState: fail", e);
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
    //adjust:
    // values.expertise = [
    //   parseInt(values.expertise[0]),
    //   parseInt(values.expertise[1]),
    //   parseInt(values.expertise[2]),
    // ];

    // let expertise = values.expertise;
    // if (expertise !== null) {
    //   for (let index = 0; index < expertise.length; index++) {
    //     const element = expertise[index];
    //     parseInt(element.expertise);
    //   }
    // }
    values.licenses = {
      licenseStateId: 4,
      licenseNumber: "NEW-8677",
      dateExpires: "2020-05-29",
    };

    createSubcontractor(values)
      .then(this.onSubcontractorCreatedSuccess)
      .catch(this.onSubcontractorCreatedError);
    // redirect to their profile page
    // if it errors you will want to run setSubmitting(false)
    setSubmitting(false);
  };

  // pushToArray = (push, values) => {
  //   const valuesParse = parseInt(values.expertise);
  //   push(valuesParse);
  // };

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
              setFieldValue,
              //push,
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
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSkvABiseEakv174TAY6aJGMeBVbHDc2HbV9DlV4P0aa8Em9ndo&usqp=CAU";
                          }}
                        />
                      </div>

                      <FormGroup>
                        <Label>Bio Picture</Label>

                        <input
                          multiple
                          name="file"
                          type="file"
                          className="form-control-file"
                          // onChange={this.onUploadFile}
                          onChange={(e) => {
                            this.onUploadFile(e, values, setValues);
                          }}
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

                <Card className="col-md-9 my-3">
                  <FieldArray name="expertise">
                    {/* {({ push }) => {
                      return ( */}
                    <CardBody>
                      <h5 className="card-title">Expertise Information</h5>
                      <div className="form-row">
                        <div className="col-md-4">
                          <div className="position-relative form-group">
                            <FormGroup>
                              <Label>Expertise #1</Label>
                              <Field
                                name="expertise[0]"
                                type="number"
                                component="select"
                                values={values.expertise}
                                label="Expertise Type"
                                // onSelect={() =>
                                //   this.pushToArray(push, values)
                                // }
                                // onClick={() =>
                                //   this.pushToArray(push, values)
                                // }
                                className={
                                  errors.expertise && touched.expertise
                                    ? "form-control error"
                                    : "form-control"
                                }
                                as="select"
                              >
                                <option value="">Select Expertise Type</option>
                                {this.state.mappedExpertiseTypes}
                              </Field>
                              {errors.expertise && touched.expertise && (
                                <span
                                  className="input-feedback"
                                  style={{
                                    color: "#d62e2e",
                                    paddingLeft: 20,
                                  }}
                                >
                                  {errors.expertise}
                                </span>
                              )}
                            </FormGroup>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <Label>Expertise #2</Label>
                            <Field
                              name="expertise[1]"
                              type="number"
                              component="select"
                              values={values.expertise}
                              label="Expertise Type"
                              className={
                                errors.expertise && touched.expertise
                                  ? "form-control error"
                                  : "form-control"
                              }
                              as="select"
                            >
                              <option value="">Select Expertise Type</option>
                              {this.state.mappedExpertiseTypes}
                            </Field>
                            {errors.expertise && touched.expertise && (
                              <span
                                className="input-feedback"
                                style={{
                                  color: "#d62e2e",
                                  paddingLeft: 20,
                                }}
                              >
                                {errors.expertise}
                              </span>
                            )}
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <Label>Expertise #3</Label>
                            <Field
                              name="expertise[2]"
                              type="number"
                              component="select"
                              values={values.expertise}
                              label="Expertise Type"
                              className={
                                errors.expertise && touched.expertise
                                  ? "form-control error"
                                  : "form-control"
                              }
                              as="select"
                            >
                              <option value="">Select Expertise Type</option>
                              {this.state.mappedExpertiseTypes}
                            </Field>
                            {errors.expertise && touched.expertise && (
                              <span
                                className="input-feedback"
                                style={{
                                  color: "#d62e2e",
                                  paddingLeft: 20,
                                }}
                              >
                                {errors.expertise}
                              </span>
                            )}
                          </FormGroup>
                        </div>
                      </div>
                    </CardBody>
                    {/* );
                    }} */}
                  </FieldArray>
                  <CardBody>
                    <h5 className="card-title">License Info (If Applicable)</h5>
                    <div className="form-row">
                      <div className="col-md-4">
                        <div className="position-relative form-group">
                          <FormGroup>
                            <Label>Licensed State #1</Label>
                            <Field
                              //name="licenseStateId"
                              name="licenseStateId[0]"
                              type="number"
                              component="select"
                              values={values.licenseStateId}
                              label="Expertise Type"
                              className={
                                errors.licenseStateId && touched.licenseStateId
                                  ? "form-control error"
                                  : "form-control"
                              }
                              as="select"
                            >
                              <option value="">Select State</option>
                              {this.state.mappedStates}
                            </Field>
                            {errors.licenseStateId && touched.licenseStateId && (
                              <span
                                className="input-feedback"
                                style={{ color: "#d62e2e", paddingLeft: 20 }}
                              >
                                {errors.licenseStateId}
                              </span>
                            )}
                          </FormGroup>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <FormGroup>
                          <Label>License Number #1</Label>
                          <Field
                            //name="licenseNumber"
                            name="licenseNumber[0]"
                            type="text"
                            values={values.licenseNumber}
                            placeholder="License Number"
                            autoComplete="off"
                            className={
                              errors.licenseNumber && touched.licenseNumber
                                ? "form-control error"
                                : "form-control"
                            }
                          />
                          {errors.licenseNumber && touched.licenseNumber && (
                            <span
                              className="input-feedback"
                              style={{ color: "#d62e2e", paddingLeft: 20 }}
                            >
                              {errors.licenseNumber}
                            </span>
                          )}
                        </FormGroup>
                      </div>
                      <div className="col-md-4">
                        <FormGroup>
                          <Label htmlFor="dateExpires">Date Expires #1</Label>
                          <DatePicker
                            dateFormat="MM-dd-yyyy"
                            //dateFormat="MM-DD-YYYY"
                            values={values.dateExpires}
                            name="dateExpires[0]"
                            //name="dateExpires[0]"
                            //name="license[0]"
                            id="dateExpires[0]"
                            placeholder="Select Date"
                            className="form-control"
                            selected={values.dateExpires}
                            onChange={(date) =>
                              setFieldValue("dateExpires", date)
                            }
                            //onChange={setFieldValue}
                          />
                        </FormGroup>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="col-md-4">
                        <div className="position-relative form-group">
                          <FormGroup>
                            <Label>Licensed State #2</Label>
                            <Field
                              //name="licenseStateId"
                              name="licenseStateId[1]"
                              type="number"
                              component="select"
                              values={values.licenseStateId}
                              label="Expertise Type"
                              className={
                                errors.licenseStateId && touched.licenseStateId
                                  ? "form-control error"
                                  : "form-control"
                              }
                              as="select"
                            >
                              <option value="">Select State</option>
                              {this.state.mappedStates}
                            </Field>
                            {errors.licenseStateId && touched.licenseStateId && (
                              <span
                                className="input-feedback"
                                style={{ color: "#d62e2e", paddingLeft: 20 }}
                              >
                                {errors.licenseStateId}
                              </span>
                            )}
                          </FormGroup>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <FormGroup>
                          <Label>License Number #2</Label>
                          <Field
                            //name="licenseNumber"
                            name="licenseNumber[1]"
                            type="text"
                            values={values.licenseNumber}
                            placeholder="License Number"
                            autoComplete="off"
                            className={
                              errors.licenseNumber && touched.licenseNumber
                                ? "form-control error"
                                : "form-control"
                            }
                          />
                          {errors.licenseNumber && touched.licenseNumber && (
                            <span
                              className="input-feedback"
                              style={{ color: "#d62e2e", paddingLeft: 20 }}
                            >
                              {errors.licenseNumber}
                            </span>
                          )}
                        </FormGroup>
                      </div>
                      <div className="col-md-4">
                        <FormGroup>
                          <Label htmlFor="dateExpires">Date Expires #2</Label>
                          <DatePicker
                            dateFormat="MM-dd-yyyy"
                            //dateFormat="MM-DD-YYYY"
                            values={values.dateExpires}
                            //name="dateExpires"
                            name="dateExpires[1]"
                            id="dateExpires[1]"
                            placeholder="Select Date"
                            className="form-control"
                            selected={values.dateExpires}
                            onChange={(date) =>
                              setFieldValue("dateExpires", date)
                            }
                          />
                        </FormGroup>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="col-md-4">
                        <div className="position-relative form-group">
                          <FormGroup>
                            <Label>Licensed State #3</Label>
                            <Field
                              //name="licenseStateId"
                              name="licenseStateId[2]"
                              type="number"
                              component="select"
                              values={values.licenseStateId}
                              label="Expertise Type"
                              className={
                                errors.licenseStateId && touched.licenseStateId
                                  ? "form-control error"
                                  : "form-control"
                              }
                              as="select"
                            >
                              <option value="">Select State</option>
                              {this.state.mappedStates}
                            </Field>
                            {errors.licenseStateId && touched.licenseStateId && (
                              <span
                                className="input-feedback"
                                style={{ color: "#d62e2e", paddingLeft: 20 }}
                              >
                                {errors.licenseStateId}
                              </span>
                            )}
                          </FormGroup>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <FormGroup>
                          <Label>License Number #3</Label>
                          <Field
                            //name="licenseNumber"
                            name="licenseNumber[2]"
                            type="text"
                            values={values.licenseNumber}
                            placeholder="License Number"
                            autoComplete="off"
                            className={
                              errors.licenseNumber && touched.licenseNumber
                                ? "form-control error"
                                : "form-control"
                            }
                          />
                          {errors.licenseNumber && touched.licenseNumber && (
                            <span
                              className="input-feedback"
                              style={{ color: "#d62e2e", paddingLeft: 20 }}
                            >
                              {errors.licenseNumber}
                            </span>
                          )}
                        </FormGroup>
                      </div>
                      <div className="col-md-4">
                        <FormGroup>
                          <Label htmlFor="dateExpires[2]">
                            Date Expires #3
                          </Label>
                          <DatePicker
                            dateFormat="MM-dd-yyyy"
                            //dateFormat="MM-DD-YYYY"
                            values={values.dateExpires}
                            //name="dateExpires"
                            name="dateExpires[2]"
                            id="dateExpires[2]"
                            placeholder="Select Date"
                            className="form-control"
                            selected={values.dateExpires}
                            onChange={(date) =>
                              setFieldValue("dateExpires", date)
                            }
                          />
                        </FormGroup>
                      </div>
                    </div>
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

SubcontractorRegister.propTypes = {
  mappedStates: PropTypes.arrayOf(PropTypes.object),
  mappedLocationTypes: PropTypes.arrayOf(PropTypes.object),
  mappedIndustryTypes: PropTypes.arrayOf(PropTypes.object),
  mappedExpertiseTypes: PropTypes.arrayOf(PropTypes.object),
};

export default SubcontractorRegister;
