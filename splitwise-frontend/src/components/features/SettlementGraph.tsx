"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Network } from "lucide-react";
import { motion } from "framer-motion";

interface VisualNode {
    id: number;
    initial: string;
    x: number;
    y: number;
    color: string;
}

// Mock visual nodes for the graph
const nodes: VisualNode[] = [
    { id: 1, initial: "A", x: 20, y: 50, color: "bg-blue-500" },
    { id: 2, initial: "B", x: 80, y: 20, color: "bg-green-500" },
    { id: 3, initial: "C", x: 80, y: 80, color: "bg-purple-500" },
];

export function SettlementGraph() {
    return (
        <Card className="glass-panel h-full min-h-[300px]">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Network className="w-5 h-5 text-pink-400" />
                    Settlement Flow
                </CardTitle>
                <CardDescription>Visualizing debt relationships.</CardDescription>
            </CardHeader>
            <CardContent className="relative h-[250px] w-full overflow-hidden">
                {/* Connecting Lines (Animated) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                            <polygon points="0 0, 10 3.5, 0 7" fill="rgba(255,255,255,0.2)" />
                        </marker>
                    </defs>
                    <motion.line
                        x1="20%" y1="50%"
                        x2="80%" y2="20%"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        markerEnd="url(#arrowhead)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.line
                        x1="20%" y1="50%"
                        x2="80%" y2="80%"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        markerEnd="url(#arrowhead)"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
                    />
                </svg>

                {/* Nodes */}
                {nodes.map((node, i) => (
                    <motion.div
                        key={node.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.2, type: "spring" }}
                        className={`absolute w-12 h-12 rounded-full ${node.color} flex items-center justify-center text-white font-bold shadow-lg shadow-black/20 z-10`}
                        style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
                    >
                        {node.initial}
                        {/* Glow Effect */}
                        <div className={`absolute inset-0 rounded-full ${node.color} animate-ping opacity-20`}></div>
                    </motion.div>
                ))}
            </CardContent>
        </Card>
    );
}
