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
  const [imgprev, setImgPrev] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [hassize, setHasSize] = useState(false);
  const dispatch = useDispatch();

  // ✅ Yup validation
  const ProductSchema = Yup.object().shape({
    productName: Yup.string().required("Product name is required"),
    gender: Yup.string()
      .oneOf(["Male", "Female", "Unisex"])
      .required("Gender is required"),
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

  // ✅ Handle image previews
  const handleImg = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () =>
            resolve({ src: reader.result, name: file.name });
          reader.onerror = () => reject("Failed to read file");
          reader.readAsDataURL(file);
        })
    );

    Promise.all(previews).then((images) => {
      setImgPrev(images);
      setSelectedFiles(files);
    });
  };

  // ✅ Submit product
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (key === "sizes") {
          formData.append("sizes", JSON.stringify(value)); // stringify sizes array
        } else if (value !== "" && value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      selectedFiles.forEach((file) => {
        formData.append("images", file); // append images
      });

      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const res = await axios.post(`${Baseurl}product/addproduct`, formData, config);

      if (res.status === 201) {
        dispatch(showToast({ message: res.data.message, type: "success" }));
        resetForm();
        setImgPrev([]);
        setSelectedFiles([]);
        setHasSize(false);
        dispatch(getproduct());
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
    <Formik
      initialValues={initialValues}
      validationSchema={ProductSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, setFieldValue, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <CreateProduct
            values={values}
            errors={errors}
            touched={touched}
            handleChange={handleChange}
            setFieldValue={setFieldValue}
            imgprev={imgprev}
            handleimg={handleImg}
            hassize={hassize}
            sethassize={setHasSize}
          />
        </Form>
      )}
    </Formik>
  );
};

export default Addproduct;
