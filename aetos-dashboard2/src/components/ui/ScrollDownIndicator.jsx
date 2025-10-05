// src/components/ScrollDownIndicator.jsx

import React from 'react';
import './ScrollDownIndicator.css'; // We will create this file next

export const ScrollDownIndicator = ({ href, className, ...rest }) => {
  return (
    <a href={href} className={`scroll-indicator ${className || ''}`} {...rest}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-8 h-8" // Example size, you can change this
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    </a>
  );
};