import React from "react";

import { notFound, redirect } from "next/navigation";

import { allDocs } from "@/.contentlayer/generated";
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
    const redirectTo = allDocs[0]?.slugAsParams;
    return { doc: null, redirectTo };
  }

  const doc = allDocs.find((doc) => doc.slugAsParams === slug);

  if (!doc) {
    return { doc: null, redirectTo: null };
  }

  return { doc, redirectTo: null };
}

export async function generateStaticParams(): Promise<
  DocPageProps["params"][]
> {
  return allDocs.map((doc) => ({
    slug: doc.slugAsParams.split("/"),
  }));
}

export default async function DocPage({ params }: DocPageProps) {
  const { doc, redirectTo } = await getDocFromParams({ params });

  if (!doc) {
    if (redirectTo) {
      redirect(`/docs/${redirectTo}`);
    } else {
      notFound();
    }
  }

  return (
    <DocContainer title={doc.title} section="Docs">
      <Mdx code={doc.body.code} />
    </DocContainer>
  );
}

