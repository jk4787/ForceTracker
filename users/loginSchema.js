import * as Yup from 'yup'

const loginSchema = Yup.object().shape({
    email: Yup.string()
        .required()
        .email("Valid email address is required")
        .min(2, "Minimum of 2 characters required")
        .max(100, "Maximum of 100 characters accepted"),
    password: Yup.string()
        .required("Password must be between 8 and 100 characters")
        .min(8, "Minimum of 8 characters required")
        .max(100, "Maximum of 100 characters allowed"),

})

export {
    loginSchema
}