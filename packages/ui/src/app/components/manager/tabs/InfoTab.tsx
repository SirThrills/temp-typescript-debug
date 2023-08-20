import React from "react"
import { useGuildStore } from "../../../stores/guild"

export const InfoTab = () => {
    const guildStore = useGuildStore()
    return (
        <div className="tab-pane fade show active" id="info-tab-pane" role="tabpanel"
            aria-labelledby="info-tab" tabIndex={0}>
            <div className="d-flex flex-row py-2">
                <div className="d-flex align-items-center">
                    <img className="server-icon rounded-circle" src={guildStore.guild?.guild_icon} />
                </div>
                <div className="d-flex align-items-center mx-2">
                    <span>{guildStore.guild?.guild_name}</span>
                </div>
                <div className="d-flex align-items-center mx-2 clickable">
                    <i className="fas fa-sync"></i>
                </div>
            </div>
        </div>
    )
}