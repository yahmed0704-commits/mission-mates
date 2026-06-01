import {
  Users, Star, Map, Home, Trophy, Calendar,
  Monitor, Wifi, WifiOff, Eye, Palette, Type, Globe
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Squad System",
    desc: "Invite 1–4 friends to form a squad of up to 5 players. Friend codes ensure only approved players join your team.",
    badge: "Core",
    badgeColor: "bg-blue-100 text-blue-700",
    color: "border-blue-200 bg-blue-50",
    iconBg: "bg-blue-500",
    details: ["Private squad rooms", "Invite via friend code", "Squad name & emblem", "Persistent team history"],
  },
  {
    icon: Star,
    title: "Hero Classes",
    desc: "Five unique hero classes — Builder, Explorer, Medic, Scout, Engineer — each with distinct abilities and play styles.",
    badge: "Core",
    badgeColor: "bg-purple-100 text-purple-700",
    color: "border-purple-200 bg-purple-50",
    iconBg: "bg-purple-500",
    details: ["5 distinct classes", "Unique ability trees", "Cosmetic hero outfits", "Class combination bonuses"],
  },
  {
    icon: Map,
    title: "Mission Board",
    desc: "A rotating set of daily, weekly, and seasonal missions keeps gameplay fresh and always rewarding.",
    badge: "Core",
    badgeColor: "bg-orange-100 text-orange-700",
    color: "border-orange-200 bg-orange-50",
    iconBg: "bg-orange-500",
    details: ["Daily missions (reset midnight)", "Weekly challenges", "Seasonal story missions", "Emergency squad alerts"],
  },
  {
    icon: Home,
    title: "Base Camp",
    desc: "Each squad shares a persistent Base Camp they build together. Upgrade rooms, decorate spaces, and show it off to friends.",
    badge: "Core",
    badgeColor: "bg-yellow-100 text-yellow-700",
    color: "border-yellow-200 bg-yellow-50",
    iconBg: "bg-yellow-500",
    details: ["Cooperative building", "Upgradeable rooms", "Cosmetic decorations", "Base camp showcase"],
  },
  {
    icon: Trophy,
    title: "Achievements",
    desc: "Hundreds of milestone achievements celebrate cooperation, creativity, and persistence — never pay-to-win shortcuts.",
    badge: "Engagement",
    badgeColor: "bg-amber-100 text-amber-700",
    color: "border-amber-200 bg-amber-50",
    iconBg: "bg-amber-500",
    details: ["Squad achievements", "Personal milestones", "Seasonal trophies", "Legacy badges"],
  },
  {
    icon: Calendar,
    title: "Seasonal Events",
    desc: "Limited-time events tied to seasons and holidays bring the whole community together for special cooperative challenges.",
    badge: "Live Ops",
    badgeColor: "bg-pink-100 text-pink-700",
    color: "border-pink-200 bg-pink-50",
    iconBg: "bg-pink-500",
    details: ["4 major seasons/year", "Holiday events", "Exclusive cosmetics", "Community goals"],
  },
  {
    icon: Monitor,
    title: "Cross-Platform Play",
    desc: "Play on iOS, Android, or PC — all platforms connect seamlessly. Your progress follows you everywhere.",
    badge: "Platform",
    badgeColor: "bg-slate-100 text-slate-700",
    color: "border-slate-200 bg-slate-50",
    iconBg: "bg-slate-600",
    details: ["iOS + Android + PC", "Shared progress", "Synced friend lists", "Cloud saves"],
  },
  {
    icon: WifiOff,
    title: "Offline Mode",
    desc: "Lost your connection? An offline single-player mode lets kids keep playing solo with AI squadmates.",
    badge: "Accessibility",
    badgeColor: "bg-teal-100 text-teal-700",
    color: "border-teal-200 bg-teal-50",
    iconBg: "bg-teal-500",
    details: ["Full mission library offline", "AI teammate companions", "Progress syncs when back online", "No internet required"],
  },
  {
    icon: Eye,
    title: "Colorblind Modes",
    desc: "Three colorblind modes (Deuteranopia, Protanopia, Tritanopia) ensure every player can distinguish all game elements.",
    badge: "Accessibility",
    badgeColor: "bg-indigo-100 text-indigo-700",
    color: "border-indigo-200 bg-indigo-50",
    iconBg: "bg-indigo-500",
    details: ["3 colorblind presets", "Custom color filters", "High contrast mode", "Icon-only indicators"],
  },
  {
    icon: Type,
    title: "Text Scaling",
    desc: "All text in the game scales from 80% to 150% to support players with visual or reading differences.",
    badge: "Accessibility",
    badgeColor: "bg-violet-100 text-violet-700",
    color: "border-violet-200 bg-violet-50",
    iconBg: "bg-violet-500",
    details: ["5 text size options", "Dyslexia-friendly font option", "Icon + text labels always", "No text-only UI"],
  },
];

export default function Features() {
  return (
    <div className="space-y-10 fade-up">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 border border-purple-200 rounded-full px-4 py-1.5 text-sm font-bold mb-4">
          <Star className="w-4 h-4" />
          Feature Set
        </div>
        <h2 className="display-font text-4xl font-bold text-slate-900 mb-3">Built for Kids. Loved by Families.</h2>
        <p className="text-slate-500 text-lg max-w-2xl">
          Every feature in Mission Mates was designed with one question in mind: does this make the experience safer, more fun, and more accessible for every kid?
        </p>
      </div>

      {/* Feature Grid */}
      <div className="grid md:grid-cols-2 gap-4 stagger">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className={`rounded-2xl border p-6 shadow-sm card-hover ${feature.color}`}
              data-testid={`feature-card-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${feature.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-slate-900">{feature.title}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${feature.badgeColor}`}>
                      {feature.badge}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3 leading-relaxed">{feature.desc}</p>
                  <div className="grid grid-cols-2 gap-1">
                    {feature.details.map((detail) => (
                      <div key={detail} className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <div className="w-1 h-1 rounded-full bg-slate-400 shrink-0" />
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Accessibility Commitment */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl p-8 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="display-font text-xl font-bold mb-2">Our Accessibility Commitment</h3>
            <p className="text-white/85 leading-relaxed max-w-2xl">
              Mission Mates targets WCAG 2.1 AA compliance for all UI. We partner with disability advocacy organizations during development and run accessibility playtesting with kids who have visual, motor, and cognitive differences. Accessibility is not a checkbox — it's how we build.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
