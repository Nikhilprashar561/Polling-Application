import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../Components/AuthLayout";
import InputField from "../Components/InputField";

const LoginPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    }, mode: "all"
  });

  const onSubmit = (data) => {
    console.log("Login data:", data);
    // Handle login submission here
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your PollVault account"
      footer={
        <>
          Don't have an account?{" "}
          
          <span
            onClick={() => navigate("/register")}
            className="underline-hover cursor-pointer font-semibold text-black"
          >
            Get started
          </span>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Email address"
          type="email"
          placeholder="you@example.com"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email",
            },
          })}
          error={errors.email?.message}
        />
        {errors.email && <span>{errors.email?.message}</span>}

        <InputField
          label="Password"
          type="password"
          placeholder="......."
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          />
          {errors.password && <span>{errors.password?.message}</span>}

        <div className="mb-6 flex items-center justify-between animate-fade-up anim-delay-1">
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" {...register("rememberMe")} />

            <span className="text-xs text-gray-500">
              Remember me
            </span>
          </label>

          <span className="underline-hover cursor-pointer text-xs font-medium text-black">
            Forgot password?
          </span>
          {errors.rememberMe && <span>{errors.rememberMe?.message}</span>}
        </div>

        <button type="submit" className="btn-primary w-full rounded-xl bg-black py-3.5 text-sm font-semibold text-white animate-fade-up anim-delay-2">
          Sign In
        </button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
