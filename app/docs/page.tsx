import type { Metadata } from "next";
import { DocsExplorer } from "./DocsExplorer";
export const metadata: Metadata={title:"Documentation",description:"Learn Nivren, from your first program to complete applications."};
export default function DocsPage(){return <><section className="page-hero compact"><div className="shell"><span className="kicker">The Nivren guide</span><h1>A clear place to start.</h1><p>Learn the language. Find an answer. Build your next idea.</p></div></section><DocsExplorer/></>;}
