import React from "react"
import { useGuildStore } from "../../stores/guild"
import { Permission } from "../../types"
import { RoleTab } from "./tabs/RoleTab"
import { InfoTab } from "./tabs/InfoTab"
import { RSSTab } from "./tabs/RSSTab"

export const ManagerUI = () => {
    const guildStore = useGuildStore()

    const hasPermission = (permission: Permission) => {
        return guildStore.permissions?.find((guildPermission) => guildPermission.permission === permission && guildPermission.has) != null
    }
    return (
        <div className="d-flex w-100 mt-5 justify-content-center align-items-centers" id="management">
            <div className="justify-content-center align-items-center w-75">
                <div className="outline">
                    <nav>
                        <ul className="nav nav-tabs nav-fill mb-3" role="tablist" id="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="info-tab" data-bs-toggle="tab"
                                    data-bs-target="#info-tab-pane" type="button" role="tab"
                                    aria-controls="info-tab-pane" aria-selected="true">Info</button>
                            </li>
                            <li className="nav-item" role="presentation" id="role-configuration-nav-item">
                                <button className="nav-link" id="roles-tab" data-bs-toggle="tab"
                                    data-bs-target="#roles-tab-pane" type="button" role="tab"
                                    aria-controls="roles-tab-pane" aria-selected="true" disabled={!hasPermission(Permission.VIEW_ROLES)}>Role
                                    Configuration</button>
                            </li>
                            <li className="nav-item" role="presentation" id="rss-feed-nav-item">
                                <button className="nav-link" id="rss-tab" data-bs-toggle="tab"
                                    data-bs-target="#rss-tab-pane" type="button" role="tab"
                                    aria-controls="rss-tab-pane" aria-selected="true" disabled={!hasPermission(Permission.VIEW_RSS)}>RSS
                                    Feeds</button>
                            </li>
                            <li className="nav-item" role="presentation" id="channel-logging-nav-item">
                                <button className="nav-link" id="channel-tab" data-bs-toggle="tab"
                                    data-bs-target="#channels-tab-pane" type="button" role="tab"
                                    aria-controls="channels-tab-pane" aria-selected="true" disabled={!hasPermission(Permission.VIEW_CHANNELS)}>Channel
                                    Logging</button>
                            </li>
                            <li className="nav-item" role="presentation" id="bans-nav-item">
                                <button className="nav-link" id="bans-tab" data-bs-toggle="tab"
                                    data-bs-target="#bans-tab-pane" type="button" role="tab"
                                    aria-controls="bans-tab-pane" aria-selected="true" disabled={!hasPermission(Permission.VIEW_BANS)}>Bans</button>
                            </li>
                            <li className="nav-item" role="presentation" id="warnings-nav-item">
                                <button className="nav-link" id="warnings-tab" data-bs-toggle="tab"
                                    data-bs-target="#warnings-tab-pane" type="button" role="tab"
                                    aria-controls="warnings-tab-pane" aria-selected="true" disabled={!hasPermission(Permission.VIEW_WARNINGS)}>Warnings</button>
                            </li>
                        </ul>
                    </nav>
                    <div className="tab-content" id="tab-content">
                        <InfoTab />
                        <RoleTab />
                        <RSSTab />
                        <div className="tab-pane fade" id="channels-tab-pane" role="tabpanel"
                            aria-labelledby="channels-tab" tabIndex={0}>
                            Channels</div>
                        <div className="tab-pane fade" id="bans-tab-pane" role="tabpanel" aria-labelledby="bans-tab"
                            tabIndex={0}>
                            Bans</div>
                        <div className="tab-pane fade" id="warnings-tab-pane" role="tabpanel"
                            aria-labelledby="warnings-tab" tabIndex={0}>
                            Warnings</div>
                    </div>
                </div>
            </div>
        </div>
    )
}