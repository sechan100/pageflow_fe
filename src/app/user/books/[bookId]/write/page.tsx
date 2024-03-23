'use client';
import { useRouting } from "@/shared/hook/useRouting";
import { Separator } from "@/shared/components/shadcn/separator";






export default function BookWritePage() {
  const router = useRouting();
  const bookId = router.params.bookId;


  return (
    <>
      목차
      <Separator />
      글 작성 페이지
    </>
  );
}