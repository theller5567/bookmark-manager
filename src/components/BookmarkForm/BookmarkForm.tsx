import { useState } from "react"
import InputField from "../Inputs/InputField";
import Button from "../Buttons/Button"
import { type BookmarkFormErrors, type BookmarkFormValues, validateBookmarkData } from "../../utils/validateBookmarkData";

type BookmarkFormProps = {
  initialValues: BookmarkFormValues
  onCancel: () => void
  onSubmit: (values: BookmarkFormValues) => void
  submitLabel: string
  errorIdPrefix: string
}

const BookmarkForm = ({ initialValues, onCancel, onSubmit, submitLabel, errorIdPrefix }: BookmarkFormProps) => {
    const [title, setTitle] = useState(initialValues.title);
    const [description, setDescription] = useState(initialValues.description);
    const [url, setUrl] = useState(initialValues.url);
    const [tags, setTags] = useState(initialValues.tags);
    const [errors, setErrors] = useState<BookmarkFormErrors>({});

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const values = {
          title,
          description,
          url,
          tags,
        };
        const nextErrors = validateBookmarkData(values);

        if (Object.keys(nextErrors).length > 0) {
          setErrors(nextErrors);
          return;
        }

        setErrors({});
        onSubmit(values);
    }

  return (
        <form id="bookmarkForm" onSubmit={handleSubmit}>
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
              ariaDescribedby={errors.title ? `${errorIdPrefix}-title-error` : undefined}
              onChange={(event) => {
                setTitle(event.target.value)
                setErrors((currentErrors) => ({ ...currentErrors, title: undefined }))
              }}
              required
            />
            {errors.title && <p id={`${errorIdPrefix}-title-error`} className="input-error fh-5">{errors.title}</p>}
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
              ariaDescribedby={errors.description ? `${errorIdPrefix}-description-error` : undefined}
              onChange={(event) => {
                setDescription(event.target.value)
                setErrors((currentErrors) => ({ ...currentErrors, description: undefined }))
              }}
              required
            />
            {errors.description && <p id={`${errorIdPrefix}-description-error`} className="input-error fh-5">{errors.description}</p>}
          </div>
          <div className="input-container">
            <label className="fh-4" htmlFor="url" data-att="required">
              Website URL
            </label>
            <InputField
              id="url"
              type="text"
              name="url"
              value={url}
              ariaInvalid={Boolean(errors.url)}
              ariaDescribedby={errors.url ? `${errorIdPrefix}-url-error` : undefined}
              onChange={(event) => {
                setUrl(event.target.value)
                setErrors((currentErrors) => ({ ...currentErrors, url: undefined }))
              }}
              required
            />
            {errors.url && <p id={`${errorIdPrefix}-url-error`} className="input-error fh-5">{errors.url}</p>}
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
              ariaDescribedby={errors.tags ? `${errorIdPrefix}-tags-error` : undefined}
              onChange={(event) => {
                setTags(event.target.value)
                setErrors((currentErrors) => ({ ...currentErrors, tags: undefined }))
              }}
              required
            />
            {errors.tags && <p id={`${errorIdPrefix}-tags-error`} className="input-error fh-5">{errors.tags}</p>}
          </div>
          <div className="cta-group">
            <Button
              name="Cancel"
              variant="secondary"
              size="large"
              textAlign="center"
              type="button"
              onClick={onCancel}
            />
            <Button
              name={submitLabel}
              variant="primary"
              size="large"
              textAlign="center"
              type="submit"
            />
          </div>
        </form>
  );
}

export default BookmarkForm
