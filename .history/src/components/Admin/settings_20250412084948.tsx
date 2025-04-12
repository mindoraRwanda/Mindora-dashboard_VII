import React, { useState } from 'react'
import { Button, Input, Card, Avatar, Spin, message } from "antd";
import { 
  CameraOutlined, 
  DeleteOutlined, 
  LogoutOutlined, 
  SaveOutlined, 
  LoadingOutlined 
} from '@ant-design/icons';
import { Typography, Divider } from "antd";
import { changePass } from '../../Redux/Adminslice/authSlice';

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
   const[oldPassword,setOldPassword]=useState('');
    const[newPassword,setNewPassword]=useState('');
    

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      message.success('Profile updated successfully');
      setIsLoading(false);
    }, 1500);
  };
    const validatePasswords = () => {
      if (!oldPassword || !newPassword) {
        message.error('Both old and new passwords are required');
        return false;
      }
      if (oldPassword === newPassword) {
        message.error('New password must be different from old password');
        return false;
      }
      if (newPassword.length < 5) {
        message.error('New password must be at least 5 characters long');
        return false;
      }
      return true;
    };

     const handleChangePass= async (oldPassword:string,newPassword:string) => {
        if (!validatePasswords()) return;
        const UserId = localStorage.getItem('UserId');
        console.log('Logged In UserId', UserId);
        if (!UserId) {
          message.error('User ID not found. Please login again');
          return;
        };
        try{
          console.log('Attempting to change password with:', { 
            UserId, 
            oldPasswordLength: oldPassword.length, 
            newPasswordLength: newPassword.length 
          });
      const response= await dispatch(changePass({UserId,oldPassword,newPassword}));
     if(changePass.fulfilled.match(response)){
       message.success('Changed password successfully');
       SetChangePassModal(false);
       setOldPassword('');
       setNewPassword('');
     } else{
       const errorMessage = response.payload?.message || 'Failed to change password';
       message.error(errorMessage);
     }}
        catch(error:number|string){
          const errorMessage = error.response?.data?.message || 'Something went wrong';
          message.error(`Failed to change password: ${errorMessage}`);
        }
      };

  const handleLogout = () => {
    setIsLogoutLoading(true);
    // Simulate logout
    setTimeout(() => {
      message.info('Logged out');
      setIsLogoutLoading(false);
    }, 1500);
  };

  return (
    <div className="space-x-6 mt-8 flex gap-3 flex-col md:flex-row justify-center items-center">
      <Card className='flex justify-center items-center '>
        <div className='w-full max-w-2xl space-y-6 border border-gray-200 shadow-md p-10 rounded-md' >
        <Typography.Title level={4}>Profile Information</Typography.Title>
        <Typography.Text type="secondary">Update your account profile information and settings</Typography.Text>
        
        <Divider />
        
        <div className="flex flex-col md:flex-row gap-6  items-start">
          <div className="flex flex-col items-center gap-2">
            <Avatar size={96} src="/placeholder.svg?height=96&width=96">JD</Avatar>
            <div className="flex gap-2">
              <Button size="small">
                <CameraOutlined />
                Change
              </Button>
              <Button size="small" danger>
                <DeleteOutlined />
              </Button>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <Typography.Text>Name</Typography.Text>
              <Input id="name" defaultValue="John Doe" />
            </div>
            <div>
              <Typography.Text>Email</Typography.Text>
              <Input id="email" type="email" defaultValue="john.doe@example.com" />
            </div>
            <div>
              <Typography.Text>Job Title</Typography.Text>
              <Input id="title" defaultValue="Farm Manager" />
            </div>
          </div>
        </div>
        
        <Divider />
        
        <div className="flex justify-between">
          <Button 
            onClick={handleLogout} 
            danger 
            disabled={isLogoutLoading}
            icon={isLogoutLoading ? <Spin indicator={<LoadingOutlined />} /> : <LogoutOutlined />}
          >
            Logout
          </Button>
          <Button 
            onClick={handleSave} 
            type="primary" 
            disabled={isLoading}
            icon={isLoading ? <Spin indicator={<LoadingOutlined />} /> : <SaveOutlined />}
          >
            Save Changes
          </Button>
        </div>
        </div>
      </Card>

      <Card className='flex justify-center items-center '>
        <div className='w-full max-w-2xl space-y-6 border border-gray-200 shadow-md p-10 rounded-md'>
        <Typography.Title level={4}>Security & Privacy</Typography.Title>
        <Typography.Text type="secondary">Manage your password and security settings</Typography.Text>
        
        <Divider />
        
        <div className="space-y-4">
          <div>
            <Typography.Text>Current Password</Typography.Text>
            <Input id="current-password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          </div>
          <div>
            <Typography.Text>New Password</Typography.Text>
            <Input id="new-password" type="password" value={newPassword} on />
          </div>
          <div>
            <Typography.Text>Confirm New Password</Typography.Text>
            <Input id="confirm-password" type="password" />
          </div>
        </div>
        
        <Divider />
        
        <div>
          <Button type="primary">Update Password</Button>
        </div>
        </div>
      </Card>
    </div>
  )
}

<Modal open={ChangePassModal}   onCancel={() => {
  SetChangePassModal(false);
 setOldPassword('');
 setNewPassword('');
}} footer={null} className="float-end mr-5">
<div className="grid grid-cols-1">
 <h3 className="font-bold text-xl py-3"> Change PassWord</h3>
 <p>Your New Password must be different to the current password.</p>
 <input
   type="password"
   value={oldPassword}
   onChange={(e)=>setOldPassword(e.target.value)}
   className="border-2 p-2 mt-6 rounded-md w-full"
   placeholder="Enter Old Password"
 />{" "}
 <br />
 <input
   type="password"
   placeholder="Enter New Password"
   value={newPassword}
   onChange={(e)=>setNewPassword(e.target.value)}
   className="border-2 w-full p-2  rounded-md"
 />
 <button
   onClick={()=>handleChangePass(oldPassword,newPassword)}
   disabled={status ==="loading"}
   className="bg-purple-600 p-2 mt-3 w-full rounded-md text-white"
 >
  {status === 'loading' ? 'Loading...' : 'Change Pasword'}
 </button>
</div>
</Modal>