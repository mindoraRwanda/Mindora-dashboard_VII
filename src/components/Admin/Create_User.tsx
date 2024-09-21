import { Typography, Form, Input, Button, Radio, message } from 'antd'; 
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { NewUser,GetAllUsers } from '../../Redux/slice/UserSlice';


const { Text } = Typography;

export default function CreateUser({onSuccess}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");



  const handleFetch = async () => {
    
    try {
    
      const result = await dispatch(
        NewUser({
          firstName,
          lastName,
          email,
          password, 
        })
      );

      if (NewUser.fulfilled.match(result)) {
        navigate('/dashboard'); // Use navigate here
        message.success("User created successfully");
        dispatch(GetAllUsers()); 
        if(onSuccess){
          onSuccess();
        }

        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setGender("");
        
      } else {
        message.error("Failed to create users");
      }
    } catch (error) {
      console.log("Failed", error);
      message.error("Failed to create user ");
    }
  };

  return (
    <div className="flex justify-center">
      <Form className="bg-white rounded" onFinish={handleFetch}>
        <p className="text-black mb-8 text-center text-xl font-semibold">Create New User</p>

        <div className="grid grid-cols-1 gap-4">
          <Form.Item>
            <Text className="font-semibold text-sm mb-2">First Name:</Text>
            <Input
              className="flex w-96 h-5 p-4 rounded mt-2 bg-transparent border border-blue-600"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Text className="font-semibold text-sm mb-2">Last Name:</Text>
            <Input
              className="flex w-96 h-5 p-4 rounded mt-2 bg-transparent border border-blue-600"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Text className="font-semibold text-sm mb-2">Email:</Text>
            <Input
              className="flex w-96 h-3 p-4 rounded mt-2 bg-transparent border border-blue-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Text className="font-semibold text-sm mb-2">Password:</Text>
            <Input
              className="flex w-96 h-3 p-4 rounded mt-2 bg-transparent border border-blue-600"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Text className="font-semibold text-sm mb-2">Gender:</Text>
            <Radio.Group onChange={(e) => setGender(e.target.value)} value={gender}>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="others">Others</Radio>
            </Radio.Group>
          </Form.Item>
        </div>

        <Form.Item className="text-center">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
