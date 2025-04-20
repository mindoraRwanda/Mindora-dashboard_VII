// import React from 'react'

function Legal_Complaints() {
  return (
    <div>
      <h2 className='text-2xl text-black'> Legal and Complaints</h2>
    </div>
  )
}

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
