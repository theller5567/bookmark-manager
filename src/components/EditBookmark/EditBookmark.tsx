import BookmarkForm from "../BookmarkForm/BookmarkForm";
import ModalShell from "../ModalShell/ModalShell";
import type { Bookmark } from '../../types/bookmark'
import { normalizeWebsiteUrl, type BookmarkFormValues } from "../../utils/validateBookmarkData";

type EditBookmarkProps = {
  onClose: () => void,
  editBookmark: (bookmark: Bookmark) => void,
  editingBookmark: Bookmark
}

const EditBookmark = ({ onClose, editBookmark, editingBookmark }: EditBookmarkProps) => {
    const editBookmarkAction = ({ title, description, url, tags }: BookmarkFormValues) => {
        const normalizedWebsite = normalizeWebsiteUrl(url);
        const faviconUrl = `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(normalizedWebsite)}&sz=64`;
        const newBookmark: Bookmark = {
            id: editingBookmark.id,
            title,
            url: normalizedWebsite,
            favicon: faviconUrl,
            description,
            tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
            pinned: editingBookmark.pinned,
            isArchived: editingBookmark.isArchived,
            createdAt: editingBookmark.createdAt,
            lastVisited: editingBookmark.lastVisited,
            visitCount: editingBookmark.visitCount

        }
        editBookmark(newBookmark)
        onClose();
    }

  return (
    <ModalShell 
      onClose={onClose}
      title="Edit bookmark"
      description="Update your saved link details — change the title, description, URL, or tags anytime."
       >
        <BookmarkForm
          initialValues={{
            title: editingBookmark.title,
            description: editingBookmark.description,
            url: editingBookmark.url,
            tags: editingBookmark.tags.join(', '),
          }}
          onCancel={onClose}
          onSubmit={editBookmarkAction}
          submitLabel="Update Bookmark"
          errorIdPrefix="edit-bookmark"
        />
      </ModalShell>
  );
}

export default EditBookmark
