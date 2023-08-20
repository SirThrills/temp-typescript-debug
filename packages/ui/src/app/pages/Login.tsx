import React, { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/auth";
import { getParams } from "../util";
import { useApiStore } from "../stores/api";

type TokenResponse = {
    access_token: string
}

export const Login = () => {
    const { apiPost } = useApiStore()

    const authStore = useAuthStore()
    const clientId = process.env.OAUTH_CLIENT_ID
    const clientScopes = process.env.OAUTH_SCOPES
    const clientRedirectUri = process.env.OAUTH_REDIRECT_URL

    const navigate = useNavigate();

    useEffect(() => {
        if (authStore.authToken != null) {
            navigate("/", { replace: true })
        }
    }, [authStore.authToken])

    useEffect(() => {
        let abort = false

        const login = async () => {
            if (abort) {
                return
            }

            console.log('loggedIn?', authStore.isLoggedIn())

            if (authStore.isLoggedIn()) return navigate('/', { replace: true })

            const params = getParams()
            const code = params.get('code')
            if (code) {
                const exchange = await apiPost<TokenResponse>('/oauth/exchange', { params: { code } })
                if (exchange == null) {
                    throw new Error('Received no data from server token exchange')
                }
                if (exchange.access_token == null || typeof exchange.access_token !== 'string') {
                    throw new Error('Invalid access token type received')
                }

                useAuthStore.getState().setAuthToken(exchange.access_token)
                return
            }

            if (clientId == null || clientScopes == null || clientRedirectUri == null) {
                throw new Error('Invalid oauth url config')
            }

            // const url = new URL('https://discord.com/api/oauth2/authorize')
            // url.searchParams.append('client_id', clientId)
            // url.searchParams.append('redirect_uri', clientRedirectUri)
            // url.searchParams.append('response_type', 'code')
            // url.searchParams.append('scope', clientScopes)

            const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${clientRedirectUri}&response_type=code&scope=${clientScopes}`

            console.log(url)
            window.location.href = url.toString()
        }

        login()

        return () => {
            abort = true
        }
    }, [])

    return (
        <p>Redirecting to sign on page...</p>
    )
}