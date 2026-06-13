import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import campusLogo from "../../imports/KJUSYS2-1.png";
import { authService } from "@/features/auth/services/authService";
import { toast } from "sonner";

interface StudentLoginPageProps {
  onBack: () => void;
  onGoToSignup?: () => void; // Keeping for signature compatibility, though unused now
  onLoginSuccess?: (token: string, data: any) => void;
}

export default function StudentLoginPage({ onBack }: StudentLoginPageProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await authService.loginWithGoogle();
      // authListener will handle the redirect upon successful OAuth redirect
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error("Failed to sign in with Google", {
        description: err.message || "An unexpected error occurred.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#f0f4f8" }}>
      <div className="px-8 pt-7 pb-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm transition-colors"
          style={{ fontFamily: "DM Sans, sans-serif" }}
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className="flex-1 flex items-start justify-center px-4 pt-6 pb-12">
        <div
          className="w-full overflow-hidden"
          style={{
            maxWidth: 520,
            borderRadius: 20,
            boxShadow: "0 8px 40px #0000001a, 0 2px 12px #00000010",
            background: "linear-gradient(160deg, #cef3f8 0%, #e8fafc 18%, #ffffff 45%)",
          }}
        >
          <div className="px-10 pt-12 pb-10">
            <div className="flex justify-center mb-8">
              <img src={campusLogo} alt="Kristu Jayanti University" className="h-12 object-contain" />
            </div>

            <div className="text-center mb-7">
              <h1 className="text-gray-900 mb-1" style={{ fontFamily: "Outfit, sans-serif", fontSize: "1.65rem", fontWeight: 800, letterSpacing: "-0.01em" }}>
                Student Login
              </h1>
              <p className="text-gray-500 text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
                Use your @kristujayanti.com account to continue
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-3.5 bg-white border border-gray-200 rounded-full text-gray-700 font-semibold text-sm transition-all duration-200 hover:shadow-md hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "DM Sans, sans-serif" }}
              >
                {/* Google Icon SVG */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {loading ? "Connecting..." : "Sign in with Google"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
