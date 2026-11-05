import { createFileRoute, Link } from "@tanstack/react-router";
import { Cta, FinalCta, Matching, PageHeader, SystemTimeline } from "@/components/site/sections";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://hikarii.studio/how-it-works" },
      { name: "robots", content: "index, follow" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "How Video Editing Works — HiKARii" },
      {
        name: "description",
        content:
          "See how HiKARii's video editing process works. Upload raw footage, collaborate with a dedicated post-production team, and receive polished final video cuts.",
      },
      { property: "og:title", content: "How Video Editing Works — HiKARii" },
      {
        property: "og:description",
        content:
          "See how HiKARii's video editing process works. Upload raw footage, collaborate with a dedicated post-production team, and receive polished final video cuts.",
      },
      { property: "og:image", content: "https://hikarii.studio/og-image.png" },
      { name: "twitter:title", content: "How Video Editing Works — HiKARii" },
      {
        name: "twitter:description",
        content:
          "See how HiKARii's video editing process works. Upload raw footage, collaborate with a dedicated post-production team, and receive polished final video cuts.",
      },
      { name: "twitter:image", content: "https://hikarii.studio/og-image.png" },
      { name: "twitter:image:alt", content: "HiKARii — Professional Video Editing Agency" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://hikarii.studio/how-it-works",
      },
    ],
  }),
  component: HowItWorksPage,
});

function HowItWorksPage() {
  return (
    <>
      <PageHeader
        n="H"
        eyebrow="How it works"
        lines={["How video editing", "works."]}
        intro="Submit your raw footage and creative brief. HiKARii's dedicated post-production team assigns the right editor to your format, manages the cutting and review rounds, and delivers production-ready master cuts."
        actions={
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Cta to="/get-started" analyticsLocation="other">
                Start a project
              </Cta>
              <Cta to="/work" variant="ghost">
                See our video editing work
              </Cta>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-snow/60">
              <Link to="/pricing" className="link-line hover:text-primary transition-colors">
                View video editing pricing →
              </Link>
              <span className="text-snow/30">·</span>
              <Link to="/clients" className="link-line hover:text-primary transition-colors">
                See how we work with clients →
              </Link>
            </div>
          </div>
        }
      />
      <SystemTimeline ctaTo="/pricing" ctaLabel="View video editing pricing →" />
      <Matching />
      <FinalCta secondaryTo="/pricing" secondaryLabel="View video editing pricing" />
    </>
  );
}
