


export const endpoint = {
  user: {
    books: {
      $bookId: {
        write: (bookId: number) => `/user/books/${bookId}/write` 
      }
    }
  }
}