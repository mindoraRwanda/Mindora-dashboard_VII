import { MdDelete, MdEdit } from "react-icons/md";
import { BiPlus } from "react-icons/bi";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import TextArea from "antd/es/input/TextArea";
import { Button, Input, Modal ,Checkbox,Form,message, Spin} from "antd";
import FormItem from "antd/es/form/FormItem";
import { useDispatch, useSelector } from "react-redux";
import { createCommunity, getAllcommunity } from "../../Redux/Adminslice/CommunitySlice";
import { RootState } from "../../Redux/store";


export default function Communication() {
  const communities = useSelector((state:RootState)=>state.Community.communities);
  const status = useSelector((state:RootState)=>state.Community.status);

  const [showModal, setShowModal] = useState(false);
  const [isloading,setLoading] = useState(false);
  const [form] = Form.useForm();  
  const [UserId,setUserId]=useState('');
  const dispatch=useDispatch();

  useEffect(() =>{
    const storedUserId=localStorage.getItem('UserId');
    if(storedUserId){
      setUserId(storedUserId);  
    }
  },[]);

  // fetch all communities on component mount
useEffect(() =>{
  dispatch(getAllcommunity());
},[dispatch]);

  // function to create a new community Groupe
  const handleSubmit = async (values: any) => {
  const CommunityData:Community={
  moderatorId:UserId,
  name:values.name,
  description:values.description,
  isPrivate: values.isPrivate || false
  };
  setLoading(true);
  try{
    const result=await dispatch(createCommunity(CommunityData));
    if(createCommunity.fulfilled.match(result)){
      message.success("Community created successfully!");
      setShowModal(false);
      form.resetFields();
      dispatch(getAllcommunity());
    }
    }
    catch(error){
      const errorMessage=(error as Error).message;
      message.error(`Failed to create community: ${errorMessage}`);
      console.log(errorMessage);
    }
    finally{
      setLoading(false);
    }
  };

const handleModal=()=>{
  setShowModal(true);
};

const cancelModal=()=>{
  setShowModal(false);
}
  return (
    <div className="mt-10 mx-3">
      <div className="flex justify-between mt-20 ">
      <h4 className="text-purple-600 text-2xl font-semibold my-4">
        Community Management
      </h4>
      <div className="flex justify-end">
          <Button type="primary" className="my-2"
           onClick={handleModal} ><BiPlus size={20} />Add Community</Button>
        </div>
        </div>
      <div className="flex gap-3 items-center ">
       {/* {status==='loading'&& <span><Spin size="30" className="flex justify-center"/> </span>} */}
        {communities.map((community)=>{
          return(
       <>
        <div className="p-3 border-2 border-gray-400 rounded-md cursor-pointer">
          <img src="/Images/beauty1.jpg" alt="com" width={100} height={100} className="rounded-full ml-5" /><br />
          <p className="text-black text-lg font-semibold">{community.name}</p>
        </div>
        </>
      )}) }
    
      </div>
   
    
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
                  Messages
                </th>
              </tr>
            </thead>
            <tbody>
              {communities.map((community) => (
                <tr key={community.id}>
                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                    <div className="text-sm leading-5 font-medium text-gray-900">
                      {community.name}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-300">
                    <div className="text-sm leading-5 font-medium text-gray-900">
                      <h4 className="text-black text-xl font-serif my-3 mx-1">
                        Tomorrow at 12:00 PM we have a meeting, and it's very
                        important for everyone to be there. Don't plan to miss.
                      </h4>
                    </div>
                    <div className="p-1 text-lg flex gap-2">
                      <Button type="primary"><IoCheckmarkDoneSharp size={20} />Admit</Button>
                      <Button type="dashed">Ignore</Button>
                    </div>
                  </td>
              
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6">
            <TextArea
              name="messages"
              id="messages"
              placeholder="Text Announcement here"
              className="border border-slate-400 mx-2 mt-4 p-2 text-black bg-gray-200 rounded-lg"
              autoSize={{minRows:2, maxRows:20}}
              value={message}
              // onChange={handleInput}
            />
            <div className="flex justify-end mx-2 mb-4">
              <button className="bg-purple-600 text-white font-semibold px-3 mr-2 py-1 rounded hover:bg-purple-700">
                Send
              </button>
            </div>
          </div>
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
                  Messages
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
                        important for everyone to be there. Don't plan to miss.
                      </h4>
                    </div>
                  </td>
                  <td className="flex gap-2 mt-12">
                 
                    <button><MdEdit size={24} color="blue" /></button>
                    <button><MdDelete size={24} color="red" /></button>
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
          {communities.map((user) => {
         return (
        <li key={user.id} className="py-4 flex">
      <div className="flex-shrink-0">
        <span className="p-2 text-gray-400 text-xl ">💬</span>
      </div>
      <div className=" text-black text-lg ">
        <p className="italic font-semibold">{user.name}</p>
        <p className="">{user.lastLogin}</p>
      </div>
      <Button type="dashed" className="ml-5">Read</Button>
    </li>
  );
})}
</div></div></div></div>
<Modal open={showModal} footer={null} onCancel={cancelModal}  title="CREATE COMMUNITY GROUP">
<Form form={form} layout="vertical" onFinish={handleSubmit} >
  <FormItem name="UserId" label="ModeratorId" initialValue={UserId} >
    <Input  disabled/>
  </FormItem>
  <FormItem name="name" label="Name">
    <Input/>
  </FormItem>
  <FormItem name="description" label="Description">
    <TextArea placeholder="Type description"/>
  </FormItem>
  <FormItem>
    IsPrivate  <Checkbox/>
  </FormItem>
  <FormItem>
    <Button type="primary" 
    loading={isloading}
          disabled={isloading}
           htmlType="submit" className="w-full">
      Add Community
    </Button>
  </FormItem>
</Form>
</Modal>

</div>
  );
}
