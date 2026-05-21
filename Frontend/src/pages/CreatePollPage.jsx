import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Sidebar from "../Components/Sidebar";
import FormBuilder from "../Components/Questions";
import { pollService } from "../services/pollService";
import { usePoll } from "../context/pollContext";

const CreatePollPage = () => {
  const navigate = useNavigate();
  const { addPoll } = usePoll();
  const [questions, setQuestions] = useState([]);
  const [responseType, setResponseType] = useState("authenticated");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { title: "", description: "", expireTime: "" },
    mode: "all",
  });

  const onSubmit = async (data) => {
    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    // Validate questions have all 4 options filled
    for (const q of questions) {
      if (!q.text?.trim()) {
        toast.error("All questions must have text");
        return;
      }
      if (q.options.length < 2) {
        toast.error("Each question needs at least 2 options");
        return;
      }
      const emptyOpt = q.options.find((o) => !o.text?.trim());
      if (emptyOpt) {
        toast.error("All option fields must be filled");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // Step 1: Create the poll
      const pollResult = await pollService.createPoll({
        title: data.title,
        description: data.description,
        expiresAt: new Date(data.expireTime).toISOString(),
        isAnonymous: responseType === "anonymous",
        requiresAuth: responseType === "authenticated",
      });

      if (!pollResult?.success) {
        toast.error("Failed to create poll");
        return;
      }

      const pollId = pollResult.data.id;

      // Step 2: Create all questions
      for (const q of questions) {
        const opts = q.options.map((o) => o.text.trim());
        // Pad to 4 if less
        while (opts.length < 4) opts.push(opts[opts.length - 1] || "N/A");

        const qResult = await pollService.createQuestion(pollId, {
          questionText: q.text,
          isRequired: q.required,
          option1: opts[0],
          option2: opts[1],
          option3: opts[2],
          option4: opts[3],
        });

        if (!qResult?.success) {
          toast.error(`Failed to add question: ${q.text}`);
          return;
        }
      }

      // Step 3: Publish the poll
      const finalResult = await pollService.finalSubmission(pollId);

      if (!finalResult?.success) {
        toast.error("Failed to publish poll");
        return;
      }

      addPoll(finalResult.data.poll);
      toast.success("Poll created and published!");

      // Copy link to clipboard
      if (finalResult.data.poll?.pollLink) {
        navigator.clipboard.writeText(finalResult.data.poll.pollLink).catch(() => {});
        toast.info("Poll link copied to clipboard!");
      }

      navigate("/dashboard");
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen pt-16 noise">
      <Sidebar />

      <main className="flex-1 max-w-3xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-up">
          <h1 className="font-display text-2xl font-bold text-black">Create New Poll</h1>
          <p className="mt-1 text-sm text-gray-400">
            Fill in the details and add your questions below
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Poll Details */}
          <div className="mb-5 animate-fade-up rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="font-display mb-4 text-base font-semibold text-black">Poll Details</h2>

            <label className="block mb-1.5 text-sm font-medium text-black">
              Poll Title
              <input
                className="input-field w-full mt-1.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 transition-all duration-200"
                type="text"
                placeholder="eg : Computer Fundamentals 101"
                {...register("title", {
                  required: "Title is required",
                  minLength: { value: 10, message: "Please enter at least 10 characters" },
                })}
              />
              {errors.title && (
                <span className="block mb-2 ml-4 text-red-500 text-xs mt-1">
                  {errors.title.message}
                </span>
              )}
            </label>

            <div className="mb-5">
              <label className="block mb-1.5 text-sm font-medium text-black">
                Description
                <input
                  className="input-field w-full mt-1.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 transition-all duration-200"
                  type="text"
                  placeholder="Poll description"
                  {...register("description", {
                    required: "Description is required",
                    minLength: { value: 20, message: "Please enter at least 20 characters" },
                  })}
                />
                {errors.description && (
                  <span className="block mb-2 ml-4 text-red-500 text-xs mt-1">
                    {errors.description.message}
                  </span>
                )}
              </label>
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-black">
                Expire Time
                <input
                  className="input-field w-full mt-1.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-black placeholder-gray-400 transition-all duration-200"
                  type="datetime-local"
                  {...register("expireTime", { required: "Expire Time is required" })}
                />
                {errors.expireTime && (
                  <span className="block mb-2 ml-4 text-red-500 text-xs mt-1">
                    {errors.expireTime.message}
                  </span>
                )}
              </label>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-black">Response Type</label>
              <div className="space-y-3">
                <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 cursor-pointer transition-all hover:border-blue-400">
                  <input
                    type="radio"
                    value="authenticated"
                    checked={responseType === "authenticated"}
                    onChange={(e) => setResponseType(e.target.value)}
                    className="mt-1 h-4 w-4 accent-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-black">Authenticated</p>
                    <p className="text-xs text-gray-500">Only signed-in users can respond</p>
                  </div>
                </label>

                <label className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 cursor-pointer transition-all hover:border-blue-400">
                  <input
                    type="radio"
                    value="anonymous"
                    checked={responseType === "anonymous"}
                    onChange={(e) => setResponseType(e.target.value)}
                    className="mt-1 h-4 w-4 accent-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-black">Anonymous</p>
                    <p className="text-xs text-gray-500">Anyone can respond without sign in</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <FormBuilder questions={questions} setQuestions={setQuestions} />

          <div className="flex items-center gap-3 mb-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 rounded-xl bg-black py-3.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {isSubmitting ? "Publishing..." : "Create & Get Link"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreatePollPage;
