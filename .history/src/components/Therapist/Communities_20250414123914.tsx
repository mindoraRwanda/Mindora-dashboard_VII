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
        <Card
              className="shadow-md flex justify-center transition-all  hover:shadow-lg"
              cover={
                <div className="flex justify-center p-4 bg-gray-50 ">
                  <Avatar
                    src= "https://via.placeholder.com/100"
                    alt={"profile"}
                    size={100}
                    className="shadow cursor-pointer"
                  />
                </div>
              }
           
            >
            </Card>
            <Card className="shadow-md flex justify-center transition-all  hover:shadow-lg p-10 mt-2">
                <div>
                    <Title level={4} className="text-purple-600 m-0">List of Topic Name</Title>
                    <Text className="text-gray-500">Community Description</Text>
                    <Paragraph className="text-gray-500 mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Paragraph>
                </div>
                </Card>

      </div>
    </div>
  )
}
