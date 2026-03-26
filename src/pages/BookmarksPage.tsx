import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import AddBookmark from '../components/AddBookmark/AddBookmark'
import Bookmarks from '../components/Bookmarks/Bookmarks'
import Header from '../components/Header/Header'
import Sidebar from '../components/Sidebar/Sidebar'
import { createBookmark } from '../api/bookmarkApi'
import bookmarkData from '../constants/data.json'
import type { Bookmark, NewBookmark } from '../types/bookmark'
import { useDebounce } from '../utils/useDebounce'

type SortOption = 'recently-added' | 'recently-visited' | 'most-visited'
type BookmarkPageMode = 'active' | 'archived'
type TagCount = {
  tag: string
  count: number
}

type BookmarksPageProps = {
  mode: BookmarkPageMode
}

const BookmarksPage = ({ mode }: BookmarksPageProps) => {
  const location = useLocation()
  const signedInUser = location.state as { fullName?: string; email?: string } | undefined
  const [sortOption, setSortOption] = useState<SortOption>('recently-added')
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isAddBookmarkOpen, setIsAddBookmarkOpen] = useState(false)
  const debouncedSearchQuery = useDebounce({ value: searchQuery, delay: 300 })

  useEffect(() => {
    setBookmarks(bookmarkData.bookmarks)
  }, [])

  const getLastVisitedTime = (bookmark: Bookmark): number => {
    return bookmark.lastVisited ? new Date(bookmark.lastVisited).getTime() : 0
  }

  const sortBookmarks = (nextBookmarks: Bookmark[], nextSortOption: SortOption): Bookmark[] => {
    switch (nextSortOption) {
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

  const openAddBookmarkModal = () => {
    setIsAddBookmarkOpen(true)
  }

  const closeAddBookmarkModal = () => {
    setIsAddBookmarkOpen(false)
  }

  const handleCreateBookmark = (newBookmark: NewBookmark) => {
    const bookmark = createBookmark(newBookmark)
    setBookmarks((currentBookmarks) => [bookmark, ...currentBookmarks])
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

  const pageTitle = mode === 'archived' ? 'Archived bookmarks' : 'All bookmarks'

  return (
    <>
      <AnimatePresence>
        {isAddBookmarkOpen && <AddBookmark onClose={closeAddBookmarkModal} createBookmark={handleCreateBookmark} />}
      </AnimatePresence>
      <div className="home-container">
        <Sidebar
          currentMode={mode}
          tagData={tagCounts}
          selectedTags={selectedTags}
          onTagSelectionChange={onTagSelectionChange}
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
              archiveBookmark={archiveBookmark}
              setSortOption={setSortOption}
              sortOption={sortOption}
            />
          </main>
        </div>
      </div>
    </>
  )
}

export default BookmarksPage
