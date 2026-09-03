<div class="qc-tool qc512-dropzone">
    <div class="qc-upload-card">
        <div class="qc-upload-icon">PDF</div>

        <div class="qc-upload-title">Drag & drop your files here</div>
        <div class="qc-upload-subtitle">or choose files from your device</div>

        <button type="button" class="qc-button-primary qc512-choose">
            Choose files
        </button>

        <input type="file" class="qc512-file-input" accept="application/pdf"<?php echo $input_multiple; ?> hidden />

        <?php require __DIR__ . '/components/file-list.php'; ?>

        <div class="qc-status">
            Files are processed securely and deleted automatically.
        </div>
    </div>
</div>
