import * as Yup from "yup";
const employeeSchema = Yup.object().shape({
  lineOne: Yup.string().required("Required").min(4).max(255),
  lineTwo: Yup.string().nullable().max(255),
  city: Yup.string().required("Required").min(2).max(255),
  stateId: Yup.number().min(1, "Select an option").required("Required"),
  zip: Yup.string().nullable().max(50),
  locationTypeId: Yup.number().min(1, "Select an option").required("Required"),
  firstName: Yup.string()
    .required("Required")
    .min(2, "Min 2 characters")
    .max(100, "Max 100 characters"),
  mi: Yup.string().max(2, "Max of 2 characters"),
  organizationId: Yup.number().min(1, "Select an option").required("Required"),
  lastName: Yup.string()
    .required("Required")
    .min(2, "Min 2 characters")
    .max(100, "Max 100 characters"),
  //email:
  dob: Yup.string().required("DOB is required"),
  phone: Yup.string().max(20, "Max 20 characters"),
  salaryTypeId: Yup.number().required("Required").min(1, "Select an option"),
  position: Yup.string().nullable().max(255, "Max 255 characters"),
  departmentId: Yup.number().min(1, "Select an option").nullable(),
  supervisor: Yup.string().nullable().max(200, "Max 200 characters"),
  avatarUrl: Yup.string().nullable(),
});
export { employeeSchema };
