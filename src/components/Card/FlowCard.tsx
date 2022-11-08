import Link from "next/link";
import { PolyglotFlow } from "../../types/polyglotElements";

type FlowCardProps = {
  flow: PolyglotFlow;

}

export default function FlowCard({ flow }: FlowCardProps) {
  return (
    <Link href={`/flows/${flow._id}`} style={{ textDecoration: 'none' }}>
      <div className="border border-solid border-black w-auto h-auto p-3">
        <div className="font-bold text-black">{flow.title}</div>
        <div className='text-black'>{flow.description}</div>
      </div>
    </Link>
  )
}

export function ScheletonFlowCards() {
  return (
    <div className="animate-pulse bg-gray-300 w-2/3 h-12 p-3 rounded">

    </div>
  )
}