import { create } from "zustand";
import { Guild, GuildPermission, GuildRole } from "../types";

type GuildState = {
    guild: Guild | null
    roles: GuildRole[] | null
    permissions: GuildPermission[] | null
    selectedRoleId: string | null
    setSelectedGuild: (guild: Guild | null) => void
    setPermissions: (permissions: GuildPermission[] | null) => void
    setRoles: (roles: GuildRole[] | null) => void
    setSelectedGuildRole?: (roleId: string) => void
}

export const useGuildStore = create<GuildState>((set) => {
    const guild = null
    const roles = null
    const selectedRoleId = null
    const permissions = null
    return {
        guild,
        roles,
        permissions,
        selectedRoleId,
        setSelectedGuild: (guild: Guild | null) => {
            set({ guild })
        },
        setPermissions: (permissions: GuildPermission[] | null) => {
            set({ permissions })
        },
        setRoles: (roles: GuildRole[] | null) => {
            set({ roles })
        }
    }
})