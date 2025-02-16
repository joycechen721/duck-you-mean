import { Conversation } from "../components/conversation";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <Conversation />
      </div>
    </main>
  );
}


