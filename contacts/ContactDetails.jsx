import React from 'react'
import PropTypes from "prop-types";


const ContactDetails = (props) => {
    const closeModal = (e) => {
        props.modalClose(e)
    }
    return (
        <div
            className="modal fade show"
            id="exampleModal"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-modal="true"
            style={{ display: "block", paddingRight: 17, paddingTop: 75 }}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">

                        </h5>
                        <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                            onClick={closeModal}
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="modal-body">
                            <center>
                                <img
                                    alt="contact-avatar"
                                    src={props.contact.imageUrl}
                                    name="aboutme"
                                    width={140}
                                    height={140}
                                    border={0}
                                    className="img-circle"
                                />
                                <h3 className="media-heading">
                                    {props.contact.name}
                                </h3>

                            </center>
                            <hr />

                            <div className="row">
                                <div className="col-md-6">
                                    <strong>Phone: </strong>
                                    <br />
                                    {props.contact.phone}
                                </div>
                                <div className="col-md-6">
                                    <strong>Email: </strong>
                                    <br />
                                    {props.contact.email}
                                </div>
                            </div>



                            <br />
                            <center>
                                <p className="text-left">
                                    <strong>Notes: </strong>
                                    <br />
                                    {props.contact.notes}
                                </p>
                                <br />
                            </center>

                        </div>


                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-dismiss="modal"
                            onClick={closeModal}
                        >
                            Close
        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-dismiss="modal"
                            onClick={closeModal}
                        >
                            Update Contact
        </button>

                    </div>
                </div>
            </div>
        </div>

    )
}

ContactDetails.propTypes = {
    contactDetails: PropTypes.shape({
        name: PropTypes.string,
    }),
    modalClose: PropTypes.func,
    contact: PropTypes.shape({
        name: PropTypes.string,
        imageUrl: PropTypes.string,
        phone: PropTypes.string,
        notes: PropTypes.string,
        email: PropTypes.string,
    })
}

export default ContactDetails