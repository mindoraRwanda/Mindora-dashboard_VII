import { Button, Input, Modal, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Edit, Search } from "lucide-react";
import React, { useState } from "react";
import { BiFastForward, BiPlus } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { createArticle } from "../../Redux/Adminslice/Article_Slice";

function Article_Management() {
  const [selectCategory, setSelectCategory] = useState("AllCategory");
  const [CreateArticleModal, setCreateArticleModal] = useState(false);
  const [editArticleModal, setEditArticleModal] = useState(false);
  const [currentArticle,setCurrentArticle]=useState(null);
  const Dispatch=useDispatch();

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

const handleSubmitArticle = async (article) => {
    const articleData={
        title: article.title,
        category: article.category,
        content: article.content,
        image: article.image,
        id: article.id || Date.now(),
    }
    try{
        const result= await Dispatch(createArticle(articleData));
        if(createArticle.fulfilled.match(result)){
            setCreateArticleModal(false);
            setCurrentArticle(null);
            message.success("Article created successfully!");
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
    <Modal open={CreateArticleModal} onCancel={handleCancelCreateArticleModal} footer={null} title={editArticleModal?" Edit Article":"Create new Article"} >
    <div className="rounded  m-2">
    <div className="my-2">
    <label htmlFor="">Title</label>
    <Input type="text" name="title" placeholder="article title" required/>
    </div>
   <div className="my-2">
    <label htmlFor="">Author</label>
    <Input type="text" name="title" placeholder="article title" required/>
   </div> <div className="my-2">
    <label htmlFor="">Cover Image</label>
    <Input type="file" name="coverImage" required/>
   </div> <div className="my-2">
    <label htmlFor=""> Category</label>
    <Select name="category" className="w-full" required value={""}>
        <Option value="">Select Category</Option>
        <Option value="category1">Category 1</Option>
        <Option value="category2">Category 2</Option>
        <Option value="category3">Category 3</Option>
    </Select> 
   </div> <div className="my-2">
    <label htmlFor=""> Date Uploaded</label>
    <Input type="date" name="dateUploaded" required/>
   </div> <div className="my-2">
    <label htmlFor=""> Content</label>
    <TextArea name="content" placeholder="Article content" required/>
    </div> </div>  
    <div className="flex justify-end">
    <Button className="bg-purple-600 hover:bg-purple-700 text-white w-full font-bold py-2 px-4 rounded flex" type="submit" onClick={handleSubmitArticle}>
    {editArticleModal ? "Update Article" : "Add Article"}
      </Button>
    </div>  
  </Modal>
    </> 
  );

}

export default Article_Management;
