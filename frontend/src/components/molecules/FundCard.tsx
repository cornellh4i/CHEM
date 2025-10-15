"use client";
import React, { useState, useEffect } from 'react';
import { FaUser, FaPercentage } from 'react-icons/fa';
import { LineChart, Line } from 'recharts';
import { useRouter } from 'next/navigation';

const dummyChartData = [
  { date: 1, value: 200 },
  { date: 2, value: 300 },
  { date: 3, value: 250 },
  { date: 4, value: 270 },
  { date: 5, value: 400 },
];

interface FundCardProps {
  id: string;
  name: string;
  amount: number;
  contributors: number;
  percentage: number;
  isRestricted: boolean;
  isEndowment: boolean;
  description: string;
}

const FundCard: React.FC<FundCardProps> = ({
  id,
  name,
  amount,
  contributors,
  percentage,
  isRestricted,
  isEndowment,
  description,
}) => {
  const router = useRouter();
  // adjust width to fit screen sizes dynamically
  const [chartWidth, setChartWidth] = useState(280);

  useEffect(() => {
    const updateChartWidth = () => {
      const containerWidth = Math.min(357, window.innerWidth - 48);
      const chartWidth = Math.max(200, containerWidth - 32);
      setChartWidth(Math.min(280, chartWidth));
    };

    updateChartWidth();
    window.addEventListener('resize', updateChartWidth);
    return () => window.removeEventListener('resize', updateChartWidth);
  }, []);

  return (
    <div
      onClick={() => router.push(`/fundsMain/${id}`)}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.05)'}
      style={{
        maxWidth: '357px',
        minHeight: '266px',
        height: 'auto',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '16px',
        background: 'white',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
        transition: 'box-shadow 0.2s ease-in-out',
        cursor: 'pointer',
      }}
    >
      <div style={{ width: '100%', overflow: 'hidden' }}>
        {/* Placeholder for chart */}
        <LineChart width={chartWidth} height={80} data={dummyChartData}>
          <Line type="monotone" dataKey="value" stroke="#000" strokeWidth={2} dot={true} />
        </LineChart>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontWeight: 600, fontSize: '20px', margin: '10px 0 4px' }}>{name}</h2>
        <span style={{ display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: 500 }}>
          <FaUser style={{ marginRight: '6px' }} />
          {contributors.toLocaleString()}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <p style={{ fontSize: '14px', fontWeight: 500 }}>
          {amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </p>
        <span style={{ display: 'flex', alignItems: 'center', fontSize: '14px', fontWeight: 500 }}>
          <FaPercentage style={{ marginRight: '6px' }} />
          {percentage.toLocaleString()}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{
            padding: '4px 8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#747474',
          }}>{isRestricted ? 'Restricted' : 'Unrestricted'}</span>
        
          <span style={{
            padding: '4px 8px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #e5e7eb',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#747474',
          }}>{isEndowment ? 'Endowment' : 'Donation'}</span>
      </div>

      <p style={{  fontSize: '14px', color: '#000000', marginBottom: 0 }}>
        {description}
      </p>
    </div>
  );
};

export default FundCard;
