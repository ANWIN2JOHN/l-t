import { useState } from "react";
import { CheckCircle, XCircle, Zap, Package, AlertCircle, RefreshCw, Target } from "lucide-react";
import { usePotentialMatches, useAcceptMatch, useRejectMatch, useFindMatches, useMatchStats } from "../hooks/useMatching";
import type { PotentialMatch } from "../types";

export default function AdminMatchesPage() {
  const { data: matches = [], isLoading } = usePotentialMatches();
  const { data: stats } = useMatchStats();
  const acceptMutation = useAcceptMatch();
  const rejectMutation = useRejectMatch();
  const findMutation = useFindMatches();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleAccept = (id: string) => {
    acceptMutation.mutate(id);
  };

  const handleReject = (id: string) => {
    rejectMutation.mutate(id);
  };

  const handleRunMatching = () => {
    findMutation.mutate();
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-700 bg-emerald-50 border-emerald-200";
    if (score >= 80) return "text-cyan-700 bg-cyan-50 border-cyan-200";
    return "text-amber-700 bg-amber-50 border-amber-200";
  };

  return (
    <main className="flex-1 overflow-y-auto px-5 py-4" style={{ background: "#f0f4f8" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-gray-900 font-bold mb-1" style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.75rem" }}>
              Intelligent Matching
            </h1>
            <p className="text-gray-500 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
              AI-powered matching between lost reports and found items
            </p>
          </div>
          <button
            onClick={handleRunMatching}
            disabled={findMutation.isPending}
            className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md disabled:opacity-50"
            style={{ fontFamily: "DM Sans, sans-serif" }}
          >
            <RefreshCw size={16} className={findMutation.isPending ? "animate-spin" : ""} />
            {findMutation.isPending ? "Scanning..." : "Run Matching"}
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Target size={20} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Outfit, sans-serif" }}>{stats.pendingMatches}</p>
                  <p className="text-xs text-gray-500" style={{ fontFamily: "DM Sans, sans-serif" }}>Pending Review</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle size={20} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Outfit, sans-serif" }}>{stats.acceptedMatches}</p>
                  <p className="text-xs text-gray-500" style={{ fontFamily: "DM Sans, sans-serif" }}>Confirmed</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <XCircle size={20} className="text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Outfit, sans-serif" }}>{stats.rejectedMatches}</p>
                  <p className="text-xs text-gray-500" style={{ fontFamily: "DM Sans, sans-serif" }}>Rejected</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                  <Zap size={20} className="text-cyan-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900" style={{ fontFamily: "Outfit, sans-serif" }}>{stats.successRate}%</p>
                  <p className="text-xs text-gray-500" style={{ fontFamily: "DM Sans, sans-serif" }}>Success Rate</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Matches List */}
        {isLoading ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>Loading matches...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-sm font-medium mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
              No pending matches
            </p>
            <p className="text-gray-500 text-sm mb-4" style={{ fontFamily: "DM Sans, sans-serif" }}>
              Click "Run Matching" to scan for potential matches between lost reports and found items.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match: PotentialMatch) => (
              <div
                key={match.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
              >
                <div className="p-6">
                  {/* Score Badge + Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold rounded-full border ${getScoreColor(match.score)}`}>
                        <Zap size={14} />
                        {match.score}% Match
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs" style={{ fontFamily: "DM Sans, sans-serif" }}>
                      {new Date(match.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Two Column: Lost Report vs Found Item */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Lost Report */}
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={14} className="text-amber-600" />
                        <p className="text-amber-900 text-xs font-bold uppercase tracking-wide" style={{ fontFamily: "DM Sans, sans-serif" }}>Lost Report</p>
                      </div>
                      <h4 className="text-gray-900 font-bold text-sm mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
                        {match.lost_report?.title}
                      </h4>
                      <p className="text-gray-600 text-xs mb-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
                        {match.lost_report?.description}
                      </p>
                      <div className="space-y-1 text-xs text-gray-500" style={{ fontFamily: "DM Sans, sans-serif" }}>
                        <p>📂 {match.lost_report?.category}</p>
                        <p>📍 {match.lost_report?.location_lost}</p>
                        <p>📅 {match.lost_report?.date_lost ? new Date(match.lost_report.date_lost).toLocaleDateString() : ""}</p>
                        {match.lost_report?.student && (
                          <p>👤 {match.lost_report.student.full_name || match.lost_report.student.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Found Item */}
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle size={14} className="text-emerald-600" />
                        <p className="text-emerald-900 text-xs font-bold uppercase tracking-wide" style={{ fontFamily: "DM Sans, sans-serif" }}>Found Item</p>
                      </div>
                      <h4 className="text-gray-900 font-bold text-sm mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>
                        {match.found_item?.title}
                      </h4>
                      <p className="text-gray-600 text-xs mb-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
                        {match.found_item?.description}
                      </p>
                      <div className="space-y-1 text-xs text-gray-500" style={{ fontFamily: "DM Sans, sans-serif" }}>
                        <p>📂 {match.found_item?.category}</p>
                        <p>📍 {match.found_item?.location_found}</p>
                        <p>📅 {match.found_item?.date_found ? new Date(match.found_item.date_found).toLocaleDateString() : ""}</p>
                      </div>
                    </div>
                  </div>

                  {/* Match Reasons (Expandable) */}
                  <button
                    onClick={() => setExpandedId(expandedId === match.id ? null : match.id)}
                    className="text-xs text-cyan-600 font-medium hover:underline mb-3"
                    style={{ fontFamily: "DM Sans, sans-serif" }}
                  >
                    {expandedId === match.id ? "Hide scoring details" : "Show scoring details"}
                  </button>

                  {expandedId === match.id && match.match_reasons && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="space-y-2">
                        {match.match_reasons.map((reason, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="text-gray-700 font-medium" style={{ fontFamily: "DM Sans, sans-serif" }}>
                              {reason.criterion}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400" style={{ fontFamily: "DM Sans, sans-serif" }}>
                                {reason.detail}
                              </span>
                              <span className="font-bold text-gray-900 w-12 text-right">
                                {reason.score}/{reason.maxScore}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleReject(match.id)}
                      disabled={rejectMutation.isPending}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition-all border border-red-200 disabled:opacity-50"
                      style={{ fontFamily: "DM Sans, sans-serif" }}
                    >
                      <XCircle size={16} />
                      Reject Match
                    </button>
                    <button
                      onClick={() => handleAccept(match.id)}
                      disabled={acceptMutation.isPending}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md disabled:opacity-50"
                      style={{ fontFamily: "DM Sans, sans-serif" }}
                    >
                      <CheckCircle size={16} />
                      Accept Match
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}