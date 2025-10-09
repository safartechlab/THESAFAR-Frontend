import axios from "axios";
import { Formik, Form } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Baseurl } from "../../../baseurl";
import { showToast } from "../../../store/slice/toast_slice";
import CreateProduct from "./createProduct";
import { getproduct } from "../../../store/slice/productSlice";

const Addproduct = () => {
  const [imgprev, setimgprev] = useState([]);
  const [selectedfile, setselectedfile] = useState([]);
  const [hassize, sethassize] = useState(false);
  const dispatch = useDispatch();

  // ✅ Yup with number transforms
  const ProductSchema = Yup.object().shape({
    productName: Yup.string().required("Product name is required"),
    gender: Yup.string()
      .oneOf(["Male", "Female", "Unisex"])
      .optional("Gender is required"),
    description: Yup.string().required("Description is required"),
    review: Yup.string(),
    category: Yup.string().required("Category is required"),
    subcategory: Yup.string().required("Subcategory is required"),
    sizes: Yup.array().of(
      Yup.object().shape({
        size: Yup.string().required("Size is required"),
        price: Yup.number()
          .transform((_, orig) => (orig === "" ? undefined : Number(orig)))
          .min(0, "Price must be >= 0")
          .required("Price is required"),
        stock: Yup.number()
          .transform((_, orig) => (orig === "" ? undefined : Number(orig)))
          .min(0, "Stock cannot be negative")
          .required("Stock is required"),
      })
    ),
    price: Yup.number()
      .transform((_, orig) => (orig === "" ? undefined : Number(orig)))
      .when("sizes", {
        is: (sizes) => !sizes || sizes.length === 0,
        then: (schema) => schema.min(0).required("Price is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    stock: Yup.number()
      .transform((_, orig) => (orig === "" ? undefined : Number(orig)))
      .when("sizes", {
        is: (sizes) => !sizes || sizes.length === 0,
        then: (schema) => schema.min(0).required("Stock is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    discount: Yup.number()
      .transform((_, orig) => (orig === "" ? 0 : Number(orig)))
      .min(0, "Discount cannot be negative")
      .default(0),
    discountType: Yup.string().oneOf(["Percentage", "Flat"]).nullable(),
  });

  const initialValues = {
    productName: "",
    gender: "",
    description: "",
    review: "",
    category: "",
    subcategory: "",
    sizes: [],
    price: "",
    stock: "",
    discount: 0,
    discountType: "",
  };

  const handleimg = (e) => {
    const files = Array.from(e.target.files);

    const previews = files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve({ src: reader.result, name: file.name });
          reader.onerror = () => reject("Failed to read file");
          reader.readAsDataURL(file);
        })
    );

    Promise.all(previews).then((images) => {
      setimgprev(images);
      setselectedfile(files);
    });
  };

 const handlesumit = async (values, { resetForm }) => {
  try {
    console.log("Submitting values:", values);

    const allFromData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (key === "sizes") {
        allFromData.append("sizes", JSON.stringify(value)); // ✅ stringify sizes
      } else if (value !== "" && value !== null && value !== undefined) {
        allFromData.append(key, value);
      }
    });

    selectedfile.forEach((file) => {
      allFromData.append("images", file);
    });

    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const res = await axios.post(`${Baseurl}product/addproduct`, allFromData, config);

    if (res.status) {
      dispatch(showToast({ message: res.data.message, type: "success" }));
      resetForm();
      setimgprev([]);
      dispatch(getproduct())
      setselectedfile([]);
    } else {
      dispatch(showToast({ message: res.data.message, type: "error" }));
    }
  } catch (error) {
    console.log(error);
    dispatch(
      showToast({
        message: error?.response?.data?.message || "Something went wrong",
        type: "error",
      })
    );
  }
};

  return (
    <Formik initialValues={initialValues} validationSchema={ProductSchema} onSubmit={handlesumit}>
      {({ values, errors, touched, handleChange, handleSubmit, setFieldValue }) => (
        <Form onSubmit={handleSubmit}>
          <CreateProduct
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            setFieldValue={setFieldValue}
            imgprev={imgprev}
            handleimg={handleimg}
            hassize={hassize}
            sethassize={sethassize}
          />
        </Form>
      )}
    </Formik>
  );
};

export default Addproduct;