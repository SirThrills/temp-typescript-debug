import React, { useEffect, useState } from 'react'
import { useApiStore } from '../stores/api'
import { Guild, Me, Permission } from '../types'
import { GuildSidebar } from '../components/main/GuildSidebar'
import { useAuthStore } from '../stores/auth'
import { UserMenu } from '../components/main/UserMenu'
import { GuildManager } from '../components/main/GuildManager'
import { useGuildStore } from '../stores/guild'
import { RoleModal } from '../components/manager/modals/RoleModal'
import { EditRssModal } from '../components/manager/modals/EditRssModal'
import { DeleteRssModal } from '../components/manager/modals/DeleteRssModal'
import { AddRssModal } from '../components/manager/modals/AddRssModal'

export const Main = () => {
    const clearAuth = useAuthStore().clearAuth
    const authToken = useAuthStore.getState().authToken
    const guildStore = useGuildStore()
    const apiGet = useApiStore().apiGet
    const [guilds, setGuilds] = useState<Guild[]>()
    const [me, setMe] = useState<Me | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const fullHeightDiv = {
        height: '100vh',
    }
    const bigpointImageStyle = {
        width: '48px',
        height: '48px',
    }

    useEffect(() => {
        const load = async () => {
            const [guilds, me] = await Promise.all([
                apiGet<Guild[]>('/me/guilds', authToken),
                apiGet<Me>('/me/info', authToken),
            ])

            if (me == null) {
                return clearAuth()
            }

            setMe(me)
            setGuilds(guilds)
            setLoading(false)
        }

        load()
    }, [])

    return (
        <main className="d-flex flex-nowrap">
            {me && (
                <div
                    className="d-flex flex-column flex-shrink-0 bg-body-tertiary"
                    style={fullHeightDiv}
                >
                    <nav className="nav nav-pills nav-flush flex-column text-center">
                        <a
                            href="#"
                            className="d-block mt-1 px-1 pt-1 link-body-emphasis text-decoration-none"
                            data-bs-toggle="tooltip"
                            data-bs-placement="right"
                            data-bs-title="Bigpoint Discord Management"
                        >
                            <img
                                className="bi pe-none rounded-circle"
                                style={bigpointImageStyle}
                                role="img"
                                aria-label="Bigpoint Logo"
                                src="https://cdn.bigpoint-discord.net/bigpoint.png"
                            />
                        </a>
                    </nav>
                    <hr />
                    <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
                        {guilds?.map((guild) => {
                            return (
                                <GuildSidebar
                                    key={guild.guild_id}
                                    guild={guild}
                                />
                            )
                        })}
                    </ul>
                    <UserMenu me={me} clearAuth={clearAuth} />
                </div>
            )}

            {!loading && guildStore.guild == null && (
                <div className="d-flex w-100 justify-content-center align-items-center">
                    <div className="d-flex w-100 flex-column text-white justify-content-center align-items-center">
                        <div className="p-2">
                            {guilds != null && guilds.length > 0 ? (
                                <span>Select a server on the sidebar</span>
                            ) : (
                                <span>
                                    You are not authorized to manage any
                                    bigpoint servers
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {!loading && guildStore.guild && <GuildManager />}

            {guildStore.permissions?.find(
                (guildPermission) =>
                    guildPermission.permission === Permission.EDIT_ROLES &&
                    guildPermission.has
            ) && <RoleModal />}
            {guildStore.permissions?.find(
                (guildPermission) =>
                    guildPermission.permission === Permission.EDIT_RSS &&
                    guildPermission.has
            ) && <EditRssModal />}
            {guildStore.permissions?.find(
                (guildPermission) =>
                    guildPermission.permission === Permission.EDIT_RSS &&
                    guildPermission.has
            ) && <DeleteRssModal />}
            {guildStore.permissions?.find(
                (guildPermission) =>
                    guildPermission.permission === Permission.EDIT_RSS &&
                    guildPermission.has
            ) && <AddRssModal />}

            {loading && (
                <div
                    className="d-flex justify-content-center align-items-center w-100"
                    style={fullHeightDiv}
                >
                    <p>
                        Loading <i className="fas fa-sync fa-spin"></i>
                    </p>
                </div>
            )}
        </main>
    )
}
