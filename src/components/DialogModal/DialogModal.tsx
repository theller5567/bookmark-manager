import Button from "../Buttons/Button";
import ModalShell from "../ModalShell/ModalShell";

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

  return (
    <ModalShell
      onClose={onClose}
      title={content.title}
      description={content.description}
    >
      <div className="cta-group">
        <Button
          name="Cancel"
          variant="secondary"
          size="large"
          textAlign="center"
          type="button"
          onClick={onClose}
        />
        <Button
          name={content.buttonLabel}
          variant="primary"
          size="large"
          textAlign="center"
          onClick={onConfirm}
        />
      </div>
    </ModalShell>
  )
}

export default DialogModal
