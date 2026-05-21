import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { responseService } from "../services/responseService";
import { joinPollRoom, leavePollRoom, onVoteUpdate, connectSocket } from "../utils/socket";

const PollResultsPage = () => {
  const { pollId } = useParams();

  const [pollMeta, setPollMeta] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [copied, setCopied] = useState(false);

  const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || window.location.origin;
  const pollLink = `${FRONTEND_URL}/poll/${pollId}`;

  const applyData = useCallback((data) => {
    if (!data) return;
    if (data.pollClosed) { setIsLive(false); return; }

    if (data.title) setPollMeta({ title: data.title, description: data.description, status: data.status, expiresAt: data.expiresAt });
    setTotalSubmissions(data.analytics?.totalSubmissions ?? data.totalSubmissions ?? 0);
    setIsLive(data.status === "active");

    const qs = (data.questions || data.results || []).map((q) => ({
      id: q.questionId,
      questionText: q.questionText,
      totalVotes: q.totalVotes,
      options: (q.options || []).map((o) => ({
        label: o.option,
        count: o.votes,
        pct: o.percentage,
      })),
    }));
    setQuestions(qs);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // Try analytics (creator's view - requires auth)
      const r = await responseService.analyticsPoll(pollId);
      if (r?.success) {
        applyData({ ...r.data, title: r.data.title, description: r.data.description, status: r.data.status });
      } else {
        // Fall back to public results endpoint (for closed polls)
        const r2 = await responseService.results(encodeURIComponent(pollLink));
        if (r2?.success) applyData(r2.data);
      }
      setLoading(false);
    };
    if (pollId) load();
  }, [pollId]);

  // Socket live updates
  useEffect(() => {
    if (!pollId) return;
    connectSocket();
    joinPollRoom(pollId);
    const unsub = onVoteUpdate((data) => {
      if (data.pollId === pollId || data.pollClosed) {
        applyData(data);
        if (!data.pollClosed) toast.success("New vote!", { duration: 1500 });
        else toast.info("Poll closed");
      }
    });
    return () => { unsub(); leavePollRoom(pollId); };
  }, [pollId, applyData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(pollLink);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="noise mt-5 min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-400">Loading results...</p>
      </div>
    );
  }

  return (
    <div className="noise mt-5 min-h-screen bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-2xl">

        {/* Header Card */}
        <div className="animate-fade-up mb-6 rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className={`tag text-xs text-white ${isLive ? "bg-black" : "bg-gray-900"}`}>
              {isLive ? (
                <span className="flex items-center gap-1.5">
                  <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-green-400" />
                  Live Results
                </span>
              ) : "Results"}
            </span>
            <span className="text-xs text-gray-400 capitalize">{pollMeta?.status || "—"}</span>
          </div>

          <h1 className="font-display mb-2 text-2xl font-bold text-black">
            {pollMeta?.title || "Poll Results"}
          </h1>
          {pollMeta?.description && (
            <p className="text-sm text-gray-500">{pollMeta.description}</p>
          )}

          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-50 pt-6">
            {[
              [totalSubmissions.toLocaleString(), "Total Responses"],
              [questions.length.toString(), "Questions"],
              [pollMeta?.expiresAt ? new Date(pollMeta.expiresAt).toLocaleDateString() : "—", "Expires"],
            ].map(([v, l]) => (
              <div key={l} className="text-center">
                <p className="font-display text-xl font-bold text-black">{v}</p>
                <p className="mt-0.5 text-xs text-gray-400">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Question Results */}
        {questions.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-gray-400">No responses yet. Share the poll link to start collecting votes.</p>
          </div>
        ) : (
          questions.map((q, qi) => (
            <div
              key={q.id || qi}
              className="animate-fade-up mb-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              style={{ animationDelay: `${qi * 0.08}s` }}
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Question {qi + 1}
              </p>
              <h3 className="mb-5 text-sm font-semibold text-black">{q.questionText}</h3>

              <div className="flex flex-col gap-4">
                {q.options.map((opt, oi) => (
                  <div key={oi}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm text-black">{opt.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{opt.count.toLocaleString()}</span>
                        <span className="w-10 text-right text-sm font-bold text-black">{opt.pct}%</span>
                      </div>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`progress-bar-inner h-full rounded-full transition-all duration-500 ${oi === 0 ? "bg-black" : "bg-gray-300"}`}
                        style={{ width: `${opt.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-400">{q.totalVotes.toLocaleString()} votes</p>
            </div>
          ))
        )}

        {/* Share Card */}
        <div className="animate-fade-up anim-delay-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="font-display mb-2 text-base font-semibold text-black">Share this poll</h3>
          <p className="mb-4 text-sm text-gray-500">
            {isLive ? "Share this link so others can respond." : "Share the results link."}
          </p>
          <div className="flex items-center gap-2">
            <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-mono text-xs text-gray-500">
              {pollLink}
            </div>
            <button
              onClick={handleCopy}
              className="btn-primary shrink-0 rounded-xl bg-black px-4 py-3 text-xs font-semibold text-white"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PollResultsPage;
