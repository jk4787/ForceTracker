import * as Yup from "yup";

const addSubcontractorSchema = Yup.object().shape({
  firstName: Yup.string().required("First name required").max(100),
  lastName: Yup.string().required("Last name required").max(100),
  mi: Yup.string().max(2),
  avatarUrl: Yup.string()
    .min(4, "Minimum of 4 characters")
    .max(255, "Maximum of 255 characters accepted"),
  lineOne: Yup.string()
    .required("Address required")
    .min(4, "Minimum of 4 characters")
    .max(255, "Maximum of 255 characters accepted"),
  lineTwo: Yup.string().max(255, "Maximum of 255 characters accepted"),
  city: Yup.string()
    .required("City required")
    .min(2, "Minimum of 2 characters")
    .max(255, "Maximum of 255 characters accepted"),
  stateId: Yup.number().required("State is required").min(1),
  zip: Yup.string().max(50, "Maximum of 50 characters accepted"),
  locationTypeId: Yup.number().min(1, "Required").required(),
  //latitude: Yup.number().min(-90).max(90).required(),
  //longitude: Yup.number().min(-180).max(180).required(),
  //createdBy: Yup.number().required(),
  name: Yup.string()
    //.min(1, "Minimum of 1 character")
    .max(100, "Maximum of 100 characters accepted"),
  phone: Yup.string().max(20, "Maximum of 20 characters accepted"),
  industryId: Yup.number().required("Required"),
  siteUrl: Yup.string()
    .max(255, "Maximum of 255 characters accepted")
    .nullable(),
  acceptLocation: Yup.bool().oneOf([true], "required"),
});

const addSubcontractorUpdateSchema = Yup.object().shape({
  userProfileId: Yup.number().required("Number required"),
  name: Yup.string()
    //.min(1, "Minimum of 1 character")
    .max(100, "Maximum of 100 characters accepted"),
  locationId: Yup.number(),
  phone: Yup.string().max(20, "Maximum of 20 characters accepted"),
  industryId: Yup.number().required("Required"),
  siteUrl: Yup.string().max(255, "Maximum of 255 characters accepted"),
  isActive: Yup.bool().required("Status required"),
});

export { addSubcontractorSchema, addSubcontractorUpdateSchema };
