import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { MessageSquare, Activity, ArrowUpRight, ArrowDownRight, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { useNumbers } from '../hooks/useNumbers'
// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Mock data for WhatsApp numbers
const mockNumbers = [
  { id: 'all', name: 'All Numbers' },
  { id: 'num1', name: '+1 (234) 567-8901', requests: 4250, increase: 15.3, planUsage: 42, planLimit: 10000 },
  { id: 'num2', name: '+1 (345) 678-9012', requests: 3100, increase: 8.7, planUsage: 31, planLimit: 10000 },
  { id: 'num3', name: '+1 (456) 789-0123', requests: 1400, increase: -3.2, planUsage: 14, planLimit: 10000 },
];

// Generate mock data for each number
const generateNumberData = (numberId: string) => {
  if (numberId === 'all') {
    return {
      requests: mockNumbers.slice(1).reduce((sum, num) => sum + (num.requests ? num.requests: 0), 0),
      increase: 10.5, // Average increase for all numbers
      planUsage: Math.floor(mockNumbers.slice(1).reduce((sum, num) => sum + (num.planUsage || 0), 0) / (mockNumbers.length - 1)),
      planLimit: 10000,
      data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 1200) + 800),
    };
  }
  
  const number = mockNumbers.find(n => n.id === numberId);
  // Return default values if number is not found
  if (!number) return {
    requests: 0,
    increase: 0,
    planUsage: 0,
    planLimit: 0,
    data: Array.from({ length: 7 }, () => 0),
  };
  
  return {
    requests: number.requests,
    increase: number.increase,
    planUsage: number.planUsage,
    planLimit: number.planLimit,
    data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 300) + 100),
  };
};

const DashboardPage = () => {
  const [selectedNumber, setSelectedNumber] = useState<string>('all');
  const { numbers } = useNumbers();
  const [numberData, setNumberData] = useState(numbers);
  
  // Update data when selected number changes
  useEffect(() => {
    setNumberData(generateNumberData(selectedNumber));
  }, [selectedNumber]);

  // Chart data
  const requestChartData = {
    labels: Array.from({ length: 7 }, (_, i) => 
      format(new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000), 'MMM dd')
    ),
    datasets: [
      {
        label: 'API Requests',
        data: numberData?.data || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 5,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Monitor your WhatsApp number usage and activity</p>
      </div>

      {/* Number Selector */}
      <div className="bg-white rounded-lg shadow p-4">
        <label htmlFor="number-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select WhatsApp Number
        </label>
        <select
          id="number-select"
          value={selectedNumber}
          onChange={(e) => setSelectedNumber(e.target.value)}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          {mockNumbers.map((number) => (
            <option key={number.id} value={number.id}>
              {number.name}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Requests</p>
            <p className="text-2xl font-bold text-gray-900">{(numberData.requests || 0).toLocaleString()}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Phone className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {(numberData.increase || 0) >= 0 ? (
            <>
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">+{numberData.increase}%</span>
            </>
          ) : (
            <>
              <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500 text-sm font-medium">{numberData.increase}%</span>
            </>
          )}
          <span className="text-gray-500 text-sm ml-2">vs yesterday</span>
        </div>
      </div>

      {/* Plan Usage Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700">Plan Usage</h3>
          <span className="text-sm text-gray-500">
            {numberData.planUsage}% of {(numberData.planLimit || 0).toLocaleString()} requests
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              (numberData.planUsage || 0)> 80 
                ? 'bg-red-500' 
                : (numberData.planUsage || 0)> 60 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500'
            }`}
            style={{ width: `${numberData.planUsage}%` }}
          ></div>
        </div>
      </div>

      {/* Request History Chart */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Request History (Last 7 Days)</h3>
          </div>
          <div className="h-[300px]">
            <Line data={requestChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;