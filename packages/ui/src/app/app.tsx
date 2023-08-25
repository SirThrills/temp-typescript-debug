import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Main } from './pages/Main'
import {
    Navigate,
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
    useLocation,
    useOutlet,
    useRouteError,
} from 'react-router-dom'
import { useAuthStore } from './stores/auth'
import { AxiosError } from 'axios'
import { Login } from './pages/Login'
import { RootLayout } from './layout'
import { useApiStore } from './stores/api'

const AuthenticatedRoute = () => {
    const loggedIn = useAuthStore((state) => state.isLoggedIn())
    console.log('loggedIn', loggedIn)
    if (!loggedIn)
        return <Navigate to="/login" replace={true} state={useLocation()} />

    return useOutlet()
}

const RootError = () => {
    const error = useRouteError()
    const authStore = useAuthStore()

    if (error instanceof AxiosError) {
        if (error.response == null) {
            return <>{`${error}`}</>
        }
        if (error.response.status === 401) {
            useEffect(() => authStore.clearAuth(), [])
            return <Navigate to="/login" replace={true} state={useLocation()} />
        } else if (error.response.status === 403) {
            return <>Forbidden</>
        }
    }

    return <>{`${error}`}</>
}

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<RootLayout />} errorElement={<RootError />}>
            {/* special unprotected routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/login/" element={<Login />} />

            {/* rest of the authenticated routes */}
            <Route element={<AuthenticatedRoute />}>
                <Route path="/" element={<Main />} />
            </Route>

            {/* and a catch-all route if nothing matched */}
            <Route
                path="*"
                element={<div style={{ color: 'red' }}>Not Found</div>}
            />
        </Route>
    )
)

const App = () => {
    console.log(`API host: ${process.env.API_URL}`)
    return (
        <React.StrictMode>
            <RouterProvider router={router}></RouterProvider>
        </React.StrictMode>
    )
}

const container = document.getElementById('app')
if (container == null) {
    throw new Error('No container found for app to run in')
}
const root = createRoot(container)
root.render(<App />)
