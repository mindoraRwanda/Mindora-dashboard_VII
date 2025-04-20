import { Typography } from 'antd';
import React from 'react'
const { Title, Text, Paragraph } = Typography;
export default function Communities() {
  return (
    <div>
        <div className="flex justify-between items-center px-4 mt-5 bg-gray-100">
        <Title level={2} className="text-purple-600 m-0">
          Community Management
        </Title>

      </div>
    </div>
  )
}
