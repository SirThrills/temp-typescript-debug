import React, { useEffect, useState } from 'react'
import { Loading } from '../manager/Loading'
import { ManagerUI } from '../manager/ManagerUI'
import { useApiStore } from '../../stores/api'
import { useAuthStore } from '../../stores/auth'
import { useGuildStore } from '../../stores/guild'
import { GuildPermission, GuildRSS, GuildRole, Permission } from '../../types'

export const GuildManager = () => {
    const guildStore = useGuildStore()
    const apiStore = useApiStore()
    const authToken = useAuthStore().authToken
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (guildStore.guild == null) {
            return
        }

        setLoading(true)
        const loadGuild = async (guildId: string) => {
            const guildPermissions = await apiStore.apiGet<GuildPermission[]>(
                `/guilds/${guildId}/permissions`,
                authToken
            )
            if (guildPermissions == null) {
                return setLoading(false)
            }

            guildStore.setPermissions(guildPermissions)

            if (
                guildPermissions.find(
                    (guildPermission) =>
                        guildPermission.permission === Permission.VIEW_ROLES
                )
            ) {
                const guildRoles = await apiStore.apiGet<GuildRole[]>(
                    `/guilds/${guildId}/roles`,
                    authToken
                )
                if (guildRoles) {
                    guildStore.setRoles(guildRoles)
                }
            }

            if (
                guildPermissions.find(
                    (guildPermission) =>
                        guildPermission.permission === Permission.VIEW_RSS
                )
            ) {
                const guildRss = await apiStore.apiGet<GuildRSS[]>(
                    `/guilds/${guildId}/rss/feeds`,
                    authToken
                )
                if (guildRss) {
                    guildStore.setRss(guildRss)
                }
            }

            setLoading(false)
        }

        loadGuild(guildStore.guild?.guild_id)
    }, [guildStore.guild])
    return (
        <div className="d-flex w-100" id="server-management">
            {loading ? <Loading /> : <ManagerUI />}
        </div>
    )
}
