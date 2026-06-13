import { useState } from "react";
import { Upload, AlertCircle } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import InfoModal from "./InfoModal";

import { useCreateLostReport } from "@/features/lostReports/hooks/useLostReports";

interface ReportLostItemFormProps {
  studentData: {
    name: string;
    email: string;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const categories = [
  "Bags & Backpacks",
  "Water Bottles",
  "Electronics",
  "Books & Notebooks",
  "Keys & Keychains",
  "Accessories",
  "Eyewear",
  "Clothing",
  "ID Cards & Documents",
  "Sports Equipment",
  "Wallets & Purses",
  "Umbrellas",
];

export default function ReportLostItemForm({ studentData, onSuccess, onCancel }: ReportLostItemFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    location_lost: "",
    date_lost: "",
    contact_information: studentData.email,
    unique_identifiers: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedItemName, setSubmittedItemName] = useState("");
  
  const createReportMutation = useCreateLostReport();

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleCancel = () => {
    const hasData = formData.title || formData.category || formData.description || formData.location_lost || formData.date_lost || formData.unique_identifiers;

    if (hasData) {
      setShowCancelConfirm(true);
    } else {
      onCancel();
    }
  };

  const confirmCancel = () => {
    setShowCancelConfirm(false);
    onCancel();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Item name is required";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.location_lost.trim()) newErrors.location_lost = "Location is required";
    
    if (!formData.date_lost) {
      newErrors.date_lost = "Date lost is required";
    } else {
      const selectedDate = new Date(formData.date_lost);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Ignore time part for today
      selectedDate.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        newErrors.date_lost = "Date lost cannot be in the future";
      }
    }
    
    if (!formData.contact_information.trim()) newErrors.contact_information = "Contact information is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    createReportMutation.mutate(formData, {
      onSuccess: () => {
        setSubmittedItemName(formData.title);
        setShowSuccessModal(true);
      }
    });
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onSuccess();
  };

  const inputCls =
    "w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all";

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-blue-900 font-bold mb-1" style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.5rem" }}>
          Report Lost Item
        </h2>
        <p className="text-gray-500 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
          Fill in the details below to submit your lost item ticket
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          className="overflow-hidden"
          style={{
            borderRadius: 20,
            boxShadow: "0 4px 20px #0000000f, 0 1px 6px #00000008",
            background: "white",
          }}
        >
          <div className="p-8 space-y-5">
            {/* Item Name */}
            <div>
              <label className="text-gray-700 text-sm font-medium mb-2 block" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Item Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g., Black Leather Wallet"
                className={inputCls}
                style={{ fontFamily: "DM Sans, sans-serif" }}
              />
              {errors.title && (
                <div className="flex items-start gap-2 mt-2">
                  <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-600 text-xs" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    {errors.title}
                  </p>
                </div>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="text-gray-700 text-sm font-medium mb-2 block" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                className={inputCls}
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div className="flex items-start gap-2 mt-2">
                  <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-600 text-xs" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    {errors.category}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-gray-700 text-sm font-medium mb-2 block" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe the item clearly — color, size, any distinguishing marks..."
                className={inputCls + " resize-none"}
                style={{ fontFamily: "DM Sans, sans-serif" }}
              />
              {errors.description && (
                <div className="flex items-start gap-2 mt-2">
                  <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-red-600 text-xs" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    {errors.description}
                  </p>
                </div>
              )}
            </div>

            {/* Location and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  Location Lost <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location_lost}
                  onChange={(e) => handleChange("location_lost", e.target.value)}
                  placeholder="e.g., Library 2nd Floor"
                  className={inputCls}
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                />
                {errors.location_lost && (
                  <div className="flex items-start gap-2 mt-2">
                    <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-red-600 text-xs" style={{ fontFamily: "DM Sans, sans-serif" }}>
                      {errors.location_lost}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  Date Lost <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date_lost}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => handleChange("date_lost", e.target.value)}
                  className={inputCls}
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                />
                {errors.date_lost && (
                  <div className="flex items-start gap-2 mt-2">
                    <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-red-600 text-xs" style={{ fontFamily: "DM Sans, sans-serif" }}>
                      {errors.date_lost}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact and Identifiers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  Contact Information <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contact_information}
                  onChange={(e) => handleChange("contact_information", e.target.value)}
                  placeholder="Email or Phone Number"
                  className={inputCls}
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                />
                {errors.contact_information && (
                  <div className="flex items-start gap-2 mt-2">
                    <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-red-600 text-xs" style={{ fontFamily: "DM Sans, sans-serif" }}>
                      {errors.contact_information}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="text-gray-700 text-sm font-medium mb-2 block" style={{ fontFamily: "DM Sans, sans-serif" }}>
                  Unique Identifiers <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.unique_identifiers}
                  onChange={(e) => handleChange("unique_identifiers", e.target.value)}
                  placeholder="e.g., Serial Number, ID inside"
                  className={inputCls}
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-8 pb-8 flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold text-sm transition-all"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createReportMutation.isPending}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              <Upload size={16} />
              {createReportMutation.isPending ? "Submitting..." : "Report Lost Item"}
            </button>
          </div>
        </div>
      </form>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <ConfirmModal
          title="Exit Without Saving?"
          message="Are you sure you want to exit?\n\nAll your entered information will be lost."
          confirmText="Yes, Exit"
          cancelText="Continue Editing"
          type="warning"
          onConfirm={confirmCancel}
          onCancel={() => setShowCancelConfirm(false)}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <InfoModal
          title="Report Submitted Successfully!"
          message={`Your ticket for "${submittedItemName}" has been submitted and is pending admin approval.\n\nYou will be notified once your ticket is reviewed.`}
          buttonText="View My Tickets"
          type="success"
          onClose={handleSuccessClose}
        />
      )}

    </div>
  );
}
