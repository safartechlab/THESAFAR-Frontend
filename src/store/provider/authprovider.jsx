import { useEffect } from "react";
import {useDispatch} from "react-redux"
import {initiallogin} from "../slice/authSlice"
import axios from "axios"
import { Baseurl } from "../../baseurl";

const Authprovider = ({ children }) => {
    const dispatch = useDispatch()
    const token = localStorage.getItem("token")

    if(token){
        useEffect(() => {
            const getverify = async () => {
                
                
                try {
                    
                    const config = {
                        headers: {
                            authorization: `${token}`
                        }
                    }
                    const res = await axios.post(`${Baseurl}user/authverify`, {},config)
    
                    if (res.data.status) {
                        
                        dispatch(initiallogin(res.data.data.data))
                        
                    }
                    else {
                        localStorage.removeItem("token")
                    }
                }
                catch (error) {
                    console.log(error)
                }
    
            }
            getverify()
    
    
        }, [dispatch])
    }


    
    return (
        <> 
            {children}
        </>
    )
}

export default Authprovider