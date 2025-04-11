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

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      message.success('Profile updated successfully');
      setIsLoading(false);
    }, 1500);
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
    <div className="space-x-6 flex gap-3 flex-col md:flex-row justify-center items-center">
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
        <div className='w-full max-w-2xl space-y-6 border border-gray-200 shadow-md p-7 rounded-md'>
        <Typography.Title level={4}>Security</Typography.Title>
        <Typography.Text type="secondary">Manage your password and security settings</Typography.Text>
        
        <Divider />
        
        <div className="space-y-4">
          <div>
            <Typography.Text>Current Password</Typography.Text>
            <Input id="current-password" type="password" />
          </div>
          <div>
            <Typography.Text>New Password</Typography.Text>
            <Input id="new-password" type="password" />
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