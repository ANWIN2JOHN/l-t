import { Clock, User, Mail, Phone, MapPin, Calendar, Package } from "lucide-react";
import { useApprovedLostReports } from "@/features/lostReports/hooks/useLostReports";

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
  status: string;
  createdAt: string;
}

export default function AdminLostItemsPage() {
  const { data: approvedReports = [], isLoading: loading } = useApprovedLostReports();

  const tickets: Ticket[] = approvedReports.map((r: any) => ({
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
    status: r.status,
    createdAt: r.created_at,
  }));

  const formatTicketId = (ticketId: string) => {
    if (ticketId.includes('KJL') || ticketId.includes('KJF')) {
      return ticketId;
    }
    const numericId = parseInt(ticketId.replace(/\D/g, ''));
    if (!isNaN(numericId)) {
      return `KJL26${String(numericId).padStart(2, '0')}`;
    }
    return ticketId;
  };

  return (
    <main className="flex-1 overflow-y-auto px-5 py-4" style={{ background: "#f0f4f8" }}>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-gray-900 font-bold mb-1" style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.75rem" }}>
            Lost Items
          </h1>
          <p className="text-gray-500 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
            Approved lost items actively being searched for.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-500 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
              Loading lost items...
            </p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-sm font-medium mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
              No active lost items
            </p>
            <p className="text-gray-500 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
              There are no approved lost item reports to display.
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
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-bold mb-1" style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.2rem" }}>
                        {ticket.itemName}
                      </h3>
                      <p className="text-gray-500 text-xs mb-2" style={{ fontFamily: "DM Sans, sans-serif" }}>
                        Ticket ID: {formatTicketId(ticket.ticketId)}
                      </p>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${
                        ticket.status === 'MATCHED' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : ticket.status === 'RETURNED'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        <Clock size={12} />
                        {ticket.status}
                      </span>
                    </div>
                  </div>

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

                  <div className="mb-4">
                    <p className="text-gray-700 text-sm leading-relaxed" style={{ fontFamily: "DM Sans, sans-serif" }}>
                      <strong>Description:</strong> {ticket.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
