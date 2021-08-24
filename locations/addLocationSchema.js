import * as Yup from "yup";

const addLocationSchema = Yup.object().shape({
  lineOne: Yup.string()
    .required("required")
    .min(4, "address must be at least 4 characters")
    .max(255),
  lineTwo: Yup.string().notRequired().max(255),
  city: Yup.string().required("required").min(2).max(255),
  stateId: Yup.number().min(1, "please select an option").required(),
  zip: Yup.string().notRequired().max(50),
  locationTypeId: Yup.number().min(1, "please select an option").required(),
  acceptLocation: Yup.bool().oneOf([true], "required"),
  example: Yup.string().required(),
});

export { addLocationSchema };
