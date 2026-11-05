import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "motion/react";
import { Cta } from "@/components/site/layout";
import { FinalCta, PageHeader } from "@/components/site/sections";
import { trackEvent } from "@/lib/analytics";

const plans = [
  {
    n: "Short",
    p: "$149",
    u: "per video",
    desc: "Short-form video editing for Reels, TikTok, and YouTube Shorts.",
    f: [
      "Up to 60s final cut",
      "Vertical (9:16) + square (1:1) formats",
      "Dynamic captions included",
      "2 review rounds",
      "48h first cut turnaround",
    ],
  },
  {
    n: "Story",
    p: "$590",
    u: "per video",
    desc: "Long-form video editing for YouTube series, podcasts, and brand stories.",
    f: [
      "Up to 12 min final cut",
      "Color grading & sound mix",
      "Motion graphics & titles",
      "3 review rounds",
      "Dedicated lead editor",
    ],
    hot: true,
  },
  {
    n: "Studio",
    p: "Custom",
    u: "monthly retainer",
    desc: "Ongoing post-production partnership for recurring content production.",
    f: [
      "Unlimited requests",
      "Dedicated post-production team",
      "Brand toolkit & assets",
      "Priority turnaround",
      "Dedicated account producer",
    ],
  },
];

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://hikarii.studio/pricing" },
      { name: "robots", content: "index, follow" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Video Editing Pricing — HiKARii" },
      {
        name: "description",
        content:
          "Explore HiKARii's video editing pricing. Transparent packages for short-form social, long-form stories, and dedicated monthly post-production retainers.",
      },
      { property: "og:title", content: "Video Editing Pricing — HiKARii" },
      {
        property: "og:description",
        content:
          "Explore HiKARii's video editing pricing. Transparent packages for short-form social, long-form stories, and dedicated monthly post-production retainers.",
      },
      { property: "og:image", content: "https://hikarii.studio/og-image.png" },
      { name: "twitter:title", content: "Video Editing Pricing — HiKARii" },
      {
        name: "twitter:description",
        content:
          "Explore HiKARii's video editing pricing. Transparent packages for short-form social, long-form stories, and dedicated monthly post-production retainers.",
      },
      { name: "twitter:image", content: "https://hikarii.studio/og-image.png" },
      { name: "twitter:image:alt", content: "HiKARii — Professional Video Editing Agency" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://hikarii.studio/pricing",
      },
    ],
  }),
  component: Pricing,
});

function Pricing() {
  useEffect(() => {
    trackEvent("pricing_viewed");
  }, []);

  return (
    <>
      <PageHeader
        n="P"
        eyebrow="Pricing"
        lines={["Video editing", "pricing."]}
        intro="Transparent video editing packages built for short-form social, long-form stories, and ongoing studio retainers. Partner with our professional post-production team—know your exact cost before the first cut."
        actions={
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Cta to="/get-started" analyticsLocation="pricing_hero">
                Start a project
              </Cta>
              <Cta to="/work" variant="ghost">
                See our video editing work
              </Cta>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-snow/60">
              <Link to="/how-it-works" className="link-line hover:text-primary transition-colors">
                See how the editing process works →
              </Link>
              <span className="text-snow/30">·</span>
              <Link to="/clients" className="link-line hover:text-primary transition-colors">
                See how we work with clients →
              </Link>
            </div>
          </div>
        }
      />
      <section className="bg-paper py-24 text-ink md:py-32">
        <div className="mx-auto grid max-w-[1600px] gap-0 px-5 md:grid-cols-3 md:px-10">
          {plans.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col border border-ink-line p-8 md:p-10 ${p.hot ? "bg-ink text-snow" : ""}`}
            >
              <div className="label flex justify-between">
                <span className="text-primary">0{i + 1}</span>
                {p.hot && <span className="bg-primary px-2 py-1 text-ink">Most booked</span>}
              </div>
              <h2 className="display mt-8 text-6xl">{p.n}</h2>
              <div className="display mt-6 text-5xl">{p.p}</div>
              <div className="label mt-1 opacity-60">{p.u}</div>
              <p className="mt-4 text-xs opacity-75">{p.desc}</p>
              <ul className="mt-8 flex-1 space-y-3 text-sm">
                {p.f.map((f) => (
                  <li key={f} className="flex gap-3 border-t border-current/10 pt-3">
                    <span className="text-primary">▸</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Cta
                  to="/get-started"
                  variant={p.hot ? "primary" : "ink"}
                  analyticsLocation="pricing"
                  analyticsPlan={p.n}
                  onClick={() => {
                    trackEvent("pricing_plan_selected", {
                      plan: p.n,
                      billing: p.u.includes("monthly") ? "monthly" : "pack",
                    });
                  }}
                >
                  Start a Project
                </Cta>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mx-auto mt-12 flex max-w-[1600px] flex-wrap items-center justify-between gap-6 px-5 text-xs text-ink/60 md:px-10">
          <p className="max-w-xl">
            Every plan includes professional editing craft, timeline assembly, color grading, sound design, and master delivery from our dedicated post-production team.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/how-it-works" className="link-line text-ink hover:text-primary transition-colors">
              See how the editing process works →
            </Link>
            <span className="text-ink/30">·</span>
            <Link to="/clients" className="link-line text-ink hover:text-primary transition-colors">
              See how we work with clients →
            </Link>
          </div>
        </div>
      </section>
      <FinalCta secondaryTo="/work" secondaryLabel="See our video editing work" />
    </>
  );
}
