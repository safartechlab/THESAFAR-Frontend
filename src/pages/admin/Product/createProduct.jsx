import axios from "axios";
import { Formik, Form } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Baseurl } from "../../../baseurl";
import { showToast } from "../../../store/slice/toast_slice";
import CreateProduct from "./createProduct";

const validationSchema = Yup.object().shape({
  productName: Yup.string().required("Product name is required"),
  description: Yup.string().required("Description is required"),
  category: Yup.string().required("Category is required"),
  subcategory: Yup.string().required("Subcategory is required"),
  gender: Yup.string().required("Gender is required"),
  discount: Yup.number().min(0).max(100).nullable(),
  discountType: Yup.string().nullable(),
});

const AddProduct = () => {
  const dispatch = useDispatch();
  const [hassize, sethassize] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imgprev, setImgPrev] = useState([]);

  // ✅ Handle multiple image preview
  const handleimg = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    const previews = files.map((file) => ({
      src: URL.createObjectURL(file),
      name: file.name,
    }));
    setImgPrev(previews);
  };

  // ✅ Submit handler
  const handleSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();

      formData.append("productName", values.productName);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("subcategory", values.subcategory);
      formData.append("discount", values.discount || 0);
      formData.append("discountType", values.discountType || "");
      formData.append("gender", values.gender);

      if (hassize) {
        formData.append("sizes", JSON.stringify(values.sizes || []));
      } else {
        formData.append("price", values.price);
        formData.append("stock", values.stock);
      }

      // ✅ Append all selected images
      selectedImages.forEach((file) => {
        formData.append("images", file);
      });

      await axios.post(`${Baseurl}/product/addproduct`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      dispatch(showToast({ message: "Product added successfully!", type: "success" }));
      resetForm();
      setSelectedImages([]);
      setImgPrev([]);
    } catch (err) {
      console.error("❌ Upload error:", err);
      dispatch(
        showToast({
          message: err.response?.data?.message || "Failed to add product",
          type: "error",
        })
      );
    }
  };

  return (
    <Formik
      initialValues={{
        productName: "",
        description: "",
        category: "",
        subcategory: "",
        price: "",
        stock: "",
        discount: "",
        discountType: "",
        gender: "",
        sizes: [],
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, setFieldValue }) => (
        <Form>
          <CreateProduct
            values={values}
            errors={errors}
            touched={touched}
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

export default AddProduct;
