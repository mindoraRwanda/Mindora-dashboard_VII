import { useState } from "react";
import {  Form, Input, Button, Radio, DatePicker} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../Redux/store";
import { fetchTherapy } from "../../Redux/slice/ThearpySlice";
import { useNavigate } from "react-router-dom";
import { message } from "antd";


export default function CreateTherapy() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [diploma, setDiploma] = useState("");
  const [licence, setLicence] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status } = useSelector((state: RootState) => state.Therapy);

  const handleSubmit = async () => {
    const userId="f418cfe8-4112-4425-acc2-6536078a505d";
    if (!dateOfBirth) {
      message.error("Please select a valid date of birth");
      return;
    }
    try {
      const resultAction = await dispatch(
        fetchTherapy({
          name,
          gender,
          dateOfBirth: dateOfBirth ? dateOfBirth.format("YYYY-MM-DD"):"",
          address,
          phoneNumber,
          diploma,
          licence,
          userId,
        })
      );
      if (fetchTherapy.fulfilled.match(resultAction)) {
        navigate("/dashboard");
        message.success('New Therapies created successfully');
      } else {
        message.error("Therapy creation failed");
      }
    } catch (error) {
      console.error("Failed to create therapy:", error);
      message.error("An error occurred while creating therapy");
    }
  };

  return (
    <div className="flex justify-center">
      <Form className="bg-white rounded" onFinish={handleSubmit}>
        <p className="text-black mb-8 text-center text-xl font-semibold">
          Create New Therapy
        </p>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter your Name" }]}
        >
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Item>


        <Form.Item
          label="Date of Birth"
          name="dateOfBirth"
          rules={[{ required: true, message: "Please select your Date of Birth" }]}
        >
          <DatePicker onChange={(date) => setDateOfBirth(date)} />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please enter your Address" }]}
        >
          <Input value={address} onChange={(e) => setAddress(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[{ required: true, message: "Please enter your Phone Number" }]}
        >
          <Input
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label="Diploma"
          name="diploma"
          rules={[{ required: true, message: "Please enter your Diploma" }]}
        >
          <Input value={diploma} onChange={(e) => setDiploma(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="Licence"
          name="licence"
          rules={[{ required: true, message: "Please enter your Licence" }]}
        >
          <Input value={licence} onChange={(e) => setLicence(e.target.value)} />
        </Form.Item>

        <Form.Item
          label="Gender"
          name="gender"
          rules={[{ required: true, message: "Please select Gender" }]}
        >
          <Radio.Group onChange={(e) => setGender(e.target.value)}>
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
            <Radio value="others">Others</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item className="text-center">
          <Button type="primary" htmlType="submit" disabled={status === "loading"}>
            Submit
          </Button>
        </Form.Item>
        
      </Form>
    </div>
  );
}
