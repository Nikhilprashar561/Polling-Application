import InputField from "../Components/InputField";
import Sidebar from "../Components/Sidebar";

const CreatePollPage = ({ onNavigate }) => {
  const questions = [
    {
      text: "Which feature should we prioritize?",
      options: [
        "Analytics Dashboard",
        "API Integration",
        "Mobile App",
        "Team Collaboration",
      ],
      required: true,
    },
    {
      text: "How did you hear about us?",
      options: [
        "Social Media",
        "Word of Mouth",
        "Search Engine",
        "Other",
      ],
      required: false,
    },
  ];

  return (
    <div className="flex min-h-screen pt-16 noise">
      
      <Sidebar 
        active="create-poll"
        onNavigate={onNavigate}
      />

      <main className="flex-1 max-w-3xl px-6 py-8">
        
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <h1 className="font-display text-2xl font-bold text-black">
            Create New Poll
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Fill in the details and add your questions below
          </p>
        </div>

        {/* Poll Details */}
        <div className="mb-5 animate-fade-up rounded-2xl border border-gray-200 bg-white p-6">
          
          <h2 className="font-display mb-4 text-base font-semibold text-black">
            Poll Details
          </h2>

          <InputField
            label="Poll Title"
            placeholder="e.g. Product Feedback Q4 2025"
          />

          {/* Description */}
          <div className="mb-5">
            <label className="mb-1.5 block text-sm font-medium text-black">
              Description{" "}
              <span className="font-normal text-gray-400">
                (optional)
              </span>
            </label>

            <textarea
              rows={3}
              placeholder="Give respondents a bit of context..."
              className="input-field w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 transition-all"
            />
          </div>

          {/* Date + Response */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            
            <div>
              <label className="mb-1.5 block text-sm font-medium text-black">
                Expiry Date & Time
              </label>

              <input
                type="datetime-local"
                className="input-field w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black transition-all"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-black">
                Response Type
              </label>

              <select className="input-field w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black transition-all">
                <option>
                  Anonymous (anyone can respond)
                </option>

                <option>
                  Authenticated (sign-in required)
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="mb-5">
          {questions.map((q, qi) => (
            <div
              key={qi}
              className="animate-fade-up mb-4 rounded-2xl border border-gray-200 bg-white p-6"
              style={{
                animationDelay: `${qi * 0.08}s`,
              }}
            >
              
              {/* Top */}
              <div className="mb-4 flex items-center justify-between">
                
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Question {qi + 1}
                </span>

                <div className="flex items-center gap-3">
                  
                  <label className="flex cursor-pointer items-center gap-1.5">
                    <input
                      type="checkbox"
                      defaultChecked={q.required}
                    />

                    <span className="text-xs text-gray-500">
                      Required
                    </span>
                  </label>

                  <button className="text-xs text-gray-400 transition-colors hover:text-red-500">
                    Remove
                  </button>
                </div>
              </div>

              {/* Question input */}
              <input
                defaultValue={q.text}
                className="input-field mb-4 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black transition-all"
              />

              <p className="mb-3 text-xs font-medium text-gray-400">
                OPTIONS
              </p>

              {/* Options */}
              <div className="flex flex-col gap-2">
                {q.options.map((opt, oi) => (
                  <div
                    key={oi}
                    className="flex items-center gap-2"
                  >
                    
                    <div className="h-4 w-4 shrink-0 rounded-full border-2 border-gray-300"></div>

                    <input
                      defaultValue={opt}
                      className="input-field flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-black transition-all"
                    />

                    <button className="px-1 text-lg leading-none text-gray-300 transition-colors hover:text-gray-500">
                      ×
                    </button>
                  </div>
                ))}

                {/* Add option */}
                <button className="mt-1 flex items-center gap-2 py-2 text-xs text-gray-400 transition-colors hover:text-black">
                  
                  <span className="flex h-4 w-4 items-center justify-center rounded-full border border-dashed border-gray-300 text-gray-400">
                    +
                  </span>

                  Add option
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Question */}
        <button className="mb-8 w-full rounded-2xl border-2 border-dashed border-gray-200 py-3 text-sm text-gray-400 transition-colors hover:border-black hover:text-black">
          + Add Question
        </button>

        {/* Bottom buttons */}
        <div className="flex items-center gap-3">
          
          <button className="btn-primary flex-1 rounded-xl bg-black py-3.5 text-sm font-semibold text-white">
            Create & Get Link
          </button>

          <button className="rounded-xl border border-gray-200 px-6 py-3.5 text-sm text-black transition-colors hover:border-black">
            Save Draft
          </button>
        </div>
      </main>
    </div>
  );
};

export default CreatePollPage;
