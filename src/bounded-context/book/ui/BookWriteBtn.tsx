'use client';
import { PencilLine } from "lucide-react";
import Link from "next/link";
import { Button } from "@/shared/components/shadcn/button";


const BookWriteBtn = () => {
  return (
    <Link href="/book">
      <Button variant="outline" className="rounded-full">
        <PencilLine className="mr-1" /> 집필하기
      </Button>
    </Link>
  )
}


export default BookWriteBtn;