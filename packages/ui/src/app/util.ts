import axios, { AxiosHeaders } from "axios"
import { Headers } from "./types"

export const getParams = () => {
    const querystring = window.location.search
    return new URLSearchParams(querystring)
}

export const isDev = () => {
    return process.env.NODE_ENV === 'local'
}

export const getEnv = () => {
    return process.env.NODE_ENV || 'production'
}

export const axiosPost = async (url: string, options?: { params?: any, axiosHeaders?: Headers }) => {
    const headers = new AxiosHeaders(options?.axiosHeaders)
    return await axios.post(url, options?.params, {
        headers,
    })
}

export const axiosGet = async (url: string, axiosHeaders?: Headers) => {
    const headers = new AxiosHeaders(axiosHeaders)
    return await axios.get(url, {
        headers
    })
}