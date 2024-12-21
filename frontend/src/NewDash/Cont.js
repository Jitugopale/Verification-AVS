import React from 'react'
import SlidingCardCarousel from '../SlidingCard/SlidingCardCarousel'

const Cont = () => {
  return (
    <>
      <div id="content">
       <div className="dashboard-view">
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between p-3 bg-white shadow rounded">
            <div>
              <h4>Hi, WALMIK DARADE</h4>
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
              <p>Chart placeholder</p>
            </div>
          </div>
          <div className="mt-4">
            <h5>Most Utilized API's</h5>
            <div className="bg-light rounded p-4 shadow">
              <p>Chart placeholder</p>
            </div>
          </div>
        </div>
    </div>
    </>
  )
}

export default Cont
