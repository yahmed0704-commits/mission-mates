import { Map, CheckCircle2, Circle, Clock, Rocket, Sparkles } from "lucide-react";

const phases = [
  {
    phase: "Phase 1",
    period: "Q3 2026",
    title: "Core Loop Alpha",
    status: "In Development",
    statusColor: "bg-blue-100 text-blue-700 border-blue-200",
    color: "border-l-blue-500",
    headerBg: "bg-blue-50 border-blue-200",
    milestones: [
      "Core gameplay loop: mission selection, squad play, crystal rewards",
      "3 of 5 hero classes (Builder, Explorer, Medic)",
      "10 starter missions across 2 biomes",
      "Base Camp v1 — room building and basic decoration",
      "Firebase auth with parental consent flow",
      "Internal alpha launch (50 internal testers, families of team members)",
    ],
    deliverable: "Playable internal alpha on iOS TestFlight",
  },
  {
    phase: "Phase 2",
    period: "Q4 2026",
    title: "Safety & Social Beta",
    status: "Planned",
    statusColor: "bg-purple-100 text-purple-700 border-purple-200",
    color: "border-l-purple-500",
    headerBg: "bg-purple-50 border-purple-200",
    milestones: [
      "Safe Chat system — curated phrase library live",
      "Parent Dashboard app (iOS + Android)",
      "Friend code system — no stranger matchmaking",
      "Anti-bullying AI — phase 1 detection model",
      "Beta launch with 500 real families",
      "Bug-fix sprint based on beta feedback",
    ],
    deliverable: "Closed beta with 500 families across US, CA, UK",
  },
  {
    phase: "Phase 3",
    period: "Q1 2027",
    title: "Soft Launch",
    status: "Planned",
    statusColor: "bg-orange-100 text-orange-700 border-orange-200",
    color: "border-l-orange-500",
    headerBg: "bg-orange-50 border-orange-200",
    milestones: [
      "All 5 hero classes (Scout and Engineer added)",
      "25 missions including first seasonal event",
      "Battle Pass v1 — cosmetic-only, $4.99/month",
      "Hero Pack DLC — $2.99 per hero cosmetic set",
      "Family subscription tier — $7.99/month for 5 profiles",
      "iOS App Store + Google Play soft launch (AU, NZ, SG)",
    ],
    deliverable: "App Store launch in 3 English-speaking markets",
  },
  {
    phase: "Phase 4",
    period: "Q2 2027",
    title: "Global Launch",
    status: "Planned",
    statusColor: "bg-green-100 text-green-700 border-green-200",
    color: "border-l-green-500",
    headerBg: "bg-green-50 border-green-200",
    milestones: [
      "PC launch (Windows + Mac via Steam and direct)",
      "Cross-platform play between iOS, Android, and PC",
      "Creator tools: design your own base room layouts",
      "Localization: Spanish, French, Portuguese, German, Japanese",
      "Global launch — all major markets",
      "First major seasonal event (Summer of Missions)",
    ],
    deliverable: "Global launch across iOS, Android, PC in 8+ languages",
  },
  {
    phase: "Phase 5",
    period: "Q3 2027",
    title: "Expansion",
    status: "Future",
    statusColor: "bg-pink-100 text-pink-700 border-pink-200",
    color: "border-l-pink-500",
    headerBg: "bg-pink-50 border-pink-200",
    milestones: [
      "Console ports (Nintendo Switch primary target)",
      "School & education partnerships — curriculum-aligned missions",
      "Mission Mates Jr. — simplified version for ages 4–6",
      "Community Mission Builder — kids design missions for others",
      "Live concert / community event (in-game)",
    ],
    deliverable: "Console launch + education channel",
  },
];

const statusIconMap: Record<string, typeof CheckCircle2> = {
  "In Development": Clock,
  "Planned": Circle,
  "Future": Sparkles,
};

export default function Roadmap() {
  return (
    <div className="space-y-10 fade-up">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 border border-pink-200 rounded-full px-4 py-1.5 text-sm font-bold mb-4">
          <Map className="w-4 h-4" />
          Development Roadmap
        </div>
        <h2 className="display-font text-4xl font-bold text-slate-900 mb-3">From Alpha to Global Launch</h2>
        <p className="text-slate-500 text-lg max-w-2xl">
          A 12-month roadmap from internal alpha to global launch, with safety and family feedback built into every phase.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200 hidden md:block" />

        <div className="space-y-6 stagger">
          {phases.map((phase, i) => {
            const StatusIcon = statusIconMap[phase.status] || Circle;
            return (
              <div key={phase.phase} className="relative md:pl-16">
                {/* Timeline dot */}
                <div className={`absolute left-3.5 top-6 w-5 h-5 rounded-full border-2 border-white shadow-sm hidden md:flex items-center justify-center ${
                  phase.status === "In Development" ? "bg-blue-500" :
                  phase.status === "Planned" ? "bg-slate-300" : "bg-pink-300"
                }`}>
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>

                <div className={`rounded-2xl border shadow-sm overflow-hidden border-l-4 ${phase.color}`}>
                  {/* Phase header */}
                  <div className={`px-6 py-4 border-b ${phase.headerBg} flex flex-wrap items-center justify-between gap-3`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider">{phase.phase}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="font-black text-slate-800">{phase.period}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <h3 className="font-bold text-slate-700">{phase.title}</h3>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${phase.statusColor}`}>
                      <StatusIcon className="w-3 h-3" />
                      {phase.status}
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="bg-white px-6 py-5">
                    <div className="grid md:grid-cols-2 gap-2 mb-4">
                      {phase.milestones.map((milestone) => (
                        <div key={milestone} className="flex items-start gap-2.5 text-sm text-slate-600">
                          <Rocket className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                          {milestone}
                        </div>
                      ))}
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider mr-2">Key Deliverable</span>
                      <span className="text-sm font-semibold text-slate-700">{phase.deliverable}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Principle */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white flex items-start gap-4">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold mb-2">Principle: Safety Before Scale</h3>
          <p className="text-white/85 text-sm leading-relaxed">
            Every phase gate requires a successful safety review before moving forward. We won't rush a phase to hit a date. If Phase 2's safety systems don't pass family testing, Phase 3 does not launch. User trust is more valuable than launch timing.
          </p>
        </div>
      </div>
    </div>
  );
}
