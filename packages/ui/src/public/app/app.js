const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(ttElm => new bootstrap.Tooltip(ttElm))

const app = () => {
    let serverSelected = null

    const updateSelectedServer = (serverId) => {
        serverSelected = serverId
    }
    document.querySelectorAll('[data-server-id]').forEach((serverLink) => {
        serverLink.addEventListener("click", () => {
            updateSelectedServer(serverLink.dataset.serverId)
        })
    })
}

document.addEventListener('DOMContentLoaded', app, false);
