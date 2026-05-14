import { useForm } from "react-hook-form";
import InputField from "../Components/InputField";
import Sidebar from "../Components/Sidebar";
import FormBuilder from "../Components/Questions";

const CreatePollPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      expireTime: "",
    },
    mode: "all",
  });

  const submit = async (data) => {
    data.preventDefault();

    console.log(data);
  };

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
      options: ["Social Media", "Word of Mouth", "Search Engine", "Other"],
      required: false,
    },
  ];

  return (
    <div className="flex min-h-screen pt-16 noise">
      <Sidebar />

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

          <label className="block mb-1.5 text-sm font-medium text-black">
            Poll Title
            <input
              className="input-field w-full mt-1.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 transition-all duration-200"
              type="text"
              placeholder="eg : Computer Fundamentals 101"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 10,
                  message: "Please enter at least 10 character",
                },
              })}
            />
            <span className="text-xs leading-relaxed text-gray-500">
              {errors.title && (
                <span className="block mb-2 ml-4 text-red-500 text-xs mt-1">
                  {errors.title.message}
                </span>
              )}
            </span>
          </label>

          {/* Description */}
          <div className="mb-5">
            <label className="block mb-1.5 text-sm font-medium text-black">
              Description
              <input
                className="input-field w-full mt-1.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 transition-all duration-200"
                type="text"
                placeholder="poll description"
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 20,
                    message: "Please enter at least 20 character",
                  },
                })}
              />
              <span className="text-xs leading-relaxed text-gray-500">
                {errors.description && (
                  <span className="block mb-2 ml-4 text-red-500 text-xs mt-1">
                    {errors.description.message}
                  </span>
                )}
              </span>
            </label>
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-black">
              Expire Time
              <input
                className="input-field w-full mt-1.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 transition-all duration-200"
                type="datetime-local"
                placeholder="expire time"
                {...register("expireTime", {
                  required: "Expire Time is required",
                })}
              />
              <span className="text-xs leading-relaxed text-gray-500">
                {errors.expireTime && (
                  <span className="block mb-2 ml-4 text-red-500 text-xs mt-1">
                    {errors.expireTime.message}
                  </span>
                )}
              </span>
            </label>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-black">
              Response Type
            </label>

            <div className="space-y-3">
              {/* Authenticated */}
              <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 cursor-pointer transition-all hover:border-blue-400">
                <input
                  type="radio"
                  value="authenticated"
                  defaultChecked
                  className="mt-1 h-4 w-4 accent-blue-500"
                />

                <div>
                  <p className="text-sm font-medium text-black">
                    Authenticated
                  </p>
                  <p className="text-xs text-gray-500">
                    Only signed-in users can respond
                  </p>
                </div>
              </label>

              {/* Anonymous */}
              <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 cursor-pointer transition-all hover:border-blue-400">
                <input
                  type="radio"
                  value="anonymous"
                  className="mt-1 h-4 w-4 accent-blue-500"
                />

                <div>
                  <p className="text-sm font-medium text-black">Anonymous</p>
                  <p className="text-xs text-gray-500">
                    Anyone can respond without sign in
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="mb-1.5 mt-2 block text-sm font-medium text-black">Poll Status</label>
            <select
              defaultValue="active"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <FormBuilder />

        {/* Bottom buttons */}
        <div className="flex items-center gap-3">
          <button className="btn-primary flex-1 rounded-xl bg-black py-3.5 text-sm font-semibold text-white">
            Create & Get Link
          </button>
        </div>
      </main>
    </div>
  );
};

export default CreatePollPage;
