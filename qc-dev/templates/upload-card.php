<?php
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="qc-upload-card" data-tool="<?php echo esc_attr($tool); ?>">
    <div class="qc-upload-badge">QuiConvert</div>

    <h2>Upload PDF files</h2>

    <p>
        Drag & drop your PDF files here, or choose them from your device.
    </p>

    <div class="qc-dropzone">
        <div class="qc-upload-icon">PDF</div>

        <strong>Drop files here</strong>

        <span>Maximum file size: 5 MB</span>
    </div>

    <input
        type="file"
        class="qc-file-input"
        accept="application/pdf"
        multiple
        hidden
    >

    <button
        type="button"
        class="qc-button qc-choose-button"
    >
        Choose files
    </button>

    <div class="qc-file-list"></div>

    <?php if ($tool === 'split') : ?>
    <div class="qc-tool-options">
        <label class="qc-option">
            <input type="radio" name="qc_split_mode" value="extract" checked>
            Extract selected pages
        </label>

        <label class="qc-option">
            <input type="radio" name="qc_split_mode" value="pages">
            Split into separate pages
        </label>

        <div class="qc-page-ranges">
            <label>
                Page ranges
                <input
                    type="text"
                    class="qc-page-ranges-input"
                    placeholder="Example: 1-3,5,8-10"
                >
            </label>
        </div>
    </div>
<?php endif; ?>

    <button
        type="button"
        class="qc-button qc-process-button"
        disabled
    >
        <?php echo esc_html(ucfirst($tool)); ?> PDF
    </button>

    <div class="qc-status" hidden></div>
</div>