import React, { useEffect, useState } from 'react'
import { useGuildStore } from '../../../stores/guild'
import { useApiStore } from '../../../stores/api'
import { useAuthStore } from '../../../stores/auth'
import { GuildPermission, Permission } from '../../../types'
import { RoleInputCheckbox } from '../RoleInputCheckbox'

const rolePermissionsList = [
    {
        name: 'View Server',
        permission: Permission.VIEW_SERVER,
    },
    {
        name: 'View Roles',
        permission: Permission.VIEW_ROLES,
    },
    {
        name: 'View RSS',
        permission: Permission.VIEW_RSS,
    },
    {
        name: 'View Channels',
        permission: Permission.VIEW_CHANNELS,
    },
    {
        name: 'View Bans',
        permission: Permission.VIEW_BANS,
    },
    {
        name: 'View Warnings',
        permission: Permission.VIEW_WARNINGS,
    },
]

export const RoleModal = () => {
    const guildStore = useGuildStore()
    const authToken = useAuthStore().authToken
    const { apiGet } = useApiStore()
    const [guildPermissions, setGuildPermissions] = useState<
        GuildPermission[] | null
    >(null)

    useEffect(() => {
        if (guildStore.selectedRole == null) {
            setGuildPermissions(null)
            return
        }

        if (guildStore.guild == null) {
            return
        }

        const fetchGuildPermissions = async (
            guildId: string,
            roleId: string
        ) => {
            const permissions = await apiGet<GuildPermission[]>(
                `/guilds/${guildId}/roles/${roleId}/permissions`,
                authToken
            )

            setGuildPermissions(permissions ?? null)
        }

        fetchGuildPermissions(
            guildStore.guild.guild_id,
            guildStore.selectedRole.id
        )

        return () => {
            setGuildPermissions(null)
        }
    }, [guildStore.selectedRole])

    return (
        <div className="modal fade" id="edit-role-modal" tabIndex={-1}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            Editing Role - {guildStore.selectedRole?.name}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form id="edit-role-form">
                            {rolePermissionsList.map((rolePermission) => {
                                return (
                                    <RoleInputCheckbox
                                        key={rolePermission.name}
                                        guildPermissions={guildPermissions}
                                        name={rolePermission.name}
                                        permission={rolePermission.permission}
                                    />
                                )
                            })}
                        </form>
                    </div>
                    <div className="modal-footer">
                        <input type="hidden" id="edit-role-id" />
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
