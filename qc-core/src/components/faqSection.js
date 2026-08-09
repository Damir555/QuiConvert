export function createFaqSection(config = {}) {
    const section = document.createElement("section");
    section.className = "qc-content-section qc-faq";

    const heading = document.createElement("div");
    heading.className = "qc-section-heading";
    heading.innerHTML = `<p>${config.eyebrow || "Questions"}</p><h2>${config.title || "Frequently asked questions"}</h2>`;
    section.appendChild(heading);

    const list = document.createElement("div");
    list.className = "qc-faq__list";

    for (const item of config.items || []) {
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = item.question || "";
        const answer = document.createElement("p");
        answer.textContent = item.answer || "";
        details.append(summary, answer);
        list.appendChild(details);
    }

    section.appendChild(list);
    return section;
}
