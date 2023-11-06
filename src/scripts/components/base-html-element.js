"use strict";
class BaseHTMLElement extends HTMLElement {
    constructor() {
        super();
        this.dom = {};
        this.data = {};
        this.cache = {};
        this.status = {
            is_sending: false,
        };
    }
}
