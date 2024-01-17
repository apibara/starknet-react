"use client";
import {
  useAccount,
  useContractWrite,
  useContractRead,
  useNetwork,
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
import { deployerAddress } from "@/lib/constants";

interface Props {
  pk: string;
}

const schema = z.object({
  initialSupply: z.number().min(0),
});
export const FundArcadeAccount = ({ pk }: Props) => {
  const { address, account } = useAccount();
  const { chain } = useNetwork();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { initialSupply: 0.0001 },
  });

  const salt = useMemo(() => {
    return stark.randomAddress();
  }, [account]);
  const { writeAsync, reset: resetWrite, error } = useContractWrite({});

  const [deployedToken, setDeployedToken] = useState<
    { address: string; tx: string } | undefined
  >(undefined);

  const { data: arcadeAccountAddress } = useContractRead({
    abi,
    address: deployerAddress,
    functionName: "compute_address",
    args: [salt, pk, address as string],
  });

  const deployToken = async (data: z.infer<typeof schema>) => {
    if (!address) return;

    const hexAddres = bnToHex(arcadeAccountAddress as bigint);

    const deploy = {
      contractAddress: deployerAddress,
      entrypoint: "deploy",
      calldata: [salt, pk, address],
    };

    const transfer = {
      contractAddress: chain.nativeCurrency.address,
      entrypoint: "transfer",
      calldata: CallData.compile([
        address,
        uint256.bnToUint256(
          BigInt(
            data.initialSupply * Math.pow(10, chain.nativeCurrency.decimals)
          )
        ),
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
          <Label className="px-[10px]">Fund amount:</Label>
          <div className="flex flex-row gap-4 px-[10px]">
            <Input
              placeholder="0.0001"
              type="number"
              step="any"
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
        <Card className="max-w-[500px] w-full bg-transparent border-none">
          <CardContent className="px-[10px]">
            <div className="flex text-md w-full break-all flex-col gap-2">
              <div className="items-center text-xl flex text-center justify-center">
                Token Deployed!
              </div>
              <div>Token address:</div>
              <div>{deployedToken.address}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
