import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  user: {
    therapistId?: string;
    UserId?: string;
  } | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  therapistId: string | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
  therapistId: null,
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://mindora-backend-beta-version-m0bk.onrender.com/api/auth/login', credentials);
      console.log("Login Response:", {
        fullData: response.data,
        user: response.data.user,
        therapistId: response.data.user?.therapist?.id

      });
      return response.data;
    } catch (err) {
      if (err.response && err.response.data) {
        return rejectWithValue(err.response.data.message);
      }
      else {
        return rejectWithValue('An error occurred. Please try again later.');
      }
    }
  }
);
export const changePass = createAsyncThunk(
  'auth/changePass',
  async ({ UserId, oldPassword, newPassword }: { UserId: string; oldPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `https://mindora-backend-beta-version-m0bk.onrender.com/api/users/${UserId}/change_password`,
        { oldPassword, newPassword }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const forgotPass = createAsyncThunk('auth/forgotPass',
  async (credential: { email: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('https://mindora-backend-beta-version-m0bk.onrender.com/api/auth/forgot_password', credential);
      return response.data;
    }
    catch (error: number | string) {
      return rejectWithValue(error.response.data || { message: error.message });
    }
  });

// the following is for reset passpassword

export const resetPass = createAsyncThunk(
  'auth/resetPass',
  async (
    { password, confirmPassword, token }: { password: string; confirmPassword: string; token: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `https://mindora-backend-beta-version-m0bk.onrender.com/api/auth/reset_password/${token}`,
        { password, confirmPassword },{
          headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      return response.data;
    } catch (error: number|string) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
import React, { useEffect, useState } from 'react'
import { Button, Input, Card, Spin, message, Image, Upload } from "antd";
import { 
  CameraOutlined, 
  DeleteOutlined, 
  LogoutOutlined, 
  SaveOutlined, 
  LoadingOutlined 
} from '@ant-design/icons';
import { Typography, Divider } from "antd";
import { useDispatch } from 'react-redux';
import { changePass, updateProfile } from '../../Redux/Adminslice/authSlice';
import { FaUpload } from 'react-icons/fa';

export default function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [changePassLoading, setChangePassLoading] = useState(false);
   const[oldPassword,setOldPassword]=useState('');
    const[newPassword,setNewPassword]=useState('');
    const [confirmPassword,setConfirmPassword]=useState('');
    const [profilePhoto, setProfilePhoto] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    

    const previewImage =(e:React.ChangeEvent<HTMLInputElement>)=>{
      const file=e.target.files?.[0];
      if(file){
      setSelectedFile(file);
        message.success(`Selected file: ${file.name}`);
      }
      const reader=new FileReader();
      reader.onload=(e)=>{
        const result = e.target?.result as string;
            setProfilePhoto(result);
      }
      reader.readAsDataURL(file);
    };
       useEffect(()=>{
          const storedFirstName = localStorage.getItem("firstName");
          const storedLastName = localStorage.getItem("lastName");
          const storedProfileImage = localStorage.getItem("profileImage");
          const storedEmail = localStorage.getItem("email");
          if(storedFirstName){
            setFirstName(storedFirstName);
          };
          if(storedLastName){
            setLastName(storedLastName);
          };
          if(storedProfileImage){
           setProfilePhoto(storedProfileImage);
          };
          if(storedEmail){
            setEmail(storedEmail);
          };
        }, []);
  const handleSave =async() => {
    setIsLoading(true);
    const UserId = localStorage.getItem('UserId');
    if(!UserId){
      message.error('User ID not found. Please login again');
      return;
    }
    setIsLoading(true);
    try{
      const response= await dispatch(updateProfile({UserId,firstName,lastName,email,profilePhoto}));
      if(updateProfile.fulfilled.match(response)){
        message.success('Profile updated successfully');
        setFirstName('');
        setLastName('');
        setEmail('');
      } else{
        const errorMessage = response.payload?.message || 'Failed to update profile';
        message.error(errorMessage);
      }
    }
    catch(error:number|string){
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      message.error(`Failed to update profile: ${errorMessage}`);
    }
    finally{
      setIsLoading(false);
    }
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
          <Image  src={profilePhoto || "https://via.placeholder.com/40"} 
            alt="profile" className="my-1 rounded-full " width={150} height={150} />
            <div className="flex gap-2">
            <Upload maxCount={1} 
           
           beforeUpload={(file)=>{
             previewImage({target:{files:[file]}} as React.ChangeEvent<HTMLInputElement>);
             return false;
           }}
           accept="image/*"
           
           >
             <Button><FaUpload/>Change Image</Button>
           </Upload>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <Typography.Text>FirstName</Typography.Text>
              <Input id="name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <Typography.Text>LastName</Typography.Text>
              <Input id="name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div>
              <Typography.Text> User Email</Typography.Text>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
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





const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        //To store TherapistId on Local storage if User is Therapist
        state.TherapistId = action.payload.user?.therapist?.id;
        localStorage.setItem('TherapistId', action.payload.user?.therapist?.id || '');
        console.log("therapy id stored:", state.TherapistId);
        // codes for stora token at local storage when login succesfully 
       if(action.payload.token){
        localStorage.setItem('token',action.payload.token);
        console.log('this is token after login sucessfully',action.payload.token);
       }

        // To store name of any User logedIn
        const fullName = `${action.payload.user?.firstName || ''} ${action.payload.user?.lastName || ''}`.trim();
        localStorage.setItem('fullName', fullName);
        console.log("full Name stored:", fullName);
        // to save names separately
        localStorage.setItem('firstName', action.payload.user?.firstName || '');
        localStorage.setItem('lastName', action.payload.user?.lastName || '');

        // To store Profile in localStorage
        localStorage.setItem('profileImage', action.payload.user?.profileImage || '');
        console.log("Profile Image stored:", action.payload.user?.profileImage);
        localStorage.setItem('email', action.payload.user?.email || '');
        localStorage.setItem('UserId', action.payload.user?.id || '');
        console.log("Logged UserId:", action.payload.user?.id);

      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // forgot pass for authentication

      .addCase(forgotPass.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(forgotPass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(forgotPass.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // The following are about reset password

      .addCase(resetPass.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(resetPass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(resetPass.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      //logic for changing password
      .addCase(changePass.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(changePass.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(changePass.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
  },
});

export default authSlice.reducer;