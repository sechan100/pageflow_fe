'use client';

import Image from "next/image";
import { MyBookInfo } from "../../types/book";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/shadcn/card";
import { Button } from "@/shared/components/shadcn/button";
import { useRouting } from "@/shared/hook/useRouting";




interface Props {
  info: MyBookInfo;
}
const MyBook = (props: Props) => {
  return (
    <Card className="w-[19vw] h-[26vw] relative">
      <Image className="absolute z-0 w-full h-full" width={100} height={100} src={props.info.coverImageUrl} alt="coverImage"/>
      <CardHeader className="absolute bottom-0 bg-slate-300 opacity-85 w-full">
        <CardTitle>{props.info.title}</CardTitle>
        <WriteLinkBtn id={props.info.id} />
        {/* <CardDescription>Card Description</CardDescription> */}
      </CardHeader>
    </Card>
  )
}



// card에 링크를 입히기 위한 컴포넌트
interface WriteLinkProps {
  id: string;
}
const WriteLinkBtn = (props: WriteLinkProps) => {
  const { router } = useRouting();
  return (
  <>
    <Button 
      onClick={() => router.push(`/user/books/${props.id}/write`)} 
      className="w-full h-full btn-outline"
      variant="secondary"
    >
      집필하기
    </Button>
  </>
  )
}

export default MyBook;