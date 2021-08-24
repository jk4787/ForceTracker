import React from "react";
import LeftPane from "../../layouts/public/LeftPane";
import { Row } from "reactstrap";
import { addUserSchema } from "./addUserSchema";
import * as usersService from "../../services/userServices";
import { Formik, Field } from "formik";
import { FormGroup, Form, Button, Label } from "reactstrap";
import Swal from "sweetalert2";
import PropTypes from "prop-types";

class Register extends React.Component {
  state = {
    settings: {
      dots: true,
      infinite: true,
      speed: 500,
      arrows: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      fade: true,
      initialSlide: 0,
      autoplay: true,
      adaptiveHeight: true,
    },
    formData: {
      email: "",
      password: "",
      passwordConfirm: "",
      roleId: 0,
      acceptTerms: false,
    },
  };

  onSubmitSuccess = () => {
    Swal.fire({ icon: "success", title: "Registration Complete" });
    this.props.history.push("/login")


  };

  onSubmitError = () => {
    Swal.fire({ icon: "error", title: "Please Check Form" });
  };

  handleSubmit = (values) => {
    values.roleId = parseInt(values.roleId)
    usersService.register(values)
      .then(this.onSubmitSuccess)
      .catch(this.onSubmitError)
  };
  feedback = "input-feedback text-danger pl-2"
  render() {

    return (
      <React.Fragment>

        <Formik
          enableReinitialize={true}
          validationSchema={addUserSchema}
          initialValues={this.state.formData}
          onSubmit={this.handleSubmit}
        >
          {props => {
            const {
              values,
              touched,
              errors,
              handleSubmit,
              isValid,

            } = props;
            return (

              <div className="h-100">
                <Row className="h-100 no-gutters">
                  {/* Left Pane */}
                  <LeftPane settings={this.state.settings} />

                  {/* Login */}
                  <div className="h-100 d-flex bg-white justify-content-center align-items-center col-md-12 col-lg-8">
                    <div className="mx-auto app-login-box col-sm-12 col-md-10 col-lg-9">
                      <div className="dropdown-menu-header ">
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

                      <div className="col-md-12">
                        <h4 className="mb-0 pt-3">
                          <span className="d-block">Welcome,</span>
                          <span>
                            It only takes a{" "}
                            <span className="text-success">few seconds</span> to
                            create your account
                          </span>
                        </h4>
                      </div>
                      <div>
                        <Form onSubmit={handleSubmit} className={"col-md-12"}>
                          <div className="form-row">
                            <FormGroup className="position-relative col-md-5 form-group">
                              <Label>Email</Label>
                              <Field
                                name="email"
                                type="text"
                                values={values.email}
                                placeholder="Email"
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

                            <FormGroup className="position-relative col-md-5 form-group">
                              <Label>Account Type</Label>
                              <Field
                                name="roleId"
                                component="select"
                                values={values.roleId}
                                label="Account Type"
                                className={
                                  errors.roleId && touched.roleId
                                    ? "form-control error"
                                    : "form-control"
                                }
                                as="select"
                              >
                                <option value="">Select Account Type</option>
                                <option value="2">Individual</option>
                                <option value="3">Business</option>
                              </Field>
                              {errors.roleId && touched.roleId && (
                                <span className={this.feedback}>
                                  {errors.roleId}
                                </span>
                              )}
                            </FormGroup>
                          </div>
                          <div className="form-row">
                            <FormGroup className="position-relative col-md-5 form-group">
                              <Label>Password</Label>
                              <Field
                                name="password"
                                type="password"
                                values={values.password}
                                placeholder="Password"
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

                            <FormGroup className="position-relative col-md-5 form-group">
                              <Label>Confirm Password</Label>
                              <Field
                                name="passwordConfirm"
                                type="password"
                                values={values.passwordConfirm}
                                placeholder="Confirm Password"
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

                          <div className="mt-3 position-relative form-check">
                            <Field
                              value={values.acceptTerms}
                              type="checkbox"
                              name="acceptTerms"
                              className={'form-check-input ' + (errors.acceptTerms && touched.acceptTerms ? ' is-invalid' : '')} />
                            <label htmlFor="acceptTerms" className="form-check-label">Accept Terms & Conditions</label>
                          </div>
                          <div className="mt-4 d-flex align-items-center">
                            <h5 className="mb-2">
                              Already have an account?
                                                            <span style={{ paddingRight: "8px" }} />
                              <a href="/login" className="text-primary">
                                Sign in
                                                                    </a>

                            </h5>
                            <div className="ml-auto">
                              <Button type="submit" onClick={handleSubmit} style={{ backgroundColor: "blue" }} className="btn-wide btn-pill btn-shadow btn-hover-shine btn btn-primary btn-lg" disabled={!isValid}>
                                Register
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

    )
  }
}

Register.propTypes = {
  history: PropTypes.shape({
    location: PropTypes.shape({
      state: PropTypes.shape({
        newUser: PropTypes.shape({
          email: PropTypes.string,
          roles: PropTypes.arrayOf(PropTypes.string),
          id: PropTypes.number,
          name: PropTypes.string,
        }),
        type: PropTypes.string
      }),
    }),
    push: PropTypes.func
  }),

}

export default Register;
