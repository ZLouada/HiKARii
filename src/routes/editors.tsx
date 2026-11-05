import { createFileRoute } from "@tanstack/react-router";
import { BecomeEditor, Editors, FinalCta, ForEditors, PageHeader, Stats } from "@/components/site/sections";

export const Route = createFileRoute("/editors")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://hikarii.studio/editors" },
      { name: "robots", content: "index, follow" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "For Editors — HiKARii" },
      {
        name: "description",
        content:
          "Join HiKARii to edit exceptional video projects with clear briefs, dedicated post-production pipelines, and respected craft.",
      },
      { property: "og:title", content: "For Editors — HiKARii" },
      { property: "og:description", content: "Your skills deserve great projects." },
      { property: "og:image", content: "https://hikarii.studio/og-image.png" },
      { name: "twitter:title", content: "For Editors — HiKARii" },
      { name: "twitter:description", content: "Your skills deserve great projects." },
      { name: "twitter:image", content: "https://hikarii.studio/og-image.png" },
      { name: "twitter:image:alt", content: "HiKARii — Professional Video Editing Agency" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://hikarii.studio/editors",
      },
    ],
  }),
  component: () => (
    <>
      <PageHeader n="E" eyebrow="For editors" lines={["Cut more. ", "Pitch less."]} intro="Projects matched to your specialty, agreed budgets, and direct payment on delivery." />
      <ForEditors />
      <Stats />
      <Editors />
      <BecomeEditor />
      <FinalCta />
    </>
  ),
});
