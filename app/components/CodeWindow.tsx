import { highlightSyntax } from "./SyntaxCode";

export function CodeWindow({ filename, code }: { filename: string; code: string }) {
  const highlighted = code.split("\n").map((line, index) => (
    <div className="code-line" key={`${index}-${line}`}>
      <span className="line-number">{String(index + 1).padStart(2, "0")}</span>
      <span>{highlightSyntax(line)}</span>
    </div>
  ));
  return (
    <div className="code-window">
      <div className="code-bar"><div className="traffic"><i /><i /><i /></div><span>{filename}</span><span className="code-status">● checked</span></div>
      <pre aria-label={`${filename} source code`}><code>{highlighted}</code></pre>
    </div>
  );
}
