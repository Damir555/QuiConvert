const SESSION_STORAGE_KEY =
    'quiconvertSessionId';

export async function postPdfTool(
    config,
    endpoint,
    formData
) {
    const url =
        `${config.apiBase}${endpoint}`;

    const headers = {
        'x-session-id':
            getOrCreateSessionId()
    };

    if (config.apiKey) {
        headers['x-api-key'] =
            config.apiKey;
    }

    const response = await fetch(
        url,
        {
            method: 'POST',
            headers,
            body: formData
        }
    );

    if (!response.ok) {
        const message =
            await getBackendErrorMessage(
                response
            );

        throw new Error(message);
    }

    const blob =
        await response.blob();

    const contentDisposition =
        response.headers.get(
            'Content-Disposition'
        );

    let filename =
        'quiconvert-result.pdf';

    if (contentDisposition) {
        const filenameMatch =
            contentDisposition.match(
                /filename\*?=(?:UTF-8''|["']?)([^;"']+)/
            );

        if (filenameMatch?.[1]) {
            filename =
                decodeURIComponent(
                    filenameMatch[1]
                        .replace(/["']/g, '')
                        .trim()
                );
        }
    }

    return {
        blob,
        filename
    };
}

function getOrCreateSessionId() {
    try {
        let sessionId =
            localStorage.getItem(
                SESSION_STORAGE_KEY
            );

        if (sessionId) {
            return sessionId;
        }

        sessionId =
            createSessionId();

        localStorage.setItem(
            SESSION_STORAGE_KEY,
            sessionId
        );

        return sessionId;
    } catch (error) {
        console.warn(
            '[QuiConvert Core] ' +
            'Session storage unavailable:',
            error
        );

        return createSessionId();
    }
}

function createSessionId() {
    if (
        window.crypto &&
        typeof window.crypto.randomUUID ===
            'function'
    ) {
        return window.crypto.randomUUID();
    }

    return (
        'qc-' +
        Date.now().toString(36) +
        '-' +
        Math.random()
            .toString(36)
            .slice(2)
    );
}

async function getBackendErrorMessage(
    response
) {
    const fallback =
        `Backend error: ${response.status}`;

    try {
        const raw =
            await response.text();

        if (!raw) {
            return fallback;
        }

        try {
            const data =
                JSON.parse(raw);

            return (
                data.error ||
                data.message ||
                fallback
            );
        } catch {
            return raw;
        }
    } catch {
        return fallback;
    }
}