import { useDispatch, useSelector } from "react-redux"
import { showToast } from "../../../store/slice/toast_slice"
import axios from "axios"
import { Baseurl } from "../../../baseurl"
import { closesubdelete, getsubcate } from "../../../store/slice/Subcategoryslice"
import { Modal } from "react-bootstrap"

const Deletesubcategory = () =>{
    const dispatch = useDispatch()
    const subcatedata = useSelector((state)=>state.subcategory.subcategorydelete)

    const deletedata = async() => {
        if(!subcatedata._id){
            dispatch(showToast({ message: "Sub Category ID not found", type: "error" }))
        }
        try{
            const res = await axios.delete(`${Baseurl}/subcategory/deletesubcategory/${subcatedata._id}`)
            if(res.status){
                dispatch(showToast({message:res.data.message,type:'success'}))
                dispatch(getsubcate())
                dispatch(closesubdelete())
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
        <Modal show={!!subcatedata} onHide={()=>dispatch(closesubdelete())}>
                <Modal.Header>
                <Modal.Title>delete Sub Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the Sub category: <strong>{subcatedata?.subcategory}</strong>?
                </Modal.Body>
                <Modal.Footer>
                <button className="rounded-2" onClick={()=>dispatch(closesubdelete())}>
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
export default Deletesubcategory