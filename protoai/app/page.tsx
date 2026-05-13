import { ChatWidget } from "@/components/chat/ChatWidget";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-[#000000]">
      <h1 className="text-4xl font-bold text-white font-sans text-center max-w-2xl mt-20">
        Accel Atoms
      </h1>
      <p className="text-[#888] font-mono mt-4 text-center">
        The ProtoAI ChatWidget is active.
      </p>

      <ChatWidget />
    </main>
  );
}
