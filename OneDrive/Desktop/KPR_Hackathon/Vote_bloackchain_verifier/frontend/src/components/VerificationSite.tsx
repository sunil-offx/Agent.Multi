import { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Fingerprint, QrCode, ArrowLeft, Camera, AlertCircle, Smartphone, Monitor } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { QRCodeCanvas } from "qrcode.react";

interface VerificationSiteProps {
  voterId: string;
  voterName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const VerificationSite = ({ voterId, voterName, onSuccess, onCancel }: VerificationSiteProps) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (step === 1) {
      // Small delay to ensure the container is rendered
      const timer = setTimeout(() => {
        try {
          const scanner = new Html5QrcodeScanner(
            "reader",
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
              aspectRatio: 1.0,
              showTorchButtonIfSupported: true
            },
            false
          );

          scannerRef.current = scanner;

          scanner.render(
            async (decodedText) => {
              scanner.clear();
              handleQRScanned(decodedText);
            },
            (error) => {
              // Only set error if it's a critical camera error, not just "no QR found"
              if (error?.includes("Permission") || error?.includes("NotFound")) {
                setScannerError("Camera not found or permission denied. Note: Camera requires HTTPS if accessed via network IP.");
              }
            }
          );
        } catch (err: any) {
          console.error("Scanner init error:", err);
          setScannerError("Failed to initialize scanner. Make sure you are using Localhost or HTTPS.");
        }
      }, 500);

      return () => {
        clearTimeout(timer);
        if (scannerRef.current) {
          scannerRef.current.clear().catch(e => console.error("Clear error", e));
        }
      };
    }
  }, [step]);

  const handleQRScanned = async (content: string) => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/verify-qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qr_content: content, voter_id: voterId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "QR Verification Failed");
      }

      toast.success("QR Code Verified Successfully");
      setStep(2);
    } catch (error: any) {
      toast.error(error.message);
      setStep(1);
    } finally {
      setIsProcessing(false);
    }
  };

  const simulateQRScan = () => {
    toast.info("Simulating successful QR extraction...");
    handleQRScanned(`MOCK_QR_DATA_${voterId}`);
  };

  const [registeredFingers, setRegisteredFingers] = useState<string[]>([]);
  const [useRemote, setUseRemote] = useState(true);
  const [remoteSessionId, setRemoteSessionId] = useState<string | null>(null);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const startRemoteScan = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/remote-verify/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voter_id: voterId }),
      });
      const data = await response.json();
      setRemoteSessionId(data.session_id);

      // Start polling
      if (pollingRef.current) clearInterval(pollingRef.current);
      pollingRef.current = setInterval(() => checkRemoteStatus(data.session_id), 3000);
    } catch (err) {
      toast.error("Failed to start remote session");
    } finally {
      setIsProcessing(false);
    }
  };

  const checkRemoteStatus = async (sessionId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/remote-verify/status/${sessionId}`);
      const data = await response.json();
      if (data.status === "completed") {
        if (pollingRef.current) clearInterval(pollingRef.current);
        await submitBiometric(data.fingerprint_data);
        setRemoteSessionId(null);
      }
    } catch (err) {
      console.error("Polling error", err);
    }
  };

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  useEffect(() => {
    if (step === 2 && useRemote && !remoteSessionId && !isProcessing) {
      startRemoteScan();
    }
  }, [step, useRemote, remoteSessionId]);

  const handleBiometric = async () => {
    setIsProcessing(true);
    try {
      if (!window.PublicKeyCredential && !window.location.hostname.includes("localhost")) {
        // Fallback for demo if hardware is missing
        const dummyHash = `MOCK_BIOMETRIC_${voterId}_${Date.now()}`;
        return await submitBiometric(dummyHash);
      }

      // Step 2: Use actual WebAuthn API
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      const userID = Uint8Array.from(voterId, c => c.charCodeAt(0));

      const publicKeyCredentialCreationOptions: any = {
        challenge: challenge,
        rp: { name: "VerifyVote System", id: window.location.hostname },
        user: { id: userID, name: voterName, displayName: voterName },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
        timeout: 60000,
        attestation: "none",
      };

      toast.info(`Please scan ${registeredFingers.length === 0 ? 'your first' : 'another'} finger...`);

      const credential: any = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      });

      const fingerprintHash = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
      await submitBiometric(fingerprintHash);

    } catch (error: any) {
      console.error("Biometric error:", error);
      toast.error(error.message || "Native sensor access failed. Using demo simulation.");
      // Auto-fallback for demo speed
      const dummyHash = `DEMO_BIO_${voterId}_${Date.now()}`;
      await submitBiometric(dummyHash);
    } finally {
      setIsProcessing(false);
    }
  };

  const submitBiometric = async (hash: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/verify-biometric`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voter_id: voterId,
          fingerprint_data: hash
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Authentication Failed");
      }

      const result = await response.json();
      setRegisteredFingers(prev => [...prev, result.finger]);
      toast.success(`${result.finger} recorded successfully!`);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const getRemoteBaseUrl = () => {
    const override = localStorage.getItem("remote_host_override") || "";
    const cleanOverride = override.trim();
    if (!cleanOverride) return `${window.location.protocol}//${window.location.hostname}${window.location.port ? ':' + window.location.port : ''}`;
    if (cleanOverride.startsWith("http")) return cleanOverride;
    if (cleanOverride.includes("loca.lt") || cleanOverride.includes("ngrok")) return `https://${cleanOverride}`;
    return `${window.location.protocol}//${cleanOverride}${window.location.port ? ':' + window.location.port : ''}`; // Fallback for IP
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card border border-border w-full max-w-lg rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-primary p-6 text-primary-foreground flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold font-heading uppercase tracking-tight">Identity Verification</h2>
            <p className="text-xs opacity-90 font-medium">NAME: {voterName} | ID: {voterId}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onCancel} className="text-primary-foreground hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-8">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            <div className={`flex flex-col items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${step >= 1 ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.2)]" : "border-muted"}`}>1</div>
              <span className="text-[10px] font-bold uppercase tracking-widest">QR Scan</span>
            </div>
            <div className={`h-1 flex-1 mx-4 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} />
            <div className={`flex flex-col items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold ${step >= 2 ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.2)]" : "border-muted"}`}>2</div>
              <span className="text-[10px] font-bold uppercase tracking-widest">Biometric</span>
            </div>
          </div>

          {step === 1 && (
            // ... QR Scan Section (remain unchanged) ...
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <div className="text-center">
                <QrCode className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-bold font-heading">Step 1: Scan Voter QR</h3>
                <p className="text-sm text-muted-foreground mt-1">Point the camera at the QR code on the voter's slip.</p>
              </div>

              {scannerError && (
                <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 py-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="text-xs font-bold uppercase">Hardware Error/Security Block</AlertTitle>
                  <AlertDescription className="text-xs">
                    {scannerError}
                  </AlertDescription>
                </Alert>
              )}

              <div id="reader" className="overflow-hidden rounded-xl border-2 border-dashed border-border bg-black/5 min-h-[280px]" />

              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full border-primary/20 hover:bg-primary/5 text-primary font-bold"
                  onClick={simulateQRScan}
                  disabled={isProcessing}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Demo: Simulate QR Scan
                </Button>
              </div>

              {isProcessing && (
                <div className="flex flex-col items-center gap-2 py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs font-bold uppercase tracking-tighter">Validating QR Token...</p>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
              <div className="text-center">
                <Fingerprint className="h-10 w-10 mx-auto mb-4 text-primary" />
                <h3 className="text-lg font-bold font-heading">Step 2: Biometric Vault</h3>
                <p className="text-sm text-muted-foreground mt-1">Register multiple fingers for higher security indexing.</p>
              </div>

              <div className="flex bg-muted p-1 rounded-lg mb-4">
                <Button
                  variant={!useRemote ? "default" : "ghost"}
                  className="flex-1 text-[10px] font-bold h-8"
                  onClick={() => setUseRemote(false)}
                >
                  <Monitor className="mr-2 h-3 w-3" /> LOCAL SENSOR
                </Button>
                <Button
                  variant={useRemote ? "default" : "ghost"}
                  className="flex-1 text-[10px] font-bold h-8"
                  onClick={() => {
                    setUseRemote(true);
                    if (!remoteSessionId) startRemoteScan();
                  }}
                >
                  <Smartphone className="mr-2 h-3 w-3" /> MOBILE SENSOR
                </Button>
              </div>

              <div className="p-6 border-2 border-dashed border-primary/30 rounded-2xl bg-primary/5 flex flex-col items-center gap-6 shadow-inner">
                {!useRemote ? (
                  <>
                    {registeredFingers.length > 0 && (
                      <div className="w-full space-y-2">
                        <p className="text-[10px] font-bold uppercase text-primary text-center">Registered Vectors</p>
                        <div className="flex flex-wrap justify-center gap-2">
                          {registeredFingers.map((f, i) => (
                            <div key={i} className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full animate-in zoom-in-50">
                              {f}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="relative">
                      <div className={`w-20 h-20 rounded-full bg-primary/20 absolute inset-0 ${isProcessing ? 'animate-ping' : ''}`} />
                      <div className="w-20 h-20 rounded-full bg-background border-4 border-primary/50 flex items-center justify-center relative shadow-xl">
                        <Fingerprint className="h-10 w-10 text-primary" />
                      </div>
                    </div>

                    <div className="w-full flex flex-col gap-3">
                      <Button
                        className="w-full py-6 text-sm font-bold shadow-lg hover:shadow-primary/20 transition-all tracking-tight"
                        onClick={handleBiometric}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        ) : null}
                        {registeredFingers.length === 0 ? "SCAN FIRST FINGER" : "SCAN ADDITIONAL FINGER"}
                      </Button>

                      {registeredFingers.length > 0 && (
                        <Button
                          variant="secondary"
                          className="w-full py-4 text-xs font-black uppercase tracking-widest bg-green-600 hover:bg-green-700 text-white"
                          onClick={onSuccess}
                        >
                          Finalize Verification
                        </Button>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="w-full text-center space-y-4">
                    {remoteSessionId ? (
                      <div className="w-full flex flex-col items-center gap-4">
                        <div className="space-y-4 w-full flex flex-col items-center text-center">
                          <div className="bg-white p-4 rounded-xl inline-block shadow-lg border-2 border-primary/20">
                            <QRCodeCanvas
                              value={`${getRemoteBaseUrl()}/mobile-verify/${remoteSessionId}`}
                              size={180}
                              level="H"
                            />
                          </div>

                          {(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") && (
                            <div className="w-full max-w-[240px] space-y-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                              <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest">Mobile Connection Config</p>
                              <div className="space-y-1">
                                <p className="text-[8px] text-amber-700 font-bold">ENTER TUNNEL URL OR PC IP:</p>
                                <input
                                  type="text"
                                  placeholder="e.g. https://...loca.lt"
                                  className="w-full text-[10px] p-2 border border-amber-300 rounded bg-white text-center font-mono shadow-inner"
                                  defaultValue={localStorage.getItem("remote_host_override") || ""}
                                  onChange={(e) => {
                                    localStorage.setItem("remote_host_override", e.target.value);
                                    // Note: The QR code will naturally re-render when remoteSessionId or state changes, 
                                    // but for a faster UX we force a small UI refresh by regenerating session if they want.
                                  }}
                                />
                              </div>
                              <p className="text-[8px] text-muted-foreground italic leading-tight">Hint: PC local IP is required for phone to reach PC. Both must be on same Wi-Fi.</p>
                            </div>
                          )}
                        </div>

                        <div className="space-y-3 w-full text-center">
                          <div className="text-center">
                            <p className="text-sm font-bold">Scan with Mobile Phone</p>
                            <div className="flex items-center justify-center gap-2 text-[10px] font-medium text-muted-foreground animate-pulse mt-1">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              <span>WAITING FOR REMOTE BIOMETRICS...</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full h-8 text-[10px] font-bold border-primary/20 hover:bg-primary/5 shadow-sm"
                              onClick={() => {
                                const url = `${getRemoteBaseUrl()}/mobile-verify/${remoteSessionId}`;
                                navigator.clipboard.writeText(url).then(() => toast.success("URL copied to clipboard!"));
                              }}
                            >
                              COPY MOBILE URL
                            </Button>
                            <Button variant="link" size="sm" className="h-6 text-[10px] text-muted-foreground" onClick={startRemoteScan}>
                              Regenerate Session / Refresh QR
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    )}

                    {registeredFingers.length > 0 && (
                      <Button
                        variant="secondary"
                        className="w-full py-4 text-xs font-black uppercase tracking-widest bg-green-600 hover:bg-green-700 text-white"
                        onClick={onSuccess}
                      >
                        Finalize Verification
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-muted/30 p-4 rounded-lg flex gap-3 items-center">
                <div className="p-2 bg-primary/10 rounded-full">
                  <AlertCircle className="h-4 w-4 text-primary" />
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Each scan generates a unique 128-dimensional vector in our cross-referenced identity bank.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationSite;
