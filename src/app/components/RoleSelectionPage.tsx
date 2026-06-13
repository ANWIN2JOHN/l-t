import { ShieldCheck, ArrowLeft } from "lucide-react";
import campusLogo from "../../imports/KJUSYS2-1.png";

interface RoleSelectionPageProps {
  onSelectRole: (role: "student" | "admin") => void;
  onBack: () => void;
}

export default function RoleSelectionPage({ onSelectRole, onBack }: RoleSelectionPageProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f0f4f8" }}>
      {/* Back to Home */}
      <div className="px-8 pt-7 pb-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm transition-colors"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
      </div>

      {/* Centered content */}
      <div className="flex-1 flex items-start justify-center px-4 pt-12 pb-12">
        <div className="w-full max-w-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src={campusLogo}
              alt="Kristu Jayanti University"
              className="h-14 object-contain"
            />
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <h1
              className="text-gray-900 mb-2"
              style={{ fontFamily: "Outfit, sans-serif", fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.01em" }}
            >
              Admin Login
            </h1>
            <p className="text-gray-500 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
              Manage lost items and approve tickets
            </p>
          </div>

          {/* Admin Login Card */}
          <div className="flex justify-center">
            <button
              onClick={() => onSelectRole("admin")}
              className="group w-full max-w-md"
            >
              <div
                className="w-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                style={{
                  borderRadius: 20,
                  boxShadow: "0 4px 20px #0000000f, 0 1px 6px #00000008",
                  background: "linear-gradient(160deg, #cef3f8 0%, #e8fafc 18%, #ffffff 45%)",
                }}
              >
                <div className="px-8 py-10 text-center">
                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                    <ShieldCheck size={32} className="text-cyan-600" />
                  </div>

                  {/* Title */}
                  <h2
                    className="text-gray-900 mb-2"
                    style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.4rem", fontWeight: 700 }}
                  >
                    Continue as Admin
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: "DM Sans, sans-serif" }}>
                    Access admin dashboard to manage the system
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
