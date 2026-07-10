export async function postPdfTool(config, endpoint, formData) {
    const url = `${config.apiBase}${endpoint}`;

    const requestOptions = {
        method: 'POST',
        body: formData
    };

    if (config.apiKey) {
        requestOptions.headers = {
            'x-api-key': config.apiKey
        };
    }

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
    }

    return await response.blob();
}