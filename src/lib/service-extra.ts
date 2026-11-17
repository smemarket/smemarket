/**
 * Extra service-page content: who it's for, the first 90 days, channels, a pairing and more FAQs.
 * Kept separate from site.ts so the core service data stays easy to scan.
 * Everything here describes the work, never promises results we can't show yet.
 */
export type ServiceExtra = {
  who: { k: string; img: string; line: string }[];
  ninety: { m: string; t: string; d: string }[];
  channels: string[];
  pair: { slug: string; why: string };
  faq: { q: string; a: string }[];
};

export const SERVICE_EXTRA: Record<string, ServiceExtra> = {
  "seo-optimisation": {
    who: [
      { k: "Clinics", img: "/images/clinic.jpg", line: "Patients search before they call. Be the first name they see for the treatments you offer." },
      { k: "Salons", img: "/images/salon.jpg", line: "Show up in Maps when someone nearby searches for a blow-dry tonight." },
      { k: "Cafés & restaurants", img: "/images/cafe.jpg", line: "Get found for “breakfast near me” with fresh photos and replies to every review." },
      { k: "Professional services", img: "/images/team.jpg", line: "Rank for the questions your clients ask before they hire anyone." },
    ],
    ninety: [
      { m: "Month 1", t: "Foundations", d: "Keyword map agreed, Google Business Profile rebuilt, technical fixes on your most important pages." },
      { m: "Month 2", t: "Content", d: "New service and FAQ pages written, weekly profile posts, every review answered." },
      { m: "Month 3", t: "Momentum", d: "Rankings and AI mentions tracked, and more effort on the pages that are moving." },
    ],
    channels: ["Google Search", "Google Maps", "Google Business Profile", "ChatGPT", "Perplexity", "Gemini", "Bing"],
    pair: { slug: "enquiry-desk", why: "More searches means more enquiries. The enquiry desk makes sure every one of them gets a fast reply." },
    faq: [
      { q: "Will you write content for my website?", a: "Yes. Service pages, FAQ pages and profile posts are drafted by our agents and checked by our team. You approve anything that changes your site." },
      { q: "Do you need access to my website?", a: "For on-page fixes, yes. If you'd rather keep control, we send the changes to your developer to apply." },
      { q: "Can you guarantee first place on Google?", a: "Nobody honestly can. We commit to the work and report the numbers every month, so you can see exactly what's moving." },
    ],
  },
  "paid-ads": {
    who: [
      { k: "Clinics", img: "/images/clinic.jpg", line: "Fill quiet appointment slots with offers shown to people nearby." },
      { k: "Cafés & restaurants", img: "/images/cafe.jpg", line: "Push weekend offers and new menus to people within a short drive." },
      { k: "Retail shops", img: "/images/owner.jpg", line: "Bring shoppers back with product ads and seasonal promotions." },
      { k: "Real estate", img: "/images/dubai-day.jpg", line: "Reach buyers and tenants by area, budget and property type." },
    ],
    ninety: [
      { m: "Month 1", t: "Setup and first creative", d: "Tracking installed, audiences built, and the first batch of creatives live once you approve them." },
      { m: "Month 2", t: "Testing", d: "New hooks, formats and audiences tested. Budget moves toward whatever brings enquiries." },
      { m: "Month 3", t: "Scaling", d: "Winners get more budget, losers get paused, and fresh creative keeps costs down." },
    ],
    channels: ["Instagram", "Facebook", "TikTok", "Google Search", "Google Maps", "YouTube"],
    pair: { slug: "social-media-management", why: "Ads land better when your profile looks alive. Social keeps it fresh between campaigns." },
    faq: [
      { q: "Can I see the ads before they run?", a: "Yes. Every creative and every budget change is approved by you before it goes live." },
      { q: "How soon do ads start?", a: "Within days of agreeing your offer and budget, once tracking is set up properly." },
      { q: "I already run ads. Do we start from scratch?", a: "No. We start with an audit of what has worked so far, then build on it." },
    ],
  },
  "sdr-outreach": {
    who: [
      { k: "Trading & B2B", img: "/images/caller.jpg", line: "Reach procurement and operations managers who buy what you supply." },
      { k: "Professional services", img: "/images/team.jpg", line: "Open conversations with companies that need your expertise right now." },
      { k: "Real estate", img: "/images/dubai-day.jpg", line: "Start conversations with landlords, investors and corporate tenants." },
      { k: "Clinics & wellness", img: "/images/clinic.jpg", line: "Build corporate wellness and partner deals with nearby businesses." },
    ],
    ninety: [
      { m: "Month 1", t: "Your ideal customer", d: "We agree who to target, build the first named list and write messages you approve." },
      { m: "Month 2", t: "Conversations", d: "Personal sequences go out across email, LinkedIn and WhatsApp. Replies are qualified and handed over." },
      { m: "Month 3", t: "Sharpening", d: "We learn which segments and messages get replies, and focus the list on them." },
    ],
    channels: ["Email", "LinkedIn", "WhatsApp", "Phone follow-up", "Your calendar"],
    pair: { slug: "website-redesign", why: "Prospects check your website before they reply. A clear, modern site turns their curiosity into a meeting." },
    faq: [
      { q: "Whose name do the messages go out under?", a: "Yours, or a named person from your business, in your tone. You approve the messages before anything is sent." },
      { q: "Where do the prospect lists come from?", a: "We research businesses and decision-makers that match your ideal customer, then check the list before anyone is contacted." },
      { q: "What happens when someone replies?", a: "Our team qualifies the reply, then books it into your calendar or hands it straight to you." },
    ],
  },
  "social-media-management": {
    who: [
      { k: "Cafés & restaurants", img: "/images/cafe.jpg", line: "New dishes, offers and behind-the-scenes, posted every week." },
      { k: "Salons", img: "/images/salon.jpg", line: "Before-and-afters, team spotlights and booking reminders." },
      { k: "Retail shops", img: "/images/owner.jpg", line: "New arrivals, styling ideas and seasonal campaigns." },
      { k: "Clinics", img: "/images/clinic.jpg", line: "Helpful explainers that build trust before the first visit." },
    ],
    ninety: [
      { m: "Month 1", t: "Your voice", d: "We learn your brand, tone and offers, then send your first monthly calendar to approve." },
      { m: "Month 2", t: "Rhythm", d: "Posts, reels and stories go out on schedule. Comments and messages get answered." },
      { m: "Month 3", t: "What works", d: "We double down on the formats your audience responds to, and drop the rest." },
    ],
    channels: ["Instagram", "TikTok", "Facebook", "LinkedIn", "Google Business Profile"],
    pair: { slug: "paid-ads", why: "Great organic posts are the best ad creative. Put budget behind the ones that already work." },
    faq: [
      { q: "Do I need to send you photos?", a: "It helps. We also create designed posts and can work from what's already on your accounts and website." },
      { q: "Can I change a post before it goes out?", a: "Always. The whole month is sent to you for approval first, and you can ask for changes on any post." },
      { q: "Will you reply to comments and DMs?", a: "Yes, in your tone. Anything that needs you, like a complaint or a custom quote, is handed straight to you." },
    ],
  },
  "enquiry-desk": {
    who: [
      { k: "Clinics", img: "/images/clinic.jpg", line: "Every appointment request answered, even after hours." },
      { k: "Salons", img: "/images/salon.jpg", line: "Booking questions answered fast, with reminders that cut no-shows." },
      { k: "Home & trade services", img: "/images/caller.jpg", line: "Quotes requested, details collected, follow-ups sent until there's a yes or a no." },
      { k: "Real estate", img: "/images/dubai-day.jpg", line: "Viewing requests answered in minutes, not the next morning." },
    ],
    ninety: [
      { m: "Month 1", t: "Connected", d: "WhatsApp, email and forms connected, your FAQs, prices and hand-off rules agreed." },
      { m: "Month 2", t: "Always on", d: "Instant first replies around the clock, our team following up within one business day." },
      { m: "Month 3", t: "Repeat and review", d: "Past customers invited back and asked for Google reviews." },
    ],
    channels: ["WhatsApp Business", "Instagram DMs", "Website forms", "Email", "Call-back requests"],
    pair: { slug: "seo-optimisation", why: "Once every enquiry is answered, more of them is pure upside. SEO brings in more people searching for you." },
    faq: [
      { q: "Does it work with my WhatsApp Business number?", a: "Yes. Replies go out from your existing number, in your name and tone." },
      { q: "What happens with complicated questions?", a: "The first reply is instant. Anything that needs a person is picked up by our team, or handed to you, within one business day." },
      { q: "Can I see every conversation?", a: "Yes. Every enquiry, reply and outcome is logged in your dashboard." },
    ],
  },
  "website-redesign": {
    who: [
      { k: "Clinics", img: "/images/clinic.jpg", line: "Treatments, prices and booking on one clear page each." },
      { k: "Professional services", img: "/images/team.jpg", line: "A site that earns trust before the first call." },
      { k: "Retail shops", img: "/images/owner.jpg", line: "Products, location and WhatsApp ordering, fast on any phone." },
      { k: "Cafés & restaurants", img: "/images/cafe.jpg", line: "Menu, photos, map and booking without a single PDF." },
    ],
    ninety: [
      { m: "Week 1", t: "Plan", d: "We review your current site, your competitors and your offer, and agree the pages you need." },
      { m: "Weeks 2–3", t: "Design and copy", d: "New design and words for every page, sent to you for review." },
      { m: "Week 4", t: "Launch", d: "Built, tested on every phone, tracked, and live. Then it's yours." },
    ],
    channels: ["Mobile first", "WhatsApp buttons", "Enquiry forms", "Google Analytics", "Schema markup", "Fast hosting"],
    pair: { slug: "seo-optimisation", why: "A new site is the perfect moment to start SEO. It's built search-ready, SEO keeps it climbing." },
    faq: [
      { q: "Do I need to write the content?", a: "No. We write the copy for you. You review it and tell us what to change." },
      { q: "Will I be able to edit it myself?", a: "Yes. We'll show you how to update text, photos and prices." },
      { q: "Is there a monthly fee?", a: "No. It's one payment and the website is yours." },
    ],
  },
};
