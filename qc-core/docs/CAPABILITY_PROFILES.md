# QuiConvert Capability Profiles

Version: 1.0  
Status: Draft

## Purpose

Capability Profile describes the requirements and behaviour of a
QuiConvert PDF tool without implementing its processing logic.

The Workspace uses this information to determine:

- which files may be uploaded
- how many files are required
- whether previews are needed
- whether tool options are displayed
- which processing action is available
- what type of result is returned

Capability Profiles do not process files and do not communicate
directly with the backend.

---

# Capability Profile Schema

Each capability contains the following sections:

1. Identity
2. Input
3. Preview
4. Page interaction
5. Options
6. Processing
7. Output
8. Workspace behaviour

---

# Merge PDF

## 1. Identity

| Property | Value |
|---|---|
| ID | `merge` |
| Public name | Merge PDF |
| Description | Combine multiple PDF files into one PDF document. |
| Category | Organize PDF |
| Current status | Implemented |

## 2. Input

| Property | Value |
|---|---|
| Accepted file types | `application/pdf` |
| File extension | `.pdf` |
| Minimum files | 2 |
| Maximum files | Determined by platform limits |
| Multiple files | Yes |
| File reordering | Yes |
| Duplicate file selection | Allowed |
| Maximum individual file size | 5 MB |
| Maximum combined size | Determined by backend configuration |

## 3. Preview

| Property | Value |
|---|---|
| File preview required | No |
| Page thumbnails required | No |
| File information required | Yes |
| Display file name | Yes |
| Display file size | Yes |
| Display page count | Optional for v1 |

## 4. Page interaction

| Property | Value |
|---|---|
| Page selection | No |
| Page reordering | No |
| Page deletion | No |
| Page duplication | No |
| File reordering | Yes |

Merge reorders complete PDF files. It does not reorder individual
pages inside those files.

## 5. Options

| Property | Value |
|---|---|
| Tool options required | No |
| Tool Zone visible | No |

Merge PDF v1 does not require additional processing options.

## 6. Processing

| Property | Value |
|---|---|
| Action label | Merge PDF |
| Dispatcher tool ID | `merge` |
| API endpoint | `/api/pdf/merge` |
| HTTP method | `POST` |
| Upload field | `files` |
| Processing location | Backend |
| Authentication required | No while monetization is disabled |
| Usage limit applies | Yes |

## 7. Output

| Property | Value |
|---|---|
| Output type | PDF |
| MIME type | `application/pdf` |
| Number of output files | 1 |
| Result delivery | Download |
| Default filename | `merged.pdf` |
| Preview result | Not required for v1 |

## 8. Workspace behaviour

### EMPTY

Visible:

- Upload Zone

Message:

`Choose at least two PDF files.`

The Process action is unavailable.

### FILES_READY

This state is entered when at least two valid PDF files are present.

Visible:

- Upload Zone
- Files Zone
- Action Zone

Available actions:

- add files
- remove files
- reorder files
- start processing

### PROCESSING

Visible:

- Upload Zone
- Files Zone
- Status Zone

Behaviour:

- file editing is temporarily disabled
- the Merge PDF action is disabled
- processing status is displayed
- duplicate submissions are prevented

### SUCCESS

Visible:

- Upload Zone
- Files Zone
- Result Zone

Available actions:

- Download PDF
- Start over

The Merge PDF process button is hidden.

Downloading does not immediately clear the Workspace. The user may
download the result again until Start over is selected.

### ERROR

Visible:

- Upload Zone
- Files Zone
- Status or Error Zone
- Action Zone

Available actions:

- Try again
- remove or replace files
- add more files

Uploaded files remain available after an error.

### RESET

Selecting Start over:

- clears uploaded files
- clears the processing result
- clears status and error messages
- returns the Workspace to EMPTY
- does not reload the web page

---

# Merge PDF validation rules

The Workspace must prevent processing when:

- fewer than two files are selected
- a selected file is not a PDF
- an individual file exceeds the upload limit
- the capability is already processing

Invalid files must not silently enter the Files Zone.

Validation messages must explain what the user needs to correct.

---

# Events

The Merge capability participates in these Workspace events:

- `workspace.filesAdded`
- `workspace.fileRemoved`
- `workspace.filesReordered`
- `workspace.processingStarted`
- `workspace.processingSucceeded`
- `workspace.processingFailed`
- `workspace.downloadStarted`
- `workspace.reset`

Event names describe the intended architecture and may be adjusted
during implementation.