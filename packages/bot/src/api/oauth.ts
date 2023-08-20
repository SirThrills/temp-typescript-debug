import express, { Router } from 'express'
import dotenv from 'dotenv'
import { Client } from 'discord.js'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'
import { addWebSession, deleteWebSessionByDiscordUserId, getWebSessionByDiscordUserId } from '../helpers/database/api'

dotenv.config()

export const oauthRouterMiddleware = (client: Client) => {
    // Assert not null: API only started after bot.ready
    const clientId = client.user!.id
    const apiScopes = process.env.OAUTH_SCOPES || ''
    const apiRedirectUri = process.env.OAUTH_REDIRECT_URL || ''
    const apiSecret = process.env.OAUTH_SECRET || ''

    const oauthRouter = Router()
    oauthRouter.use(express.json())

    oauthRouter.post('/exchange', async (req, res) => {
        if (req.body.code == null || typeof req.body.code !== 'string') {
            return res.sendStatus(400)
        }

        try {
            const params = new URLSearchParams({
                client_id: clientId,
                client_secret: apiSecret,
                code: req.body.code,
                grant_type: 'authorization_code',
                redirect_uri: apiRedirectUri
            })
            const tokenRes = await axios.post('https://discord.com/api/v10/oauth2/token', params,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
            if (tokenRes.status !== 200) {
                return res.sendStatus(400)
            }

            const userInfo = await axios.get('https://discord.com/api/users/@me', {
                headers: {
                    'Authorization': `Bearer ${tokenRes.data.access_token}`
                }
            })



            if (userInfo.status !== 200) {
                return res.sendStatus(400)
            }

            if (await getWebSessionByDiscordUserId(userInfo.data.id)) {
                await deleteWebSessionByDiscordUserId(userInfo.data.id)
            }

            const secret = v4()
            const token = jwt.sign({ user: userInfo.data.id }, secret, {
                expiresIn: 600000
            })
            await addWebSession(tokenRes.data.access_token, token, secret, userInfo.data.id, tokenRes.data.expires_in)

            return res.send({
                access_token: token,
            })
        } catch (err: any) {
            console.log(err)
            if (err.response && err.response.status && typeof err.response.status === 'number') {
                return res.sendStatus(err.response.status)
            }
        }

        return res.sendStatus(500)
    })

    return oauthRouter
}