<?php

if (!defined('ABSPATH')) {
    exit;
}

class QuiConvert_SEO_Tool_Pages_R18_1 {
    const SHORTCODE = 'quiconvert_tool_page';
    const FLATTEN_ALIAS = 'quiconvert_flatten_pdf';

    private $workspace_renderer;

    public function __construct($workspace_renderer) {
        $this->workspace_renderer = $workspace_renderer;
    }

    public function init() {
        add_shortcode(self::SHORTCODE, array($this, 'render_shortcode'));
        add_shortcode(self::FLATTEN_ALIAS, array($this, 'render_flatten_alias'));
    }

    public function render_shortcode($atts = array()) {
        $atts = shortcode_atts(
            array(
                'tool' => 'merge',
                'class' => '',
                'heading' => 'h1',
            ),
            $atts,
            self::SHORTCODE
        );

        return $this->render_tool_page($atts['tool'], $atts);
    }

    public function render_flatten_alias($atts = array()) {
        $atts = shortcode_atts(
            array(
                'class' => '',
                'heading' => 'h1',
            ),
            $atts,
            self::FLATTEN_ALIAS
        );

        return $this->render_tool_page('flatten', $atts);
    }

    private function render_tool_page($tool_id, $atts) {
        $tools = $this->get_tools();
        $tool_id = sanitize_key($tool_id);

        if (!isset($tools[$tool_id])) {
            return current_user_can('manage_options')
                ? '<div class="quiconvert-react-error">' . esc_html__('Unknown QuiConvert tool.', 'quiconvert-tools') . '</div>'
                : '';
        }

        $tool = $tools[$tool_id];
        $workspace = call_user_func($this->workspace_renderer, $atts['class'], $tool_id, true);

        if (strpos($workspace, 'data-quiconvert-react-root') === false) {
            return $workspace;
        }

        $heading_tag = isset($atts['heading']) && strtolower($atts['heading']) === 'h2' ? 'h2' : 'h1';
        $id_prefix = 'qc-' . sanitize_html_class($tool_id);
        $faq_html = '';
        $schema_entities = array();

        foreach ($tool['faq'] as $item) {
            $faq_html .= sprintf(
                '<details class="qc-seo-faq"><summary>%s</summary><p>%s</p></details>',
                esc_html($item[0]),
                esc_html($item[1])
            );
            $schema_entities[] = array(
                '@type' => 'Question',
                'name' => $item[0],
                'acceptedAnswer' => array(
                    '@type' => 'Answer',
                    'text' => $item[1],
                ),
            );
        }

        $steps_html = '';
        foreach ($tool['steps'] as $step) {
            $steps_html .= '<li>' . esc_html($step) . '</li>';
        }

        $privacy_url = get_privacy_policy_url();
        $privacy_link = $privacy_url
            ? sprintf(
                '<p class="qc-seo-note">%s <a href="%s">%s</a></p>',
                esc_html__('For more information, read our', 'quiconvert-tools'),
                esc_url($privacy_url),
                esc_html__('Privacy Policy', 'quiconvert-tools')
            )
            : '';

        $related_html = $this->render_related_tools($tool['related'], $tools, $id_prefix);
        $schema = array(
            '@context' => 'https://schema.org',
            '@type' => 'FAQPage',
            'mainEntity' => $schema_entities,
        );

        return sprintf(
            '<section class="qc-seo-tool-page qc-seo-tool-page--%1$s" aria-labelledby="%2$s-heading">' .
                '<header class="qc-seo-intro">' .
                    '<p class="qc-seo-eyebrow">%3$s</p>' .
                    '<%4$s id="%2$s-heading">%5$s</%4$s>' .
                    '<p>%6$s</p>' .
                '</header>' .
                '%7$s' .
                '<div class="qc-seo-content">' .
                    '<section aria-labelledby="%2$s-how"><h2 id="%2$s-how">%8$s</h2><ol>%9$s</ol></section>' .
                    '<section aria-labelledby="%2$s-when"><h2 id="%2$s-when">%10$s</h2><p>%11$s</p></section>' .
                    '<section aria-labelledby="%2$s-check"><h2 id="%2$s-check">%12$s</h2><p>%13$s</p>%14$s</section>' .
                    '<section aria-labelledby="%2$s-faq"><h2 id="%2$s-faq">%15$s</h2>%16$s</section>' .
                '</div>' .
                '%17$s' .
                '<script type="application/ld+json">%18$s</script>' .
            '</section>',
            esc_attr($tool_id),
            esc_attr($id_prefix),
            esc_html__('ONLINE PDF TOOL', 'quiconvert-tools'),
            $heading_tag,
            esc_html($tool['title']),
            esc_html($tool['intro']),
            $workspace,
            esc_html($tool['how_title']),
            $steps_html,
            esc_html($tool['when_title']),
            esc_html($tool['when']),
            esc_html($tool['check_title']),
            esc_html($tool['check']),
            $privacy_link,
            esc_html__('Frequently asked questions', 'quiconvert-tools'),
            $faq_html,
            $related_html,
            wp_json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP)
        );
    }

    private function render_related_tools($related_ids, $tools, $id_prefix) {
        $links = array();

        foreach ($related_ids as $related_id) {
            if (!isset($tools[$related_id])) {
                continue;
            }

            $url = $this->find_published_page_url($tools[$related_id]['slugs']);
            if (!$url) {
                continue;
            }

            $links[] = sprintf(
                '<li><a href="%s">%s</a></li>',
                esc_url($url),
                esc_html($tools[$related_id]['link_title'])
            );
        }

        if (!$links) {
            return '';
        }

        $heading_id = $id_prefix . '-related';

        return '<nav class="qc-seo-related" aria-labelledby="' . esc_attr($heading_id) . '">' .
            '<h2 id="' . esc_attr($heading_id) . '">' . esc_html__('Related PDF tools', 'quiconvert-tools') . '</h2>' .
            '<ul>' . implode('', $links) . '</ul></nav>';
    }

    private function find_published_page_url($slugs) {
        foreach ($slugs as $slug) {
            $page = get_page_by_path($slug, OBJECT, 'page');
            if ($page instanceof WP_Post && $page->post_status === 'publish') {
                return get_permalink($page);
            }
        }

        return '';
    }

    private function get_tools() {
        return array(
            'merge' => array(
                'title' => 'Merge PDF Online',
                'link_title' => 'Merge PDF',
                'slugs' => array('merge-pdf', 'merge'),
                'intro' => 'Combine multiple PDF files into one document in the order you choose.',
                'how_title' => 'How to merge PDF files',
                'steps' => array('Select or drop two or more PDF files.', 'Review the file order before processing.', 'Merge and download the combined PDF.'),
                'when_title' => 'When should you merge PDFs?',
                'when' => 'Merge PDFs when related pages or documents need to be shared, printed, or archived as one file.',
                'check_title' => 'Check the document order',
                'check' => 'Review the file order and open the downloaded PDF before deleting your originals.',
                'faq' => array(
                    array('Can I change the order before merging?', 'Yes. Arrange the selected files in the order required before you start processing.'),
                    array('Does merging change the page content?', 'Merging combines the source pages into one file without intentionally changing their visible content.'),
                    array('How many PDFs should I upload?', 'The tool requires at least two PDF files. Practical limits can depend on file size and available processing resources.'),
                ),
                'related' => array('split', 'rearrange', 'compress'),
            ),
            'split' => array(
                'title' => 'Split PDF Online',
                'link_title' => 'Split PDF',
                'slugs' => array('split-pdf', 'split'),
                'intro' => 'Separate one PDF into individual pages or selected page ranges.',
                'how_title' => 'How to split a PDF',
                'steps' => array('Select or drop one PDF file.', 'Choose individual pages or enter the required ranges.', 'Split the document and download the result.'),
                'when_title' => 'When should you split a PDF?',
                'when' => 'Split a PDF when you need smaller documents, separate chapters, or only specific sections of a larger file.',
                'check_title' => 'Verify every output file',
                'check' => 'Open the downloaded files and confirm that every required page is present before discarding the original.',
                'faq' => array(
                    array('Can I split every page into a separate PDF?', 'Yes. Choose the option that separates every page before processing.'),
                    array('Can I select a page range?', 'Yes. You can define the supported pages or ranges shown by the tool.'),
                    array('Does splitting reduce PDF quality?', 'Splitting reorganizes existing pages and is not intended to recompress their visible content.'),
                ),
                'related' => array('merge', 'extract', 'delete'),
            ),
            'rotate' => array(
                'title' => 'Rotate PDF Online',
                'link_title' => 'Rotate PDF',
                'slugs' => array('rotate-pdf', 'rotate'),
                'intro' => 'Rotate all pages in a PDF and save the corrected orientation.',
                'how_title' => 'How to rotate a PDF',
                'steps' => array('Select or drop one PDF file.', 'Choose a 90, 180, or 270 degree rotation.', 'Process and download the rotated PDF.'),
                'when_title' => 'When should you rotate a PDF?',
                'when' => 'Rotate a PDF when scanned or exported pages are sideways or upside down and the corrected orientation must be saved.',
                'check_title' => 'Review the saved orientation',
                'check' => 'Open the result and check several pages to confirm that the selected rotation suits the entire document.',
                'faq' => array(
                    array('Which rotation angles are supported?', 'The tool supports 90, 180, and 270 degree rotations.'),
                    array('Will the rotation remain after download?', 'Yes. The selected orientation is written to the processed PDF.'),
                    array('Can I rotate only one page?', 'This version rotates the document pages together. Use a page-specific editor when individual pages need different angles.'),
                ),
                'related' => array('rearrange', 'delete', 'merge'),
            ),
            'compress' => array(
                'title' => 'Compress PDF Online',
                'link_title' => 'Compress PDF',
                'slugs' => array('compress-pdf', 'compress'),
                'intro' => 'Reduce PDF file size with a selectable compression level for easier sharing.',
                'how_title' => 'How to compress a PDF',
                'steps' => array('Select or drop one PDF file.', 'Choose the preferred compression quality.', 'Compress, download, and compare the result.'),
                'when_title' => 'When should you compress a PDF?',
                'when' => 'Compression is useful when a PDF is too large for email, web upload, or limited storage.',
                'check_title' => 'Balance size and readability',
                'check' => 'Stronger compression can affect image quality. Compare the downloaded file with the original at normal viewing size.',
                'faq' => array(
                    array('Which compression level should I choose?', 'Start with medium quality, then choose lower or higher quality according to the result you need.'),
                    array('Will text remain readable?', 'Text should remain readable, but image-heavy or scanned documents should always be checked after compression.'),
                    array('Why is the size reduction sometimes small?', 'A PDF that is already optimized or mostly contains efficient text and vector data may not become much smaller.'),
                ),
                'related' => array('merge', 'split', 'flatten'),
            ),
            'flatten' => array(
                'title' => 'Flatten PDF Online',
                'link_title' => 'Flatten PDF',
                'slugs' => array('flatten-pdf'),
                'intro' => 'Turn form fields and annotations into fixed PDF page content.',
                'how_title' => 'How to flatten a PDF',
                'steps' => array('Select or drop one PDF file.', 'Choose Flatten PDF and start processing.', 'Download and review the flattened document.'),
                'when_title' => 'When should you flatten a PDF?',
                'when' => 'Flattening is useful before sharing, printing, or archiving a completed form. It is not the same as password protection or a digital signature.',
                'check_title' => 'Keep the editable original',
                'check' => 'Flattening is normally irreversible in the downloaded copy. Keep the original if its fields or annotations may need editing later.',
                'faq' => array(
                    array('What does flattening a PDF do?', 'Flattening converts interactive form fields and annotations into fixed page content so they are no longer editable as separate objects.'),
                    array('Will the flattened PDF look the same?', 'The tool is designed to preserve visible content. Always review the downloaded document before sharing it.'),
                    array('Can I flatten a password-protected PDF?', 'A protected document must be unlocked with the correct password before it can be flattened.'),
                ),
                'related' => array('protect', 'unlock', 'compress'),
            ),
            'rearrange' => array(
                'title' => 'Rearrange PDF Pages Online',
                'link_title' => 'Rearrange PDF Pages',
                'slugs' => array('rearrange-pdf-pages', 'rearrange-pages'),
                'intro' => 'Change the order of PDF pages with a visual page preview.',
                'how_title' => 'How to rearrange PDF pages',
                'steps' => array('Select or drop one PDF file.', 'Drag the page thumbnails into the required order.', 'Process and download the rearranged PDF.'),
                'when_title' => 'When should you rearrange pages?',
                'when' => 'Rearrange pages after scanning, combining, or exporting a document whose pages are not in the intended reading order.',
                'check_title' => 'Review thumbnails and page numbers',
                'check' => 'Confirm the complete sequence before processing, then open the result and check the first and last pages.',
                'faq' => array(
                    array('How do I move a page?', 'Drag its thumbnail to the required position in the page list.'),
                    array('Does rearranging delete pages?', 'No. Rearranging changes page order without intentionally removing pages.'),
                    array('Why are thumbnails important?', 'Thumbnails help identify page content visually before you commit the new order.'),
                ),
                'related' => array('delete', 'duplicate', 'extract'),
            ),
            'delete' => array(
                'title' => 'Delete PDF Pages Online',
                'link_title' => 'Delete PDF Pages',
                'slugs' => array('delete-pdf-pages', 'delete-pages'),
                'intro' => 'Remove unwanted pages from a PDF while keeping the remaining pages in order.',
                'how_title' => 'How to delete PDF pages',
                'steps' => array('Select or drop one PDF file.', 'Mark the page thumbnails you want to remove.', 'Process and download the remaining pages.'),
                'when_title' => 'When should you delete PDF pages?',
                'when' => 'Delete pages to remove blanks, duplicates, outdated sections, or information that should not be included in the new copy.',
                'check_title' => 'Deletion changes the new copy permanently',
                'check' => 'Keep the original PDF and confirm that every required page remains in the downloaded result.',
                'faq' => array(
                    array('Can deleted pages be restored?', 'Not from the processed copy. Keep the original document if you may need those pages later.'),
                    array('Can I delete several pages at once?', 'Yes. Select all supported page thumbnails that should be removed before processing.'),
                    array('Will the remaining pages stay in order?', 'Yes. The retained pages keep their relative order.'),
                ),
                'related' => array('extract', 'rearrange', 'duplicate'),
            ),
            'duplicate' => array(
                'title' => 'Duplicate PDF Pages Online',
                'link_title' => 'Duplicate PDF Pages',
                'slugs' => array('duplicate-pdf-pages', 'duplicate-pages'),
                'intro' => 'Create additional copies of selected pages inside a PDF document.',
                'how_title' => 'How to duplicate PDF pages',
                'steps' => array('Select or drop one PDF file.', 'Choose the pages that need an additional copy.', 'Process and download the updated PDF.'),
                'when_title' => 'When should you duplicate pages?',
                'when' => 'Duplicate pages when a form, separator, template, or repeated section is needed more than once in the same document.',
                'check_title' => 'Confirm each added copy',
                'check' => 'Review the output page count and order to ensure the copies appear where expected.',
                'faq' => array(
                    array('Can I duplicate more than one page?', 'Yes. Select the supported pages that should be copied before processing.'),
                    array('Does duplication replace the original page?', 'No. The original page remains and an additional copy is added.'),
                    array('Will links and forms remain interactive?', 'Interactive PDF features can behave differently after page processing, so check the downloaded result.'),
                ),
                'related' => array('rearrange', 'delete', 'extract'),
            ),
            'extract' => array(
                'title' => 'Extract PDF Pages Online',
                'link_title' => 'Extract PDF Pages',
                'slugs' => array('extract-pdf-pages', 'extract'),
                'intro' => 'Copy selected PDF pages into a new, separate document.',
                'how_title' => 'How to extract PDF pages',
                'steps' => array('Select or drop one PDF file.', 'Choose the pages required in the new document.', 'Extract and download the selected pages.'),
                'when_title' => 'When should you extract pages?',
                'when' => 'Extract pages when only a chapter, form, receipt, or selected section must be shared without the rest of the PDF.',
                'check_title' => 'The original file remains separate',
                'check' => 'The tool creates a new PDF from selected pages. Confirm the selection and open the downloaded document before sharing it.',
                'faq' => array(
                    array('Is extracting the same as deleting?', 'No. Extraction creates a new file from selected pages, while deletion creates a copy without selected pages.'),
                    array('Can I extract non-consecutive pages?', 'Yes. Select the supported individual pages shown in the preview.'),
                    array('Does extraction modify my original PDF?', 'The downloaded result is a separate file. Keep your original document as the source copy.'),
                ),
                'related' => array('delete', 'split', 'merge'),
            ),
            'reverse' => array(
                'title' => 'Reverse PDF Pages Online',
                'link_title' => 'Reverse PDF Pages',
                'slugs' => array('reverse-pdf-pages', 'reverse-pages'),
                'intro' => 'Reverse the complete page order of a PDF with one operation.',
                'how_title' => 'How to reverse PDF pages',
                'steps' => array('Select or drop one PDF file.', 'Review the document and choose Reverse Pages.', 'Process and download the reversed PDF.'),
                'when_title' => 'When should you reverse a PDF?',
                'when' => 'Reverse pages when a scanner, export, or batch process created the complete document in back-to-front order.',
                'check_title' => 'Confirm that the whole document is reversed',
                'check' => 'This operation reverses the complete page sequence. Use Rearrange Pages when only a few pages are misplaced.',
                'faq' => array(
                    array('What happens to the first page?', 'The first page becomes the last page, and the same reversal is applied throughout the document.'),
                    array('Can I reverse only part of a PDF?', 'This tool reverses the complete document. Extract or rearrange pages for a partial change.'),
                    array('Does reversing rotate pages?', 'No. It changes page order, not page orientation.'),
                ),
                'related' => array('rearrange', 'rotate', 'extract'),
            ),
            'page-numbers' => array(
                'title' => 'Add Page Numbers to PDF Online',
                'link_title' => 'Add PDF Page Numbers',
                'slugs' => array('add-page-numbers-pdf', 'page-numbers'),
                'intro' => 'Add consistent page numbers to a PDF for easier reading and reference.',
                'how_title' => 'How to add PDF page numbers',
                'steps' => array('Select or drop one PDF file.', 'Choose Page Numbers and start processing.', 'Download and review the numbered PDF.'),
                'when_title' => 'When should you add page numbers?',
                'when' => 'Page numbers help readers navigate reports, manuals, agreements, and other multi-page documents.',
                'check_title' => 'Check numbering against existing content',
                'check' => 'Review the result for overlap with footers, signatures, or page numbers already present in the original.',
                'faq' => array(
                    array('Does the tool number every page?', 'The current tool applies its standard numbering to the document pages.'),
                    array('Can existing page numbers remain?', 'Existing visible numbers are part of the original content and may remain, so inspect the result for duplicates.'),
                    array('Will page numbers change the page order?', 'No. Numbering is not intended to rearrange the document.'),
                ),
                'related' => array('rearrange', 'merge', 'flatten'),
            ),
            'protect' => array(
                'title' => 'Protect PDF with a Password Online',
                'link_title' => 'Protect PDF',
                'slugs' => array('protect-pdf', 'protect'),
                'intro' => 'Add password protection to a PDF before storing or sharing the new copy.',
                'how_title' => 'How to password-protect a PDF',
                'steps' => array('Select or drop one PDF file.', 'Enter and confirm a password of at least four characters.', 'Protect and download the secured PDF.'),
                'when_title' => 'When should you protect a PDF?',
                'when' => 'Password protection can restrict casual access when a document is stored or transferred, but it does not replace secure delivery practices.',
                'check_title' => 'Store the password safely',
                'check' => 'Test the protected PDF with the correct and an incorrect password. A forgotten password may prevent future access.',
                'faq' => array(
                    array('What is the minimum password length?', 'The current tool requires a password of at least four characters. A longer, unique password is safer.'),
                    array('Can QuiConvert recover a forgotten password?', 'No password-recovery feature is provided. Store the password securely before sharing the file.'),
                    array('Is password protection the same as a digital signature?', 'No. A password controls access, while a digital signature serves a different authenticity and integrity purpose.'),
                ),
                'related' => array('unlock', 'flatten', 'compress'),
            ),
            'unlock' => array(
                'title' => 'Unlock PDF Online',
                'link_title' => 'Unlock PDF',
                'slugs' => array('unlock-pdf', 'unlock'),
                'intro' => 'Remove password protection from a PDF when you know the correct password and have permission.',
                'how_title' => 'How to unlock a PDF',
                'steps' => array('Select or drop one protected PDF file.', 'Enter the document password.', 'Unlock and download the unprotected copy.'),
                'when_title' => 'When should you unlock a PDF?',
                'when' => 'Unlock a PDF you are authorized to access when repeated password entry prevents an intended workflow such as editing or archiving.',
                'check_title' => 'Only unlock documents you may access',
                'check' => 'You must know the correct password and have the owner’s permission. Protect the downloaded unencrypted copy appropriately.',
                'faq' => array(
                    array('Can the tool bypass an unknown password?', 'No. You must provide the correct password to unlock the document.'),
                    array('Does unlocking change visible content?', 'The tool is intended to remove password protection while preserving the document content.'),
                    array('Can I protect the file again later?', 'Yes. Use the Protect PDF tool to create a new password-protected copy.'),
                ),
                'related' => array('protect', 'flatten', 'merge'),
            ),
            'watermark' => array(
                'title' => 'Add a Watermark to PDF Online',
                'link_title' => 'Watermark PDF',
                'slugs' => array('watermark-pdf', 'add-watermark-pdf'),
                'intro' => 'Place custom text across PDF pages with selectable size, color, and opacity.',
                'how_title' => 'How to watermark a PDF',
                'steps' => array('Select or drop one PDF file.', 'Enter watermark text and choose its appearance.', 'Process and download the watermarked PDF.'),
                'when_title' => 'When should you add a watermark?',
                'when' => 'Watermarks can label drafts, confidential copies, samples, or ownership information directly on document pages.',
                'check_title' => 'Keep important content readable',
                'check' => 'Preview the result and confirm that watermark size and opacity do not obscure signatures, form values, or essential text.',
                'faq' => array(
                    array('Can I change watermark opacity?', 'Yes. Choose a supported opacity that keeps both the watermark and document content readable.'),
                    array('Can I choose the watermark text?', 'Yes. Enter the text that should appear on the processed pages.'),
                    array('Does a watermark prove legal ownership?', 'A visible watermark can communicate ownership or status, but it is not automatically legal proof or a digital signature.'),
                ),
                'related' => array('protect', 'flatten', 'page-numbers'),
            ),
        );
    }
}
