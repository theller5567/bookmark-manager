import { motion } from "motion/react";
import { useState } from "react"
import InputField from "../Inputs/InputField";
import IconClose from "../../assets/images/icon-close.svg?react"
import type { NewBookmark } from '../../types/bookmark'
import "./addBookmark.css"

type AddBookmarkProps = {
  onClose: () => void
  createBookmark: (newBookmark: NewBookmark) => void
}

const AddBookmark = ({ onClose, createBookmark }: AddBookmarkProps) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [website, setWebsite] = useState("");
    const [tags, setTags] = useState("");

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

    const addBookmarkAction = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const timestamp = Date.now();
        const dateObject = new Date(timestamp);
        const createdDate = dateObject.toLocaleString();
        const normalizedWebsite = normalizeWebsiteUrl(website);
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
        <form id="addBookmark" onSubmit={addBookmarkAction}>
          <div className="form-header">
            <h1 className="fh-1">Add bookmark</h1>
            <h2 className="fh-4 clr-100">
              Save a link with details to keep your collection organized. We
              extract the favicon automatically from the URL.
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
              onChange={(event) => setTitle(event.target.value)}
              required
            />
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
              onChange={(event) => setDescription(event.target.value)}
              required
            />
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
              onChange={(event) => setWebsite(event.target.value)}
              required
            />
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
              onChange={(event) => setTags(event.target.value)}
              required
            />
          </div>
          
        </form>
      </motion.div>
    </motion.div>
  );
}

export default AddBookmark
