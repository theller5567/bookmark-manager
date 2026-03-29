import { motion } from "motion/react";
import Button from "../Buttons/Button";
import IconClose from "../../assets/images/icon-close.svg?react"
import "../AddBookmark/addBookmark.css"

export type DialogAction = 'Archive' | 'Unarchive' | 'Delete'

type DialogModalProps = {
    action: DialogAction,
    bookmarkTitle: string,
    onConfirm: () => void,
    onClose: () => void
}

const DialogModal = ({ action, bookmarkTitle, onConfirm, onClose }:DialogModalProps) => {
    const actionCopy = {
      Archive: {
        title: 'Archive bookmark',
        description: `Are you sure you want to archive "${bookmarkTitle}"? You can restore it later from Archived bookmarks.`,
        buttonLabel: 'Archive',
      },
      Unarchive: {
        title: 'Unarchive bookmark',
        description: `Move "${bookmarkTitle}" back to your active bookmarks?`,
        buttonLabel: 'Unarchive',
      },
      Delete: {
        title: 'Delete bookmark',
        description: `Permanently delete "${bookmarkTitle}"? This action cannot be undone.`,
        buttonLabel: 'Delete Permanently',
      },
    } as const

    const content = actionCopy[action]

    const generateActionButton = () => {
        return (
          <Button
            name={content.buttonLabel}
            variant="primary"
            size="large"
            textAlign="center"
            onClick={onConfirm}
          />
        )
    }

  return (
    <motion.div
      className="add-bookmark-modal dialog-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.32, ease: "easeOut"}}
      onClick={onClose}
    >
      <motion.div
        className="form-container"
        initial={{ opacity: 0, y: -100, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.98 }}
        transition={{ duration: 0.30, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
      >
        <button className="close-modal" type="button" aria-label="Close add bookmark modal" onClick={onClose}>
          <IconClose aria-hidden="true" />
        </button>
        <div className="form-header">
            <h1 className="fh-1">{content.title}</h1>
            <h2 className="fh-4 clr-100">
              {content.description}
            </h2>
            <div className="cta-group">
            <Button
              name="Cancel"
              variant="secondary"
              size="large"
              textAlign="center"
              type="button"
              onClick={onClose}
            />
            {generateActionButton()}
          </div>
          </div>
      </motion.div>
    </motion.div>
  )
}

export default DialogModal
