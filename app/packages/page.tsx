import type {Metadata} from "next";
import {PackageDirectory} from "./PackageDirectory";
export const metadata:Metadata={title:"Packages",description:"Browse all 25 official Nivren packages, with API references, examples, and capability requirements."};
export default function Page(){return <PackageDirectory/>;}
