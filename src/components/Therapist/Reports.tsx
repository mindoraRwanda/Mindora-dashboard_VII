import { Button, DatePicker, Form, Modal, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { BiDownload, BiPlus } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { getAllReports } from '../../Redux/TherapistSlice/ReportSlice';

function Reports() {
  const reportContent=useSelector((state:RootState)=>state.reports.Report);
  const status=useSelector((state:RootState)=>state.reports.status);

  const [isreportShow,setIsReportShow]=useState(false);
  const [form] = Form.useForm();
  const dispatch=useDispatch();

  const userId=localStorage.getItem('UserId');
  useEffect(()=>{
    dispatch(getAllReports(userId));
  },[dispatch, userId]);

  return (
    <div className="bg-white rounded border px-8 mt-4">
      <div className='flex justify-between p-3'>
      <h3 className='text-purple-600 text-2xl font-semibold'>Patient Progress Report</h3>
      <Button className='bg-purple-600 text-white font-semibold p-5 flex' onClick={()=>setIsReportShow(true)}> <BiPlus size={25}/>
         New Report</Button> 
      </div>
     
      <table className='w-full'>
        <thead>
          <tr className='border-b text-gray-600' >
            <th className='p-3 text-left'>Patient ID</th>
            <th className='p-3 text-left'>Patient Name</th>
            <th className='p-3 text-left'>Progress status</th>
            <th className='p-3 text-left'>Start Date</th>
            <th className='p-3 text-left'>End Date</th>
            <th className='p-3 text-left'>Actions</th>
          </tr>
        </thead>
        <tbody>
        {status==='loading'?(
          <div className="flex items-center justify-center ">
          <Spin size="large" />
      </div>
      ):(reportContent.map((report,index)=>(
          <tr className='border-b text-gray-700'>
            <td className='p-3 text-left'>{index+1}</td>
            <td className='p-3 text-left'>{report.moodSummary.averageRating}</td>
            <td className='p-3 text-left'>Completed</td>
            <td className='p-3 text-left'>{report.startDate}</td>
            <td className='p-3 text-left'>{report.endDate}</td>
            <td className='p-3 text-left flex'>
              <Button  className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-300 rounded flex items-center justify-center hover:bg-slate-200 transition-colors ml-2">View</Button>
              <Button  className="px-3 py-1 bg-indigo-500 text-white rounded flex items-center justify-center hover:bg-indigo-600 transition-colors ml-2">Edit</Button>
              <Button   className="px-3 py-1 bg-rose-500 text-white rounded flex items-center justify-center hover:bg-rose-600 transition-colors ml-2">Delete</Button>
              <Button  className="px-3 py-1 bg-emerald-500 text-white rounded flex items-center justify-center hover:bg-emerald-600 transition-colors ml-2"><BiDownload/>Download</Button>
            </td>
          </tr>
  )))}
        </tbody>
      </table>
    
      <Modal open={isreportShow} onCancel={()=>{setIsReportShow(false);form.resetFields()}} footer={null} title="CREATE NEW REPORT">
        <Form form={form} layout='vertical' >
          <Form.Item name="startDate" label="Start Date" >
            <DatePicker  className='w-full'/>
          </Form.Item>
          <Form.Item name="endDate" label="End Date" >
            <DatePicker className='w-full'/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className='w-full'>
              Create Report
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Reports