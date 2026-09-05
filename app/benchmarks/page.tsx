import type {Metadata} from "next";
import {BenchmarkResults} from "./BenchmarkResults";
export const metadata:Metadata={title:"Benchmarks",description:"All twelve published Nivren and Node.js workloads, with their recorded environment and methodology."};
export default function Page(){return <BenchmarkResults/>;}
