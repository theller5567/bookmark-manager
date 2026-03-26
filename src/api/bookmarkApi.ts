import type { Bookmark, NewBookmark } from '../types/bookmark'


export const updateBookmark = (_id:string, _bookmark:Bookmark) => {

}

export const createBookmark = (bookmark: NewBookmark): Bookmark => {
  return {
    id: crypto.randomUUID(),
    ...bookmark
  }
}

export const deleteBookmark = (_id:string) => {
    
}
