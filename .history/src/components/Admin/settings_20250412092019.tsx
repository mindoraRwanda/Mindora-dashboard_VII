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
import { useDispatch } from 'react-redux';
import { changePass } from '../../Redux/Adminslice/authSlice';

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [changePassLoading, setChangePassLoading] = useState(false);
   const[oldPassword,setOldPassword]=useState('');
    const[newPassword,setNewPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    const dispatch = useDispatch();
    

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      message.success('Profile updated successfully');
      setIsLoading(false);
    }, 1500);
  };
    const validatePasswords = () => {
      if (!oldPassword || !newPassword||!confirmPassword) {
        message.error('All password change Fields are required');
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
      if (newPassword !== confirmPassword) {
        message.error('New password and confirm password do not match');
        return false;
      }
      return true;
    };

     const handleChangePass= async () => {
        if (!validatePasswords()) return;
        const UserId = localStorage.getItem('UserId');
        console.log('Logged In UserId', UserId);
        if (!UserId) {
          message.error('User ID not found. Please login again');
          return;
        };
        setChangePassLoading(true);
        try{
      const response= await dispatch(changePass({UserId,oldPassword,newPassword}));
     if(changePass.fulfilled.match(response)){
       message.success('Changed password successfully');
       setOldPassword('');
       setNewPassword('');
       setConfirmPassword('');
     } else{
       const errorMessage = response.payload?.message || 'Failed to change password';
       message.error(errorMessage);
     }}
        catch(error:number|string){
          const errorMessage = error.response?.data?.message || 'Something went wrong';
          message.error(`Failed to change password: ${errorMessage}`);
        }
        finally{
          setChangePassLoading(false);
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
            <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div>
            <Typography.Text>Confirm New Password</Typography.Text>
            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
          </div>
        </div>
        
        <Divider />
        
        <div>
          <Button type="primary" disabled={changePassLoading} loading={changePassLoading} onClick={handleChangePass}>Update Password</Button>
        </div>
        </div>
      </Card>
    </div>
  )
}

