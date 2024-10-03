import { useEffect, useRef, useState } from "react";
import { Form, Input, Button, Radio, DatePicker } from "antd";
import { MdFileUpload } from "react-icons/md";
import { LuFileUp } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../Redux/store";
import { fetchTherapy, getAllTherapists } from "../../Redux/slice/ThearpySlice";
import { featchUserById } from "../../Redux/slice/UserSlice";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

export default function CreateTherapy({ userId,onSuccess }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [diploma, setDiploma] = useState(null);
  const [licence, setLicence] = useState(null);
  const [email, setEmail] = useState("");

  const [form] = Form.useForm();
  const fileDiplomaInputRef = useRef(null);
  const fileLicenceInputRef = useRef(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.Therapy);


  // the Following is for getting User form users in table

  useEffect(() => {
     console.log("CreateTherapy received userId:", userId); 
    if (userId) {
      const feactUserData = async () => {
        try {
          const result = await dispatch(featchUserById(userId));
          if (featchUserById.fulfilled.match(result)) {
            const userData = result.payload;
          form.setFieldsValue({
            name: `${userData.firstName || ""} ${userData.lastName || ""}`,
            email:userData.email || "",
            phoneNumber:userData.phoneNumber || "",
          })
           
          }
        } catch (error) {
          message.error("Failed to get User data" + error.message);
        }
      };
      feactUserData();
    }
  }, [dispatch,userId,form]);

  // this is for Submitting form of creating Therapy
  const handleSubmit = async (values) => {
    const{phoneNumber,gender,name}=values;
    const formData= new FormData();
    formData.append("name",name);
    formData.append("gender",gender);
    formData.append("dateOfBirth",dateOfBirth? dateOfBirth.format("YYYY-MM-DD") : "");
    formData.append("address",address);
    formData.append("phoneNumber",phoneNumber);
    formData.append("diploma",diploma);
    formData.append("licence",licence);
    formData.append("userId", selectedUser.id); 

    

    if (!dateOfBirth) {
      message.error("Please select a valid date of birth");
      return;
    };

    if (!diploma){
      message.error("Please upload diploma");
      return;
    };

    if (!licence){
      message.error("Please upload licence");
      return;
    };

    try {
      const resultAction = await dispatch(
        fetchTherapy(formData));
      
      if (fetchTherapy.fulfilled.match(resultAction)) {
        message.success("New Therapies created successfully");
        dispatch(getAllTherapists());

        setName("");
        setGender("");
        setDateOfBirth(null);
        setAddress("");
        setPhoneNumber("");
        setDiploma(null);
        setLicence(null);

        form.resetFields();

        if (onSuccess) {
          onSuccess();
        }
        navigate("/dashboard");
      } else {
        message.error(`Therapy creation failed ${error}`);
      }
    } catch (error) {
      console.error("Failed to create therapy:", error);
      message.error("An error occurred while creating therapy");
    }
  };

  // function to upload licence information
  const handleLicence=()=>{
    fileLicenceInputRef.current.click();
  };

  // function to upload diploma information
  const handleDiploma=()=>{
    fileDiplomaInputRef.current.click();
  };
  // function to open files for diploma

  const handleDiplomaFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDiploma(file);
      form.setFieldsValue({ diploma: file.name });
      message.success(`Selected file: ${file.name}`);
    }
  };

  // function to open files for licence
  const handleLicenceFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLicence(file);
      form.setFieldsValue({ licence: file.name });
      message.success(`Selected file: ${file.name}`);
    }
  };

  return (
    <div className="flex justify-center">
      <Form form={form} className="bg-white rounded" onFinish={handleSubmit}>
        <p className="text-black mb-8 text-center text-xl font-semibold">
          Create New Therapy
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter your Name" }]}
          >
            <Input
              className="w-full p-1 rounded border border-blue-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your Email" }]}
          >
            <Input 
            className="w-full p-1 rounded border border-blue-600"
            value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="DateofBirth"
            name="dateOfBirth"
            rules={[
              { required: true, message: "Please select your Date of Birth" },
            ]}
          >
            <DatePicker onChange={(date) => setDateOfBirth(date)} className="w-full p-1 rounded border border-blue-600"/>
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter your Address" }]}
          >
            <Input
              className="w-full p-1 rounded border border-blue-600"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Phone No"
            name="phoneNumber"
            rules={[
              { required: true, message: "Please enter your Phone Number" },
            ]}
          >
            <Input
             className="w-full p-1 rounded border border-blue-600"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Diploma"
            name="diploma"
            rules={[{ required: true, message: "Please enter your Diploma" }]}
          >
              <Input
              className="w-full p-1 rounded border border-blue-600"
              placeholder="Select diploma"
              value={diploma ? diploma.name : ""}
              readOnly
              suffix={<MdFileUpload onClick={handleDiploma} size={23} />}
              autoComplete="off"
            />
               <input
              type="file"
              ref={fileDiplomaInputRef}
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={handleDiplomaFileChange}
            />
          </Form.Item>

          <Form.Item
            label="Licence"
            name="licence"
            rules={[{ required: true, message: "Please enter your Licence" }]}
          >
            <Input
              placeholder="Select Licence"
              value={licence ? licence.name : ""}
              readOnly
              suffix={<LuFileUp onClick={handleLicence} size={23} />}
              autoComplete="off"
              className="w-full p-1 rounded border border-blue-600"
            />
              <input
              type="file"
              ref={fileLicenceInputRef}
              accept="application/pdf"
              style={{ display: "none" }}
              onChange={handleLicenceFileChange}
            />
          </Form.Item>
        </div>
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
          <Button
            type="primary"
            htmlType="submit"
            disabled={status === "loading"}
            className="w-full"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
