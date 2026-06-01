import { DollarSign, TrendingUp, Users, Package, CreditCard, BarChart3, Target, Rocket } from "lucide-react";

const revenueStreams = [
  {
    icon: CreditCard,
    name: "Cosmetic Battle Pass",
    price: "$4.99 / month",
    color: "bg-purple-100 border-purple-200 text-purple-700",
    iconBg: "bg-purple-500",
    desc: "Monthly pass that unlocks cosmetic hero outfits, base decorations, and seasonal effects. Zero gameplay advantage. Cancellable any time.",
    highlights: ["All items cosmetic only", "Unlockable via gameplay too (slower)", "Family sub includes pass"],
  },
  {
    icon: Package,
    name: "Hero Pack DLC",
    price: "$2.99 / hero pack",
    color: "bg-blue-100 border-blue-200 text-blue-700",
    iconBg: "bg-blue-500",
    desc: "One-time purchase cosmetic packs for each hero class. Includes exclusive outfit, base decoration set, and animated avatar frame.",
    highlights: ["One-time purchase, permanent", "5 packs at launch", "No gameplay stats included"],
  },
  {
    icon: Users,
    name: "Family Subscription",
    price: "$7.99 / month",
    color: "bg-green-100 border-green-200 text-green-700",
    iconBg: "bg-green-500",
    desc: "All content for up to 5 profiles in one household. Includes Battle Pass, all current Hero Packs, Parent Dashboard premium features, and early access to new content.",
    highlights: ["Up to 5 player profiles", "All content included", "Parent Dashboard premium access"],
  },
];

const projections = [
  {
    year: "Year 1",
    revenue: "$800K",
    downloads: "500K",
    mau: "120K",
    color: "bg-blue-500",
    lightBg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    year: "Year 2",
    revenue: "$3.2M",
    downloads: "2M",
    mau: "480K",
    color: "bg-purple-500",
    lightBg: "bg-purple-50",
    border: "border-purple-200",
  },
  {
    year: "Year 3",
    revenue: "$8.5M",
    downloads: "5M",
    mau: "1.2M",
    color: "bg-pink-500",
    lightBg: "bg-pink-50",
    border: "border-pink-200",
  },
];

const keyAssumptions = [
  "5% conversion rate from free-to-play to any paid product (industry avg: 2–3%)",
  "Average Revenue Per Paying User (ARPPU): $6.20/month",
  "Family subscription represents 40% of paid revenue by Year 2",
  "80% Day-30 retention (targeting 60% above genre average)",
  "No ads revenue — zero ad dependency in model",
  "App Store and Google Play take 15% cut (small publisher rate)",
];

const ethicsSection = [
  {
    rule: "No loot boxes",
    detail: "All items are visible and priced before purchase. No randomized reward mechanics.",
  },
  {
    rule: "No pay-to-win",
    detail: "Crystals (in-game currency) cannot be purchased. Every gameplay-affecting item is earned through play.",
  },
  {
    rule: "No dark patterns",
    detail: "No countdown timers on purchases, no social pressure mechanics, no 'limited time' urgency traps.",
  },
  {
    rule: "No ads",
    detail: "Zero advertising in the game. Revenue comes entirely from direct product value.",
  },
  {
    rule: "No spending notifications to kids",
    detail: "All purchase UIs are gated behind the Parent Dashboard. Kids cannot trigger purchases in-game.",
  },
];

export default function Business() {
  return (
    <div className="space-y-10 fade-up">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-full px-4 py-1.5 text-sm font-bold mb-4">
          <DollarSign className="w-4 h-4" />
          Business Model
        </div>
        <h2 className="display-font text-4xl font-bold text-slate-900 mb-3">Free to Play, Ethical by Design</h2>
        <p className="text-slate-500 text-lg max-w-2xl">
          Mission Mates is free to download and play. Revenue comes entirely from voluntary, transparent cosmetic purchases. No gambling, no dark patterns, no ads.
        </p>
      </div>

      {/* Revenue Streams */}
      <div>
        <h3 className="font-bold text-slate-700 uppercase text-xs tracking-wider mb-4">Revenue Streams</h3>
        <div className="grid md:grid-cols-3 gap-4 stagger">
          {revenueStreams.map((stream) => {
            const Icon = stream.icon;
            return (
              <div key={stream.name} className={`rounded-2xl border p-6 shadow-sm bg-white card-hover`}>
                <div className={`w-10 h-10 ${stream.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{stream.name}</h3>
                <div className={`inline-block text-sm font-black rounded-full px-3 py-0.5 mb-3 border ${stream.color}`}>
                  {stream.price}
                </div>
                <p className="text-sm text-slate-600 mb-3 leading-relaxed">{stream.desc}</p>
                <ul className="space-y-1.5">
                  {stream.highlights.map((h) => (
                    <li key={h} className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue Projections */}
      <div>
        <h3 className="font-bold text-slate-700 uppercase text-xs tracking-wider mb-4">Revenue Projections</h3>
        <div className="grid md:grid-cols-3 gap-4 stagger">
          {projections.map((p) => (
            <div key={p.year} className={`rounded-2xl border p-6 ${p.lightBg} ${p.border}`}>
              <div className="display-font text-sm font-bold text-slate-500 uppercase mb-1">{p.year}</div>
              <div className={`display-font text-4xl font-bold mb-4`} style={{ color: `hsl(var(--primary))` }}>
                {p.revenue}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Total Downloads</span>
                  <span className="font-bold text-slate-800">{p.downloads}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Monthly Active Users</span>
                  <span className="font-bold text-slate-800">{p.mau}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projection Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-slate-500" />
          <h3 className="font-bold text-slate-700">Revenue Growth Trajectory</h3>
        </div>
        <div className="space-y-3">
          {projections.map((p) => {
            const pct = p.year === "Year 1" ? 9.4 : p.year === "Year 2" ? 37.6 : 100;
            return (
              <div key={p.year} className="flex items-center gap-4">
                <div className="w-14 text-sm font-bold text-slate-600 shrink-0">{p.year}</div>
                <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${p.color} transition-all duration-700`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="w-16 text-right font-black text-slate-800 text-sm">{p.revenue}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Assumptions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-slate-500" />
          <h3 className="font-bold text-slate-700">Key Assumptions</h3>
        </div>
        <ul className="space-y-2">
          {keyAssumptions.map((a) => (
            <li key={a} className="flex items-start gap-2.5 text-sm text-slate-600">
              <TrendingUp className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
              {a}
            </li>
          ))}
        </ul>
      </div>

      {/* Ethics Commitment */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-500/30 rounded-xl flex items-center justify-center">
            <Rocket className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="display-font text-xl font-bold">Our Monetization Ethics</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {ethicsSection.map((item) => (
            <div key={item.rule} className="bg-white/10 rounded-xl p-4">
              <div className="font-bold text-green-400 text-sm mb-1">{item.rule}</div>
              <p className="text-white/70 text-xs leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
