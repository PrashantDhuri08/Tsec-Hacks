"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ExpenseCategory } from "@/lib/api";
import { motion } from "framer-motion";
import { PieChart as PieChartIcon } from "lucide-react";

interface ExpenseChartProps {
    categories: ExpenseCategory[];
}

// Mock data generation (since we don't have real expense totals per category yet)
const generateData = (categories: ExpenseCategory[]) => {
    if (categories.length === 0) return [];
    return categories.map((cat, index) => ({
        name: cat.name,
        value: Math.floor(Math.random() * 5000) + 1000, // Mock value ₹1000-₹6000
        color: `hsl(${index * 45 + 200}, 80%, 60%)` // Generate distinct colors
    }));
};

export function ExpenseChart({ categories }: ExpenseChartProps) {
    const data = generateData(categories);

    return (
        <Card className="glass-panel h-full min-h-[400px]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-indigo-400" />
                    Spending Breakdown
                </CardTitle>
                <CardDescription>Expenses by category (Simulated).</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full relative">
                {categories.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(20, 20, 30, 0.9)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value: number) => [`₹${value}`, 'Spent']}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                        No categories to display.
                    </div>
                )}
                {/* Center Text Overlays */}
                {categories.length > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <span className="text-xs text-gray-400 uppercase tracking-wider">Total</span>
                            <div className="text-xl font-bold text-white">
                                ₹{data.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
