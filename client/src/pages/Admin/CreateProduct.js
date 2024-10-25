import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [dname, setDname] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const [photo1, setPhoto1] = useState("");
  const [photo2, setPhoto2] = useState("");
  const [colors, setColors] = useState([{ color: "", link: "" }]);

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Handle color input change
  const handleColorChange = (index, field, value) => {
    const newColors = [...colors];
    newColors[index][field] = value;
    setColors(newColors);
  };

  // Add new color field
  const addColorField = () => {
    setColors([...colors, { color: "", link: "" }]);
  };

  // Remove color field
  const removeColorField = (index) => {
    const newColors = colors.filter((_, i) => i !== index);
    setColors(newColors);
  };

  // Create product function
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("displayname", dname);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("photo", photo);
      productData.append("photo1", photo1);
      productData.append("photo2", photo2);
      productData.append("category", category);
      productData.append("shipping", shipping);
  
      // Append colors as JSON string
      productData.append("colors", JSON.stringify(colors));
  
      const { data } = await axios.post("/api/v1/product/create-product", productData);
      if (data?.success) {
        toast.success("Product Created Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  
  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Create Product</h1>
            <div className="m-1 w-75">
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => setCategory(value)}
              >
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
              <div className="mb-3">
                <input
                  type="text"
                  value={photo}
                  placeholder="Photo URL"
                  className="form-control"
                  onChange={(e) => setPhoto(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={photo1}
                  placeholder="Photo 1 URL"
                  className="form-control"
                  onChange={(e) => setPhoto1(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={photo2}
                  placeholder="Photo 2 URL"
                  className="form-control"
                  onChange={(e) => setPhoto2(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="Name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={dname}
                  placeholder="Display Name"
                  className="form-control"
                  onChange={(e) => setDname(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  value={description}
                  placeholder="Description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="Price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="Quantity"
                  className="form-control"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <Select
                  bordered={false}
                  placeholder="Select Shipping"
                  size="large"
                  className="form-select mb-3"
                  onChange={(value) => setShipping(value)}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>
              <h4>Product Colors</h4>
              {colors.map((colorObj, index) => (
                <div key={index} className="d-flex mb-3">
                  <input
                    type="text"
                    value={colorObj.color}
                    placeholder="Color"
                    className="form-control me-2"
                    onChange={(e) =>
                      handleColorChange(index, "color", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    value={colorObj.link}
                    placeholder="Image Link"
                    className="form-control me-2"
                    onChange={(e) =>
                      handleColorChange(index, "link", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeColorField(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-primary mb-3"
                onClick={addColorField}
              >
                Add Color
              </button>
              <button
                type="submit"
                className="btn btn-success"
                onClick={handleCreate}
              >
                CREATE PRODUCT
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
