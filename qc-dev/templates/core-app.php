<?php

if (!defined('ABSPATH')) {
    exit;
}
?>

<div
    id="<?php echo esc_attr($instance_id); ?>"
    class="qc-core-app"
    data-tool="<?php echo esc_attr($tool); ?>"
>
    <div class="qc-upload-card">
        <p>
            <strong>Drag &amp; drop files here</strong>
        </p>

        <p>or choose files manually</p>

        <input
            class="qc-file-input"
            type="file"
        >
    </div>

    <div class="qc-file-list-container"></div>

    <div class="qc-tool-options-container"></div>

    <button
        class="qc-process-button"
        type="button"
    >
        Process file
    </button>

    <div
        class="qc-result-container"
        aria-live="polite"
    ></div>
</div>