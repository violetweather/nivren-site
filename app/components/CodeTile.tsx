import { SyntaxCode, type SyntaxLanguage } from "./SyntaxCode";

export function CodeTile({
  label,
  title,
  code,
  language = "nivren",
  size = "one",
}: {
  label: string;
  title: string;
  code: string;
  language?: SyntaxLanguage;
  size?: "one" | "wide" | "tall";
}) {
  return (
    <article className={`tile tile-${size}`}>
      <div className="tile-head">
        <span className="tile-label">{label}</span>
        <h3>{title}</h3>
      </div>
      <pre tabIndex={0} aria-label={`${title} sample`}>
        <SyntaxCode code={code} language={language} />
      </pre>
    </article>
  );
}
