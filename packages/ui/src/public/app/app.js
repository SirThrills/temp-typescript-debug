const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(ttElm => {
    const tooltip = new bootstrap.Tooltip(ttElm)
    ttElm.addEventListener("click", function () {
        tooltip.hide()
    })
})

const axiosPost = async (url, params, headers, credentials = false) => {
    const urlparams = new URLSearchParams({ ...params })
    return await axios.post(url, urlparams, {
        headers,
        ...credentials && {
            withCredentials: true
        }
    })
}

const apiPost = async (type, params) => {
    const res = await axiosPost('/api.php', { type, ...params }, {
        "Content-Type": "application/x-www-form-urlencoded"
    }, true)
    return { data: res.data, status: res.status }
}

const getGuildInfo = async (guildId) => {
    try {
        return apiPost('getGuildInfo', { guildId })
    } catch (err) {
        console.log(err)
    }
}

const toggleActive = (parentElm, childElm, active = true) => {
    childElm
        .toggleClass('rounded-circle', !active)
        .toggleClass('rounded-25', active)
    parentElm
        .toggleClass('selected', active)
}

const toggleContent = (show = true, loading = true) => {
    document.getElementById('select-server').classList.toggle('d-none', show)
    document.getElementById('server-management').classList.toggle('d-none', !show)
    document.getElementById('loading').classList.toggle('d-none', !loading)
}

const setContent = (data) => {
    console.log(data)
    document.getElementById('server-name').innerText = data.guild_name
    const imgUrl = data.guild_icon ?? `https://ui-avatars.com/api/?name=${data.guild_name}`
    document.getElementById('server-icon').src = imgUrl
}

const resetRoles = () => {

}

const resetRssFeed = () => {

}

const resetChannels = () => {

}

const resetBans = () => {

}

const resetWarnings = () => {

}

const resetAll = () => {
    resetRoles()
    resetRssFeed()
    resetChannels()
    resetBans()
    resetWarnings()
}

const getGuildPermissions = async (guildId) => {
    try {
        return apiPost('getGuildPermissions', { guildId })
    } catch (err) {
        console.log(err)
    }
}

const getGuildRoles = async (guildId) => {
    try {
        return apiPost('getGuildRoles', { guildId })
    } catch (err) {
        console.log(err)
    }
}

const updateHtmlElements = async (state, newParentElm, newChildElm) => {
    const { parentElm, childElm } = state
    if (parentElm) {
        parentElm
            .toggleClass('active', false)
            .toggleClass('selected', false)
    }
    newParentElm
        .toggleClass('active', true)
        .toggleClass('selected', true)
    state.parentElm = newParentElm

    if (childElm) {
        childElm
            .toggleClass('rounded-circle', true)
            .toggleClass('rounded-25', false)
    }
    newChildElm
        .toggleClass('rounded-circle', false)
        .toggleClass('rounded-25', true)
    state.childElm = newChildElm
}

const setServerSelected = (state, serverId) => {
    state.serverId = serverId
}

const setActiveTab = (state, tab) => {
    state.activeTab = tab
}

const getParentAndChildElm = (middleElm) => {
    if (middleElm == null) {
        return
    }

    const parentElm = middleElm.parent()
    const childElm = middleElm.children().first()

    return { parentElm, childElm }
}

$(function () {
    const state = []

    $('a[data-server-id]').click(async function (e) {
        const { parentElm, childElm } = getParentAndChildElm($(this))
        if (parentElm == null || childElm == null) {
            return
        }
        const serverId = $(this).data('server-id')
        if (isNaN(parseInt(serverId))) {
            return
        }
        const guildInfo = await getGuildInfo(serverId)
        if (guildInfo == null) {
            return
        }
        setServerSelected(state, serverId)
        updateHtmlElements(state, parentElm, childElm)
        setActiveTab('info')
    })

    $('a[data-server-id').on('mouseover', function (e) {
        const serverId = $(this).data('server-id')
        if (state.serverId && state.serverId === serverId) {
            return
        }

        const { parentElm, childElm } = getParentAndChildElm($(this))
        if (parentElm == null || childElm == null) {
            return
        }
        toggleActive(parentElm, childElm)
    })

    $('a[data-server-id').on('mouseout', function (e) {
        const serverId = $(this).data('server-id')
        if (state.serverId && state.serverId === serverId) {
            return
        }

        const { parentElm, childElm } = getParentAndChildElm($(this))
        if (parentElm == null || childElm == null) {
            return
        }
        toggleActive(parentElm, childElm, false)
    })

    $('button[data-bs-toggle]').on('click', function (e) {
        const id = $(this).attr('id')
        setActiveTab(state, id)
        console.log(state)
    })
})

const app = () => {
    // let serverSelected = null
    // let navParentElm = null
    // let imgChildElm = null

    // document.querySelectorAll('[data-server-id]').forEach((serverLink) => {
    //     serverLink.addEventListener("click", async () => {
    //         const child = serverLink.children[0]
    //         const parent = serverLink.parentElement
    //         if (!parent.classList.contains("nav-item")) {
    //             return
    //         }

    //         if (serverLink.dataset.serverId === serverSelected) {
    //             return
    //         }
    //         serverSelected = serverLink.dataset.serverId

    //         toggleContent(false)
    //         await updateSelectedServer(serverSelected, parent, child)
    //         toggleContent(true, false)
    //         toggleActive(parent, child)
    //     })
    // })

    // document.querySelectorAll('.rounded-circle').forEach((elm) => {
    //     const parent = elm.parentElement.parentElement
    //     if (!parent.classList.contains("nav-item")) {
    //         return
    //     }
    //     parent.addEventListener('mouseover', function (e) {
    //         if (elm.parentElement.dataset.serverId === serverSelected) {
    //             return
    //         }
    //         toggleActive(parent, elm)
    //     })

    //     parent.addEventListener('mouseout', function (e) {
    //         if (elm.parentElement.dataset.serverId === serverSelected) {
    //             return
    //         }
    //         toggleActive(parent, elm, false)
    //     })
    // })

    // document.querySelectorAll('[data-type="edit-role"]').forEach((button) => {
    //     console.log(button)
    //     button.addEventListener("click", (e) => {
    //         console.log('click')
    //         if (button.dataset.roleId == null) {
    //             console.log('no roleId')
    //             e.preventDefault()
    //             return
    //         }

    //         const hiddenInput = document.getElementById('edit-role-id')
    //         if (hiddenInput == null) {
    //             console.log('no element')
    //             e.preventDefault()
    //             return
    //         }

    //         hiddenInput.dataset.roleId = button.dataset.roleId
    //     })
    // })

    // const serverRefreshInfo = document.getElementById('server-refresh-info')
    // const addServerRefreshListener = (serverRefreshInfo) => {
    //     if (serverRefreshInfo) {
    //         serverRefreshInfo.addEventListener('click', async () => {
    //             console.log(serverRefreshInfo.disabled, serverSelected)
    //             if (serverRefreshInfo.disabled || serverSelected == null) {
    //                 return
    //             }
    //             serverRefreshInfo.children[0].classList.toggle('fa-spin', true)
    //             serverRefreshInfo.disabled = true
    //             const guildInfo = await getGuildInfo(serverSelected)
    //             setContent(guildInfo.data)
    //             serverRefreshInfo.children[0].classList.toggle('fa-spin', false)
    //             serverRefreshInfo.disabled = false
    //         })
    //     }
    // }
    // addServerRefreshListener(serverRefreshInfo)

    // const rolesTab = document.getElementById('roles-tab')
    // const addRolesTabListener = (rolesTab) => {
    //     if (rolesTab) {
    //         console.log(rolesTab)
    //         rolesTab.addEventListener('click', async () => {
    //             resetRoles()
    //             if (serverSelected == null) {
    //                 return
    //             }

    //             const tbody = document.getElementById('server-roles-table')
    //             if (tbody == null) {
    //                 return
    //             }
    //             const roles = await getGuildRoles(serverSelected)
    //             if (roles == null) {
    //                 return
    //             }

    //             roles.data.forEach((role) => {
    //                 console.log(role)
    //                 const row = tbody.insertRow(-1)
    //                 const roleName = row.insertCell()
    //                 const roleId = row.insertCell()
    //                 const roleEdit = row.insertCell()

    //                 roleName.innerHTML = `<span>${role.id}</span>`
    //                 roleId.innerHTML = `<span>${role.name}</span>`
    //                 roleEdit.innerHTML = `<button class="btn btn-outline-primary" data-type="edit-role" data-role-id="${role.id}" data-bs-toggle="modal" data-bs-target="#edit-role-modal"><i class="fas fa-edit"></i></button>`
    //             })
    //         })
    //     }
    // }
    // addRolesTabListener(rolesTab)
}

document.addEventListener('DOMContentLoaded', app, false);
