import "@fontsource/eczar/600.css";
import "@fontsource/eczar/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import { RefreshCw } from "lucide-react";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCaptcha } from "@/components/CaptchaGenerator";
import { API_BASE_URL } from "@/lib/api";

const Index = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { captchaText, canvasRef, refresh } = useCaptcha();

  const navigate = useNavigate();

  const handleAction = async () => {
    setError("");
    setSuccess("");

    if (!username.trim()) {
      setError("Voter ID / Username is required.");
      return;
    }
    if (!password.trim()) {
      setError("Password is required.");
      return;
    }
    if (!captchaInput.trim()) {
      setError("Captcha is required.");
      return;
    }
    if (captchaInput !== captchaText) {
      setError("Captcha verification failed. Try again.");
      setCaptchaInput("");
      refresh();
      return;
    }

    setIsAuthenticating(true);

    try {
      const apiUrl = API_BASE_URL;

      // Login Flow
      const formData = new URLSearchParams();
      formData.append("username", username);
      formData.append("password", password);

      const loginRes = await fetch(`${apiUrl}/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString()
      });

      if (!loginRes.ok) {
        throw new Error("Invalid credentials");
      }

      const tokenData = await loginRes.json();
      sessionStorage.setItem("access_token", tokenData.access_token);

      // Navigate to polling station selection page
      navigate("/polling-station-selection");

    } catch (err: any) {
      setError(err.message || "An error occurred");
      setCaptchaInput("");
      refresh();
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-[500px]">
        {/* Header */}
        <h1 className="font-heading text-3xl font-semibold text-foreground text-center mb-10 tracking-tight sm:text-4xl">
          Election Commission of India
        </h1>

        {/* Login Block */}
        <div
          className={`relative overflow-hidden border border-border transition-all duration-300 ${isAuthenticating ? "bg-primary" : "bg-background"
            }`}
          style={{ padding: "48px" }}
        >
          {/* Authenticating overlay */}
          {isAuthenticating && (
            <div className="absolute inset-0 flex items-center justify-center bg-primary z-10">
              <p className="font-heading text-2xl font-semibold text-primary-foreground tracking-wide">
                Authenticating...
              </p>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className={`transition-opacity duration-300 ${isAuthenticating ? "opacity-0" : "opacity-100"
              }`}
          >
            {/* Error / Success */}
            {error && (
              <p className="text-destructive font-body text-sm mb-6 leading-relaxed">
                {error}
              </p>
            )}
            {success && (
              <p className="text-green-500 font-body text-sm mb-6 leading-relaxed">
                {success}
              </p>
            )}

            {/* Username */}
            <div className="mb-6">
              <label className="block font-heading text-sm font-bold text-foreground mb-2">
                Admin Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Admin Username"
                className="w-full border border-input bg-background px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                maxLength={100}
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block font-heading text-sm font-bold text-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full border border-input bg-background px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                maxLength={128}
              />
            </div>

            {/* Captcha */}
            <div className="mb-6">
              <label className="block font-heading text-sm font-bold text-foreground mb-2">
                Security Verification
              </label>
              <div className="flex items-center gap-3 mb-3">
                <canvas
                  ref={canvasRef}
                  className="border border-input"
                  style={{ width: 200, height: 60 }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setCaptchaInput("");
                    refresh();
                  }}
                  className="p-2 text-primary hover:text-primary/80 transition-colors"
                  aria-label="Refresh captcha"
                >
                  <RefreshCw size={20} />
                </button>
              </div>
              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Enter Captcha"
                className="w-full border border-input bg-background px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                maxLength={10}
              />
            </div>

            {/* Login Button */}
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={handleAction}
                className="w-full bg-primary text-primary-foreground font-heading text-base font-semibold py-3 tracking-wide hover:bg-primary/90 transition-colors"
              >
                Admin Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
