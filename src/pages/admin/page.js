import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaOpencart } from "react-icons/fa";
import { LuShoppingBasket } from "react-icons/lu";
import { FaList } from "react-icons/fa"
import { RiEqualizer2Line ,RiCustomSize } from "react-icons/ri";
import { FaImage } from "react-icons/fa";

export const adminpages = [
    {
        name:'Dashboard',
        path:'/Admin',
        icon:MdOutlineSpaceDashboard
    },
    {
        name :"Banner",
        icon : FaImage,
        path :"/admin/Banner"
    },
    {
        name:'Order',
        icon:FaOpencart,
        path:'/admin/Order'
    },
    {
        name:'Add Product',
        icon:LuShoppingBasket,
        path:'/admin/Addproduct'
    },
    {
        name:'List Product',
        icon:FaList,
        path:'/admin/Getproduct'
    },
    {
        name:'Category',
        icon:RiEqualizer2Line,
        path:'/admin/Addcategory'
    },
    {
        name:'Sub Category',
        icon:RiEqualizer2Line,
        path:'/admin/Addsubcategory'
    },
    {
        name:'Size',
        icon:RiCustomSize,
        path:'/admin/Addsize'
    },
]