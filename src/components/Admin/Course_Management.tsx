import { Button, Input, message, Modal, Select, Form, Spin, Upload } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BiBook, BiPlus, BiTime } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { createCourses, deleteCourse, editCourse, getCourses } from "../../Redux/Adminslice/CourseSlice";
import { RootState } from "../../Redux/store";
import { createArticle } from "../../Redux/Adminslice/Article_Slice";
import Article_Management from "./Article_Management";

function Course_Management() {
  const allCourses=useSelector((state:RootState)=>state.courses.coursesData||[]);
  const statusArticle=useSelector((state:RootState)=>state.articleContent.status);
  const status=useSelector((state:RootState)=>state.courses.status);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openArticleModal, setOpenArticleModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activeButton, setActiveButton] = useState("Courses");

  const [form] = useForm();
  const Dispatch = useDispatch();

  const showCreateModal = () => {
    setOpenCreateModal(true);
    form.resetFields();
    setOpenEditModal(false);
  };
  const showEditMOdal = (course) => {
    setOpenEditModal(true);
    form.setFieldsValue(course);
    setSelectedCourse(course);
    setOpenCreateModal(false);

  }
  const showArticleModal=(course)=>{
    setOpenArticleModal(true);
    setSelectedCourse(course);
    form.resetFields();
    form.setFieldsValue({
      category: course.category
    });
  };
  const handleClose = () => {
    setOpenCreateModal(false);
    setOpenEditModal(false);
    setOpenArticleModal(false);
    setSelectedCourse(null);
    form.resetFields();
  };
  const handleActiveButton = (buttonName:any) => {
    setActiveButton(buttonName);
  }

  // codese to create the course
  const handleCreateCourse = async () => {
    try {
      const courseData = await form.getFieldsValue();
      if(openEditModal){
        await Dispatch(editCourse({id:selectedCourse.id,...courseData})).unwrap();
        message.success("Course Updated successfully");
      }else{
        await Dispatch(createCourses(courseData)).unwrap();
        message.success("Course created successfully");
      }
      handleClose();
      Dispatch(getCourses());
    } catch (error) {
      message.error(`Failed to ${openEditModal? "Update":"create"} course: ${error}`);
    }
  };

// function to handle selected course
const handleSelectedCourse =(course:any)=>{
  setSelectedCourse(course);
  setActiveButton("Course Articles")
}
console.log('SelectedCourseid',selectedCourse?.id);
  // Function to display all courses
useEffect(() => {
  Dispatch(getCourses());
},[Dispatch]);

// function to delete course
const handleDeleteCourse=async(id:string) => {
  if (!window.confirm("Are you sure you want to delete this course?")) {
    return;
  }
  try{
    await Dispatch(deleteCourse(id)).unwrap();
      message.success("Course deleted successfully");
      Dispatch(getCourses());
  }
  catch(error){
    message.error(`Error deleting course: ${error.message}`);
  }
};

const renderContent=() => {
  switch (activeButton) {
    case "Courses":
      return(
      <div className="text-2xl text-black m-4  mt-4 bg-white">
        <div className="border rounded grid grid-cols-3 gap-2 ">
          <div className="flex">
            <Search className=" my-6" />
            <Input
              type="text"
              placeholder="Search Courses"
              className="w-full mt-3 border rounded my-6"
            />
          </div>
            <Select className=" mt-3" defaultValue="">
              <Select.Option value="">All Courses</Select.Option>
              <Select.Option value="asc">Active</Select.Option>
              <Select.Option value="desc">Draft</Select.Option>
              <Select.Option value="asc">Archived</Select.Option>
            </Select>
        </div>
        <div className="border rounded p-5 my-5">
          <div className="flex justify-between gap-2">
          <span>All COURSES</span>
          <div className="p-1 border rounded text-lg italic">
            {" "}
            Total Articles:
            <span className="text-blue-500 ml-2">{allCourses.length}</span>
          </div>
          <Button
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded flex"
            onClick={() => showCreateModal()}
          >
            <BiPlus size={23} /> New Course
          </Button>
          </div>
          {status==="loading" ? (
        <div className="flex items-center justify-center text-red-600 min-h-screen">
          <Spin size="large" />
        </div>
      ) : 
          allCourses.length > 0 ? (
          allCourses.map((courses,index) => (
          <div key={index} className="flex justify-between my-3 border p-5">
            <div>
              <p className="text-2xl">{courses.title} </p>
            
              <div className="flex gap-4 mt-5 ">
                <span className="flex italic">
                  {" "}
                  <FaUser size={15} />
                  <p className="text-gray-500 flex text-sm">Instructor:<strong className="mx-1">{courses.instructor}</strong></p>
                </span>
                <span className="flex italic">
                  <BiBook size={15} />
                  <p className="text-gray-500 flex text-sm">Level:<strong className="mx-1">{courses.level}</strong></p>
                </span>
                <span className="flex italic">
                  <BiTime size={15} />
                  <p className="text-gray-500 flex text-sm">Duration:<strong className="mx-1">{courses.duration}</strong></p>
                </span>
              </div>
            </div>
        
        <div className="flex gap-3">
          <Button className="bg-purple-600  text-white" onClick={()=>showEditMOdal(courses)}
               loading={status==="loading"}disabled={status==="disabled"}
            >

            Edit
          </Button>
          <Button className="bg-red-600  text-white" onClick={()=>handleDeleteCourse(courses.id)}>
            Delete
          </Button>
          <Button className="text-white bg-black" onClick={()=>handleSelectedCourse(courses)}>About Article</Button>
        </div>
            </div>
           ))):(
            <p>No courses found</p>
           )}
        </div>
      
      </div>)
      case "Course Articles":
        return<Article_Management selectedCourseId={selectedCourse?.id} setActiveButton={setActiveButton} selectedCourse={selectedCourse}/>
  }

};

  return (
    <>
      <div className="bg-white rounded border mt-16 p-6">
     <h1 className="text-white bg-purple-600  w-full p-1 rounded flex justify-center text-3xl font-semibold">
       Courses Management 
     </h1>
     <div className="flex flex-row gap-7 mx-4 mt-9">
        {["Courses", "Course Articles"].map((buttonName) => (
          <button
            key={buttonName}
            className={`text-lg font-semibold px-6 py-2 rounded ${
              activeButton === buttonName
                ? "bg-purple-600 text-white hover:bg-purple-800"
                : "bg-gray-200 text-black hover:bg-gray-400"
            }`}
            onClick={() => handleActiveButton(buttonName)}
          >
            {buttonName}
          </button>
        ))}
        ;
      </div>
      {renderContent()}
      <Modal
        open={openCreateModal || openEditModal}
        onCancel={handleClose}
        footer={null}
        title={openEditModal ? "Edit the Course": "Create a Course"}
      >
        <div className="my-4">
          <Form form={form} layout="vertical">
            <Form.Item
              name="title"
              label="Course Title"
              rules={[
                { required: true, message: "Please input Course Title!" },
              ]}
            >
              <Input placeholder="Course Title" />
            </Form.Item>

            <Form.Item
              name="level"
              label="Course level"
              className="w-full"
              rules={[
                { required: true, message: "Please input Course level!" },
              ]}
            >
              <Input placeholder="Course Level" />
            </Form.Item>
           <div className="flex gap-2">
            <Form.Item
              name="instructor"
              label="Course instructor"
              className="w-full"
              rules={[
                { required: true, message: "Please input Course instructor!" },
              ]}
            >
              <Input placeholder="Course instructor" />
            </Form.Item>
            <Form.Item
              name="price"
              label="Course Price"
              className="w-full"
              rules={[
                { required: true, message: "Please input Course Price!" },
              ]}
            >
              <Input placeholder="Course Price" />
            </Form.Item>
            </div>
            <div className="flex gap-2">
              <Form.Item
                name="duration"
                label="Course Duration"
                className="w-full"
                rules={[
                  { required: true, message: "Please input Course Duration!" },
                ]}
              >
                <Input placeholder="Course Duration" />
              </Form.Item>

              <Form.Item
                name="category"
                label="Course Category"
                className="w-full"
                rules={[
                  { required: true, message: "Please select Course Category!" },
                ]}
              >
                <Select className="w-full " defaultValue="Programming">
                  <Select.Option value="Programming">
                    Mental Problems
                  </Select.Option>
                  <Select.Option value="Data Science">
                    Immunity issues
                  </Select.Option>
                  <Select.Option value="Marketing">
                    Family categories
                  </Select.Option>
                  <Select.Option value="Artificial Intelligence">
                    Relationship
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>
            <Form.Item
              name="description"
              label="Course Description"
              rules={[
                { required: true, message: "Please input Course Description!" },
              ]}
            >
              <TextArea placeholder="Course Description" />
            </Form.Item>
          </Form>
          <Button
            className="text-white bg-purple-600 hover:bg-purple-600 w-full p-4"
            onClick={ handleCreateCourse}
            type="submit"
            loading={status==="loading"}
            disabled={status==="disabled"}
          >
            {openEditModal ? "Update Course":"Create Course"}
          </Button>
        </div>
      </Modal>
      {/* Modal for create article */}

    {/* <Modal open={openArticleModal} onCancel={handleClose} 
    footer={null} title={`Create article In ${selectedCourse?.title||''}`}>
      <div className="my-4">
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Article Title"
            rules={[
              { required: true, message: "Please input Article Title!" }
            ]}
          >
            <Input placeholder="Article Title" />
          </Form.Item>
          <Form.Item
          name="author"
          label="Article Author"
          rules={[
            { required: true, message: "Please input Article Author!" }
          ]}>
            <Input placeholder="Article Author" />
          </Form.Item>
          <div className="flex gap-3">
          <Form.Item
          name='category'
          label='Article Category'
          className="w-full"
          rules={[
            { required: true, message: "Please select Article Category!" }
          ]}>
            <Input placeholder="Enter Category Name"/>
          </Form.Item>
          <Form.Item
          name='publishedDate'
          label='Date Uploaded'
          className="w-full"
          rules={[
            { required: true, message: "Please select Date Uploaded!" }
          ]}>
            <Input type='date'/>
          </Form.Item>
          </div>
          <Form.Item
            name="image"
            label="Article Cover Image"
           
            rules={[
              { required: true, message: "Please input Article Image!" }]}>
                <Upload maxCount={1} >
                  <Button><FaUpload/>Select Image</Button>
                </Upload>
              </Form.Item>
          <Form.Item
            name="content"
            label="Article Content"
            rules={[
              { required: true, message: "Please input Article Content!" }]}>
                <TextArea placeholder="Article Content" />
                </Form.Item>
                <Button
                  className="text-white bg-purple-600 w-full p-4"
                  onClick={handleCreateArticle}
                  type="submit"
                  loading={statusArticle==="loading"}
                  disabled={statusArticle==="loading"}
                  > Create Article</Button>
          </Form>
          </div>
    </Modal> */}
    </div>
    </>
  );
}

export default Course_Management;
