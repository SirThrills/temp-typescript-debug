import React from "react"

export const Loading = () => {
    return (
        <div className="d-flex w-100 flex-column text-white justify-content-center align-items-center"
            id="loading">
            <div className="p-2">
                <i className="fas fa-sync fa-spin fa-4x"></i>
            </div>
            <div className="p-2">
                <span>Fetching guild info</span>
            </div>
        </div>
    )
}