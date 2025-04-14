import { Avatar, Card, Typography } from 'antd';
import React from 'react'
import { BiEdit, BiTrash } from 'react-icons/bi';
import { FaEllipsisV } from 'react-icons/fa';
const { Title, Text, Paragraph } = Typography;
export default function Communities() {
  return (
    <div>
        <div className=" justify-between items-center p-5 bg-gray-100">
       
        <Title level={2} className="text-purple-600 m-0">
          Community Management
        </Title>
        <div className='w-full'>
        <Card
              className="shadow-md flex justify-center transition-all cursor-pointer hover:shadow-lg"
              hoverable
              cover={
                <div className="flex justify-center p-4 bg-gray-50">
                  <Avatar
                    src= "https://via.placeholder.com/100"
                    alt={"profile"}
                    size={100}
                    className="shadow"
                  />
                </div>
              }
           
            >
            </Card>
            </div>

      </div>
    </div>
  )
}
