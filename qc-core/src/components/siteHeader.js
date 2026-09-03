export function createSiteHeader(config = {}) {
    const header = document.createElement("header");
    header.className = "qc-site-header";

    const inner = document.createElement("div");
    inner.className = "qc-shell-container qc-site-header__inner";

    const brand = document.createElement("a");
    brand.className = "qc-site-header__brand";
    brand.href = config.homeUrl || "#";
    brand.textContent = config.brand || "QuiConvert";

    const navigation = document.createElement("nav");
    navigation.className = "qc-site-header__nav";
    navigation.setAttribute("aria-label", "Primary navigation");

    for (const item of config.navigation || []) {
        const link = document.createElement("a");
        link.href = item.url || "#";
        link.textContent = item.label || "";
        navigation.appendChild(link);
    }

    inner.append(brand, navigation);
    header.appendChild(inner);
    return header;
}
