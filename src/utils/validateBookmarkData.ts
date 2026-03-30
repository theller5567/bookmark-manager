export type BookmarkFormValues = {
  title: string
  description: string
  url: string
  tags: string
}

export type BookmarkFormErrors = Partial<Record<keyof BookmarkFormValues, string>>

const normalizeWebsiteUrl = (value: string) => {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return ''
  }

  const normalizedValue = /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : `https://${trimmedValue}`

  try {
    return new URL(normalizedValue).toString()
  } catch {
    return normalizedValue
  }
}

export const validateBookmarkData = (values: BookmarkFormValues): BookmarkFormErrors => {
  const errors: BookmarkFormErrors = {}
  const normalizedWebsite = normalizeWebsiteUrl(values.url)

  if (!values.title.trim()) {
    errors.title = 'Title is required.'
  }
  if (values.title.trim().length < 3) {
    errors.title = 'Title must be larger than 3 characters long.'
  }

  if (!values.description.trim()) {
    errors.description = 'Description is required.'
  }
  if (values.description.trim().length > 280) {
    errors.description = 'Description should be less than 280 characters in length.'
  }

  if (!values.url.trim()) {
    errors.url = 'Website URL is required.'
  } else {
    try {
      new URL(normalizedWebsite)
    } catch {
      errors.url = 'Enter a valid website URL.'
    }
  }

  if (!values.tags.trim()) {
    errors.tags = 'Add at least one tag.'
  }

  return errors
}
