import AuthLayout from "../Components/AuthLayout";
import InputField from "../Components/InputField";

const LoginPage = ({ onNavigate }) => (
  <AuthLayout
    title="Welcome back"
    subtitle="Sign in to your PollVault account"
    footer={
      <>
        Don't have an account?{" "}
        
        <span
          onClick={() => onNavigate("register")}
          className="underline-hover cursor-pointer font-semibold text-black"
        >
          Get started
        </span>
      </>
    }
  >
    <InputField
      label="Email address"
      type="email"
      placeholder="you@example.com"
    />

    <InputField
      label="Password"
      type="password"
      placeholder="••••••••••"
    />

    <div className="mb-6 flex items-center justify-between animate-fade-up anim-delay-1">
      <label className="flex cursor-pointer items-center gap-2">
        <input type="checkbox" />

        <span className="text-xs text-gray-500">
          Remember me
        </span>
      </label>

      <span className="underline-hover cursor-pointer text-xs font-medium text-black">
        Forgot password?
      </span>
    </div>

    <button className="btn-primary w-full rounded-xl bg-black py-3.5 text-sm font-semibold text-white animate-fade-up anim-delay-2">
      Sign In
    </button>
  </AuthLayout>
);

export default LoginPage;
