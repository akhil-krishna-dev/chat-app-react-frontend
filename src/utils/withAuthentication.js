import { Navigate } from "react-router-dom";
import checkAuthToken from "./checkAuthToken";


const withAuthentication = (WrappedComponent) => {

    return (props) => {       
        const token = document.cookie.split(";").find((row) => row.startsWith("token="))
        if (token) {
            checkAuthToken();
            return <WrappedComponent {...props}/>
        }else{
            return <Navigate to={"/login"} />
        };
    };
};


export default  withAuthentication;