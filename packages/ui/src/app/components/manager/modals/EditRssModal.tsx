import React, { useEffect, useState } from 'react'
import { useApiStore } from '../../../stores/api'
import { useAuthStore } from '../../../stores/auth'
import { useGuildStore } from '../../../stores/guild'
import { GuildChannel, GuildRole } from '../../../types'
import { Form, Modal } from 'react-bootstrap'

export const EditRssModal = () => {
    const guildStore = useGuildStore()
    const authToken = useAuthStore().authToken
    const { apiGet, apiPost } = useApiStore()
    const [channels, setChannels] = useState<GuildChannel[] | null>(null)
    const [roles, setRoles] = useState<GuildRole[] | null>(null)
    const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
    const [selectedRole, setSelectedRole] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        console.log(guildStore)
        if (guildStore.guild == null || guildStore.selectedRSS == null) {
            return setChannels(null)
        }

        const fetchChannels = async (guildId: string) => {
            const channels = await apiGet<GuildChannel[]>(
                `/guilds/${guildId}/channels`,
                authToken
            )
            setChannels(channels ?? null)

            console.log(
                'setting channel to',
                guildStore.selectedRSS?.channel_id
            )
            setSelectedChannel(guildStore.selectedRSS?.channel_id ?? null)
        }

        fetchChannels(guildStore.guild.guild_id)
        console.log('setting role to', guildStore.selectedRSS?.ping_role_id)
        setRoles(guildStore.roles)
        setSelectedRole(guildStore.selectedRSS?.ping_role_id ?? null)
    }, [guildStore.selectedRSS])

    useEffect(() => {
        if (guildStore.selectedRSS == null || channels == null) {
            return
        }
        setSelectedChannel(guildStore.selectedRSS.channel_id)
    }, [channels])

    useEffect(() => {
        if (guildStore.selectedRSS == null || roles == null) {
            return
        }

        setSelectedRole(guildStore.selectedRSS.ping_role_id ?? null)
    }, [roles])

    const handleClose = () => {
        guildStore.setShowEditRss(null, false)
        setSelectedChannel(null)
        setSelectedRole(null)
        setChannels(null)
    }

    const saveRssFeed = async () => {
        setSaving(true)
        const formElm = document.getElementById(
            'edit-rss-form'
        ) as HTMLFormElement
        if (formElm == null) {
            console.log('no form elm')
            setSaving(false)
            return
        }
        //console.log(formElm)
        const elms = formElm.getElementsByTagName('div')
        if (elms.length === 0) {
            console.log('no elms')
            setSaving(false)
            return
        }
        let data = {}
        for (const elm of elms) {
            const childElm = elm.children[0]
            if (
                !(childElm instanceof HTMLInputElement) &&
                !(childElm instanceof HTMLSelectElement)
            ) {
                continue
            }
            const isInput =
                childElm.tagName.includes('INPUT') ||
                childElm.tagName.includes('SELECT')

            if (!isInput) {
                continue
            }
            if (
                childElm.dataset.name == null ||
                childElm.dataset.type == null
            ) {
                continue
            }

            const name = childElm.dataset.name
            const type = childElm.dataset.type
            let value
            if (type === 'boolean' && childElm instanceof HTMLInputElement) {
                value = childElm.checked
            } else if (
                type === 'string' &&
                childElm instanceof HTMLInputElement
            ) {
                const trimmedValue = childElm.value.trimStart()
                if (trimmedValue.length === 0) {
                    value = null
                } else {
                    value = trimmedValue
                }
            } else if (childElm instanceof HTMLSelectElement) {
                value = childElm.value === 'null' ? null : childElm.value
            }

            data = {
                ...data,
                [name]: value,
            }
        }
        console.log(data)
        if (Object.keys(data).length === 0) {
            setSaving(false)
        }
        try {
            await apiPost(
                `/guilds/${guildStore.guild?.guild_id}/rss/feed/${guildStore.selectedRSS?.id}`,
                { params: data, authToken }
            )
        } catch (err) {
            console.log(err)
        }
        setSaving(false)
    }

    const handleChannelChange = (event: React.FormEvent<HTMLSelectElement>) => {
        setSelectedChannel(event.currentTarget.value)
    }

    const handleRoleChange = (event: React.FormEvent<HTMLSelectElement>) => {
        setSelectedRole(event.currentTarget.value)
    }
    return (
        <Modal show={guildStore.showRssEdit} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{guildStore.selectedRSS?.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form id="edit-rss-form">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="edit-rss-feed-enabled"
                            defaultChecked={guildStore.selectedRSS?.enabled}
                            data-name="enabled"
                            data-type="boolean"
                        />
                        <label
                            className="form-check-label"
                            htmlFor="edit-rss-feed-enabled"
                        >
                            Enabled
                        </label>
                    </div>
                    <div className="form-floating my-3">
                        <input
                            type="text"
                            className="form-control"
                            id="edit-rss-name"
                            defaultValue={guildStore.selectedRSS?.name}
                            placeholder="Feed Name"
                            data-name="name"
                            data-type="string"
                        />
                        <label htmlFor="edit-rss-name">Feed Name*</label>
                    </div>
                    <div className="form-floating my-3">
                        <Form.Select
                            className="form-select"
                            id="edit-rss-channel"
                            value={selectedChannel ?? 'null'}
                            onChange={handleChannelChange}
                            data-name="channel_id"
                            data-type="string"
                        >
                            {channels?.map((channel) => {
                                return (
                                    <option value={channel.id} key={channel.id}>
                                        {channel.name}
                                    </option>
                                )
                            })}
                        </Form.Select>
                        <Form.Label htmlFor="edit-rss-channel">
                            RSS Feed Channel*
                        </Form.Label>
                    </div>
                    <div className="form-floating my-3">
                        <Form.Select
                            className="form-select"
                            aria-label="RSS Ping Role"
                            value={selectedRole ?? 'null'}
                            onChange={handleRoleChange}
                            data-name="ping_role_id"
                            data-type="string"
                        >
                            <option value="null">None</option>
                            {guildStore.roles?.map((role) => {
                                return (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                )
                            })}
                        </Form.Select>
                        <label htmlFor="edit-rss-ping-role">
                            RSS Ping Role
                        </label>
                    </div>
                    <div className="form-floating my-3">
                        <input
                            type="text"
                            className="form-control"
                            id="edit-rss-url"
                            defaultValue={guildStore.selectedRSS?.rss_url}
                            placeholder="Feed URL"
                            data-name="rss_url"
                            data-type="string"
                        />
                        <label htmlFor="edit-rss-url">Feed URL*</label>
                    </div>
                    <div className="form-floating my-3">
                        <input
                            type="text"
                            className="form-control"
                            id="edit-image-url"
                            defaultValue={guildStore.selectedRSS?.embed_image}
                            placeholder="Embed Image URL"
                            data-name="embed_image"
                            data-type="string"
                        />
                        <label htmlFor="edit-image-url">Embed Image URL*</label>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <input type="hidden" id="edit-role-id" />
                <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                >
                    Close
                </button>
                <button
                    type="button"
                    className="btn btn-primary"
                    disabled={saving}
                    onClick={saveRssFeed}
                >
                    Save changes
                </button>
            </Modal.Footer>
        </Modal>
    )
}
