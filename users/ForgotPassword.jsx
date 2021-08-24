import React from "react";
import { Formik, Field } from "formik";
import { FormGroup, Form, Button, Label, Row } from "reactstrap";
import * as Yup from "yup";
import logger from "sabio-debug";
import LeftPane from "../../layouts/public/LeftPane";
import { recoverPassword } from "../../services/userServices";
import Swal from "sweetalert2";

const _logger = logger.extend("SabioInit");
class Password extends React.Component {
  state = {
    formData: {
      email: "",
    },
  };
  handleSubmit = (values) => {
    _logger(values);
    recoverPassword(values)
      .then(this.onRecoverPasswordSuccess)
      .catch(this.onRecoverPasswordError);
  };

  onRecoverPasswordSuccess = (response) => {
    _logger(response);
    Swal.fire(
      "Email has been sent",
      "Please check inbox for link to reset password",
      "success"
    );
  };

  onRecoverPasswordError = (response) => {
    _logger(response);
    Swal.fire("Error!", "Invalid Email", "error");
  };

  feedback = "input-feedback text-danger pl-2";
  render() {
    return (
      <React.Fragment>
        <Formik
          enableReinitialize={true}
          validationSchema={Yup.object().shape({
            email: Yup.string().required("Required"),
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
                        <div>Forgot Password?</div>
                        <span>Use the form below to recover it.</span>
                      </h4>
                      <div className="divider row" />
                      <div>
                        <Form onSubmit={handleSubmit} className={"col-md-12"}>
                          <div className="form-row">
                            <FormGroup className="position-relative col-md-6 form-group">
                              <Label>Email</Label>
                              <Field
                                name="email"
                                type="text"
                                values={values.email}
                                placeholder="Email here..."
                                autoComplete="off"
                                className={
                                  errors.email && touched.email
                                    ? "form-control error"
                                    : "form-control"
                                }
                              />
                              {errors.email && touched.email && (
                                <span className={this.feedback}>
                                  {errors.email}
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
                                Recover Password
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

export default Password;
