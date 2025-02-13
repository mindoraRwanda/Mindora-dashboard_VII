import { Button, Input, message, Modal, Select, Form, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BiBook, BiPlus, BiTime } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { createCourses, deleteCourse, editCourse, getCourses } from "../../Redux/Adminslice/CourseSlice";
import { RootState } from "../../Redux/store";

function Course_Management() {
  const allCourses=useSelector((state:RootState)=>state.courses.coursesData||[]);
  const status=useSelector((state:RootState)=>state.courses.status);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

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
  const handleClose = () => {
    setOpenCreateModal(false);
    setOpenEditModal(false);
    setSelectedCourse(null);
    form.resetFields();
  };

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

  return (
    <>
      <div className="text-2xl text-black m-4  mt-20 bg-white">
        <div className="font-2xl justify-between mt-10 p-2 bg-white flex">
          <h1 className="text-black text-2xl font-semibold">
            Article Management
          </h1>
          <div className="p-1 border rounded text-lg italic">
            {" "}
            Total Articles:
            <span className="text-blue-500 ml-2">150</span>
          </div>
          <Button
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded flex"
            onClick={() => showCreateModal()}
          >
            <BiPlus size={23} /> New Course
          </Button>
        </div>
        <div className="border rounded p-7 my-5 grid grid-cols-3">
          <div className="rounded-md mx-2 px-5 py-2 border">
            <div className="flex justify-between">
              <h3 className="font-semibold my-2">Active Courses</h3>
            </div>
            <span className="my-3">20</span>
          </div>
          <div className="rounded-md mx-2 px-5 py-2 border">
            <div className="flex justify-between">
              <h3 className="font-semibold my-2">Total Enrollement</h3>
            </div>
            <span className="my-3">10</span>
          </div>
          <div className="rounded-md mx-2 px-5 py-2 border">
            <div className="flex justify-between">
              <h3 className="font-semibold my-2">Completion Rate</h3>
            </div>
            <span className="my-3">20%</span>
          </div>
        </div>
        <div className="border rounded grid grid-cols-2 gap-2 ">
          <div className="flex">
            <Search className="w-12 h-12 my-6" />
            <Input
              type="text"
              placeholder="Search Courses"
              className="w-full mt-3 border rounded my-6"
            />
          </div>
          <div className="w-full">
            <select className="border p-3 mt-3 ">
              <option value="">All Courses</option>
              <option value="asc">Active</option>
              <option value="desc">Draft</option>
              <option value="asc">Archived</option>
            </select>
          </div>
        </div>
        <div className="border rounded p-5 my-5">
          <span>All COURSES</span>
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
              <Button className="bg-purple-600 hover:bg-purple-600 text-white" onClick={()=>showEditMOdal(courses)}>
                Edit
              </Button>
              <Button className="bg-red-600 hover:bg-red-600 text-white" onClick={()=>handleDeleteCourse(courses.id)}>
                Delete
              </Button>
            </div>
          </div>
           ))):(
            <p>No courses found</p>
           )}
        </div>
      
      </div>
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
          >
            {openEditModal ? "Update Course":"Create Course"}
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default Course_Management;
