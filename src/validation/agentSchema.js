import * as yup from "yup";

export const agentSchema = yup.object({
    name: yup.string().min(2),
    surname: yup.string().min(2),
    phone: yup.string().matches(/^[0-9]+$/),
    email: yup
    .string()
    .email()
    .matches(/^[a-zA-Z0-9._%+-]+@redberry\.ge$/),
    avatar: yup
    .mixed()
    .test("fileRequired", "ფოტო აუცილებელია", (value) => {
        return Boolean(value?.[0]);
    })
    .test("fileType", "მხოლოდ jpeg ან png ფორმატის ფაილი", (value) => {
        if (!value?.[0]) return false;
        const allowedTypes = ["image/jpeg", "image/png"];
        return allowedTypes.includes(value[0].type);
    })
    .nullable(),
});