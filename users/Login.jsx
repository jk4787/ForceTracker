import React from "react"
import LeftPane from "../../layouts/public/LeftPane";
import { Row } from "reactstrap";
import { loginSchema } from "./loginSchema"
import * as userServices from "../../services/userServices"
import { Formik, Field, } from "formik";
import { FormGroup, Form, Button, Label } from "reactstrap";
import Swal from "sweetalert2"
import logger from "sabio-debug";


import PropTypes from "prop-types";


const _logger = logger.extend("Login");
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
                adaptiveHeight: true
            }
        }
    }

    handleSubmit = (values) => {
        userServices.login(values)
            .then(this.onLoginSuccess)
            .catch(this.onLoginError)

    };

    onLoginSuccess = (response) => {
        this.setState((prevState) => {
            return {
                ...prevState,
                avatarUrl: response.item.avatarUrl,
                name: response.item.name
            }
        })
        userServices.getCurrent()
            .then(this.onGetCurrentSuccess)
            .catch(this.onGetCurrentError)
        _logger(response, 'ON LOGIN SUCCESS')
    }

    getPath = (response) => {
        if (response.item.roles[0] === "Organization") {
            return "/organization/dashboard"
        }
        else if (response.item.roles[0] === "Individual") {
            return "/jobs"
        }
        else {
            return "/employees"
        }
    }

    onGetCurrentSuccess = (response) => {
        const newPath = this.getPath(response)

        this.props.history.push({
            pathname: newPath,
            state: {

                newUser: {
                    email: response.item.email,
                    roles: response.item.roles,
                    id: response.item.id,
                    name: this.state.name,
                    tenantId: response.item.tenantId,
                    avatarUrl: this.state.avatarUrl
                },
                type: "login"
            }
        })

        Swal.fire({ icon: "success", title: "Welcome Back!" })
        _logger(response)
    }

    onGetCurrentError = (response) => {
        this.onLoginError()
        return response

    }

    onLoginError = () => {
        Swal.fire({ icon: "error", title: "Please Check Input Fields." })

    }





    feedback = "input-feedback text-danger pl-2"
    render() {
        return (
            <React.Fragment>
                <Formik
                    enableReinitialize={true}
                    validationSchema={loginSchema}
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
                                                    <div className="menu-header-image" style={{ backgroundImage: `url('assets/images/sidebar/abstract4.jpg')` }}></div>
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
                                                <span className="d-block">Welcome back,</span>
                                                <span>Please sign in to your account.</span>
                                            </h4>
                                            <h6 className="mt-3">
                                                No account?{" "}
                                                <a href="/register" className="text-primary">
                                                    Sign up now
                            </a>
                                            </h6>
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
                                                                placeholder="Email"
                                                                autoComplete="off"
                                                                className={
                                                                    errors.email && touched.email
                                                                        ? "form-control error"
                                                                        : "form-control"
                                                                }
                                                            />
                                                            {errors.email && touched.email && (
                                                                <span className={this.feedback}>{errors.email}</span>
                                                            )}
                                                        </FormGroup>

                                                        <FormGroup className="position-relative col-md-6 form-group">
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
                                                                <span className={this.feedback}>{errors.password}</span>
                                                            )}
                                                        </FormGroup>
                                                    </div>
                                                    <div className="position-relative form-check">
                                                        <input
                                                            name="check"
                                                            id="exampleCheck"
                                                            type="checkbox"
                                                            className="form-check-input"
                                                        />
                                                        <label htmlFor="exampleCheck" className="form-check-label">
                                                            Keep me logged in
                                </label>
                                                    </div>
                                                    <div className="divider row" />
                                                    <div className="d-flex align-items-center">
                                                        <div className="ml-auto">
                                                            <a href="/recoverpassword" className="btn-lg btn btn-link">
                                                                Recover Password
                                  </a>
                                                            <Button className="float-righ" style={{ backgroundColor: "blue" }} type="submit" disabled={!isValid}>
                                                                Login to Dashboard
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

Login.propTypes = {
    history: PropTypes.shape({
        location: PropTypes.shape({

        }),
        push: PropTypes.func,
    }),
    
    
}


export default Login;