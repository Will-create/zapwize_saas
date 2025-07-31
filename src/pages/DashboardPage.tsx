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
import { useNumbers } from '../hooks/useNumbers';
import { useAlertStore } from '../store/alertStore';
import Button from '../components/ui/Button';
import { fetchDashboardData } from '../services/api'; // Add this import

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

// TODO: Backend should return an array of numbers with the following structure:
// [
//   { id: 'string', name: 'string', requests: number, increase: number, planUsage: number, planLimit: number },
//   ...
// ]
const DashboardPage = () => {
  const [selectedNumber, setSelectedNumber] = useState<string>('all');
  const { numbers } = useNumbers();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const { show: showAlert } = useAlertStore();
  
   useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDashboardData(selectedNumber);
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        showAlert('Failed to fetch dashboard data', 'error');
      }
    };

    fetchData();
  }, [selectedNumber, showAlert]);


  // TODO: Backend should return an object with the following structure:
  // {
  //   requests: number,
  //   increase: number,
  //   planUsage: number,
  //   planLimit: number,
  //   data: [number, ...] // Array of numbers representing API requests for the last 7 days
  // }
const requestChartData = {
    labels: dashboardData?.chartData.labels || [],
    datasets: [
      {
        label: 'API Requests',
        data: dashboardData?.chartData.data || [],
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

   if (!dashboardData) {
    return <div>Loading...</div>;
  }



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
          <option value="all">All Numbers</option>
          {numbers.map((number) => (
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
            <p className="text-2xl font-bold text-gray-900">{dashboardData.totalRequests.toLocaleString()}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-lg">
            <Phone className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="mt-4 flex items-center">
          {dashboardData.increase >= 0 ? (
            <>
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500 text-sm font-medium">+{dashboardData.increase}%</span>
            </>
          ) : (
            <>
              <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500 text-sm font-medium">{dashboardData.increase}%</span>
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
            {dashboardData.planUsage}% of {dashboardData.planLimit.toLocaleString()} requests
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              dashboardData.planUsage > 80 
                ? 'bg-red-500' 
                : dashboardData.planUsage > 60 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500'
            }`}
            style={{ width: `${dashboardData.planUsage}%` }}
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

      {/* Trigger Alert Banner */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Global Alert Banner</h3>
        <div className="flex space-x-4">
          <Button onClick={() => showAlert('Your email is not verified', 'warning', { label: 'Verify Now', onPress: () => console.log('Verify Now clicked') })}>Show Warning</Button>
          <Button onClick={() => showAlert('Your payment was successful', 'success', undefined, 5)}>Show Success with Timer</Button>
          <Button onClick={() => showAlert('There was an error processing your request', 'error')}>Show Error</Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;