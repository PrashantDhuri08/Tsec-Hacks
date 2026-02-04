"use client";

import { useState, useEffect } from "react";
import { splitwiseApi, Participant } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Users, Check, X, Shield, Mail } from "lucide-react";

interface ParticipantManagerProps {
    eventId: string;
}

export function ParticipantManager({ eventId }: ParticipantManagerProps) {
    const [email, setEmail] = useState("");
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) setCurrentUserId(Number(storedUserId));
        
        const fetchParticipants = async () => {
            try {
                const data = await splitwiseApi.getParticipants(eventId);
                setParticipants(data);
            } catch (error) {
                console.error("Failed to fetch participants", error);
            }
        };
        fetchParticipants();
    }, [eventId]);

    const handleInvite = async () => {
        if (!email || !currentUserId) return;
        setLoading(true);
        try {
            await splitwiseApi.inviteParticipant(eventId, email, currentUserId);
            // Re-fetch to see pending participant
            const data = await splitwiseApi.getParticipants(eventId);
            setParticipants(data);
            setEmail("");
            alert("Invitation sent!");
        } catch (error) {
            console.error("Failed to invite participant", error);
            alert("Failed to invite participant.");
        } finally {
            setLoading(false);
        }
    };

    const handleVote = async (candidateId: number, approve: boolean) => {
        if (!currentUserId) return;
        try {
            await splitwiseApi.voteOnParticipant(eventId, candidateId, currentUserId, approve);
            alert(approve ? "Voted to Approve" : "Voted to Reject");
            // Refresh
            const data = await splitwiseApi.getParticipants(eventId);
            setParticipants(data);
        } catch (error) {
            console.error("Failed to vote", error);
        }
    };

    const handleRemove = async (userId: number) => {
        if (!currentUserId) return;
        try {
            await splitwiseApi.removeParticipant(eventId, userId, currentUserId);
            setParticipants((prev) => prev.filter(p => p.user_id !== userId));
            alert("Participant removed");
        } catch (error) {
            console.error("Failed to remove participant", error);
        }
    };

    return (
        <Card className="glass-panel h-full border-white/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-400" />
                    Participants
                </CardTitle>
                <CardDescription>Invite and approve group members.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <Input
                            placeholder="invite@email.com"
                            className="pl-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleInvite} isLoading={loading} variant="secondary" className="px-6 flex shrink-0">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite
                    </Button>
                </div>

                <div className="mt-4">
                    <p className="text-sm font-medium text-gray-400 mb-2">Members & Status</p>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                        <AnimatePresence>
                            {participants.map((p) => (
                                <motion.div
                                    key={p.user_id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/5"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${p.is_active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]'}`} />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">User #{p.user_id}</span>
                                            <span className="text-[10px] text-gray-500 uppercase tracking-tight">
                                                {p.is_active ? 'Active Member' : 'Pending Approval'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-1">
                                        {!p.is_active && (
                                            <>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-500/10" onClick={() => handleVote(p.user_id, true)}>
                                                    <Check className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10" onClick={() => handleVote(p.user_id, false)}>
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </>
                                        )}
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-red-400" onClick={() => handleRemove(p.user_id)}>
                                            <Shield className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </motion.div>
                            ))}
                            {participants.length === 0 && (
                                <p className="text-center text-xs text-gray-500 py-6">No participants yet.</p>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
