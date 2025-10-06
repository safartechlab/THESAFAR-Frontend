import { useState } from "react";
import {Row,Container ,Col} from 'react-bootstrap'
import axios from "axios";
import { Baseurl } from "../../../baseurl";
import { useDispatch } from "react-redux";
import { showToast } from "../../../store/slice/toast_slice";
import { TbCategory } from "react-icons/tb";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getcategory, setcategory } from "../../../store/slice/category_slice";
import Getcategory from "./getcategory";

const Addcategory = () => {
  const [imgprev, setImgprev] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const dispatch = useDispatch();

  // ✅ Validation schema
  const validationSchema = Yup.object({
    categoryname: Yup.string().required("Category name is required"),
  });
  // ✅ File input handler
  const handleImg = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImgprev({ src: reader.result, name: file.name });
      setSelectedFile(file);
    };
    reader.readAsDataURL(file);
    console.log(setcategory());
    
    // store file in formik as well (not required, but good practice)
    setFieldValue("categoryimage", file);
  };

  // ✅ Form submission
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formdata = new FormData();
      formdata.append("categoryname", values.categoryname);
      if (selectedFile) {
        formdata.append("categoryimage", selectedFile);
      }
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      const res = await axios.post(`${Baseurl}category/addcategory`,formdata,config);
      if (res.status) {
        dispatch(showToast({ message: res.data.message, type: "success" }));
        dispatch(setcategory())
        dispatch(getcategory())
        resetForm();
        setImgprev(null);
        setSelectedFile(null);
      } else {
        dispatch(showToast({ message: res.data.message, type: "error" }));
      }
    } catch (error) {
      dispatch(
        showToast({
          message: error?.response?.data?.message || "Something went wrong",
          type: "error",
        })
      );
    }
  };

  return (
    <>

        
      <Row className="mx-0">
        <Container className="px-4 py-3 ">

        <Row className="align-items-center font-color mb-4">
          <Col xs={2} md={1}>
            <TbCategory className="fs-1" />
          </Col>
          <Col xs={10} md={11}>
            <h2 className="mb-0">Category</h2>
          </Col>
        </Row>
    <Container className="py-4 rounded shadow-sm sidebar-color">
      <h3 className="mb-4">Add Category</h3>
      <Formik initialValues={{ categoryname: "", categoryimage: null }} validationSchema={validationSchema} onSubmit={handleSubmit} >
        {({ setFieldValue }) => (
            <Form>
            <Row className="align-items-center">
            {/* Category name */}
            <Col>
                <Field type="text" id='categoryname' className='w-100 p-2 rounded-2 header-color'  name="categoryname"placeholder="Enter category name"  />
                <ErrorMessage name="categoryname"component="div"style={{ color: "red" }}/>
            </Col>
            {/* Image Upload */}
            <Col>
              <Field name="categoryimage">
  {({ form }) => (
    <input type="file" id="categoryimage" name="categoryimage" accept="image/*" onChange={(e) => handleImg(e, form.setFieldValue)} className="header_color font-color p-2 w-100 rounded-2"/>
  )}
        </Field>

            <ErrorMessage name="categoryimage" component="div" style={{ color: "red" }}/>


            </Col>
        </Row>
              {imgprev && (
                  <div className="mb-1 d-flex flex-column align-items-center">
                  <img src={imgprev.src} alt="preview" style={{ width: "300px", marginTop: "10px" }}/>
                  <p className="mt-1">{imgprev.name}</p>
                </div>
              )}
            <Row className="mt-2">
                <Col className="d-flex justify-content-center">
                    <button type="submit" className="btn rounded-2 admin-btn-color p-1 w-50">Add Category</button>
                </Col>
            </Row>
          </Form>
        )}
      </Formik>

        <Row className="mt-4">
            <Col>
              <div className="border rounded p-3 overflow-auto">
                <Getcategory />
              </div>
            </Col>
          </Row>

    </Container>
        </Container>
    </Row>
    </>
    
  );
};

export default Addcategory;
