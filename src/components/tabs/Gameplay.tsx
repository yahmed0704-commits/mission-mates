import { Hammer, Compass, HeartPulse, Radar, Wrench, Map, Home, Trophy, Zap, Users } from "lucide-react";

const heroClasses = [
  {
    icon: Hammer,
    name: "Builder",
    tagline: "Stronger together",
    color: "bg-orange-100 border-orange-200",
    iconColor: "text-orange-500",
    badge: "bg-orange-500",
    abilities: ["Construct structures 2× faster", "Repair damaged base tiles", "Lay supply depots for teammates"],
    desc: "Builders are the backbone of every squad. They construct fortifications, repair the Base Camp, and make sure the team always has what it needs.",
  },
  {
    icon: Compass,
    name: "Explorer",
    tagline: "First into the unknown",
    color: "bg-blue-100 border-blue-200",
    iconColor: "text-blue-500",
    badge: "bg-blue-500",
    abilities: ["Reveal hidden map areas", "Move 25% faster across terrain", "Find bonus crystal deposits"],
    desc: "Explorers scout ahead, reveal the map, and locate valuable resources before the rest of the squad arrives.",
  },
  {
    icon: HeartPulse,
    name: "Medic",
    tagline: "Nobody gets left behind",
    color: "bg-green-100 border-green-200",
    iconColor: "text-green-500",
    badge: "bg-green-500",
    abilities: ["Revive teammates in 3 seconds", "Deploy healing beacons", "Share energy boosts with allies"],
    desc: "Medics keep the squad alive and energized, turning near-failures into comeback victories.",
  },
  {
    icon: Radar,
    name: "Scout",
    tagline: "Eyes everywhere",
    color: "bg-purple-100 border-purple-200",
    iconColor: "text-purple-500",
    badge: "bg-purple-500",
    abilities: ["Spot incoming threats early", "Set warning beacons", "Relay information across large maps"],
    desc: "Scouts give the team the information edge — early warnings and threat detection that keep everyone safe.",
  },
  {
    icon: Wrench,
    name: "Engineer",
    tagline: "Making things work better",
    color: "bg-teal-100 border-teal-200",
    iconColor: "text-teal-500",
    badge: "bg-teal-500",
    abilities: ["Upgrade existing structures", "Deploy power relays", "Automate base functions"],
    desc: "Engineers optimize everything around them, turning a functioning base into a well-oiled machine.",
  },
];

const mechanics = [
  {
    icon: Map,
    title: "Mission Board",
    color: "text-pink-500",
    bg: "bg-pink-50 border-pink-200",
    points: [
      "Daily missions — quick 15 min cooperative challenges",
      "Weekly missions — larger goals with bigger Crystal rewards",
      "Seasonal missions — limited-time story events",
      "Emergency missions — surprise squad-wide challenges",
    ],
  },
  {
    icon: Home,
    title: "Base Camp",
    color: "text-orange-500",
    bg: "bg-orange-50 border-orange-200",
    points: [
      "Each squad owns a shared Base Camp",
      "Upgrade rooms with earned Crystals",
      "Decorations are purely cosmetic — no advantage",
      "Higher-tier bases unlock exclusive mission types",
    ],
  },
  {
    icon: Trophy,
    title: "Crystal Economy",
    color: "text-yellow-600",
    bg: "bg-yellow-50 border-yellow-200",
    points: [
      "Crystals earned only through gameplay — never purchased",
      "Spend on Base Camp cosmetics and hero outfits",
      "No Crystal-to-real-money conversion",
      "Weekly Crystal bonus for full squads",
    ],
  },
];

export default function Gameplay() {
  return (
    <div className="space-y-12 fade-up">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 border border-orange-200 rounded-full px-4 py-1.5 text-sm font-bold mb-4">
          <Zap className="w-4 h-4" />
          Core Gameplay Loop
        </div>
        <h2 className="display-font text-4xl font-bold text-slate-900 mb-3">How It Works</h2>
        <p className="text-slate-500 text-lg max-w-2xl">
          Form your squad, pick your hero, accept a mission, complete it together, and upgrade your base. Repeat. Every session is short enough for a school night — big enough to feel like an adventure.
        </p>
      </div>

      {/* Loop Visual */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white">
        <h3 className="display-font text-xl font-bold mb-6 text-white/80 uppercase tracking-wider text-sm">The Game Loop</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { step: "01", title: "Form Squad", desc: "Invite 1–4 friends with friend codes", icon: Users },
            { step: "02", title: "Pick Mission", desc: "Browse the Mission Board together", icon: Map },
            { step: "03", title: "Play", desc: "Complete the mission as a team (15–45 min)", icon: Zap },
            { step: "04", title: "Upgrade", desc: "Spend Crystals on your Base Camp", icon: Home },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="relative">
                <div className="text-5xl font-black text-white/10 absolute top-0 right-0 leading-none">{item.step}</div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-primary/30 border border-primary/50 rounded-xl flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="font-bold text-white mb-1">{item.title}</h4>
                  <p className="text-sm text-white/60">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hero Classes */}
      <div>
        <h2 className="display-font text-2xl font-bold text-slate-900 mb-2">Hero Classes</h2>
        <p className="text-slate-500 mb-6">Every hero brings something different. The best squads use a mix.</p>
        <div className="space-y-4 stagger">
          {heroClasses.map((hero) => {
            const Icon = hero.icon;
            return (
              <div
                key={hero.name}
                className={`rounded-2xl border p-6 shadow-sm card-hover ${hero.color}`}
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-12 h-12 bg-white/70 rounded-xl flex items-center justify-center">
                      <Icon className={`w-6 h-6 ${hero.iconColor}`} />
                    </div>
                    <div>
                      <div className="font-black text-lg text-slate-900">{hero.name}</div>
                      <div className="text-xs font-bold text-slate-500 italic">{hero.tagline}</div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-600 mb-3 leading-relaxed">{hero.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {hero.abilities.map((ability) => (
                        <span
                          key={ability}
                          className="text-xs font-bold bg-white/70 border border-white/80 rounded-lg px-3 py-1 text-slate-700"
                        >
                          {ability}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Mechanics */}
      <div>
        <h2 className="display-font text-2xl font-bold text-slate-900 mb-6">Key Mechanics</h2>
        <div className="grid md:grid-cols-3 gap-4 stagger">
          {mechanics.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.title} className={`rounded-2xl border p-6 shadow-sm ${m.bg}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Icon className={`w-5 h-5 ${m.color}`} />
                  <h3 className="font-bold text-slate-800">{m.title}</h3>
                </div>
                <ul className="space-y-2">
                  {m.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* No PvP Banner */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-start gap-4">
        <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-green-800 mb-1">100% Cooperative — Zero PvP</h3>
          <p className="text-sm text-green-700 leading-relaxed">
            Mission Mates has no player-versus-player modes. Every mechanic is designed around working together, not competing. There are no rankings that pit players against each other, no penalties for being slower than your friends, and no social pressure to "perform." The only enemy is the mission itself.
          </p>
        </div>
      </div>
    </div>
  );
}
