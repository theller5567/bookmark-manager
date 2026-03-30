import { motion } from "motion/react";
import { useState } from "react"
import InputField from "../Inputs/InputField";
import IconClose from "../../assets/images/icon-close.svg?react"
import Button from "../Buttons/Button"
import type { Bookmark } from '../../types/bookmark'
import { type BookmarkFormErrors, validateBookmarkData } from "../../utils/validateBookmarkData";
import "../AddBookmark/addBookmark.css"

type EditBookmarkProps = {
  onClose: () => void,
  editBookmark: (bookmark: Bookmark) => void,
  editingBookmark: Bookmark
}

const EditBookmark = ({ onClose, editBookmark, editingBookmark }: EditBookmarkProps) => {
    const [title, setTitle] = useState(editingBookmark.title);
    const [description, setDescription] = useState(editingBookmark.description);
    const [website, setWebsite] = useState(editingBookmark.url);
    const [tags, setTags] = useState(editingBookmark.tags.join(", "));
    const [errors, setErrors] = useState<BookmarkFormErrors>({});

    const normalizeWebsiteUrl = (value: string) => {
        const trimmedValue = value.trim();
        if (!trimmedValue) return "";

        const normalizedValue = /^https?:\/\//i.test(trimmedValue)
          ? trimmedValue
          : `https://${trimmedValue}`;

        try {
          return new URL(normalizedValue).toString();
        } catch {
          return normalizedValue;
        }
    };

    const editBookmarkAction = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextErrors = validateBookmarkData({
          title,
          description,
          url: website,
          tags,
        });

        if (Object.keys(nextErrors).length > 0) {
          setErrors(nextErrors);
          return;
        }

        setErrors({});
        const normalizedWebsite = normalizeWebsiteUrl(website);
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
        <form id="addBookmark" onSubmit={editBookmarkAction}>
          <div className="form-header">
            <h1 className="fh-1">Edit bookmark</h1>
            <h2 className="fh-4 clr-100">
            Update your saved link details — change the title, description, URL, or tags anytime.
            </h2>
          </div>
          <div className="input-container">
            <label className="fh-4" htmlFor="title" data-att="required">
              Title
            </label>
            <InputField
              id="title"
              type="text"
              name="title"
              value={title}
              ariaInvalid={Boolean(errors.title)}
              ariaDescribedby={errors.title ? "edit-title-error" : undefined}
              onChange={(event) => {
                setTitle(event.target.value)
                setErrors((currentErrors) => ({ ...currentErrors, title: undefined }))
              }}
              required
            />
            {errors.title && <p id="edit-title-error" className="input-error fh-5">{errors.title}</p>}
          </div>
          <div className="input-container">
            <label className="fh-4" htmlFor="description" data-att="required">
              Description
            </label>
            <InputField
              id="description"
              type="textarea"
              name="description"
              value={description}
              ariaInvalid={Boolean(errors.description)}
              ariaDescribedby={errors.description ? "edit-description-error" : undefined}
              onChange={(event) => {
                setDescription(event.target.value)
                setErrors((currentErrors) => ({ ...currentErrors, description: undefined }))
              }}
              required
            />
            {errors.description && <p id="edit-description-error" className="input-error fh-5">{errors.description}</p>}
          </div>
          <div className="input-container">
            <label className="fh-4" htmlFor="website" data-att="required">
              Website URL
            </label>
            <InputField
              id="website"
              type="text"
              name="website"
              value={website}
              ariaInvalid={Boolean(errors.url)}
              ariaDescribedby={errors.url ? "edit-website-error" : undefined}
              onChange={(event) => {
                setWebsite(event.target.value)
                setErrors((currentErrors) => ({ ...currentErrors, url: undefined }))
              }}
              required
            />
            {errors.url && <p id="edit-website-error" className="input-error fh-5">{errors.url}</p>}
          </div>
          <div className="input-container">
            <label className="fh-4" htmlFor="tags" data-att="required">
              Tags
            </label>
            <InputField
              id="tags"
              type="text"
              name="tags"
              value={tags}
              placeholder="e.g. Design, Learning, Tools"
              ariaInvalid={Boolean(errors.tags)}
              ariaDescribedby={errors.tags ? "edit-tags-error" : undefined}
              onChange={(event) => {
                setTags(event.target.value)
                setErrors((currentErrors) => ({ ...currentErrors, tags: undefined }))
              }}
              required
            />
            {errors.tags && <p id="edit-tags-error" className="input-error fh-5">{errors.tags}</p>}
          </div>
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
              name="Update Bookmark"
              variant="primary"
              size="large"
              textAlign="center"
              type="submit"
            />
            
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default EditBookmark
