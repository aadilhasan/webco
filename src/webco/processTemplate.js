import parser from "./parser";

export default function processTemplate(template) {
  // console.log(" processing start ", this.shadowRoot);
  // // this.shadowRoot.innerHTML = "";
  // console.log(" check root ", this.shadow);
  this.shadowRoot.innerHTML = "";
  const node = parser.call(this, template, this.shadowRoot);
}
