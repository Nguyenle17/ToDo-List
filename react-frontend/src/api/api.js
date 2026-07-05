const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

async function parseErrorMessage(response, fallback) {
    try {
        const data = await response.json();
        if (data && typeof data.message === 'string') return data.message;
    } catch {
        
    }
    return fallback;
}

async function parseBody(response) {
    const text = await response.text();
    if (!text) return null;
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

class Api {
    constructor() {
        this.BASE_URL = API_URL;
    }

    async get(ENDPOINT) {
        const response = await fetch(this.BASE_URL + ENDPOINT, {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(await parseErrorMessage(response, `GET ${ENDPOINT} failed: ${response.status}`));
        }
        
        return parseBody(response);
    }

    async post(ENDPOINT, DATA, HEADERS = 'application/json') {
        const isFormData = DATA instanceof FormData;
        const response = await fetch(this.BASE_URL + ENDPOINT, {
            method: 'POST',
            credentials: 'include',
            headers: isFormData ? {} : { 'Content-Type': HEADERS },
            body: isFormData ? DATA : JSON.stringify(DATA),
        });

        if (!response.ok) {
            throw new Error(await parseErrorMessage(response, `POST ${ENDPOINT} failed: ${response.status}`));
        }
        return parseBody(response);
    }

    async put(ENDPOINT, DATA, HEADERS = 'application/json') {
        const isFormData = DATA instanceof FormData;

        const response = await fetch(this.BASE_URL + ENDPOINT, {
            method: 'PUT',
            credentials: 'include',
            headers: isFormData ? {} : { 'Content-Type': HEADERS },
            body: isFormData ? DATA : JSON.stringify(DATA),
        });

        if (!response.ok) {
            throw new Error(await parseErrorMessage(response, `PUT ${ENDPOINT} failed: ${response.status}`));
        }
        return parseBody(response);
    }

    async patch(ENDPOINT, DATA, HEADERS = 'application/json') {
        const isFormData = DATA instanceof FormData;

        const response = await fetch(this.BASE_URL + ENDPOINT, {
            method: 'PATCH',
            credentials: 'include',
            headers: isFormData ? {} : { 'Content-Type': HEADERS },
            body: isFormData ? DATA : (DATA !== undefined ? JSON.stringify(DATA) : undefined),
        });

        if (!response.ok) {
            throw new Error(await parseErrorMessage(response, `PATCH ${ENDPOINT} failed: ${response.status}`));
        }
        return parseBody(response);
    }

    async delete(ENDPOINT) {
        const response = await fetch(this.BASE_URL + ENDPOINT, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error(await parseErrorMessage(response, `DELETE ${ENDPOINT} failed: ${response.status}`));
        }
        return parseBody(response);
    }
}

export default new Api();