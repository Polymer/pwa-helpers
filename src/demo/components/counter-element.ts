/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

// For simplicity, we're not using any styles in this element so that we
// don't have to set up a Shady CSS polyfill.
let template = document.createElement('template');
template.innerHTML = `
<p>
  Inside &lt;counter-element&gt;. Clicked: <b><span id="clicksSpan"></span></b> times. Value is <b><span id="valueSpan"></span></b>.
  <button id="plus">+</button>
  <button id="minus">-</button>
</p>
`

// This is a reusable element. It is not connected to the store. You can
// imagine that it could just as well be a third-party element that you
// got from someone else.
class CounterElement extends HTMLElement {
  public clicks: number = 0; // The total number of clicks you've done.
  public value: number = 0; // The current value of the counter.
  shadowRoot!: ShadowRoot

  constructor() {
    super();

    // Stamp the template.
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(document.importNode(template.content, true));

    shadowRoot.getElementById('plus')!.addEventListener('click', () => {this._onIncrement()});
    shadowRoot.getElementById('minus')!.addEventListener('click', () => {this._onDecrement()});

    this._show();
  }

  _onIncrement() {
    this.value++;
    this.clicks++;
    this._show();
    this.dispatchEvent(new CustomEvent('counter-incremented',
        {bubbles: false, composed: true}));
  }

  _onDecrement() {
    this.value--;
    this.clicks++;
    this._show();
    this.dispatchEvent(new CustomEvent('counter-decremented',
        {bubbles: false, composed: true}));
  }

  _show() {
    this.shadowRoot.getElementById('clicksSpan')!.textContent = this.clicks.toString();
    this.shadowRoot.getElementById('valueSpan')!.textContent = this.value.toString();
  }
}

window.customElements.define('counter-element', CounterElement);
