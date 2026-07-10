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

    const blob = await response.blob();

    const contentDisposition = response.headers.get('Content-Disposition');

    let filename = 'quiconvert-result.pdf';

    if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
            /filename\*?=(?:UTF-8''|["']?)([^;"']+)/
        );

        if (filenameMatch?.[1]) {
            filename = decodeURIComponent(filenameMatch[1].replace(/["']/g, ''));
        }
    }

    return {
        blob,
        filename
    };
}