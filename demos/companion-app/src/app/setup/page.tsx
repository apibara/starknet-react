import { ConnectModal } from "@/components/connect-modal";
import { FundArcadeAccount } from "@/components/fund-arcade-account";

interface Props {
  searchParams: { [key: string]: string };
}

const Setup = ({ searchParams }: Props) => {
  const publicKey = searchParams["pk"];

  if (!publicKey) {
    return (
      <div className="text-2xl w-full justify-center  mx-auto my-0 items-center text-center p-2 bg-red-500">
        Invalid url
      </div>
    );
  }
  return (
    <main className="flex flex-col items-center  justify-center min-h-screen  ">
      <div className="w-full h-[500px] max-w-[500px] rounded-md bg-slate-400 gap-[30px] flex justify-center items-center flex-col">
        <ConnectModal />
        <FundArcadeAccount pk={publicKey} />
      </div>
    </main>
  );
};

export default Setup;
