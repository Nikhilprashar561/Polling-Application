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
        <label className="block mb-1.5 text-sm font-medium text-black">
          Email
          <input
            className="input-field w-full mt-1.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 transition-all duration-200"
            type="email"
            placeholder="you@example.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email",
              },
            })}
          />
          <span className="text-xs leading-relaxed text-gray-500">
            {errors.email && (
              <span className="block mb-2 ml-4 text-red-500 text-xs mt-1">
                {errors.email.message}
              </span>
            )}
          </span>
        </label>

        <label className="block mb-4 text-sm font-medium text-black">
          Password
          <input
            className="input-field w-full mt-1.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 transition-all duration-200"
            type="password"
            placeholder="Min. 8 characters"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
          <span className="text-xs leading-relaxed text-gray-500">
            {errors.password && (
              <span className="block mb-2 ml-4 text-red-500 text-xs mt-1">
                {errors.password.message}
              </span>
            )}
          </span>
        </label>

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
        </div>

        <button type="submit" className="btn-primary cursor-pointer w-full rounded-xl bg-black py-3.5 text-sm font-semibold text-white animate-fade-up anim-delay-2">
          Sign In
        </button>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
