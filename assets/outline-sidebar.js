{
    document.querySelectorAll("[data-osb-pos]").forEach((el) => {
        el.addEventListener("click", async (e) => {
            await syscall("editor.moveCursor", el.dataset.osbpost)
        })
    })
}