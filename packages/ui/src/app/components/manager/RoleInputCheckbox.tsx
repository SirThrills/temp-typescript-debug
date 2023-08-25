import React, { useEffect, useState } from 'react'
import { GuildPermission, Permission } from '../../types'
import { useGuildStore } from '../../stores/guild'
import { useApiStore } from '../../stores/api'
import { useAuthStore } from '../../stores/auth'

type RoleInputCheckboxProps = {
    name: string
    guildPermissions: GuildPermission[] | null
    permission: Permission
}

export const RoleInputCheckbox = (props: RoleInputCheckboxProps) => {
    const guildStore = useGuildStore()
    const { apiPost } = useApiStore()
    const authToken = useAuthStore().authToken

    const [checked, setChecked] = useState(false)
    const [enabled, setEnabled] = useState(true)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (props.guildPermissions == null) {
            setChecked(false)
        }
        const checked =
            props.guildPermissions?.find(
                (guildPermission) =>
                    guildPermission.permission === props.permission &&
                    guildPermission.has
            ) != null

        console.log(
            `role ${guildStore.selectedRole?.name}, permission: ${props.name}, value: ${checked}`
        )
        setChecked(checked)
    }, [props.guildPermissions])

    const onChange = async (e: React.FormEvent<HTMLInputElement>) => {
        const checked = e.currentTarget.checked
        setLoading(true)
        setEnabled(false)
        console.log('checked', checked)
        try {
            await apiPost(
                `/guilds/${guildStore.guild?.guild_id}/roles/${guildStore.selectedRole?.id}/permissions`,
                {
                    params: {
                        permission: props.permission,
                        value: checked,
                    },
                    authToken,
                }
            )
            setChecked(checked)
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
        setEnabled(true)
    }
    return (
        <div className="form-check">
            <input
                className="form-check-input"
                type="checkbox"
                id={`edit-role-${props.name.toLowerCase()}-permission`}
                checked={checked}
                disabled={!enabled}
                onChange={onChange}
            />
            <label
                className="form-check-label"
                htmlFor={`edit-role-${props.name.toLowerCase()}-permission`}
            >
                {props.name}
                {loading && <i className="ms-1 fas fa-sync fa-spin"></i>}
            </label>
        </div>
    )
}
