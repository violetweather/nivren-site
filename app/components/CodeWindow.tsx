export function CodeWindow({ filename, code }: { filename: string; code: string }) {
  const highlighted = code.split("\n").map((line, index) => (
    <div className="code-line" key={`${index}-${line}`}>
      <span className="line-number">{String(index + 1).padStart(2, "0")}</span>
      <span>{highlight(line)}</span>
    </div>
  ));
  return (
    <div className="code-window">
      <div className="code-bar"><div className="traffic"><i /><i /><i /></div><span>{filename}</span><span className="code-status">● checked</span></div>
      <pre aria-label={`${filename} source code`}><code>{highlighted}</code></pre>
    </div>
  );
}

function highlight(line: string) {
  const parts = line.split(/(\b(?:keep|change|define|gives|each|within|give|show|String|Int)\b|"[^"]*"|\/\/.*)/g);
  return parts.map((part, index) => {
    if (/^(keep|change|define|gives|each|within|give|show)$/.test(part)) return <span className="syn-keyword" key={index}>{part}</span>;
    if (/^(String|Int)$/.test(part)) return <span className="syn-type" key={index}>{part}</span>;
    if (part.startsWith('"')) return <span className="syn-string" key={index}>{part}</span>;
    if (part.startsWith("//")) return <span className="syn-comment" key={index}>{part}</span>;
    return part;
  });
}
