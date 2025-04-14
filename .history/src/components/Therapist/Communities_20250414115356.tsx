import { Card, Typography } from 'antd';
import React from 'react'
const { Title, Text, Paragraph } = Typography;
export default function Communities() {
  return (
    <div>
        <div className="flex justify-between items-center p-5 bg-gray-100">
        <Title level={2} className="text-purple-600 m-0">
          Community Management
        </Title>
        <Card
              key={community.id}
              className={`shadow-md transition-all cursor-pointer hover:shadow-lg ${selectedCommunity?.id === community.id ? 'border-purple-500 border-2' : ''}`}
              onClick={() => handleCommunityMembers(community)}
              cover={
                <div className="flex justify-center p-4 bg-gray-50">
                  <Avatar
                    src={community.profile || "https://via.placeholder.com/100"}
                    alt={`${community.name} profile`}
                    size={100}
                    className="shadow"
                  />
                </div>
              }
              actions={[
                <Tooltip title="Edit">
                  <Button type="text" icon={<BiEdit size={20} />} onClick={(e) => ShowUpdateModal(community, e)} />
                </Tooltip>,
                <Tooltip title="Delete">
                  <Button type="text" icon={<BiTrash size={20} className="text-red-500" />} onClick={() => handleDeleteCommunity(community.id)} />
                </Tooltip>,
                <Tooltip title="More Details">
                  <Button type="text" icon={<FaEllipsisV size={14} />} onClick={(e) => VisibleDetailsModal(community.id, e)} />
                </Tooltip>
              ]}
            >
              <Card.Meta
                title={community.name}
                description={community.isPrivate ? "Private Community" : "Public Community"}
              />
            </Card>

      </div>
    </div>
  )
}
