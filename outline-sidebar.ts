import {
    asset,
    clientStore,
    editor,
    markdown,
    system,
} from "@silverbulletmd/silverbullet/syscalls";
import { stripMarkdown } from "@silverbulletmd/silverbullet/lib/markdown";
import { traverseTree } from "@silverbulletmd/silverbullet/lib/tree";

type Header = {
    name: string;
    pos: number;
    level: number;
};

type OutlineSBConfig = {
    header?: boolean;
};

const PLUG_NAME = "outline-sidebar";

const OSB_STATE_KEY = "enableOutlineSidebar";

async function isOSBEnabled() {
    return !!(await clientStore.get(OSB_STATE_KEY));
}

async function setOSBEnabled(value: boolean) {
    return await clientStore.set(OSB_STATE_KEY, value);
}

export async function hideOutlineSidebar() {
    await editor.hidePanel("rhs");
    await setOSBEnabled(false);
}

export async function toggleOutlineSidebar() {
    const currentState = await isOSBEnabled();
    if (!currentState) {
        await showOutlineSidebar();
    } else {
        await hideOutlineSidebar();
    }
}

export async function showOSBIfEnabled() {
    try {
        const env = await system.getEnv();
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

export async function showOutlineSidebar(): Promise<any | null> {
    //let config: OutlineSBConfig = {};

    const [plusCss, plugJs] = await Promise.all([
        asset.readAsset(PLUG_NAME, "assets/outline-sidebar.css"),
        asset.readAsset(PLUG_NAME, "assets/outline-sidebar.js"),
    ]);

    const text = await editor.getText();
    const tree = await markdown.parseMarkdown(text);
    const headers: Header[] = [];

    traverseTree(tree, (n) => {
        if (n.type?.startsWith("ATXHeading")) {
            headers.push({
                name: n.children!.slice(1).map(stripMarkdown).join("").trim(),
                pos: n.from!,
                level: +n.type[n.type.length - 1],
            });

            return true;
        }

        return false;
    });

    if (headers.length === 0) {
        return null;
    }

    let finalHtml = "";
    let lastLevel = 0;

    headers.map((header, index, arr) => {
        let level = header.level;

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
            <li><span class="p wiki-link osb-clickable" data-osbpos="${header.pos}">${header.name}</span></li>`;

        if (index === arr.length - 1) {
            finalHtml += `</ul>`;
        }

        lastLevel = level;
    });

    await editor.showPanel(
        "rhs",
        0.5,
        `
        <link rel="stylesheet" href="/.client/main.css" />
        <style>
        ${plusCss}
        </style>
        <div id="outline-sidebar-root">
            ${finalHtml}
        </div>
        `,
        `
        ${plugJs}
        addClickEvent()
        `,
    );

    await setOSBEnabled(true);
}
