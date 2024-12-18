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

export default function Communication() {
  const communities = useSelector(
    (state: RootState) => state.Community.communities
  );
  const status = useSelector((state: RootState) => state.Community.status);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [communityMembers,setCommunityMembers]=useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCommDetails, setShowCommDetails] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [isloading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [UserId, setUserId] = useState("");
  const [selectedCommunityId,setSelectedCommunityId]=useState([]);
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

  // function to create a new community Groupe
  const handleSubmit = async (values: any) => {
    const CommunityData: Community = {
      moderatorId: UserId,
      name: values.name,
      description: values.description,
      isPrivate: values.isPrivate || false,
    };
    setLoading(true);
    try {
      const result = await dispatch(createCommunity(CommunityData));
      if (createCommunity.fulfilled.match(result)) {
        message.success("Community created successfully!");
        setShowModal(false);
        form.resetFields();
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
  const VisibleDetailsModal=(id)=>{
    setShowCommDetails(true);
    setSelectedCommunityId(id);
    setSelectedCommunity(communities.find((c) => c.id === id));
  };
  const hideDetailsModal=()=>{
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

const handleCommunityMembers=(community)=>{
  setSelectedCommunity(community);
  setCommunityMembers(community.members||[]);

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
      <div className="flex gap-3 items-center ">
        {/* {status === "loading" && (
          <span className="flex justify-center">
            <Spin size="large" />{" "}
          </span>
        )} */}
        {communities.map((community) => {
          return (
            <>
              <div className="p-3 border border-gray-400 rounded-md cursor-pointer" 
              onClick={()=>handleCommunityMembers(community)}>
                <div className="flex justify-between">
                <img
                  src="/Images/beauty1.jpg"
                  alt="com"
                  width={100}
                  height={100}
                  className="rounded-full ml-5"
                />
                <Button  onClick={()=>VisibleDetailsModal(community.id)}><FaEllipsisV size={14} color="black"/></Button>
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
      <CommunityDetails visible={showCommDetails} onClose={hideDetailsModal} communityId={selectedCommunityId}/>
      <div className="flex gap-5 mt-3">
        <div className="w-1/3 border-2 border-gray-300 rounded-lg bg-white">
          <h3 className="text-purple-600 font-semibold mx-4 my-2 text-xl">
            Therapist Community Content
          </h3>
          <hr className="text-black border border-gray-400" />
          <table className="min-w-full">
            <thead>
              <tr className="gap-4">
                <th className="text-black capitalize text-md leading-5 text-left px-3 py-3">
                  Name
                </th>
                <th className="text-black capitalize text-md leading-5 text-left px-3 py-3">
                  Topics
                </th>
              </tr>
            </thead>
            <tbody>
              {communityMembers?.map((member) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                    <div className="text-sm leading-5 font-medium text-gray-900">
                    {member.username || 'No username'}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                    <div className="text-sm leading-5 font-medium text-gray-900">
                      <h4 className="text-black text-xl font-serif my-3 mx-1">
                      {selectedCommunity?.posts?.[0]?.title || 'No posts'} 
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
                    Name
                  </th>
                  <th className="text-black capitalize text-md leading-5 text-left px-3 py-3">
                    Topics
                  </th>
                  <th className="text-black capitalize text-md leading-5 text-left px-3 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {communities.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-no-wrap">
                      <div className="text-sm leading-5 font-medium text-gray-900">
                        {user.name}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-no-wrap">
                      <div className="text-sm leading-5 font-medium text-gray-900">
                        <h4 className="text-black text-xl font-serif my-3 mx-1">
                          Tomorrow at 12:00 PM we have a meeting, and it's very
                          important for everyone to be there. Don't plan to
                          miss.
                        </h4>
                      </div>
                    </td>
                    <td className="flex gap-2 mt-12">
                      <button>
                        <MdEdit size={24} color="blue" />
                      </button>
                      <button>
                        <MdDelete size={24} color="red" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="my-2">
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
                      <h4 className="text-black text-xl font-serif my-3 mx-1">
                        Tomorrow at 12:00 PM we have a meeting, and it's very
                        important for everyone to be there. Don't plan to miss.
                      </h4>
                    </div>
                  </td>
                  <td className="flex gap-2 mt-12">
                    <button>
                      <MdEdit size={24} color="blue" />
                    </button>
                    <button>
                      <MdDelete size={24} color="red" />
                    </button>
                  </td>
                </tr>
              ))}
            </div>
          </div>
        </div>
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
    </div>
  );
}
