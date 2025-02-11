import { MdDelete, MdEdit } from "react-icons/md";
import { BiPlus } from "react-icons/bi";
import { BiTrash, BiEdit } from "react-icons/bi";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { FaEllipsisV } from "react-icons/fa";
import { useState, useEffect } from "react";
import TextArea from "antd/es/input/TextArea";
import { Button, Input, Modal, Checkbox, Form, message, Spin } from "antd";
import FormItem from "antd/es/form/FormItem";
import { useDispatch, useSelector } from "react-redux";
import {
  createCommunity,
  deleteCommunity,
  getAllcommunity,
  UpdateCommunity,
} from "../../Redux/Adminslice/CommunitySlice";
import { RootState } from "../../Redux/store";
import CommunityDetails from "./CommunityDetails";
import { deletePots, getAllCommunityPost, UpdatePost } from "../../Redux/Adminslice/CommunityPost";

export default function Communication() {
  const communities = useSelector(
    (state: RootState) => state.Community.communities
  );
  const status = useSelector((state: RootState) => state.Community.status);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [Posts, setPosts] = useState([]);
  const [AllPost, setAllPost] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdatePostModal, setShowUpdatePostModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCommDetails, setShowCommDetails] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [isloading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [UserId, setUserId] = useState("");
  const [selectedCommunityId, setSelectedCommunityId] = useState([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const dispatch = useDispatch();

  // This is for getting User id stored on Local storage
  useEffect(() => {
    const storedUserId = localStorage.getItem("UserId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // fetch all communities on component mount
  useEffect(() => {
    dispatch(getAllcommunity());
  }, [dispatch]);

// To get all Post which are in system
const getAppPost=async()=>{
  try {
    setLoading(true);
    const result = await dispatch(getAllCommunityPost());
    if (result && result.payload) {
      setAllPost(result.payload);
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    message.error(`Failed to load users: ${errorMessage}`);
  } finally {
    setLoading(false);
  }
};
useEffect(() =>{
  getAppPost();
},[dispatch]);

// To delete Post
const handleDeletePost=async(id) =>{
  if (!window.confirm('Are you sure you want to delete this post?')) {
    return;
  };
  try{
    setLoading(true);
    const result=await dispatch(deletePots(id));
    if(deletePots.fulfilled.match(result)){
      message.success("Post deleted successfully!");
      getAppPost();
    };
  }
  catch(error){
    message.error(`Error deleting post: ${error.message}`);
  }
}

// function to create a new community Groupe
  const handleSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append("moderatorId", UserId);
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("isPrivate", values.isPrivate || false);
    if (selectedFile) {
      formData.append("profile", selectedFile);
    }
    setLoading(true);
    try {
      const result = await dispatch(createCommunity(formData));
      if (createCommunity.fulfilled.match(result)) {
        message.success("Community created successfully!");
        setShowModal(false);
        form.resetFields();
        setSelectedFile(null);
        dispatch(getAllcommunity());
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to create community: ${errorMessage}`);
      console.log(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // To delete community
  const handleDeleteCommunity = async (id: number | string) => {
    if (!window.confirm("Are you sure you want to delete this community?")) {
      return;
    }
    setLoading(true);
    try {
      const result = await dispatch(deleteCommunity(id));
      if (deleteCommunity.fulfilled.match(result)) {
        message.success("Community deleted successfully!");
        dispatch(getAllcommunity());
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to delete community: ${errorMessage}`);
      console.log(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  // Modal show Community Details
  const VisibleDetailsModal = (id) => {
    setShowCommDetails(true);
    setSelectedCommunityId(id);
    setSelectedCommunity(communities.find((c) => c.id === id));
  };
  const hideDetailsModal = () => {
    setShowCommDetails(false);
    setSelectedCommunityId(null);
  };
  // for creating new community
  const handleModal = () => {
    setShowModal(true);
  };
  const cancelModal = () => {
    setShowModal(false);
  };
  // Modal update community
  const ShowUpdateModal = (community: Community) => {
    setSelectedCommunity(community);
    setUpdateModal(true);
    form.setFieldsValue({
      name: community.name,
      description: community.description,
      isPrivate: community.isPrivate,
    });
  };
  // update Community information
  const handleUpdateCommunity = async (values: any) => {
    if (!selectedCommunity?.id) return;

    console.log(selectedCommunity);
    setLoading(true);
    try {
      const UpdateData = {
        id: selectedCommunity.id,
        CommunityData: {
          name: values.name,
          description: values.description,
          isPrivate: values.isPrivate,
        },
      };
      const result = await dispatch(UpdateCommunity(UpdateData));
      if (UpdateCommunity.fulfilled.match(result)) {
        message.success("Community updated successfully!");
        setUpdateModal(false);
        form.resetFields();
        dispatch(getAllcommunity());
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      message.error(`Failed to update community: ${errorMessage}`);
      console.log(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleCancelUpdateModal = () => {
    setUpdateModal(false);
  };

  // This Will help us to display the community members list
  const handleCommunityMembers = (community) => {
    setSelectedCommunity(community);
    setPosts(community.posts || []);
  };

  // FUnction that will handle the Topic clicked

  const handleTopicClick = (post) => {
    setSelectedTopic(post);
  };
// Codes for showing Data in Form Modal 
const handleEdit= (post) => {
  setSelectedPost(post);
  setShowUpdatePostModal(true);
  form.setFieldsValue({
    title: post?.title,
    content: post?.content,
  });
};
//Here is the for update Post
const handleUpdatePost=async(values)=>{
  try{
    setLoading(true);
    const result=await dispatch(UpdatePost({
      id:selectedPost.id,
      postData:values
    }));
    if(UpdatePost.fulfilled.match(result)){
      setShowUpdatePostModal(false);
      message.success("Post updated successfully!");
      getAppPost();
    };
  }
  catch(error){
    message.error(`Error updating post: ${error.message}`);
  }
}

const cancelUpdateModal = () => {
  setShowUpdatePostModal(false);
}

  return (
    <div className="mt-10 mx-3">
      <div className="flex justify-between mt-20 ">
        <h4 className="text-purple-600 text-2xl font-semibold my-4">
          Community Management
        </h4>
        <div className="flex justify-end">
          <Button type="primary" className="my-2" onClick={handleModal}>
            <BiPlus size={20} />
            Add Community
          </Button>
        </div>
      </div>
      {isloading ? (
        <div className="text-center">
          <Spin size="large" />
        </div>
      ):(
      <div className="flex gap-3 items-center ">
        {communities.map((community) => {
          return (
            <>
              <div
                className="p-3 border border-gray-400 rounded-md cursor-pointer"
                onClick={() => handleCommunityMembers(community)}
              >
                <div className="flex justify-between">
                  <img
                    src={community.profile || "https://via.placeholder.com/40"}
                    alt={`${community.name} profile`}
                    height={100}
                    width={100}
                    className="rounded-full"
                  />
                  <Button onClick={() => VisibleDetailsModal(community.id)}>
                    <FaEllipsisV size={14} color="black" />
                  </Button>
                </div>
                <br />
                <p className="text-black text-lg font-semibold">
                  {community.name}
                </p>
                <div className="p-2 flex gap-2 justify-center">
                  <Button onClick={() => ShowUpdateModal(community)}>
                    <BiEdit size={22} color="black" />
                  </Button>
                  <Button onClick={() => handleDeleteCommunity(community.id)}>
                    <BiTrash size={22} color="red" />
                  </Button>
                </div>
              </div>
            </>
          );
        })}
      </div>
      )}
      <CommunityDetails
        visible={showCommDetails}
        onClose={hideDetailsModal}
        communityId={selectedCommunityId}
      />
      <div className="flex gap-5 mt-3">
        <div className="w-1/3 border-2 border-gray-300 rounded-lg bg-white">
          <h3 className="text-purple-600 font-semibold mx-4 my-2 text-xl">
            Therapist Community Topics
          </h3>
          <hr className="text-black border border-gray-400" />
         {isloading ? (
           <div className="flex justify-center">
             <Spin size="large"/>
           </div>
         ):(
          <table className="min-w-full">
            <thead>
              <tr className="gap-4">
                <th className="text-black capitalize text-md leading-5 text-left px-3 py-3">
                 Community Name
                </th>
                <th className="text-black capitalize text-md leading-5 text-left px-3 py-3">
                  Topics
                </th>
              </tr>
            </thead>
            <tbody>
              {Posts?.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                    <div className="text-sm leading-5 font-medium text-gray-900">
                      {selectedCommunity?.name||"No Community Name"}  
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                    <div className="text-sm leading-5 font-medium text-gray-900 cursor-pointer" onClick={()=>handleTopicClick(post)}>
                      <h4 className="text-black text-lg  my-3 mx-1 ">
                        {post?.title || "No Title"}
                      </h4>
                      <h4 className="text-gray-700 text-lg  my-3 mx-1">
                        {post?.content || "No Content"}
                      </h4>
                    </div>
                    <div className="p-1 text-lg flex gap-2">
                      <Button type="primary">
                        <IoCheckmarkDoneSharp size={20} />
                        Admit
                      </Button>

                      <Button type="dashed">Ignore</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
        <div className="w-2/3 border-2 border-gray-300 rounded-lg bg-white">
          <h3 className="text-purple-600 text-xl mx-4 my-2 font-semibold">
            Topic
          </h3>
          <hr className="text-black border border-gray-400" />
          <div>
            <table className="min-w-full">
              <thead>
                <tr className="gap-4">
                  <th className="text-black capitalize text-md leading-5 text-left px-3 py-3">
                    User Name
                  </th>
                  <th className="text-black capitalize text-md leading-5 text-left px-3 py-3">
                    Topic Selected To Discuss
                  </th>
                  <th className="text-black capitalize text-md leading-5 text-left px-3 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedTopic? (
                  <tr>
                    <td className="px-6 py-4 whitespace-no-wrap">
                      <div className="text-sm leading-5 font-medium text-gray-900">
                        {selectedTopic.user.firstName||"No Name"} {selectedTopic.user.lastName}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-no-wrap">
                      <div className="text-sm leading-5 font-medium text-gray-900">
                      <h4 className="text-black text-lg my-3 mx-1">
                          {selectedTopic.title}
                        </h4>
                        <p className="text-gray-700 my-2 text-xl">
                          {selectedTopic.content}
                        </p>
                      </div>
                    </td>
                    <td className="flex gap-2 mt-12">
                      <Button>
                        <MdEdit size={24} color="blue" />
                      </Button>
                      <Button>
                        <MdDelete size={24} color="red" />
                      </Button>
                    </td>
                    </tr>
                ):(
                  <tr>
                    <td colSpan="3" className="text-center">No Topic Selected</td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="m-2">
              <h3 className="text-purple-600 text-xl mx-4 my-2 font-semibold">
                Topic Comments
              </h3>
              <hr className="text-black border border-gray-400" />
              {communities.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-no-wrap">
                    <div className="text-sm leading-5 font-medium text-gray-900">
                      {user.name}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-no-wrap">
                    <div className="text-sm leading-5 font-medium text-gray-900">
                      <h4 className="text-black text-xl my-3 mx-1">
                        Tomorrow at 12:00 PM we have a meeting, and it's very
                        important for everyone to be there. Don't plan to miss.
                      </h4>
                    </div>
                  </td>
                  <td className="flex gap-2 mt-12">
                    <Button>
                      <MdEdit size={24} color="blue" />
                    </Button>
                    <Button>
                      <MdDelete size={24} color="red" />
                    </Button>
                  </td>
                </tr>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded border p-10 my-3">
        <h2 className="text-xl text-purple-600"> ALL POST WITHIN SYSTEM</h2>
        <hr className="text-black border border-gray-400" />
        {isloading? (
          <div className="flex justify-center">
            <Spin size="large" />
          </div>
        ):(
        <table className="min-w-full border-2">
          <thead className="border-2">
            <tr className="gap-4">
              <th className="text-black capitalize text-md leading-5 text-left px-3 py-3">
                Community Name
              </th>
              <th className="text-black capitalize text-md leading-5 text-left px-3 py-3">
                Posts
              </th>
              <th className="text-black capitalize text-md leading-5 text-left px-3 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {AllPost?.map((post) => (
              <tr>
                <td className="px-6 py-4 whitespace-no-wrap">
                  <div className="text-lg leading-5 font-medium text-gray-900">
                   {post.community.name}
                  </div>
                  <div className="text-sm text-gray-500 my-1">
                   {post.user.firstName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-no-wrap">
                  <div className="text-sm leading-5 font-medium text-gray-900">
                    <h4 className="text-black text-xl my-3 mx-1">
                      {post?.title || "No Title"}
                     
                    </h4>
                    <p className="text-gray-700 my-2 text-xl">
                      {post?.content || "No Content"}
                   
                    </p>
                  </div>
                </td>
                <td>
                  <div className="flex gap-2">
                  <Button onClick={()=>handleEdit(post)}>
                    <MdEdit size={24} color="blue" />
                  </Button>
                  <Button disabled={isloading} onClick={()=>handleDeletePost(post.id)}>
                    <MdDelete size={24} color="red" />
                  </Button>
                  </div>
                </td>
                </tr>
))}
          </tbody>

        </table>
)}
      </div>
      <Modal
        open={showModal}
        footer={null}
        onCancel={cancelModal}
        title="CREATE COMMUNITY GROUP"
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <FormItem
            name="UserId"
            label="ModeratorId"
            initialValue={UserId}
            hidden
          >
            <Input disabled />
          </FormItem>
          <FormItem name="name" label="Name">
            <Input />
          </FormItem>
          <FormItem name="description" label="Description">
            <TextArea placeholder="Type description" />
          </FormItem>
          <FormItem label="Community Profile">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedFile(file);
                }
              }}
            />
          </FormItem>
          <FormItem>
            IsPrivate <Checkbox />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              loading={isloading}
              disabled={isloading}
              htmlType="submit"
              className="w-full"
            >
              Add Community
            </Button>
          </FormItem>
        </Form>
      </Modal>
      {/* Update Modal */}
      <Modal
        open={updateModal}
        onCancel={handleCancelUpdateModal}
        footer={null}
        title="UPDATE MODAL"
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateCommunity}>
          <FormItem name="name" label="Name">
            <Input />
          </FormItem>
          <FormItem name="description" label="Description">
            <TextArea placeholder="Type description" />
          </FormItem>
          <FormItem>
            IsPrivate <Checkbox />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              loading={isloading}
              disabled={isloading}
              htmlType="submit"
              className="w-full"
            >
              Update Community
            </Button>
          </FormItem>
        </Form>
      </Modal>
      {/* Modal for updating Post */}
      <Modal footer={null} onCancel={cancelUpdateModal} open={showUpdatePostModal} title="Update Post">
        <Form form={form} layout="vertical" onFinish={handleUpdatePost}>
          <FormItem name="title" label="Title:">
            <Input />
          </FormItem>
          <FormItem name="content" label="Content:">
            <TextArea placeholder="Type content" />
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              loading={isloading}
              disabled={isloading}
              htmlType="submit"
              className="w-full"
            >
              Update Post
            </Button>
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
}
