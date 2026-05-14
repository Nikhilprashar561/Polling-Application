import { PollContextProvider } from "./pollContext"
import { ResponseProvider } from "./responseContext"
import { AuthProvider } from "./userContext"

export const AppProvider = ({children}) => {
    return (
        <AuthProvider>
            <PollContextProvider>
                <ResponseProvider>
                    {children}
                </ResponseProvider>
            </PollContextProvider>
        </AuthProvider>
    )
}
