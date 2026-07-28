export type SyntaxLanguage = "nivren" | "shell" | "powershell" | "json" | "output";

export function SyntaxCode({ code, language = "nivren" }: { code: string; language?: SyntaxLanguage }) {
  return <code className={`syntax-code language-${language}`}>{highlightSyntax(code, language)}</code>;
}

export function highlightSyntax(code: string, language: SyntaxLanguage = "nivren") {
  return code.split(patterns[language]).filter(Boolean).map((token, index) => {
    const tokenClass = classify(token, language);
    return tokenClass ? <span className={tokenClass} key={`${index}-${token}`}>{token}</span> : token;
  });
}

const keywords = /^(?:keep|change|set|define|takes|gives|needs|within|give|when|otherwise|each|repeat|choose|case|carries|shape|choice|type|from|holds|with|prepare|perform|through|using|start|wait|cancel|use|as|or|and|not|in)$/;
const types = /^(?:String|Int|I64|U64|Float|Bool|Bytes|List|Map|Set|Result|Problem|FileRead|FileWrite|Network|Process|Json|Compare|Display|Key|Validate|Binary|DatabaseRow|Arguments)$/;
const commands = /^(?:niv|npm|node|cargo|git|gh|curl|sh|bash|cd|export|docker|npx|pnpm|yarn|brew|winget|chmod|tar|unzip)$/;

const patterns: Record<SyntaxLanguage, RegExp> = {
  nivren: /(\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:keep|change|set|define|takes|gives|needs|within|give|when|otherwise|each|repeat|choose|case|carries|shape|choice|type|from|holds|with|prepare|perform|through|using|start|wait|cancel|use|as|or|and|not|in)\b|\b(?:String|Int|I64|U64|Float|Bool|Bytes|List|Map|Set|Result|Problem|FileRead|FileWrite|Network|Process|Json|Compare|Display|Key|Validate|Binary|DatabaseRow|Arguments)\b|\b(?:true|false|none|maybe)\b|\b\d+(?:\.\d+)?\b|(?:=>|->|==|!=|<=|>=|\+|-|\*|\/|=|<|>|\||&)|[{}[\](),.:])/g,
  shell: /(#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|https?:\/\/[^\s]+|\$\{?[A-Za-z_][A-Za-z0-9_]*\}?|--?[A-Za-z][\w-]*|\b(?:niv|npm|node|cargo|git|gh|curl|sh|bash|cd|export|docker|npx|pnpm|yarn|brew|winget|chmod|tar|unzip)\b|\b\d+(?:\.\d+)?\b|(?:&&|\|\||\||>|<|=)|[{}[\](),])/g,
  powershell: /(<#[\s\S]*?#>|#[^\n]*|"(?:`.|[^"`])*"|'(?:''|[^'])*'|https?:\/\/[^\s]+|\$[A-Za-z_][A-Za-z0-9_:]*|-[A-Za-z][\w-]*|\b(?:Invoke-WebRequest|Set-ExecutionPolicy|Get-FileHash|Join-Path|Copy-Item|New-Item|Remove-Item|if|else|foreach|throw|true|false|null)\b|\.\\[\w.-]+|\b\d+(?:\.\d+)?\b|(?:-eq|-ne|-and|-or|\||>|<|=)|[{}[\](),])/gi,
  json: /("(?:\\.|[^"\\])*"|\b(?:true|false|null)\b|-?\b\d+(?:\.\d+)?\b|[{}[\],:])/g,
  output: /((?:^|\n)(?:\$|>|✓|✔)(?=\s)|\b(?:ok|passed|success|ready|checked|published|error|failed|warning)\b|\b\d+(?:\.\d+)?\b)/gi,
};

function classify(token: string, language: SyntaxLanguage) {
  if (/^(?:\/\/|#|<#)/.test(token)) return "syn-comment";
  if (/^https?:\/\//.test(token)) return "syn-url";
  if (/^['"]/.test(token)) return "syn-string";
  if (language === "nivren" && keywords.test(token)) return "syn-keyword";
  if (language === "nivren" && types.test(token)) return "syn-type";
  if (language === "shell" && commands.test(token)) return "syn-function";
  if (language === "powershell" && /^(?:Invoke-|Set-|Get-|Join-|Copy-|New-|Remove-)/i.test(token)) return "syn-function";
  if (/^\$\{?[A-Za-z_]|^\$[A-Za-z_]/.test(token)) return "syn-variable";
  if (/^--?[A-Za-z]/.test(token)) return "syn-flag";
  if (/^(?:true|false|null|none|maybe)$/i.test(token)) return "syn-literal";
  if (/^-?\d+(?:\.\d+)?$/.test(token)) return "syn-number";
  if (/^(?:\$|>|✓|✔)$/.test(token.trim()) || /^(?:ok|passed|success|ready|checked|published)$/i.test(token)) return "syn-success";
  if (/^(?:error|failed)$/i.test(token)) return "syn-error";
  if (/^warning$/i.test(token)) return "syn-warning";
  if (/^(?:=>|->|==|!=|<=|>=|&&|\|\||-eq|-ne|-and|-or|\+|-|\*|\/|=|<|>|\||&)$/i.test(token)) return "syn-operator";
  if (/^[{}[\](),.:]$/.test(token)) return "syn-punctuation";
  return undefined;
}
