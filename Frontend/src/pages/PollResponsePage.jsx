
const PollResponsePage = ({ onNavigate }) => {
  const questions = [
    {
      text: "Which feature would you like to see next?",
      options: [
        "Advanced Analytics",
        "Team Collaboration",
        "API Access",
        "Mobile App",
      ],
      required: true,
    },
    {
      text: "How often do you run surveys?",
      options: [
        "Daily",
        "Weekly",
        "Monthly",
        "Rarely",
      ],
      required: true,
    },
    {
      text: "How did you hear about PollStack?",
      options: [
        "Social Media",
        "Word of Mouth",
        "Search Engine",
        "Referral",
      ],
      required: false,
    },
  ];

  return (
    <div className="noise flex min-h-screen items-center justify-center bg-gray-50 px-4 py-16">
      
      <div className="w-full max-w-xl">
        
        {/* Poll Header */}
        <div className="animate-fade-up mb-4 rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
          
          <div className="mb-3 flex items-center justify-between">
            
            <span className="tag bg-black text-xs text-white">
              Live
            </span>

            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              
              <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-green-500"></span>

              Closes Dec 31, 2025
            </span>
          </div>

          <h1 className="font-display mb-2 text-2xl font-bold text-black">
            Product Feedback Q3 2025
          </h1>

          <p className="text-sm leading-relaxed text-gray-500">
            Help us understand what matters most to you.
            This survey takes about 2 minutes and is
            completely anonymous.
          </p>

          {/* Meta */}
          <div className="mt-4 flex items-center gap-4 border-t border-gray-50 pt-4">
            
            <span className="text-xs text-gray-400">
              3 questions
            </span>

            <span className="h-1 w-1 rounded-full bg-gray-300"></span>

            <span className="text-xs text-gray-400">
              ~2 min
            </span>

            <span className="h-1 w-1 rounded-full bg-gray-300"></span>

            <span className="text-xs text-gray-400">
              Anonymous
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-2 flex items-center justify-between px-1 animate-fade-up anim-delay-1">
          
          <span className="text-xs text-gray-400">
            Question 1 of 3
          </span>

          <span className="text-xs text-gray-400">
            33%
          </span>
        </div>

        <div className="mb-4 h-1 overflow-hidden rounded-full bg-gray-200 animate-fade-up anim-delay-1">
          <div
            className="progress-bar-inner h-full rounded-full bg-black"
            style={{ width: "33%" }}
          ></div>
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
            
            {/* Question */}
            <div className="mb-5 flex items-start gap-2">
              
              <span className="font-display mt-0.5 shrink-0 text-sm font-bold text-black">
                Q{qi + 1}.
              </span>

              <p className="text-sm font-semibold leading-relaxed text-black">
                {q.text}

                {q.required && (
                  <span className="ml-1 text-red-400">
                    *
                  </span>
                )}
              </p>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2">
              {q.options.map((opt, oi) => (
                <label
                  key={oi}
                  className={`poll-option flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 ${
                    qi === 0 && oi === 0
                      ? "selected"
                      : ""
                  }`}
                >
                  
                  <div
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                      qi === 0 && oi === 0
                        ? "border-white"
                        : "border-gray-300"
                    }`}
                  >
                    {qi === 0 && oi === 0 && (
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    )}
                  </div>

                  <span className="text-sm">
                    {opt}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Submit */}
        <button className="btn-primary mt-2 w-full rounded-xl bg-black py-4 text-sm font-semibold text-white animate-fade-up anim-delay-3">
          Submit Responses →
        </button>

        <p className="mt-3 text-center text-xs text-gray-400 animate-fade-up anim-delay-4">
          Your response is anonymous and cannot be traced
          back to you.
        </p>
      </div>
    </div>
  );
};

export default PollResponsePage;
