import { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import AddBookmark from '../components/AddBookmark/AddBookmark'
import EditBookmark from '../components/EditBookmark/EditBookmark'
import Bookmarks from '../components/Bookmarks/Bookmarks'
import DialogModal from '../components/DialogModal/DialogModal'
import Header from '../components/Header/Header'
import Sidebar from '../components/Sidebar/Sidebar'
import type { Bookmark } from '../types/bookmark'
import { useBookmarkActions } from '../hooks/useBookmarkActions'
import { useBookmarkModals } from '../hooks/useBookmarkModals'
import {
  filterBookmarks,
  getTagCounts,
  toggleSelectedTag,
  type BookmarkPageMode,
  type SortOption,
} from '../utils/bookmarkPage'
import { useDebounce } from '../utils/useDebounce'

type BookmarksPageProps = {
  mode: BookmarkPageMode
  bookmarks: Bookmark[]
  setBookmarks: Dispatch<SetStateAction<Bookmark[]>>
}

const BookmarksPage = ({ mode, bookmarks, setBookmarks }: BookmarksPageProps) => {
  const location = useLocation()
  const signedInUser = location.state as { fullName?: string; email?: string } | undefined
  const [sortOption, setSortOption] = useState<SortOption>('default')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const debouncedSearchQuery = useDebounce({ value: searchQuery, delay: 300 })

  const {
    handleCreateBookmark,
    handleEditBookmark,
    archiveBookmark,
    unarchiveBookmark,
    deleteBookmark,
    togglePinnedBookmark,
    addViewCount,
  } = useBookmarkActions({ setBookmarks })

  const {
    isAddBookmarkOpen,
    isEditBookmarkOpen,
    editingBookmark,
    dialogState,
    openAddBookmarkModal,
    closeAddBookmarkModal,
    openEditBookmarkModal,
    closeEditBookmarkModal,
    openDialogModal,
    closeDialogModal,
    confirmDialogAction,
  } = useBookmarkModals({
    archiveBookmark,
    unarchiveBookmark,
    deleteBookmark,
  })

  const filteredBookmarks = useMemo(() => {
    return filterBookmarks({
      bookmarks,
      mode,
      searchQuery: debouncedSearchQuery,
      selectedTags,
      sortOption,
    })
  }, [bookmarks, debouncedSearchQuery, mode, selectedTags, sortOption])

  const tagCounts = useMemo(() => {
    return getTagCounts(bookmarks, mode)
  }, [bookmarks, mode])

  const onSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const onTagSelectionChange = (tagName: string, checked: boolean) => {
    setSelectedTags((currentTags) => {
      return toggleSelectedTag(currentTags, tagName, checked)
    })
  }

  const clearTags = () => {
    setSelectedTags([])
  }

  const pageTitle = mode === 'archived' ? 'Archived bookmarks' : 'All bookmarks'

  return (
    <>
      <AnimatePresence>
        {isAddBookmarkOpen && <AddBookmark onClose={closeAddBookmarkModal} createBookmark={handleCreateBookmark} />}
        {isEditBookmarkOpen && editingBookmark && (
          <EditBookmark
            onClose={closeEditBookmarkModal}
            editBookmark={handleEditBookmark}
            editingBookmark={editingBookmark}
          />
        )}
        {dialogState && (
          <DialogModal
            action={dialogState.action}
            bookmarkTitle={dialogState.bookmark.title}
            onConfirm={confirmDialogAction}
            onClose={closeDialogModal}
          />
        )}
      </AnimatePresence>
      <div className="home-container">
        <Sidebar
          currentMode={mode}
          tagData={tagCounts}
          selectedTags={selectedTags}
          onTagSelectionChange={onTagSelectionChange}
          clearTags={clearTags}
        />
        <div className="right-column">
          <Header
            searchQuery={searchQuery}
            onAddBookmark={openAddBookmarkModal}
            onSearchChange={onSearchChange}
            name={signedInUser?.fullName}
            email={signedInUser?.email}
          />
          <main>
            <Bookmarks
              title={pageTitle}
              bookmarks={filteredBookmarks}
              openDialogModal={openDialogModal}
              togglePinnedBookmark={togglePinnedBookmark}
              addViewCount={addViewCount}
              setSortOption={setSortOption}
              getEditingBookmark={openEditBookmarkModal}
              sortOption={sortOption}
            />
          </main>
        </div>
      </div>
    </>
  )
}

export default BookmarksPage
