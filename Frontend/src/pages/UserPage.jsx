import { useForm } from "react-hook-form";
import InputField from "../Components/InputField";
import Sidebar from "../Components/Sidebar";

const UserPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { fullName: "", email: "", password: "" },
    mode: "all",
  });

  return (
    <>
      <div className="flex min-h-screen pt-16 bg-white">
        <Sidebar />

        <main className="flex-1 max-w-2xl px-6 py-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-8 animate-fade-up">
            <h1
              className="font-display text-2xl font-bold text-black"
              style={{ fontWeight: 700 }}
            >
              My Profile
            </h1>

            <p className="mt-1 text-sm text-gray-400">
              Manage your account details and preferences
            </p>
          </div>

          {/* Avatar section */}
          <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-fade-up anim-delay-1">
            <div className="flex items-center gap-5">
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-black font-display text-2xl font-bold text-white"
                style={{ fontWeight: 700 }}
              >
                JD
              </div>

              <div>
                <p className="text-black" style={{ fontWeight: 600 }}>
                  Jane Doe
                </p>

                <p className="mb-3 text-sm text-gray-400">jane@example.com</p>

                <div
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-black transition-colors hover:border-black"
                  style={{ fontWeight: 500 }}
                >
                  Change Photo
                </div>
              </div>
            </div>
          </div>

          {/* Personal info */}
          <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-fade-up anim-delay-2">
            <h2
              className="font-display mb-5 text-base text-black"
              style={{ fontWeight: 600 }}
            >
              Personal Information
            </h2>

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
                    message: "Full name must be at least 20 characters below",
                  },
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

            <div className="flex justify-end">
              <button
                className="btn-primary cursor-pointer rounded-xl bg-black px-6 py-2.5 text-sm text-white"
                style={{ fontWeight: 600 }}
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Danger zone */}
          <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm animate-fade-up">
            <h2
              className="font-display mb-2 text-base text-red-500"
              style={{ fontWeight: 600 }}
            >
              Danger Zone
            </h2>

            <p className="mb-4 text-sm text-gray-500">
              These actions are permanent and cannot be undone.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="rounded-xl border cursor-pointer border-gray-200 px-5 py-2.5 text-sm text-gray-600 transition-colors hover:border-gray-400">
                Export Data
              </button>

              <button className="rounded-xl cursor-pointer border border-red-200 px-5 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50">
                Delete Account
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default UserPage;
