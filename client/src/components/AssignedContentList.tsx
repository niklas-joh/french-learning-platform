import React from 'react';
import { Link } from 'react-router-dom';
import { UserContentAssignmentWithContent } from '../types/Assignment';

interface AssignedContentListProps {
  assignments: UserContentAssignmentWithContent[];
}

const AssignedContentList: React.FC<AssignedContentListProps> = ({ assignments }) => {
  if (assignments.length === 0) {
    return <p>No content has been assigned to you yet.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Assigned Content</h2>
      <ul className="space-y-4">
        {assignments.map((assignment) => (
          <li key={assignment.id} className="p-4 border rounded-lg shadow-sm">
            <Link to={`/content/${assignment.content.id}`} className="text-xl font-semibold text-blue-600 hover:underline">
              {assignment.content.name}
            </Link>
            <p className="text-gray-600">{assignment.content.type}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignedContentList;
