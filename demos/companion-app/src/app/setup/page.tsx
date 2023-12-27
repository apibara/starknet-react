import { ConnectModal } from "@/components/connect-modal";
import { FundArcadeAccount } from "@/components/fund-arcade-account";

interface Props {
  searchParams: { [key: string]: string };
}

const Setup = ({ searchParams }: Props) => {
  const publicKey = searchParams["pk"];
  return (
    <main className="flex flex-col items-center justify-center min-h-screen  ">
      <div className="w-[500px] h-[500px] rounded-md bg-slate-400 gap-[30px] flex items-center justify-center flex-col">
        <ConnectModal />
        <FundArcadeAccount pk={publicKey} />
      </div>
    </main>
  );
};

export default Setup;
