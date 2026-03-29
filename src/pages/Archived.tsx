import type { Dispatch, SetStateAction } from 'react'
import BookmarksPage from './BookmarksPage'
import type { Bookmark } from '../types/bookmark'

type ArchivedProps = {
  bookmarks: Bookmark[]
  setBookmarks: Dispatch<SetStateAction<Bookmark[]>>
}

const Archived = ({ bookmarks, setBookmarks }: ArchivedProps) => {
  return <BookmarksPage mode="archived" bookmarks={bookmarks} setBookmarks={setBookmarks} />
}

export default Archived
