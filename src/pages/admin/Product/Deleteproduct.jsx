import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { Baseurl } from "../../../baseurl"
import { showToast } from "../../../store/slice/toast_slice"
import { closeprodelete, getproduct } from "../../../store/slice/productSlice"
import { Modal } from "react-bootstrap"

const Deleteproduct = () => {
    const dispatch = useDispatch()
    const productdelete = useSelector((state)=>state.product.productdelete)

    const deleteproduct = async() => {
        if(!productdelete._id){
            dispatch(showToast({ message: "Product ID not found", type: "error" }));
            return
        }
        try{
            const res = await axios.delete(`${Baseurl}/product/deleteproduct/${productdelete._id}`)
            if(res.status){
                dispatch(showToast({message:res.data.message,type:'success'}))
                dispatch(getproduct())
                dispatch(closeprodelete())
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
             <Modal show={!!productdelete} onHide={()=>dispatch(closeprodelete())}>
                            <Modal.Header>
                            <Modal.Title>delete Product</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Are you sure you want to delete the Product: <strong>{productdelete?.productName}</strong>?
                            </Modal.Body>
                            <Modal.Footer>
                            <button className="rounded-2" onClick={()=>dispatch(closeprodelete())}>
                                Close
                            </button>
                            <button className="rounded-2 sidebar-color" style={{background:'red'}} onClick={deleteproduct}>
                                delete
                            </button>
                            </Modal.Footer>
                        </Modal>
        </>
    )
}

export default Deleteproduct