export const mergeWorkspaceSchema = Object.freeze({
    id: "merge",

    header: {
        brand: "QuiConvert",
        homeUrl: "#",
        navigation: [
            { label: "PDF tools", url: "#related-tools" },
            { label: "About", url: "#trust" }
        ]
    },

    breadcrumb: [
        { label: "Home", url: "#" },
        { label: "PDF tools", url: "#related-tools" },
        { label: "Merge PDF" }
    ],

    hero: {
        eyebrow: "PDF organization",
        title: "Merge PDF files",
        description: "Combine multiple PDF documents into one file in the order you choose.",
        highlights: [
            "Add multiple PDF files",
            "Keep one clear workspace",
            "Download one merged PDF"
        ]
    },

    workspace: {
        development: true,
        tool: "merge",
        apiBase: "http://127.0.0.1:5000",
        uploadFieldName: "files",
        toolbar: {
            badge: "PDF Tool",
            title: "Merge workspace",
            subtitle: "Upload two or more PDFs, review the list, then process them."
        }
    },

    relatedTools: {
        eyebrow: "Continue working",
        title: "Related PDF tools",
        items: [
            { title: "Split PDF", description: "Separate selected pages or ranges.", url: "#" },
            { title: "Rearrange pages", description: "Change the order of pages visually.", url: "#" },
            { title: "Compress PDF", description: "Reduce PDF file size.", url: "#" }
        ]
    },

    faq: {
        eyebrow: "Before you begin",
        title: "Merge PDF questions",
        items: [
            { question: "How many PDF files can I combine?", answer: "The workspace accepts multiple PDF files. Operational limits can be applied later through the product tier and backend configuration." },
            { question: "Does the order of uploaded files matter?", answer: "Yes. The merged document follows the order maintained by the workspace." },
            { question: "What do I receive after processing?", answer: "The result is a single downloadable PDF file." }
        ]
    },

    trust: {
        title: "Built for focused document work",
        items: [
            { title: "One workspace", description: "Uploading, configuration, processing and results stay in one continuous flow." },
            { title: "Clear states", description: "The interface communicates what is uploaded, what is processing and when the result is ready." },
            { title: "Reusable architecture", description: "The same template can present future tools without duplicating page logic." }
        ]
    },

    footer: {
        text: "QuiConvert — Document work, simplified.",
        links: [
            { label: "Privacy", url: "#" },
            { label: "Terms", url: "#" }
        ]
    }
});

export default mergeWorkspaceSchema;
