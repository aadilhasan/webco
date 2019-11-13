import parser from "./parser";
import astGenerator from "./ast";
import makeDom from "./generator";

export default function process(html, host) {
  // console.log(" processing new ", html, host);
  const parsedData = parser(html);
  // console.log(" parsed ", parsedData);
  const ast = astGenerator(parsedData);
  // console.log(" ast ", ast);
  const dom = makeDom.call(this, ast, host);
  return dom;
}
