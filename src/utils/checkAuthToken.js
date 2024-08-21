import axios from "axios";

export let jwtToken = ""

const checkAuthToken = () => {
    const cookies = document.cookie.split(';')
    for (let i=0; i<cookies.length; i++){
        const [name, value] = cookies[i].split("=")
        if(name==="token"){
            axios.defaults.headers.common.Authorization = "Bearer "+value
            jwtToken = value
            break;
        }         
    }
};

export default checkAuthToken