import axios from "axios";
import { Formik, Form ,Field , FieldArray , ErrorMessage } from "formik"
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from 'yup'
import { Baseurl } from "../../../baseurl";
import { showToast } from "../../../store/slice/toast_slice";

const Addproduct = () =>{

    const [imgprev , setimgprev] = useState([])
    const [selectedfile,setselectedfile] = useState([])
    const [hassize,sethassize] = useState(false)
    const dispatch = useDispatch()

    const ProductSchema = Yup.object().shape({
    productName: Yup.string().required("Product name is required"),
    gender: Yup.string()
      .oneOf(["Male", "Female", "Unisex"])
      .required("Gender is required"),
    description: Yup.string().required("Description is required"),
    review: Yup.string(),
    category: Yup.string().required("Category is required"),
    subcategory: Yup.string().required("Subcategory is required"),

    // if no sizes, then require price & stock at root level
    sizes: Yup.array().of(
      Yup.object().shape({
        size: Yup.string().required("Size is required"),
        price: Yup.number()
          .min(0, "Price must be >= 0")
          .required("Price is required"),
        stock: Yup.number()
          .min(0, "Stock cannot be negative")
          .required("Stock is required"),
      })
    ),

    price: Yup.number().when("sizes", {
      is: (sizes) => !sizes || sizes.length === 0,
      then: (schema) =>
        schema.min(0, "Price must be >= 0").required("Price is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    stock: Yup.number().when("sizes", {
      is: (sizes) => !sizes || sizes.length === 0,
      then: (schema) =>
        schema.min(0, "Stock cannot be negative").required("Stock is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    discount: Yup.number().min(0, "Discount cannot be negative").default(0),
    discountType: Yup.string().oneOf(["Percentage", "Flat"]).nullable(),
  });

    const handleimg = (e) => {
  const files = e.target.files;
  const fileArray = Array.from(files);

  const imagepreview = fileArray.map(file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ src: reader.result, name: file.name });
      };
      reader.onerror = () => reject("Failed to read file");
      reader.readAsDataURL(file);
    });
  });

  Promise.all(imagepreview).then(images => {
    setimgprev(images);
    setselectedfile(fileArray);
  });
};


    const handlesumit = async(values, { resetForm }) =>{
        try{
            const allFromData = new FormData()
            allFromData.append("folder","productImg")
            Object.entries(values).forEach(([key, value]) => {
            if (key === "sizes") {
              allFromData.append(key, JSON.stringify(value)); // send as JSON
            } else {
              allFromData.append(key, value);
            }
          });

          selectedfile.forEach((file)=>{
            allFromData.append('images',file)
          })

          const config = {
            headers:{"Content-Type":"multipart/form-data"}
          }
        
          const res = await axios.post(`${Baseurl}product/addproduct`,allFromData,config)

          if(res.status){
            dispatch(showToast({message:res.data.message,type:'success'}))
            resetForm()
            setimgprev([])
            setselectedfile([])
          }
          else{
            dispatch(showToast({message:res.data.message,type:'error'}))
          }

         }
        catch(error){
            console.log(error);
            dispatch(
        showToast({
          message: error?.response?.data?.message || "Something went wrong",
          type: "error",
        })
      )
        }
    }
    return(
        <>
        </>
    )
}

export default Addproduct