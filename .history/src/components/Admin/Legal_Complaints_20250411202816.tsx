// import React from 'react'

function Legal_Complaints() {
  return (
    <div>
      <h2 className='text-2xl text-black'> Legal and Complaints</h2>
    </div>
  )
}
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
   const [OpenBillMOdal,setOpenBillModal]=useState(false);
export default Legal_Complaints
