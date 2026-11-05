import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("Technical SEO: Sitemap & Robots", () => {
  const publicDir = path.resolve(__dirname, "../../public");

  it("has a valid public/sitemap.xml with canonical domain and indexable routes", () => {
    const sitemapPath = path.join(publicDir, "sitemap.xml");
    expect(fs.existsSync(sitemapPath)).toBe(true);

    const content = fs.readFileSync(sitemapPath, "utf-8");
    expect(content.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(content).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

    const expectedUrls = [
      "https://hikarii.studio/",
      "https://hikarii.studio/work",
      "https://hikarii.studio/pricing",
      "https://hikarii.studio/get-started",
      "https://hikarii.studio/how-it-works",
      "https://hikarii.studio/clients",
      "https://hikarii.studio/editors",
      "https://hikarii.studio/terms",
    ];

    for (const url of expectedUrls) {
      expect(content).toContain(`<loc>${url}</loc>`);
    }

    // Must NOT contain private, auth, or alternate domains
    expect(content).not.toContain("hikarii-ashy.vercel.app");
    expect(content).not.toContain("www.hikarii.studio");
    expect(content).not.toContain("/dashboard");
    expect(content).not.toContain("/sign-in");
    expect(content).not.toContain("/sign-up");
  });

  it("has a valid public/robots.txt pointing to the canonical sitemap", () => {
    const robotsPath = path.join(publicDir, "robots.txt");
    expect(fs.existsSync(robotsPath)).toBe(true);

    const content = fs.readFileSync(robotsPath, "utf-8");
    expect(content).toContain("Sitemap: https://hikarii.studio/sitemap.xml");
    expect(content).toContain("Allow: /");
    expect(content).toContain("Disallow: /dashboard\n");
    expect(content).toContain("Disallow: /dashboard/");
    expect(content).toContain("Disallow: /sign-in");
    expect(content).toContain("Disallow: /sign-up");
  });

  it("has high-resolution favicon and touch icon assets in public directory", () => {
    const icoPath = path.join(publicDir, "favicon.ico");
    const pngPath = path.join(publicDir, "favicon.png");
    const svgPath = path.join(publicDir, "favicon.svg");
    const appleTouchPath = path.join(publicDir, "apple-touch-icon.png");

    expect(fs.existsSync(icoPath)).toBe(true);
    expect(fs.statSync(icoPath).size).toBeGreaterThan(0);

    expect(fs.existsSync(pngPath)).toBe(true);
    expect(fs.statSync(pngPath).size).toBeGreaterThan(0);

    expect(fs.existsSync(svgPath)).toBe(true);
    expect(fs.statSync(svgPath).size).toBeGreaterThan(0);

    expect(fs.existsSync(appleTouchPath)).toBe(true);
    expect(fs.statSync(appleTouchPath).size).toBeGreaterThan(0);
  });

  it("has stable public logo and social sharing preview assets", () => {
    const logoPath = path.join(publicDir, "logo.png");
    const ogImagePath = path.join(publicDir, "og-image.png");

    expect(fs.existsSync(logoPath)).toBe(true);
    expect(fs.statSync(logoPath).size).toBeGreaterThan(0);

    expect(fs.existsSync(ogImagePath)).toBe(true);
    expect(fs.statSync(ogImagePath).size).toBeGreaterThan(0);
  });

  it("includes valid Organization structured data and Open Graph / Twitter metadata in root and homepage", () => {
    const rootRoutePath = path.resolve(__dirname, "../routes/__root.tsx");
    const indexRoutePath = path.resolve(__dirname, "../routes/index.tsx");

    const rootContent = fs.readFileSync(rootRoutePath, "utf-8");
    const indexContent = fs.readFileSync(indexRoutePath, "utf-8");

    // Organization schema in __root.tsx
    expect(rootContent).toContain('"@context": "https://schema.org"');
    expect(rootContent).toContain('"@type": "Organization"');
    expect(rootContent).toContain('name: "HiKARii"');
    expect(rootContent).toContain('url: "https://hikarii.studio"');
    expect(rootContent).toContain('logo: "https://hikarii.studio/logo.png"');
    expect(rootContent).toContain(
      '"https://www.instagram.com/hikarii.ab?exln=dG93amIza2VwOTBp&utm_source=qr"',
    );
    expect(rootContent).not.toContain("https://x.com/hikarii");

    // Favicon links
    expect(rootContent).toContain('href: "/favicon.ico"');
    expect(rootContent).toContain('href: "/favicon.svg"');
    expect(rootContent).toContain('href: "/favicon.png"');
    expect(rootContent).toContain('href: "/apple-touch-icon.png"');

    // Open Graph & Twitter metadata
    for (const content of [rootContent, indexContent]) {
      expect(content).toContain('"og:site_name"');
      expect(content).toContain('"og:type"');
      expect(content).toContain('"og:title"');
      expect(content).toContain('"og:description"');
      expect(content).toContain('"https://hikarii.studio/og-image.png"');
      expect(content).toContain('"twitter:card"');
      expect(content).toMatch(/"https:\/\/hikarii\.studio\/?\"/);
    }

    // Site layout must not contain X link
    const layoutPath = path.resolve(__dirname, "../components/site/layout.tsx");
    const layoutContent = fs.readFileSync(layoutPath, "utf-8");
    expect(layoutContent).not.toContain("https://x.com");
  });

  it("ensures each public route defines exactly one unique canonical URL and root has no static canonical", () => {
    const rootPath = path.resolve(__dirname, "../routes/__root.tsx");
    const rootContent = fs.readFileSync(rootPath, "utf-8");

    // Root links must NOT hardcode a static canonical link, ensuring 404 / private routes do not inherit homepage canonical
    expect(rootContent).not.toContain('rel: "canonical"');

    const publicRouteCanonicals: Record<string, string> = {
      "index.tsx": "https://hikarii.studio/",
      "work.tsx": "https://hikarii.studio/work",
      "pricing.tsx": "https://hikarii.studio/pricing",
      "get-started.tsx": "https://hikarii.studio/get-started",
      "how-it-works.tsx": "https://hikarii.studio/how-it-works",
      "clients.tsx": "https://hikarii.studio/clients",
      "editors.tsx": "https://hikarii.studio/editors",
      "terms.tsx": "https://hikarii.studio/terms",
    };

    for (const [filename, expectedCanonical] of Object.entries(publicRouteCanonicals)) {
      const filePath = path.resolve(__dirname, `../routes/${filename}`);
      expect(fs.existsSync(filePath)).toBe(true);

      const content = fs.readFileSync(filePath, "utf-8");

      // Count occurrences of rel: "canonical"
      const canonicalMatches = content.match(/rel:\s*"canonical"/g);
      expect(canonicalMatches?.length).toBe(1);

      // Verify exact canonical href
      expect(content).toContain(`href: "${expectedCanonical}"`);
    }
  });

  it("ensures public routes have route-specific og:url and robots index, follow", () => {
    const publicRouteOgUrls: Record<string, string> = {
      "index.tsx": "https://hikarii.studio/",
      "work.tsx": "https://hikarii.studio/work",
      "pricing.tsx": "https://hikarii.studio/pricing",
      "get-started.tsx": "https://hikarii.studio/get-started",
      "how-it-works.tsx": "https://hikarii.studio/how-it-works",
      "clients.tsx": "https://hikarii.studio/clients",
      "editors.tsx": "https://hikarii.studio/editors",
      "terms.tsx": "https://hikarii.studio/terms",
    };

    for (const [filename, expectedOgUrl] of Object.entries(publicRouteOgUrls)) {
      const filePath = path.resolve(__dirname, `../routes/${filename}`);
      const content = fs.readFileSync(filePath, "utf-8");

      // Verify og:url
      expect(content).toContain(`property: "og:url", content: "${expectedOgUrl}"`);

      // Verify robots index, follow
      expect(content).toContain('name: "robots", content: "index, follow"');

      // Verify Twitter card tags without X handle
      expect(content).toContain('name: "twitter:card", content: "summary_large_image"');
      expect(content).toContain('name: "twitter:title"');
      expect(content).toContain('name: "twitter:description"');
      expect(content).not.toContain("twitter:site");
      expect(content).not.toContain("twitter:creator");
    }
  });

  it("ensures private auth and dashboard routes have noindex, nofollow and no canonical link", () => {
    const privateFiles = [
      "../routes/sign-in.tsx",
      "../routes/sign-up.tsx",
      "../routes/dashboard/index.tsx",
      "../routes/dashboard/billing.tsx",
      "../routes/dashboard/files.tsx",
      "../routes/dashboard/history.tsx",
      "../routes/dashboard/messages.tsx",
      "../routes/dashboard/settings.tsx",
      "../routes/dashboard/tasks.tsx",
      "../routes/dashboard/projects/index.tsx",
      "../routes/dashboard/projects/$projectId.tsx",
      "../routes/dashboard/projects/new.tsx",
    ];

    for (const relPath of privateFiles) {
      const filePath = path.resolve(__dirname, relPath);
      expect(fs.existsSync(filePath)).toBe(true);
      const content = fs.readFileSync(filePath, "utf-8");

      expect(content).toContain('name: "robots", content: "noindex, nofollow"');
      expect(content).not.toContain('rel: "canonical"');
    }
  });

  it("verifies single semantic H1 on homepage and single H2 in HiKARii Standard", () => {
    const sectionsPath = path.resolve(__dirname, "../components/site/sections.tsx");
    const sectionsContent = fs.readFileSync(sectionsPath, "utf-8");

    // Hero section must render exactly one single <h1>
    const heroMatch = sectionsContent.match(/export function Hero\(\)[\s\S]*?(?=export function)/);
    expect(heroMatch).not.toBeNull();
    const heroH1Matches = heroMatch![0].match(/<h1/g) || [];
    expect(heroH1Matches.length).toBe(1);
    expect(heroMatch![0]).toContain("From footage");
    expect(heroMatch![0]).toContain("finished.");

    // HiKARii Standard section must render exactly one single <h2>
    const standardMatch = sectionsContent.match(/export function HiKARiiStandard\(\)[\s\S]*?(?=export function)/);
    expect(standardMatch).not.toBeNull();
    const standardH2Matches = standardMatch![0].match(/<h2/g) || [];
    expect(standardH2Matches.length).toBe(1);
    expect(standardMatch![0]).toContain("Editing that ");
    expect(standardMatch![0]).toContain("feels different.");

    // PageHeader for inner public routes must render exactly one single <h1>
    const pageHeaderMatch = sectionsContent.match(/export function PageHeader\([\s\S]*?\n\}/);
    expect(pageHeaderMatch).not.toBeNull();
    const pageHeaderH1Matches = pageHeaderMatch![0].match(/<h1/g) || [];
    expect(pageHeaderH1Matches.length).toBe(1);
  });

  it("verifies homepage search relevance, metadata quality, and internal linking", () => {
    const indexPath = path.resolve(__dirname, "../routes/index.tsx");
    const indexContent = fs.readFileSync(indexPath, "utf-8");

    // Title & Canonical
    expect(indexContent).toContain('{ title: "HiKARii — Professional Video Editing Agency" }');
    expect(indexContent).toContain('href: "https://hikarii.studio/"');

    // Robots
    expect(indexContent).toContain('{ name: "robots", content: "index, follow" }');

    // Meta Description length and relevance
    const descMatch = indexContent.match(/name:\s*"description",\s*content:\s*"([^"]+)"/);
    expect(descMatch).not.toBeNull();
    const desc = descMatch![1];
    expect(desc.length).toBeGreaterThanOrEqual(140);
    expect(desc.length).toBeLessThanOrEqual(160);
    expect(desc).toContain("professional video editing agency");
    expect(desc).toContain("post-production team");

    // Sections internal links
    const sectionsPath = path.resolve(__dirname, "../components/site/sections.tsx");
    const sectionsContent = fs.readFileSync(sectionsPath, "utf-8");

    expect(sectionsContent).toContain('to="/get-started"');
    expect(sectionsContent).toContain('to="/work"');
    expect(sectionsContent).toContain('to="/how-it-works"');
    expect(sectionsContent).toContain('to="/pricing"');
    expect(sectionsContent).toContain('to="/clients"');
  });

  it("verifies /work page search relevance, metadata, single H1, and internal links", () => {
    const workRoutePath = path.resolve(__dirname, "../routes/work.tsx");
    const workContent = fs.readFileSync(workRoutePath, "utf-8");

    // Title & Canonical
    expect(workContent).toContain('{ title: "Video Editing Work — HiKARii" }');
    expect(workContent).toContain('href: "https://hikarii.studio/work"');

    // Robots & Open Graph
    expect(workContent).toContain('{ name: "robots", content: "index, follow" }');
    expect(workContent).toContain('property: "og:url", content: "https://hikarii.studio/work"');
    expect(workContent).toContain('property: "og:title", content: "Video Editing Work — HiKARii"');

    // Twitter Card metadata without X handles
    expect(workContent).toContain('name: "twitter:card", content: "summary_large_image"');
    expect(workContent).toContain('name: "twitter:title", content: "Video Editing Work — HiKARii"');
    expect(workContent).toContain('name: "twitter:image", content: "https://hikarii.studio/og-image.png"');
    expect(workContent).toContain('name: "twitter:image:alt", content: "HiKARii — Professional Video Editing Agency"');
    expect(workContent).not.toContain("twitter:site");
    expect(workContent).not.toContain("twitter:creator");

    // Meta Description length (140-160 chars) and relevance
    const descMatch = workContent.match(/name:\s*"description",\s*content:\s*"([^"]+)"/);
    expect(descMatch).not.toBeNull();
    const desc = descMatch![1];
    expect(desc.length).toBeGreaterThanOrEqual(140);
    expect(desc.length).toBeLessThanOrEqual(160);
    expect(desc).toContain("video editing");
    expect(desc).toContain("post-production team");

    // H1 Heading on /work
    expect(workContent).toContain('lines={["Video editing", "work."]}');

    // Internal links with required anchors
    expect(workContent).toContain('to="/pricing"');
    expect(workContent).toContain("View video editing pricing");
    expect(workContent).toContain('to="/how-it-works"');
    expect(workContent).toContain("See how our editing process works");
    expect(workContent).toContain('to="/get-started"');
    expect(workContent).toContain("Start a project");
    expect(workContent).toContain('to="/clients"');
    expect(workContent).toContain("How we work with clients");

    // Verify portfolio projects have descriptive alt attributes in data.ts
    const dataPath = path.resolve(__dirname, "../components/site/data.ts");
    const dataContent = fs.readFileSync(dataPath, "utf-8");
    expect(dataContent).toContain('alt: "Commercial video edit');
    expect(dataContent).toContain('alt: "Vertical social media video edit');
    expect(dataContent).toContain('alt: "Studio podcast video edit');
  });

  it("verifies /pricing page search relevance, metadata, single H1, and internal links", () => {
    const pricingRoutePath = path.resolve(__dirname, "../routes/pricing.tsx");
    const pricingContent = fs.readFileSync(pricingRoutePath, "utf-8");

    // Title & Canonical
    expect(pricingContent).toContain('{ title: "Video Editing Pricing — HiKARii" }');
    expect(pricingContent).toContain('href: "https://hikarii.studio/pricing"');

    // Robots & Open Graph
    expect(pricingContent).toContain('{ name: "robots", content: "index, follow" }');
    expect(pricingContent).toContain('property: "og:url", content: "https://hikarii.studio/pricing"');
    expect(pricingContent).toContain('property: "og:title", content: "Video Editing Pricing — HiKARii"');

    // Twitter Card metadata without X handles
    expect(pricingContent).toContain('name: "twitter:card", content: "summary_large_image"');
    expect(pricingContent).toContain('name: "twitter:title", content: "Video Editing Pricing — HiKARii"');
    expect(pricingContent).toContain('name: "twitter:image", content: "https://hikarii.studio/og-image.png"');
    expect(pricingContent).toContain('name: "twitter:image:alt", content: "HiKARii — Professional Video Editing Agency"');
    expect(pricingContent).not.toContain("twitter:site");
    expect(pricingContent).not.toContain("twitter:creator");

    // Meta Description length (140-160 chars) and relevance
    const descMatch = pricingContent.match(/name:\s*"description",\s*content:\s*"([^"]+)"/);
    expect(descMatch).not.toBeNull();
    const desc = descMatch![1];
    expect(desc.length).toBeGreaterThanOrEqual(140);
    expect(desc.length).toBeLessThanOrEqual(160);
    expect(desc).toContain("video editing pricing");
    expect(desc).toContain("post-production retainers");

    // H1 Heading on /pricing
    expect(pricingContent).toContain('lines={["Video editing", "pricing."]}');

    // Internal links with required anchors
    expect(pricingContent).toContain('to="/work"');
    expect(pricingContent).toContain("See our video editing work");
    expect(pricingContent).toContain('to="/how-it-works"');
    expect(pricingContent).toContain("See how the editing process works");
    expect(pricingContent).toContain('to="/get-started"');
    expect(pricingContent).toContain("Start a project");
    expect(pricingContent).toContain('to="/clients"');
    expect(pricingContent).toContain("See how we work with clients");

    // Verify existing pricing tiers and rates are strictly preserved
    expect(pricingContent).toContain('p: "$149"');
    expect(pricingContent).toContain('p: "$590"');
    expect(pricingContent).toContain('p: "Custom"');
  });

  it("verifies /how-it-works page search relevance, metadata, single H1, and internal links", () => {
    const howItWorksRoutePath = path.resolve(__dirname, "../routes/how-it-works.tsx");
    const howItWorksContent = fs.readFileSync(howItWorksRoutePath, "utf-8");

    // Title & Canonical
    expect(howItWorksContent).toContain('{ title: "How Video Editing Works — HiKARii" }');
    expect(howItWorksContent).toContain('href: "https://hikarii.studio/how-it-works"');

    // Robots & Open Graph
    expect(howItWorksContent).toContain('{ name: "robots", content: "index, follow" }');
    expect(howItWorksContent).toContain('property: "og:url", content: "https://hikarii.studio/how-it-works"');
    expect(howItWorksContent).toContain('property: "og:title", content: "How Video Editing Works — HiKARii"');

    // Twitter Card metadata without X handles
    expect(howItWorksContent).toContain('name: "twitter:card", content: "summary_large_image"');
    expect(howItWorksContent).toContain('name: "twitter:title", content: "How Video Editing Works — HiKARii"');
    expect(howItWorksContent).toContain('name: "twitter:image", content: "https://hikarii.studio/og-image.png"');
    expect(howItWorksContent).toContain('name: "twitter:image:alt", content: "HiKARii — Professional Video Editing Agency"');
    expect(howItWorksContent).not.toContain("twitter:site");
    expect(howItWorksContent).not.toContain("twitter:creator");

    // Meta Description length (140-160 chars) and relevance
    const descMatch = howItWorksContent.match(/name:\s*"description",\s*content:\s*"([^"]+)"/);
    expect(descMatch).not.toBeNull();
    const desc = descMatch![1];
    expect(desc.length).toBeGreaterThanOrEqual(140);
    expect(desc.length).toBeLessThanOrEqual(160);
    expect(desc).toContain("video editing process");
    expect(desc).toContain("post-production team");

    // H1 Heading on /how-it-works
    expect(howItWorksContent).toContain('lines={["How video editing", "works."]}');

    // Internal links with required anchors
    expect(howItWorksContent).toContain('to="/pricing"');
    expect(howItWorksContent).toContain("View video editing pricing");
    expect(howItWorksContent).toContain('to="/work"');
    expect(howItWorksContent).toContain("See our video editing work");
    expect(howItWorksContent).toContain('to="/get-started"');
    expect(howItWorksContent).toContain("Start a project");
    expect(howItWorksContent).toContain('to="/clients"');
    expect(howItWorksContent).toContain("See how we work with clients");

    // Verify 5-step process sequence is preserved and descriptive in data.ts
    const dataPath = path.resolve(__dirname, "../components/site/data.ts");
    const dataContent = fs.readFileSync(dataPath, "utf-8");
    expect(dataContent).toContain('t: "Start a Project"');
    expect(dataContent).toContain('t: "Send Footage"');
    expect(dataContent).toContain('t: "Team Craft"');
    expect(dataContent).toContain('t: "Review"');
    expect(dataContent).toContain('t: "Deliver"');
    expect(dataContent).toContain("assigned video editor");
    expect(dataContent).toContain("production-ready video deliverables");
  });

  it("verifies /clients page search relevance, metadata, single H1, and internal links", () => {
    const clientsRoutePath = path.resolve(__dirname, "../routes/clients.tsx");
    const clientsContent = fs.readFileSync(clientsRoutePath, "utf-8");

    // Title & Canonical
    expect(clientsContent).toContain('{ title: "Video Editing Services for Clients — HiKARii" }');
    expect(clientsContent).toContain('href: "https://hikarii.studio/clients"');

    // Robots & Open Graph
    expect(clientsContent).toContain('{ name: "robots", content: "index, follow" }');
    expect(clientsContent).toContain('property: "og:url", content: "https://hikarii.studio/clients"');
    expect(clientsContent).toContain('property: "og:title", content: "Video Editing Services for Clients — HiKARii"');

    // Twitter Card metadata without X handles
    expect(clientsContent).toContain('name: "twitter:card", content: "summary_large_image"');
    expect(clientsContent).toContain('name: "twitter:title", content: "Video Editing Services for Clients — HiKARii"');
    expect(clientsContent).toContain('name: "twitter:image", content: "https://hikarii.studio/og-image.png"');
    expect(clientsContent).toContain('name: "twitter:image:alt", content: "HiKARii — Professional Video Editing Agency"');
    expect(clientsContent).not.toContain("twitter:site");
    expect(clientsContent).not.toContain("twitter:creator");

    // Meta Description length (140-160 chars) and relevance
    const descMatch = clientsContent.match(/name:\s*"description",\s*content:\s*"([^"]+)"/);
    expect(descMatch).not.toBeNull();
    const desc = descMatch![1];
    expect(desc.length).toBeGreaterThanOrEqual(140);
    expect(desc.length).toBeLessThanOrEqual(160);
    expect(desc).toContain("professional video editing services");
    expect(desc).toContain("post-production team");

    // H1 Heading on /clients
    expect(clientsContent).toContain('lines={["Video editing", "for clients."]}');

    // Internal links with required anchors
    expect(clientsContent).toContain('to="/work"');
    expect(clientsContent).toContain("See our video editing work");
    expect(clientsContent).toContain('to="/pricing"');
    expect(clientsContent).toContain("View video editing pricing");
    expect(clientsContent).toContain('to="/how-it-works"');
    expect(clientsContent).toContain("See how the editing process works");
    expect(clientsContent).toContain('to="/get-started"');
    expect(clientsContent).toContain("Start a project");
  });

  it("verifies /get-started page search relevance, metadata, single H1, internal links, and intact intake flow", () => {
    const getStartedRoutePath = path.resolve(__dirname, "../routes/get-started.tsx");
    const getStartedContent = fs.readFileSync(getStartedRoutePath, "utf-8");

    // Title & Canonical
    expect(getStartedContent).toContain('{ title: "Start a Video Editing Project — HiKARii" }');
    expect(getStartedContent).toContain('href: "https://hikarii.studio/get-started"');

    // Robots & Open Graph
    expect(getStartedContent).toContain('{ name: "robots", content: "index, follow" }');
    expect(getStartedContent).toContain('property: "og:url", content: "https://hikarii.studio/get-started"');
    expect(getStartedContent).toContain('property: "og:title", content: "Start a Video Editing Project — HiKARii"');

    // Twitter Card metadata without X handles
    expect(getStartedContent).toContain('name: "twitter:card", content: "summary_large_image"');
    expect(getStartedContent).toContain('name: "twitter:title", content: "Start a Video Editing Project — HiKARii"');
    expect(getStartedContent).toContain('name: "twitter:image", content: "https://hikarii.studio/og-image.png"');
    expect(getStartedContent).toContain('name: "twitter:image:alt", content: "HiKARii — Professional Video Editing Agency"');
    expect(getStartedContent).not.toContain("twitter:site");
    expect(getStartedContent).not.toContain("twitter:creator");

    // Meta Description length (140-160 chars) and relevance
    const descMatch = getStartedContent.match(/name:\s*"description",\s*content:\s*"([^"]+)"/);
    expect(descMatch).not.toBeNull();
    const desc = descMatch![1];
    expect(desc.length).toBeGreaterThanOrEqual(140);
    expect(desc.length).toBeLessThanOrEqual(160);
    expect(desc).toContain("video editing project");
    expect(desc).toContain("post-production team");

    // H1 Heading on /get-started
    expect(getStartedContent).toContain('lines={["Start a video", "editing project."]}');

    // Studio intake contextual introduction
    expect(getStartedContent).toContain("Studio Project Intake");
    expect(getStartedContent).toContain("HiKARii is a professional video editing agency");
    expect(getStartedContent).toContain("post-production team");

    // Internal links with required anchors
    expect(getStartedContent).toContain('to="/pricing"');
    expect(getStartedContent).toContain("View video editing pricing");
    expect(getStartedContent).toContain('to="/work"');
    expect(getStartedContent).toContain("See our video editing work");
    expect(getStartedContent).toContain('to="/how-it-works"');
    expect(getStartedContent).toContain("See how the editing process works →");
    expect(getStartedContent).toContain('to="/clients"');
    expect(getStartedContent).toContain("See how we work with clients →");

    // Intake flow regression verification: ensure fields, options, and submission logic are untouched
    expect(getStartedContent).toContain('format: z.string().min(1, "Pick a format")');
    expect(getStartedContent).toContain('budget: z.string().min(1, "Pick a budget")');
    expect(getStartedContent).toContain('timeline: z.string().min(1, "Pick a timeline")');
    expect(getStartedContent).toContain('brief: z.string().trim().min(10, "Tell us a bit more (10+ characters)").max(1500)');
    expect(getStartedContent).toContain('fetch("/api/contact"');
    expect(getStartedContent).toContain('trackEvent("get_started_started")');
    expect(getStartedContent).toContain('trackEvent("contact_submitted"');
    expect(getStartedContent).toContain('name="website_hp"');
    expect(getStartedContent).toContain('to="/terms"');
  });
});



