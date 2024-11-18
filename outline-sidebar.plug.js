var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// https://deno.land/x/silverbullet@0.10.1/lib/plugos/worker_runtime.ts
var workerPostMessage = (_msg) => {
  throw new Error("Not initialized yet");
};
var runningAsWebWorker = typeof window === "undefined" && // @ts-ignore: globalThis
typeof globalThis.WebSocketPair === "undefined";
if (typeof Deno === "undefined") {
  self.Deno = {
    args: [],
    // @ts-ignore: Deno hack
    build: {
      arch: "x86_64"
    },
    env: {
      // @ts-ignore: Deno hack
      get() {
      }
    }
  };
}
var pendingRequests = /* @__PURE__ */ new Map();
var syscallReqId = 0;
if (runningAsWebWorker) {
  globalThis.syscall = async (name, ...args) => {
    return await new Promise((resolve, reject) => {
      syscallReqId++;
      pendingRequests.set(syscallReqId, { resolve, reject });
      workerPostMessage({
        type: "sys",
        id: syscallReqId,
        name,
        args
      });
    });
  };
}
function setupMessageListener(functionMapping2, manifest2, postMessageFn) {
  if (!runningAsWebWorker) {
    return;
  }
  workerPostMessage = postMessageFn;
  self.addEventListener("message", (event) => {
    (async () => {
      const data = event.data;
      switch (data.type) {
        case "inv":
          {
            const fn = functionMapping2[data.name];
            if (!fn) {
              throw new Error(`Function not loaded: ${data.name}`);
            }
            try {
              const result = await Promise.resolve(fn(...data.args || []));
              workerPostMessage({
                type: "invr",
                id: data.id,
                result
              });
            } catch (e) {
              console.error(
                "An exception was thrown as a result of invoking function",
                data.name,
                "error:",
                e.message
              );
              workerPostMessage({
                type: "invr",
                id: data.id,
                error: e.message
              });
            }
          }
          break;
        case "sysr":
          {
            const syscallId = data.id;
            const lookup = pendingRequests.get(syscallId);
            if (!lookup) {
              throw Error("Invalid request id");
            }
            pendingRequests.delete(syscallId);
            if (data.error) {
              lookup.reject(new Error(data.error));
            } else {
              lookup.resolve(data.result);
            }
          }
          break;
      }
    })().catch(console.error);
  });
  workerPostMessage({
    type: "manifest",
    manifest: manifest2
  });
}
function base64Decode(s) {
  const binString = atob(s);
  const len = binString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return bytes;
}
function base64Encode(buffer) {
  if (typeof buffer === "string") {
    buffer = new TextEncoder().encode(buffer);
  }
  let binary = "";
  const len = buffer.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return btoa(binary);
}
async function sandboxFetch(reqInfo, options) {
  if (typeof reqInfo !== "string") {
    const body = new Uint8Array(await reqInfo.arrayBuffer());
    const encodedBody = body.length > 0 ? base64Encode(body) : void 0;
    options = {
      method: reqInfo.method,
      headers: Object.fromEntries(reqInfo.headers.entries()),
      base64Body: encodedBody
    };
    reqInfo = reqInfo.url;
  }
  return syscall("sandboxFetch.fetch", reqInfo, options);
}
globalThis.nativeFetch = globalThis.fetch;
function monkeyPatchFetch() {
  globalThis.fetch = async function(reqInfo, init) {
    const encodedBody = init && init.body ? base64Encode(
      new Uint8Array(await new Response(init.body).arrayBuffer())
    ) : void 0;
    const r = await sandboxFetch(
      reqInfo,
      init && {
        method: init.method,
        headers: init.headers,
        base64Body: encodedBody
      }
    );
    return new Response(r.base64Body ? base64Decode(r.base64Body) : null, {
      status: r.status,
      headers: r.headers
    });
  };
}
if (runningAsWebWorker) {
  monkeyPatchFetch();
}

// https://jsr.io/@silverbulletmd/silverbullet/0.10.1/plug-api/syscalls/editor.ts
var editor_exports = {};
__export(editor_exports, {
  confirm: () => confirm,
  copyToClipboard: () => copyToClipboard,
  deleteLine: () => deleteLine,
  dispatch: () => dispatch,
  downloadFile: () => downloadFile,
  filterBox: () => filterBox,
  flashNotification: () => flashNotification,
  fold: () => fold,
  foldAll: () => foldAll,
  getCurrentPage: () => getCurrentPage,
  getCursor: () => getCursor,
  getSelection: () => getSelection,
  getText: () => getText,
  getUiOption: () => getUiOption,
  goHistory: () => goHistory,
  hidePanel: () => hidePanel,
  insertAtCursor: () => insertAtCursor,
  insertAtPos: () => insertAtPos,
  moveCursor: () => moveCursor,
  moveCursorToLine: () => moveCursorToLine,
  navigate: () => navigate,
  newWindow: () => newWindow,
  openCommandPalette: () => openCommandPalette,
  openPageNavigator: () => openPageNavigator,
  openSearchPanel: () => openSearchPanel,
  openUrl: () => openUrl,
  prompt: () => prompt,
  redo: () => redo,
  reloadConfigAndCommands: () => reloadConfigAndCommands,
  reloadPage: () => reloadPage,
  reloadUI: () => reloadUI,
  replaceRange: () => replaceRange,
  save: () => save,
  setSelection: () => setSelection,
  setText: () => setText,
  setUiOption: () => setUiOption,
  showPanel: () => showPanel,
  toggleFold: () => toggleFold,
  undo: () => undo,
  unfold: () => unfold,
  unfoldAll: () => unfoldAll,
  uploadFile: () => uploadFile,
  vimEx: () => vimEx
});

// https://jsr.io/@silverbulletmd/silverbullet/0.10.1/plug-api/syscall.ts
if (typeof self === "undefined") {
  self = {
    syscall: () => {
      throw new Error("Not implemented here");
    }
  };
}
function syscall2(name, ...args) {
  return globalThis.syscall(name, ...args);
}

// https://jsr.io/@silverbulletmd/silverbullet/0.10.1/plug-api/syscalls/editor.ts
function getCurrentPage() {
  return syscall2("editor.getCurrentPage");
}
function getText() {
  return syscall2("editor.getText");
}
function setText(newText, isolateHistory = false) {
  return syscall2("editor.setText", newText, isolateHistory);
}
function getCursor() {
  return syscall2("editor.getCursor");
}
function getSelection() {
  return syscall2("editor.getSelection");
}
function setSelection(from, to) {
  return syscall2("editor.setSelection", from, to);
}
function save() {
  return syscall2("editor.save");
}
function navigate(pageRef, replaceState = false, newWindow2 = false) {
  return syscall2("editor.navigate", pageRef, replaceState, newWindow2);
}
function openPageNavigator(mode = "page") {
  return syscall2("editor.openPageNavigator", mode);
}
function openCommandPalette() {
  return syscall2("editor.openCommandPalette");
}
function reloadPage() {
  return syscall2("editor.reloadPage");
}
function reloadUI() {
  return syscall2("editor.reloadUI");
}
function reloadConfigAndCommands() {
  return syscall2("editor.reloadConfigAndCommands");
}
function openUrl(url, existingWindow = false) {
  return syscall2("editor.openUrl", url, existingWindow);
}
function newWindow() {
  return syscall2("editor.newWindow");
}
function goHistory(delta) {
  return syscall2("editor.goHistory", delta);
}
function downloadFile(filename, dataUrl) {
  return syscall2("editor.downloadFile", filename, dataUrl);
}
function uploadFile(accept, capture) {
  return syscall2("editor.uploadFile", accept, capture);
}
function flashNotification(message, type = "info") {
  return syscall2("editor.flashNotification", message, type);
}
function filterBox(label, options, helpText = "", placeHolder = "") {
  return syscall2("editor.filterBox", label, options, helpText, placeHolder);
}
function showPanel(id, mode, html, script = "") {
  return syscall2("editor.showPanel", id, mode, html, script);
}
function hidePanel(id) {
  return syscall2("editor.hidePanel", id);
}
function insertAtPos(text, pos) {
  return syscall2("editor.insertAtPos", text, pos);
}
function replaceRange(from, to, text) {
  return syscall2("editor.replaceRange", from, to, text);
}
function moveCursor(pos, center = false) {
  return syscall2("editor.moveCursor", pos, center);
}
function moveCursorToLine(line, column = 1, center = false) {
  return syscall2("editor.moveCursorToLine", line, column, center);
}
function insertAtCursor(text) {
  return syscall2("editor.insertAtCursor", text);
}
function dispatch(change) {
  return syscall2("editor.dispatch", change);
}
function prompt(message, defaultValue = "") {
  return syscall2("editor.prompt", message, defaultValue);
}
function confirm(message) {
  return syscall2("editor.confirm", message);
}
function getUiOption(key) {
  return syscall2("editor.getUiOption", key);
}
function setUiOption(key, value) {
  return syscall2("editor.setUiOption", key, value);
}
function fold() {
  return syscall2("editor.fold");
}
function unfold() {
  return syscall2("editor.unfold");
}
function toggleFold() {
  return syscall2("editor.toggleFold");
}
function foldAll() {
  return syscall2("editor.foldAll");
}
function unfoldAll() {
  return syscall2("editor.unfoldAll");
}
function undo() {
  return syscall2("editor.undo");
}
function redo() {
  return syscall2("editor.redo");
}
function openSearchPanel() {
  return syscall2("editor.openSearchPanel");
}
function copyToClipboard(data) {
  return syscall2("editor.copyToClipboard", data);
}
function deleteLine() {
  return syscall2("editor.deleteLine");
}
function vimEx(exCommand) {
  return syscall2("editor.vimEx", exCommand);
}

// https://jsr.io/@silverbulletmd/silverbullet/0.10.1/plug-api/syscalls/markdown.ts
var markdown_exports = {};
__export(markdown_exports, {
  parseMarkdown: () => parseMarkdown,
  renderParseTree: () => renderParseTree
});
function parseMarkdown(text) {
  return syscall2("markdown.parseMarkdown", text);
}
function renderParseTree(tree) {
  return syscall2("markdown.renderParseTree", tree);
}

// https://jsr.io/@silverbulletmd/silverbullet/0.10.1/plug-api/syscalls/system.ts
var system_exports = {};
__export(system_exports, {
  applyAttributeExtractors: () => applyAttributeExtractors,
  getEnv: () => getEnv,
  getMode: () => getMode,
  getSpaceConfig: () => getSpaceConfig,
  getVersion: () => getVersion,
  invokeCommand: () => invokeCommand,
  invokeFunction: () => invokeFunction,
  invokeSpaceFunction: () => invokeSpaceFunction,
  listCommands: () => listCommands,
  listSyscalls: () => listSyscalls,
  reloadConfig: () => reloadConfig,
  reloadPlugs: () => reloadPlugs
});
function invokeFunction(name, ...args) {
  return syscall2("system.invokeFunction", name, ...args);
}
function invokeCommand(name, args) {
  return syscall2("system.invokeCommand", name, args);
}
function listCommands() {
  return syscall2("system.listCommands");
}
function listSyscalls() {
  return syscall2("system.listSyscalls");
}
function invokeSpaceFunction(name, ...args) {
  return syscall2("system.invokeSpaceFunction", name, ...args);
}
function applyAttributeExtractors(tags, text, tree) {
  return syscall2("system.applyAttributeExtractors", tags, text, tree);
}
async function getSpaceConfig(key, defaultValue) {
  return await syscall2("system.getSpaceConfig", key) ?? defaultValue;
}
function reloadPlugs() {
  return syscall2("system.reloadPlugs");
}
function reloadConfig() {
  return syscall2("system.reloadConfig");
}
function getEnv() {
  return syscall2("system.getEnv");
}
function getMode() {
  return syscall2("system.getMode");
}
function getVersion() {
  return syscall2("system.getVersion");
}

// https://jsr.io/@silverbulletmd/silverbullet/0.10.1/plug-api/syscalls/clientStore.ts
var clientStore_exports = {};
__export(clientStore_exports, {
  del: () => del,
  get: () => get,
  set: () => set
});
function set(key, value) {
  return syscall2("clientStore.set", key, value);
}
function get(key) {
  return syscall2("clientStore.get", key);
}
function del(key) {
  return syscall2("clientStore.delete", key);
}

// https://jsr.io/@silverbulletmd/silverbullet/0.10.1/plug-api/lib/tree.ts
function collectNodesMatching(tree, matchFn) {
  if (matchFn(tree)) {
    return [tree];
  }
  let results = [];
  if (tree.children) {
    for (const child of tree.children) {
      results = [...results, ...collectNodesMatching(child, matchFn)];
    }
  }
  return results;
}
function findNodeOfType(tree, nodeType) {
  return collectNodesMatching(tree, (n) => n.type === nodeType)[0];
}
function traverseTree(tree, matchFn) {
  collectNodesMatching(tree, matchFn);
}
function renderToText(tree) {
  if (!tree) {
    return "";
  }
  const pieces = [];
  if (tree.text !== void 0) {
    return tree.text;
  }
  for (const child of tree.children) {
    pieces.push(renderToText(child));
  }
  return pieces.join("");
}

// https://jsr.io/@silverbulletmd/silverbullet/0.10.1/plug-api/lib/markdown.ts
function stripMarkdown(tree) {
  if (tree.type?.endsWith("Mark") || tree.type?.endsWith("Delimiter")) {
    return "";
  }
  const stripArray = (arr) => arr.map(stripMarkdown).join("");
  switch (tree.type) {
    case "Document":
    case "Emphasis":
    case "Highlight":
    case "Strikethrough":
    case "InlineCode":
    case "StrongEmphasis":
    case "Superscript":
    case "Subscript":
    case "Paragraph":
    case "ATXHeading1":
    case "ATXHeading2":
    case "ATXHeading3":
    case "ATXHeading4":
    case "ATXHeading5":
    case "ATXHeading6":
    case "Blockquote":
    case "BulletList":
    case "OrderedList":
    case "ListItem":
    case "Table":
    case "TableHeader":
    case "TableCell":
    case "TableRow":
    case "Task":
    case "HTMLTag": {
      return stripArray(tree.children);
    }
    case "FencedCode":
    case "CodeBlock": {
      tree.children = tree.children.filter((c) => c.type);
      return stripArray(tree.children);
    }
    case "Link": {
      const linkTextChildren = tree.children.slice(1, -4);
      return stripArray(linkTextChildren);
    }
    case "Image": {
      const altTextNode = findNodeOfType(tree, "WikiLinkAlias") || tree.children[1];
      let altText = altTextNode && altTextNode.type !== "LinkMark" ? renderToText(altTextNode) : "<Image>";
      const dimReg = /\d*[^\|\s]*?[xX]\d*[^\|\s]*/.exec(altText);
      if (dimReg) {
        altText = altText.replace(dimReg[0], "").replace("|", "");
      }
      return altText;
    }
    case "WikiLink": {
      const aliasNode = findNodeOfType(tree, "WikiLinkAlias");
      let linkText;
      if (aliasNode) {
        linkText = aliasNode.children[0].text;
      } else {
        const ref = findNodeOfType(tree, "WikiLinkPage").children[0].text;
        linkText = ref.split("/").pop();
      }
      return linkText;
    }
    case "NakedURL": {
      const url = tree.children[0].text;
      return url;
    }
    case "CommandLink": {
      const aliasNode = findNodeOfType(tree, "CommandLinkAlias");
      let command;
      if (aliasNode) {
        command = aliasNode.children[0].text;
      } else {
        command = tree.children[1].children[0].text;
      }
      return command;
    }
    case "TaskState": {
      return tree.children[1].text;
    }
    case "Escape": {
      return tree.children[0].text.slice(1);
    }
    case "CodeText":
    case "Entity": {
      return tree.children[0].text;
    }
    case "TemplateDirective":
    case "DeadlineDate": {
      return renderToText(tree);
    }
    case "CodeInfo":
    case "CommentBlock":
    case "FrontMatter":
    case "Hashtag":
    case "HardBreak":
    case "HorizontalRule":
    case "NamedAnchor":
    case "Attribute": {
      return "";
    }
    case void 0:
      return tree.text;
    default:
      console.log("Unknown tree type: ", tree.type);
      return "";
  }
}

// D:/code/Github/outline-sidebar/outline-sidebar.ts
var PLUG_NAME = "Outline Sidebar";
var OSB_STATE_KEY = "enableOutlineSidebar";
async function isOSBEnabled() {
  return !!await clientStore_exports.get(OSB_STATE_KEY);
}
async function setOSBEnabled(value) {
  return await clientStore_exports.set(OSB_STATE_KEY, value);
}
async function hideOutlineSidebar() {
  await editor_exports.hidePanel("rhs");
  await setOSBEnabled(false);
}
async function toggleOutlineSidebar() {
  const currentState = await isOSBEnabled();
  if (!currentState) {
    await showOutlineSidebar();
  } else {
    await hideOutlineSidebar();
  }
}
async function showOSBIfEnabled() {
  try {
    const env = await system_exports.getEnv();
    if (env === "server") {
      return;
    }
    if (await isOSBEnabled()) {
      return await showOutlineSidebar();
    }
  } catch (e) {
    console.error(`${PLUG_NAME}: showOSBIfEnabled failed`, e);
  }
}
async function showOutlineSidebar() {
  let config = {};
  const page = await editor_exports.getCurrentPage();
  const text = await editor_exports.getText();
  const tree = await markdown_exports.parseMarkdown(text);
  const headers = [];
  traverseTree(tree, (n) => {
    if (n.type?.startsWith("ATXHeading")) {
      headers.push({
        name: n.children.slice(1).map(stripMarkdown).join("").trim(),
        pos: n.from,
        level: +n.type[n.type.length - 1]
      });
      return true;
    }
    return false;
  });
  if (headers.length === 0) {
    return null;
  }
  const minLevel = headers.reduce(
    (min, header) => Math.min(min, header.level),
    6
  );
  let finalHtml = "";
  let lastLevel = 0;
  headers.map((header, index, arr) => {
    let level = header.level;
    console.log(level);
    if (index === 0) {
      finalHtml += `<ul>`;
    } else if (level > lastLevel) {
      for (let i = 0; i < level - lastLevel; ++i) {
        finalHtml += `<ul>`;
      }
    } else if (level < lastLevel) {
      for (let i = 0; i < lastLevel - level; ++i) {
        finalHtml += `</ul>`;
      }
    }
    finalHtml += `
    <li><span class="p"><a href="${page}@${header.pos}" class="wiki-link" data-ref="${page}@${header.pos}">${header.name}</a></span><li>`;
    if (index === arr.length - 1) {
      finalHtml += `</ul>`;
    }
    lastLevel = level;
  });
  console.log(finalHtml);
  await editor_exports.showPanel(
    "rhs",
    0.5,
    `
        <div id="Outline-Sidebar">
            ${finalHtml}
        </div>
        `,
    ""
  );
  await setOSBEnabled(true);
}

// 69a5c8d3b9f989b9.js
var functionMapping = {
  showOutlineSidebar,
  hideOutlineSidebar,
  showOSBIfEnabled,
  toggle: toggleOutlineSidebar
};
var manifest = {
  "name": "outline-sidebar",
  "functions": {
    "showOutlineSidebar": {
      "path": "./outline-sidebar.ts:showOutlineSidebar"
    },
    "hideOutlineSidebar": {
      "path": "./outline-sidebar.ts:hideOutlineSidebar"
    },
    "showOSBIfEnabled": {
      "path": "./outline-sidebar.ts:showOSBIfEnabled",
      "evnets": [
        "editor:init",
        "editor:pageLoaded",
        "editor:pageSaved"
      ]
    },
    "toggle": {
      "path": "./outline-sidebar.ts:toggleOutlineSidebar",
      "command": {
        "name": "Outline Sidebar: Toggle",
        "key": "Ctrl-alt-o",
        "mac": "Cmd-alt-o"
      }
    }
  },
  "assets": {}
};
var plug = { manifest, functionMapping };
setupMessageListener(functionMapping, manifest, self.postMessage);
export {
  plug
};
//# sourceMappingURL=outline-sidebar.plug.js.map
