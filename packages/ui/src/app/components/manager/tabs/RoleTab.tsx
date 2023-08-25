import React, { useEffect, useState } from 'react'
import { useGuildStore } from '../../../stores/guild'
import { GuildPermission } from '../../../types'
import { useAuthStore } from '../../../stores/auth'
import { useApiStore } from '../../../stores/api'

export const RoleTab = () => {
    const guildStore = useGuildStore()
    return (
        <div
            className="tab-pane fade"
            id="roles-tab-pane"
            role="tabpanel"
            aria-labelledby="roles-tab"
            tabIndex={0}
        >
            {guildStore.roles ? (
                <div className="d-flex flex-row py-2">
                    <table className="table table-responsive table-sm">
                        <thead className="text-center">
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {guildStore.roles.map((role) => {
                                return (
                                    <tr key={role.id}>
                                        <td>{role.id}</td>
                                        <td>
                                            <span className="mentionable-item">
                                                {role.name.startsWith('@')
                                                    ? role.name
                                                    : `@${role.name}`}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-outline-primary"
                                                data-type="edit-rss"
                                                data-feed-id={role.id}
                                                data-bs-toggle="modal"
                                                data-bs-target="#edit-role-modal"
                                                onClick={() =>
                                                    guildStore.setSelectedGuildRole(
                                                        role
                                                    )
                                                }
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <span>No roles found for this guild</span>
            )}
        </div>
    )
}
