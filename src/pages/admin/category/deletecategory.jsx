import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { Baseurl } from "../../../baseurl"
import { showToast } from "../../../store/slice/toast_slice"
import { closedelete, getcategory } from "../../../store/slice/category_slice"
import { Modal } from "react-bootstrap"

const Deletecategory = () => {
    const dispatch = useDispatch()
    const categorydata = useSelector((state)=>state.category.categorydelete)

    const deletedata = async() =>{
        if(!categorydata._id){
            dispatch(showToast({ message: "Category ID not found", type: "error" }));
            return
        }

        try{
            const res = await axios.delete(`${Baseurl}/category/deletecategory/${categorydata._id}`)
            if(res.status){
                dispatch(showToast({message:res.data.message,type:'success'}))
                dispatch(getcategory())
                dispatch(closedelete())
            }
            else{
                dispatch(showToast({message:res.data.message,type:'error'}))
            }
        }
        catch(error){
            console.log(error);
            dispatch(showToast({message:error?.response?.data?.message,type:'error'}))
        }
    }

    return(
        <>
             <Modal show={!!categorydata} onHide={()=>dispatch(closedelete())}>
                <Modal.Header>
                <Modal.Title>delete Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the category: <strong>{categorydata?.categoryname}</strong>?
                </Modal.Body>
                <Modal.Footer>
                <button className="rounded-2" onClick={()=>dispatch(closedelete())}>
                    Close
                </button>
                <button className="rounded-2 sidebar-color" style={{background:'red'}} onClick={deletedata}>
                    delete
                </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default Deletecategory