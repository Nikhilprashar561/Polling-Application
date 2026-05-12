import AuthLayout from "../Components/AuthLayout";
import InputField from "../Components/InputField";

const RegisterPage = ({ onNavigate }) => (
  <AuthLayout
    title="Create account"
    subtitle="Join PollStack and start collecting feedback"
    footer={
      <>
        Already have an account?{" "}

        <span
          onClick={() => onNavigate("login")}
          className="underline-hover cursor-pointer font-semibold text-black"
        >
          Sign in
        </span>
      </>
    }
  >
    <InputField
      label="Full Name"
      placeholder="Jane Doe"
    />

    <InputField
      label="Email address"
      type="email"
      placeholder="you@example.com"
    />

    <InputField
      label="Password"
      type="password"
      placeholder="Min. 8 characters"
      hint="Use at least 8 characters with a mix of letters and numbers."
    />

    <label className="mb-6 flex cursor-pointer items-start gap-2.5 animate-fade-up anim-delay-1">
      <input
        type="checkbox"
        className="mt-0.5"
      />

      <span className="text-xs leading-relaxed text-gray-500">
        I agree to the{" "}

        <span className="cursor-pointer underline text-black">
          Terms of Service
        </span>

        {" "}and{" "}

        <span className="cursor-pointer underline text-black">
          Privacy Policy
        </span>
      </span>
    </label>

    <button className="btn-primary animate-fade-up anim-delay-2 w-full rounded-xl bg-black py-3.5 text-sm font-semibold text-white">
      Create Account
    </button>
  </AuthLayout>
);

export default RegisterPage;
