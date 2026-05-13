import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: "⚡",
      title: "Instant Deploy",
      desc: "Create and share your poll in under 60 seconds. Zero setup required.",
    },
    {
      icon: "🔒",
      title: "Anonymous or Auth",
      desc: "Let respondents choose anonymity or require sign-in for accountability.",
    },
    {
      icon: "⏱",
      title: "Auto Expiry",
      desc: "Set an expiry time — polls close automatically when the window ends.",
    },
    {
      icon: "📊",
      title: "Live Analytics",
      desc: "Real-time charts and breakdowns as responses pour in.",
    },
    {
      icon: "🔗",
      title: "Shareable Links",
      desc: "One link to share anywhere — email, Slack, social, or SMS.",
    },
    {
      icon: "📢",
      title: "Publish Results",
      desc: "Publish final results to the same link for transparent outcomes.",
    },
  ];

  const steps = [
    {
      n: "01",
      title: "Create",
      desc: "Build your poll with custom questions and options in minutes.",
    },
    {
      n: "02",
      title: "Share",
      desc: "Copy the public link and send it to your audience anywhere.",
    },
    {
      n: "03",
      title: "Collect",
      desc: "Watch responses come in live with real-time analytics.",
    },
    {
      n: "04",
      title: "Publish",
      desc: "Finalize and publish results for full transparency.",
    },
  ];

  const marqueeItems = [
    "Anonymous Polls",
    "Live Analytics",
    "Expiry Timers",
    "Shareable Links",
    "Multi-Question",
    "Option Counts",
    "Response Insights",
    "Public Results",
  ];

  return (
    <div className="pt-16 overflow-hidden noise">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-4xl">
          <div className="animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5">
            <span className="live-dot inline-block h-2 w-2 rounded-full bg-black"></span>

            <span className="text-xs font-medium text-gray-600">
              Now live — Start collecting feedback today
            </span>
          </div>

          <h1 className="font-display animate-fade-up anim-delay-1 mb-6 text-5xl font-extrabold leading-none tracking-tight text-black md:text-7xl">
            Polls that
            <br />

            <span className="relative inline-block">
              <span className="relative z-10">
                actually work.
              </span>

              <span className="absolute bottom-2 left-0 right-0 z-0 h-3 rounded bg-black/10"></span>
            </span>
          </h1>

          <p className="animate-fade-up anim-delay-2 mb-10 max-w-xl text-lg leading-relaxed text-gray-500">
            Create polls, share through a public link, collect feedback — then
            publish results for complete transparency. Built for teams who care
            about real opinions.
          </p>

          <div className="animate-fade-up anim-delay-3 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/register")}
              className="btn-primary rounded-full bg-black px-8 py-3.5 text-sm font-semibold text-white"
            >
              Start for free →
            </button>

            <button
              onClick={() => navigate("/poll-response")}
              className="rounded-full border border-gray-200 px-8 py-3.5 text-sm font-medium text-black transition-colors duration-200 hover:border-black"
            >
              See a live demo
            </button>
          </div>

          <p className="animate-fade-up anim-delay-4 mt-4 text-xs text-gray-400">
            No credit card required · Free forever plan available
          </p>
        </div>

        {/* Hero visual */}
        <div className="relative mt-20">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-10">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Mock poll card */}
              <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:col-span-2">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="mb-1 text-xs text-gray-400">
                      ACTIVE POLL
                    </p>

                    <h3 className="font-display text-base font-bold text-black">
                      Product Feedback Q3 2025
                    </h3>
                  </div>

                  <span className="tag rounded-full bg-black text-white">
                    Live
                  </span>
                </div>

                <p className="mb-4 text-sm text-gray-600">
                  Which feature would you like to see next?
                </p>

                {[
                  "Advanced Analytics",
                  "Team Collaboration",
                  "API Access",
                  "Mobile App",
                ].map((opt, i) => (
                  <div
                    key={opt}
                    className={`poll-option mb-2 flex items-center justify-between rounded-xl border p-3.5 ${
                      i === 0 ? "selected" : ""
                    }`}
                  >
                    <span className="text-sm">
                      {opt}
                    </span>

                    <span className="text-xs font-semibold">
                      {[42, 28, 18, 12][i]}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Mock stats */}
              <div className="flex flex-col gap-4">
                {[
                  {
                    label: "Total Responses",
                    value: "1,284",
                    delta: "+12% today",
                  },
                  {
                    label: "Completion Rate",
                    value: "94.2%",
                    delta: "Excellent",
                  },
                  {
                    label: "Avg. Time",
                    value: "1m 42s",
                    delta: "Very fast",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="stat-card rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <p className="mb-1 text-xs text-gray-400">
                      {s.label}
                    </p>

                    <p className="font-display text-2xl font-bold text-black">
                      {s.value}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                      {s.delta}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -top-3 right-8 hidden rounded-full bg-black px-3 py-1.5 text-xs text-white shadow-lg md:block">
            🔴 Collecting responses
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-gray-100 py-4">
        <div className="marquee-track whitespace-nowrap">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="mx-8 inline-flex items-center gap-2 text-sm font-medium text-gray-400"
            >
              <span className="h-1 w-1 rounded-full bg-gray-300"></span>

              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="mb-14">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Everything you need
          </p>

          <h2 className="font-display text-4xl font-bold tracking-tight text-black md:text-5xl">
            Built for real decisions
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-gray-100 p-7 transition-all duration-300 hover:border-gray-300 hover:shadow-md"
            >
              <div className="mb-4 text-2xl">
                {f.icon}
              </div>

              <h3 className="font-display mb-2 text-lg font-semibold text-black">
                {f.title}
              </h3>

              <p className="text-sm leading-relaxed text-gray-500">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="mb-14">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Simple process
            </p>

            <h2 className="font-display text-4xl font-bold tracking-tight text-black md:text-5xl">
              Four steps to insights
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                {i < steps.length - 1 && (
                  <div className="absolute left-[calc(100%+12px)] top-6 z-0 hidden h-px w-[calc(100%-24px)] bg-gray-200 lg:block"></div>
                )}

                <div className="font-display mb-3 text-4xl font-extrabold text-gray-100">
                  {s.n}
                </div>

                <h3 className="font-display mb-2 text-xl font-bold text-black">
                  {s.title}
                </h3>

                <p className="text-sm leading-relaxed text-gray-500">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="rounded-3xl bg-black p-12 text-center md:p-20">
          <h2 className="font-display mb-6 text-4xl font-extrabold tracking-tight text-white md:text-6xl">
            Ready to collect
            <br />
            real opinions?
          </h2>

          <button
            onClick={() => navigate("/register")}
            className="btn-primary rounded-full bg-white px-10 py-4 text-sm font-bold text-black"
          >
            Create your first poll — it's free
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;