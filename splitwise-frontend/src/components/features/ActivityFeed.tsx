"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";

interface ActivityItem {
    id: number;
    user: string;
    action: string;
    target?: string;
    time: string;
    icon?: string;
}

// Mock Activity Data
const activities: ActivityItem[] = [
    { id: 1, user: "Alice", action: "joined the group", time: "2 mins ago", icon: "👋" },
    { id: 2, user: "Bob", action: "added expense", target: "Dinner", time: "15 mins ago", icon: "🍔" },
    { id: 3, user: "Charlie", action: "deposited", target: "₹2000", time: "1 hour ago", icon: "💰" },
    { id: 4, user: "Alice", action: "created category", target: "Travel", time: "2 hours ago", icon: "✈️" },
];

export function ActivityFeed() {
    return (
        <Card className="glass-panel h-full max-h-[400px] overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-400" />
                    Recent Activity
                </CardTitle>
                <CardDescription>Live updates from the group.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto custom-scrollbar h-[300px] pr-2">
                {activities.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-lg">
                            {item.icon}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-200">
                                <span className="font-semibold text-white">{item.user}</span> {item.action} <span className="text-indigo-300">{item.target}</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                        </div>
                    </motion.div>
                ))}
            </CardContent>
        </Card>
    );
}
