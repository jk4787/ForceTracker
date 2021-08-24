import * as Yup from 'yup'

const addUserSchema = Yup.object().shape({
    email: Yup.string()
        .required("Valid email address is required")
        .email("Valid email address is required")
        .min(2, "Minimum of 2 characters required")
        .max(100, "Maximum of 100 characters accepted"),
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
        .oneOf([Yup.ref('password'), null], "Passwords must match"),
    roleId: Yup.number()
        .required("Must Select A Role"),
    acceptTerms: Yup.bool()
        .oneOf([true], 'Accept Terms & Conditions is required'),

})

export {
    addUserSchema
}