import { Children, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

export const ProtectedRoute = ({children}) =>{
    const auth = useSelector((state)=>state.auth.auth)

    const [redirectpath , setredirectpath] = useState('')

    useEffect(()=>{
        if(!auth){
            setredirectpath('/signin')
        }
    },[auth])

    if(redirectpath) return <Navigate to="/signin"></Navigate>

    return(
        <>
            {children}
        </>
    )
}

export const AdminProtectroute = ({children}) =>{
    const {auth,user} = useSelector((state)=>state.auth)
    
    console.log(user);
    
    if (!auth || user?.usertype === "Admin") return <Navigate to="/" replace />;

    return (
        <>
        {children}
        </>
    )
}