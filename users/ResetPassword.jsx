import React from "react";
import { Formik, Field } from "formik";
import { FormGroup, Form, Button, Label, Row } from "reactstrap";
import * as Yup from "yup";
import logger from "sabio-debug";
import LeftPane from "../../layouts/public/LeftPane";
import { resetPassword } from "../../services/userServices";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import queryString from "query-string";

const _logger = logger.extend("SabioInit");
class ResetPassword extends React.Component {
  state = {
    formData: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
  };

  handleSubmit = (values) => {
    values.email = queryString.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    }).email;
    _logger(values);
    resetPassword(values)
      .then(this.onResetPasswordSuccess)
      .catch(this.onResetPasswordError);
  };

  onResetPasswordSuccess = (response) => {
    _logger(response);
    Swal.fire("Success!", "Password is Reset", "success");
    this.props.history.push(`/login`);
  };

  onResetPasswordError = (response) => {
    _logger(response);
    Swal.fire("Error", "Could not reset password", "error");
  };

  feedback = "input-feedback text-danger pl-2";
  render() {
    return (
      <React.Fragment>
        <Formik
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            password: Yup.string()
              .required("Password must be between 8 and 100 characters")
              .min(8, "Minimum of 8 characters required")
              .max(100, "Maximum of 100 characters allowed")
              .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&.])[A-Za-z\d@$!%*#?&]{8,}$/,
                "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
              ),
            passwordConfirm: Yup.string()
              .required("Please Confirm Password")
              .oneOf([Yup.ref("password"), null], "Passwords must match"),
          })}
          initialValues={this.state.formData}
          onSubmit={this.handleSubmit}
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              handleSubmit,
              isValid,
              isSubmitting,
            } = props;
            return (
              <div className="h-100">
                <Row className="h-100 no-gutters">
                  {/* Left Pane */}
                  <LeftPane settings={this.state.settings} />

                  {/* ForgotPassword */}
                  <div className="h-100 d-flex bg-white justify-content-center align-items-center col-md-12 col-lg-8">
                    <div className="mx-auto app-login-box col-sm-12 col-md-10 col-lg-9">
                      <div Name="dropdown-menu-header ">
                        <div className="dropdown-menu-header-inner bg-deep-blue">
                          <div
                            className="menu-header-image"
                            style={{
                              backgroundImage: `url('assets/images/sidebar/abstract4.jpg')`,
                            }}
                          ></div>
                          <div className="menu-header-content mb-4">
                            <div>
                              <Row>
                                <div className="app-logo-ft" />
                                <h4 className="app-logo-text">Force Tracker</h4>
                              </Row>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h4 className="mb-0 pt-3">
                        <div>Reset Password</div>
                        <span>Use the form below to reset password</span>
                      </h4>
                      <div className="divider row" />
                      <div>
                        <Form onSubmit={handleSubmit} className={"col-md-12"}>
                          <div className="form-row">
                            <FormGroup className="position-relative col-md-6 form-group">
                              <Label>New Password</Label>
                              <Field
                                name="password"
                                type="password"
                                values={values.password}
                                placeholder=" New Password here..."
                                autoComplete="off"
                                className={
                                  errors.password && touched.password
                                    ? "form-control error"
                                    : "form-control"
                                }
                              />
                              {errors.password && touched.password && (
                                <span className={this.feedback}>
                                  {errors.password}
                                </span>
                              )}
                            </FormGroup>
                          </div>
                          <div className="form-row">
                            <FormGroup className="position-relative col-md-6 form-group">
                              <Label>Confirm Password</Label>
                              <Field
                                name="passwordConfirm"
                                type="password"
                                values={values.passwordConfirm}
                                placeholder="Confirm Password here..."
                                autoComplete="off"
                                className={
                                  errors.passwordConfirm &&
                                  touched.passwordConfirm
                                    ? "form-control error"
                                    : "form-control"
                                }
                              />
                              {errors.passwordConfirm &&
                                touched.passwordConfirm && (
                                  <span className={this.feedback}>
                                    {errors.passwordConfirm}
                                  </span>
                                )}
                            </FormGroup>
                          </div>
                          <div className="divider row" />
                          <div className="d-flex align-items-center">
                            <h6 className="mb-0">
                              <a
                                href="javascript:void(0);"
                                className="text-primary"
                              >
                                Sign in existing account
                              </a>
                            </h6>
                            <div className="ml-auto">
                              <Button
                                className="float-righ"
                                style={{ backgroundColor: "blue" }}
                                type="submit"
                                disabled={!isValid || isSubmitting}
                              >
                                Reset Password
                              </Button>
                            </div>
                          </div>
                        </Form>
                      </div>
                    </div>
                  </div>
                </Row>
              </div>
            );
          }}
        </Formik>
      </React.Fragment>
    );
  }
}

ResetPassword.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

export default ResetPassword;
