"use client";

import { useState } from "react";
import { splitwiseApi, ExpenseCategory } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Receipt, CreditCard } from "lucide-react";

interface CreateExpenseProps {
    eventId: string;
    categories: ExpenseCategory[];
}

export function CreateExpense({ eventId, categories }: CreateExpenseProps) {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!selectedCategoryId || !amount) return;
        setLoading(true);
        try {
            const res = await splitwiseApi.createExpense(eventId, Number(selectedCategoryId), Number(amount));
            if (res.payment_url) {
                window.location.href = res.payment_url;
            } else {
                alert("Expense created, but no payment URL returned.");
            }
        } catch (error) {
            console.error("Failed to create expense", error);
            alert("Failed to create expense.");
        } finally {
            // Don't separate setLoading(false) if redirecting, but good for error case.
            setLoading(false);
        }
    };

    return (
        <Card className="glass-card h-full border-green-500/20 shadow-green-500/10">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-2xl text-green-100 font-heading">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                        <Receipt className="w-6 h-6 text-green-400" />
                    </div>
                    Add Expense
                </CardTitle>
                <CardDescription className="text-green-200/50">Record a new payment for a category.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-semibold text-green-300/70 ml-1">Category</label>
                    <div className="relative">
                        <select
                            className="flex h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/50 transition-all duration-300 appearance-none cursor-pointer hover:bg-black/30"
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                        >
                            <option value="" disabled className="bg-gray-900 text-gray-500">Select a category...</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id} className="bg-gray-900 text-white">
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            ▼
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-semibold text-green-300/70 ml-1">Amount (₹)</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="input-glass pl-8 h-12 text-lg border-green-500/10 focus-visible:ring-green-500/50"
                        />
                    </div>
                </div>
                <Button
                    className="w-full h-12 text-lg font-medium bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 border-0 mt-2 shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] rounded-xl"
                    onClick={handleCreate}
                    isLoading={loading}
                    disabled={!selectedCategoryId || !amount}
                >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pay & Create
                </Button>
            </CardContent>
        </Card>
    );
}
