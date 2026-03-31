import type { Bookmark, NewBookmark } from '../types/bookmark'

export const createBookmark = (bookmark: NewBookmark): Bookmark => {
  return {
    id: crypto.randomUUID(),
    ...bookmark
  }
}

export const updateBookmark = (bookmark: Bookmark): Bookmark => {
  return {
    ...bookmark
  }
}
