import { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import AddBookmark from '../components/AddBookmark/AddBookmark'
import EditBookmark from '../components/EditBookmark/EditBookmark'
import Bookmarks from '../components/Bookmarks/Bookmarks'
import DialogModal, { type DialogAction } from '../components/DialogModal/DialogModal'
import Header from '../components/Header/Header'
import Sidebar from '../components/Sidebar/Sidebar'
import { createBookmark, editBookmark } from '../api/bookmarkApi'
import type { Bookmark, NewBookmark } from '../types/bookmark'
import {
  filterBookmarks,
  getTagCounts,
  toggleSelectedTag,
  updateBookmarkById,
  type BookmarkPageMode,
  type SortOption,
} from '../utils/bookmarkPage'
import { useDebounce } from '../utils/useDebounce'

type BookmarksPageProps = {
  mode: BookmarkPageMode
  bookmarks: Bookmark[]
  setBookmarks: Dispatch<SetStateAction<Bookmark[]>>
}

type DialogState = {
  action: DialogAction
  bookmark: Bookmark
}

const BookmarksPage = ({ mode, bookmarks, setBookmarks }: BookmarksPageProps) => {
  const location = useLocation()
  const signedInUser = location.state as { fullName?: string; email?: string } | undefined
  const [sortOption, setSortOption] = useState<SortOption>('default')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isAddBookmarkOpen, setIsAddBookmarkOpen] = useState(false)
  const [isEditBookmarkOpen, setIsEditBookmarkOpen] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)
  const [dialogState, setDialogState] = useState<DialogState | null>(null)
  const debouncedSearchQuery = useDebounce({ value: searchQuery, delay: 300 })

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

  const openAddBookmarkModal = () => {
    setIsAddBookmarkOpen(true)
  }

  const closeAddBookmarkModal = () => {
    setIsAddBookmarkOpen(false)
  }

  const openEditBookmarkModal = () => {
    setIsEditBookmarkOpen(true)
  }

  const closeEditBookmarkModal = () => {
    setIsEditBookmarkOpen(false)
    setEditingBookmark(null)
  }

  const getEditingBookmark = (bookmark:Bookmark) => {
    setEditingBookmark(bookmark)
    openEditBookmarkModal()
  }

  const handleCreateBookmark = (newBookmark: NewBookmark) => {
    const bookmark = createBookmark(newBookmark)
    setBookmarks((currentBookmarks) => [bookmark, ...currentBookmarks])
  }

  const handleEditBookmark = (editedBookmark: Bookmark) => {
    const bookmark = editBookmark(editedBookmark)

    setBookmarks((currentBookmarks) => {
      return updateBookmarkById(currentBookmarks, bookmark.id, () => bookmark)
    })
  }

  const archiveBookmark = (id: string) => {
    setBookmarks((currentBookmarks) => {
      return updateBookmarkById(currentBookmarks, id, (bookmark) => {
        return {
          ...bookmark,
          isArchived: true,
        } 
      })
    })
  }

  const unarchiveBookmark = (id: string) => {
    setBookmarks((currentBookmarks) => {
      return updateBookmarkById(currentBookmarks, id, (bookmark) => {
        return {
          ...bookmark,
          isArchived: false,
        } 
      })
    })
  }

  const deleteBookmark = (id: string) => {
    setBookmarks((currentBookmarks) => {
      return currentBookmarks.filter((bookmark) => bookmark.id !== id)
    })
  }

  const togglePinnedBookmark = (id: string) => {
    setBookmarks((currentBookmarks) => {
      return updateBookmarkById(currentBookmarks, id, (bookmark) => {
        return {
          ...bookmark,
          pinned: !bookmark.pinned,
        }
      })
    })
  }

  const addViewCount = (id: string) => {
    setBookmarks((currentBookmarks) => {
      return updateBookmarkById(currentBookmarks, id, (bookmark) => {
        return {
          ...bookmark,
          visitCount: bookmark.visitCount + 1,
          lastVisited: new Date().toISOString()
        }
      })
    })
  }

  const pageTitle = mode === 'archived' ? 'Archived bookmarks' : 'All bookmarks'

  const openDialogModal = (bookmark: Bookmark, action: DialogAction) => {
    setDialogState({ bookmark, action })
  }

  const closeDialogModal = () => {
    setDialogState(null)
  }

  const confirmDialogAction = () => {
    if (!dialogState) return

    const { action, bookmark } = dialogState

    if (action === 'Archive') {
      archiveBookmark(bookmark.id)
    }

    if (action === 'Unarchive') {
      unarchiveBookmark(bookmark.id)
    }

    if (action === 'Delete') {
      deleteBookmark(bookmark.id)
    }

    closeDialogModal()
  }

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
              getEditingBookmark={getEditingBookmark}
              sortOption={sortOption}
            />
          </main>
        </div>
      </div>
    </>
  )
}

export default BookmarksPage
