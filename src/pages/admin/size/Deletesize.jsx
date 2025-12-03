import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { Baseurl } from "../../../baseurl"
import { showToast } from "../../../store/slice/toast_slice"
import { closesizedelete, getsize } from "../../../store/slice/Sizeslice"
import { Modal } from "react-bootstrap"

const Deletesize = () => {
    const dispatch = useDispatch()
    const getdata = useSelector((state)=>state.size.sizedelete)

    const deletesize = async() =>{
        try{
            const res = await axios.delete(`${Baseurl}/size/deletesize/${getdata._id}`)
            if(res.status){
                dispatch(showToast({message:res.data.message,type:'success'}))
                dispatch(getsize())
                dispatch(closesizedelete())
            }
            else{
                dispatch(showToast({message:res.data.message,type:'error'}))
            }
        }
        catch(error){
            console.log(error);
            dispatch(showToast({message: error?.response?.data?.message || "Something went wrong",type: "error"}));
        }
    }
    return(
        <>
            <Modal show={!!getdata} onHide={()=>dispatch(closesizedelete())}>
                <Modal.Header>
                <Modal.Title>delete Size</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the size: <strong>{getdata?.size}</strong>?
                </Modal.Body>
                <Modal.Footer>
                <button className="rounded-2" onClick={()=>dispatch(closesizedelete())}>
                    Close
                </button>
                <button className="rounded-2" style={{background:'red'}} onClick={deletesize}>
                    delete
                </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Deletesize