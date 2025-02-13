import { Button, Input, message, Modal, Select,Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Edit, Search } from "lucide-react";
import React, { useState } from "react";
import { BiFastForward, BiPlus } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { createArticle } from "../../Redux/Adminslice/Article_Slice";
import { useForm } from "antd/es/form/Form";

function Article_Management() {
  const status=useSelector((state:Rootstate)=>state.articleContent.data||[]);
  const [selectCategory, setSelectCategory] = useState("AllCategory");
  const [CreateArticleModal, setCreateArticleModal] = useState(false);
  const [editArticleModal, setEditArticleModal] = useState(false);
  const [currentArticle,setCurrentArticle]=useState(null);
  const Dispatch=useDispatch();
  const [form]=useForm();

  const handleOpenModal = (article = null) => {
    if (article) {
        setEditArticleModal(true);
        setCurrentArticle(article);
    } else {
        setEditArticleModal(false);
        setCurrentArticle(null);
    }
    setCreateArticleModal(true);
};
  const handleCancelCreateArticleModal = () => {
    setCreateArticleModal(false);
    setCurrentArticle(null);
    setEditArticleModal(false);
  };
const handleEditClick =(article) => {
    handleOpenModal(article);
};
// logic to take courseId from local storage
const handleSubmitArticle = async () => {
  
    try{
      await form.validateFields();
      const courseId=localStorage.getItem("courseId"); 
      const articleData=await form.getFieldsValue();
      if(!courseId){
        message.error("Please select a course");
        return;
      }
      const coverImage=articleData.coverImage?.file;
     if(coverImage){
      const formData=new FormData();
      formData.append("coverImage",coverImage);
     }
      const result= await Dispatch(createArticle({...articleData, courseId,
        coverImage: articleData.coverImage?.file?.name || '',
        dateUploaded: new Date(articleData.dateUploaded).toISOString()}));
        if(createArticle.fulfilled.match(result)){
            setCreateArticleModal(false);
            setCurrentArticle(null);
            message.success("Article created successfully!");
            form.resetFields();
        }
    }
    catch(error){
        const errorMessage=(error as Error).message;
        message.error(`Failed to create article: ${errorMessage}`);
    }
};


  return (
    <>
      <div className="text-2xl text-black m-4  mt-20 bg-white">
        <div className="font-2xl justify-between mt-10 p-2 bg-white flex">
          <h1 className="text-black text-2xl font-semibold">
            Article Management
          </h1>
          <div className="p-1 border rounded text-lg italic">
            {" "}
            Total Articles:
            <span className="text-blue-500 ml-2">150</span>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex" onClick={()=>handleOpenModal()}>
            <BiPlus size={23} /> New Article
          </Button>
        </div>
        <div className="border rounded p-7 my-5 grid grid-cols-3">
          <div className="rounded-md mx-2 px-5 py-2 border">
            <div className="flex justify-between">
              <h3 className="font-semibold my-2">Article Title</h3>
              <h5 className="text-lg"> category</h5>
            </div>
            <p className="my-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              facilisi. Nulla facilisi. Nulla facilisi.
            </p>
            <hr />
            <div className="flex gap-2 my-2 justify-end">
              <button className="hover:ease-in-out text-purple-600  py-1 px-2 text-lg flex cursor-pointer">
                More info <BiFastForward className="mt-2" />{" "}
              </button>
            </div>
          </div>
          <div className="rounded-md mx-2 px-5 py-2 border">
            <div className="flex justify-between">
              <h3 className="font-semibold my-2">Article Title</h3>
              <h5 className="text-lg"> category</h5>
            </div>
            <p className="my-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              facilisi. Nulla facilisi. Nulla facilisi.
            </p>
            <hr />
            <div className="flex gap-2 my-2 justify-end">
              <button className="hover:ease-in-out text-purple-600  py-1 px-2 text-lg flex cursor-pointer">
                More info <BiFastForward className="mt-2" />{" "}
              </button>
            </div>
          </div>
          <div className="rounded-md mx-2 px-5 py-2 border">
            <div className="flex justify-between">
              <h3 className="font-semibold my-2">Article Title</h3>
              <h5 className="text-lg"> category</h5>
            </div>
            <p className="my-3">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla
              facilisi. Nulla facilisi. Nulla facilisi.
            </p>
            <hr />
            <div className="flex gap-2 my-2 justify-end">
              <button className="hover:ease-in-out text-purple-600  py-1 px-2 text-lg flex cursor-pointer">
                More info <BiFastForward className="mt-2" />{" "}
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <div className=" flex w-2/3 border rounded ">
            <Search className="mt-2 ml-2" size={30} />
            <input
              type="text"
              placeholder="Search articles..."
              className="rounded-md w-full ml-2 text-lg "
            />
          </div>
          <select
            className="w-1/3 mr-4 border rounded text-lg"
            value={selectCategory}
            onChange={(e) => setSelectCategory(e.target.value)}
          >
            <option value="AllCategory">All Categories</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
            <option value="category3">Category 3</option>
          </select>
        </div>
        <div className="rounded border p-10 my-2">
          <table className="min-w-full">
            <thead>
              <tr className="border-b-2 text-left text-sm text-gray-600">
                <th>Article Image</th>
                <th> Article Title</th>
                <th> Article Category</th>
                <th> Last Updated</th>
                <th>Actions</th>
              </tr>
              <tr className="border text-left text-sm text-gray-800">
                <td>
                  <img
                    src="/Images/beauty1.jpg"
                    alt="Article Image"
                    width={70}
                    height={50}
                    className="rounded-md m-1"
                  />
                </td>
                <td>Lorem ipsum dolor sit amet</td>
                <td>Category 1</td>
                <td>2022-01-01</td>
                <td>
                  <Button className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800" onClick={handleEditClick}>
                    <Edit />
                  </Button>
                  <Button className="px-2 py-1 text-sm ml-3 text-gray-600 hover:text-gray-800">
                    <FaTrash size={20} color="red" />
                  </Button>
                </td>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      {/* Modal for creating article */}
    <Modal open={CreateArticleModal} onCancel={handleCancelCreateArticleModal} footer={null}
     title={editArticleModal?" Edit Article":"Create new Article"} >
    <div className="rounded  m-2">
      <Form form={form} layout="vertical">
     <Form.Item
     name="title"
     label="Article Title"
     rules={[
       {required: true,message:'Please enter title'}]}
     >
    <Input placeholder="article title" />
    </Form.Item>
    <Form.Item
    name="author"
    label="Author"
    rules={[
       {required: true,message:'Please enter author'}]}
    >
      <Input placeholder="Enter name of Author" />

    </Form.Item>
    <div className="flex gap-3">
   <Form.Item
    name="category"
    label="Category"
    className="w-full"
    rules={[
       {required: true,message:'Please select category'}]}
   >
    <Input placeholder="article category"/>
    </Form.Item>
    <Form.Item
    name="dateUploaded"
    label="Date Uploaded"
    className="w-full"
    rules={[
       {required: true,message:'Please select date uploaded'}]}>
    <Input type="date" />
</Form.Item>
</div>
 
<Form.Item
    name="coverImage"
    label="Cover Image"
    rules={[
       {required: true,message:'Please select cover image'}]}
>
    <Input type="file"/>
    </Form.Item>

<Form.Item
    name="content"
    label="Content"
    rules={[
       {required: true,message:'Please enter content'}]}>
    <TextArea placeholder="Article content"/>
    </Form.Item>
    </Form>
     </div>  
    <div className="flex justify-end">
    <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full font-bold py-2 px-4 rounded flex" 
    type="submit" 
    onClick={handleSubmitArticle} loading={status==="loading"} disabled={status==='loading'}>
    {editArticleModal ? "Update Article" : "Add Article"}
      </Button>
    </div>  
  </Modal>
    </> 
  );

}

export default Article_Management;
