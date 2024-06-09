

export interface OutlinePage {
  id: number;
  title: string;
  ordinalValue : number;
}

export interface OutlineNode {
  id: number;
  title: string;
  ordinalValue: number;
  nodes: OutlineNode[];
  pages: OutlinePage[];
}

interface Outline {
  id: number;
  title: string;
  coverImgUrl: string;
  published: boolean;
  nodes: OutlineNode[];
  pages: OutlinePage[];
}




const getOutlineFallback: (bookId: number)=>Outline = (bookId: number) => {


  return {
    id: bookId,
    title: "Fallback Outline Title",
    coverImgUrl: "/img/unloaded_img.jpg",
    published: false,
    nodes: [
      {
        id: 1,
        title: "Fallback Chapter Title 1",
        ordinalValue: 10000,
        nodes: [],
        pages: [
          {
            id: 3,
            title: "Fallback Page Title 3",
            ordinalValue: 10000
          }
        ]
      },
      {
        id: 2,
        title: "Fallback Chapter Title 2",
        ordinalValue: 20000,
        nodes: [
          {
            id: 4,
            title: "Fallback Chapter Title 4",
            ordinalValue: 10000,
            nodes: [],
            pages: []
          },
          {
            id: 5,
            title: "Fallback Chapter Title 5",
            ordinalValue: 20000,
            nodes: [],
            pages: []
          }
        ],
        pages: []
      },
      {
        id: 3,
        title: "Fallback Chapter Title 3",
        ordinalValue: 30000,
        nodes: [],
        pages: []
      }
    ],
    pages: [
      {
        id: 1,
        title: "Fallback Page Title 1",
        ordinalValue: 1000
      },
      {
        id: 2,
        title: "Fallback Page Title 2",
        ordinalValue: 50000
      }
    ]
  };
}


export const useOutline: (bookId: number) => Outline 
= (bookId: number) => {
  return getOutlineFallback(bookId);
}