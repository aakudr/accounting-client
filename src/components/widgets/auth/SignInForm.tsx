import { Input } from "shared/ui/input";
import { Formik } from "formik";
import * as yup from "yup";
import { Label } from "shared/ui/label";
import { Button } from "@/components/shared/ui/button";

export const SignInForm = () => {
  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={yup.object({
        email: yup.string().email("Invalid email address").required("Required"),
        password: yup.string().required("Required"),
      })}
      onSubmit={(values) => {
        console.log(values);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
      }) => {
        return (
          <form className="flex flex-col gap-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input name="email" type="email" placeholder="user@mail.ru" />
            </div>

            <div>
              <Label htmlFor="email">Пароль</Label>
              <Input
                name="password"
                type="password"
                placeholder="●●●●●●●●●●●●"
              />
            </div>

            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              disabled={!!errors.email && !!errors.password}
            >
              Войти
            </Button>
          </form>
        );
      }}
    </Formik>
  );
};
