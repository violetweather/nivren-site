import type { Metadata } from "next";

export const metadata: Metadata = { title: "Packages", description: "Official Nivren packages, exact install commands, public APIs, and compatibility guarantees." };
type PackageCard = { name: string; purpose: string; copy: string; api: string };

const groups: PackageCard[][] = [
  [
    { name: "nivren_aead", purpose: "Authenticated encryption", copy: "Opaque zeroized keys and random-nonce ChaCha20-Poly1305 authenticate ciphertext and context before releasing plaintext.", api: "Sealed · import_key · generate_key · seal · seal_with_nonce · unseal" },
    { name: "nivren_aws", purpose: "Cloud authentication", copy: "Explicit canonical inputs and bounded HMAC-SHA-256 derivation produce AWS Signature Version 4 authorization.", api: "Signature · sign_v4" },
    { name: "nivren_columnar", purpose: "Columnar data", copy: "Typed immutable columns enforce unique names, equal row counts, and explicit allocation ceilings.", api: "Column · Table · table · select" },
    { name: "nivren_compression", purpose: "Bounded compression", copy: "Deterministic gzip and zlib encoders pair with mandatory decompression ceilings.", api: "gzip · gunzip · zlib · unzlib · gzip_text · gunzip_text" },
    { name: "nivren_crypto", purpose: "Message authentication", copy: "Bounded SHA-256 fingerprints and constant-time-verified HMAC-SHA-256 provide inspectable protocol building blocks.", api: "fingerprint · sign · verify" },
  ],
  [
    { name: "nivren_discord", purpose: "Discord REST", copy: "Typed message shapes, token-safe headers, and bounded certificate-verified requests provide a practical bot foundation.", api: "Message · message_body · bot_headers · send_message" },
    { name: "nivren_image", purpose: "Raster images", copy: "Bounded RGB images encode and strictly decode canonical binary PPM with checked dimensions, headers, comments, and pixel counts.", api: "Image · image · encode_ppm · decode_ppm" },
    { name: "nivren_testing", purpose: "Deterministic testing", copy: "Typed assertions compose with or give, while channel-backed gates and checkpoints reproduce concurrency order without sleeps.", api: "Gate · expect_equal · expect_yes · expect_no · gate · open · pass · checkpoint" },
    { name: "nivren_routing", purpose: "Pure HTTP routing", copy: "Exact route values and deterministic first-match selection stay independent of sockets.", api: "Route · route · matches · first_match" },
    { name: "nivren_redis", purpose: "Redis protocol", copy: "RESP2/RESP3 framing, verified TLS, AUTH, pools, and MOVED/ASK Cluster redirects pass live Redis 6.2 through 8.8 matrices.", api: "Response · Connection · Pool · Client · open · open_secure · authenticate · pipeline · client · execute" },
    { name: "nivren_sql", purpose: "Parameterized SQL", copy: "Validated identifiers and ordered placeholders construct queries without interpolating values into SQL text.", api: "Query · identifier · select · where_equal" },
  ],
  [
    { name: "nivren_secrets", purpose: "Password storage", copy: "OS-backed random keys and bounded Argon2id v=19 hashes reject hostile parameters before expensive work.", api: "random_key · hash_password · hash_password_with_salt · verify_password" },
    { name: "nivren_validation", purpose: "Structured validation", copy: "Field-aware validation returns an exported Violation shape instead of flattened strings.", api: "Violation · required · positive · range" },
    { name: "nivren_csv", purpose: "Tabular interchange", copy: "Explicit ordered headers, caller-selected ceilings, quoted multiline fields, and canonical CRLF output keep CSV bounded.", api: "decode · encode · decode_with · encode_with · read · write" },
    { name: "nivren_stats", purpose: "Descriptive statistics", copy: "Deterministic scalar statistics provide typed empty-data and zero-range errors.", api: "sum · mean · variance · minimum · maximum · normalize" },
    { name: "nivren_jwt", purpose: "Compact authentication", copy: "Canonical JSON, unpadded base64url, algorithm pinning, and HS256 or Ed25519/EdDSA signatures provide tokens without silently deciding claim policy.", api: "sign_hs256 · verify_hs256 · sign_eddsa · verify_eddsa" },
  ],
  [
    { name: "nivren_matrix", purpose: "Scientific computing", copy: "Checked dense matrices provide bounded indexing, addition, multiplication, and transposition.", api: "Matrix · matrix · at · add · multiply · transpose" },
    { name: "nivren_svg", purpose: "Vector interfaces", copy: "Bounded declarative canvases render deterministic escaped SVG for browser and desktop web-view interfaces.", api: "Canvas · canvas · add · rect · text · render" },
    { name: "nivren_wav", purpose: "Audio interchange", copy: "Canonical PCM16 encoding checks sample range, frame alignment, headers, and payload ceilings.", api: "Audio · encode_pcm16 · decode_pcm16" },
    { name: "nivren_metrics", purpose: "Monitoring export", copy: "Bounded deterministic Prometheus/OpenMetrics exposition keeps counters, gauges, labels, and escaping inspectable.", api: "Sample · sample · encode" },
    { name: "nivren_oidc", purpose: "OpenID Connect", copy: "Authorization-code URLs, S256 PKCE, and explicit issuer, audience, nonce, expiry, and issued-at policy keep identity decisions visible.", api: "Authorization · CoreClaims · pkce_challenge · authorization_url · validate_id_claims" },
    { name: "nivren_trace", purpose: "Distributed tracing", copy: "W3C Trace Context propagation and bounded canonical OTLP/HTTP JSON export keep cross-service traces explicit and caller-authorized.", api: "Context · OtlpAttribute · OtlpSpan · context · fresh · child · parse · traceparent · otlp_span · export_otlp_json" },
  ],
];

function PackageCardView({ item, number }: { item: PackageCard; number: number }) {
  return <article className="example-row">
    <div className="example-copy"><span>{String(number).padStart(2, "0")} · {item.purpose}</span><h2>{item.name}</h2><p>{item.copy}</p><p><strong>Public API:</strong> {item.api}</p></div>
    <div className="example-code"><div><i /><i /><i /><span>install</span></div><pre><code>{`niv add ${item.name} 1.0.0
niv install /path/to/registry

use "@${item.name}"`}</code></pre></div>
  </article>;
}

export default function PackagesPage() {
  let number = 0;
  return <>
    <section className="page-hero compact"><div className="shell"><span className="kicker">Exact, inspectable dependencies</span><h1>Packages</h1><p>The first twenty-two official packages ship as ordinary Nivren source with tests, generated API docs, deterministic archives, and no lifecycle scripts.</p></div></section>
    <div className="shell content-shell example-list">
      {groups.flatMap((group) => group.map((item) => <PackageCardView item={item} number={++number} key={item.name} />))}
      <section className="docs-callout"><span className="kicker">Compatibility</span><h2>Stable means visible.</h2><p>Official packages use semantic versions. Exposed types, capabilities, error shapes, and deterministic behavior are compatibility surface. Every release is rebuilt twice, published to a temporary immutable registry, installed into a clean consumer, and exercised on both Nivren engines before it can ship.</p></section>
    </div>
  </>;
}
