import {get} from "svelte/store";
import {appStore} from "../stores/app";

export function attachStylesToShadowRoot(elementName: string) {
    const state = get(appStore);
    const el = document.querySelector(elementName);
    const shadow = el.shadowRoot;
    const style = document.createElement('link');
    style.rel = "stylesheet";
    style.href = state.syncSettings.cssUrl;
    shadow.appendChild(style);
}
