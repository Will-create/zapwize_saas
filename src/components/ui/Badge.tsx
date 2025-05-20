import React from 'react';

type BadgeProps = {
  status: 'connected' | 'pending' | 'disconnected';
};

const Badge = ({ status }: BadgeProps) => {
  let bgColor = '';
  let textColor = '';
  let label = '';

  switch (status) {
    case 'connected':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      label = 'Connected';
      break;
    case 'pending':
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      label = 'Pending';
      break;
    case 'disconnected':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      label = 'Disconnected';
      break;
    default:
      bgColor = 'bg-gray-100';
      textColor = 'text-gray-800';
      label = status;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      <span className={`h-2 w-2 rounded-full mr-1.5 ${bgColor.replace('100', '400')}`}></span>
      {label}
    </span>
  );
};

export default Badge;