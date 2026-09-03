export function createToolHero(hero = {}) {
    const section = document.createElement("section");
    section.className = "qc-tool-hero";

    const eyebrow = document.createElement("p");
    eyebrow.className = "qc-tool-hero__eyebrow";
    eyebrow.textContent = hero.eyebrow || "PDF tool";

    const title = document.createElement("h1");
    title.textContent = hero.title || "Document workspace";

    const description = document.createElement("p");
    description.className = "qc-tool-hero__description";
    description.textContent = hero.description || "";

    section.append(eyebrow, title, description);

    if (Array.isArray(hero.highlights) && hero.highlights.length > 0) {
        const highlights = document.createElement("ul");
        highlights.className = "qc-tool-hero__highlights";
        for (const text of hero.highlights) {
            const item = document.createElement("li");
            item.textContent = text;
            highlights.appendChild(item);
        }
        section.appendChild(highlights);
    }

    return section;
}
