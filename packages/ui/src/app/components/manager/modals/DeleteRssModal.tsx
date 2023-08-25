import React from 'react'
import { useGuildStore } from '../../../stores/guild'
import { Modal } from 'react-bootstrap'

export const DeleteRssModal = () => {
    const guildStore = useGuildStore()

    const onHide = () => {
        guildStore.setShowDeleteRss(null, false)
    }

    const handleDelete = async () => {}
    return (
        <Modal show={guildStore.showRssDelete} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>
                    Delete RSS Feed {guildStore.selectedRSS?.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <span>Confirm you would like to delete this feed?</span>
                </div>
                <div>
                    <span>
                        {guildStore.selectedRSS?.name} (
                        {guildStore.selectedRSS?.id})
                    </span>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button
                    type="button"
                    className="btn btn-danger"
                    data-bs-dismiss="modal"
                >
                    Confirm
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                >
                    Close
                </button>
            </Modal.Footer>
        </Modal>
    )
}
