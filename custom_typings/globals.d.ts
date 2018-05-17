interface Event {
  composedPath(): EventTarget[]
}

interface EventInit {
  composed?: boolean
}

interface HTMLElement {
  connectedCallback(): void
  disconnectedCallback(): void
}