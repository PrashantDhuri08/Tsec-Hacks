"use client";

import { useState, useEffect } from "react";
import { splitwiseApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LogIn, UserPlus, LogOut, Wallet } from "lucide-react";

export function AuthSession() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userId, setUserId] = useState<number | null>(null);
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(Number(storedUserId));
            fetchWallet(Number(storedUserId));
        }
    }, []);

    const fetchWallet = async (id: number) => {
        try {
            const data = await splitwiseApi.getUserWallet(id);
            setWalletBalance(data.wallet_balance);
        } catch (error) {
            console.error("Failed to fetch wallet", error);
        }
    };

    const handleAuth = async () => {
        setLoading(true);
        try {
            if (isLogin) {
                const data = await splitwiseApi.login(email, password);
                localStorage.setItem("userId", data.user_id.toString());
                setUserId(data.user_id);
                fetchWallet(data.user_id);
            } else {
                const data = await splitwiseApi.register(email, password);
                localStorage.setItem("userId", data.id.toString());
                setUserId(data.id);
                setWalletBalance(data.wallet_balance);
            }
        } catch (error) {
            console.error("Auth failed", error);
            alert("Authentication failed. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("userId");
        setUserId(null);
        setEmail("");
        setPassword("");
    };

    if (userId) {
        return (
            <Card className="glass-panel mb-8 w-full max-w-md mx-auto">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Welcome, User #{userId}</CardTitle>
                            <CardDescription>You are logged in.</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleLogout}>
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="p-2 bg-indigo-500/20 rounded-md">
                            <Wallet className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400">Personal Wallet</p>
                            <p className="text-xl font-bold text-white">${walletBalance.toFixed(2)}</p>
                        </div>
                        <Button 
                            variant="secondary" 
                            size="sm" 
                            className="ml-auto" 
                            onClick={() => fetchWallet(userId)}
                        >
                            Refresh
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="glass-panel w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
                <CardDescription>
                    {isLogin ? "Enter your credentials to access your account." : "Create a new account to start sharing expenses."}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Input 
                        placeholder="Email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <Input 
                        placeholder="Password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <Button className="w-full" onClick={handleAuth} isLoading={loading}>
                    {isLogin ? <LogIn className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
                    {isLogin ? "Login" : "Register"}
                </Button>
                <Button 
                    variant="ghost" 
                    className="w-full text-xs" 
                    onClick={() => setIsLogin(!isLogin)}
                >
                    {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                </Button>
            </CardContent>
        </Card>
    );
}
