import { Button, Modal, Spin } from "antd";
import { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { MdPermMedia } from "react-icons/md";
import { GetCommunityById } from "../../Redux/Adminslice/CommunitySlice";
import { useDispatch, useSelector } from "react-redux";


export default function CommunityDetails({visible,onClose,communityId}) {
    const [showMembers,setShowMembers]=useState(false);
    const {selectedCommunity={ members: [] },status}=useSelector((state)=>state.Community);
    const dispatch=useDispatch();
    const [selectedCommunityId,setSelectedCommunityId]=useState([false]);
    // To show Modal of  Members
    const showMembersModal=(id)=>{
        setShowMembers(true);
        dispatch(GetCommunityById(communityId));
        setSelectedCommunityId(id);
        
    };
    const CloseMemberModal=()=>{
        setShowMembers(false);
        setSelectedCommunityId(null);
    };

    return(
        <div>
            {/* This is the modal for the Community Details */}
            <Modal footer={null} onCancel={onClose} open={visible} width={300} title="Community Details">
                <div className="flex gap-2 flex-col">
                <Button onClick={showMembersModal}><FaUser/> Members</Button>
                <Button ><AiOutlineEye/>OverViews</Button>
                <Button><MdPermMedia/>  Media</Button>
                <Button><FiSettings/>Settings</Button>
                </div>
            </Modal>

            {/* The Modal for display Members */}
            <Modal footer={null} onCancel={CloseMemberModal} open={showMembers} width={400} title="Members Of Community">
              {status==="loading" ?(
                <Spin size="large"/>
              ):(
                <ol className="list-decimal ml-6">
                {selectedCommunity.members.map((member) => (
                  <li key={member.id} className="text-lg m-2">
                    {member.username}
                    <p className="text-sm text-gray-600">
                     Role: {member.UserCommunity?.role || 'member'}
                     </p>
                     <p className="text-sm text-green-500">{member.UserCommunity?.status}</p>
                  </li>
                ))}
              </ol>
              
              )}
            </Modal>
        
        </div>
    )
}