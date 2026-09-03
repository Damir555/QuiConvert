export function createTrustSection(config = {}) {
    const section = document.createElement("section");
    section.className = "qc-content-section qc-trust";

    const title = document.createElement("h2");
    title.textContent = config.title || "Your documents stay under your control";
    section.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "qc-trust__grid";

    for (const item of config.items || []) {
        const article = document.createElement("article");
        const heading = document.createElement("h3");
        heading.textContent = item.title || "";
        const text = document.createElement("p");
        text.textContent = item.description || "";
        article.append(heading, text);
        grid.appendChild(article);
    }

    section.appendChild(grid);
    return section;
}
