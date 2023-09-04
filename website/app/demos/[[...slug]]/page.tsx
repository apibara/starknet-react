import React from "react";

import { notFound, redirect } from "next/navigation";

import { allDemos } from "@/.contentlayer/generated";
import { Mdx } from "@/components/mdx";
import { DocContainer } from "@/components/container";

type DemoPageProps = {
  params: {
    slug: string[];
  };
};

async function getDemoFromParams({ params }: DemoPageProps) {
  const slug = params.slug?.join("/") || "";

  if (slug === "") {
    const redirectTo = allDemos[0]?.slugAsParams;
    return { demo: null, redirectTo };
  }

  const demo = allDemos.find((demo) => demo.slugAsParams === slug);

  if (!demo) {
    return { demo: null, redirectTo: null };
  }

  return { demo, redirectTo: null };
}

export async function generateStaticParams(): Promise<
  DemoPageProps["params"][]
> {
  return allDemos.map((demo) => ({
    slug: demo.slugAsParams.split("/"),
  }));
}

export default async function DemoPage({ params }: DemoPageProps) {
  const { demo, redirectTo } = await getDemoFromParams({ params });

  if (!demo) {
    if (redirectTo) {
      redirect(`/demos/${redirectTo}`);
    } else {
      notFound();
    }
  }

  return (
    <DocContainer title={demo.title} section="Demos">
      <Mdx code={demo.body.code} />
    </DocContainer>
  );
}
