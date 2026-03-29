import type { Dispatch, SetStateAction } from 'react'
import BookmarksPage from './BookmarksPage'
import type { Bookmark } from '../types/bookmark'

type HomeProps = {
  bookmarks: Bookmark[]
  setBookmarks: Dispatch<SetStateAction<Bookmark[]>>
}

const Home = ({ bookmarks, setBookmarks }: HomeProps) => {
  return <BookmarksPage mode="active" bookmarks={bookmarks} setBookmarks={setBookmarks} />
}

export default Home
