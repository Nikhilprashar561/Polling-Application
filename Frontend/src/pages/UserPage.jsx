import InputField from "../Components/InputField";
import Sidebar from "../Components/Sidebar";

const UserPage = ({ onNavigate }) => (
  <div className="flex min-h-screen pt-16 bg-white">
    <Sidebar active="user" onNavigate={onNavigate} />

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
            <p
              className="text-black"
              style={{ fontWeight: 600 }}
            >
              Jane Doe
            </p>

            <p className="mb-3 text-sm text-gray-400">
              jane@example.com
            </p>

            <button
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-black transition-colors hover:border-black"
              style={{ fontWeight: 500 }}
            >
              Change Photo
            </button>
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField label="Full Name" placeholder="Jane Doe" />
          <InputField label="Username" placeholder="@janedoe" />
        </div>

        <InputField
          label="Email Address"
          type="email"
          placeholder="jane@example.com"
        />

        <InputField
          label="Organization"
          placeholder="Acme Corp (optional)"
        />

        <div className="flex justify-end">
          <button
            className="btn-primary rounded-xl bg-black px-6 py-2.5 text-sm text-white"
            style={{ fontWeight: 600 }}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Password */}
      <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-fade-up anim-delay-3">
        <h2
          className="font-display mb-5 text-base text-black"
          style={{ fontWeight: 600 }}
        >
          Change Password
        </h2>

        <InputField
          label="Current Password"
          type="password"
          placeholder="••••••••"
        />

        <InputField
          label="New Password"
          type="password"
          placeholder="••••••••"
        />

        <InputField
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          hint="At least 8 characters with letters and numbers."
        />

        <div className="flex justify-end">
          <button
            className="btn-primary rounded-xl bg-black px-6 py-2.5 text-sm text-white"
            style={{ fontWeight: 600 }}
          >
            Update Password
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-fade-up anim-delay-4">
        <h2
          className="font-display mb-5 text-base text-black"
          style={{ fontWeight: 600 }}
        >
          Notification Preferences
        </h2>

        {[
          {
            label: "New response received",
            sub: "Get notified when someone responds to your poll",
          },
          {
            label: "Poll expiry reminder",
            sub: "Remind me 24 hours before a poll closes",
          },
          {
            label: "Weekly summary",
            sub: "Receive a weekly digest of your poll activity",
          },
          {
            label: "Product updates & news",
            sub: "Stay informed about new features",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between border-b border-gray-50 py-3.5 last:border-0"
          >
            <div>
              <p
                className="text-sm text-black"
                style={{ fontWeight: 500 }}
              >
                {item.label}
              </p>

              <p className="mt-0.5 text-xs text-gray-400">
                {item.sub}
              </p>
            </div>

            <div className="relative h-6 w-10 shrink-0 cursor-pointer">
              <div className="h-6 w-10 rounded-full bg-black"></div>

              <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm"></div>
            </div>
          </div>
        ))}
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
          <button className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm text-gray-600 transition-colors hover:border-gray-400">
            Export Data
          </button>

          <button className="rounded-xl border border-red-200 px-5 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50">
            Delete Account
          </button>
        </div>
      </div>
    </main>
  </div>
);

export default UserPage;
