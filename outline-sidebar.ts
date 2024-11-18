import {
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

const PLUG_NAME = "Outline Sidebar";

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
    let config: OutlineSBConfig = {};

    const page = await editor.getCurrentPage();
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
    // console.log("Markdown", renderedMd)

    console.log(finalHtml);
    await editor.showPanel(
        "rhs",
        0.5,
        `
        <div id="Outline-Sidebar">
            ${finalHtml}
        </div>
        `,
        "",
    );

    await setOSBEnabled(true);
}
