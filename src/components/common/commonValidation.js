import * as Yup from "yup";

const requiredMessage = "Field is required";

const mixedFieldRequired = () =>
  Yup.mixed()
    .required(requiredMessage)
    .test("is-not-empty", requiredMessage, (value) => value !== "" && value !== null);

const stringRequired = () => Yup.string().required(requiredMessage);

const numberRequired = () =>
  Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .integer()
    .required(requiredMessage);

export { requiredMessage, mixedFieldRequired, stringRequired, numberRequired };
