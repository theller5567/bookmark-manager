import type { Dispatch, SetStateAction } from 'react'
import { createBookmark, updateBookmark } from '../api/bookmarkApi'
import type { Bookmark, NewBookmark } from '../types/bookmark'
import { useBookmarkModals } from '../hooks/useBookmarkModals'
import {
  archiveBookmarkById,
  deleteBookmarkById,
  incrementVisitCountById,
  prependBookmark,
  replaceBookmark,
  togglePinnedBookmarkById,
  unarchiveBookmarkById,
} from '../utils/bookmarkPage'

type UseBookmarkActionsProps = {
  setBookmarks: Dispatch<SetStateAction<Bookmark[]>>
}

export const useBookmarkActions = ({ setBookmarks }: UseBookmarkActionsProps) => {
  const handleCreateBookmark = (newBookmark: NewBookmark) => {
    const createdBookmark = createBookmark(newBookmark)
    setBookmarks((currentBookmarks) => prependBookmark(currentBookmarks, createdBookmark))
  }

  const handleEditBookmark = (editedBookmark: Bookmark) => {
    const updatedBookmark = updateBookmark(editedBookmark)
    setBookmarks((currentBookmarks) => replaceBookmark(currentBookmarks, updatedBookmark))
  }

  const archiveBookmark = (id: string) => {
    setBookmarks((currentBookmarks) => archiveBookmarkById(currentBookmarks, id))
  }

  const unarchiveBookmark = (id: string) => {
    setBookmarks((currentBookmarks) => unarchiveBookmarkById(currentBookmarks, id))
  }

  const deleteBookmark = (id: string) => {
    setBookmarks((currentBookmarks) => deleteBookmarkById(currentBookmarks, id))
  }

  const togglePinnedBookmark = (id: string) => {
    setBookmarks((currentBookmarks) => togglePinnedBookmarkById(currentBookmarks, id))
  }

  const addViewCount = (id: string) => {
    setBookmarks((currentBookmarks) => incrementVisitCountById(currentBookmarks, id))
  }

  return {
    handleCreateBookmark,
    handleEditBookmark,
    archiveBookmark,
    unarchiveBookmark,
    deleteBookmark,
    togglePinnedBookmark,
    addViewCount,
  }
}
