import WalletBar from "@/components/WalletBar";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-12">
      <WalletBar />
      <p className="mb-2 text-lg">
        Get started by editing&nbsp;
        <code className="p-2 bg-gray-600 rounded">pages/index.tsx</code>
      </p>
      <div className="flex flex-row gap-12">
        <a
          className="p-4 rounded-md w-48 bg-black border flex flex-col items-center justify-center gap-6 group"
          href="https://starknet.io/docs"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="https://pbs.twimg.com/profile_images/1656626805816565763/WyFDMG6u_400x400.png"
            className="object-contain w-24 h-24"
            alt="starknet-icon"
          />
          <p className="mb-2 text-lg text-center">
            Starknet Documentation
            <span className=" group-hover:font-bold transition-all ml-2 group-hover:ml-4">
              {">"}
            </span>
          </p>
        </a>
        <a
          className="p-4 rounded-md w-48 bg-black border flex flex-col items-center justify-center gap-6 group"
          href="https://starknet-react.com/docs/getting-started"
          target="_blank"
          rel="norefferer"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1150px-React-icon.svg.png"
            className="object-contain w-24 h-24"
            alt="react-icon"
          />
          <p className="mb-2 text-lg text-center">
            Starknet React Documentation
            <span className="group-hover:font-bold transition-all ml-2 group-hover:ml-4">
              {">"}
            </span>
          </p>
        </a>
      </div>
    </main>
  );
}
