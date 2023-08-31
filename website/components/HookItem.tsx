import Link from "next/link";
import { ReactElement } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HookItemProps {
  name: string;
  description: ReactElement;
  href: string;
  isDeprecated: boolean;
}

const HookItem = ({
  name,
  description,
  href = "/",
  isDeprecated,
}: HookItemProps) => {
  return (
    <Link href={href} passHref>
      <Card className="transition ease-in-out delay-200  hover:-translate-y-2 hover:-translate-x-2  border-cat-surface ">
        <CardHeader className="p-0">
          <CardTitle
            className={`text-md p-3 rounded-t-lg text-start font-bold ${
              isDeprecated ? "text-cat-text" : "text-cat-base"
            } border-2 ${
              isDeprecated ? "bg-cat-surface" : "bg-cat-peach"
            } border-cat-surface ${isDeprecated && "line-through"}`}
          >
            {name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 rounded-b-lg border-2 border-cat-surface text-start">
          {description}
        </CardContent>
      </Card>
    </Link>
  );
};

export default HookItem;
