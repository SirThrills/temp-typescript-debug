import React from "react"

export const RSSTab = () => {
    return (
        <div className="tab-pane fade" id="rss-tab-pane" role="tabpanel" aria-labelledby="rss-tab"
            tabIndex={0}>
            <div className="d-flex flex-row py-2">
                <table className="table table-responsive table-sm">
                    <thead>
                        <tr className="text-center">
                            <th>Enabled</th>
                            <th>Name</th>
                            <th>Channel</th>
                            <th>Ping Role</th>
                            <th>Feed URL</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody className="text-center"></tbody>
                </table>
            </div>
        </div>
    )
}