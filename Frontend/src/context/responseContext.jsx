import { createContext, useContext, useState } from "react";

const responseContext = createContext();

export const ResponseProvider = ({children}) => {

    const [resposne, setResponse] = useState([])

    const pollResponse = () => {}

    return (
        <responseContext.Provider value={{pollResponse}}>
            {children}
        </responseContext.Provider>
    )
}

export const useResponseContext = () => {
    return useContext(responseContext)
}
