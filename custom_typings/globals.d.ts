interface Event {
  composedPath(): EventTarget[];
}

interface HTMLElement {
  connectedCallback?(): void;
  disconnectedCallback?(): void;
}