import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../Components/AuthLayout";

const RegisterPage = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      agreeToTerms: false,
    },
    mode: "all",
  });

  const onSubmit = (data) => {
    console.log("Register data:", data);
    // Handle registration submission here
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join PollStack and start collecting feedback"
      footer={
        <>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="underline-hover cursor-pointer font-semibold text-black"
          >
            Sign in
          </span>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>

        <label className="block mb-1.5 text-sm font-medium text-black">
          Full name
          <input
            className="input-field w-full mt-1.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 transition-all duration-200"
            type="text"
            placeholder="Nikhil Prashar"
            {...register("fullName", {
            required: "Full name is required",
            minLength: {
              value: 2,
              message: "Full name must be at least 2 characters",
            },
            maxLength: {
              value: 20,
              message: "Full name must be at least 20 characters below"
            }
          })}
          />
          <span className="text-xs leading-relaxed text-gray-500">
            {errors.fullName && (
              <span className="block mb-2 ml-4 text-red-500 text-xs mt-1">
                {errors.fullName.message}
              </span>
            )}
          </span>
        </label>

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

        <label className="mb-6 flex cursor-pointer items-start gap-2.5 animate-fade-up anim-delay-1">
          <input
            type="checkbox"
            className="mt-0.5"
            {...register("agreeToTerms", {
              required:
                "You must agree to the Terms of Service and Privacy Policy",
            })}
          />

          <span className="text-xs leading-relaxed text-gray-500">
            I agree to the{" "}
            <span className="cursor-pointer underline text-black">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="cursor-pointer underline text-black">
              Privacy Policy
            </span>
            {errors.agreeToTerms && (
              <span className="block text-red-500 text-xs mt-1">
                {errors.agreeToTerms.message}
              </span>
            )}
          </span>
        </label>

        <button
          type="submit"
          className="btn-primary cursor-pointer animate-fade-up anim-delay-2 w-full rounded-xl bg-black py-3.5 text-sm font-semibold text-white"
        >
          Create Account
        </button>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
