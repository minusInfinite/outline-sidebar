import { editor, markdown, YAML } from "@silverbulletmd/silverbullet/syscalls";
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

export async function outlineSidebar(): Promise<any | null> {
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

  const minLevel = headers.reduce(
    (min, header) => Math.min(min, header.level),
    6,
  );

  const renderedMd = headers.map((header) =>
    `${
      " ".repeat((header.level - minLevel) * 2)
    }* [[${page}@${header.pos}|${header.name}]]`
  ).join("\n");
  // console.log("Markdown", renderedMd)

  console.log(renderedMd);
  return {};
}
