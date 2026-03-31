import type { Bookmark } from '../types/bookmark'

export type SortOption = 'default' | 'recently-added' | 'recently-visited' | 'most-visited'
export type BookmarkPageMode = 'active' | 'archived'
export type TagCount = {
  tag: string
  count: number
}

export const getLastVisitedTime = (bookmark: Bookmark): number => {
  return bookmark.lastVisited ? new Date(bookmark.lastVisited).getTime() : 0
}

export const sortBookmarks = (bookmarks: Bookmark[], sortOption: SortOption): Bookmark[] => {
  switch (sortOption) {
    case 'default':
      return [...bookmarks].sort((a, b) => {
        if (a.pinned !== b.pinned) {
          return Number(b.pinned) - Number(a.pinned)
        }

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
    case 'recently-added':
      return [...bookmarks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'recently-visited':
      return [...bookmarks].sort((a, b) => getLastVisitedTime(b) - getLastVisitedTime(a))
    case 'most-visited':
      return [...bookmarks].sort((a, b) => b.visitCount - a.visitCount)
    default:
      return bookmarks
  }
}

export const isBookmarkVisibleForMode = (bookmark: Bookmark, mode: BookmarkPageMode) => {
  return mode === 'archived' ? bookmark.isArchived === true : bookmark.isArchived !== true
}

export const filterBookmarks = ({
  bookmarks,
  mode,
  searchQuery,
  selectedTags,
  sortOption,
}: {
  bookmarks: Bookmark[]
  mode: BookmarkPageMode
  searchQuery: string
  selectedTags: string[]
  sortOption: SortOption
}) => {
  const visibleBookmarks = bookmarks.filter((bookmark) => isBookmarkVisibleForMode(bookmark, mode))
  const normalizedQuery = searchQuery.trim().toLowerCase()

  const searchedBookmarks = normalizedQuery
    ? visibleBookmarks.filter((bookmark) => {
        return (
          bookmark.title.toLowerCase().includes(normalizedQuery) ||
          bookmark.url.toLowerCase().includes(normalizedQuery) ||
          bookmark.description.toLowerCase().includes(normalizedQuery) ||
          bookmark.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
        )
      })
    : visibleBookmarks

  const tagFilteredBookmarks = selectedTags.length > 0
    ? searchedBookmarks.filter((bookmark) => {
        return bookmark.tags.some((tag) => selectedTags.includes(tag))
      })
    : searchedBookmarks

  return sortBookmarks(tagFilteredBookmarks, sortOption)
}

export const getTagCounts = (bookmarks: Bookmark[], mode: BookmarkPageMode): TagCount[] => {
  const visibleBookmarks = bookmarks.filter((bookmark) => isBookmarkVisibleForMode(bookmark, mode))
  const map = new Map<string, number>()

  visibleBookmarks.forEach(({ tags }) => {
    tags.forEach((tag) => {
      map.set(tag, (map.get(tag) ?? 0) + 1)
    })
  })

  return Array.from(map.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export const toggleSelectedTag = (currentTags: string[], tagName: string, checked: boolean) => {
  if (checked) {
    return currentTags.includes(tagName) ? currentTags : [...currentTags, tagName]
  }

  return currentTags.filter((tag) => tag !== tagName)
}

export const updateBookmarkById = (
  bookmarks: Bookmark[],
  id: string,
  updater: (bookmark: Bookmark) => Bookmark,
) => {
  return bookmarks.map((bookmark) => {
    if (bookmark.id !== id) return bookmark
    return updater(bookmark)
  })
}

export const prependBookmark = (bookmarks: Bookmark[], newBookmark: Bookmark) => {
  return [newBookmark, ...bookmarks]
}

export const archiveBookmarkById = (bookmarks: Bookmark[], id: string) =>
  updateBookmarkById(bookmarks, id, (bookmark) => ({
    ...bookmark,
    isArchived: true,
  }))

export const unarchiveBookmarkById = (bookmarks: Bookmark[], id: string) =>
  updateBookmarkById(bookmarks, id, (bookmark) => ({
    ...bookmark,
    isArchived: false,
  }))

export const togglePinnedBookmarkById = (bookmarks: Bookmark[], id: string) =>
  updateBookmarkById(bookmarks, id, (bookmark) => ({
    ...bookmark,
    pinned: !bookmark.pinned,
  }))

export const incrementVisitCountById = (bookmarks: Bookmark[], id: string) =>
  updateBookmarkById(bookmarks, id, (bookmark) => ({
    ...bookmark,
    visitCount: bookmark.visitCount + 1,
    lastVisited: new Date().toISOString(),
  }))

export const deleteBookmarkById = (bookmarks: Bookmark[], id: string) =>
  bookmarks.filter((bookmark) => bookmark.id !== id)

export const replaceBookmark = (bookmarks: Bookmark[], editedBookmark: Bookmark) =>
  bookmarks.map((bookmark) => {
    if (bookmark.id !== editedBookmark.id) return bookmark
    return editedBookmark
  })
