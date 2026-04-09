import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, Loader2, RefreshCw, Smartphone, Info, AlertCircle } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import VerificationSite from "@/components/VerificationSite";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { QRCodeSVG } from "qrcode.react";
import { 
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export interface VoterRecord {
    voterName: string;
    voterId: string;
    fatherName: string;
    verified: boolean;
}

const VotingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const stateData = location.state as {
        stateName: string;
        district: string;
        constituency: string;
        stationNumber: number;
        stationName: string;
        stationLocation: string;
    } | null;

    const [voters, setVoters] = useState<VoterRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeVerification, setActiveVerification] = useState<VoterRecord | null>(null);
    const [mobileUrl, setMobileUrl] = useState("");

    useEffect(() => {
        // Try to generate a useful mobile URL
        const hostname = window.location.hostname;
        if (hostname === "localhost" || hostname === "127.0.0.1") {
            setMobileUrl("Check your terminal for the 'Network' IP (e.g., http://192.168.x.x:8080)");
        } else {
            setMobileUrl(window.location.href);
        }
    }, []);

    // If no context, redirect to home
    useEffect(() => {
        if (!stateData) {
            navigate("/");
        }
    }, [stateData, navigate]);

    const fetchVotersFromBackend = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/electors`);
            if (response.ok) {
                const backendElectors = await response.json();
                return backendElectors;
            }
        } catch (e) {
            console.error("Failed to fetch electors from backend", e);
        }
        return null;
    };

    const loadDataset = async () => {
        if (!stateData) return;
        setIsLoading(true);
        const fileName = `dataset_${stateData.constituency.replace(/\s+/g, '_')}_${stateData.stationNumber}.csv`;
        
        try {
            const response = await fetch(`/${fileName}`);
            if (!response.ok) throw new Error("Dataset not found");
            const text = await response.text();

            const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
            if (lines.length < 2) throw new Error("CSV empty");

            const csvVoters: any[] = [];
            for (let i = 1; i < lines.length; i++) {
                const columns = lines[i].split(",").map(col => col.trim().replace(/^"|"$/g, ''));
                if (columns.length >= 3) {
                    csvVoters.push({
                        voter_name: columns[0],
                        voter_id: columns[1],
                        father_name: columns[2]
                    });
                }
            }

            await fetch(`${API_BASE_URL}/sync-electors`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(csvVoters)
            });

            const backendData = await fetchVotersFromBackend();
            if (backendData) {
                const merged = csvVoters.map(v => {
                    const status = backendData.find((b: any) => b.voter_id === v.voter_id);
                    return {
                        voterName: v.voter_name,
                        voterId: v.voter_id,
                        fatherName: v.father_name,
                        verified: status ? status.is_verified : false
                    };
                });
                setVoters(merged);
            }

            toast.success(`Active Dataset: ${fileName}`);
        } catch (err) {
            console.error(err);
            toast.error("Error loading/syncing dataset.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDataset();
    }, [stateData]);

    const handleVerificationSuccess = () => {
        if (activeVerification) {
            setVoters(prev => prev.map(v => 
                v.voterId === activeVerification.voterId ? { ...v, verified: true } : v
            ));
        }
        setActiveVerification(null);
    };

    if (!stateData) return null;

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="border-b-4 border-primary bg-primary shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-center sm:text-left">
                        <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-primary-foreground tracking-tighter uppercase">
                            Verification identity Desk
                        </h1>
                        <p className="font-heading text-xs sm:text-sm text-primary-foreground/80 font-bold">
                            {stateData.stationName} — {stateData.constituency}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="secondary" size="sm" className="font-bold shadow-md hover:bg-white/90">
                                    <Smartphone className="mr-2 h-4 w-4" />
                                    Connect Mobile Sensor
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-sm">
                                <DialogHeader>
                                    <DialogTitle className="font-heading font-black text-xl uppercase italic tracking-tighter">Handheld Verifier</DialogTitle>
                                    <DialogDescription className="text-xs font-medium">
                                        Scan this QR with your mobile to use it as a portable fingerprint & QR scanner.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-xl border-2 border-dashed border-primary/20">
                                    {mobileUrl.startsWith("http") ? (
                                        <>
                                            <div className="bg-white p-4 rounded-lg shadow-xl mb-4">
                                                <QRCodeSVG value={mobileUrl} size={180} />
                                            </div>
                                            <p className="text-[10px] font-mono bg-background px-2 py-1 rounded border overflow-hidden w-full text-center">
                                                {mobileUrl}
                                            </p>
                                        </>
                                    ) : (
                                        <div className="text-center py-4">
                                            <AlertCircle className="h-10 w-10 text-orange-500 mx-auto mb-2" />
                                            <p className="text-xs font-bold text-orange-600">{mobileUrl}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-primary/5 p-3 rounded-lg flex items-start gap-2">
                                    <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                    <p className="text-[10px] leading-relaxed text-muted-foreground">
                                        <strong>Pro Tip:</strong> Mobile biometrics require a secure connection. Access via your laptop's Wi-Fi IP. Ensure your phone is on the same network.
                                    </p>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6">
                <div className="flex justify-end mb-4">
                    <Button variant="outline" size="sm" onClick={loadDataset} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                        Sync Records
                    </Button>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-lg bg-card">
                        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                        <h2 className="font-heading text-xl font-semibold mb-2">Syncing with Backend...</h2>
                        <p className="font-body text-muted-foreground text-center max-w-md">
                            Initializing distributed database records for verification...
                        </p>
                    </div>
                ) : voters.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-lg bg-card text-center">
                        <h2 className="font-heading text-xl text-destructive font-semibold mb-2">Dataset Not Found</h2>
                        <p className="font-body text-muted-foreground max-w-md">
                            Please drop your <strong>{`dataset_${stateData.constituency.replace(/\s+/g, '_')}_${stateData.stationNumber}.csv`}</strong> file directly into the:
                            <br /><br />
                            <code className="bg-muted px-3 py-2 rounded text-base border-border border">frontend/public/</code>
                            <br /><br /> folder and click Sync Records.
                        </p>
                    </div>
                ) : (
                    <div className="bg-card border border-border mt-4 shadow-sm rounded-md overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/20">
                            <h2 className="font-heading text-lg font-bold">Registered Voters Database</h2>
                            <span className="text-sm text-primary font-bold font-heading px-3 py-1 bg-primary/10 rounded-full">
                                {voters.length} Records Loaded
                            </span>
                        </div>

                        <div className="max-h-[600px] overflow-auto p-0 scrollbar-thin">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableHead className="font-heading font-bold sticky top-0 bg-muted border-b z-10">Voter Name</TableHead>
                                        <TableHead className="font-heading font-bold sticky top-0 bg-muted border-b z-10">Voter ID (EPIC)</TableHead>
                                        <TableHead className="font-heading font-bold sticky top-0 bg-muted border-b z-10">Father's Name</TableHead>
                                        <TableHead className="font-heading font-bold text-center w-32 sticky top-0 bg-muted border-b z-10">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {voters.map((voter, idx) => (
                                        <TableRow key={idx} className={`transition-colors duration-200 ${voter.verified ? "bg-green-500/10 hover:bg-green-500/15" : ""}`}>
                                            <TableCell className="font-body font-semibold text-base py-4">{voter.voterName}</TableCell>
                                            <TableCell className="font-body font-medium text-muted-foreground py-4">{voter.voterId}</TableCell>
                                            <TableCell className="font-body text-muted-foreground py-4">{voter.fatherName}</TableCell>
                                            <TableCell className="text-center py-4">
                                                {voter.verified ? (
                                                    <div className="flex flex-col items-center justify-center text-green-600 gap-1 select-none">
                                                        <CheckCircle2 className="h-5 w-5" />
                                                        <span className="text-xs font-bold uppercase tracking-wider">Verified</span>
                                                    </div>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => setActiveVerification(voter)}
                                                        className="w-full font-heading font-bold hover:scale-105 transition-transform"
                                                    >
                                                        Verify
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="p-4 border-t border-border bg-muted/20 flex justify-between items-center">
                            <div className="text-sm text-muted-foreground font-body">
                                {voters.filter(v => v.verified).length} / {voters.length} Verified
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {activeVerification && (
                <VerificationSite 
                    voterId={activeVerification.voterId}
                    voterName={activeVerification.voterName}
                    onSuccess={handleVerificationSuccess}
                    onCancel={() => setActiveVerification(null)}
                />
            )}
        </div>
    );
};

export default VotingPage;
