import {Outlet} from 'react-router-dom'
import Header from '../pages/user/Header'
import Footer from '../pages/user/Footer'
const Endlayout = () =>{
    return(
        <>
            <Header/>
            <Outlet/>
            <Footer/>
        </>
    )
}

export default Endlayout