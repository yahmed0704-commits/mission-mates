import { Code2, GitBranch, CheckCircle2, Shield, Mail, Folder, Terminal, BookOpen, FlaskConical, Users } from "lucide-react";

const repoStructure = [
  { name: "client/", desc: "Unity game client (C#)" },
  { name: "client/Assets/Scripts/", desc: "All game logic scripts" },
  { name: "client/Assets/Scripts/Heroes/", desc: "Hero class ability systems" },
  { name: "client/Assets/Scripts/Missions/", desc: "Mission loading and evaluation" },
  { name: "client/Assets/Scripts/BaseCamp/", desc: "Base Camp building system" },
  { name: "api/", desc: "Node.js/Express REST API" },
  { name: "api/src/routes/", desc: "Express route handlers" },
  { name: "api/src/services/", desc: "Business logic layer" },
  { name: "api/src/schema/", desc: "Zod validation schemas" },
  { name: "parent-app/", desc: "React Native Parent Dashboard" },
  { name: "parent-app/src/screens/", desc: "App screens" },
  { name: "parent-app/src/components/", desc: "Shared UI components" },
  { name: "infra/", desc: "AWS CDK infrastructure as code" },
  { name: "docs/", desc: "Architecture docs and ADRs" },
];

const branchStrategy = [
  { branch: "main", desc: "Production code — always deployable", color: "text-green-600 bg-green-50 border-green-200" },
  { branch: "develop", desc: "Integration branch — merges from features", color: "text-blue-600 bg-blue-50 border-blue-200" },
  { branch: "feature/*", desc: "Short-lived feature branches from develop", color: "text-purple-600 bg-purple-50 border-purple-200" },
  { branch: "hotfix/*", desc: "Critical production fixes branched from main", color: "text-red-600 bg-red-50 border-red-200" },
  { branch: "release/*", desc: "Release prep branches before merging to main", color: "text-orange-600 bg-orange-50 border-orange-200" },
];

const prRequirements = [
  "Minimum 2 reviewer approvals (at least 1 from domain owner)",
  "All CI checks passing (lint, typecheck, unit tests)",
  "No TypeScript `any` usage without explicit justification comment",
  "Unity PlayMode tests passing for changed systems",
  "Security review required for any auth or data-handling changes",
  "PR description must include: what changed, why, how to test",
  "Screenshots / screen recordings for any UI changes",
];

const codeStandards = [
  {
    lang: "TypeScript (API + Parent App)",
    icon: Code2,
    rules: [
      "strict: true in tsconfig — no exceptions",
      "No any without // eslint-disable-next-line comment explaining why",
      "All Zod schemas defined in api/src/schema/",
      "Async route handlers wrapped in try/catch",
      "Every exported function has a JSDoc comment",
    ],
  },
  {
    lang: "C# (Unity Client)",
    icon: Terminal,
    rules: [
      "Nullable reference types enabled (#nullable enable)",
      "XML doc comments on all public APIs",
      "No MonoBehaviour.Update() — use event-driven patterns",
      "Hero abilities implement IHeroAbility interface",
      "Unit tests in PlayMode for all mission evaluation logic",
    ],
  },
];

const testingStrategy = [
  { tool: "Jest", scope: "API unit & integration tests", coverage: "80% line coverage minimum" },
  { tool: "React Testing Library", scope: "Parent App component tests", coverage: "All interactive components" },
  { tool: "Unity PlayMode Tests", scope: "Game logic: missions, heroes, base camp", coverage: "All game systems" },
  { tool: "Appium", scope: "Mobile E2E — key user flows", coverage: "Critical paths: auth, friend code, mission complete" },
];

const contacts = [
  { role: "Engineering Lead", name: "TBD", email: "eng-lead@missionmates.gg" },
  { role: "Game Design Lead", name: "TBD", email: "design@missionmates.gg" },
  { role: "Safety & Trust", name: "TBD", email: "safety@missionmates.gg" },
  { role: "Backend / Infra", name: "TBD", email: "backend@missionmates.gg" },
];

export default function DevGuide() {
  return (
    <div className="space-y-10 fade-up">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 border border-teal-200 rounded-full px-4 py-1.5 text-sm font-bold mb-4">
          <Code2 className="w-4 h-4" />
          Developer Guide
        </div>
        <h2 className="display-font text-4xl font-bold text-slate-900 mb-3">Welcome to the Team</h2>
        <p className="text-slate-500 text-lg max-w-2xl">
          Everything you need to start contributing — repo structure, coding standards, branching strategy, and who to ask when you're stuck.
        </p>
      </div>

      {/* Quick Start */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-2 mb-4">
          <Terminal className="w-5 h-5 text-slate-400" />
          <h3 className="font-bold text-slate-300 uppercase text-sm tracking-wider">Quick Start</h3>
        </div>
        <div className="space-y-3">
          {[
            { comment: "# Clone the repo", cmd: "git clone git@github.com:missionmates/missionmates.git" },
            { comment: "# Install API dependencies", cmd: "cd api && pnpm install" },
            { comment: "# Copy environment config", cmd: "cp .env.example .env.local" },
            { comment: "# Start the API server in dev mode", cmd: "pnpm dev" },
            { comment: "# Open Unity client", cmd: "Open client/ folder in Unity Hub (Unity 2023 LTS)" },
          ].map((line, i) => (
            <div key={i} className="font-mono text-sm">
              <span className="text-slate-500">{line.comment}</span>
              <br />
              <span className="text-green-400">{line.cmd}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Repo Structure */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Folder className="w-5 h-5 text-slate-500" />
          <h3 className="font-bold text-slate-700">Repository Structure</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-2">
          {repoStructure.map((item) => (
            <div key={item.name} className="flex gap-3 py-1.5 border-b border-slate-100 last:border-0">
              <code className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded shrink-0">{item.name}</code>
              <span className="text-xs text-slate-500">{item.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Branch Strategy */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <GitBranch className="w-5 h-5 text-slate-500" />
          <h3 className="font-bold text-slate-700">Branching Strategy</h3>
        </div>
        <div className="space-y-2 stagger">
          {branchStrategy.map((b) => (
            <div key={b.branch} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${b.color}`}>
              <code className="font-mono font-bold text-sm shrink-0">{b.branch}</code>
              <span className="text-sm opacity-80">{b.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PR Requirements */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <h3 className="font-bold text-slate-700">PR Requirements</h3>
        </div>
        <ul className="space-y-2">
          {prRequirements.map((req) => (
            <li key={req} className="flex items-start gap-2.5 text-sm text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
              {req}
            </li>
          ))}
        </ul>
      </div>

      {/* Code Standards */}
      <div className="grid md:grid-cols-2 gap-4">
        {codeStandards.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.lang} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-slate-500" />
                <h3 className="font-bold text-slate-700 text-sm">{section.lang}</h3>
              </div>
              <ul className="space-y-2">
                {section.rules.map((rule) => (
                  <li key={rule} className="flex items-start gap-2 text-xs text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Testing Strategy */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FlaskConical className="w-5 h-5 text-slate-500" />
          <h3 className="font-bold text-slate-700">Testing Strategy</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {testingStrategy.map((t) => (
            <div key={t.tool} className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div className="font-bold text-slate-800 mb-1">{t.tool}</div>
              <div className="text-xs text-slate-500 mb-1">{t.scope}</div>
              <div className="inline-flex items-center gap-1 text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                {t.coverage}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Review */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-700 mb-2">Safety-Sensitive Code</h3>
            <p className="text-sm text-red-600 leading-relaxed mb-3">
              Any code that touches <strong>chat filtering, friend connections, content moderation, parental controls, or age-gating</strong> requires a mandatory safety review from the Trust & Safety team before merging — even if all other PR requirements are met.
            </p>
            <p className="text-xs text-red-500 font-semibold">
              Tag your PR with the <code className="bg-red-100 px-1 rounded">safety-review-required</code> label to trigger the workflow.
            </p>
          </div>
        </div>
      </div>

      {/* Contacts */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-slate-500" />
          <h3 className="font-bold text-slate-700">Team Contacts</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {contacts.map((c) => (
            <div key={c.role} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold">{c.role}</div>
                <div className="text-sm font-bold text-slate-700">{c.name !== "TBD" ? c.name : <span className="italic text-slate-400">Hiring</span>}</div>
                <div className="text-xs text-primary font-medium">{c.email}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Docs */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-6 text-white flex items-start gap-4">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold mb-1">Full Documentation</h3>
          <p className="text-white/80 text-sm leading-relaxed">
            Architecture Decision Records (ADRs), API reference docs, and onboarding guides live in the <code className="bg-white/20 px-1 rounded">docs/</code> folder. Start with <code className="bg-white/20 px-1 rounded">docs/ONBOARDING.md</code> — it links to everything else you need for your first week.
          </p>
        </div>
      </div>
    </div>
  );
}
