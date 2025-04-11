import { Button, Form, Input, Modal,Spin,message } from "antd";
import { CheckCircle } from "lucide-react";
import React, { useEffect, useState } from 'react';
import{ BiEdit, BiPlus, BiTrash } from "react-icons/bi";
import { BsCalendar } from "react-icons/bs";
import { FaDollarSign } from "react-icons/fa";
import { MdPending } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { createBillReport, deleteBillReport, getBillingReports, updateBillReport } from "../../Redux/Adminslice/BillingReportSlice";
import { RootState } from "../../Redux/store";


export default function BillingReports(){
  const reports = useSelector((state: RootState) => state.BillingReports.data);
  const status=useSelector((state: RootState) => state.BillingReports.status);
  const [OpenBillMOdal,setOpenBillModal]=useState(false);
  const [updateModal,setUpdateModal]=useState(false);
  const [currentBill,setCurrentBill]=useState(false);
  const dispatch=useDispatch();
  const [form] = Form.useForm();

 const handleReportOpen=()=>{
   setOpenBillModal(true);
 }
 const handleCloseBillModal=()=>{
  setOpenBillModal(false);
  setUpdateModal(false);
  form.resetFields();
};
 const OpenUpdateModel=(report)=>{
   setCurrentBill(report);
   form.setFieldsValue({
    totalRevenue:report.totalRevenue,
    approvedInsuranceClaims:report.approvedInsuranceClaims,
    rejectedInsuranceClaims:report.rejectedInsuranceClaims,
    pendingInsuranceClaims:report.pendingInsuranceClaims,
    totalOutstandingBalance:report.totalOutstandingBalance,
   })
   setUpdateModal(true);
 };

 // function update
 const handleUpdateBillReport =async () => {
   try {
    const Values=form.getFieldsValue();
    if(!currentBill)return;
     await dispatch(updateBillReport({id:currentBill.id,...Values})).unwrap();
     message.success("Report updated successfully");
     setUpdateModal(false);
     form.resetFields();
     dispatch(getBillingReports());
   } catch (error) {
     message.error("Failed to update report: " + error);
   } 
 };
 
 
// here to create bill
  const handleCreateReport = async (values: any) => {
    const formData = {
      startDate: values.startTime, 
      endDate: values.endTime,
    };
    try {
      await dispatch(createBillReport(formData)).unwrap();
      message.success("Report created successfully");
      setOpenBillModal(false);
      form.resetFields();
      dispatch(getBillingReports());
    } catch (error) {
      message.error("Failed to create report: " + error);
    }
  };

  // function to delete Bill Report
  const handleDeleteReport = async (id: string) => {
   const confirm= window.confirm("Are you sure you want to delete");
    if(confirm){
    try {
      await dispatch(deleteBillReport(id)).unwrap();
      message.success("Report deleted successfully");
      dispatch(getBillingReports());
    } catch (error) {
      message.error("Failed to delete report: " + error);
    }
  }
  };

  // here to get all bills
  useEffect(() => {
  dispatch(getBillingReports());
  },[dispatch]);

  
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true 
    });
  };
  return (
    <>
      {" "}
      <div className="bg-white pb-4 m-4">
        <div className="font-2xl justify-between  p-2 bg-white flex">
          <h1 className="text-black text-2xl font-bold">Billing Reports</h1>
          <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-5 px-4 rounded flex" onClick={handleReportOpen}>
            <BiPlus size={23} /> New Report
          </Button>
        </div>
        {status==='loading'?(
          <div className="flex items-center justify-center min-h-screen">
            <Spin size="large" />
          </div>
        ):(
        reports.length > 0 ? (
      reports.map((report, index) => (
        <div key={index} className="border border-black rounded p-2 bg-white m-2 my-10">
        <div className="flex justify-between">
        <div className="flex gap-1">
          <BsCalendar size={23} color="black" />
          <span className="text-xl text-black font-semibold">
            Billing period: {report.startDate} - {report.endDate}
          </span>
        </div>
        <div className="flex gap-2 my-3">
          <Button onClick={()=>OpenUpdateModel(report)} ><BiEdit size={20} /></Button>
          <Button onClick={()=>handleDeleteReport(report.id)}><BiTrash size={20} color="red" /></Button>
        </div>
      </div>

      <div className="mx-1 my-3 p-2 bg-blue-50 rounded flex justify-between">
        <h2 className="flex gap-1">
          <FaDollarSign className="text-blue-600 w-4 h-5 mt-2" />
          <span className="font-semibold text-blue-600 text-lg">Total Revenue</span>
        </h2>
        <h2 className="text-black mr-4">{report.totalRevenue}</h2>
      </div>

      <div className="mx-1 my-3 p-2 bg-green-50 rounded flex justify-between">
        <h2 className="flex gap-1">
          <CheckCircle className="text-green-600 w-4 h-4 mt-2" />
          <span className="font-semibold text-green-600 text-lg">Approved revenue</span>
        </h2>
        <h2 className="text-black mr-4">{report.approvedInsuranceClaims}</h2>
      </div>

      <div className="mx-1 my-3 p-2 bg-yellow-50 rounded flex justify-between">
        <h2 className="flex gap-1">
          <MdPending className="text-yellow-600 w-4 h-4 mt-2" />
          <span className="font-semibold text-yellow-600 text-lg">Pending Claims</span>
        </h2>
        <h2 className="text-black mr-4">{report.pendingInsuranceClaims}</h2>
      </div>

      <div className="mx-1 my-3 p-2 bg-red-50 rounded flex justify-between">
        <h2 className="flex gap-1">
          <MdPending className="text-red-600 w-5 h-5 mt-2" />
          <span className="font-semibold text-black text-lg">Rejected Claims</span>
        </h2>
        <h2 className="text-black mr-4">{report.rejectedInsuranceClaims}</h2>
      </div>

      <div className="flex gap-2 mt-5">
        <strong className="text-xl text-black ml-2">Last Updated:</strong>
        <strong className="text-black text-xl">{formatTime(report.updatedAt)}</strong>
      </div>
    </div>
  ))
) : (
  <h2>No Reports Available</h2>
))} 

</div>
          <Modal footer={null} open={OpenBillMOdal} onCancel={handleCloseBillModal}>
           <Form onFinish={handleCreateReport}>
            <h1 className="text-2xl justify-center font-semibold m-2">New Report</h1>
            <Form.Item label="Start Time" name="startTime">
          <Input type="date" placeholder="Enter Start Time" />
         </Form.Item>
          <Form.Item label="End Time" name="endTime">
          <Input type="date" placeholder="Enter End Time" />
            </Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Create
            </Button>
        </Form>
      </Modal>
      {/* MOdal to update Bill */}
      <Modal open={updateModal} onCancel={handleCloseBillModal} footer={null} title='Update Bill'>
        <Form form={form} layout="vertical" >
        <div className="grid grid-cols-2 gap-3">
          <Form.Item
          name="totalRevenue"
          label="Total Revenue"
          rules={[
            {required:false}]}>
              <Input placeholder="Enter total Revenue" />
            </Form.Item>
            <Form.Item
            name="approvedInsuranceClaims"
            label="Approved Insurance Claims"
            rules={[
              {required:false}]}>
                <Input placeholder="Enter Approved Insurance Claims" />
              </Form.Item>
              <Form.Item
              name="rejectedInsuranceClaims"
              label="Rejected Insurance Claims"
              rules={[
                {required:false}]}>
                  <Input placeholder="Enter Rejected Insurance Claims" />
                </Form.Item>
                <Form.Item
                name="pendingInsuranceClaims"
                label="Pending Insurance Claims"
                rules={[
                  {required:false}]}>
                    <Input placeholder="Enter Pending Insurance Claims" />
                  </Form.Item>
                  </div>
                    <Form.Item
                    name='totalOutstandingBalance'
                    label='TotalOutstanding Balance'
                    rules={[
                    {required:false}]}>
                      <Input placeholder='Enter TotalOutstanding Balance' />
                    </Form.Item>
        </Form>
        <Button className="bg-purple-600 w-full p-2 text-white" type="submit" onClick={handleUpdateBillReport}
       loading={status==="loading"} disabled={status==='loading'}
        > Update Bill</Button>

      </Modal>
    </>
  );
}
