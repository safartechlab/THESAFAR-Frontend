import axios from "axios";
import { useDispatch, useSelector } from "react-redux"
import * as Yup from 'yup'
import { Baseurl } from "../../../baseurl";
import { showToast } from "../../../store/slice/toast_slice";
import { getsubcate } from "../../../store/slice/Subcategoryslice";
import { Container, Row ,Col, Form as BootstrapForm} from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TbCategory } from "react-icons/tb";
import { useEffect } from "react";
import { getcategory } from "../../../store/slice/category_slice";
import Getsubcategory from "./getsubcategory";
import { getsize } from "../../../store/slice/Sizeslice";
import {MultiSelect} from "primereact/multiselect"


const Addsubcategory = () => {
    const dispatch = useDispatch()
    const category = useSelector((state)=>state.category.categorylist)
    const size = useSelector((state)=>state.size.sizelist)

    useEffect(()=>{
        dispatch(getsize())
    },[dispatch])

    useEffect(()=>{
        dispatch(getcategory())
    },[dispatch])
    
  const validationSchema = Yup.object({
  subcategory: Yup.string().required("Subcategory name is required"),
  category: Yup.string().required("Category is required"),
  sizes: Yup.array()
    .of(Yup.string().optional("Size is required"))
});


const initialValues = {
  subcategory: "",
  category: "",
  sizes: [], // start with one empty size input
};


    const handleSubmit = async(values,{resetForm}) => {
        try{
            const res = await axios.post(`${Baseurl}subcategory/addsubcategory`,values)
            if(res.status){
                dispatch(showToast({message:res.data.message,type:'success'}))
                dispatch(getsubcate())
                resetForm()
            }
            else{
                dispatch(showToast({message:res.data.message,type:'success'}))
            }
        }
        catch(error){
            console.log(error);            
            dispatch(showToast({message: error?.response?.data?.message || "Something went wrong",type: "error"}));
        }
    }

    return (
        <>
            <Row className="mx-0">
                <Container className="px-4 py-3">
                    <Row className="align-items-center font-color mb-4">
                        <Col xs={2} md={1}>
                            <TbCategory className="fs-1" />
                        </Col>
                        <Col xs={10} md={11}>
                            <h2 className="mb-0">Sub Category</h2>
                        </Col>
                    </Row>

                    <Container className="py-4 rounded shadow-sm sidebar-color">
                    <h3 className="mb-4">Add Sub Category</h3>
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} >
                {({values, setFieldValue}) => (
                    <Form>
            {/* Category name */}
            <Col>
                <Field type="text" id='subcategory' className='w-100 p-2 rounded-2 header-color'  name="subcategory"placeholder="Enter Sub category name"  />
                <ErrorMessage name="categoryname"component="div"style={{ color: "red" }}/>
            </Col>
            
            <Row className="align-items-center mt-2">
            <Col>
                <Field name='category' id='category' as={BootstrapForm.Select} className="form-select w-100 p-2">
                        <option value="">Select Category</option>
                        {category.map((cate)=>(
                            <option key={cate._id} value={cate._id}>{cate.categoryname}</option>
                        ))}
                </Field>
            </Col>
            <Col className="">
          <MultiSelect
            id="sizes"
            value={values.sizes}
            options={size.map(s => ({ label: s.size, value: s._id }))}
            onChange={(e) => setFieldValue("sizes", e.value)}
            placeholder="Select Sizes"
            display="chip"
            className="w-100"
          />
          <ErrorMessage
            name="sizes"
            component="div"
            style={{ color: "red" }}
          />
        </Col>
            </Row>
            <Row className="mt-2">
                <Col className="d-flex justify-content-center">
                    <button type="submit" className="btn rounded-2 admin-btn-color p-1 w-50">Add SubCategory</button>
                </Col>
            </Row>
          </Form>
        )}
      </Formik>

        <Row className="mt-4">
            <Col>
              <div className="border rounded p-3 overflow-auto">
                <Getsubcategory />
              </div>
            </Col>
          </Row>

    </Container>
                </Container>
            </Row>
        </>
    )
}   

export default Addsubcategory