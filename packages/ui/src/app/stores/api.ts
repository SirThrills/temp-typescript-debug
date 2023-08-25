import { create } from 'zustand'
import { axiosGet, axiosPost } from '../util'
import { Headers } from '../types'

type ApiState = {
    apiUrl: string | null
    apiPost: <T>(
        path: string,
        options?: { params: any; authToken?: string | null }
    ) => Promise<T | undefined>
    apiGet: <T>(
        path: string,
        authToken?: string | null
    ) => Promise<T | undefined>
    setApiUrl: (url: string | null) => void
}

export const useApiStore = create<ApiState>((set) => {
    const apiUrl = process.env.API_URL || null
    return {
        apiUrl,
        apiPost: async <T>(
            path: string,
            options?: { params: any; authToken?: string | null }
        ): Promise<T | undefined> => {
            if (apiUrl == null) {
                throw new Error('No API URL set')
            }

            let headers = {
                ...(options?.authToken && {
                    authorization: `Bearer: ${options.authToken}`,
                }),
            }

            const res = await axiosPost(`${apiUrl}${path}`, {
                params: options?.params,
                axiosHeaders: headers,
            })
            if (res.data == null) {
                return
            }
            return res.data
        },
        apiGet: async <T>(
            path: string,
            authToken?: string | null
        ): Promise<T | undefined> => {
            if (apiUrl == null) {
                throw new Error('No API URL set')
            }

            console.log(`fetching ${path}`)

            let headers = {
                ...(authToken && {
                    authorization: `Bearer: ${authToken}`,
                }),
            }
            try {
                const res = await axiosGet(`${apiUrl}${path}`, headers)
                if (res.data == null) {
                    return
                }
                return res.data
            } catch (err) {
                console.log(err)
            }
        },
        setApiUrl(url: string | null) {
            set({ apiUrl: url })
        },
    }
})
