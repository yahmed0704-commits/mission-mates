import { Rocket, Users, Globe, Shield, Trophy, Heart, Star, Zap } from "lucide-react";

const pillars = [
  {
    icon: Users,
    title: "Cooperation First",
    desc: "Every mission is designed for teamwork. No solo grinding, no leaderboards that pit kids against each other.",
    color: "bg-blue-100 text-blue-600 border-blue-200",
  },
  {
    icon: Shield,
    title: "Safety by Design",
    desc: "No free-text chat, no strangers, full parental controls baked in from day one — not bolted on after launch.",
    color: "bg-green-100 text-green-600 border-green-200",
  },
  {
    icon: Heart,
    title: "Ethical Monetization",
    desc: "Cosmetics only. No loot boxes, no pay-to-win, no ads. Kids earn crystals by playing, not by spending.",
    color: "bg-pink-100 text-pink-600 border-pink-200",
  },
  {
    icon: Zap,
    title: "Creative Expression",
    desc: "Build, decorate, and personalize your squad's Base Camp. Every team's home is uniquely theirs.",
    color: "bg-yellow-100 text-yellow-600 border-yellow-200",
  },
];

const stats = [
  { label: "Target Age Range", value: "6–14", sub: "years old" },
  { label: "Squad Size", value: "2–5", sub: "players" },
  { label: "Launch Platforms", value: "3", sub: "iOS · Android · PC" },
  { label: "Hero Classes", value: "5", sub: "unique roles" },
];

export default function Overview() {
  return (
    <div className="space-y-12 fade-up">
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden hero-gradient animated-gradient p-10 md:p-16 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 text-sm font-bold mb-6">
            <Star className="w-4 h-4 fill-white" />
            Game Design Document — v1.0
          </div>
          <h1 className="display-font text-5xl md:text-6xl font-bold leading-tight mb-4">
            Mission Mates
          </h1>
          <p className="text-xl md:text-2xl font-semibold text-white/90 mb-2">
            Team Up. Build Together. Save the Day.
          </p>
          <p className="text-base text-white/75 max-w-lg leading-relaxed">
            A cooperative multiplayer adventure game for kids ages 6–14. Squad up with friends, complete missions, upgrade your Base Camp, and prove that the best power-up is teamwork.
          </p>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 right-24 w-48 h-48 bg-white/10 rounded-full translate-y-1/2" />
        <div className="absolute top-1/2 right-12 w-24 h-24 bg-white/15 rounded-full -translate-y-1/2" />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm card-hover"
          >
            <div className="display-font text-4xl font-bold text-primary mb-1">{stat.value}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.sub}</div>
            <div className="text-sm font-semibold text-slate-700 mt-2">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* What Is Mission Mates */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <Rocket className="w-5 h-5 text-primary" />
          </div>
          <h2 className="display-font text-2xl font-bold text-slate-900">What Is Mission Mates?</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 text-slate-600 leading-relaxed">
          <div className="space-y-4">
            <p>
              Mission Mates is a <strong className="text-slate-800">cooperative multiplayer adventure game</strong> where squads of 2–5 players work together to complete missions, protect their community, and build the ultimate Base Camp.
            </p>
            <p>
              Players choose from five distinct Hero Classes — Builder, Explorer, Medic, Scout, or Engineer — each with unique abilities that make the team stronger when combined. No hero can do it alone.
            </p>
          </div>
          <div className="space-y-4">
            <p>
              Every day brings new missions on the Mission Board: rescue a stranded squad, repair the town's power grid, defend the base from a storm. Completing missions earns XP and Crystals — the game's currency that can only be earned, never purchased.
            </p>
            <p>
              Mission Mates is <strong className="text-slate-800">built for families</strong>. Safe chat, parental controls, no ads, no loot boxes, and no pay-to-win mechanics — ever.
            </p>
          </div>
        </div>
      </div>

      {/* Core Pillars */}
      <div>
        <h2 className="display-font text-2xl font-bold text-slate-900 mb-6">Core Pillars</h2>
        <div className="grid md:grid-cols-2 gap-4 stagger">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className={`rounded-2xl border p-6 shadow-sm card-hover ${pillar.color}`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/60 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{pillar.title}</h3>
                    <p className="text-sm opacity-80 leading-relaxed">{pillar.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform & Audience */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-slate-800">Platforms</h3>
          </div>
          <div className="space-y-2">
            {["iOS (iPhone & iPad)", "Android (Phone & Tablet)", "PC (Windows & Mac)"].map((p) => (
              <div key={p} className="flex items-center gap-2 text-sm text-slate-600">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                {p}
              </div>
            ))}
            <p className="text-xs text-slate-400 mt-3 font-medium">Cross-platform play between all devices</p>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <h3 className="font-bold text-slate-800">Target Audience</h3>
          </div>
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-400" />Primary: Ages 6–14</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-300" />Secondary: Families playing together</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-200" />Educators & after-school programs</div>
          </div>
          <p className="text-xs text-slate-400 mt-3 font-medium">COPPA compliant · ESRB E10+ target rating</p>
        </div>
      </div>
    </div>
  );
}
