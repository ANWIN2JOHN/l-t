import { useState } from "react";
import { Clock, User, Mail, Phone, MapPin, Calendar, Package, XCircle, CheckCircle } from "lucide-react";
import InfoModal from "./InfoModal";
import { usePendingReports, useResolveReport } from "@/features/lostReports/hooks/useLostReports";

interface Ticket {
  id: string;
  ticketId: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  rollNumber: string;
  mobile: string;
  itemName: string;
  category: string;
  description: string;
  location: string;
  dateLost: string;
  imageUrl?: string;
  status: string;
  createdAt: string;
}

interface PendingApprovalsPageProps {
  accessToken?: string;
}

export default function PendingApprovalsPage({ accessToken: _accessToken }: PendingApprovalsPageProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: pendingReports = [], isLoading: loading, error: queryError } = usePendingReports();
  const resolveMutation = useResolveReport();

  console.log("[PendingApprovalsPage] isLoading:", loading);
  console.log("[PendingApprovalsPage] queryError:", queryError);
  console.log("[PendingApprovalsPage] raw pendingReports:", pendingReports);

  const tickets: Ticket[] = pendingReports.map((r: any) => ({
    id: r.id,
    ticketId: r.id.substring(0, 8).toUpperCase(),
    userId: r.student_id,
    studentName: r.student?.full_name || r.student?.email?.split("@")[0] || "Student",
    studentEmail: r.student?.email || "",
    rollNumber: r.student?.roll_number || "",
    mobile: r.student?.phone || "",
    itemName: r.title,
    category: r.category,
    description: r.description,
    location: r.location_lost,
    dateLost: r.date_lost,
    status: "pending",
    createdAt: r.created_at,
  }));

  console.log("[PendingApprovalsPage] mapped tickets:", tickets);

  // Format ticket ID to KJL26XX format for lost items
  const formatTicketId = (ticketId: string) => {
    // If it's already formatted (contains KJL or KJF), return as-is
    if (ticketId.includes('KJL') || ticketId.includes('KJF')) {
      return ticketId;
    }
    // If it's a number or can be parsed as one, format it
    const numericId = parseInt(ticketId.replace(/\D/g, ''));
    if (!isNaN(numericId)) {
      return `KJL26${String(numericId).padStart(2, '0')}`;
    }
    // Otherwise return as-is
    return ticketId;
  };


  const handleApprove = async (id: string, approved: boolean) => {
    resolveMutation.mutate(
      { id, approved },
      {
        onSuccess: () => {
          setSuccessMessage(`Ticket ${approved ? "approved and added to Lost Items Dashboard" : "rejected"} successfully!`);
          setShowSuccessModal(true);
        },
        onError: (err: any) => {
          setErrorMessage(err.message || "Unknown error occurred. Please try again.");
          setShowErrorModal(true);
        }
      }
    );
  };

  return (
    <main className="flex-1 overflow-y-auto px-5 py-4" style={{ background: "#f0f4f8" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-gray-900 font-bold mb-1" style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.75rem" }}>
            Pending Ticket Approvals
          </h1>
          <p className="text-gray-500 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
            Review and approve or reject student-submitted lost item tickets
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
              Loading pending tickets...
            </p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <CheckCircle size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-sm font-medium mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
              No pending approvals
            </p>
            <p className="text-gray-500 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
              All tickets have been reviewed
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
                style={{
                  boxShadow: "0 2px 8px #0000000a, 0 1px 4px #00000008",
                }}
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-bold mb-1" style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.2rem" }}>
                        {ticket.itemName}
                      </h3>
                      <p className="text-gray-500 text-xs mb-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
                        Ticket ID: {formatTicketId(ticket.ticketId)}
                      </p>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                        <Clock size={12} />
                        Pending Review
                      </span>
                    </div>
                  </div>

                  {/* Student Information */}
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-blue-900 font-semibold text-sm mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
                      Student Information
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-blue-600" />
                        <span className="text-xs text-blue-900" style={{ fontFamily: "DM Sans, sans-serif" }}>
                          {ticket.studentName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-blue-600" />
                        <span className="text-xs text-blue-900 truncate" style={{ fontFamily: "DM Sans, sans-serif" }}>
                          {ticket.studentEmail}
                        </span>
                      </div>
                      {ticket.rollNumber && (
                        <div className="flex items-center gap-2">
                          <Phone size={14} className="text-blue-600" />
                          <span className="text-xs text-blue-900" style={{ fontFamily: "DM Sans, sans-serif" }}>
                            Roll: {ticket.rollNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <p className="text-gray-700 text-sm leading-relaxed" style={{ fontFamily: "DM Sans, sans-serif" }}>
                      <strong>Description:</strong> {ticket.description}
                    </p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-600" style={{ fontFamily: "DM Sans, sans-serif" }}>
                        {ticket.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-600" style={{ fontFamily: "DM Sans, sans-serif" }}>
                        {new Date(ticket.dateLost).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Package size={14} className="text-gray-400" />
                      <span className="text-xs text-gray-600" style={{ fontFamily: "DM Sans, sans-serif" }}>
                        {ticket.category}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleApprove(ticket.id, false)}
                      disabled={resolveMutation.isPending}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition-all border border-red-200"
                      style={{ fontFamily: "DM Sans, sans-serif" }}
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(ticket.id, true)}
                      disabled={resolveMutation.isPending}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md"
                      style={{ fontFamily: "DM Sans, sans-serif" }}
                    >
                      <CheckCircle size={16} />
                      Approve & Add to Lost Items
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <InfoModal
          title="Success!"
          message={successMessage}
          buttonText="OK"
          type="success"
          onClose={() => setShowSuccessModal(false)}
        />
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <InfoModal
          title="Error"
          message={errorMessage}
          buttonText="OK"
          type="error"
          onClose={() => setShowErrorModal(false)}
        />
      )}
    </main>
  );
}
