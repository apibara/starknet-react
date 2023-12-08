import React from "react";

import { notFound, redirect } from "next/navigation";

import { allHooks } from "@/.contentlayer/generated";
import { Mdx } from "@/components/mdx";
import { DocContainer } from "@/components/container";

type DocPageProps = {
  params: {
    slug: string[];
  };
};

async function getDocFromParams({ params }: DocPageProps) {
  const slug = params.slug?.join("/") || "";

  if (slug === "") {
    const redirectTo = allHooks[0]?.slugAsParams;
    return { doc: null, redirectTo };
  }
  const doc = allHooks.find((doc) => doc.slugAsParams === slug);

  if (!doc) {
    return { doc: null, redirectTo: null };
  }

  return { doc, redirectTo: null };
}

export async function generateStaticParams(): Promise<
  DocPageProps["params"][]
> {
  return allHooks.map((doc) => ({
    slug: doc.slugAsParams.split("/"),
  }));
}

export default async function DocPage({ params }: DocPageProps) {
  const { doc, redirectTo } = await getDocFromParams({ params });

  if (!doc) {
    if (redirectTo) {
      redirect(`/hooks/${redirectTo}`);
    } else {
      notFound();
    }
  }

  const sections = ["Hooks", ...params.slug.slice(0, -1)];

  return (
    <DocContainer title={doc.title} sections={sections}>
      <Mdx code={doc.body.code} />
    </DocContainer>
  );
}
