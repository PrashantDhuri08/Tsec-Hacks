"use client";

import { useState } from "react";
import { splitwiseApi, PaymentStatus as PaymentStatusType, LedgerEntry } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, RefreshCw, Lock, ListTodo, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function PaymentManager() {
    const [intentId, setIntentId] = useState("");
    const [status, setStatus] = useState<PaymentStatusType | null>(null);
    const [ledger, setLedger] = useState<LedgerEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [ledgerLoading, setLedgerLoading] = useState(false);

    const handleCheckStatus = async () => {
        if (!intentId) return;
        setLoading(true);
        try {
            const res = await splitwiseApi.checkPaymentStatus(intentId);
            setStatus(res);
        } catch (error) {
            console.error("Failed to check status", error);
            alert("Failed to check payment status.");
        } finally {
            setLoading(false);
        }
    };

    const handleRelease = async () => {
        if (!intentId) return;
        setLoading(true);
        try {
            const res = await splitwiseApi.releasePayment(intentId);
            alert(`Payment released! Status: ${res.status}`);
            handleCheckStatus();
        } catch (error) {
            console.error("Failed to release payment", error);
            alert("Failed to release payment.");
        } finally {
            setLoading(false);
        }
    };

    const fetchLedger = async () => {
        setLedgerLoading(true);
        try {
            const entries = await splitwiseApi.getLedgerEntries();
            setLedger(entries);
        } catch (error) {
            console.error("Failed to fetch ledger", error);
            alert("Failed to fetch ledger entries.");
        } finally {
            setLedgerLoading(false);
        }
    };

    return (
        <Card className="glass-panel h-full border-purple-500/20 shadow-purple-500/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-100">
                    <CheckCircle2 className="w-5 h-5 text-purple-400" />
                    FInternet Payment Management
                </CardTitle>
                <CardDescription>Verify and release payments via FInternet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider font-semibold text-purple-300/70 ml-1">Intent ID / Reference</label>
                            <div className="flex flex-col gap-3">
                                <Input
                                    placeholder="e.g. intent_xxx"
                                    value={intentId}
                                    onChange={(e) => setIntentId(e.target.value)}
                                    className="input-glass h-12 border-purple-500/10 focus-visible:ring-purple-500/50"
                                />
                                <Button
                                    onClick={handleCheckStatus}
                                    isLoading={loading}
                                    disabled={!intentId}
                                    className="w-full bg-purple-600/50 hover:bg-purple-600 border border-purple-500/30"
                                >
                                    <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                                    Fetch Payment Status
                                </Button>
                            </div>
                        </div>

                        <div className={cn(
                            "bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 space-y-3 transition-all duration-500",
                            !status && "opacity-50 grayscale pointer-events-none"
                        )}>
                            {status ? (
                                <>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-purple-300">Current Status:</span>
                                        <div className="flex flex-col items-end">
                                            <span className="font-bold text-white uppercase">{status.status}</span>
                                            <span className="text-[10px] text-purple-400">Settlement: {status.settlementStatus}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-2 text-sm text-purple-300/50 italic">
                                    Fetch status to enable release
                                </div>
                            )}
                            <Button
                                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/20"
                                onClick={handleRelease}
                                isLoading={loading}
                                disabled={!status || status.status === "RELEASED" || status.status === "COMPLETED"}
                            >
                                <Lock className="w-4 h-4 mr-2" />
                                Release Funds to Shared Pool
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-semibold text-gray-400 flex items-center gap-2">
                            <ListTodo className="w-4 h-4" />
                            Global Ledger Entries
                        </h4>
                        <Button variant="ghost" size="sm" onClick={fetchLedger} disabled={ledgerLoading} className="text-[10px] text-gray-500 hover:text-white">
                            <RefreshCw className={cn("w-3 h-3 mr-1", ledgerLoading && "animate-spin")} />
                            Refresh
                        </Button>
                    </div>

                    <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                        {ledger.map((entry, i) => (
                            <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/5 text-xs">
                                <div className="flex flex-col">
                                    <span className="text-gray-400 font-mono truncate max-w-[120px]">{entry.reference}</span>
                                    <span className="text-[10px] text-purple-400/70">{entry.status}</span>
                                </div>
                                <span className="font-bold text-white">₹{entry.amount}</span>
                            </div>
                        ))}
                        {ledger.length === 0 && !ledgerLoading && (
                            <p className="text-center text-xs text-gray-500 italic py-4">No entries found.</p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
