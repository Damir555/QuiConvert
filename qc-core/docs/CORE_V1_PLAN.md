# QuiConvert Core v1.0 Plan

## 1. Goal

Build a modular frontend core for QuiConvert that is independent of WordPress.

WordPress must act only as a frontend adapter.

Core must contain the reusable application logic.

---

## 2. Core principles

- Core does not depend on WordPress.
- WordPress only provides configuration and page markup.
- Upload logic is separated from tool logic.
- Tools are registered through a tool registry.
- Backend communication is handled only through the API client.
- UI rendering is separated from business logic.

---

## 3. Target folder structure

qc-core/
├─ app/
├─ engine/
├─ tools/
├─ ui/
├─ config/
└─ docs/

---

## 4. First supported tools

- Merge PDF
- Split PDF

---

## 5. Future tools

- Rotate PDF
- Compress PDF
- Watermark PDF
- Sign PDF
- Rearrange PDF

---

## 6. Core v1.0 implementation order

### Step 1
Create base folder structure.

### Step 2
Create app entry files:
- app/main.js
- app/bootstrap.js

### Step 3
Create engine files:
- engine/fileState.js
- engine/uploadEngine.js
- engine/dispatcher.js
- engine/apiClient.js

### Step 4
Create UI files:
- ui/uploadView.js
- ui/fileListView.js
- ui/resultView.js
- ui/errorView.js

### Step 5
Create tools:
- tools/toolRegistry.js
- tools/mergeTool.js
- tools/splitTool.js

### Step 6
Create config:
- config/defaultConfig.js
- config/wordpressAdapter.js

### Step 7
Connect WordPress plugin as adapter.

---

## 7. Non-goals for v1.0

The following are not part of Core v1.0:

- Payments
- User accounts
- Membership limits
- API marketplace
- Email delivery
- Advanced analytics
- Mobile app wrapper

---

## 8. Success criteria

Core v1.0 is successful when:

- Merge works through Core.
- Split works through Core.
- Upload, drag & drop, remove and multi-upload work through Core.
- WordPress only passes configuration.
- No core logic is locked inside WordPress plugin files.