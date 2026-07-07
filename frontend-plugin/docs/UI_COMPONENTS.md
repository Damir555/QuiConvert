# QuiConvert UI Components

## Goal

QuiConvert UI should feel like a modern web application, not a typical WordPress page.

All tools should share the same visual language, layout, spacing, buttons, upload behavior and result flow.

---

## Core Components

### 1. Upload Card

Used for file selection and drag & drop upload.

CSS classes:

- `qc-tool`
- `qc-upload-card`
- `qc-upload-icon`
- `qc-upload-title`
- `qc-upload-subtitle`
- `qc-file-list`
- `qc-status`

Used by:

- Merge PDF
- Split PDF
- Compress PDF
- Rotate PDF
- Watermark PDF
- Protect PDF
- Unlock PDF
- Page Numbers
- Image to PDF

---

### 2. Primary Button

Used for the main action on every tool page.

Examples:

- Merge PDF
- Split PDF
- Add Watermark
- Protect PDF
- Convert to PDF

CSS class:

- `qc-button-primary`

Rule:

Each tool page should have only one primary action.

---

### 3. File Item

Used to display selected files.

Should show:

- file icon
- file name
- file size
- remove button

Future CSS classes:

- `qc-file-item`
- `qc-file-name`
- `qc-file-size`
- `qc-file-remove`

---

### 4. Tool Options

Used when a tool needs configuration.

Examples:

- Rotate angle
- Watermark text
- Watermark color
- Password
- Page ranges

Future CSS classes:

- `qc-options`
- `qc-option-group`
- `qc-input`
- `qc-select`

---

### 5. Progress

Used while uploading and processing.

Should show:

- uploading state
- processing state
- percentage if available

Future CSS classes:

- `qc-progress`
- `qc-progress-bar`
- `qc-progress-label`

---

### 6. Result Card

Used after successful processing.

Should show:

- success message
- download button
- file deletion notice

Future CSS classes:

- `qc-result`
- `qc-result-success`
- `qc-download-button`

---

### 7. Error Message

Used when processing fails.

Should show:

- clear error message
- retry option

Future CSS classes:

- `qc-error`
- `qc-error-message`
- `qc-retry-button`

---

## UX Rules

1. One tool page = one main action.
2. The user should understand the page in less than 3 seconds.
3. Upload should always be visually obvious.
4. Errors should be human-readable.
5. Every result page should include a download button.
6. Every tool should communicate that files are deleted automatically.
7. All custom classes must start with `qc-`.

---

## MVP Priority

For Plugin 7.0, build components in this order:

1. Upload Card
2. File Item
3. Primary Button
4. Progress
5. Result Card
6. Tool Options
7. Error Message
