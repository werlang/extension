export default class Request {

    static url = 'https://api.owlracle.info';

    constructor({ url, headers }={}) {
        this.url = url || Request.url;
        this.headers = new Headers(headers || {});
    }

    setHeader(key, value) {
        this.headers.set(key, value);
    }

    async get(endpoint, args) {
        return this.request('GET', endpoint, args);
    }

    async post(endpoint, args) {
        return this.request('POST', endpoint, args);
    }

    async request(method, endpoint, data={}) {
        const options = {
            method,
            headers: this.headers,
        };

        if (method === 'POST') {
            options.body = JSON.stringify(data);
            this.headers.set('Content-Type', 'application/json');
        }
        if (method === 'GET') {
            const queryString = new URLSearchParams(data).toString();
            endpoint += '?' + queryString;
        }

        const request = await fetch(`${this.url}/${endpoint}`, options);

        const text = await request.text();
        try {
            return JSON.parse(text);
        }
        catch (e) {
            console.error(e);
            return text;
        }
    }

}
