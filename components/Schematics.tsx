/* Hand-drawn-feeling line schematics. All decorative; aria-hidden.
   Paths use pathLength=1 so CSS can draw them on reveal. */

function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  accent = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="2"
        pathLength={1}
        className={`schem__shape ${accent ? "schem__shape--accent" : ""}`}
      />
      <text x={x + w / 2} y={y + h / 2 + (sub ? -4 : 1)} className="schem__label" textAnchor="middle" dominantBaseline="middle">
        {label}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h / 2 + 12} className="schem__sub" textAnchor="middle" dominantBaseline="middle">
          {sub}
        </text>
      )}
    </g>
  );
}

function Flow({ d }: { d: string }) {
  return (
    <>
      <path d={d} pathLength={1} className="schem__wire" />
      <path d={d} className="schem__pulse" />
    </>
  );
}

/* Asterix → OSCAR → AI Command Center */
export function StackSchematic() {
  return (
    <svg viewBox="0 0 640 260" className="schem" aria-hidden="true" focusable="false">
      <Box x={40} y={170} w={170} h={54} label="ASTERIX" sub="memory framework" />
      <Box x={250} y={90} w={150} h={54} label="OSCAR" sub="the agent" />
      <Box x={450} y={20} w={160} h={54} label="AI COMMAND" sub="CENTER — the meter" accent />
      {/* asterix feeds oscar */}
      <Flow d="M 125 170 L 125 117 L 250 117" />
      {/* oscar routes through the gateway */}
      <Flow d="M 400 117 L 530 117 L 530 74" />
      {/* annotations */}
      <text x={130} y={140} className="schem__note">
        remembers
      </text>
      <text x={410} y={140} className="schem__note">
        every token metered
      </text>
      <text x={40} y={250} className="schem__note">
        pip install asterix-agent · pip install oscar-agent · npx ai-command-center
      </text>
    </svg>
  );
}

export function GatewaySchematic() {
  return (
    <svg viewBox="0 0 640 220" className="schem" aria-hidden="true" focusable="false">
      <Box x={20} y={20} w={130} h={44} label="your app" sub="any language" />
      <Box x={20} y={88} w={130} h={44} label="your agent" />
      <Box x={20} y={156} w={130} h={44} label="your pipeline" />
      <Box x={255} y={88} w={150} h={44} label="GATEWAY" sub="0 deps · 0.21ms" accent />
      <Box x={490} y={20} w={130} h={44} label="OpenAI" />
      <Box x={490} y={88} w={130} h={44} label="Anthropic" />
      <Box x={490} y={156} w={130} h={44} label="9+ more" />
      <Flow d="M 150 42 L 200 42 L 200 110 L 255 110" />
      <Flow d="M 150 110 L 255 110" />
      <Flow d="M 150 178 L 200 178 L 200 110 L 255 110" />
      <Flow d="M 405 110 L 440 110 L 440 42 L 490 42" />
      <Flow d="M 405 110 L 490 110" />
      <Flow d="M 405 110 L 440 110 L 440 178 L 490 178" />
      <text x={258} y={155} className="schem__note">
        one base-URL change
      </text>
    </svg>
  );
}

export function VoiceSchematic() {
  return (
    <svg viewBox="0 0 640 200" className="schem" aria-hidden="true" focusable="false">
      <Box x={20} y={78} w={110} h={44} label="caller" sub="11 languages" />
      <Box x={185} y={78} w={110} h={44} label="ASR" sub="Sarvam Saaras" />
      <Box x={350} y={78} w={110} h={44} label="AGENT" sub="Gemini Live + RAG" accent />
      <Box x={515} y={78} w={105} h={44} label="TTS" sub="Sarvam Bulbul" />
      <Flow d="M 130 100 L 185 100" />
      <Flow d="M 295 100 L 350 100" />
      <Flow d="M 460 100 L 515 100" />
      <Flow d="M 567 122 C 567 180 80 180 75 122" />
      <text x={185} y={50} className="schem__note">
        language auto-detected
      </text>
      <text x={250} y={172} className="schem__note">
        speech back to the caller
      </text>
    </svg>
  );
}

export function AgentSchematic() {
  return (
    <svg viewBox="0 0 640 210" className="schem" aria-hidden="true" focusable="false">
      <Box x={20} y={80} w={120} h={44} label="instruction" />
      <Box x={195} y={80} w={120} h={44} label="PLAN" sub="ReAct loop" />
      <Box x={370} y={80} w={120} h={44} label="CONFIRM" sub="risk-tiered" accent />
      <Box x={500} y={80} w={120} h={44} label="EXECUTE" sub="15 tools" />
      <Flow d="M 140 102 L 195 102" />
      <Flow d="M 315 102 L 370 102" />
      <Flow d="M 490 102 L 500 102" />
      <text x={368} y={60} className="schem__note">
        dangerous ops stop here — 100% (20/20)
      </text>
      <text x={200} y={170} className="schem__note">
        low risk auto-approves · medium/high/dangerous wait for a human
      </text>
    </svg>
  );
}

export function MemorySchematic() {
  return (
    <svg viewBox="0 0 640 220" className="schem" aria-hidden="true" focusable="false">
      <Box x={40} y={30} w={200} h={60} label="MEMORY BLOCKS" sub="sized · prioritized · self-edited" accent />
      <Box x={40} y={130} w={200} h={60} label="ARCHIVAL" sub="Qdrant semantic recall" />
      <Box x={400} y={80} w={200} h={60} label="AGENT" sub="survives restart" />
      <Flow d="M 240 60 L 320 60 L 320 100 L 400 100" />
      <Flow d="M 240 160 L 320 160 L 320 120 L 400 120" />
      <text x={250} y={40} className="schem__note">
        in-context
      </text>
      <text x={250} y={200} className="schem__note">
        save_state() → SQLite · load_state() → restored
      </text>
    </svg>
  );
}

export function CaseSchematic({ kind }: { kind: "gateway" | "voice" | "agent" | "memory" }) {
  switch (kind) {
    case "gateway":
      return <GatewaySchematic />;
    case "voice":
      return <VoiceSchematic />;
    case "agent":
      return <AgentSchematic />;
    case "memory":
      return <MemorySchematic />;
  }
}
