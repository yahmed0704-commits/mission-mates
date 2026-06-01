import { Cpu, Database, Cloud, Smartphone, GitBranch, FlaskConical, Layers, Server, Wifi, BrainCircuit } from "lucide-react";

const stackSections = [
  {
    icon: Cpu,
    title: "Game Engine",
    color: "bg-blue-500",
    bg: "bg-blue-50 border-blue-200",
    items: [
      {
        name: "Unity",
        version: "2023 LTS",
        role: "Cross-platform game engine",
        desc: "Chosen for its mature mobile pipeline, strong asset store, and proven iOS/Android/PC support in a single codebase.",
      },
      {
        name: "C# (.NET 7)",
        version: "7.0",
        role: "Primary scripting language",
        desc: "All game logic, hero abilities, mission systems, and base-building mechanics written in strict, XML-documented C#.",
      },
    ],
  },
  {
    icon: Wifi,
    title: "Multiplayer Networking",
    color: "bg-purple-500",
    bg: "bg-purple-50 border-purple-200",
    items: [
      {
        name: "Photon Fusion",
        version: "2.0",
        role: "State sync & multiplayer framework",
        desc: "Server-authoritative networking model ensures fair play. State prediction for smooth movement, lag compensation for ability hits.",
      },
      {
        name: "AWS GameLift",
        version: "—",
        role: "Matchmaking & dedicated servers",
        desc: "Managed game server hosting with automatic fleet scaling. Regions: US-East, EU-West, AP-Southeast. Target p95 latency < 80ms.",
      },
    ],
  },
  {
    icon: Database,
    title: "Backend Services",
    color: "bg-orange-500",
    bg: "bg-orange-50 border-orange-200",
    items: [
      {
        name: "Firebase",
        version: "—",
        role: "Auth, real-time DB, push notifications",
        desc: "Firebase Auth for account management (parental consent flow), Firestore for real-time squad state, FCM for push notifications.",
      },
      {
        name: "PostgreSQL",
        version: "16",
        role: "Player & mission data",
        desc: "Persistent storage for player profiles, base camp state, mission history, and achievement records. Hosted on AWS RDS.",
      },
      {
        name: "Redis",
        version: "7.x",
        role: "Session cache & leaderboards",
        desc: "In-memory cache for active sessions, real-time squad state, and the Crystal leaderboard. Elasticache cluster on AWS.",
      },
    ],
  },
  {
    icon: Server,
    title: "API Layer",
    color: "bg-teal-500",
    bg: "bg-teal-50 border-teal-200",
    items: [
      {
        name: "Node.js + Express",
        version: "Node 22 LTS",
        role: "REST API server",
        desc: "Handles player account CRUD, mission board generation, Crystal transactions, and friend-code operations. Deployed on AWS ECS Fargate.",
      },
      {
        name: "Zod",
        version: "3.x",
        role: "Request/response validation",
        desc: "All API inputs and outputs validated with Zod schemas. OpenAPI spec auto-generated and kept in sync with the implementation.",
      },
    ],
  },
  {
    icon: Smartphone,
    title: "Parent Dashboard App",
    color: "bg-pink-500",
    bg: "bg-pink-50 border-pink-200",
    items: [
      {
        name: "React Native (Expo)",
        version: "SDK 54",
        role: "Cross-platform companion app",
        desc: "Parent Dashboard companion app for iOS and Android. Parents manage accounts, approve friends, set time limits, and view reports.",
      },
      {
        name: "React (Web)",
        version: "19",
        role: "Web companion portal",
        desc: "Web version of the Parent Dashboard for desktop browsers — same functionality as the app, accessible at parents.missionmates.gg.",
      },
    ],
  },
  {
    icon: BrainCircuit,
    title: "Safety & Moderation",
    color: "bg-green-500",
    bg: "bg-green-50 border-green-200",
    items: [
      {
        name: "Custom Moderation AI",
        version: "—",
        role: "Behavior pattern detection",
        desc: "Fine-tuned ML model trained on child gaming interaction data to detect exclusion, coordinated bullying, and grooming patterns — even within pre-approved phrase sets.",
      },
      {
        name: "Amazon Rekognition",
        version: "—",
        role: "Screenshot/image review",
        desc: "All user-uploaded base camp images (custom banners, profile pictures) screened by Amazon Rekognition before being visible to others.",
      },
    ],
  },
];

const devTools = [
  { name: "GitHub Actions", role: "CI/CD pipeline" },
  { name: "TestFlight", role: "iOS beta distribution" },
  { name: "Google Play Internal", role: "Android beta distribution" },
  { name: "Jest + React Testing Library", role: "Unit & integration tests" },
  { name: "Unity PlayMode Tests", role: "In-engine test suite" },
  { name: "Appium", role: "Mobile E2E testing" },
  { name: "Datadog", role: "Monitoring & alerting" },
  { name: "Sentry", role: "Error tracking (game + API)" },
];

export default function TechStack() {
  return (
    <div className="space-y-10 fade-up">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-full px-4 py-1.5 text-sm font-bold mb-4">
          <Cpu className="w-4 h-4" />
          Technology Architecture
        </div>
        <h2 className="display-font text-4xl font-bold text-slate-900 mb-3">Built to Scale with Kids</h2>
        <p className="text-slate-500 text-lg max-w-2xl">
          A battle-tested, cloud-native stack designed to handle 500K+ concurrent players, keep latency under 80ms globally, and keep every data point about minors completely secure.
        </p>
      </div>

      {/* Architecture Diagram — simplified visual */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-2 mb-6">
          <Layers className="w-5 h-5 text-slate-400" />
          <h3 className="font-bold text-slate-300 uppercase text-sm tracking-wider">System Architecture</h3>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          {[
            { label: "Clients", items: ["Unity (iOS/Android/PC)", "React Native (Parent App)"], color: "bg-blue-900/60 border-blue-700" },
            { label: "API Gateway", items: ["AWS API Gateway", "Node.js/Express", "Zod Validation"], color: "bg-purple-900/60 border-purple-700" },
            { label: "Data Layer", items: ["PostgreSQL (RDS)", "Redis (Elasticache)", "Firebase Firestore"], color: "bg-orange-900/60 border-orange-700" },
          ].map((col) => (
            <div key={col.label} className={`rounded-xl border p-4 ${col.color}`}>
              <div className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">{col.label}</div>
              {col.items.map((item) => (
                <div key={item} className="text-white/80 text-xs py-1 border-b border-white/10 last:border-0">{item}</div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-center text-sm">
          {[
            { label: "Game Servers", items: ["AWS GameLift Fleet", "Photon Fusion 2.0", "Server-Authoritative"], color: "bg-teal-900/60 border-teal-700" },
            { label: "Safety Layer", items: ["Custom Moderation AI", "Amazon Rekognition", "Human Review Queue"], color: "bg-green-900/60 border-green-700" },
          ].map((col) => (
            <div key={col.label} className={`rounded-xl border p-4 ${col.color}`}>
              <div className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">{col.label}</div>
              {col.items.map((item) => (
                <div key={item} className="text-white/80 text-xs py-1 border-b border-white/10 last:border-0">{item}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Stack Sections */}
      <div className="space-y-4 stagger">
        {stackSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className={`rounded-2xl border p-6 shadow-sm ${section.bg}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-8 h-8 ${section.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-slate-800">{section.title}</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {section.items.map((item) => (
                  <div key={item.name} className="bg-white/70 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                      {item.version !== "—" && (
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-semibold">{item.version}</span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{item.role}</div>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dev Tooling */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <GitBranch className="w-5 h-5 text-slate-600" />
          <h3 className="font-bold text-slate-800">Dev Toolchain</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {devTools.map((tool) => (
            <div key={tool.name} className="bg-slate-50 rounded-xl p-3">
              <div className="font-bold text-sm text-slate-800 mb-0.5">{tool.name}</div>
              <div className="text-xs text-slate-500">{tool.role}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Targets */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-6 text-white">
        <h3 className="font-bold mb-4">Performance Targets</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Server Tick Rate", value: "20 Hz" },
            { label: "p95 Latency", value: "< 80ms" },
            { label: "Target Uptime", value: "99.9%" },
            { label: "Concurrent Players", value: "500K+" },
          ].map((t) => (
            <div key={t.label} className="text-center">
              <div className="display-font text-3xl font-bold">{t.value}</div>
              <div className="text-white/70 text-xs mt-1 font-semibold">{t.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
