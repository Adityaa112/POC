import type { UseFormReturn } from "react-hook-form";
import PasswordField from "@/pages/components/PasswordField";
import type { LoginFormValues } from "@/pages/schema/login.schema";
import InputField from "@/shared/components/InputField";

type LoginCredentialsFormProps = {
  loginForm: UseFormReturn<LoginFormValues>;
};

export default function LoginCredentialsForm({
  loginForm,
}: LoginCredentialsFormProps) {
  return (
    <>
      <InputField
        label="Mobile no. / Email / Client ID"
        placeholder="Enter your username"
        autoComplete="username"
        error={loginForm.formState.errors.username?.message}
        {...loginForm.register("username", {
          onChange: () => loginForm.clearErrors("username"),
        })}
      />
      <PasswordField
        label="Password / MPIN"
        placeholder="Enter your password"
        autoComplete="current-password"
        error={loginForm.formState.errors.password?.message}
        {...loginForm.register("password", {
          onChange: () => loginForm.clearErrors("password"),
        })}
      />
    </>
  );
}
