import * as yup from "yup";

export const listingSchema = yup.object({
  address: yup.string().min(2).required(),
  image: yup
    .mixed()
    .test("fileRequired", "სურათი აუცილებელია", (value) => Boolean(value?.[0]))
    .test("fileType", "მხოლოდ სურათის ტიპის ფაილი", (value) => {
      if (!value?.[0]) return false;
      return value[0].type.startsWith("image/");
    })
    .test("fileSize", "სურათი არ უნდა აღემატებოდეს 1MB-ს", (value) => {
      if (!value?.[0]) return false;
      return value[0].size <= 1024 * 1024;
    })
    .nullable(),
  region_id: yup.string().required(),
  city_id: yup.string().required(),
  zip_code: yup.string().matches(/^[0-9]+$/).required(),
  price: yup.string().matches(/^[0-9]+(\.[0-9]+)?$/).required(),
  area: yup.string().matches(/^[0-9]+(\.[0-9]+)?$/).required(),
  bedrooms: yup
    .string()
    .matches(/^[0-9]+$/)
    .test("integer", "მთელი რიცხვი", (v) => Number.isInteger(Number(v)))
    .required(),
  description: yup
    .string()
    .test("minWords", "მინიმუმ 5 სიტყვა", (v) => v && v.trim().split(/\s+/).length >= 5)
    .required(),
  is_rental: yup.string().required(),
  agent_id: yup.string().required(),
});