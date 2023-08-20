import React from "react"
import { Me } from "../../types"

type UserMenuProps = {
    me: Me
    clearAuth: () => void
}

export const UserMenu = (props: UserMenuProps) => {
    const { me, clearAuth } = props

    const logout = () => {
        clearAuth()
    }
    return (
        <div className="dropdown border-top" id="user-block">
            <a href="#"
                className="d-flex align-items-center justify-content-center p-3 link-body-emphasis text-decoration-none dropdown-toggle"
                data-bs-toggle="dropdown" aria-expanded="false">
                <img alt="avatar" width="24" height="24" className="rounded-circle" src={me?.avatarURL} />
            </a>
            <ul className="dropdown-menu text-small shadow">
                <li>
                    <a className="dropdown-item" href="#">
                        <span>{me.username}</span>
                    </a>
                </li>
                <hr className="dropdown-divider" />
                <li>
                    <a className="dropdown-item" href="#" onClick={logout}>Sign out</a>
                </li>
            </ul>
        </div >
    )
}