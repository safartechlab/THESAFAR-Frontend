import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Baseurl } from "../../../baseurl"
import {showToast} from '../../../store/slice/toast_slice'
import { closeupdate, getcategory } from "../../../store/slice/category_slice"
import { Modal, Form } from "react-bootstrap";

const Updatecategory = () =>{
    const dispatch = useDispatch()
    const categorydata = useSelector((state)=>state.category.categoryupdate)
    const [category , setcategory] = useState({
        id:categorydata?._id|| "",
        categoryname:categorydata?.categoryname||""
    })
    const [categoryimage,setcategoryimage] = useState(null)

    useEffect(()=>{
        if(categorydata){
            setcategory({
                id:categorydata._id||"",
                categoryname:categorydata.categoryname||""
            })
            setcategoryimage(null)
        }
    },[categorydata])
    
    const handlecategory = (e) =>{
        const {name,value} = e.target
        setcategory({...category,[name]:value})
    }

    const handleImg =(e)=>{
        setcategoryimage(e.target.files[0])
    }

    const update = async() =>{
        try{
            const formData = new FormData()
            formData.append("categoryname",category.categoryname)
            if (categoryimage){
                formData.append("categoryimage",categoryimage)
            }
            const config = {
                headers: { "Content-Type": "multipart/form-data" },
            }
            const res = await axios.put(`${Baseurl}category/updatecategory/${category.id}`,formData,config)
            dispatch(showToast({message:res.data.message,type:'success'}))
            dispatch(getcategory())
            dispatch(closeupdate())
        }
        catch(error){
            console.log(error);
            dispatch(showToast({message:error?.response?.data?.message,type:'error'}))
            
        }
    }
    

    return (
        <>
        <Modal show={!!categorydata} onHide={() => dispatch(closeupdate())}>
      <Modal.Header closeButton>
        <Modal.Title>Update Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Category Name */}
          <Form.Group className="mb-3" controlId="categoryname">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              name="categoryname"
              value={category.categoryname}
              onChange={handlecategory}
            />
          </Form.Group>

          {/* Category Image */}
          <Form.Group className="mb-3" controlId="categoryimage">
            <Form.Label>Category Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImg}
            />

            {/* Show Current Image from DB */}
            {categorydata?.categoryimage?.filepath && (
  <div style={{ marginTop: "10px" }}>
    <p className="mb-1 fw-bold">Current Image:</p>
    <img
      src={categorydata.categoryimage.filepath}
      alt="Current Category"
      style={{ width: "120px", borderRadius: "8px", objectFit: "cover" }}
    />
  </div>
)}

            {/* Show New Image Preview */}
            {categoryimage && (
              <div style={{ marginTop: "10px" }}>
                <p className="mb-1 fw-bold">Preview New Image:</p>
                <img
                  src={URL.createObjectURL(categoryimage)} 
                  alt="Preview"
                  style={{ width: "120px", borderRadius: "8px" }}
                />
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button className="rounded-2" onClick={() => dispatch(closeupdate())}>
          Close
        </button>
        <button
          className="rounded-2 sidebar-color text-light"
          onClick={update}
        >
          Update
        </button>
      </Modal.Footer>
    </Modal>
        </>
    )
}

export default Updatecategory