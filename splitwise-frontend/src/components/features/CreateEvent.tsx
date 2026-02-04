"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { splitwiseApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export function CreateEvent() {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [organizerId, setOrganizerId] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasUserId, setHasUserId] = useState(false);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setOrganizerId(storedUserId);
            setHasUserId(true);
        }
    }, []);

    const handleCreate = async () => {
        if (!title || !organizerId) {
            alert("Please login first or provide an organizer ID.");
            return;
        }
        setLoading(true);
        try {
            const res = await splitwiseApi.createEvent(title, Number(organizerId));
            console.log("Event Created:", res);

            if (res.id) {
                router.push(`/events/${res.id}`);
            } else {
                alert("Event created but ID missing in response");
            }
        } catch (error) {
            console.error("Failed to create event", error);
            alert("Failed to create event. Is the backend running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-md relative z-10"
        >
            <Card className="glass-card shadow-lg shadow-purple-900/10 border-white/10">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-3xl font-bold font-heading mb-2 text-white">
                        Start an Event
                    </CardTitle>
                    <CardDescription className="text-indigo-200/70 font-light text-sm">
                        Create a new shared pool for your group.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider font-semibold text-indigo-300 ml-1">Event Title</label>
                        <Input
                            placeholder="e.g. Goa Trip 2024"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="input-glass h-12 text-lg"
                        />
                    </div>
                    {!hasUserId && (
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider font-semibold text-indigo-300 ml-1">Manual Organizer ID</label>
                            <Input
                                type="number"
                                placeholder="e.g. 1"
                                value={organizerId}
                                onChange={(e) => setOrganizerId(e.target.value)}
                                className="input-glass h-12 text-lg"
                            />
                        </div>
                    )}
                </CardContent>
                <CardFooter className="pt-4 pb-8">
                    <Button
                        className="w-full h-12 text-lg font-medium btn-primary rounded-xl"
                        onClick={handleCreate}
                        isLoading={loading}
                    >
                        Create Event
                    </Button>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
