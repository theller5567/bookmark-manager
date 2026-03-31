import BookmarkForm from "../BookmarkForm/BookmarkForm";
import ModalShell from "../ModalShell/ModalShell";
import type { NewBookmark } from '../../types/bookmark'
import { normalizeWebsiteUrl, type BookmarkFormValues } from "../../utils/validateBookmarkData";

type AddBookmarkProps = {
  onClose: () => void
  createBookmark: (newBookmark: NewBookmark) => void
}

const AddBookmark = ({ onClose, createBookmark }: AddBookmarkProps) => {
    const addBookmarkAction = ({ title, description, url, tags }: BookmarkFormValues) => {
        const timestamp = Date.now();
        const dateObject = new Date(timestamp);
        const createdDate = dateObject.toLocaleString();
        const normalizedWebsite = normalizeWebsiteUrl(url);
        const faviconUrl = `https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(normalizedWebsite)}&sz=64`;

        const newBookmark: NewBookmark = {
            title,
            url: normalizedWebsite,
            favicon: faviconUrl,
            description,
            tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
            pinned: false,
            isArchived: false,
            createdAt: createdDate,
            lastVisited: null,
            visitCount: 0

        }
        createBookmark(newBookmark)
        onClose();
    }

  return (
    <ModalShell 
      onClose={onClose}
      title="Add bookmark"
      description="Save a link with details to keep your collection organized. We
        extract the favicon automatically from the URL."
       >
        <BookmarkForm
          initialValues={{ title: '', description: '', url: '', tags: '' }}
          onCancel={onClose}
          onSubmit={addBookmarkAction}
          submitLabel="Create Bookmark"
          errorIdPrefix="add-bookmark"
        />
      </ModalShell>
  );
}

export default AddBookmark
