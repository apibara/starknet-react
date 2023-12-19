import { ConnectModal } from "@/components/connect-modal";
import { FundArcadeAccount } from "@/components/fund-arcade-account";

interface Props {
  searchParams: { [key: string]: string };
}

const Setup = ({ searchParams }: Props) => {
  const publicKey = searchParams["pk"];
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-12">
      <ConnectModal />
      <FundArcadeAccount pk={publicKey} />
    </main>
  );
};

export default Setup;
