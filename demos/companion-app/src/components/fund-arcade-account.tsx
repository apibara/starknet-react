"use client";
import {
  useAccount,
  useContractWrite,
  useContractRead,
} from "@starknet-react/core";
import { useMemo, useState } from "react";
import { CallData, stark, uint256 } from "starknet";
import { z } from "zod";
import { abi } from "@/lib/factory";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { bnToHex } from "@/lib/utils";
import { contractAddress } from "@/lib/constants";

interface Props {
  pk: string;
}

const schema = z.object({
  initialSupply: z.number().min(1),
});

export const FundArcadeAccount = ({ pk }: Props) => {
  const { address, account } = useAccount();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset: resetForm,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { initialSupply: 10_000_000_000 },
  });

  const salt = useMemo(() => {
    return stark.randomAddress();
  }, [account]);

  const { writeAsync, reset: resetWrite, error } = useContractWrite({});

  const [deployedToken, setDeployedToken] = useState<
    { address: string; tx: string } | undefined
  >(undefined);

  const amount = watch("initialSupply");

  const { data: tokenAddress } = useContractRead({
    abi,
    address: contractAddress,
    functionName: "compute_address",
    args: [salt, pk, address as string],
  });

  const deployToken = async (data: z.infer<typeof schema>) => {
    if (!address) return;

    const hexAddres = bnToHex(tokenAddress as bigint);

    const deploy = {
      contractAddress: contractAddress,
      entrypoint: "deploy",
      calldata: [salt, pk, address],
    };

    const transfer = {
      contractAddress: hexAddres,
      entrypoint: "transfer",
      calldata: CallData.compile([
        address,
        uint256.bnToUint256(BigInt(data.initialSupply)),
      ]),
    };

    try {
      const res = await writeAsync({
        calls: [transfer, deploy],
      });
      setDeployedToken({
        address: hexAddres as string,
        tx: res.transaction_hash,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const restart = () => {
    resetWrite();
    resetForm();
    setDeployedToken(undefined);
  };
  return (
    <>
      {address && (
        <form onSubmit={handleSubmit(deployToken)}>
          <Label>Fund amount:</Label>
          <div className="flex flex-row gap-4">
            <Input
              placeholder="10,000,000,000.00"
              type="number"
              defaultValue={amount}
              {...register("initialSupply", { valueAsNumber: true })}
            />
            <Button className="w-[115px]" type="submit">
              Submit
            </Button>

            <Button type="button" onClick={restart} className="w-[115px]">
              Start over
            </Button>
          </div>
          {errors.initialSupply?.message ? (
            <div className="p-2 bg-red-500 mt-[10px] text-center">
              {errors.initialSupply?.message}
            </div>
          ) : null}
        </form>
      )}

      {deployedToken && (
        <Card>
          <CardContent>
            <div>Token Deployed</div>
            <div>Token Address: {deployedToken.address}</div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
