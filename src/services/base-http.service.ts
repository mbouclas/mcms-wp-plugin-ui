import {get} from "svelte/store";
import {appStore} from "../stores/app";

export class BaseHttpService {
    baseUrl: string;

    constructor() {
        this.baseUrl = `${get(appStore).baseUrl}/wp-json/mcms/v1/api/`;
    }


    async get(url: string, params: any = {}) {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            credentials: "include",
            ...params
        });
        return await response.json();
    }

    async post(url: string, data: any = {}, params: any = {}) {
        const response = await fetch(`${this.baseUrl}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            credentials: "include",
            body: JSON.stringify(data),
            ...params
        });
        return await response.json();
    }
}
