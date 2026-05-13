const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY
const USER_KEY = import.meta.env.VITE_USER_KEY


export const tokenStore = {
    getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
    getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
    getUser: () => {
        const rawData = localStorage.getItem(USER_KEY)
        return rawData ? JSON.parse(rawData) : null
    },

    set: ({accessToken, refreshToken, userData}) => {
        if(accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        if(refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        if(userData) localStorage.setItem(USER_KEY, JSON.stringify(userData))
    },

    clear: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY),
        localStorage.removeItem(REFRESH_TOKEN_KEY),
        localStorage.removeItem(USER_KEY)
    }
}
