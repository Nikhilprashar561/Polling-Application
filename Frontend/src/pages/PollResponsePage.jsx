import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { pollService } from "../services/pollService";
import { responseService } from "../services/responseService";

const PollResponsePage = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();

  const [pollData, setPollData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPoll = async () => {
      if (!pollId) return;
      setLoading(true);

      // Build full poll link as stored in DB: FRONTEND_URL/poll/UUID
      // const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
      // const fullPollLink = `${FRONTEND_URL}/poll/${pollId}`;

      const result = await pollService.getPoll(pollId);

      if (result?.success) {
        setPollData(result.data.poll);
        setQuestions(result.data.questions || []);
      } else {
        setError("Poll not found or no longer active.");
      }
      setLoading(false);
    };
    fetchPoll();
  }, [pollId]);

  const handleSelect = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    for (const q of questions) {
      if (q.isRequired && !answers[q.id]) {
        toast.error(`Please answer: "${q.questionText}"`);
        return;
      }
    }

    const answersArray = Object.entries(answers).map(([questionId, selectedOption]) => ({
      questionId,
      selectedOption,
    }));

    setSubmitting(true);
    const result = await responseService.submitPoll(pollId, answersArray);
    if (result?.success) {
      setSubmitted(true);
      toast.success("Response submitted!");
    }
    setSubmitting(false);
  };

  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  if (loading) {
    return (
      <div className="noise flex mt-5 min-h-screen items-center justify-center bg-gray-50 px-4 py-16">
        <p className="text-sm text-gray-400">Loading poll...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="noise flex mt-5 min-h-screen items-center justify-center bg-gray-50 px-4 py-16">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-3">{error}</p>
          <button onClick={() => navigate("/")} className="text-xs underline text-gray-400">
            Go home
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="noise flex mt-5 min-h-screen items-center justify-center bg-gray-50 px-4 py-16">
        <div className="w-full max-w-xl text-center rounded-2xl border border-gray-200 bg-white p-10 shadow-sm animate-fade-up">
          <div className="text-5xl mb-4">✓</div>
          <h2 className="font-display text-2xl font-bold text-black mb-2">Thank you!</h2>
          <p className="text-sm text-gray-500 mb-6">Your response has been recorded.</p>
          <button
            onClick={() => navigate("/")}
            className="rounded-xl bg-black px-6 py-2.5 text-sm font-semibold text-white"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="noise flex mt-5 min-h-screen items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-xl">

        {/* Poll Header */}
        <div className="animate-fade-up mb-4 rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="tag bg-black text-xs text-white">Live</span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-green-500"></span>
              {pollData?.expiresAt
                ? `Closes ${new Date(pollData.expiresAt).toLocaleDateString()}`
                : "Active"}
            </span>
          </div>

          <h1 className="font-display mb-2 text-2xl font-bold text-black">
            {pollData?.title}
          </h1>
          {pollData?.description && (
            <p className="text-sm leading-relaxed text-gray-500">{pollData.description}</p>
          )}

          <div className="mt-4 flex items-center gap-4 border-t border-gray-50 pt-4">
            <span className="text-xs text-gray-400">{questions.length} questions</span>
            <span className="h-1 w-1 rounded-full bg-gray-300"></span>
            <span className="text-xs text-gray-400">
              {pollData?.isAnonymous ? "Anonymous" : "Authenticated"}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-2 flex items-center justify-between px-1 animate-fade-up anim-delay-1">
          <span className="text-xs text-gray-400">{answeredCount} of {questions.length} answered</span>
          <span className="text-xs text-gray-400">{progress}%</span>
        </div>
        <div className="mb-4 h-1 overflow-hidden rounded-full bg-gray-200 animate-fade-up anim-delay-1">
          <div
            className="progress-bar-inner h-full rounded-full bg-black transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Questions */}
        {questions.map((q, qi) => (
          <div
            key={q.id}
            className="animate-fade-up mb-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            style={{ animationDelay: `${qi * 0.08}s` }}
          >
            <div className="mb-5 flex items-start gap-2">
              <span className="font-display mt-0.5 shrink-0 text-sm font-bold text-black">Q{qi + 1}.</span>
              <p className="text-sm font-semibold leading-relaxed text-black">
                {q.questionText}
                {q.isRequired && <span className="ml-1 text-red-400">*</span>}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {[q.option1, q.option2, q.option3, q.option4].map((opt, oi) => {
                const selected = answers[q.id] === opt;
                return (
                  <label
                    key={oi}
                    onClick={() => handleSelect(q.id, opt)}
                    className={`poll-option flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 ${selected ? "selected" : ""}`}
                  >
                    <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-white" : "border-gray-300"}`}>
                      {selected && <div className="h-2 w-2 rounded-full bg-white" />}
                    </div>
                    <span className="text-sm">{opt}</span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary mt-2 w-full rounded-xl bg-black py-4 text-sm font-semibold text-white animate-fade-up anim-delay-3 disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Submit Responses →"}
        </button>

        {pollData?.isAnonymous && (
          <p className="mt-3 text-center text-xs text-gray-400 animate-fade-up anim-delay-4">
            Your response is anonymous and cannot be traced back to you.
          </p>
        )}
      </div>
    </div>
  );
};

export default PollResponsePage;
