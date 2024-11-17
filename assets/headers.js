
/**
 * A simple Slugify oneline
 * @param {String} s - The String to slugify
 * @returns {String}
 */
const slugify = (s) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, "-"));

const headings = document.querySelectorAll("h1, h2, h3, h4 ,h5, h6");
let list = document.createElement("nav");
let lastDepth = 0;

document.querySelector("#root").appendChild(list);

headings.forEach((heading, index) => {
    let title = heading.textContent;
    let id = slugify(title);
    let depth = heading.localName.replace("h", "");

    if (index === 0) {
        var childUl = document.createElement("ul");
        list.append(childUl);
        list = childUl;
    } else if (depth > lastDepth) {
        for (let i = 0; i < depth - lastDepth; ++i) {
            let childUl = document.createElement("ul");
            list.appendChild(childUl);
            list = childUl;
        }
    } else if (depth < lastDepth) {
        for (let i = 0; i < lastDepth - depth; ++i) {
            list = list.parentNode;
        }
    }

    if (heading.hasAttribute("id")) {
        id = heading.getAttribute("id");
    } else {
        heading.setAttribute("id", id);
    }

    let li = document.createElement("li");
    let a = document.createElement("a");
    a.setAttribute("href", `#${id}`);
    a.textContent = title;

    li.appendChild(a);
    list.appendChild(li);
    lastDepth = depth;
});

// list is now a ul in the nav section
document.querySelector("#root").appendChild(list);
