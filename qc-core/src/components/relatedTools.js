export function createRelatedTools(config = {}) {
    const section = document.createElement("section");
    section.className = "qc-content-section qc-related-tools";

    const heading = document.createElement("div");
    heading.className = "qc-section-heading";
    heading.innerHTML = `<p>${config.eyebrow || "Continue working"}</p><h2>${config.title || "Related tools"}</h2>`;
    section.appendChild(heading);

    const grid = document.createElement("div");
    grid.className = "qc-related-tools__grid";

    for (const tool of config.items || []) {
        const card = document.createElement("a");
        card.className = "qc-related-tool-card";
        card.href = tool.url || "#";

        const title = document.createElement("h3");
        title.textContent = tool.title || "";

        const description = document.createElement("p");
        description.textContent = tool.description || "";

        card.append(title, description);
        grid.appendChild(card);
    }

    section.appendChild(grid);
    return section;
}
