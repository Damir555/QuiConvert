import './App.css'

const tools = [
  'Merge PDF',
  'Split PDF',
  'Rotate PDF',
  'Compress PDF',
  'Rearrange Pages',
  'Delete Pages',
  'Duplicate Pages',
  'Extract Pages',
  'Reverse Pages',
  'Page Numbers',
  'Protect PDF',
  'Unlock PDF',
  'Watermark PDF',
]

function App() {
  return (
    <div className="qc-app">
      <header className="qc-topbar">
        <div className="qc-brand">
          <span className="qc-brand__mark" aria-hidden="true">Q</span>
          <div>
            <strong className="qc-brand__name">QuiConvert</strong>
            <span className="qc-brand__tagline">PDF workspace</span>
          </div>
        </div>

        <div className="qc-topbar__actions">
          <span className="qc-env-badge">React migration</span>
          <button type="button" className="qc-button qc-button--ghost">Reset</button>
        </div>
      </header>

      <main className="qc-workspace">
        <aside className="qc-panel qc-tools">
          <div className="qc-panel__header">
            <div>
              <p className="qc-eyebrow">Workspace</p>
              <h2>PDF Tools</h2>
            </div>
          </div>

          <div className="qc-tool-list" role="list">
            {tools.map((tool, index) => (
              <button
                key={tool}
                type="button"
                className={`qc-tool-item ${index === 0 ? 'is-active' : ''}`}
              >
                <span className="qc-tool-item__dot" aria-hidden="true" />
                <span>{tool}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="qc-main-column">
          <section className="qc-panel qc-files">
            <div className="qc-panel__header qc-panel__header--row">
              <div>
                <p className="qc-eyebrow">Input</p>
                <h2>Files</h2>
              </div>
              <button type="button" className="qc-button qc-button--primary">Add PDF</button>
            </div>

            <div className="qc-dropzone">
              <div className="qc-dropzone__icon" aria-hidden="true">PDF</div>
              <div>
                <h3>Drop PDF files here</h3>
                <p>or choose files from your computer</p>
              </div>
            </div>

            <div className="qc-file-row">
              <div className="qc-file-row__icon" aria-hidden="true">PDF</div>
              <div className="qc-file-row__content">
                <strong>Example-document.pdf</strong>
                <span>Preview shell only — no file logic connected yet</span>
              </div>
              <span className="qc-status-badge">Ready</span>
            </div>
          </section>

          <section className="qc-panel qc-preview">
            <div className="qc-panel__header qc-panel__header--row">
              <div>
                <p className="qc-eyebrow">Document</p>
                <h2>Preview</h2>
              </div>
              <div className="qc-preview__toolbar">
                <button type="button" className="qc-icon-button" aria-label="Previous page">←</button>
                <span>Page 1 of 1</span>
                <button type="button" className="qc-icon-button" aria-label="Next page">→</button>
              </div>
            </div>

            <div className="qc-preview__body">
              <div className="qc-preview__stage">
                <div className="qc-paper">
                  <div className="qc-paper__logo">QuiConvert</div>
                  <div className="qc-paper__line qc-paper__line--wide" />
                  <div className="qc-paper__line" />
                  <div className="qc-paper__line qc-paper__line--short" />
                  <div className="qc-paper__block" />
                  <div className="qc-paper__line qc-paper__line--wide" />
                  <div className="qc-paper__line" />
                </div>
              </div>

              <aside className="qc-document-details">
                <h3>Document details</h3>
                <dl>
                  <div><dt>Status</dt><dd>Ready</dd></div>
                  <div><dt>Pages</dt><dd>1</dd></div>
                  <div><dt>Active page</dt><dd>1</dd></div>
                  <div><dt>Engine</dt><dd>Not connected</dd></div>
                </dl>
              </aside>
            </div>
          </section>

          <section className="qc-bottom-grid">
            <section className="qc-panel qc-action">
              <div className="qc-panel__header">
                <div>
                  <p className="qc-eyebrow">Tool settings</p>
                  <h2>Merge PDF</h2>
                </div>
              </div>
              <p className="qc-muted">
                Tool controls will be migrated here after the application shell is accepted.
              </p>
              <button type="button" className="qc-button qc-button--primary qc-button--wide">
                Process PDF
              </button>
            </section>

            <section className="qc-panel qc-result">
              <div className="qc-panel__header">
                <div>
                  <p className="qc-eyebrow">Output</p>
                  <h2>Result</h2>
                </div>
              </div>
              <div className="qc-result__empty">Processed files will appear here.</div>
            </section>
          </section>
        </section>
      </main>
    </div>
  )
}

export default App
