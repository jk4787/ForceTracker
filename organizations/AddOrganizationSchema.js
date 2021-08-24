import * as Yup from 'yup';

const AddOrganizationSchema = Yup.object().shape({
  lineOne: Yup.string().required("address is a required field").min(4).max(255),
  lineTwo: Yup.string().notRequired().max(255),
  city: Yup.string().required().min(2).max(255),
  stateId: Yup.number().min(1, "state is a required field").required(),
  zip: Yup.string().notRequired().max(50),
  locationTypeId: Yup.number().min(1, "location type required").required(),
  organizationTypeId: Yup.number()
    .required('Required')
    .min(1),
  name: Yup.string()
    .required('Required')
    .max(200, 'Can not exceed 200 characters'),
  description: Yup.string()
    .min(2, 'Minimum of 2 characters')
    .max(200, 'Can not exceed 200 characters'),
  logo: Yup.string()
    .max(255, 'Can not exceed 255 characters'),
  primaryLocationId: Yup.number(),
  businessPhone: Yup.string()
    .max(20, 'Can not exceed 20 characters'),
  siteUrl: Yup.string()
    .max(255, 'Can not exceed 255 characters'),
  employeesNumber: Yup.number(),
  acceptLocation: Yup.bool().oneOf([true], "required"),
})

export {
  AddOrganizationSchema
}
