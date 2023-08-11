import express, { Router } from 'express'
import dotenv from 'dotenv'
import { Client } from 'discord.js'
import axios from 'axios'
import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'
import { addWebSession, deleteWebSession, getWebSession } from '../helpers/database/api'

dotenv.config()

export const oauthRouterMiddleware = (client: Client) => {
    // Assert not null: API only started after bot.ready
    const clientId = client.user!.id
    const apiScopes = process.env.API_CLIENT_SCOPES || ''
    const apiRedirectUri = process.env.API_REDIRECT_URI || ''
    const apiSecret = process.env.API_SECRET || ''

    const oauthRouter = Router()


    oauthRouter.use(express.json())

    oauthRouter.get('/url', (_req, res) => {
        res.send({ url: `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${apiRedirectUri}&response_type=code&scope=${apiScopes}` });
    })

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

            if (await getWebSession(tokenRes.data.access_token)) {
                await deleteWebSession(tokenRes.data.access_token)
            }

            const userInfo = await axios.get('https://discord.com/api/users/@me', {
                headers: {
                    'Authorization': `Bearer ${tokenRes.data.access_token}`
                }
            })

            if (userInfo.status !== 200) {
                return res.sendStatus(400)
            }

            const secret = v4()
            const token = jwt.sign({ user: userInfo.data.id }, secret, {
                expiresIn: 600000
            })
            await addWebSession(tokenRes.data.access_token, token, secret, userInfo.data.id, tokenRes.data.expires_in)
            return res.send({
                access_token: token,
            })
        } catch (err) {
            console.log(err)
        }

        return res.sendStatus(500)
    })

    return oauthRouter
}