import process from "./processTemplate";
export default class WebCo extends HTMLElement {
  state = {};
  html = "";
  _mounted = false;
  constructor(str) {
    super();
    this.attachShadow({ mode: "open" });
    this._render();
  }

  connectedCallback() {
    this._render();
    this.componentDidMount && this.componentDidMount();
  }

  setState = partialState => {
    this.state = { ...this.state, ...partialState };
    this._render();
  };
  _render() {
    // console.log(" rendering triggered ", this.shadowRoot, this.state);
    process.call(this, this.render());
    this._mounted = true;
  }
}
