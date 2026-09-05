"use client";
import {useRef,useState} from "react";
import {SyntaxCode} from "../components/SyntaxCode";
import {publicRelease} from "../release";

const releaseRoot=`https://raw.githubusercontent.com/violetweather/nivren/v${publicRelease.version}/install`;
const platforms=[
 {id:"windows",label:"Windows",support:"x64 and ARM64",code:`Invoke-WebRequest ${releaseRoot}/install.ps1 -OutFile install.ps1
Set-ExecutionPolicy -Scope Process Bypass
.\\install.ps1`,file:`${releaseRoot}/install.ps1`},
 {id:"mac",label:"macOS",support:"Apple Silicon and Intel",code:`curl --proto '=https' --tlsv1.2 -fsSLO \\
  ${releaseRoot}/install.sh
sh install.sh`,file:`${releaseRoot}/install.sh`},
 {id:"linux",label:"Linux",support:"x64 and ARM64",code:`curl --proto '=https' --tlsv1.2 -fsSLO \\
  ${releaseRoot}/install.sh
sh install.sh`,file:`${releaseRoot}/install.sh`},
 {id:"source",label:"From source",support:"Requires Rust 1.88 or newer",code:`git clone https://github.com/violetweather/nivren.git
cd nivren
cargo build --release --workspace --locked
./target/release/niv version`,file:null},
];
export function InstallChooser(){
 const [selected,setSelected]=useState(0);
 const [status,setStatus]=useState("");
 const refs=useRef<(HTMLButtonElement|null)[]>([]);
 const item=platforms[selected];
 function choose(index:number){setSelected(index);setStatus("");}
 function onKey(event:React.KeyboardEvent,index:number){let next=index;if(event.key==="ArrowRight")next=(index+1)%4;else if(event.key==="ArrowLeft")next=(index+3)%4;else if(event.key==="Home")next=0;else if(event.key==="End")next=3;else return;event.preventDefault();choose(next);refs.current[next]?.focus();}
 async function copy(){try{await navigator.clipboard.writeText(item.code);setStatus("Commands copied. Paste them into your terminal when you’re ready.");}catch{setStatus("Clipboard access is unavailable. Select the commands above to copy them manually.");}}
 return <section className="installer-card" aria-label="Installation instructions"><div className="platform-tabs" role="tablist" aria-label="Your computer’s platform">{platforms.map((platform,index)=><button type="button" key={platform.id} ref={node=>{refs.current[index]=node;}} id={`platform-${platform.id}`} role="tab" aria-selected={selected===index} aria-controls="installer-panel" tabIndex={selected===index?0:-1} onKeyDown={event=>onKey(event,index)} onClick={()=>choose(index)}>{platform.label}</button>)}</div><div className="installer-body" id="installer-panel" role="tabpanel" aria-labelledby={`platform-${item.id}`} tabIndex={0}><div className="installer-title"><div><span>{item.support}</span><h2>{item.label} installation</h2></div>{item.file&&<a className="button primary" href={item.file}>Download installer <span aria-hidden="true">↓</span></a>}</div><div className="command-block install-command"><button type="button" onClick={copy} aria-label="Copy install commands">{status.startsWith("Commands copied")?"Copied ✓":"Copy commands"}</button><pre tabIndex={0} aria-label={`${item.label} installation commands`}><SyntaxCode code={item.code} language={item.id==="windows"?"powershell":"shell"}/></pre></div><p className="copy-feedback" role="status">{status}</p><p className="install-note">{item.id==="source"?"Build the compiler and runtime using the exact dependency versions in Cargo.lock.":"Run these commands in your terminal. The installer checks your system, verifies the archive, and offers to configure PATH and VS Code."}</p></div><div className="verify-row"><span className="verify-mark" aria-hidden="true">✓</span><div><strong>Verified before it runs.</strong><p>The guided installer checks SHA-256 and keeps a previous version for recovery.</p></div></div></section>;
}
