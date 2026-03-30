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
import { useDebounce } from '../utils/useDebounce'

type SortOption = 'default' | 'recently-added' | 'recently-visited' | 'most-visited'
type BookmarkPageMode = 'active' | 'archived'
type TagCount = {
  tag: string
  count: number
}

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

  const getLastVisitedTime = (bookmark: Bookmark): number => {
    return bookmark.lastVisited ? new Date(bookmark.lastVisited).getTime() : 0
  }

  const sortBookmarks = (nextBookmarks: Bookmark[], nextSortOption: SortOption): Bookmark[] => {
    switch (nextSortOption) {
      case 'default':
        return [...nextBookmarks].sort((a, b) => {
          if (a.pinned !== b.pinned) {
            return Number(b.pinned) - Number(a.pinned)
          }

          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
      case 'recently-added':
        return [...nextBookmarks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case 'recently-visited':
        return [...nextBookmarks].sort((a, b) => getLastVisitedTime(b) - getLastVisitedTime(a))
      case 'most-visited':
        return [...nextBookmarks].sort((a, b) => b.visitCount - a.visitCount)
      default:
        return nextBookmarks
    }
  }

  const isBookmarkVisibleForMode = (bookmark: Bookmark) => {
    return mode === 'archived' ? bookmark.isArchived === true : bookmark.isArchived !== true
  }

  const modeBookmarks = useMemo(() => {
    return bookmarks.filter(isBookmarkVisibleForMode)
  }, [bookmarks, mode])

  const filteredBookmarks = useMemo(() => {
    const normalizedQuery = debouncedSearchQuery.trim().toLowerCase()
    const searchedBookmarks = normalizedQuery
      ? modeBookmarks.filter((bookmark) => {
          return (
            bookmark.title.toLowerCase().includes(normalizedQuery) ||
            bookmark.url.toLowerCase().includes(normalizedQuery) ||
            bookmark.description.toLowerCase().includes(normalizedQuery) ||
            bookmark.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
          )
        })
      : modeBookmarks

    const tagFilteredBookmarks = selectedTags.length > 0
      ? searchedBookmarks.filter((bookmark) => {
          return bookmark.tags.some((tag) => selectedTags.includes(tag))
        })
      : searchedBookmarks

    return sortBookmarks(tagFilteredBookmarks, sortOption)
  }, [debouncedSearchQuery, modeBookmarks, selectedTags, sortOption])

  const tagCounts = useMemo<TagCount[]>(() => {
    const map = new Map<string, number>()

    modeBookmarks.forEach(({ tags }) => {
      tags.forEach((tag) => {
        map.set(tag, (map.get(tag) ?? 0) + 1)
      })
    })

    return Array.from(map.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
  }, [modeBookmarks])

  const onSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const onTagSelectionChange = (tagName: string, checked: boolean) => {
    setSelectedTags((currentTags) => {
      if (checked) {
        return currentTags.includes(tagName) ? currentTags : [...currentTags, tagName]
      }

      return currentTags.filter((tag) => tag !== tagName)
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
        const newBookmarks = currentBookmarks.filter((bookmark) => {
            if(bookmark.id !== editedBookmark.id){
                return bookmark;
            }
        })
       return [bookmark, ...newBookmarks]
    })
  }

  const archiveBookmark = (id: string) => {
    setBookmarks((currentBookmarks) => {
      return currentBookmarks.map((bookmark) => {
        if (bookmark.id !== id) {
          return bookmark
        }

        return {
          ...bookmark,
          isArchived: true,
        }
      })
    })
  }

  const unarchiveBookmark = (id: string) => {
    setBookmarks((currentBookmarks) => {
      return currentBookmarks.map((bookmark) => {
        if (bookmark.id !== id) {
          return bookmark
        }

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
        return currentBookmarks.map((bookmark) => {
          if (bookmark.id !== id) {
            return bookmark
          }
  
          return {
            ...bookmark,
            pinned: !bookmark.pinned,
          }
        })
      })
  }

  const addViewCount = (id: string) => {
    setBookmarks((currentBookmarks) => {
        return currentBookmarks.map((bookmark) => {
          if (bookmark.id !== id) {
            return bookmark
          }
  
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
