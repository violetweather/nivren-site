"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NivrenMark } from "./NivrenMark";

const links=[{href:"/docs",label:"Documentation"},{href:"/examples",label:"Examples"},{href:"/packages",label:"Packages"},{href:"/benchmarks",label:"Benchmarks"}];
export function SiteNav(){
  const pathname=usePathname();
  const [open,setOpen]=useState(false);
  const toggle=useRef<HTMLButtonElement>(null);
  useEffect(()=>{setOpen(false);},[pathname]);
  return <header className="site-header"><div className="header-inner shell"><Link href="/" className="brand" aria-label="Nivren home"><NivrenMark/><span>Nivren</span></Link><nav className="desktop-nav" aria-label="Main navigation">{links.map(link=><Link key={link.href} href={link.href} aria-current={pathname.startsWith(link.href)?"page":undefined}>{link.label}</Link>)}</nav><div className="header-actions"><Link href="/install" className="nav-install" aria-current={pathname==="/install"?"page":undefined}>Get Nivren</Link><button type="button" ref={toggle} className="menu-toggle" aria-expanded={open} aria-controls="mobile-menu" aria-label={open?"Close navigation":"Open navigation"} onClick={()=>setOpen(!open)}><span/>{open?<span className="menu-close"/>:<span/>}</button></div></div><nav id="mobile-menu" className="mobile-nav" aria-label="Mobile navigation" hidden={!open} onKeyDown={event=>{if(event.key==="Escape"){setOpen(false);toggle.current?.focus();}}}>{links.map(link=><Link key={link.href} href={link.href} aria-current={pathname.startsWith(link.href)?"page":undefined} onClick={()=>setOpen(false)}>{link.label}<span aria-hidden="true">↗</span></Link>)}<Link href="/downloads" onClick={()=>setOpen(false)}>Downloads<span aria-hidden="true">↓</span></Link></nav></header>;
}
