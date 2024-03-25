'use client';
import { useRouting } from "@/shared/hook/useRouting";
import { useState } from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible";
import { Separator } from "@/shared/components/shadcn/separator";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";






export default function BookWritePage() {
  const router = useRouting();
  const bookId = router.params.bookId;
  const [isOutlineOpen, setIsOutlienOpen] = useState(true);

  return (
    <div className="flex h-full">
      <Collapsible className="flex" onOpenChange={isOpen => setIsOutlienOpen(isOpen)} open={isOutlineOpen}>
        <CollapsibleContent className="w-[17vw]">
          <ul>
            <li>목차</li>
            <li>글 목록</li>
            <li>글 목록</li>
            <li>글 목록</li>
            <li>글 목록</li>
            <li>글 목록</li>
            <li>글 목록</li>
            <li>글 목록</li>
            <li>글 목록</li>
            <li>글 목록</li>
          </ul>
        </CollapsibleContent>
        <Separator orientation="vertical" />
        <div className="flex items-center">
          <CollapsibleTrigger className="cursor-pointer hover:bg-gray-600 bg-transparent rounded-full" asChild>
            {isOutlineOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </CollapsibleTrigger>
        </div>
      </Collapsible>
    </div>
  );
}