import React from "react";
import LocationMapModal from "./LocationMapModal";
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
import { addLocationSchema } from "./addLocationSchema";
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

const _logger = debug.extend("LocationForm");

class LocationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        lineOne: "",
        lineTwo: "",
        city: "",
        stateId: 0,
        zip: "",
        locationTypeId: 0,
        acceptLocation: false,
        example: "",
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
    getTypes().then(this.onGetTypesSuccess).catch(this.onGetTypesFail);
  };

  onGetTypesSuccess = (response) => {
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
  };

  onGetTypesFail = (error) => {
    _logger("onGetTypesFail", error);
  };

  mapSelectOptions = (type) => {
    return (
      <option key={`${type.id}.${type.name}`} value={type.id}>
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
    // when ajax call is succesful do a this.state.history.push("/somewhere") to redirect
    // get latitude and longitude from verifiedAddress in state. NOT FROM VALUES!
    Swal.fire("Submit success", "Successfully submitted", "success");
    //use setsubmtiting to false when ajax call fails
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
              infoWindowContent={this.state.formattedAddress}
              isMapShown={this.state.isMapShown}
              toggleMap={this.toggleMap}
            />
          )}
        <Formik
          enableReinitialize={true}
          validationSchema={addLocationSchema}
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
                    <h5 className="card-title">Locations</h5>
                    <Row form>
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
                          <span className="input-feedback text-danger pl-2">
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
                          <span className="input-feedback text-danger pl-2">
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
                          <span className="input-feedback text-danger pl-2">
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
                          <span className="input-feedback text-danger pl-2">
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
                          <span className="input-feedback text-danger pl-2">
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
                          <span className="input-feedback text-danger pl-2">
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

                    <Row>
                      <Col>
                        <FormGroup>
                          <Label>Example</Label>
                          <Field
                            value={values.example}
                            name="example"
                            id="example"
                            placeholder="1234 Main St"
                            type="text"
                            className={
                              errors.example && touched.example
                                ? "form-control error"
                                : "form-control"
                            }
                            autoComplete="on"
                          />
                          <span className="input-feedback text-danger pl-2">
                            {errors.example &&
                              touched.example &&
                              `${errors.example}`}
                          </span>
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

LocationForm.propTypes = {
  mappedStates: PropTypes.arrayOf(PropTypes.object),
  mappedLocationTypes: PropTypes.arrayOf(PropTypes.object),
};

export default LocationForm;
