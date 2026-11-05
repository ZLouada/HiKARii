import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Cta, FinalCta, PageHeader, Portfolio, Reel, Trust } from "@/components/site/sections";
import { trackEvent } from "@/lib/analytics";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://hikarii.studio/work" },
      { name: "robots", content: "index, follow" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Video Editing Work — HiKARii" },
      {
        name: "description",
        content:
          "Explore HiKARii's video editing portfolio. Our dedicated post-production team crafts high-retention cuts for YouTube, social media, podcasts, and commercials.",
      },
      { property: "og:title", content: "Video Editing Work — HiKARii" },
      {
        property: "og:description",
        content:
          "Explore HiKARii's video editing portfolio. Our dedicated post-production team crafts high-retention cuts for YouTube, social media, podcasts, and commercials.",
      },
      { property: "og:image", content: "https://hikarii.studio/og-image.png" },
      { name: "twitter:title", content: "Video Editing Work — HiKARii" },
      {
        name: "twitter:description",
        content:
          "Explore HiKARii's video editing portfolio. Our dedicated post-production team crafts high-retention cuts for YouTube, social media, podcasts, and commercials.",
      },
      { name: "twitter:image", content: "https://hikarii.studio/og-image.png" },
      { name: "twitter:image:alt", content: "HiKARii — Professional Video Editing Agency" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://hikarii.studio/work",
      },
    ],
  }),
  component: WorkPage,
});

function WorkPage() {
  useEffect(() => {
    trackEvent("work_viewed");
  }, []);

  return (
    <>
      <PageHeader
        n="W"
        eyebrow="Selected work"
        lines={["Video editing", "work."]}
        intro="Selected projects crafted by the HiKARii video editing team. From high-retention social content to commercial brand films, our post-production team shapes raw footage with deliberate pacing, storytelling, and visual polish."
        actions={
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Cta to="/get-started" analyticsLocation="work_hero">
                Start a project
              </Cta>
              <Cta to="/pricing" variant="ghost">
                View video editing pricing
              </Cta>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-snow/60">
              <Link to="/how-it-works" className="link-line hover:text-primary transition-colors">
                See how our editing process works →
              </Link>
              <span className="text-snow/30">·</span>
              <Link to="/clients" className="link-line hover:text-primary transition-colors">
                How we work with clients →
              </Link>
            </div>
          </div>
        }
      />
      <Portfolio />
      <Reel />
      <Trust />
      <FinalCta secondaryTo="/pricing" secondaryLabel="View video editing pricing" />
    </>
  );
}
