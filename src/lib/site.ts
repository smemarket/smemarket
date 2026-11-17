export const SITE = {
  name: "SME Market",
  url: "https://www.smemarket.ae",
  tagline: "Growth you can count.",
  description:
    "AI-powered marketing, sales and websites for UAE SMEs. One clear price and one KPI per service, with a team that signs off everything before it goes out.",
  phone: "+971 52 452 9187",
  phoneHref: "tel:+971524529187",
  whatsapp: "971524529187",
  email: "admin@smemarket.ae",
  legal: "SME Market L.L.C-FZ",
  address: "Meydan Free Zone, Dubai, UAE",
  licence: "2654774.01",
};

export function waLink(message = "Hi SME Market, I'd like to grow my business.") {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function mailLink(subject = "Enquiry from smemarket.ae", body = "") {
  return `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ""}`;
}

export type Stage = "Acquire" | "Convert" | "Retain";
export type IconName = "search" | "megaphone" | "userPlus" | "calendar" | "headphones" | "layout";

export type Service = {
  slug: string;
  num: string;
  name: string;
  short: string;
  sub: string;
  promise: string;
  bullets: string[];
  kpi: string;
  price: number;
  billing: "month" | "once";
  priceNote?: string;
  stage: Stage;
  icon: IconName;
  image: string;
  pain: { title: string; body: string }[];
  deliverables: { title: string; body: string }[];
  rhythm: { when: string; agents: string; team: string }[];
  dashboard: string[];
  faq: { q: string; a: string }[];
};

export const SERVICES: Service[] = [
  {
    slug: "seo-optimisation",
    image: "/images/svc-seo.jpg",
    num: "01",
    name: "SEO optimisation",
    short: "SEO",
    sub: "Search, LLMs and Google Business Profile",
    promise: "Get found on Google, in AI answers like ChatGPT, and on Google Maps.",
    bullets: [
      "Keyword research and on-page fixes",
      "Google Business Profile completed, posted to and kept up to date",
      "Pages that search engines and AI answers can cite",
    ],
    kpi: "Search visits and AI mentions",
    price: 2500,
    billing: "month",
    stage: "Acquire",
    icon: "search",
    pain: [
      { title: "Customers search. They find your competitor.", body: "People in Dubai, Abu Dhabi and Sharjah type what you sell into Google every day. If you're not on page one or in the Maps pack, that enquiry goes next door." },
      { title: "AI answers are the new front page.", body: "More buyers now ask ChatGPT, Gemini and Perplexity who to call. Those tools cite pages that are clear, structured and trusted. Most SME sites are none of those." },
      { title: "Your Google profile is half-finished.", body: "Missing hours, old photos, no posts, unanswered reviews. It's the first thing people see, and it's quietly costing you calls." },
    ],
    deliverables: [
      { title: "Keyword map", body: "The searches your customers actually type, in English and the way UAE buyers phrase them, ranked by intent." },
      { title: "On-page fixes", body: "Titles, headings, speed, schema and internal links fixed on the pages that matter." },
      { title: "Google Business Profile", body: "Completed, verified and posted to weekly. Reviews answered so your profile looks alive." },
      { title: "Citable pages", body: "Service and FAQ pages written so search engines and AI answers can quote you." },
    ],
    rhythm: [
      { when: "Week 1", agents: "Crawl your site, map competitors and pull keyword data", team: "Reviews the plan with you and agrees priorities" },
      { when: "Weekly", agents: "Draft fixes, Google posts and review replies", team: "Approves every change before it goes live" },
      { when: "Monthly", agents: "Track rankings, visits and AI mentions", team: "Sends you the report and the next month's plan" },
    ],
    dashboard: ["Search visits", "Keywords in top 10", "AI answer mentions", "Google profile actions"],
    faq: [
      { q: "How long until I see results?", a: "Google Business Profile changes usually show within weeks. Organic rankings build over a few months. Your dashboard shows movement every month so you're never guessing." },
      { q: "What are AI mentions?", a: "We check whether tools like ChatGPT and Perplexity mention or cite your business for the searches you care about, and we track it month to month." },
      { q: "Do I need a new website for SEO?", a: "No. We work on the site you have. If it's holding you back, we'll tell you, and Website redesign is there if you want it." },
    ],
  },
  {
    slug: "paid-ads",
    image: "/images/svc-ads.jpg",
    num: "02",
    name: "Paid ads",
    short: "Ads",
    sub: "Meta, TikTok and Google",
    promise: "Scroll-stopping creatives, built and run by us across Meta, TikTok and Google.",
    bullets: [
      "Ad creatives designed in-house: video, reels and statics, refreshed every month",
      "Campaigns set up, targeted and run for you on Meta, TikTok and Google",
      "Budget managed against cost per enquiry, not clicks",
    ],
    kpi: "Cost per enquiry",
    price: 4000,
    billing: "month",
    priceNote: "+ ad spend, paid by you",
    stage: "Acquire",
    icon: "megaphone",
    pain: [
      { title: "You boosted a post. Nothing happened.", body: "Boosting isn't a strategy. Without the right audience, creative and tracking, ad money disappears into likes." },
      { title: "Agencies report clicks, not customers.", body: "Clicks are cheap. Enquiries aren't. If no one tells you what an enquiry costs, you can't tell if ads are working." },
      { title: "Creative goes stale fast.", body: "The same three images for six months? People stop seeing them. Fresh creative is what keeps costs down." },
    ],
    deliverables: [
      { title: "Monthly creative drop", body: "Video, reels and statics built for each platform, refreshed every month." },
      { title: "Campaign setup", body: "Pixel, conversions and audiences configured properly on Meta, TikTok and Google." },
      { title: "Daily optimisation", body: "Budgets moved toward what produces enquiries. Losers paused fast." },
      { title: "Cost-per-enquiry reporting", body: "One number that tells you what each lead costs you, by channel." },
    ],
    rhythm: [
      { when: "Week 1", agents: "Audit past ads, competitors and audiences", team: "Agrees offer, budget and targets with you" },
      { when: "Daily", agents: "Monitor spend, test variants, flag winners", team: "Signs off every creative and budget shift" },
      { when: "Monthly", agents: "Produce the next creative batch", team: "Reviews cost per enquiry with you" },
    ],
    dashboard: ["Cost per enquiry", "Enquiries by channel", "Spend vs budget", "Top creative"],
    faq: [
      { q: "How much ad spend do I need?", a: "It depends on your market and goal. We'll recommend a starting budget during your free growth assessment. Ad spend is paid directly by you to the platforms." },
      { q: "Do you make the videos?", a: "Yes. Creative is designed in-house every month. You approve it before anything runs." },
      { q: "Which platform is best for me?", a: "We'll recommend based on where your customers are. Many UAE SMEs do well on Meta and Google; TikTok works well for consumer brands." },
    ],
  },
  {
    slug: "sdr-outreach",
    image: "/images/svc-outreach.jpg",
    num: "03",
    name: "SDR and outreach",
    short: "Outreach",
    sub: "A sales rep who opens doors",
    promise: "We find likely customers and start the conversation for you.",
    bullets: [
      "A named list of likely customers every month",
      "Personal outreach by email, LinkedIn and WhatsApp",
      "Interested replies booked in or handed to you",
    ],
    kpi: "Qualified replies per month",
    price: 3000,
    billing: "month",
    stage: "Acquire",
    icon: "userPlus",
    pain: [
      { title: "You're too busy running the business to sell it.", body: "Prospecting needs hours every week. Owners rarely have them, so the pipeline dries up between referrals." },
      { title: "Hiring a sales rep is a big bet.", body: "Salary, visa, training, and months before you know if they'll work out." },
      { title: "Cold messages get ignored.", body: "Generic copy-paste outreach burns your name. Personal, relevant messages get replies." },
    ],
    deliverables: [
      { title: "Named prospect list", body: "Businesses and decision-makers that match your ideal customer, refreshed monthly." },
      { title: "Personal sequences", body: "Messages written for each prospect across email, LinkedIn and WhatsApp." },
      { title: "Reply handling", body: "Interested replies qualified, then booked into your calendar or handed straight to you." },
      { title: "Pipeline view", body: "Every prospect, message and reply visible in your dashboard." },
    ],
    rhythm: [
      { when: "Week 1", agents: "Build your ideal-customer profile and first list", team: "Agrees targets, offer and tone with you" },
      { when: "Daily", agents: "Research prospects and draft personal messages", team: "Approves sequences and handles every live conversation" },
      { when: "Monthly", agents: "Refresh the list from what converted", team: "Reviews qualified replies with you" },
    ],
    dashboard: ["Qualified replies", "Meetings booked", "Prospects contacted", "Reply rate"],
    faq: [
      { q: "Will messages sound like a robot?", a: "No. Every sequence is approved by our team and written in your voice. Live conversations are handled by people." },
      { q: "Is it B2B only?", a: "It works best when you sell to businesses or high-value customers, such as contractors, consultants, suppliers and clinics selling to corporates." },
      { q: "What counts as a qualified reply?", a: "A reply from a prospect that fits your criteria and wants to talk, agreed with you up front." },
    ],
  },
  {
    slug: "social-media-management",
    image: "/images/svc-social.jpg",
    num: "04",
    name: "Social media management",
    short: "Social",
    sub: "Posting and content calendars",
    promise: "Your accounts kept active and answered, on a monthly plan.",
    bullets: [
      "A monthly content calendar you approve",
      "Posts, reels and stories, on schedule",
      "Comments and messages answered",
    ],
    kpi: "Posts on schedule, and reach",
    price: 3000,
    billing: "month",
    stage: "Retain",
    icon: "calendar",
    pain: [
      { title: "Your last post was months ago.", body: "Customers check your Instagram before they call. A dead account makes a live business look closed." },
      { title: "Content takes forever.", body: "Ideas, shoots, captions, scheduling. It's a job in itself, and it's never the priority." },
      { title: "DMs go unanswered.", body: "Messages sitting for days are enquiries walking away." },
    ],
    deliverables: [
      { title: "Monthly calendar", body: "A full month of planned content, sent to you for approval." },
      { title: "Posts, reels and stories", body: "Designed, written and published on schedule." },
      { title: "Community replies", body: "Comments and messages answered in your tone." },
      { title: "Reach report", body: "What went out, who saw it, and what worked." },
    ],
    rhythm: [
      { when: "Monthly", agents: "Draft next month's calendar and captions", team: "Sends it to you to approve" },
      { when: "Daily", agents: "Publish on schedule and triage comments", team: "Replies to anything that needs a personal touch" },
      { when: "Monthly", agents: "Pull reach and engagement", team: "Reviews what to do more of" },
    ],
    dashboard: ["Posts on schedule", "Reach", "Messages answered", "Top post"],
    faq: [
      { q: "Which platforms?", a: "Instagram, Facebook, TikTok and LinkedIn. We'll focus on the ones your customers use." },
      { q: "Do I approve everything?", a: "Yes. You approve the monthly calendar before anything is published." },
      { q: "Can you shoot photos and video?", a: "We design and edit in-house. If you need on-site shoots, we'll arrange them and quote separately." },
    ],
  },
  {
    slug: "enquiry-desk",
    image: "/images/svc-enquiry.jpg",
    num: "05",
    name: "Enquiry desk",
    short: "Enquiries",
    sub: "WhatsApp, phone and email",
    promise: "Every enquiry answered fast, and followed up until it's a yes or a no.",
    bullets: [
      "Instant first reply, then our team within one business day",
      "Follow-ups until the customer decides",
      "Past customers contacted for repeat visits and reviews",
    ],
    kpi: "Replies within one business day",
    price: 2500,
    billing: "month",
    stage: "Convert",
    icon: "headphones",
    pain: [
      { title: "Slow replies lose sales.", body: "The business that replies first usually wins. If a WhatsApp sits until tomorrow, they've already booked someone else." },
      { title: "Nobody follows up.", body: "Most enquiries need more than one touch. Without follow-up, warm leads go cold." },
      { title: "Past customers forget you.", body: "Your easiest sale is a repeat one, and they rarely hear from you again." },
    ],
    deliverables: [
      { title: "Instant first reply", body: "Every WhatsApp, call-back request and email acknowledged in seconds." },
      { title: "Team follow-up", body: "Our team picks it up within one business day and keeps going until there's an answer." },
      { title: "Repeat and review", body: "Past customers contacted for repeat visits and Google reviews." },
      { title: "Enquiry log", body: "Every enquiry, reply and outcome visible in your dashboard." },
    ],
    rhythm: [
      { when: "Setup", agents: "Connect WhatsApp, email and forms; learn your FAQs", team: "Agrees scripts, prices and hand-off rules with you" },
      { when: "Always on", agents: "Reply instantly and qualify the enquiry", team: "Takes over every real conversation" },
      { when: "Weekly", agents: "Chase open enquiries and past customers", team: "Reviews outcomes and adjusts scripts" },
    ],
    dashboard: ["Avg. first reply", "Enquiries handled", "Won / lost", "Reviews requested"],
    faq: [
      { q: "Do you answer as my business?", a: "Yes. We reply in your name and tone, using the answers and prices you approve." },
      { q: "What happens with complex questions?", a: "They're handed to you or your team straight away with full context." },
      { q: "Does it work with my WhatsApp Business?", a: "Yes. We connect to your existing number." },
    ],
  },
  {
    slug: "website-redesign",
    image: "/images/svc-website.jpg",
    num: "06",
    name: "Website redesign",
    short: "Website",
    sub: "Built to turn visits into enquiries",
    promise: "A fast, clear website that turns visitors into enquiries.",
    bullets: [
      "New design and copy for the pages customers need",
      "Enquiry forms and WhatsApp buttons, tracked",
      "Built for search from day one",
    ],
    kpi: "Enquiries from the site",
    price: 5000,
    billing: "once",
    priceNote: "one payment, yours to keep",
    stage: "Convert",
    icon: "layout",
    pain: [
      { title: "Your site looks older than your business.", body: "People judge in seconds. A dated site makes a great business look risky." },
      { title: "Visitors can't tell what to do next.", body: "No clear offer, no obvious button, no WhatsApp. They leave." },
      { title: "It's slow on a phone.", body: "Most UAE visitors are on mobile. If it doesn't load fast, it doesn't get read." },
    ],
    deliverables: [
      { title: "Design and copy", body: "New design and words for the pages customers actually need." },
      { title: "Conversion built in", body: "Enquiry forms and WhatsApp buttons on every page, tracked." },
      { title: "Search-ready", body: "Fast, mobile-first, with clean structure and schema from day one." },
      { title: "Yours to keep", body: "One payment. No monthly fee. You own it." },
    ],
    rhythm: [
      { when: "Week 1", agents: "Audit your current site and competitors", team: "Agrees pages, offer and look with you" },
      { when: "Week 2–3", agents: "Draft copy, layouts and build", team: "Reviews every page with you before launch" },
      { when: "Launch", agents: "Set up tracking and speed checks", team: "Hands over and shows you the numbers" },
    ],
    dashboard: ["Enquiries from the site", "Visitors", "WhatsApp taps", "Page speed"],
    faq: [
      { q: "How long does it take?", a: "Most SME sites are ready within a few weeks, depending on pages and how fast feedback comes back." },
      { q: "Is there a monthly fee?", a: "No. It's one payment and the site is yours to keep." },
      { q: "Can you write the copy?", a: "Yes. Design and copy are both included." },
    ],
  },
];

export const MONTHLY = SERVICES.filter((s) => s.billing === "month");
export const MONTHLY_TOTAL = MONTHLY.reduce((a, s) => a + s.price, 0); // 15,000
export const BUNDLE_PRICE = 10000;
export const BUNDLE_SAVING = MONTHLY_TOTAL - BUNDLE_PRICE;

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug);
}

export const aed = (n: number) => `AED ${n.toLocaleString("en-US")}`;

export const FAQ = [
  { q: "Is there a contract?", a: "No long contract. The five monthly services are billed month to month, and the website is a one-time payment. Pick what you need, or bundle all five monthly services for a lower monthly price." },
  { q: "If it's AI, who's actually doing the work?", a: "Our AI agents do the heavy lifting: research, drafts, monitoring and reporting, around the clock. Our team approves every post, ad, message and change before it goes out, and handles every real conversation with your customers." },
  { q: "Will my customers know it's AI?", a: "No. Everything goes out in your name and your tone, signed off by our team. Your customers just notice you're faster and more consistent." },
  { q: "What do I see after I sign up?", a: "A client dashboard showing what's being worked on in real time, what's waiting for your approval, and the one KPI for each service you've chosen." },
  { q: "What does the free growth assessment include?", a: "A few quick questions about your search presence, ads, social, enquiries and website. You get a score across each area and a recommendation of what to fix first. No cost, no obligation." },
  { q: "Who pays for ad spend?", a: "You do, directly to Meta, TikTok or Google, so every dirham of ad spend is yours. Our fee covers the creative, the setup and running the campaigns." },
  { q: "Do you work with businesses outside Dubai?", a: "Yes. We work with SMEs across all seven emirates." },
];
