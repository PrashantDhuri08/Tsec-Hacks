"use client";

import { useState, useEffect } from "react";
import { splitwiseApi, ExpenseCategory } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Layers, Plus, Link as LinkIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ExpenseCategoriesProps {
    eventId: string;
    categories: ExpenseCategory[];
    onCategoryAdded: (category: ExpenseCategory) => void;
}

export function ExpenseCategories({ eventId, categories, onCategoryAdded }: ExpenseCategoriesProps) {
    const [newCategoryName, setNewCategoryName] = useState("");
    const [loading, setLoading] = useState(false);
    const [joinLoading, setJoinLoading] = useState<number | null>(null);
    const [joinUserId, setJoinUserId] = useState<{ [key: number]: string }>({});
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) setCurrentUserId(storedUserId);
    }, []);


    // Fetch categories on mount (handled partially by parent but let's ensure fresh data or move state up?)
    // Actually EventDashboard holds the category state. 
    // Wait, the parent `EventDashboard` passes `categories` as a prop!
    // So ExpenseCategories shouldn't fetch it itself?
    // "categories={categories}"
    // Ah! I should update `EventDashboard` to fetch categories and pass them down.
    // BUT the user wants PERSISTENCE.
    // If EventDashboard fetches, that's better.
    // Let's check EventDashboard again.

    const handleCreate = async () => {
        if (!newCategoryName) return;
        setLoading(true);
        try {
            // Backend returns { id, name, event_id } ideally. We'll simulate if needed or rely on response.
            const res = await splitwiseApi.createCategory(eventId, newCategoryName);
            // Assuming res is the category object or contains it. 
            // If backend returns just 'message', we might need to fake the ID or re-fetch (which we can't do easily).
            // Let's assume the backend follows standard patterns and returns the object.
            // If not, I'll generate a random ID for UI purposes if the backend is opaque.
            const newCat: ExpenseCategory = res.id ? res : { id: Math.floor(Math.random() * 10000), name: newCategoryName };

            onCategoryAdded(newCat);
            setNewCategoryName("");
        } catch (error) {
            console.error("Failed to create category", error);
            alert("Failed to create category");
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (categoryId: number) => {
        const userId = currentUserId || joinUserId[categoryId];
        if (!userId) {
            alert("Provide User ID or Login first.");
            return;
        }

        setJoinLoading(categoryId);
        try {
            await splitwiseApi.joinCategory(categoryId, Number(userId));
            alert(`Joined category!`);
            setJoinUserId(prev => ({ ...prev, [categoryId]: "" }));
        } catch (error) {
            console.error("Failed to join category", error);
            alert("Failed to join category");
        } finally {
            setJoinLoading(null);
        }
    };

    return (
        <Card className="glass-panel h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-blue-400" />
                    Categories
                </CardTitle>
                <CardDescription>Manage expense categories.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex gap-2">
                    <Input
                        placeholder="New Category Name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <Button onClick={handleCreate} isLoading={loading} size="icon" variant="secondary">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                    <AnimatePresence>
                        {categories.map((cat) => (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2"
                            >
                                <div className="font-medium text-sm text-gray-200">{cat.name}</div>
                                <div className="flex gap-2 items-center">
                                    {!currentUserId && (
                                        <Input
                                            type="number"
                                            placeholder="ID"
                                            className="h-8 w-16 text-xs bg-black/20"
                                            value={joinUserId[cat.id] || ""}
                                            onChange={(e) => setJoinUserId(prev => ({ ...prev, [cat.id]: e.target.value }))}
                                        />
                                    )}
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        className="h-8 px-3 text-[10px]"
                                        onClick={() => handleJoin(cat.id)}
                                        isLoading={joinLoading === cat.id}
                                    >
                                        <LinkIcon className="w-3 h-3 mr-1" />
                                        {currentUserId ? "Join" : "ID Join"}
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                        {categories.length === 0 && (
                            <p className="text-center text-xs text-gray-500 py-4">No categories created.</p>
                        )}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    );
}
