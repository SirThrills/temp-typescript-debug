import { decodeJwt, JWTPayload } from "jose";
import { create } from "zustand";

// Interface to auth state store
interface AuthState {
    username: string | null;
    authToken: string | null;
    userid: number | null;
    setAuthToken: (token: string) => void;
    isLoggedIn: () => boolean;
    clearAuth: () => void;
}

// Claims set in the token by the backend
interface JWTClaims extends JWTPayload {
    name: string;
    sub: string;
}

// decode claims from the auth token
export function claimsFromAuthToken(token: string) {
    const claims = decodeJwt(token) as JWTClaims;
    return claims;
}

// auth store definition
export const useAuthStore = create<AuthState>()((set, get) => {
    // get a token from localStorage, if there is one available
    const authToken = window.localStorage.getItem("authToken");
    // read the claims out of it, if there was one
    const claims = authToken ? claimsFromAuthToken(authToken) : null;
    const username = claims && claims.name;
    const userid = claims && parseInt(claims.sub);

    return {
        username: username,
        authToken: authToken,
        userid: userid,
        setAuthToken: (token: string) => {
            const claims = claimsFromAuthToken(token);
            window.localStorage.setItem("authToken", token);
            set({
                authToken: token,
                username: claims.name,
                userid: parseInt(claims.sub),
            });
            console.log('token updated')
        },
        isLoggedIn: () => !!get().authToken,
        clearAuth: () => {
            set({ username: null, authToken: null });
            window.localStorage.removeItem("authToken");
        },
    };
});
