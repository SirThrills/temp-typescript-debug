const parseJwt = (token) => {
    if (typeof token !== 'string') {
        return
    }
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const axiosPost = async (url, params, headers) => {
    return await axios.post(url, params, {
        headers,
    })
}

const axiosGet = async (url, headers) => {
    return await axios.get(url, {
        headers
    })
}

const apiPost = async (url, params) => {
    try {
        const access_token = Cookies.get('access_token')
        const res = await axiosPost(`${getAppUrl()}${url}`, params, access_token && {
            'authorization': `bearer ${access_token}`
        })
        return { data: res.data, status: res.status }
    } catch (err) {
        console.log(err)
        if (err.response.status && typeof err.response.status === 'number') {
            switch (err.response.status) {
                case 401:
                    Cookies.remove('access_token')
            }
        }
    }
}

const apiGet = async (url) => {
    try {
        const access_token = Cookies.get('access_token')
        const res = await axiosGet(`${getAppUrl()}${url}`, access_token && {
            'authorization': `bearer ${access_token}`
        })
        return { data: res.data, status: res.status }
    } catch (err) {
        console.log(err)
        if (err.response.status && typeof err.response.status === 'number') {
            switch (err.response.status) {
                case 401:
                    Cookies.remove('access_token')
            }
        }
    }
}

const toggleActive = (parentElm, childElm, active = true) => {
    childElm
        .toggleClass('rounded-circle', !active)
        .toggleClass('rounded-25', active)
    parentElm
        .toggleClass('selected', active)
}

const showLoadingDiv = (loading) => {
    $('#loading').toggleClass('d-none', !loading)
}

const showServerManagement = (show = true) => {
    $('#select-server').toggleClass('d-none', show)
    $('#server-management').toggleClass('d-none', !show)
}

const setServerInfo = (serverInfo) => {
    document.getElementById('server-name').innerText = serverInfo.guild_name
    const imgUrl = data.guild_icon ?? `https://ui-avatars.com/api/?name=${serverInfo.guild_name}`
    document.getElementById('server-icon').src = imgUrl
}

const getParams = () => {
    const querystring = window.location.search
    return new URLSearchParams(querystring)
}

const isDev = () => {
    const params = getParams()
    if (params.get('dev') == null) {
        return false
    }

    return params.get('dev') === "1"
}

const getEnv = () => {
    const params = getParams()
    if (params.get('env') == null) {
        return 'prod'
    }

    return params.get('env')
}

const getAppUrl = () => {
    if (isDev) {
        return 'http://localhost:8080'
    }

    const env = getEnv()
    switch (env) {
        case 'prod':
        default:
            return 'https://<url_here>'
        case 'prodTest':
            return 'https://prod-test.<url_here>'
        case 'devTest':
            return 'https://dev-test.<url_here>'
    }
}

const getOauthUrl = async () => {
    const res = await apiGet('/oauth/url')
    if (res.data.url == null) return
    return res.data.url
}

const getToken = async (code) => {
    const tokenRes = await apiPost('/oauth/exchange', { code })
    if (tokenRes.data == null) {
        return
    }
    return tokenRes.data

}

const configureUser = async () => {
    const params = getParams()
    const code = params.get('code')
    const accessToken = Cookies.get('access_token')

    // Reset cookie if new code
    if (accessToken && code) {
        Cookies.remove('access_token')
    }

    if (code) {
        const token = await getToken(code)

        window.history.pushState({}, 'Discord Management UI', window.location.origin);

        console.log('token', token)

        if (
            token == null ||
            token.access_token == null
        ) {
            return
        }

        const jwtParsed = parseJwt(token.access_token)
        console.log('at', token.accessToken, 'jwt parsed', jwtParsed)

        const expires = new Date((Date.now() + jwtParsed.exp - 100))
        Cookies.set('access_token', token.access_token, {
            expires
        })
        return
    }

    if (accessToken == null && code == null) {
        const url = await getOauthUrl()
        if (url == null) {
            return
        }
        window.location.href = url
    }
}

const getMe = async () => {
    return apiGet('/me/info')
}

const getGuilds = async () => {
    return apiGet(`/me/guilds`)
}

const getGuildInfo = async (guildId) => {
    return apiGet(`/guilds/${guildId}`)
}

const getGuildPermissions = async (guildId) => {
    return apiGet(`/guilds/${guildId}/permissions`)
}

const getGuildRoles = async (guildId) => {
    return apiGet(`/guilds/${guildId}/roles`)
}

const getGuildRssFeeds = async (guildId) => {
    return apiGet(`/guilds/${guildId}/rss/feeds`)
}

const getGuildFeed = async (guildId, feedId) => {
    return apiGet(`/guilds/${guildId}/rss/feed/${feedId}`)
}

const getGuildChannels = async (guildId) => {
    return apiGet(`/guilds/${guildId}/channels`)
}

const configureTooltips = () => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    tooltipTriggerList.forEach(ttElm => {
        const tooltip = new bootstrap.Tooltip(ttElm)
        ttElm.addEventListener("click", function () {
            tooltip.hide()
        })
    })
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
    state.previousTab = state.tab
    console.log(`updating tab from ${state.previousTab} to ${tab}`)
    state.tab = tab
}

const setActiveRole = (state, role) => {
    state.rolesContext = state.rolesContext ?? []
    state.rolesContext.editRoleId = role
}

const setActiveFeed = (state, feed) => {
    state.rssContext = state.rssContext ?? []
    if (feed == null) {
        state.rssContext.feed = null
        return
    }
    state.rssContext.feed = feed.data
}

const setLoading = (loading) => {
    $('#app-loading').toggleClass('d-none', !loading)
}

const getParentAndChildElm = (middleElm) => {
    if (middleElm == null) {
        return
    }

    const parentElm = middleElm.parent()
    const childElm = middleElm.children().first()

    return { parentElm, childElm }
}

const updateInfoTab = (state) => {
    if (state.tab !== 'info-tab') {
        return
    }

    if (state.guildInfo == null) {
        return
    }

    const { guild_name, guild_icon } = state.guildInfo
    if (guild_name == null || guild_icon == null) {
        return
    }

    $('#server-name').text(guild_name)
    $('#server-icon').attr('src', guild_icon)
}

const updateUserInfo = (user) => {
    $('#user-name').text(user.username)
    $('#user-icon').attr('src', user.avatarURL ?? `https://ui-avatars.com/api/?name=${guild.guild_name}`)
}

const updateGuildsSidebar = (guilds) => {
    $('#server-list').empty()
    if (guilds == null || guilds.length === 0) {
        return
    }

    guilds.forEach((guild) => {
        $('#server-list').append(`
        <li class="nav-item">
            <a href="#" data-server-id="${guild.guild_id}" class="nav-link py-3 my-1" aria-current="page" data-bs-toggle="tooltip" data-bs-title="${guild.guild_name}" data-bs-placement="right" aria-label="${guild.guild_name}">
                <img class="bi pe-none rounded-circle squircle" style="width:48px;height:48px;" role="img" aria-label="${guild.guild_name}" src="${guild.guild_icon ?? `https://ui-avatars.com/api/?name=${guild.guild_name}`}" />
            </a >
        </li > `)
    })
}

const resetRoles = (state) => {
    if (state && state.rolesContext) {
        state.rolesContext = null
    }
    $('#server-roles-table').empty()
}

const resetRssFeed = () => {
}

const resetChannels = () => {

}

const resetBans = () => {

}

const resetWarnings = () => {

}

const resetAll = (state) => {
    resetRoles(state)
    resetRssFeed(state)
    resetChannels(state)
    resetBans(state)
    resetWarnings(state)
}

$(function () {
    const state = []

    const loadApp = async () => {
        console.log('app settings', { dev: isDev(), appUrl: getAppUrl() })
        console.log('configuring user')
        await configureUser()

        if (Cookies.get('access_token') == null) {
            console.log('access token missing')
            return
        }

        console.log('populating user info and servers')
        const [me, guilds] = await Promise.all([getMe(), getGuilds()])
        if (me == null) {
            console.log('no user info')
            return
        }
        if (guilds == null) {
            console.log('no guilds')
            return
        }

        state.userInfo = me.data
        updateUserInfo(me.data)
        updateGuildsSidebar(guilds.data)
        configureTooltips()
        $('#server-sidebar').toggleClass('d-none', false)

        setLoading(false)
    }

    loadApp().catch((err) => {
        console.log(err)
    })

    $(document).on('click', 'a[data-server-id]', async function (e) {
        showServerManagement(false)
        resetAll()
        const { parentElm, childElm } = getParentAndChildElm($(this))
        if (parentElm == null || childElm == null) {
            return
        }
        const serverId = $(this).data('server-id')
        if (isNaN(parseInt(serverId))) {
            return
        }
        showLoadingDiv(true)
        const guildInfo = await getGuildInfo(serverId)
        if (guildInfo.data == null) {
            showLoadingDiv(false)
            return
        }
        state.guildInfo = guildInfo.data
        setServerSelected(state, serverId)
        updateHtmlElements(state, parentElm, childElm)
        showServerManagement(true)
        const triggerTabElm = document.querySelector('#tablist button[data-bs-target="#info-tab-pane"]')
        bootstrap.Tab.getInstance(triggerTabElm).show()
        setActiveTab(state, 'info-tab')
        updateInfoTab(state)
        showLoadingDiv(false)
    })

    $(document).on('mouseover', 'a[data-server-id]', function (e) {
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

    $(document).on('mouseout', 'a[data-server-id]', function (e) {
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

    $('#roles-tab').click(async function (e) {
        if (state.serverId == null) {
            return
        }

        const roles = await getGuildRoles(state.serverId)
        if (roles.data == null) {
            return
        }

        const rolesTable = $('#server-roles-table')
        if (rolesTable == null) {
            return
        }

        rolesTable.empty()
        roles.data.forEach((role) => {
            rolesTable.append(
                `<tr>
                    <td>${role.id}</td>
                    <td>${role.name}</td>
                    <td><button class="btn btn-outline-primary" 
                        data-type="edit-role" data-role-id="${role.id}" 
                        data-bs-toggle="modal" data-bs-target="#edit-role-modal"
                        ><i class="fas fa-edit"></i>
                    </button></td>
                </tr>`
            )
        })
    })

    $('#rss-tab').click(async function (e) {
        if (state.serverId == null) {
            return
        }

        const rssFeeds = await getGuildRssFeeds(state.serverId)
        if (rssFeeds.data == null) {
            return
        }

        const rssFeedsTable = $('#rss-feeds-table')
        if (rssFeedsTable == null) {
            return
        }

        rssFeedsTable.empty()
        rssFeeds.data.forEach((rssFeed) => {
            rssFeedsTable.append(
                `<tr>
                    <td>${rssFeed.enabled === 1 ? '<i class="fas fa-square-check"></i>' : '<i class="fas fa-square-xmark">'}
                    <td>${rssFeed.name}</td>
                    <td>#${rssFeed.channel_name ?? rssFeed.channel_id}</td>
                    <td>${rssFeed.role_name ? '@' : ''}${rssFeed.role_name ?? rssFeed.ping_role_id ?? 'N/A'}</td>
                    <td><a href="${rssFeed.rss_url}" target="_blank">${rssFeed.rss_url}</td>
                    <td><button class="btn btn-outline-primary" 
                        data-type="edit-rss" data-feed-id="${rssFeed.id}" 
                        data-bs-toggle="modal" data-bs-target="#edit-rss-modal"
                        ><i class="fas fa-edit"></i>
                    </button></td>
                </tr>`
            )
        })
    })

    $('#tablist').on('show.bs.tab', function (event) {
        const newTab = event.target.id
        const oldTab = event.relatedTarget.id
        if (newTab === oldTab) {
            return
        }
        setActiveTab(state, newTab)
        switch (oldTab) {
            case 'roles-tab':
                resetRoles(state)
                break
        }
    })

    $(document).on('click', 'button[data-type="edit-role"]', function (e) {
        const roleId = $(this).data('role-id')
        if (isNaN(parseInt(roleId))) {
            return
        }
        setActiveRole(state, roleId)
    })

    $(document).on('click', 'button[data-type="edit-rss"]', async function () {
        const children = $('#edit-rss-form').find(':input, select')
        children.prop('disabled', true)
        const feedId = $(this).data('feed-id')
        if (isNaN(parseInt(feedId))) {
            return
        }
        const [feed, channels, roles] = await Promise.all([
            getGuildFeed(state.serverId, feedId),
            getGuildChannels(state.serverId),
            getGuildRoles(state.serverId)
        ])
        if (feed == null || channels == null || roles == null) {
            return
        }
        setActiveFeed(state, feed)
        $('#edit-rss-feed-enabled').prop('checked', feed.data.enabled === 1)
        $('#edit-rss-name').val(feed.data.name)
        //$('#edit-rss-url').val(feed.data.rss_url)
        children.prop('disabled', false)
    })

    $('#edit-rss-modal').on('hidden.bs.modal', function () {
        setActiveFeed(state, null)
        $('#edit-rss-form').get(0).reset()

    })

    $('#edit-role-save', async function () {
        if (state.rolesContext == null || state.rolesContext.editRoleId == null) {
            return
        }

        await apiPost('saveRoleConfiguration', {})
    })

    $('#edit-role-modal').on('hidden.bs.modal', function () {
        setActiveRole(state, null)
        console.log(state)
    })
})
