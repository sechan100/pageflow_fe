'use client';

import MyBook from "@/bounded-context/book/ui/bookshelf/MyBook";



const dummyInfo = {
  id: "dfkhjg2425",
  title: "Dummy Title",
  coverImageUrl: "http://localhost:8888/img/default-book-cover-img.png"
};

const MyBooks = () => {
  return(
  <div className="container h-full">
    <div className="">header</div>
    <div className="grid grid-cols-4 gap-5">
      <MyBook info={dummyInfo} />
      <MyBook info={dummyInfo} />
      <MyBook info={dummyInfo} />
      <MyBook info={dummyInfo} />
      <MyBook info={dummyInfo} />
      <MyBook info={dummyInfo} />
      <MyBook info={dummyInfo} />
      <MyBook info={dummyInfo} />
      <MyBook info={dummyInfo} />
      <MyBook info={dummyInfo} />
      <MyBook info={dummyInfo} />
      <MyBook info={dummyInfo} />
    </div>
  </div>
  )
}

export default MyBooks;