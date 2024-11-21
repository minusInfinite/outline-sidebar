// deno-lint-ignore no-unused-vars
function addClickEvent() {
    document.querySelectorAll("[data-osbpos]").forEach((el) => {
        el.addEventListener("click", (e) => {
            const pos = parseInt(el.dataset.osbpos)
            syscall("editor.moveCursor", pos, true)
            e.stopPropagation()
            e.preventDefault()
        })
    })
}
