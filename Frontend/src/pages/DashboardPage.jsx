import Sidebar from "../Components/Sidebar";

const DashboardPage = () => {
  const polls = [
    {
      title: "Product Feedback Q3",
      status: "active",
      responses: 1284,
      expires: "Dec 31, 2025",
      completion: 94,
    },
    {
      title: "Team Preferences Survey",
      status: "active",
      responses: 342,
      expires: "Jan 15, 2026",
      completion: 87,
    },
    {
      title: "UX Research — Onboarding",
      status: "closed",
      responses: 891,
      expires: "Ended",
      completion: 100,
    },
    {
      title: "Feature Priority Vote",
      status: "published",
      responses: 456,
      expires: "Published",
      completion: 100,
    },
    {
      title: "Company All-Hands Pulse",
      status: "draft",
      responses: 0,
      expires: "Not set",
      completion: 0,
    },
  ];

  const statusColor = {
    active: "bg-black text-white",
    closed: "bg-gray-100 text-gray-500",
    published: "bg-gray-900 text-white",
    draft: "bg-gray-100 text-gray-400",
  };

  return (
    <div className="flex min-h-screen pt-16 noise">
      <Sidebar />

      <main className="flex-1 overflow-auto px-6 py-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center animate-fade-up">
          <div>
            <h1 className="font-display text-2xl font-bold text-black">
              Dashboard
            </h1>

            <p className="mt-0.5 text-sm text-gray-400">
              Monday, December 16, 2025
            </p>
          </div>

          <button
            onClick={() => onNavigate("create-poll")}
            className="btn-primary self-start rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white sm:self-auto"
          >
            + New Poll
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              label: "Total Polls",
              value: "5",
              sub: "3 active",
            },
            {
              label: "Total Responses",
              value: "2,973",
              sub: "+128 today",
            },
            {
              label: "Avg. Completion",
              value: "91.2%",
              sub: "Excellent",
            },
            {
              label: "Published",
              value: "1",
              sub: "Results live",
            },
          ].map((s, index) => (
            <div
              key={s.label}
              className="stat-card animate-fade-up rounded-2xl border border-gray-100 bg-white p-5"
              style={{
                animationDelay: `${index * 0.08}s`,
              }}
            >
              <p className="mb-2 text-xs text-gray-400">
                {s.label}
              </p>

              <p className="font-display text-3xl font-bold text-black">
                {s.value}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {s.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="mb-8 grid gap-4 md:grid-cols-5">
          
          {/* Bar chart */}
          <div className="animate-fade-up rounded-2xl border border-gray-100 bg-white p-6 md:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-black">
                Responses This Week
              </h3>

              <span className="text-xs text-gray-400">
                Last 7 days
              </span>
            </div>

            <div className="flex h-32 items-end gap-2">
              {[40, 65, 52, 80, 92, 70, 88].map((h, i) => (
                <div
                  key={i}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div
                    className={`w-full rounded-t-lg ${
                      i === 6
                        ? "bg-black"
                        : "bg-gray-200"
                    }`}
                    style={{ height: `${h}%` }}
                  ></div>

                  <span className="text-xs text-gray-400">
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Donut */}
          <div className="animate-fade-up anim-delay-1 rounded-2xl border border-gray-100 bg-white p-6 md:col-span-2">
            <h3 className="font-display mb-4 text-base font-semibold text-black">
              Response Split
            </h3>

            <div className="relative mb-4 flex items-center justify-center">
              <svg
                viewBox="0 0 80 80"
                className="h-28 w-28"
              >
                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="12"
                />

                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  fill="none"
                  stroke="#0a0a0a"
                  strokeWidth="12"
                  strokeDasharray="113 75"
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />

                <circle
                  cx="40"
                  cy="40"
                  r="30"
                  fill="none"
                  stroke="#d1d5db"
                  strokeWidth="12"
                  strokeDasharray="45 143"
                  strokeLinecap="round"
                  transform="rotate(61 40 40)"
                />
              </svg>

              <div className="absolute text-center">
                <p className="font-display text-xl font-bold">
                  94%
                </p>

                <p className="text-xs text-gray-400">
                  complete
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {[
                ["Completed", "43%", "bg-black"],
                ["In Progress", "30%", "bg-gray-300"],
                ["Dropped", "27%", "bg-gray-100"],
              ].map(([l, v, c]) => (
                <div
                  key={l}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-sm ${c}`}
                    ></span>

                    <span className="text-xs text-gray-500">
                      {l}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-black">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Poll Table */}
        <div className="animate-fade-up anim-delay-2 overflow-hidden rounded-2xl border border-gray-100 bg-white">
          
          {/* Table Header */}
          <div className="flex items-center justify-between border-b border-gray-50 px-6 py-4">
            <h3 className="font-display text-base font-semibold text-black">
              Your Polls
            </h3>

            <div className="flex items-center gap-2">
              <input
                placeholder="Search..."
                className="input-field w-36 rounded-lg border border-gray-200 px-3 py-1.5 text-xs transition-colors focus:border-black focus:outline-none"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              
              <thead>
                <tr className="bg-gray-50 text-left">
                  
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Poll
                  </th>

                  <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:table-cell">
                    Status
                  </th>

                  <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 md:table-cell">
                    Responses
                  </th>

                  <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 lg:table-cell">
                    Expires
                  </th>

                  <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 lg:table-cell">
                    Completion
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {polls.map((p) => (
                  <tr
                    key={p.title}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-black">
                        {p.title}
                      </p>
                    </td>

                    <td className="hidden px-4 py-4 sm:table-cell">
                      <span
                        className={`tag text-xs capitalize ${statusColor[p.status]}`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="hidden px-4 py-4 text-gray-600 md:table-cell">
                      {p.responses.toLocaleString()}
                    </td>

                    <td className="hidden px-4 py-4 text-xs text-gray-500 lg:table-cell">
                      {p.expires}
                    </td>

                    <td className="hidden px-4 py-4 lg:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-100">
                          <div
                            className="progress-bar-inner h-full rounded-full bg-black"
                            style={{
                              width: `${p.completion}%`,
                            }}
                          ></div>
                        </div>

                        <span className="text-xs text-gray-500">
                          {p.completion}%
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        
                        <button
                          onClick={() =>
                            onNavigate("poll-results")
                          }
                          className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-500 transition-colors hover:border-black hover:text-black"
                        >
                          View
                        </button>

                        <button className="rounded-lg px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-gray-100 hover:text-black">
                          ···
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
