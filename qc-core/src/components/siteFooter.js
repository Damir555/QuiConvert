export function createSiteFooter(config = {}) {
    const footer = document.createElement("footer");
    footer.className = "qc-site-footer";

    const inner = document.createElement("div");
    inner.className = "qc-shell-container qc-site-footer__inner";

    const text = document.createElement("p");
    text.textContent = config.text || `© ${new Date().getFullYear()} QuiConvert`;

    const links = document.createElement("nav");
    links.setAttribute("aria-label", "Footer navigation");
    for (const item of config.links || []) {
        const link = document.createElement("a");
        link.href = item.url || "#";
        link.textContent = item.label || "";
        links.appendChild(link);
    }

    inner.append(text, links);
    footer.appendChild(inner);
    return footer;
}
