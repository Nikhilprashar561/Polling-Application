import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Sidebar from "../Components/Sidebar";
import { pollService } from "../services/pollService";
import { useAuth } from "../context/userContext";
import { usePoll } from "../context/pollContext";

const statusColor = {
  active: "bg-black text-white",
  closed: "bg-gray-100 text-gray-500",
  draft: "bg-gray-100 text-gray-400",
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { polls, setAllPolls, removePoll } = usePoll();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      const result = await pollService.myPolls();
      if (result?.success) {
        setAllPolls(result.data.pollData || []);
      }
      setLoading(false);
    };
    fetchPolls();
  }, []);

  const handleDelete = async (pollId, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this poll and all its questions?")) return;
    setDeletingId(pollId);
    const result = await pollService.deletePoll(pollId);
    if (result?.success) {
      removePoll(pollId);
      toast.success("Poll deleted");
    }
    setDeletingId(null);
  };

  const handleClosePoll = async (pollId, e) => {
    e.stopPropagation();
    const { responseService } = await import("../services/responseService");
    const result = await responseService.expirePoll(pollId);
    if (result?.success) {
      toast.success("Poll closed");
      // Refresh polls
      const r = await pollService.myPolls();
      if (r?.success) setAllPolls(r.data.pollData || []);
    }
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const filtered = polls.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalActive = polls.filter((p) => p.status === "active").length;
  const totalClosed = polls.filter((p) => p.status === "closed").length;

  const stats = [
    { label: "Total Polls", value: polls.length.toString(), sub: `${totalActive} active` },
    { label: "Active Polls", value: totalActive.toString(), sub: "Collecting responses" },
    { label: "Closed Polls", value: totalClosed.toString(), sub: "Results available" },
    { label: "Draft Polls", value: polls.filter(p => p.status === "draft").length.toString(), sub: "Not yet published" },
  ];

  return (
    <div className="flex min-h-screen pt-16 noise">
      <Sidebar />

      <main className="flex-1 overflow-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center animate-fade-up">
          <div>
            <h1 className="font-display text-2xl font-bold text-black">Dashboard</h1>
            <p className="mt-0.5 text-sm text-gray-400">{today}</p>
          </div>
          <button
            onClick={() => navigate("/create-poll")}
            className="btn-primary self-start rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white sm:self-auto"
          >
            + New Poll
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, index) => (
            <div
              key={s.label}
              className="stat-card animate-fade-up rounded-2xl border border-gray-100 bg-white p-5"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <p className="mb-2 text-xs text-gray-400">{s.label}</p>
              <p className="font-display text-3xl font-bold text-black">{s.value}</p>
              <p className="mt-1 text-xs text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Poll Table */}
        <div className="animate-fade-up anim-delay-2 overflow-hidden rounded-2xl border border-gray-100 bg-white">
          <div className="flex items-center justify-between border-b border-gray-50 px-6 py-4">
            <h3 className="font-display text-base font-semibold text-black">Your Polls</h3>
            <div className="flex items-center gap-2">
              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field w-36 rounded-lg border border-gray-200 px-3 py-1.5 text-xs transition-colors focus:border-black focus:outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-16 text-center text-sm text-gray-400">Loading polls...</div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm text-gray-400">No polls yet.</p>
                <button
                  onClick={() => navigate("/create-poll")}
                  className="mt-3 rounded-xl bg-black px-4 py-2 text-xs font-semibold text-white"
                >
                  Create your first poll
                </button>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Poll</th>
                    <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 sm:table-cell">Status</th>
                    <th className="hidden px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400 lg:table-cell">Expires</th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((p) => (
                    <tr key={p.id} className="transition-colors hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-black">{p.title}</p>
                        {p.description && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{p.description}</p>
                        )}
                      </td>
                      <td className="hidden px-4 py-4 sm:table-cell">
                        <span className={`tag text-xs capitalize ${statusColor[p.status] || "bg-gray-100 text-gray-400"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="hidden px-4 py-4 text-xs text-gray-500 lg:table-cell">
                        {p.expiresAt
                          ? new Date(p.expiresAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {p.status === "active" && (
                            <button
                              onClick={() => navigate(`/poll-results/${p.id}`)}
                              className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-500 transition-colors hover:border-black hover:text-black"
                            >
                              Results
                            </button>
                          )}
                          {p.status === "draft" && (
                            <button
                              onClick={() => navigate(`/create-poll?pollId=${p.id}`)}
                              className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-500 transition-colors hover:border-black hover:text-black"
                            >
                              Edit
                            </button>
                          )}
                          {p.status === "active" && (
                            <button
                              onClick={(e) => handleClosePoll(p.id, e)}
                              className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-500 transition-colors hover:border-red-300 hover:text-red-500"
                            >
                              Close
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDelete(p.id, e)}
                            disabled={deletingId === p.id}
                            className="rounded-lg px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-red-50 hover:text-red-400 disabled:opacity-50"
                          >
                            {deletingId === p.id ? "..." : "Delete"}
                          </button>
                          {p.pollLink && p.status === "active" && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(p.pollLink);
                                toast.success("Poll link copied!");
                              }}
                              className="rounded-lg px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-gray-100 hover:text-black"
                            >
                              Copy Link
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
