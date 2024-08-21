import { Navigate } from "react-router-dom";
import checkAuthToken from "./checkAuthToken";


const withoutAuthentication = (WrappedComponent) => {

    return (props) => {       
        const token = document.cookie.split(";").find((row) => row.startsWith("token="))
        if (!token) {
            return <WrappedComponent {...props}/>
        }else{
            checkAuthToken();
            return <Navigate to={"/home"} />
        };
    };
};


export default  withoutAuthentication;