import { useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import axios from 'axios';

const AuthCallback = () => {
    const { instance } = useMsal();

    useEffect(() => {
        instance.handleRedirectPromise().then( res => {
            if(res) {
                const accessToken = "Bearer " + res.accessToken
                axios.defaults.headers.common["Authorization"] = accessToken;
                instance.setActiveAccount(res.account)
                localStorage.setItem("accessToken", accessToken)

                // Navigate to the home page
            }
        })
        .catch( err => {
            console.error(err)
        });
    }, [instance])

    return <div>Logging in...</div>
}

export default AuthCallback;