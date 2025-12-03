import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Baseurl } from "../../../baseurl"
import { showToast } from "../../../store/slice/toast_slice"
import { closesizeupdate, getsize } from "../../../store/slice/Sizeslice"
import { Modal,Form } from "react-bootstrap"

const Updatesize = () =>{
    const dispatch = useDispatch()
    const getupsize = useSelector((state)=>state.size.sizeupdate)
    const [updatedata,setupdatedata] = useState({
        id:getupsize?._id||"",
        size:getupsize?.size||""
    })
    // console.log(getupsize);
    
    useEffect(()=>{
        if(getupsize){
            setupdatedata({
                id:getupsize._id||"",
                size:getupsize.size||""
            })
        }
    },[getupsize])

    const handlechange = (e) =>{
        const {name,value} = e.target
        setupdatedata({...updatedata,[name]:value}) 
    }

    const update = async() => {
        try{
            const res = await axios.put(`${Baseurl}/size/updatesize/${getupsize._id}`,{size:updatedata.size})
            if(res.status){
                dispatch(showToast({message:res.data.message,type:'success'}))
                dispatch(getsize())
                dispatch(closesizeupdate())
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
            <Modal show={!!getupsize} onHide={()=>dispatch(closesizeupdate())} >
        <Modal.Header closeButton>
          <Modal.Title>Update Size</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group controlId="size">
                        <Form.Control type="text" name="size" value={updatedata.size} onChange={handlechange}/>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <button className="rounded-2" onClick={()=>dispatch(closesizeupdate())}>
                    Close
                </button>
                <button className="rounded-2 sidebar-color text-light" onClick={update}>
                    update
                </button>
        </Modal.Footer>
      </Modal>
        </>
    )
}

export default Updatesize