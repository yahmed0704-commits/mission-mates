import { Shield, MessageSquareOff, UserCheck, Bot, Lock, Settings, BadgeCheck, Ban, CreditCard, Megaphone } from "lucide-react";

const safetyPillars = [
  {
    icon: MessageSquareOff,
    title: "Safe Chat Only",
    color: "bg-green-500",
    border: "border-green-200",
    bg: "bg-green-50",
    description: "Players under 13 can only communicate using a curated library of pre-approved phrases and quick responses. No free-text input. No way to share personal information through chat.",
    details: [
      "500+ pre-approved mission phrases",
      "Quick emoji-style reactions",
      "Zero free-text for under-13 accounts",
      "Parents can restrict chat for any age",
    ],
  },
  {
    icon: UserCheck,
    title: "Friend Approval Required",
    color: "bg-blue-500",
    border: "border-blue-200",
    bg: "bg-blue-50",
    description: "Kids can only play with approved friends. Friend requests require a parent-approved friend code. No strangers can ever join a private squad without explicit approval.",
    details: [
      "Unique friend codes, no usernames exposed",
      "Parent must approve new connections",
      "No public lobbies or matchmaking with strangers",
      "Friends list visible to parents at all times",
    ],
  },
  {
    icon: Bot,
    title: "Anti-Bullying AI",
    color: "bg-purple-500",
    border: "border-purple-200",
    bg: "bg-purple-50",
    description: "An AI moderation layer monitors all in-game interactions (even pre-approved phrases) for patterns of exclusion, harassment, or bullying. Accounts are flagged and parents are notified automatically.",
    details: [
      "Pattern detection for exclusionary behavior",
      "Automatic parent notification system",
      "Escalating response: warn → restrict → suspend",
      "Human moderation review within 24 hours",
    ],
  },
  {
    icon: Settings,
    title: "Parent Dashboard",
    color: "bg-orange-500",
    border: "border-orange-200",
    bg: "bg-orange-50",
    description: "A companion web app gives parents full visibility into their child's activity — playtime, friends, chat history, spending, and more. Set daily time limits, approve friends, and pause play remotely.",
    details: [
      "Daily & weekly playtime reports",
      "Friends list with approve / remove controls",
      "Full chat log visibility",
      "Remote session pause (one tap)",
      "Spending history (always $0 for fair play)",
      "Push notifications for key events",
    ],
  },
  {
    icon: Lock,
    title: "No Personal Info Exposed",
    color: "bg-slate-600",
    border: "border-slate-200",
    bg: "bg-slate-50",
    description: "Usernames are randomly generated adventure aliases (e.g., 'SilverHawk42'). Real names, emails, locations, and school information are never visible to other players.",
    details: [
      "Auto-generated adventure aliases",
      "No location data collection",
      "No social media login required",
      "Data stored encrypted at rest",
    ],
  },
  {
    icon: Ban,
    title: "No Ads. Ever.",
    color: "bg-red-500",
    border: "border-red-200",
    bg: "bg-red-50",
    description: "Mission Mates contains zero advertising. No banner ads, no video ads, no sponsored content, no data sold to advertisers. This is a paid/subscription product — kids are not the product.",
    details: [
      "Zero advertising in-game",
      "No data sold to third parties",
      "No tracking pixels or ad SDKs",
      "No 'watch ad for reward' mechanics",
    ],
  },
];

export default function Safety() {
  return (
    <div className="space-y-10 fade-up">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur border border-white/30 rounded-full px-4 py-1.5 text-sm font-bold mb-6">
            <Shield className="w-4 h-4" />
            Safety Architecture
          </div>
          <h2 className="display-font text-4xl md:text-5xl font-bold mb-4">Built Safe From the Ground Up</h2>
          <p className="text-white/85 text-lg max-w-2xl leading-relaxed">
            Safety isn't a feature we added at the end — it's the foundation Mission Mates was built on. Every design decision starts with the question: <em>"Is this safe for a 6-year-old?"</em>
          </p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "COPPA", sub: "Compliant" },
              { label: "GDPR", sub: "Compliant" },
              { label: "ESRB", sub: "E10+ Target" },
              { label: "Zero", sub: "Ads or Data Sales" },
            ].map((item) => (
              <div key={item.label} className="bg-white/15 backdrop-blur rounded-xl p-4 text-center">
                <div className="display-font text-2xl font-bold">{item.label}</div>
                <div className="text-white/70 text-xs font-semibold mt-0.5">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety Pillars */}
      <div className="grid md:grid-cols-2 gap-4 stagger">
        {safetyPillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className={`rounded-2xl border p-6 shadow-sm ${pillar.bg} ${pillar.border}`}
              data-testid={`safety-pillar-${pillar.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${pillar.color} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">{pillar.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">{pillar.description}</p>
                  <ul className="space-y-1.5">
                    {pillar.details.map((d) => (
                      <li key={d} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <BadgeCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Loot Boxes */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <CreditCard className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-amber-800">No Loot Boxes</h3>
          </div>
          <p className="text-sm text-amber-700 leading-relaxed">
            Mission Mates has zero randomized reward mechanics. Every item in the game is either earned through gameplay or purchased directly at a transparent price. No blind boxes, no gacha, no gambling mechanics of any kind.
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Megaphone className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-blue-800">Incident Reporting</h3>
          </div>
          <p className="text-sm text-blue-700 leading-relaxed">
            Players and parents can report incidents in-game or via the Parent Dashboard. All reports are reviewed by a human moderation team within 24 hours. Serious violations result in immediate suspension pending review.
          </p>
        </div>
      </div>

      {/* Compliance footer */}
      <div className="bg-slate-900 rounded-2xl p-6 text-slate-300 text-sm leading-relaxed">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-white font-bold">Regulatory Compliance: </span>
            Mission Mates targets full COPPA (Children's Online Privacy Protection Act) compliance for U.S. users under 13, GDPR-K compliance for EU users, and Australia's Online Safety Act requirements. Legal review is conducted quarterly by our external privacy counsel. A Privacy Policy and Terms of Service written in plain language (accessible to parents) are available in-app and on our website.
          </div>
        </div>
      </div>
    </div>
  );
}
