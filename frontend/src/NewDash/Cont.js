import React from 'react'
import axios from "axios";
import SlidingCardCarousel from '../SlidingCard/SlidingCardCarousel'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useState, useEffect } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


const Cont = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the data from the API
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/count//verification-count');
        const data = response.data;

        // Prepare chart data
        setChartData({
          labels: ['Pancard', 'Aadhar', 'Udyan Card', 'Pan Detail', 'Voter', 'Passport', 'Credit', 'GST'],
          datasets: [
            {
              label: 'Verification Count',
              data: [
                data.pancard,
                data.aadhar,
                data.udyancard,
                data.pandetail,
                data.voter,
                data.passport,
                data.credit,
                data.gst,
              ],
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
                '#E7E9ED',
                '#36A2EB',
              ],
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div id="content">
       <div className="dashboard-view text-center">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between p-3 bg-white shadow rounded">
            <div>
              <h4>Hi, User</h4>
              <p className="text-muted">Cheers, and happy activities.</p>
              <p className="font-weight-bold">
                Wallet Balance: <span>Rs. 47445.56</span>
              </p>
              <button className="btn btn-warning btn-sm mt-2">Add Credit</button>
            </div>
            <div>
              <SlidingCardCarousel />
            </div>
          </div>

          <div className="mt-4">
            <h5>Average API Hit</h5>
            <div className="bg-light rounded p-4 shadow">
              <div className="bg-light rounded p-4 shadow">
                {loading ? <p>Loading chart...</p> : <Bar data={chartData} />}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <h5>Most Utilized API's</h5>
              <div className="bg-light rounded p-4 shadow">
                {loading ? <p>Loading chart...</p> : <Bar data={chartData} />}
              </div>
          </div>
        </div>
    </div>
    </>
  )
}

export default Cont
