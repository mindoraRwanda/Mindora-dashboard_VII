import { Typography, Form, Input, Button, Radio } from 'antd';
import { useState } from 'react';

const { Text } = Typography;

export default function CreateUser({ addUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = () => {
    const newUser = {
      name,
      email,
      lastLogin: new Date().toISOString().split("T")[0],
      age,
      gender,
    };

    addUser(newUser);
  };

  return (
    <div className="flex justify-center">
      <Form className="bg-white rounded">
        <p className="text-black mb-8 text-center text-xl font-semibold">Create New User</p>

        <div className="grid grid-cols-1 gap-4">
          <Form.Item>
            <Text className="font-semibold text-sm mb-2">Name:</Text>
            <Input
              className="flex w-96 h-5 p-4 rounded mt-2 bg-transparent border border-blue-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <Text className="font-semibold text-sm mb-2">Age:</Text>
            <Input
              className="flex w-96 h-3 pr-10 p-4 rounded mt-2 bg-transparent border border-blue-600"
              value={age}
              onChange={(e) => setAge(e.target.value)}
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
          <Button type="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
