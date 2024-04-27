import { Book } from "lucide-react";
import Link from "next/link";


interface Props {
  title: string;
}
export default function OutlineBook(props: Props) {
  return (
    <Link href="/" replace className="flex border mb-2 items-center p-2 text-base font-normal text-white rounded-lg bg-gray-800 hover:bg-gray-700 group">
      <Book />
      <span className="ml-3 text-lg truncate">{props.title}</span>
    </Link>
  )
}