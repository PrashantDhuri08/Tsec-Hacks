import { CreateEvent } from "@/components/features/CreateEvent";
import { AuthSession } from "@/components/features/AuthSession";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-24 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/30 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/30 rounded-full blur-[100px] animate-pulse-slow" />
      </div>

      <div className="w-full max-w-md space-y-8 relative z-10">
        <AuthSession />
        <CreateEvent />
      </div>
    </main>
  );
}
