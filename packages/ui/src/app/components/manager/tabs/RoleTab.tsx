import React from "react"
import { useGuildStore } from "../../../stores/guild"

export const RoleTab = () => {
    const guildStore = useGuildStore()
    return (
        <div className="tab-pane fade" id="roles-tab-pane" role="tabpanel" aria-labelledby="roles-tab"
            tabIndex={0}>
            <div className="d-flex flex-row py-2">
                <table className="table table-responsive table-sm">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>{guildStore.roles && guildStore.roles.map((role) => {
                        return (
                            <tr key={role.id}>
                                <td>{role.id}</td>
                                <td>{role.name}</td>
                                <td><i className="fas fa-edit"></i></td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}