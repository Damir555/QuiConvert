<div class="qc512-tool" data-default-action="<?php echo esc_attr($action); ?>">
    <div class="qc512-header">
        <h2 class="qc512-title"><?php echo esc_html($title); ?></h2>
        <p class="qc512-subtitle"><?php echo esc_html($subtitle); ?></p>
    </div>

    <?php include QUICONVERT_PLUGIN_DIR . 'templates/upload.php'; ?>

    <div class="qc512-actions">
        <?php foreach ($tools as $tool_id => $tool) : ?>
            <?php if ($action === 'all' || $action === $tool_id) : ?>
                <button
                    type="button"
                    class="qc512-action <?php echo ($action === $tool_id || ($action === 'all' && $tool_id === 'merge')) ? 'qc512-primary' : ''; ?>"
                    data-action="<?php echo esc_attr($tool_id); ?>">
                    <?php echo esc_html($tool['button']); ?>
                </button>
            <?php endif; ?>
        <?php endforeach; ?>
    </div>

    <?php if ($action === 'all' || $action === 'split') : ?>
        <div class="qc512-options qc512-split-options <?php echo $action === 'split' ? 'qc512-visible' : ''; ?>">
            <label class="qc512-label">Pages or ranges</label>
            <input type="text" class="qc512-split-pages" placeholder="Example: 1-3,5,8 — leave empty to split every page" />
            <p class="qc512-help">Leave empty to create a ZIP file with every page as a separate PDF.</p>
        </div>
    <?php endif; ?>

    <?php if ($atts['show_email'] === 'true') : ?>
        <div class="qc512-email-box">
            <label class="qc512-label">Email (optional)</label>
            <input type="email" class="qc512-email-input" placeholder="you@example.com" />
        </div>
    <?php endif; ?>

    <p class="qc512-limit">Free upload limit: <?php echo esc_html(QuiConvert_Config_512::max_upload_mb()); ?> MB per file.</p>

    <?php include QUICONVERT_PLUGIN_DIR . 'templates/result.php'; ?>
</div>
