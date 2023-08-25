import React, { useEffect, useState } from 'react'
import { useGuildStore } from '../../../stores/guild'
import { Guild, GuildPermission } from '../../../types'
import { useAuthStore } from '../../../stores/auth'
import { useApiStore } from '../../../stores/api'

export const RSSTab = () => {
    const guildStore = useGuildStore()
    const authToken = useAuthStore().authToken
    const { apiGet, apiPost } = useApiStore()
    return (
        <div
            className="tab-pane fade"
            id="rss-tab-pane"
            role="tabpanel"
            aria-labelledby="rss-tab"
            tabIndex={0}
        >
            <div className="d-flex flex-row">
                <button type="button" className="btn btn-outline-primary">
                    <i className="fas fa-plus"></i> Add Feed
                </button>
            </div>
            {guildStore.rss ? (
                <div className="d-flex flex-row py-2">
                    <table className="table table-responsive table-sm">
                        <thead>
                            <tr className="text-center">
                                <th>Enabled</th>
                                <th>Name</th>
                                <th>Channel</th>
                                <th>Ping Role</th>
                                <th>Feed URL</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {guildStore.rss.map((rss) => {
                                return (
                                    <tr key={rss.id}>
                                        <td>
                                            {rss.enabled ? (
                                                <i className="fas fa-square-check text-success-emphasis"></i>
                                            ) : (
                                                <i className="fas fa-square-xmark text-danger-emphasis"></i>
                                            )}
                                        </td>
                                        <td>{rss.name}</td>
                                        <td>
                                            <span className="mentionable-item">
                                                #
                                                {rss.channel_name ??
                                                    rss.channel_id}
                                            </span>
                                        </td>
                                        <td>
                                            {rss.role_name ||
                                            rss.ping_role_id ? (
                                                <span className="mentionable-item">
                                                    @
                                                    {rss.role_name ??
                                                        rss.ping_role_id}
                                                </span>
                                            ) : (
                                                'N/A'
                                            )}
                                        </td>
                                        <td>
                                            <a
                                                href={rss.rss_url}
                                                target="_blank"
                                            >
                                                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                                <span className="ms-1">
                                                    {rss.rss_url}
                                                </span>
                                            </a>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() =>
                                                    guildStore.setShowEditRss(
                                                        rss,
                                                        true
                                                    )
                                                }
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                className="ms-2 btn btn-outline-danger"
                                                onClick={() =>
                                                    guildStore.setShowDeleteRss(
                                                        rss,
                                                        true
                                                    )
                                                }
                                            >
                                                <i className="fas fa-times"></i>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="d-flex w-100">
                    <span className="mx-auto">
                        No RSS feeds for this guild found
                    </span>
                </div>
            )}
        </div>
    )
}
