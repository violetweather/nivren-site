"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { SyntaxCode } from "./components/SyntaxCode";
import { NivrenMark } from "./components/NivrenMark";
import { publicRelease } from "./release";

const examples = [
  {label:"Readable intent",name:"hello.niv",code:`define greet
takes { name is String }
gives String
{
    give "Hello, " + name + "!"
}

show(greet with {
    name set "world"
})`,note:"Hello, world!",title:"Understand it at a glance.",description:"Named inputs. Clear outputs. Code that tells you what it does, before you run it."},
  {label:"Explicit authority",name:"fetch.niv",code:`define fetch
takes { url is String }
gives String or Problem
needs Network within "api.example.com"
{
    give perform std.web.get with {
        url set url timeout set 5.0
    }
}`,note:"Authority is declared in source and granted in niv.toml.",title:"Permission is part of the program.",description:"External work says what it needs. Your project decides which resources it can access."},
  {label:"Typed outcomes",name:"result.niv",code:`define double
takes { value is Int }
gives Int
{
    give value * 2
}

show(double with { value set 21 })`,note:"42",title:"Know what comes back.",description:"Explicit types make results visible. For operations that can fail, typed errors and exhaustive choices keep every outcome in view."},
];

export function HomeExperience(){
  const [selected,setSelected]=useState(0);
  const buttons=useRef<(HTMLButtonElement|null)[]>([]);
  const example=examples[selected];
  function navigate(event:React.KeyboardEvent,index:number){
    let next=index;
    if(event.key==="ArrowRight")next=(index+1)%examples.length;
    else if(event.key==="ArrowLeft")next=(index+examples.length-1)%examples.length;
    else if(event.key==="Home")next=0;
    else if(event.key==="End")next=examples.length-1;
    else return;
    event.preventDefault();setSelected(next);buttons.current[next]?.focus();
  }
  return <>
    <section className="home-hero shell" aria-labelledby="hero-title">
      <div className="release-note"><span className="status-dot"/>Nivren {publicRelease.version}<span className="release-divider">/</span>Edition {publicRelease.edition} · Stable</div>
      <h1 id="hero-title">Code that reads<br/>like <span>intent.</span></h1>
      <p className="hero-description">A programming language that makes your intent clear.<br className="desktop-break"/> What your code keeps, changes, needs, and gives.</p>
      <div className="hero-actions"><Link className="button primary" href="/install">Get Nivren <span aria-hidden="true">↓</span></Link><Link className="button text-button" href="/docs">Explore the language <span aria-hidden="true">↗</span></Link></div>
      <p className="platform-note">Free and open source. For Windows, macOS, and Linux.</p>
    </section>

    <section className="demo-section shell" aria-label="Explore Nivren syntax">
      <div className="demo-tabs" role="tablist" aria-label="Language examples">{examples.map((item,index)=><button key={item.label} ref={node=>{buttons.current[index]=node;}} id={`example-tab-${index}`} role="tab" aria-selected={selected===index} aria-controls="example-panel" tabIndex={selected===index?0:-1} onKeyDown={event=>navigate(event,index)} onClick={()=>setSelected(index)}>{item.label}</button>)}</div>
      <div className="demo-panel" id="example-panel" role="tabpanel" aria-labelledby={`example-tab-${selected}`} tabIndex={0}>
        <div className="demo-editor"><div className="editor-title"><span className="window-dots" aria-hidden="true"><i/><i/><i/></span><span>{example.name}</span><span className="editor-language">Nivren</span></div><pre tabIndex={0}><SyntaxCode code={example.code}/></pre><div className="editor-output"><span className="output-label">{selected===1?"CAPABILITY":"OUTPUT"}</span><span>{example.note}</span></div></div>
        <div className="demo-explanation"><NivrenMark className="demo-mark"/><h2>{example.title}</h2><p>{example.description}</p><Link className="text-link" href="/examples">See more examples <span aria-hidden="true">↗</span></Link></div>
      </div>
    </section>

    <section className="principles shell" aria-labelledby="principles-heading"><div className="section-intro"><h2 id="principles-heading">Less to guess.<br/>More to build.</h2><p>A small set of language rules makes the important parts of your program visible.</p></div>
      <div className="principle-list"><article><span className="principle-symbol" aria-hidden="true">{`{ }`}</span><div><h3>Failure is a value.</h3><p>No exceptions. No implicit nulls. Handle every case, or pass the problem along explicitly.</p></div></article><article><span className="principle-symbol" aria-hidden="true">↳</span><div><h3>Everything has a lifetime.</h3><p>Tasks stay within their scope. Resources close on success, failure, and cancellation.</p></div></article><article><span className="principle-symbol" aria-hidden="true">⌁</span><div><h3>One toolchain. All the way.</h3><p>Format, check, test, debug, and ship with one binary. The tools are already there.</p></div></article></div>
    </section>

    <section className="workflow-section"><div className="shell workflow"><div><p className="section-label">From first line to first release</p><h2>Make something<br/>that matters.</h2><p>Create a project. Make it yours. Ship a standalone executable.</p><Link className="text-link" href="/docs">Start with the quickstart <span aria-hidden="true">↗</span></Link></div><div className="workflow-code"><div><span className="command-prompt">$</span> niv new my-app</div><div><span className="command-prompt">$</span> cd my-app</div><div><span className="command-prompt">$</span> niv dev</div><div><span className="command-prompt">$</span> niv test</div><div className="ship-command"><span className="command-prompt">$</span> niv ship<span aria-hidden="true">↗</span></div><p>Check. Test. Document. Package.</p></div></div></section>

    <section className="resources shell"><div className="section-intro"><h2>Go a little further.</h2><p>The references you need, when you need them.</p></div><div className="resource-links"><Link href="/docs"><span>Documentation</span><p>Learn the language, from first steps to complete applications.</p><span className="resource-arrow" aria-hidden="true">↗</span></Link><Link href="/packages"><span>Packages</span><p>Explore the official packages and their verified registry.</p><span className="resource-arrow" aria-hidden="true">↗</span></Link><Link href="/benchmarks"><span>Benchmarks</span><p>Read the results and reproduce them. Every workload included.</p><span className="resource-arrow" aria-hidden="true">↗</span></Link></div></section>
    <section className="home-finale shell"><NivrenMark className="final-mark"/><h2>Make your intent real.</h2><Link className="button primary" href="/install">Get started with Nivren <span aria-hidden="true">↗</span></Link></section>
  </>;
}
