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
import { addLocationSchema } from "../locations/addLocationSchema";
import {
  mergeLocationData,
  getLocationQuery,
  verifyGeoLocation,
  isLocationValid,
} from "../../services/locationFormService";
import { getTypes } from "../../services/locationService";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import {
  addOrganization,
  getOrganizationTypes,
  updateOrganization,
} from "../../services/organizationService";
import fileUploadService from "../../services/fileUploadService";

const _logger = debug.extend("LocationForm");
const feedback = "input-feedback text-danger pl-2";

// for update protocols look at initiialValues in Formik

class OrganizationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      organizationTypes: [],
      mappedOrganizationTypes: [],
      formData: {
        organizationTypeId: "",
        name: "",
        description: "",
        logo: "",
        locationId: 0,
        businessPhone: "",
        siteUrl: "",
        employeesNumber: "",
        lineOne: "",
        lineTwo: "",
        city: "",
        stateId: 0,
        zip: "",
        locationTypeId: 0,
        acceptLocation: false,
      },
      isAddressVerifying: false,
      isAddressVerified: false,
      isMapShown: false,
    };
  }

  componentDidMount() {
    this.getSelectTypes();
    getOrganizationTypes()
      .then(this.onGetOrganizationTypesSuccess)
      .catch(this.onGetOrganizationTypesError);
  }

  onGetOrganizationTypesSuccess = (response) => {
    _logger(response);
    let data = { ...this.state.formData };
    if (this.props.match.params.id) {
      if (this.props.location.state) {
        data.id = this.props.location.state.id;
        data.organizationTypeId = this.props.location.state.organizationType.id;
        data.name = this.props.location.state.name;
        data.description = this.props.location.state.description;
        data.logo = this.props.location.state.logo;
        data.locationId = this.props.location.state.location.id;
        data.businessPhone = this.props.location.state.businessPhone;
        data.siteUrl = this.props.location.state.siteUrl;
        data.employeesNumber = this.props.location.state.employeesNumber;
        data.lineOne = this.props.location.state.location.lineOne;
        data.lineTwo = this.props.location.state.location.lineTwo;
        data.city = this.props.location.state.location.city;
        data.stateId = this.props.location.state.location.stateId;
        data.zip = this.props.location.state.location.zip;
        data.locationTypeId = this.props.location.state.location.locationTypeId;
      }
    }
    this.setState((prevState) => {
      return {
        ...prevState,
        formData: data,
        organizationTypes: response.items,
        mappedOrganizationTypes: response.items.map(
          this.mapOrganizationOptions
        ),
      };
    });
  };

  onGetOrganizationTypesError = (response) => {
    _logger(response);
  };

  mapOrganizationOptions = (type) => {
    return (
      <option key={type.id} value={type.id}>
        {type.name}
      </option>
    );
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
          logo: response.items[0].url,
        },
      };
    });
  };

  onFileUploadError = (response) => {
    _logger(response);
  };

  onAddOrganizationSucces = (response) => {
    _logger(response);
    Swal.fire("Success!", "Organization has been added", "success");
    this.props.history.push("/organizations");
  };

  onAddOrganizationError = (response) => {
    _logger("onAddOrganizationError ", response);
    Swal.fire("Error", "Could not add Organization", "error");
  };

  onUpdateOrganizationSuccess = (response) => {
    _logger(response);
    Swal.fire("Success!", "Organization has been updated", "success");
    this.props.history.push("/organizations");
  };
  onUpdateOrganizationError = (response) => {
    _logger(response);
  };

  addLocation = (address, setFieldValue) => {
    Object.keys(address).forEach((key) => {
      setFieldValue(key, address[key]);
    });
  };

  // getSelectTypes = () => {
  //   let states = [];
  //   getStates()
  //     .then((response) => (states = response.items))
  //     .then(getTypes)
  //     .then((res) =>
  //       this.setState((prevState) => {
  //         return {
  //           ...prevState,
  //           locationTypes: res.items,
  //           states,
  //           mappedStates: states.map(this.mapSelectOptions),
  //           mappedLocationTypes: res.items.map(this.mapSelectOptions),
  //         };
  //       })
  //     )
  //     .catch((error) => {
  //       _logger("Could not retrieve data from lookup tables", error);
  //     });
  // };

  getSelectTypes = () => {
    const onGetTypesFail = (error) => {
      _logger("onGetTypesFail", error);
    };

    getTypes()
      .then((response) => {
        const { states, locationTypes } = response.item;
        this.setState((prevState) => {
          return {
            ...prevState,
            states,
            locationTypes,
            mappedStates: states.map(this.mapSelectOptions),
            mappedLocationTypes: locationTypes.map(this.mapSelectOptions),
          };
        });
      })
      .catch(onGetTypesFail);
  };

  mapSelectOptions = (type) => {
    return (
      <option key={type.id} value={type.id}>
        {type.name}
      </option>
    );
  };

  callAjaxFunctions = (values) => {
    _logger("callAjaxFunctions: I am the call back Function", values);
    _logger(
      "callAjaxFunctions: validAddress in state",
      this.state.validAddress
    );
    values.organizationTypeId = parseInt(values.organizationTypeId);
    values.employeesNumber = parseInt(values.employeesNumber);
    values.latitude = this.state.validAddress.latitude;
    values.longtitude = this.state.validAddress.longitude;

    if (this.props.match.params.id) {
      updateOrganization(values)
        .then(this.onUpdateOrganizationSuccess)
        .catch(this.onUpdateOrganizationError);
    } else
      addOrganization(values)
        .then(this.onAddOrganizationSucces)
        .catch(this.onAddOrganizationError);

    // place your handlesubmit ajax call logic in here. Please use the values and not whatever values you have in state
    // grab lat and lng from this.state.validAddress.latitude / longitude,
  };

  toggleMap = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        isMapShown: !this.state.isMapShown,
      };
    });
  };

  setAddressVerified = () => {
    _logger(
      "setAddressVerified: Reset isAddressVerifying, Set isAddressVerified"
    );
    this.setState((prevState) => {
      return {
        ...prevState,
        isAddressVerified: true,
        isAddressVerifying: false,
      };
    });
  };

  resetAddressVerified = () => {
    _logger(
      "resetAdddressVerified: (isAddressVerified, isAddressVerifying) = false;"
    );
    this.setState((prevState) => {
      return {
        ...prevState,
        isAddressVerified: false,
        isAddressVerifying: false,
      };
    });
  };

  handleSubmit = (values, { setSubmitting, setValues }) => {
    _logger(values);
    debugger;
    const statesArray = this.state.states;

    const setValidLocationFormData = (validLocationData) => {
      _logger("setValidLocationFormData", validLocationData);
      return new Promise((resolve, reject) => {
        if (validLocationData) {
          // spread join operator, validLocationData is rightmost object so if there is a key collision it wins.
          const mergedData = { ...values, ...validLocationData };
          _logger(
            "setValidLocationFormData: result after combining validLocationData + Values",
            mergedData
          );
          debugger;
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

    const onVerifyAddressFail = () => {
      _logger("Error in verifying Address");
      setSubmitting(false);
      this.resetAddressVerified();
    };

    try {
      if (this.state.isAddressVerifying) {
        _logger("Verifying Address");

        verifyGeoLocation(getLocationQuery(values, statesArray))
          .then((response) => {
            return mergeLocationData(response, values, statesArray);
          })
          .then((results) => {
            return setValidLocationFormData(results.newFormAddress).then(() => {
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
            });
          })
          .catch(onVerifyAddressFail);
      } else {
        _logger("Submit Form to API Endpoints");
        this.callAjaxFunctions(values);
        setSubmittingToFalse();
      }
    } catch (e) {
      _logger("ERROR, handlesubmit failed", e);
      Swal.fire("Oh no", "Something went wrong, please try again", "error");
      setSubmittingToFalse();
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="app-main__inner p-0">
          <div className="app-inner-layout chat-layout">
            <div className="app-inner-layout__header text-white bg-alternate">
              <div className="app-page-title">
                <div className="page-title-wrapper">
                  <div className="page-title-heading">
                    <div className="page-title-icon bg-happy-fisher">
                      <i className="pe-7s-folder text-white"></i>
                    </div>
                    <div>
                      Organizations
                      <div className="page-title-subheading">
                        Organization Listing
                      </div>
                    </div>
                  </div>
                  {/* <div className="page-title-actions">
                    <button
                      className="ladda-button btn btn-pill btn-wide btn-alternate"
                      onClick={handleAdd}
                      data-style="expand-right"
                    >
                      <i className="pe-7s-plus mr-2"> </i>
                      <span className="ladda-label">Add Organization</span>
                      <span className="ladda-spinner"></span>
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <img
            alt="logo"
            className="mb-1 mt-1"
            style={{ maxHeight: 300 }}
            src={this.state.formData.logo && this.state.formData.logo}
          />
        </div>
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
          validationSchema={addLocationSchema} //org schema?
          initialValues={this.state.formData}
          // For updating utlize the following initialValues prop
          // initialValues={this.props.updateData || this.state.formData}
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
              //setFieldValue,??
            } = formikProps;
            return (
              <Form onSubmit={handleSubmit}>
                <Card className="col-md-9 my-3">
                  <CardBody>
                    <h5 className="card-title">Locations</h5>
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
                      <Col>
                        {this.state.isAddressVerified && (
                          <FormGroup className="inline-block pl-2 align-middle">
                            <Label>
                              <Field
                                autoComplete="off"
                                name="acceptLocation"
                                type="checkbox"
                                id="acceptLocation"
                                checked={values.acceptLocation}
                                className={`mr-2 ${
                                  errors.acceptLocation &&
                                    touched.acceptLocation
                                    ? "form-control error"
                                    : "form-control"
                                  }`}
                                style={{
                                  width: "22px",
                                  height: "22px",
                                  display: "inline-block",
                                }}
                              />
                              Accept Address
                            </Label>
                            <span className={feedback}>
                              {!values.acceptLocation &&
                                touched.acceptLocation &&
                                "Verify the address to continue"}
                            </span>
                          </FormGroup>
                        )}
                      </Col>
                    </Row>

                    <Row form>
                      <Col className="clear-fix">
                        <FormGroup>
                          <Button
                            className="float-left"
                            type="button"
                            color="secondary"
                            onClick={() => {
                              this.setState(
                                (prevState) => {
                                  return {
                                    ...prevState,
                                    isAddressVerifying: true,
                                  };
                                },
                                () => {
                                  handleSubmit();
                                }
                              );
                            }}
                            disabled={
                              this.state.isAddressVerifying ||
                              !isLocationValid(errors, values)
                            }
                          >
                            Verify
                          </Button>
                          <Button
                            className="float-right"
                            type="button"
                            color="success"
                            onClick={() => {
                              this.toggleMap();
                            }}
                            disabled={
                              this.state.isAddressVerifying ||
                              !isLocationValid(errors, values) ||
                              !this.state.isMapShown
                            }
                          >
                            View Map
                          </Button>
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>

                <Card className="main-card my-3 card col-md-9">
                  <CardBody>
                    <h5 className="card-title">Organization</h5>
                    <FormGroup>
                      <Label>Organization Types</Label>
                      <Field
                        value={values.organizationTypeId}
                        name="organizationTypeId"
                        component="select"
                        id="organizationTypeId"
                        className={
                          errors.organizationTypeId &&
                            touched.organizationTypeId
                            ? "form-control error"
                            : "form-control"
                        }
                        autoComplete="on"
                      >
                        <option value="0"></option>
                        {this.state.mappedOrganizationTypes}
                      </Field>
                      <span className={feedback}>
                        {errors.organizationTypeId &&
                          touched.organizationTypeId &&
                          `${errors.organizationTypeId}`}
                      </span>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="organizationName">
                        Organization Name
                      </Label>
                      <Field
                        value={values.name}
                        name="name"
                        id="organizationName"
                        placeholder="Business Name"
                        type="text"
                        className={
                          errors.name && touched.name
                            ? "form-control error"
                            : "form-control"
                        }
                        autoComplete="on"
                      />
                      <span className={feedback}>
                        {errors.name && touched.name && `${errors.name}`}
                      </span>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="description">Description</Label>
                      <Field
                        value={values.description}
                        name="description"
                        id="description"
                        placeholder="Description"
                        type="text"
                        className={
                          errors.description && touched.description
                            ? "form-control error"
                            : "form-control"
                        }
                        autoComplete="on"
                      />
                      <span className={feedback}>
                        {errors.description &&
                          touched.description &&
                          `${errors.description}`}
                      </span>
                    </FormGroup>
                    <FormGroup>
                      <Label>Logo</Label>
                      <input
                        multiple
                        name="file"
                        type="file"
                        className="form-control-file"
                        onChange={this.onUploadFile}
                        values={values.logo}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="businessPhone">
                        Business Phone Number
                      </Label>
                      <Field
                        value={values.businessPhone}
                        name="businessPhone"
                        id="businessPhone"
                        placeholder="Business Phone"
                        type="text"
                        className={
                          errors.businessPhone && touched.businessPhone
                            ? "form-control error"
                            : "form-control"
                        }
                        autoComplete="on"
                      />
                      <span className={feedback}>
                        {errors.businessPhone &&
                          touched.businessPhone &&
                          `${errors.businessPhone}`}
                      </span>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="organizationWebsite">
                        Organization Website
                      </Label>
                      <Field
                        value={values.siteUrl}
                        name="siteUrl"
                        id="siteUrl"
                        placeholder="Site Url"
                        type="text"
                        className={
                          errors.siteUrl && touched.siteUrl
                            ? "form-control error"
                            : "form-control"
                        }
                        autoComplete="on"
                      />
                      <span className={feedback}>
                        {errors.siteUrl &&
                          touched.siteUrl &&
                          `${errors.siteUrl}`}
                      </span>
                    </FormGroup>
                    <FormGroup>
                      <Label htmlFor="numberOfEmployees">
                        Number of Employees
                      </Label>
                      <Field
                        value={values.employeesNumber}
                        name="employeesNumber"
                        id="employeesNumber"
                        placeholder="Number of Employees"
                        type="text"
                        className={
                          errors.employeesNumber && touched.employeesNumber
                            ? "form-control error"
                            : "form-control"
                        }
                        autoComplete="on"
                      />
                      <span className={feedback}>
                        {errors.employeesNumber &&
                          touched.employeesNumber &&
                          `${errors.employeesNumber}`}
                      </span>
                    </FormGroup>
                    <FormGroup style={{ display: "none" }}>
                      <Label htmlFor="locationId">LocationId</Label>
                      <Field
                        value={values.locationId}
                        name="locationId"
                        id="locationId"
                        placeholder="Location Id"
                        type="text"
                        className={
                          errors.locationId && touched.locationId
                            ? "form-control error"
                            : "form-control"
                        }
                        autoComplete="on"
                      />
                      <span className={feedback}>
                        {errors.locationId &&
                          touched.locationId &&
                          `${errors.locationId}`}
                      </span>
                    </FormGroup>

                    <Button
                      color="primary"
                      type="submit"
                      disabled={
                        !isValid ||
                        isSubmitting ||
                        !this.state.isAddressVerified ||
                        !values.acceptLocation
                      }
                    >
                      Submit
                    </Button>
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

OrganizationForm.propTypes = {
  mappedStates: PropTypes.arrayOf(PropTypes.object),
  mappedLocationTypes: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }),
  location: PropTypes.shape({
    state: PropTypes.shape({
      id: PropTypes.number,
      organizationType: PropTypes.shape({ id: PropTypes.number }),
      name: PropTypes.string,
      description: PropTypes.string,
      logo: PropTypes.string,
      locationId: PropTypes.number,
      businessPhone: PropTypes.string,
      siteUrl: PropTypes.string,
      employeesNumber: PropTypes.number,
      location: {
        city: PropTypes.string,
        latitude: PropTypes.number,
        lineOne: PropTypes.string,
        lineTwo: PropTypes.string,
        longitude: PropTypes.number,
        stateId: PropTypes.number,
        zip: PropTypes.string,
        locationTypeId: PropTypes.number,
      },
    }),
  }),
};

export default OrganizationForm;
