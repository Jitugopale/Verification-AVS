import React from 'react'
import {Link} from "react-router-dom"

const RegisterPage = () => {
  return (
    <>
      <div className='container-fluid'>
        <div className='d-flex justify-content-center align-items-center vh-100'>
          <div className='card shadow p-3 w-50'>
             <h1>Register</h1>
            <form>
            <div className="form-group">
                <label htmlFor="exampleInputEmail1">First Name</label>
                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="First Name" />
            </div>
            <div className="form-group">
                <label htmlFor="exampleInputEmail1">Last Name</label>
                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Last Name" />
            </div>
            <div className="form-group">
                <label htmlFor="exampleInputEmail1">Address</label>
                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Address" />
            </div>
            <div className="form-group">
                <label htmlFor="exampleInputEmail1">Phone Number</label>
                <input type="number" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Phone Number" />
            </div>
            <div className="form-group">
                <label htmlFor="exampleInputEmail1">Email address</label>
                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email address" />
            </div>
            <div className="form-group">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
            </div>
            <div className="form-group">
                <label htmlFor="exampleInputEmail1">City</label>
                <input type="text" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="City" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            <div className="mt-2">
                <p className="card-text">Already registered? <Link to="/login"> Go to Login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RegisterPage
