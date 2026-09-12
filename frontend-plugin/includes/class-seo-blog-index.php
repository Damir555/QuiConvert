<?php

if (!defined('ABSPATH')) {
    exit;
}

class QuiConvert_SEO_Blog_Index_R20_3 {
    const SHORTCODE = 'quiconvert_blog_index';

    public function init() {
        add_shortcode(self::SHORTCODE, array($this, 'render_shortcode'));
    }

    public function render_shortcode($atts = array()) {
        $atts = shortcode_atts(
            array(
                'heading' => 'h1',
                'posts_per_page' => 9,
            ),
            $atts,
            self::SHORTCODE
        );

        $heading_tag = strtolower((string) $atts['heading']) === 'h2' ? 'h2' : 'h1';
        $posts_per_page = min(24, max(1, absint($atts['posts_per_page'])));
        $paged = max(1, absint(get_query_var('paged')), absint(get_query_var('page')));
        $query = new WP_Query(
            array(
                'post_type' => 'post',
                'post_status' => 'publish',
                'posts_per_page' => $posts_per_page,
                'paged' => $paged,
                'ignore_sticky_posts' => false,
            )
        );

        $cards = '';
        $schema_items = array();
        $position = 1;

        while ($query->have_posts()) {
            $query->the_post();
            $post_id = get_the_ID();
            $permalink = get_permalink($post_id);
            $title = get_the_title($post_id);
            $excerpt = get_the_excerpt($post_id);

            if ($excerpt === '') {
                $excerpt = wp_trim_words(wp_strip_all_tags(strip_shortcodes(get_post_field('post_content', $post_id))), 28);
            }

            $categories = get_the_category($post_id);
            $category_markup = '';

            if (!empty($categories)) {
                $category = $categories[0];
                $category_url = get_category_link($category->term_id);

                if (!is_wp_error($category_url)) {
                    $category_markup = sprintf(
                        '<a class="qc-blog-card__category" href="%s">%s</a>',
                        esc_url($category_url),
                        esc_html($category->name)
                    );
                }
            }

            if ($category_markup === '') {
                $category_markup = '<span class="qc-blog-card__category">' . esc_html__('PDF Guide', 'quiconvert-tools') . '</span>';
            }

            if (has_post_thumbnail($post_id)) {
                $visual = get_the_post_thumbnail(
                    $post_id,
                    $position === 1 ? 'large' : 'medium_large',
                    array(
                        'class' => 'qc-blog-card__image',
                        'loading' => $position === 1 ? 'eager' : 'lazy',
                        'decoding' => 'async',
                    )
                );
            } else {
                $visual = '<div class="qc-blog-card__fallback" aria-hidden="true">' . $this->document_icon() . '</div>';
            }

            $card_classes = 'qc-blog-card';

            if ($position === 1) {
                $card_classes .= ' qc-blog-card--featured';
            }

            $cards .= sprintf(
                '<article class="%1$s"><a class="qc-blog-card__media" href="%2$s" tabindex="-1" aria-hidden="true">%3$s</a><div class="qc-blog-card__body"><div class="qc-blog-card__meta">%4$s<time datetime="%5$s">%6$s</time></div><h2 class="qc-blog-card__title"><a href="%2$s">%7$s</a></h2><p class="qc-blog-card__excerpt">%8$s</p><a class="qc-blog-card__action" href="%2$s">%9$s <span aria-hidden="true">&rarr;</span></a></div></article>',
                esc_attr($card_classes),
                esc_url($permalink),
                $visual,
                $category_markup,
                esc_attr(get_the_date('c', $post_id)),
                esc_html(get_the_date('', $post_id)),
                esc_html($title),
                esc_html($excerpt),
                esc_html__('Read guide', 'quiconvert-tools')
            );

            $schema_items[] = array(
                '@type' => 'ListItem',
                'position' => $position,
                'url' => $permalink,
                'name' => $title,
            );

            $position++;
        }

        wp_reset_postdata();

        if ($cards === '') {
            $cards = '<div class="qc-blog-index__empty"><h2>' . esc_html__('Guides are coming soon', 'quiconvert-tools') . '</h2><p>' . esc_html__('Practical PDF instructions will appear here as they are published.', 'quiconvert-tools') . '</p></div>';
        }

        $pagination = '';

        if ($query->max_num_pages > 1) {
            $links = paginate_links(
                array(
                    'current' => $paged,
                    'total' => (int) $query->max_num_pages,
                    'type' => 'list',
                    'prev_text' => esc_html__('Previous', 'quiconvert-tools'),
                    'next_text' => esc_html__('Next', 'quiconvert-tools'),
                )
            );

            if ($links) {
                $pagination = '<nav class="qc-blog-index__pagination" aria-label="' . esc_attr__('Blog pages', 'quiconvert-tools') . '">' . $links . '</nav>';
            }
        }

        $schema = '';

        if (!empty($schema_items)) {
            $schema = '<script type="application/ld+json">' . wp_json_encode(
                array(
                    '@context' => 'https://schema.org',
                    '@type' => 'ItemList',
                    'itemListElement' => $schema_items,
                ),
                JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
            ) . '</script>';
        }

        return sprintf(
            '<section class="qc-blog-index" aria-labelledby="qc-blog-index-heading"><header class="qc-blog-index__hero"><div class="qc-blog-index__intro"><p class="qc-blog-index__eyebrow">%1$s</p><%2$s id="qc-blog-index-heading">%3$s</%2$s><p>%4$s</p></div><div class="qc-blog-index__hero-art" aria-hidden="true">%5$s</div></header><div class="qc-blog-index__bar"><h2>%6$s</h2><span>%7$s</span></div><div class="qc-blog-index__grid">%8$s</div>%9$s%10$s</section>',
            esc_html__('QUICONVERT GUIDES', 'quiconvert-tools'),
            $heading_tag,
            esc_html__('Practical PDF Guides', 'quiconvert-tools'),
            esc_html__('Clear instructions for organizing, optimizing, editing, and securing PDF documents with the right tool for each task.', 'quiconvert-tools'),
            $this->hero_icon(),
            esc_html__('Latest guides', 'quiconvert-tools'),
            sprintf(esc_html(_n('%d published article', '%d published articles', (int) $query->found_posts, 'quiconvert-tools')), (int) $query->found_posts),
            $cards,
            $pagination,
            $schema
        );
    }

    private function document_icon() {
        return '<svg viewBox="0 0 96 96" role="presentation" focusable="false"><path d="M26 12h31l17 17v55H26z" fill="#fff" stroke="currentColor" stroke-width="4"/><path d="M57 12v18h17" fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M37 47h27M37 59h27M37 71h18" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>';
    }

    private function hero_icon() {
        return '<svg viewBox="0 0 240 180" role="presentation" focusable="false"><rect x="40" y="25" width="112" height="136" rx="16" fill="#edf4ff" stroke="#b9d0ff" stroke-width="2" transform="rotate(-7 96 93)"/><rect x="92" y="18" width="112" height="136" rx="16" fill="#fff" stroke="#84adff" stroke-width="2" transform="rotate(6 148 86)"/><path d="M120 65h54M120 83h54M120 101h38" fill="none" stroke="#155eef" stroke-width="7" stroke-linecap="round"/><circle cx="105" cy="66" r="5" fill="#12b76a"/><circle cx="105" cy="84" r="5" fill="#12b76a"/><circle cx="105" cy="102" r="5" fill="#12b76a"/></svg>';
    }
}
