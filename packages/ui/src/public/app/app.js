const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(ttElm => {
    const tooltip = new bootstrap.Tooltip(ttElm)
    ttElm.addEventListener("click", function () {
        tooltip.hide()
    })
})

const axiosPost = async (url, params) => {
    const urlparams = new URLSearchParams({ ...params })
    return await axios.post(url, urlparams, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        withCredentials: true
    })
}

const apiPost = async (type, params) => {
    const res = await axiosPost('/api.php', { type, ...params })
    return { data: res.data, status: res.status }
}

const app = () => {
    let serverSelected = null

    const updateSelectedServer = (serverId) => {
        console.log(serverId, serverSelected)
        if (serverSelected === serverId) {
            return
        }
        serverSelected = serverId
        document.getElementById('select-server').classList.toggle('d-none', true)
        document.getElementById('server-management').classList.toggle('d-none', false)
        document.getElementById('loading').classList.toggle('d-none', false)

        apiPost('getGuildInfo', { guildId: serverId }).then((res) => {
            console.log(res)
        }).catch((err) => {
            console.log(err)
        })
    }

    document.querySelectorAll('[data-server-id]').forEach((serverLink) => {
        serverLink.addEventListener("click", () => {
            updateSelectedServer(serverLink.dataset.serverId)
        })
    })
}

document.addEventListener('DOMContentLoaded', app, false);
