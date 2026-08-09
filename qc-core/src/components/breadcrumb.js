export function createBreadcrumb(items = []) {
    const nav = document.createElement("nav");
    nav.className = "qc-breadcrumb";
    nav.setAttribute("aria-label", "Breadcrumb");

    const list = document.createElement("ol");

    items.forEach((item, index) => {
        const entry = document.createElement("li");
        const isLast = index === items.length - 1;

        if (isLast || !item.url) {
            const label = document.createElement("span");
            label.textContent = item.label || "";
            if (isLast) label.setAttribute("aria-current", "page");
            entry.appendChild(label);
        } else {
            const link = document.createElement("a");
            link.href = item.url;
            link.textContent = item.label || "";
            entry.appendChild(link);
        }

        list.appendChild(entry);
    });

    nav.appendChild(list);
    return nav;
}
