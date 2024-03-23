'use client';
import { useRouting } from "@/shared/hook/useRouting";
import { Separator } from "@/shared/components/shadcn/separator";






export default function BookWritePage() {
  const router = useRouting();
  const bookId = router.params.bookId;


  return (
    <div className="flex h-10">
      <div>목차</div>
      <Separator orientation="vertical" />
      <div>글 작성</div>
    </div>
  );
}