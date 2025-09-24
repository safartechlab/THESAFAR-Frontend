import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Baseurl } from "../../../baseurl"
import { showToast } from "../../../store/slice/toast_slice"
import { closesubupdate, getsubcate } from "../../../store/slice/Subcategoryslice"
import { Modal, Form } from "react-bootstrap"
import { getcategory } from "../../../store/slice/category_slice"
import { getsize } from "../../../store/slice/Sizeslice"
import { MultiSelect } from "primereact/multiselect"

const Updatesubcategory = () => {
  const dispatch = useDispatch();
  const subcategorydata = useSelector(
    (state) => state.subcategory.subcategoryupdate
  );
  const category = useSelector((state) => state.category.categorylist);
  const size = useSelector((state) => state.size.sizelist);

  const [subcate, setsubcate] = useState({
    id: "",
    subcategory: "",
    categoryID: "",
    sizes: [],
  })

  // fetch category and size lists
  useEffect(() => {
    dispatch(getsize());
    dispatch(getcategory());
  }, [dispatch]);

  // populate data when subcategorydata changes
  useEffect(() => {
    if (subcategorydata) {
      setsubcate({
        id: subcategorydata._id || "",
        subcategory: subcategorydata.subcategory || "",
        categoryID: subcategorydata.categoryID || "",
        sizes:
          subcategorydata.sizes?.map((s) => {
            // match with size list to get correct label
            const matched = size.find((sz) => sz._id === s._id || sz._id === s)
            return {
              label: matched?.sizename || matched?.size || "",
              value: matched?._id || s._id || s,
            }
          }) || [],
      })
    }
  }, [subcategorydata, size])

  // handle text/option changes
  const handlesubcatechange = (e) => {
    const { name, value } = e.target;
    setsubcate({ ...subcate, [name]: value });
  };

  // handle multiselect changes
  const handleSizesChange = (e) => {
    setsubcate({ ...subcate, sizes: e.value })
  }

  // update API call
  const update = async () => {
    try {
      const payload = {
        subcategory: subcate.subcategory,
        category: subcate.category,
        sizes: subcate.sizes, // already IDs
      };

      const res = await axios.put(
        `${Baseurl}subcategory/updatesubcategory/${subcate.id}`,
        payload
      );

      if (res.status) {
        dispatch(showToast({ message: res.data.message, type: "success" }));
        dispatch(getsubcate());
        dispatch(closesubupdate());
      } else {
        dispatch(showToast({ message: res.data.message, type: "error" }));
      }
    } catch (error) {
      console.log(error);
      dispatch(
        showToast({
          message: error?.response?.data?.message || "Update failed",
          type: "error",
        })
      );
    }
  };

  return (
    <>
      <Modal show={!!subcategorydata} onHide={() => dispatch(closesubupdate())}>
        <Modal.Header>
          <Modal.Title>Update Sub Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Subcategory Name */}
            <Form.Group className="mb-3" controlId="subcategory">
              <Form.Label>Sub Category Name</Form.Label>
              <Form.Control
                type="text"
                name="subcategory"
                placeholder="Enter Subcategory Name"
                value={subcate.subcategory}
                onChange={handlesubcatechange}
              />
            </Form.Group>

          {/* Category Dropdown */}
          <Form.Group controlId="category" className="mt-3">
            <Form.Label>Select Category</Form.Label>
            <Form.Select
              name="category"
              value={subcate.category}
              onChange={handlesubcatechange}
            >
              <option value="">-- Select Category --</option>
              {category.map((cate) => (
                <option value={cate._id} key={cate._id}>
                  {cate.categoryname}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

            {/* Sizes MultiSelect */}
            <Form.Group controlId="sizes" className="mt-3">
              <Form.Label>Select Sizes</Form.Label>
              <MultiSelect
                value={subcate.sizes}
                options={size.map((s) => ({
                  label: s.sizename || s.size,
                  value: s._id,
                }))}
                onChange={handleSizesChange}
                placeholder="Select Sizes"
                display="chip"
                className="w-100"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button className="rounded-2" onClick={() => dispatch(closesubupdate())}>
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

export default Updatesubcategory
