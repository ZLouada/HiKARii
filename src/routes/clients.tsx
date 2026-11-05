import { createFileRoute, Link } from "@tanstack/react-router";
import { Cta, Editors, FinalCta, ForClients, Matching, PageHeader, Trust } from "@/components/site/sections";

export const Route = createFileRoute("/clients")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://hikarii.studio/clients" },
      { name: "robots", content: "index, follow" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Video Editing Services for Clients — HiKARii" },
      {
        name: "description",
        content:
          "HiKARii provides professional video editing services for creators and brands. Collaborate with a dedicated post-production team from raw footage to master cut.",
      },
      { property: "og:title", content: "Video Editing Services for Clients — HiKARii" },
      {
        property: "og:description",
        content:
          "HiKARii provides professional video editing services for creators and brands. Collaborate with a dedicated post-production team from raw footage to master cut.",
      },
      { property: "og:image", content: "https://hikarii.studio/og-image.png" },
      { name: "twitter:title", content: "Video Editing Services for Clients — HiKARii" },
      {
        name: "twitter:description",
        content:
          "HiKARii provides professional video editing services for creators and brands. Collaborate with a dedicated post-production team from raw footage to master cut.",
      },
      { name: "twitter:image", content: "https://hikarii.studio/og-image.png" },
      { name: "twitter:image:alt", content: "HiKARii — Professional Video Editing Agency" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://hikarii.studio/clients",
      },
    ],
  }),
  component: ClientsPage,
});

function ClientsPage() {
  return (
    <>
      <PageHeader
        n="C"
        eyebrow="For clients"
        lines={["Video editing", "for clients."]}
        intro="HiKARii operates as your dedicated video editing agency. From recurring social and YouTube content to commercial brand films, our post-production team manages the entire cutting workflow."
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
              <Link to="/how-it-works" className="link-line hover:text-primary transition-colors">
                See how the editing process works →
              </Link>
            </div>
          </div>
        }
      />
      <ForClients />
      <Matching />
      <Editors />
      <Trust />
      <FinalCta secondaryTo="/pricing" secondaryLabel="View video editing pricing" />
    </>
  );
}
