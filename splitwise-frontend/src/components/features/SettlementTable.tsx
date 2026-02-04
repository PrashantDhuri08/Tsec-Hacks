"use client";

import { useState } from "react";
import { splitwiseApi, SettlementResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Scale, RefreshCw, Banknote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SettlementTableProps {
    eventId: string;
}

export function SettlementTable({ eventId }: SettlementTableProps) {
    const [settlement, setSettlement] = useState<{ userId: string; netBalance: number }[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);

    const handleFetch = async () => {
        setLoading(true);
        try {
            const data = await splitwiseApi.getSettlement(eventId);
            const settlementArray = Object.entries(data).map(([userId, netBalance]) => ({
                userId,
                netBalance: Number(netBalance),
            }));
            setSettlement(settlementArray);
            setHasFetched(true);
        } catch (error) {
            console.error("Failed to fetch settlement", error);
            alert("Failed to fetch settlement data.");
        } finally {
            setLoading(false);
        }
    };

    const handleRefunds = async () => {
        setLoading(true);
        try {
            const res = await splitwiseApi.processRefunds(eventId);
            alert(res.status);
            handleFetch(); // Refresh
        } catch (error) {
            console.error("Failed to process refunds", error);
            alert("Failed to process refunds.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="glass-panel h-full border-blue-500/20 shadow-blue-500/10 shadow-xl col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2 text-blue-100">
                        <Scale className="w-6 h-6 text-blue-400" />
                        Settlement
                    </CardTitle>
                    <CardDescription>Real-time balance sheet.</CardDescription>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleRefunds} disabled={loading || !hasFetched} variant="secondary" size="sm" className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border-emerald-500/30">
                        <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                        Process Refunds
                    </Button>
                    <Button onClick={handleFetch} disabled={loading} variant="outline" size="sm" className="border-blue-500/30 text-blue-300 hover:bg-blue-500/20">
                        <RefreshCw className={cn("w-4 h-4 mr-2", loading && "animate-spin")} />
                        View Settlement
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {hasFetched && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                    >
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/10 hover:bg-transparent">
                                    <TableHead className="text-gray-400">User ID</TableHead>
                                    <TableHead className="text-right text-gray-400">Net Balance</TableHead>
                                    <TableHead className="text-right text-gray-400">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {settlement.length > 0 ? (
                                    settlement.map((s) => (
                                        <TableRow key={s.userId} className="border-white/5 hover:bg-white/5">
                                            <TableCell className="font-medium text-gray-200">User #{s.userId}</TableCell>
                                            <TableCell className={cn("text-right font-bold", s.netBalance >= 0 ? "text-green-400" : "text-red-400")}>
                                                {s.netBalance >= 0 ? "+" : ""}₹{s.netBalance.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {s.netBalance > 0 ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-400 border border-green-500/20">
                                                        Gets Refund
                                                    </span>
                                                ) : s.netBalance < 0 ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/50 text-red-400 border border-red-500/20">
                                                        Owes Money
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700/50 text-gray-400">
                                                        Settled
                                                    </span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                                            No settlement data available.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </motion.div>
                )}
                {!hasFetched && (
                    <div className="text-center text-gray-500 py-12 italic">
                        Click &quot;View Settlement&quot; to calculate balances.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
