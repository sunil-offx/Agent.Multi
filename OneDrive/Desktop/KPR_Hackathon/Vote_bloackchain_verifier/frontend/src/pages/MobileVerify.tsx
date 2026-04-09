import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/api";
import { toast } from "sonner";
import { Fingerprint, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const MobileVerify = () => {
  const { sessionId } = useParams();
  const [status, setStatus] = useState<"idle" | "scanning" | "completed" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleScan = async () => {
    setStatus("scanning");
    setError(null);
    try {
      // Step 1: Use actual WebAuthn API on the mobile device
      if (!window.PublicKeyCredential) {
        throw new Error("Biometric sensor not detected on this device. Please use a smartphone with Fingerprint/FaceID.");
      }

      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);
      
      const publicKeyCredentialCreationOptions: any = {
        challenge: challenge,
        rp: { name: "VerifyVote Remote", id: window.location.hostname },
        user: { 
            id: Uint8Array.from("voter", c => c.charCodeAt(0)), 
            name: "Voter", 
            displayName: "Voter" 
        },
        pubKeyCredParams: [{ alg: -7, type: "public-key" }],
        authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required" },
        timeout: 60000,
        attestation: "none",
      };

      const credential: any = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      });

      const fingerprintHash = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
      
      // Step 2: Submit to backend
      const response = await fetch(`${API_BASE_URL}/remote-verify/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            session_id: sessionId, 
            fingerprint_data: fingerprintHash 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit biometric data");
      }

      setStatus("completed");
      toast.success("Verification Complete! You can close this tab.");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during scanning");
      setStatus("error");
      toast.error(err.message || "Scanning failed");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in duration-500">
        <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tighter uppercase text-primary">Biometric Node</h1>
            <p className="text-muted-foreground text-sm font-medium">REMOTE SENSOR ACTIVE</p>
        </div>

        <div className={`p-12 rounded-3xl border-4 transition-all duration-500 ${
            status === 'completed' ? 'border-green-500 bg-green-500/10' : 
            status === 'error' ? 'border-destructive bg-destructive/10' :
            'border-primary/20 bg-primary/5'
        } shadow-2xl`}>
            {status === "idle" && (
                <div className="space-y-6">
                    <Fingerprint className="h-24 w-24 mx-auto text-primary animate-pulse" />
                    <div className="space-y-2">
                        <h2 className="text-xl font-bold">Ready to Scan</h2>
                        <p className="text-xs text-muted-foreground leading-relaxed">Place your finger on your phone's sensor when you click the button below.</p>
                    </div>
                    <div className="space-y-3">
                        <Button className="w-full py-8 text-lg font-bold" onClick={handleScan}>
                            START BIOMETRIC SCAN
                        </Button>
                        <Button 
                            variant="outline" 
                            className="w-full py-3 text-[10px] font-bold border-primary/20 hover:bg-primary/5 text-muted-foreground" 
                            onClick={async () => {
                                setStatus("scanning");
                                setTimeout(async () => {
                                    const dummyHash = `MOCK_REMOTE_${sessionId}_${Date.now()}`;
                                    try {
                                        const response = await fetch(`${API_BASE_URL}/remote-verify/submit`, {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ 
                                                session_id: sessionId, 
                                                fingerprint_data: dummyHash 
                                            }),
                                        });
                                        if (response.ok) {
                                            setStatus("completed");
                                            toast.success("Demo: Verification simulated!");
                                        } else {
                                            throw new Error("Simulation failed on server");
                                        }
                                    } catch (e: any) {
                                        setError(e.message);
                                        setStatus("error");
                                    }
                                }, 1500);
                            }}
                        >
                            OR SIMULATE SCAN (FOR DEMO/HTTP)
                        </Button>
                    </div>
                </div>
            )}

            {status === "scanning" && (
                <div className="space-y-6">
                    <Loader2 className="h-24 w-24 mx-auto text-primary animate-spin" />
                    <h2 className="text-xl font-bold">Scanning...</h2>
                    <p className="text-sm">Follow the system prompts on your device.</p>
                </div>
            )}

            {status === "completed" && (
                <div className="space-y-6">
                    <CheckCircle2 className="h-24 w-24 mx-auto text-green-500 animate-in zoom-in-50" />
                    <h2 className="text-xl font-bold">Verified!</h2>
                    <p className="text-sm">Data transmitted to the polling station PC.</p>
                    <p className="text-xs font-bold text-green-600">DONE</p>
                </div>
            )}

            {status === "error" && (
                <div className="space-y-6">
                    <AlertCircle className="h-24 w-24 mx-auto text-destructive" />
                    <h2 className="text-xl font-bold">Failed</h2>
                    <p className="text-sm text-destructive">{error}</p>
                    <Button variant="outline" className="w-full" onClick={() => setStatus("idle")}>
                        TRY AGAIN
                    </Button>
                </div>
            )}
        </div>

        <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/50">
            Secure End-to-End Vectorization Pipeline
        </div>
      </div>
    </div>
  );
};

export default MobileVerify;
