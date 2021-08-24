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
import { AddOrganizationSchema } from "./AddOrganizationSchema";
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

class OrganizationForms extends React.Component {
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
        businessPhone: "",
        siteUrl: "",
        employeesNumber: 0,
        locationId: 0,
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
  }

  getSelectTypes = () => {
    debugger;
    let data = { ...this.state.formData };
    if (this.props.match.params.id && this.props.location.state) {
      const {
        id,
        organizationType,
        name,
        description,
        logo,
        location,
        businessPhone,
        siteUrl,
        employeesNumber,
      } = this.props.location.state;
      const { lineOne, lineTwo, city, stateId, zip, locationTypeId } = location;
      data = {
        ...this.state.formData,
        id,
        organizationTypeId: organizationType.id,
        name,
        description,
        logo,
        businessPhone,
        siteUrl,
        employeesNumber,
        locationId: location.id,
        lineOne,
        lineTwo,
        city,
        stateId,
        zip,
        locationTypeId,
      };
    }

    let orgTypes = null;

    getOrganizationTypes()
      .then((response) => {
        orgTypes = response.items;
        return getTypes();
      })
      .then((response) => {
        const { states, locationTypes } = response.item;
        this.setState((prevState) => {
          return {
            ...prevState,
            states,
            locationTypes,
            mappedStates: states.map(this.mapSelectOptions),
            mappedLocationTypes: locationTypes.map(this.mapSelectOptions),
            formData: data,
            organizationTypes: orgTypes,
            mappedOrganizationTypes: orgTypes.map(this.mapOrganizationOptions),
          };
        });
      })
      .catch(this.onGetTypesFail);
  };

  onGetTypesFail = (error) => {
    _logger("onGetTypesFail", error);
  };

  mapOrganizationOptions = (type) => {
    return (
      <option key={type.id} value={type.id}>
        {type.name}
      </option>
    );
  };

  onUploadFile = (e, values, setValues) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("files", files[0]);
    fileUploadService
      .upload(data)
      .then((response) => {
        const logo = response.items[0].url;
        _logger(logo);
        this.setState(
          (prevState) => {
            return {
              ...prevState,
              formData: {
                ...prevState.formData,
                logo: response.items[0].url,
              },
            };
          },
          () => {
            setValues({
              ...values,
              logo,
            });
          }
        );
      })
      .catch(this.onFileUploadError);
  };

  onFileUploadError = (response) => {
    _logger(response);
  };

  onAddOrganizationSuccess = (response) => {
    _logger(response);
    Swal.fire("Success!", "Organization has been added", "success");
    this.props.history.push("/organizations");
  };

  onUpdateOrganizationSuccess = (response) => {
    _logger(response);
    Swal.fire("Success!", "Organization has been updated", "success");
    this.props.history.push("/organizations");
  };

  addLocation = (address, setFieldValue) => {
    Object.keys(address).forEach((key) => {
      setFieldValue(key, address[key]);
    });
  };

  mapSelectOptions = (type) => {
    return (
      <option key={type.id} value={type.id}>
        {type.name}
      </option>
    );
  };

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
    values.organizationTypeId = parseInt(values.organizationTypeId);
    values.employeesNumber = parseInt(values.employeesNumber);
    values.latitude = this.state.validAddress.latitude;
    values.longitude = this.state.validAddress.longitude;

    if (this.props.match.params.id) {
      updateOrganization(values)
        .then(this.onUpdateOrganizationSuccess)
        .catch((error) => {
          _logger("Update organization failed", error);
          Swal.fire("Error", "Could not update Organization", "error");
          setSubmitting(false);
        });
    } else {
      addOrganization(values)
        .then(this.onAddOrganizationSuccess)
        .catch((error) => {
          _logger("Add organization failed", error);
          Swal.fire("Error", "Could not add Organization", "error");
          setSubmitting(false);
        });
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
            className="mb-1 mt-1"
            style={{ maxHeight: 300 }}
            src={this.state.formData.logo && this.state.formData.logo}
            alt="logo"
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
          validationSchema={AddOrganizationSchema} //org schema?
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
              setTouched,
              setSubmitting,
              setValues,
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
                    {/* </CardBody>
                </Card>
                <Card className="main-card my-3 card col-md-9">
                  <CardBody> */}
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
                        onChange={(e) => {
                          this.onUploadFile(e, values, setValues);
                        }}
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
                      disabled={isSubmitting}
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

OrganizationForms.propTypes = {
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

export default OrganizationForms;
