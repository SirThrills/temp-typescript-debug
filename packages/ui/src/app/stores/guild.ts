import { create } from 'zustand'
import { Guild, GuildPermission, GuildRSS, GuildRole } from '../types'

type GuildState = {
    guild: Guild | null
    roles: GuildRole[] | null
    rss: GuildRSS[] | null
    permissions: GuildPermission[] | null
    selectedRole: GuildRole | null
    selectedRSS: GuildRSS | null
    showRssEdit: boolean
    showRssDelete: boolean
    setSelectedGuild: (guild: Guild | null) => void
    setPermissions: (permissions: GuildPermission[] | null) => void
    setRoles: (roles: GuildRole[] | null) => void
    setRss: (rss: GuildRSS[] | null) => void
    setSelectedGuildRole: (role: GuildRole | null) => void
    setSelectedRss: (rss: GuildRSS | null) => void
    setShowEditRss: (rss: GuildRSS | null, show: boolean) => void
    setShowDeleteRss: (rss: GuildRSS | null, show: boolean) => void
}

export const useGuildStore = create<GuildState>((set) => {
    const guild = null
    const roles = null
    const rss = null
    const selectedRole = null
    const selectedRSS = null
    const permissions = null
    const showRssEdit = false
    const showRssDelete = false
    return {
        guild,
        roles,
        rss,
        permissions,
        selectedRole,
        selectedRSS,
        showRssEdit,
        showRssDelete,
        setSelectedGuild: (guild: Guild | null) => {
            set({
                guild,
                roles: null,
                rss: null,
                permissions: null,
                selectedRole: null,
                selectedRSS: null,
            })
        },
        setPermissions: (permissions: GuildPermission[] | null) => {
            set({ permissions })
        },
        setRoles: (roles: GuildRole[] | null) => {
            set({ roles })
        },
        setRss: (rss: GuildRSS[] | null) => {
            set({ rss })
        },
        setSelectedGuildRole: async (role: GuildRole | null) => {
            set({ selectedRole: role })
        },
        setSelectedRss: (rss: GuildRSS | null) => {
            console.log('called with', rss)
            set({ selectedRSS: rss })
        },
        setShowEditRss: (rss: GuildRSS | null, show: boolean) => {
            set({ showRssEdit: show, selectedRSS: rss })
        },
        setShowDeleteRss: (rss: GuildRSS | null, show: boolean) => {
            set({ showRssDelete: show, selectedRSS: rss })
        },
    }
})
