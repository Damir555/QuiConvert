# QuiConvert Architecture v1

## Goal

QuiConvert is a PDF processing platform, not just a WordPress plugin.

WordPress is used as the presentation layer during development.
The long-term application logic lives in:

- frontend engine
- backend API
- PDF processing services

## Current Plugin

Main development plugin:

```text
qc-dev/

The old frontend-plugin/ is archived and should not be edited.

File Structure:
qc-dev/
├── qc-dev.php
├── includes/
│   ├── loader.php
│   ├── version.php
│   ├── assets.php
│   └── shortcodes.php
├── templates/
│   └── upload-card.php
├── assets/
│   ├── css/
│   │   └── qc-upload.css
│   └── js/
│       └── qc-upload.js
└── docs/
    └── ARCHITECTURE.md

Responsibilities 
qc_dev.php
bootstrap only
It must not contain UI, shortcode HTML, CSS; JS or business logic.

Allowed:
require_once __DIR__ . '/includes/loader.php';

loader.php

Loads plugin modules.

version.php

Defines plugin constants and asset version.

assets.php

Loads CSS and JS.

Also passes backend API configuration to JavaScript via qcConfig.

shortcodes.php

Registers WordPress shortcodes.

upload-card.php

Contains HTML markup for the upload component.

qc-upload.js

Controls upload interaction:

choose files
drag and drop
file list
remove file
process button
backend request
download link
qc-upload.css

Controls visual styling of the upload component.

Frontend Engine Principle

There should be one upload engine for all tools.

Tools are selected by:

data-tool="merge"
data-tool="split"
data-tool="rotate"
data-tool="compress"

JavaScript reads the tool name and selects the correct backend endpoint.

API Configuration

Backend URLs are not hardcoded in JavaScript.

They are passed from PHP:

qcConfig.api.merge
qcConfig.api.split
qcConfig.api.compress
qcConfig.api.rotate
Development Rules
Do not edit frontend-plugin/.
Do not put shortcode HTML inside qc-dev.php.
One logical change at a time.
After changing JS or CSS, increase QC_DEV_VERSION.
Use SFTP for deployment.
Test after every upload.
Do not add a new tool by copying the whole upload engine.
Next Goals
Improve loading/status UI.
Improve download card.
Add tool configuration.
Add Split PDF using same upload engine.
Add Rotate PDF using same upload engine.

Kad spremiš, napravi SFTP upload te datoteke ili cijele mape `docs`.

Zatim idemo na sljedeći korak: **tool configuration v1**.