const PollResultsPage = ({ onNavigate }) => {
  const questions = [
    {
      text: "Which feature would you like to see next?",
      total: 1284,
      options: [
        {
          label: "Advanced Analytics",
          count: 539,
          pct: 42,
        },
        {
          label: "Team Collaboration",
          count: 360,
          pct: 28,
        },
        {
          label: "API Access",
          count: 231,
          pct: 18,
        },
        {
          label: "Mobile App",
          count: 154,
          pct: 12,
        },
      ],
    },

    {
      text: "How often do you run surveys?",
      total: 1284,
      options: [
        {
          label: "Daily",
          count: 128,
          pct: 10,
        },
        {
          label: "Weekly",
          count: 513,
          pct: 40,
        },
        {
          label: "Monthly",
          count: 411,
          pct: 32,
        },
        {
          label: "Rarely",
          count: 232,
          pct: 18,
        },
      ],
    },
  ];

  return (
    <div className="noise min-h-screen bg-gray-50 px-4 py-16">
      
      <div className="mx-auto max-w-2xl">
        
        {/* Header */}
        <div className="animate-fade-up mb-6 rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
          
          <div className="mb-4 flex items-center justify-between">
            
            <span className="tag bg-gray-900 text-xs text-white">
              Published Results
            </span>

            <span className="text-xs text-gray-400">
              Closed Dec 31, 2025
            </span>
          </div>

          <h1 className="font-display mb-2 text-2xl font-bold text-black">
            Product Feedback Q3 2025
          </h1>

          <p className="text-sm text-gray-500">
            Final results are now public. Thank you to all
            respondents!
          </p>

          {/* Summary Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-50 pt-6">
            {[
              ["1,284", "Total Responses"],
              ["94.2%", "Completion Rate"],
              ["1m 42s", "Avg. Time"],
            ].map(([v, l], index) => (
              <div
                key={l}
                className="text-center"
              >
                <p className="font-display text-xl font-bold text-black">
                  {v}
                </p>

                <p className="mt-0.5 text-xs text-gray-400">
                  {l}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Questions */}
        {questions.map((q, qi) => (
          <div
            key={qi}
            className="animate-fade-up mb-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            style={{
              animationDelay: `${qi * 0.08}s`,
            }}
          >
            
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Question {qi + 1}
            </p>

            <h3 className="mb-5 text-sm font-semibold text-black">
              {q.text}
            </h3>

            {/* Options */}
            <div className="flex flex-col gap-4">
              {q.options.map((opt, oi) => (
                <div key={oi}>
                  
                  <div className="mb-1.5 flex items-center justify-between">
                    
                    <span className="text-sm text-black">
                      {opt.label}
                    </span>

                    <div className="flex items-center gap-2">
                      
                      <span className="text-xs text-gray-400">
                        {opt.count.toLocaleString()}
                      </span>

                      <span className="w-10 text-right text-sm font-bold text-black">
                        {opt.pct}%
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`progress-bar-inner h-full rounded-full ${
                        oi === 0
                          ? "bg-black"
                          : "bg-gray-300"
                      }`}
                      style={{
                        width: `${opt.pct}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-gray-400">
              {q.total.toLocaleString()} total responses
            </p>
          </div>
        ))}

        {/* Share Results */}
        <div className="animate-fade-up anim-delay-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          
          <h3 className="font-display mb-2 text-base font-semibold text-black">
            Share these results
          </h3>

          <p className="mb-4 text-sm text-gray-500">
            Anyone with this link can view the published
            results.
          </p>

          <div className="flex items-center gap-2">
            
            <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-xs text-gray-500">
              https://pollstack.com/p/product-feedback-q3-2026
            </div>

            <button className="btn-primary shrink-0 rounded-xl bg-black px-4 py-3 text-xs font-semibold text-white">
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollResultsPage;
