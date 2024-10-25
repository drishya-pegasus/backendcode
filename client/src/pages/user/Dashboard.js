import React from 'react';
import Layout from '../../components/Layout/Layout';
import UserMenu from '../../components/Layout/UserMenu';
import { useAuth } from '../../context/auth';
import './User.css'; // Ensure you have this CSS file for custom styles

const Dashboard = () => {
  const [auth] = useAuth();
  
  return (
    <Layout>
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-3'>
            <UserMenu />
          </div>
          <div className='col-md-9'>
            <div className='card user-info'>
              <div className='user-info-content'>
                <h3 className='user-info-title'>User Information</h3>
                <div className='user-info-details'>
                  <p><strong>Name:</strong> {auth?.user?.name}</p>
                  <p><strong>Email:</strong> {auth?.user?.email}</p>
                  <p><strong>Address:</strong> {auth?.user?.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
