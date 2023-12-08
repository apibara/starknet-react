import WalletBar from "@/components/wallet-bar";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-12">
      <WalletBar />
      <p className="mb-2 text-lg">
        Get started by editing&nbsp;
        <code className="p-2 bg-gray-600 rounded">app/pages.tsx</code>
      </p>
      
    </main>
  );
}
