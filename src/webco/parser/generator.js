import process from "./index";
function makeElement(_root, host) {
  //console.log(" this ", this, " ===>", _root, " ==> ", host);
  let root = null;
  if (typeof _root !== "object") {
    root = resolveText.call(this, _root, host);
    return root;
  }
  if (_root.type) {
    if (_root.type === "root" && host) {
      // replace following with user given node
      root = host;
    } else {
      root = document.createElement(_root.type);
    }
  }
  addAttributes.call(this, root, _root.props);
  let len = _root.children ? _root.children.length : -1;
  let i = 0;
  while (i < len) {
    const child = makeElement.call(this, _root.children[i], root);
    child && root.appendChild(child);
    i++;
  }
  _root.el = root;
  if (_root.type === "root") {
    //console.log(" finished ", _root);
  }
  return root;
}
const allEvents = [
  "click",
  "hover",
  "mouseup",
  "mousedown",
  "mousein",
  "mouseout",
  "focus",
  "change",
  "keypress"
];
function addAttributes(el, props) {
  //console.log(" this in attrinute ", this, el, props);
  for (let prop in props) {
    //console.log(" adding attributes  ,", el, props[prop], props);
    const eventType = prop.replace("on", "");
    // following may cause issues check here if carashes happen
    const _prop = resolveExpression.call(this, prop);
    if (allEvents.indexOf(eventType) !== -1) {
      const handler = resolveEventListenerExpression.call(
        this,
        props[prop].value
      );
      // console.log(" found event ", eventType, props, handler);
      //console.log(" its an event ", el, props[prop], handler);
      el.addEventListener(eventType, handler.bind(this));
    } else {
      const value = resolveExpression.call(this, props[prop].value);
      el.setAttribute(_prop, value);
    }
  }
}

export const regExOpen = /\{\{/g;
export const regExClose = /\}\}/g;
// make replacing of the tags order of O
function resolveExpression(template) {
  let y = [];
  let match;
  // topen tag;
  while ((match = regExOpen.exec(template)) != null) {
    y.push(match);
  }
  if (y.length === 0) return template;
  let i = y.length - 1;
  while (i >= 0) {
    template =
      template.substring(0, y[i].index) +
      "${" +
      template.substring(y[i].index + 2, template.length);
    i--;
  }

  // close tag
  match = [];
  y = [];
  while ((match = regExClose.exec(template)) != null) {
    y.push(match);
  }
  i = y.length - 1;
  while (i >= 0) {
    template =
      template.substring(0, y[i].index) +
      "}" +
      template.substring(y[i].index + 2, template.length);
    i--;
  }
  const templateGenerator = new Function(`return \`${template}\``);

  //console.log(" processed template ====> ", this, template, templateGenerator);
  //console.log(" updating ", this.update);
  return templateGenerator.call(this);
}

function resolveText(template, el) {
  let y = [];
  let match;
  // topen tag;
  while ((match = regExOpen.exec(template)) != null) {
    y.push(match);
  }
  if (y.length === 0) return document.createTextNode(template);
  let i = y.length - 1;
  while (i >= 0) {
    template =
      template.substring(0, y[i].index) +
      "${" +
      template.substring(y[i].index + 2, template.length);
    i--;
  }

  // close tag
  match = [];
  y = [];
  while ((match = regExClose.exec(template)) != null) {
    y.push(match);
  }
  i = y.length - 1;
  while (i >= 0) {
    template =
      template.substring(0, y[i].index) +
      "}" +
      template.substring(y[i].index + 2, template.length);
    i--;
  }
  const templateGenerator = new Function(`return \`${template}\``);

  // console.log(
  //   " processed exp =>",
  //   this,
  //   template,
  //   templateGenerator.call(this)
  // );
  return process.call(this, templateGenerator.call(this));
}

function resolveEventListenerExpression(expression) {
  //console.log(" making handler ", expression);
  expression = expression.replace("{{", "");
  expression = expression.replace("}}", "");
  //console.log(expression);
  const eventHandler = new Function(
    `return ${expression}.apply(this, arguments)`
  );
  return eventHandler;
}

export default function makeDom(_root, host) {
  //console.log(Object.keys(this), this.__proto__);
  return makeElement.call(this, _root, host);
}
