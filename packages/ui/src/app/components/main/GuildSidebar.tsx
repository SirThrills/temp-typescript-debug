import React from "react"
import { Guild } from "../../types"
import { useGuildStore } from "../../stores/guild"

type GuildSidebarProps = {
    guild: Guild
}

export const GuildSidebar = (props: GuildSidebarProps) => {
    const setSelectedGuild = useGuildStore().setSelectedGuild

    const { guild } = props
    const bigpointImageStyle = {
        width: '48px',
        height: '48px'
    }
    return (
        <li className="nav-item">
            <a href="#" className="nav-link py-3 my-1" aria-current="page" data-bs-toggle="tooltip" data-bs-title={guild.guild_name} data-bs-placement="right" aria-label={guild.guild_name} onClick={() => setSelectedGuild(guild)}>
                <img className="bi pe-none rounded-circle squircle" style={bigpointImageStyle} role="img" aria-label={guild.guild_name} src={guild.guild_icon ?? `https://ui-avatars.com/api/?name=${guild.guild_name}`} />
            </a>
        </li >
    )
}