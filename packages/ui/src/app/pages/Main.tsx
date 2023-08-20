import React, { useEffect, useState } from "react"
import { useApiStore } from "../stores/api"
import { Guild, Me } from "../types"
import { GuildSidebar } from "../components/main/GuildSidebar"
import { useAuthStore } from "../stores/auth"
import { UserMenu } from "../components/main/UserMenu"
import { GuildManager } from "../components/main/GuildManager"
import { useGuildStore } from "../stores/guild"

export const Main = () => {
    const clearAuth = useAuthStore().clearAuth
    const authToken = useAuthStore.getState().authToken
    const guildStore = useGuildStore()
    const apiGet = useApiStore().apiGet
    const [guilds, setGuilds] = useState<Guild[]>()
    const [me, setMe] = useState<Me | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const fullHeightDiv = {
        height: '100vh'
    }
    const bigpointImageStyle = {
        width: '48px',
        height: '48px'
    }

    useEffect(() => {
        const load = async () => {
            const [guilds, me] = await Promise.all([
                apiGet<Guild[]>('/me/guilds', authToken),
                apiGet<Me>('/me/info', authToken)
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
                <div className="d-flex flex-column flex-shrink-0 bg-body-tertiary" style={fullHeightDiv}>
                    <nav className="nav nav-pills nav-flush flex-column text-center">
                        <a href="#" className="d-block mt-1 px-1 pt-1 link-body-emphasis text-decoration-none"
                            data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Bigpoint Discord Management">
                            <img className="bi pe-none rounded-circle" style={bigpointImageStyle} role="img"
                                aria-label="Bigpoint Logo" src={''} />
                        </a>
                    </nav>
                    <hr />
                    <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
                        {guilds?.map((guild) => {
                            return (
                                <GuildSidebar key={guild.guild_id} guild={guild} />
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
                            {guilds != null && guilds.length > 0 ?
                                <span>Select a server on the sidebar</span> : <span>You are not authorized to manage any bigpoint servers</span>}
                        </div>
                    </div>
                </div>
            )}

            {!loading && guildStore.guild && <GuildManager />}

            <div className="modal fade" id="edit-role-modal" tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Editing Role <span id="edit-role-name"></span></h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form id="edit-role-form">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox"
                                        id="edit-role-view-server-permission" />
                                    <label className="form-check-label" htmlFor="edit-role-view-server-permission">
                                        View Server
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox"
                                        id="edit-role-view-roles-permission" />
                                    <label className="form-check-label" htmlFor="edit-role-view-roles-permission">
                                        View Role Configuration
                                    </label>
                                </div>
                            </form>

                        </div>
                        <div className="modal-footer">
                            <input type="hidden" id="edit-role-id" />
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" id="edit-role-save">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="edit-rss-modal" tabIndex={-1}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Editing RSS Feed <span id="edit-role-id"></span></h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form id="edit-rss-form">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" id="edit-rss-feed-enabled" />
                                    <label className="form-check-label" htmlFor="edit-rss-feed-enabled">
                                        Enabled
                                    </label>
                                </div>
                                <div className="form-floating my-3">
                                    <input type="text" className="form-control" id="edit-rss-name"
                                        placeholder="Feed Name" />
                                    <label htmlFor="edit-rss-name">Feed Name</label>
                                </div>
                                <div className="form-floating my-3">
                                    <select className="form-select" aria-label="RSS Channel Selector"
                                        id="edit-rss-channel">
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                    <label htmlFor="edit-rss-channel">RSS Feed Channel</label>
                                </div>
                                <div className="form-floating my-3">
                                    <select className="form-select" aria-label="RSS Ping Role" id="edit-rss-ping-role">
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                    <label htmlFor="edit-rss-ping-role">RSS Ping Role</label>
                                </div>
                                <div className="form-floating my-3">
                                    <input type="text" className="form-control" id="edit-rss-url"
                                        placeholder="Feed URL" />
                                    <label htmlFor="edit-rss-url">Feed URL</label>
                                </div>
                            </form>

                        </div>
                        <div className="modal-footer">
                            <input type="hidden" id="edit-role-id" />
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" id="edit-role-save">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            {loading && (
                <div className="d-flex justify-content-center align-items-center w-100" style={fullHeightDiv}>
                    <p>Loading <i className="fas fa-sync fa-spin"></i></p>
                </div>
            )}

        </main >
    )
}