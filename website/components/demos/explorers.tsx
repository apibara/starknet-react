"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Link } from "lucide-react";

import {
  useExplorer,
  voyager,
  starkscan,
  starkcompass,
  viewblock,
  type ExplorerFactory,
} from "@starknet-react/core";

import { StarknetProvider } from "@/components/starknet/provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ExplorersDemo() {
  const [explorer, setExplorer] = useState<ExplorerFactory>(() => voyager);

  const onExplorerChange = useCallback(
    (explorer: string) => {
      switch (explorer) {
        case "starkscan": {
          setExplorer(() => starkscan);
          break;
        }
        case "starkcompass": {
          setExplorer(() => starkcompass);
          break;
        }
        case "viewblock": {
          setExplorer(() => viewblock);
          break;
        }
        case "voyager": {
          setExplorer(() => voyager);
          break;
        }
        default: {
        }
      }
    },
    [setExplorer],
  );

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Explorers Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle>Starknet context</CardTitle>
              <CardDescription>
                This area is inside the Starknet context and uses the configured
                block explorer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <StarknetProvider explorer={explorer}>
                <Demo />
              </StarknetProvider>
            </CardContent>
          </Card>
          <div className="border-t flex flex-row justify-between pt-4 mt-4">
            <p className="text-muted-foreground">Demo footer.</p>
            <div>
              <Select onValueChange={onExplorerChange} defaultValue="voyager">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select explorer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starkscan">Starkscan</SelectItem>
                  <SelectItem value="starkcompass">Stark Compass</SelectItem>
                  <SelectItem value="viewblock">Viewblock</SelectItem>
                  <SelectItem value="voyager">Voyager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Demo() {
  const explorer = useExplorer();

  const blockByHash = useMemo(() => {
    try {
      return explorer.block({
        hash: "0x07d328a71faf48c5c3857e99f20a77b18522480956d1cd5bff1ff2df3c8b427b",
      });
    } catch {
      return "not supported";
    }
  }, [explorer]);

  const blockByNumber = useMemo(() => {
    try {
      return explorer.block({ number: 0 });
    } catch {
      return "not supported";
    }
  }, [explorer]);

  const transaction = useMemo(() => {
    try {
      return explorer.transaction(
        "0x06bc8a636965aabff8637eba5df9775bfe79858a51458dbcf8c6d55d584e90f1",
      );
    } catch {
      return "not supported";
    }
  }, [explorer]);

  const contract = useMemo(() => {
    try {
      return explorer.contract(
        "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
      );
    } catch {
      return "not supported";
    }
  }, [explorer]);

  const class_ = useMemo(() => {
    try {
      return explorer.class(
        "0x00d0e183745e9dae3e4e78a8ffedcce0903fc4900beace4e0abf192d4c202da3",
      );
    } catch {
      return "not supported";
    }
  }, [explorer]);

  return (
    <div className="flex flex-col space-y-4">
      <p>Current explorer: {explorer.name}</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Link Type</TableHead>
            <TableHead className="w-[80px]">Link</TableHead>
            <TableHead>Example</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Block (by hash)</TableCell>
            <TableCell>
              <Button variant="ghost" asChild>
                <a target="_blank" href={blockByHash}>
                  <Link className="w-4 h-4" />
                </a>
              </Button>
            </TableCell>
            <TableCell>{blockByHash}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Block (by number)</TableCell>
            <TableCell>
              <Button variant="ghost" asChild>
                <a target="_blank" href={blockByNumber}>
                  <Link className="w-4 h-4" />
                </a>
              </Button>
            </TableCell>
            <TableCell>{blockByNumber}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Transaction</TableCell>
            <TableCell>
              <Button variant="ghost" asChild>
                <a target="_blank" href={transaction}>
                  <Link className="w-4 h-4" />
                </a>
              </Button>
            </TableCell>
            <TableCell>{transaction}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Contract</TableCell>
            <TableCell>
              <Button variant="ghost" asChild>
                <a target="_blank" href={contract}>
                  <Link className="w-4 h-4" />
                </a>
              </Button>
            </TableCell>
            <TableCell>{contract}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Class</TableCell>
            <TableCell>
              <Button variant="ghost" asChild>
                <a target="_blank" href={class_}>
                  <Link className="w-4 h-4" />
                </a>
              </Button>
            </TableCell>
            <TableCell>{class_}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
