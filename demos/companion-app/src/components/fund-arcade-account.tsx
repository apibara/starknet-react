"use client";
import { useAccount, useContractWrite } from "@starknet-react/core";
import { useState } from "react";
import { CallData, stark, constants, uint256, hash } from "starknet";
import { z } from "zod";

import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { Label } from "./ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface Props {
  pk: string;
}
const TOKEN_CLASSS_HASH =
  "0x0278da3cbbc2105fc3ac1206a630357c5a4666020f15fed02c892ac5d856d8ef";

const schema = z.object({
  initialSupply: z.number().min(0),
});

export const FundArcadeAccount = ({ pk }: Props) => {
  const { address } = useAccount();

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

  const { writeAsync, reset: resetWrite } = useContractWrite({});

  const [deployedToken, setDeployedToken] = useState<
    { address: string; tx: string } | undefined
  >(undefined);

  const amount = watch("initialSupply");
  const salt = stark.randomAddress();

  const deployToken = async (data: z.infer<typeof schema>) => {
    if (!address) return;

    const unique = 0;

    const constructorCalldata = CallData.compile([
      address,
      address,
      uint256.bnToUint256(BigInt(data.initialSupply)),
    ]);

    const tokenAddress = hash.calculateContractAddressFromHash(
      salt,
      TOKEN_CLASSS_HASH,
      constructorCalldata,
      unique
    );

    const deploy = {
      contractAddress: constants.UDC.ADDRESS,
      entrypoint: constants.UDC.ENTRYPOINT,
      calldata: [
        TOKEN_CLASSS_HASH,
        salt,
        unique,
        constructorCalldata.length,
        ...constructorCalldata,
      ],
    };

    const transfer = {
      contractAddress: tokenAddress,
      entrypoint: "transfer",
      calldata: CallData.compile([
        address,
        uint256.bnToUint256(BigInt(amount)),
      ]),
    };

    try {
      const res = await writeAsync({
        calls: [deploy, transfer],
      });
      setDeployedToken({ address: tokenAddress, tx: res.transaction_hash });
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

            <Button onClick={restart} className="w-[115px]">
              Start over
            </Button>
          </div>
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
