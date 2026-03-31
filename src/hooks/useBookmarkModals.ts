import { useState } from 'react'
import type { Bookmark } from '../types/bookmark'
import type { DialogAction } from '../components/DialogModal/DialogModal'

type DialogState = {
  action: DialogAction
  bookmark: Bookmark
}

type UseBookmarkModalsProps = {
  archiveBookmark: (id: string) => void
  unarchiveBookmark: (id: string) => void
  deleteBookmark: (id: string) => void
}

export const useBookmarkModals = ({
  archiveBookmark,
  unarchiveBookmark,
  deleteBookmark,
}: UseBookmarkModalsProps) => {
  const [isAddBookmarkOpen, setIsAddBookmarkOpen] = useState(false)
  const [isEditBookmarkOpen, setIsEditBookmarkOpen] = useState(false)
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null)
  const [dialogState, setDialogState] = useState<DialogState | null>(null)

  const openAddBookmarkModal = () => {
    setIsAddBookmarkOpen(true)
  }

  const closeAddBookmarkModal = () => {
    setIsAddBookmarkOpen(false)
  }

  const openEditBookmarkModal = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark)
    setIsEditBookmarkOpen(true)
  }

  const closeEditBookmarkModal = () => {
    setIsEditBookmarkOpen(false)
    setEditingBookmark(null)
  }

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

  return {
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
  }
}
