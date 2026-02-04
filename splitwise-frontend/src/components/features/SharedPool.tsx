"use client";

import { useState, useEffect } from "react";
import { splitwiseApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { PiggyBank, Wallet, Plus } from "lucide-react";

interface SharedPoolProps {
    eventId: string;
}

interface DepositLog {
    userId: number;
    amount: number;
    timestamp: string;
}

export function SharedPool({ eventId }: SharedPoolProps) {
    const [userId, setUserId] = useState("");
    const [amount, setAmount] = useState("");
    const [deposits, setDeposits] = useState<DepositLog[]>([]);
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasUserId, setHasUserId] = useState(false);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(storedUserId);
            setHasUserId(true);
        }

        const fetchBalance = async () => {
            try {
                const bal = await splitwiseApi.getPoolBalance(eventId);
                setBalance(bal);
            } catch (error) {
                console.error("Failed to fetch balance", error);
            }
        };
        fetchBalance();
    }, [eventId]);

    const handleDeposit = async () => {
        if (!userId || !amount) return;
        setLoading(true);
        try {
            await splitwiseApi.depositFunds(eventId, Number(userId), Number(amount));
            const newAmount = Number(amount);
            setDeposits((prev) => [
                { userId: Number(userId), amount: newAmount, timestamp: new Date().toLocaleTimeString() },
                ...prev,
            ]);
            setBalance(prev => prev + newAmount);
            setUserId("");
            setAmount("");
        } catch (error) {
            console.error("Failed to deposit", error);
            alert("Deposit failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="glass-card h-full border-blue-500/20 shadow-blue-500/10">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-2xl text-blue-100 font-heading">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Wallet className="w-6 h-6 text-blue-400" />
                    </div>
                    Shared Pool
                </CardTitle>
                <CardDescription className="text-blue-200/50">Deposit funds for group expenses.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-blue-500/10 blur-xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
                    <span className="text-blue-200 text-sm font-medium relative z-10 block mb-1">Current Balance</span>
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white relative z-10">
                        ₹{balance.toFixed(2)}
                    </div>
                </div>

                <div className="space-y-4">
                    {!hasUserId && (
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider font-semibold text-blue-300/70 ml-1">User ID</label>
                            <Input
                                type="number"
                                placeholder="Your ID"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className="input-glass h-12 border-blue-500/10 focus-visible:ring-blue-500/50"
                            />
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider font-semibold text-blue-300/70 ml-1">Deposit Amount</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="input-glass pl-8 h-12 text-lg border-blue-500/10 focus-visible:ring-blue-500/50"
                            />
                        </div>
                    </div>
                </div>
                <Button
                    className="w-full h-12 text-lg font-medium bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 border-0 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] rounded-xl"
                    onClick={handleDeposit}
                    isLoading={loading}
                    disabled={!amount}
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Funds
                </Button>

                <div className="mt-6">
                    <p className="text-sm font-medium text-gray-400 mb-2">Recent Deposits</p>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                        <AnimatePresence>
                            {deposits.map((d, i) => (
                                <motion.div
                                    key={`${d.userId}-${i}`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/5 text-sm"
                                >
                                    <span className="text-gray-300">User #{d.userId}</span>
                                    <span className="font-bold text-green-400">+₹{d.amount}</span>
                                </motion.div>
                            ))}
                            {deposits.length === 0 && (
                                <p className="text-center text-xs text-gray-500 italic">No deposits yet.</p>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
