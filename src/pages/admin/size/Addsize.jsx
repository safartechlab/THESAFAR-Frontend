import axios from 'axios'
import * as Yup from 'yup'
import { Baseurl } from '../../../baseurl'
import { useDispatch, useSelector } from 'react-redux'
import { showToast } from '../../../store/slice/toast_slice'
import { getsize } from '../../../store/slice/Sizeslice'
import { Container, Row ,Col , Form as BootstrapForm} from 'react-bootstrap'
import { RiCustomSize } from "react-icons/ri";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Getsize from './getsize'


const Addsize = () =>{
    const dispatch = useDispatch()
    const validationSchema = Yup.object({
        size : Yup.string().required("size name is require"),
    })
    const initialValues = {
        size:""
    }

    const handleSubmit = async(values,{resetForm}) =>{
        try{
            const res = await axios.post(`${Baseurl}size/addsize`,values)
            if(res.status){
                dispatch(showToast({message:res.data.message,type:'success'}))
                dispatch(getsize())
                resetForm()
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
            <Row className='mx-0'>
                <Container className='px-4 py-3'>
                    <Row className="align-items-center font-color mb-4">
                        <Col xs={2} md={1}>
                            <RiCustomSize className="fs-1" />
                        </Col>
                        <Col xs={10} md={11}>
                            <h2 className="mb-0">Size</h2>
                        </Col>
                    </Row>

                    <Container className="py-4 rounded shadow-sm sidebar-color">
                    <h3 className="mb-4">Add Size</h3>
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} >
                {({}) => (
                    <Form>
            <Row className="g-3 justify-content-center align-items-center mb-5">
            {/* Size name */}
            <Col xs={12} sm={8} md={8}>
                <Field type="text" id='size' className='w-100 p-2 rounded-2 header-color'  name="size"placeholder="Enter size name"  />
                <ErrorMessage name="size"component="div"style={{ color: "red" }}/>
            </Col>
            
            <Col xs={12} sm={4} md={3}>
              <button type='submit' className="admin-btn-color rounded-2 w-100 p-2 fw-semibold">
                Add Size
              </button>
            </Col>
            </Row>
          </Form>
        )}
      </Formik>

        <Row className="mt-4">
            <Col>
              <div className="border rounded p-3  overflow-auto">
                <Getsize/>
              </div>
            </Col>
          </Row>

    </Container>

                </Container>
            </Row>
        </>
    )
}
export default Addsize