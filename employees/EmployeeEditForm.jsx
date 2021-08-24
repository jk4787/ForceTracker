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
import { employeeSchema } from "./employeeSchema";
import {
  mergeLocationData,
  getLocationQuery,
  verifyGeoLocation,
  isLocationValid,
} from "../../services/locationFormService";

import * as locationService from "../../services/locationService";
import * as employeeService from "../../services/employeeService";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import fileUploadService from "../../services/fileUploadService";
import moment from "moment";

const _logger = debug.extend("EmployeeEditForm");

class EmployeeEditForm extends React.Component {
  state = {
    formData: {
      lineOne: this.props.location.state.location.lineOne,
      lineTwo: this.props.location.state.location.lineTwo,
      city: this.props.location.state.location.city,
      stateId: this.props.location.state.location.stateId,
      zip: this.props.location.state.location.zip,
      locationTypeId: this.props.location.state.location.locationTypeId,
      acceptLocation: false,
      firstName: this.props.location.state.firstName,
      mi: this.props.location.state.mi,
      lastName: this.props.location.state.lastName,
      //email: "",
      organizationId: this.props.location.state.organizationId,
      phone: this.props.location.state.phone,
      dob: moment(this.props.location.state.dob).toDate(),
      salaryTypeId: this.props.location.state.salaryTypeId,
      position: this.props.location.state.position,
      departmentId: this.props.location.state.departmentId,
      supervisor: this.props.location.state.supervisor,
      startDate: this.props.location.state.startDate,
      endDate: this.props.location.state.endDate,
      avatarUrl: this.props.location.state.avatarUrl,
    },
    isAddressVerifying: false,
    isAddressVerified: false,
    isMapShown: false,
  };

  componentDidMount() {
    this.getSelectTypes();
  }

  getSelectTypes = () => {
    const getResponse = (response) => {
      const eSelects = response.item;
      handleSetState(eSelects);
    };

    const handleSetState = (eSelects) => {
      _logger("handlSetState: eSelects", eSelects);
      const { organizations, salaryTypes, departmentTypes } = eSelects;
      locationService.getTypes().then((res) => {
        _logger("locationService.getTypes results", res);
        const { item } = res;
        const { states, locationTypes } = item;
        this.setState((prevState) => {
          return {
            ...prevState,
            states,
            locationTypes,
            organizations,
            salaryTypes,
            departmentTypes,
            mappedOrganizations: organizations.map(this.mapSelectOptions),
            mappedSalaryTypes: salaryTypes.map(this.mapSelectOptions),
            mappedDepartmentTypes: departmentTypes.map(this.mapSelectOptions),
            mappedStates: states.map(this.mapSelectOptions),
            mappedLocationTypes: locationTypes.map(this.mapSelectOptions),
          };
        });
      });
    };

    employeeService
      .getTypes(getResponse)
      .then(getResponse)
      .catch((error) => _logger(error));
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

  handleVerify = (values, setSubmitting, setValues) => {
    const statesArray = this.state.states;

    const setValidLocationFormData = (validLocationData) => {
      _logger("setValidLocationFormData", validLocationData);
      return new Promise((resolve, reject) => {
        if (validLocationData) {
          const mergedData = { ...values, ...validLocationData };
          _logger(
            "setValidLocationFormData: result after combining validLocationData + Values",
            mergedData
          );
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
      _logger("setSubmittingToFalse");
      setSubmitting(false);
    };

    const resetAddressVerified = () => {
      this.setState(
        (prevState) => {
          _logger("resetAddressVerified");
          return {
            ...prevState,
            isAddressVerified: false,
            isAddressVerifying: false,
          };
        },
        () => {
          _logger(
            "resetAddressVerified: isAddressVerified",
            this.state.isAddressVerified
          );
          _logger(
            "resetAddressVerified: isAddressVerifying",
            this.state.isAddressVerifying
          );
        }
      );
    };

    const onVerifyGeoLocationFail = (e) => {
      _logger("onVerifyGeoLocationFail: errors", e);
      _logger(
        "onVerifyGeoLocationFail: setSubmitting(false) and resetAddressVerified"
      );
      setSubmittingToFalse();
      resetAddressVerified();
    };

    const putValidLocationInState = (results) => {
      return setValidLocationFormData(results.newFormAddress)
        .then(() => {
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
        })
        .catch((e) => {
          _logger("setValidLocationFormData:", e);
        });
    };

    const tryCatchSequence = () => {
      try {
        _logger("handleVerify: Try - Verifying Address");
        verifyGeoLocation(getLocationQuery(values, statesArray))
          .then((response) => {
            return mergeLocationData(response, values, statesArray);
          })
          .then(putValidLocationInState)
          .catch(onVerifyGeoLocationFail);
      } catch (e) {
        _logger("handleVerify: Catch - Errors", e);
        Swal.fire("Oh no", "Something went wrong, please try again", "error");
        setSubmittingToFalse();
      }
    };

    _logger("setVerifyingAddress: before begin tryVerifySequence");
    this.setState((prevState) => {
      return {
        ...prevState,
        isAddressVerifying: true,
        isAddressVerified: false,
      };
    }, tryCatchSequence);
  };

  onUpdateEmployeeSuccess = () => {
    Swal.fire("Success", "Employee Successfully Updated", "success");
    this.props.history.push("/employees");
  };

  onUpdateEmployeeError = () => {
    Swal.fire(
      "Error",
      "Unable to Update Employee, Please Double Check Input Fields",
      "error"
    );
  };

  handleSubmit = (values, { setSubmitting }) => {
    _logger("handleSubmit: values from form", values);
    _logger("handleSubmit: this.state.validAddress", this.state.validAddress);

    const {
      mi,
      avatarUrl,
      lineTwo,
      position,
      departmentId,
      startDate,
      endDate,
    } = values;

    const payload = {};

    payload.firstName = values.firstName;
    payload.lastName = values.lastName;
    payload.mi = mi ? mi : null;
    //payload.roleId = 4;
    payload.avatarUrl = avatarUrl ? avatarUrl : null;
    payload.lineOne = values.lineOne;
    payload.lineTwo = lineTwo ? lineTwo : null;
    payload.city = values.city;
    payload.zip = values.zip ? values.zip : null;
    payload.stateId = parseInt(values.stateId);
    payload.latitude = this.state.validAddress.latitude;
    payload.longitude = this.state.validAddress.longitude;
    payload.organizationId = parseInt(values.organizationId);
    payload.dob = values.dob;
    payload.phone = values.phone ? values.phone : null;
    payload.salaryTypeId = parseInt(values.salaryTypeId);
    payload.position = position ? position : null;
    payload.departmentId = departmentId ? parseInt(departmentId) : null;
    payload.supervisor = values.supervisor ? values.supervisor : null;
    payload.startDate = startDate ? startDate : null;
    payload.endDate = endDate ? endDate : null;
    payload.locationTypeId = parseInt(values.locationTypeId);

    employeeService
      .updateEmployee(values)
      .then(this.onUpdateEmployeeSuccess)
      .catch(this.onUpdateEmployeeError);
    setSubmitting(false);

    if (!values.acceptAddress || !this.state.isAddressVerified) {
      Swal.fire("Submit failed", "Verify and confirm your address", "error");
      setSubmitting(false);
    } else {
      const {
        mi,
        avatarUrl,
        lineTwo,
        position,
        departmentId,
        startDate,
        endDate,
      } = values;

      const payload = {};

      payload.firstName = values.firstName;
      payload.lastName = values.lastName;
      payload.mi = mi ? mi : null;
      //payload.roleId = 4;
      payload.avatarUrl = avatarUrl ? avatarUrl : null;
      payload.lineOne = values.lineOne;
      payload.lineTwo = lineTwo ? lineTwo : null;
      payload.city = values.city;
      payload.zip = values.zip ? values.zip : null;
      payload.stateId = parseInt(values.stateId);
      payload.latitude = this.state.validAddress.latitude;
      payload.longitude = this.state.validAddress.longitude;
      payload.organizationId = values.organizationId;
      payload.dob = values.dob;
      payload.phone = values.phone ? values.phone : null;
      payload.salaryTypeId = parseInt(values.salaryTypeId);
      payload.position = position ? position : null;
      payload.departmentId = departmentId ? parseInt(departmentId) : null;
      payload.supervisor = values.supervisor ? values.supervisor : null;
      payload.startDate = startDate ? startDate : null;
      payload.endDate = endDate ? endDate : null;
      payload.locationTypeId = parseInt(values.locationTypeId);
      // payload.avatarUrl = this.state.formData.avatarUrl;
    }
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

  onFileUploadError = (response) => {
    _logger(response);
  };

  render() {
    _logger(this.state.formData);
    return (
      <React.Fragment>
        <div id="header" className="app-page-title">
          <div className="page-title-wrapper">
            <div className="page-title-heading">
              <div className="page-title-icon">
                <i className="lnr-user icon-gradient bg-ripe-malin"></i>
              </div>
              <div>
                Employees
                <div className="page-title-subheading">Edit Employee</div>
              </div>
            </div>
          </div>
        </div>

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
          validationSchema={employeeSchema}
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
                    : (e) => this.handleNotValidSubmit(e, setTouched)
                }
              >
                <Card className="col-md-9 my-3">
                  <CardBody>
                    <h5 className="card-title">
                      Edit Employee: {values.firstName} {values.lastName}
                    </h5>

                    <Col md={{ span: 4, offset: 8 }}>
                      <div className="font-icon-wrapper font-icon-lg">
                        <i className="lnr-user icon-gradient bg-ripe-malin" />
                        <img
                          className="mb-2"
                          style={{ maxHeight: 250, maxWidth: 250 }}
                          src={this.state.formData.avatarUrl}
                          alt=""
                        />
                      </div>

                      <FormGroup>
                        <Label htmlFor="avatarUrl">Avatar Upload</Label>
                        <input
                          multiple
                          id="file"
                          name="file"
                          type="file"
                          placeholder="Upload Image"
                          className="form-control-file"
                          onChange={(e) => {
                            this.onUploadFile(e, values, setValues);
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Row>
                      <Col md={{ span: 4 }}>
                        <FormGroup>
                          <Label>First Name</Label>
                          <Field
                            name="firstName"
                            type="text"
                            values={values.firstName}
                            placeholder="First Name"
                            autoComplete="off"
                            className={
                              errors.firstName && touched.firstName
                                ? "form-control error"
                                : "form-control"
                            }
                          />
                          {errors.firstName && touched.firstName && (
                            <span className="input-feedback text-danger pl-2">
                              {errors.firstName}
                            </span>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label>Middle Initial</Label>
                          <Field
                            name="mi"
                            type="text"
                            values={values.mi}
                            placeholder="Middle Initial"
                            autoComplete="off"
                            className={
                              errors.mi && touched.mi
                                ? "form-control error"
                                : "form-control"
                            }
                          />
                          {errors.mi && touched.mi && (
                            <span className="input-feedback text-danger pl-2">
                              {errors.mi}
                            </span>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label>Last Name</Label>
                          <Field
                            name="lastName"
                            type="text"
                            values={values.lastName}
                            placeholder="Last Name"
                            autoComplete="off"
                            className={
                              errors.lastName && touched.lastName
                                ? "form-control error"
                                : "form-control"
                            }
                          />
                          {errors.lastName && touched.lastName && (
                            <span className="input-feedback text-danger pl-2">
                              {errors.lastName}
                            </span>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row form>
                      <Col md={4}>
                        <FormGroup>
                          <Label htmlFor="dob">Date of Birth</Label>
                          <DatePicker
                            {...formikProps}
                            dateFormat="MM-dd-yyyy"
                            name="dob"
                            className="form-control"
                            id="dob"
                            selected={formikProps.values.dob}
                            onChange={(date) => {
                              formikProps.setFieldValue("dob", date);
                            }}
                          />
                          {errors.dob && touched.dob && (
                            <span className="input-feedback text-danger pl-2">
                              {errors.dob}
                            </span>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label>Phone Number</Label>
                          <Field
                            name="phone"
                            type="string"
                            values={values.phone}
                            placeholder="xxx-xxx-xxxx"
                            autoComplete="off"
                            className={
                              errors.phone && touched.phone
                                ? "form-control error"
                                : "form-control"
                            }
                          />
                          {errors.phone && touched.phone && (
                            <span className="input-feedback text-danger pl-2">
                              {errors.phone}
                            </span>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label>Location Type</Label>
                          <Field
                            value={values.locationTypeId}
                            name="locationTypeId"
                            component="select"
                            id="locationTypeId"
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
                    <Row form className="mt-n2">
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
                    <Row form className="mt-n2">
                      <Col md={4}>
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
                      <Col md={4}>
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
                      <Col md={4}>
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
                          onClick={() => {
                            this.toggleMap();
                          }}
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
                            name="acceptAddress"
                            type="checkbox"
                            id="acceptAddress"
                            disabled={!this.state.validAddress}
                            value={values.acceptAddress}
                            className={
                              errors.acceptAddress && touched.acceptAddress
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
                              {errors.acceptAddress &&
                                touched.acceptAddress &&
                                "check box required"}
                            </div>
                          </span>
                        </Label>
                      </FormGroup>
                    </Row>

                    <Row form>
                      <Col md={4}>
                        <FormGroup>
                          <Label>Organization</Label>
                          <Field
                            name="organizationId"
                            component="select"
                            values={values.organizationId}
                            placeholder="Organization Id"
                            autoComplete="off"
                            className={
                              errors.organizationId && touched.organizationId
                                ? "form-control error"
                                : "form-control"
                            }
                          >
                            <option value="0"></option>
                            {this.state.mappedOrganizations}
                          </Field>
                          {errors.organizationId && touched.organizationId && (
                            <span className="input-feedback text-danger pl-2">
                              {errors.organizationId}
                            </span>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label>Department</Label>
                          <Field
                            name="departmentId"
                            component="select"
                            values={values.departmentId}
                            id="departmentId"
                            className={
                              errors.departmentId && touched.departmentId
                                ? "form-control error"
                                : "form-control"
                            }
                          >
                            <option value="0"></option>
                            {this.state.mappedDepartmentTypes}
                          </Field>

                          {errors.departmentId && touched.departmentId && (
                            <span className="input-feedback text-danger pl-2">
                              {errors.departmentId}
                            </span>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label>Supervisor</Label>
                          <Field
                            name="supervisor"
                            type="string"
                            values={values.supervisor}
                            placeholder="Supervisor"
                            autoComplete="off"
                            className={
                              errors.supervisor && touched.supervisor
                                ? "form-control error"
                                : "form-control"
                            }
                          />
                          {errors.supervisor && touched.supervisor && (
                            <span className="input-feedback text-danger pl-2">
                              {errors.supervisor}
                            </span>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row form>
                      <Col md={6}>
                        <FormGroup>
                          <Label>Salary Type</Label>
                          <Field
                            name="salaryTypeId"
                            id="salaryTypeId"
                            component="select"
                            values={values.salaryTypeId}
                            className={
                              errors.salaryTypeId && touched.salaryTypeId
                                ? "form-control error"
                                : "form-control"
                            }
                          >
                            <option value="0"></option>
                            {this.state.mappedSalaryTypes}
                          </Field>
                          {errors.salaryTypeId && touched.salaryTypeId && (
                            <span className="input-feedback text-danger pl-2">
                              {errors.salaryTypeId}
                            </span>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label>Position</Label>
                          <Field
                            name="position"
                            type="string"
                            values={values.position}
                            placeholder="Position"
                            autoComplete="off"
                            className={
                              errors.position && touched.position
                                ? "form-control error"
                                : "form-control"
                            }
                          />
                          {errors.position && touched.position && (
                            <span className="input-feedback text-danger pl-2">
                              {errors.position}
                            </span>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row form>
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="startDate">Start Date</Label>
                          <DatePicker
                            //{...formikProps}
                            dateFormat="MM-dd-yyyy"
                            name="startDate"
                            className="form-control"
                            id="startDate"
                            //selected={formikProps.values.startDate}
                            onChange={(date) => {
                              formikProps.setFieldValue("startDate", date);
                            }}
                          />
                          {errors.startDate && touched.startDate && (
                            <span className="input-feedback text-danger pl-2">
                              {errors.startDate}
                            </span>
                          )}
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="endDate">End Date</Label>
                          <DatePicker
                            // {...formikProps}
                            dateFormat="MM-dd-yyyy"
                            name="endDate"
                            className="form-control"
                            id="endDate"
                            // selected={formikProps.values.endDate}
                            onChange={(date) => {
                              formikProps.setFieldValue("endDate", date);
                            }}
                          />
                          {errors.endDate && touched.endDate && (
                            <span className="input-feedback text-danger pl-2">
                              {errors.endDate}
                            </span>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
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

EmployeeEditForm.propTypes = {
  mappedStates: PropTypes.arrayOf(PropTypes.object),
  mappedLocationTypes: PropTypes.arrayOf(PropTypes.object),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  location: PropTypes.shape({
    state: PropTypes.shape({
      location: PropTypes.shape({
        lineOne: PropTypes.string,
        lineTwo: PropTypes.string,
        city: PropTypes.string,
        stateId: PropTypes.number,
        zip: PropTypes.string,
        locationTypeId: PropTypes.number,
      }),
      firstName: PropTypes.string,
      mi: PropTypes.string,
      lastName: PropTypes.string,
      organizationId: PropTypes.string,
      phone: PropTypes.string,
      dob: PropTypes.string,
      salaryTypeId: PropTypes.number,
      position: PropTypes.string,
      departmentId: PropTypes.number,
      supervisor: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      avatarUrl: PropTypes.string,
    }),
  }),
};

export default EmployeeEditForm;
