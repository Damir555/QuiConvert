export async function postPdfTool(config, endpoint, formData) {
    const url = `${config.apiBase}${endpoint}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'x-api-key': config.apiKey
        },
        body: formData
    });

    if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
    }

    return await response.blob();
}