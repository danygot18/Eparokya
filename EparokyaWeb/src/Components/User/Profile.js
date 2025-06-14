import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../Layout/Loader';
import {
  Avatar, Button, Card, CardContent, Grid, List, ListItem, ListItemText, Typography, Divider, Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import LockResetIcon from '@mui/icons-material/LockReset';
import DescriptionIcon from '@mui/icons-material/Description';
import MetaData from '../Layout/MetaData';
import { useSelector } from 'react-redux';
import '../Layout/styles/style.css'; 
import axios from 'axios';
import GuestSideBar from '../GuestSideBar';

const Profile = () => {
  const { user: reduxUser, loading } = useSelector((state) => state.auth);
  const [user, setUser] = useState(reduxUser);

  // console.log('user', reduxUser);

  const fetchUserProfile = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/profile`, {

        withCredentials: true,

      });
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const getUserProfile = async () => {
      const profileData = await fetchUserProfile();
      if (profileData) {
        // console.log('Fetched User Profile:', profileData);
        setUser(profileData.user);
      }
    };

    getUserProfile();
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <GuestSideBar />
      <div style={{ 
        flex: 1, 
        padding: "24px", 
        backgroundColor: "#f8fafc",
        marginLeft: "30px" // Match sidebar width
      }}>
        <Fragment>
          <MetaData title="Profile" />
  
          {/* Header Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" color="success" sx={{ fontWeight: 600 }}>
              My Profile
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your account information and settings
            </Typography>
          </Box>
  
          <Grid container spacing={3}>
            {/* Left Side (Avatar & Actions) */}
            <Grid item xs={12} md={4}>
              <Card sx={{ 
                p: 3, 
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                borderRadius: 3
              }}>
                <Avatar
                  src={user?.avatar?.url || '/default-avatar.png'}
                  alt={user?.name || 'User Avatar'}
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    mx: 'auto', 
                    mb: 2,
                    border: '4px solid #fff',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
  
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <Box component="span" sx={{ fontWeight: 600 }}>Member since:</Box> {String(user?.createdAt).substring(0, 10)}
                </Typography>
  
                <Divider sx={{ my: 3, borderColor: 'divider' }} />
  
              <Grid container spacing={2}>
      {[
        { label: 'Edit Profile', path: '/UpdateProfile' },
        { label: 'Change Password', path: '/password/update' },
        { label: 'View Forms', path: '/user/SubmittedFormsNavigation' },
        { label: 'Prayer Wall', path: '/user/SubmittedPrayerWallList' },
        { label: 'Feedback', path: '/user/submittedFeedback' }
      ].map((item, index) => (
        <Grid item xs={12} key={index}>
          <Button
            component={Link}
            to={item.path}
            fullWidth
            variant="outlined"
            color="success"
            sx={{
              justifyContent: 'flex-start',
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'success.light',
                color: 'success.main'
              }
            }}
          >
            {item.label}
          </Button>
        </Grid>
      ))}

      {/* Conditionally render Request Ministry Item button */}
      {user?.ministryRoles?.some(
        (role) => role.role === 'Coordinator' || role.role === 'Assistant Coordinator'
      ) && (
        <Grid item xs={12}>
          <Button
            component={Link}
            to="/user/RequestItem"
            fullWidth
            variant="contained"
            color="success"
            sx={{
              justifyContent: 'flex-start',
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              backgroundColor: 'success.main',
              '&:hover': {
                backgroundColor: 'success.dark'
              }
            }}
          >
            Request Ministry Item
          </Button>
        </Grid>
      )}
    </Grid>
              </Card>
            </Grid>
  
            {/* Right Side (Profile Details) */}
            <Grid item xs={12} md={8}>
              <Card sx={{ 
                p: 0,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                borderRadius: 3
              }}>
                {/* Profile Header */}
                <Box sx={{ 
                  p: 3, 
                  backgroundColor: 'success.main',
                  color: 'common.white',
                  borderTopLeftRadius: 3,
                  borderTopRightRadius: 3
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Hello, {user?.name?.split(' ')[0]}!
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Here's your profile information
                  </Typography>
                </Box>
  
                <Box sx={{ p: 3 }}>
                  {/* Personal Information Section */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ 
                      mb: 2, 
                      fontWeight: 600,
                      color: 'text.primary'
                    }}>
                      Personal Information
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {[
                        { label: 'Full Name', value: user?.name },
                        { label: 'Birthday', value: user?.birthDate ? new Date(user.birthDate).toLocaleDateString('en-US') : 'N/A' },
                        { label: 'Gender', value: user?.preference || 'N/A' },
                        { label: 'Phone', value: user?.phone || 'N/A' },
                        { label: 'Email', value: user?.email || 'N/A' },
                      ].map((item, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                          <Box sx={{ 
                            p: 2, 
                            backgroundColor: 'action.hover',
                            borderRadius: 2
                          }}>
                            <Typography variant="caption" color="text.secondary">
                              {item.label}
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {item.value}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
  
                  {/* Address Section */}
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ 
                      mb: 2, 
                      fontWeight: 600,
                      color: 'text.primary'
                    }}>
                      Address
                    </Typography>
                    <Box sx={{ 
                      p: 2, 
                      backgroundColor: 'action.hover',
                      borderRadius: 2
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {[
                          user?.address?.BldgNameTower,
                          user?.address?.LotBlockPhaseHouseNo,
                          user?.address?.SubdivisionVillageZone,
                          user?.address?.Street,
                          user?.address?.District,
                          user?.address?.barangay === 'Others' ? user?.address?.customBarangay : user?.address?.barangay,
                          user?.address?.city === 'Others' ? user?.address?.customCity : user?.address?.city
                        ].filter(Boolean).join(', ') || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
  
                  {/* Ministries Section */}
                  <Box>
                    <Typography variant="h6" sx={{ 
                      mb: 2, 
                      fontWeight: 600,
                      color: 'text.primary'
                    }}>
                      Ministries
                    </Typography>
  
                    {user?.ministryRoles?.length > 0 ? (
                      <Grid container spacing={2}>
                        {user.ministryRoles.map((roleItem, index) => (
                          <Grid item xs={12} sm={6} key={index}>
                            <Card sx={{ 
                              p: 2, 
                              borderRadius: 2,
                              borderLeft: '4px solid',
                              borderLeftColor: 'success.main'
                            }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {roleItem?.ministry.name || 'Unknown Ministry'}
                              </Typography>
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="body2">
                                  {roleItem?.role === 'Others' ? roleItem?.customRole : roleItem?.role}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    <Box component="span" sx={{ fontWeight: 500 }}>From:</Box> {roleItem?.startYear || 'N/A'}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    <Box component="span" sx={{ fontWeight: 500 }}>To:</Box> {roleItem?.endYear || 'Present'}
                                  </Typography>
                                </Box>
                              </Box>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Box sx={{ 
                        p: 3, 
                        textAlign: 'center',
                        backgroundColor: 'action.hover',
                        borderRadius: 2
                      }}>
                        <Typography variant="body2" color="text.secondary">
                          You're not currently involved in any ministries
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Fragment>
      </div>
    </div>
  );
};

export default Profile;


// import React, { Fragment } from 'react';
// import { Link } from 'react-router-dom';
// import Loader from '../Layout/Loader';
// import MetaData from '../Layout/MetaData';
// import { useSelector } from 'react-redux';
// import '../Layout/styles/style.css'; // Custom CSS for exact layout

// const Profile = () => {
//   const { user, loading } = useSelector((state) => state.auth);

//   console.log('user', user?.ministryCategory); // Check that "user" exists and is populated

//   return (
//     <Fragment>
//       {loading ? (
//         <Loader />
//       ) : (
//         <Fragment>
//           <MetaData title={'Profile'} />

//           <div className="profile-container">
//             {/* Left Side */}
//             <div className="profile-left">
//               <figure className="profile-avatar">
//                 <img
//                   src={user?.avatar?.url || '/default-avatar.png'}
//                   alt={user?.name || 'User Avatar'}
//                 />
//               </figure>
//               <p className="profile-joined">
//                 <strong>Joined</strong>
//                 <br />
//                 <span>{String(user?.createdAt).substring(0, 10)}</span>
//               </p>

//               {/* Buttons */}
//               <div className="profile-buttons">
//                 <Link to="/me/update" className="btn-profile">
//                   Edit Profile
//                 </Link>
//                 <Link to="/password/update" className="btn-profile">
//                   Change Password
//                 </Link>
//                 <Link to="/user/SubmittedFormsNavigation" className="btn-profile">
//                   View Forms
//                 </Link>
//                 <Link to="/user/SubmittedPrayerWallList" className="btn-profile">
//                   Prayer Wall
//                 </Link>
//                 <Link to="/feedback-form" className="btn-profile">
//                   Feedback Form
//                 </Link>
//               </div>
//             </div>

//             {/* Right Side */}
//             <div className="profile-right">
//               <h2 className="profile-greeting">
//                 Hello, {user?.name?.split(' ')[0]}!
//               </h2>

//               <div className="profile-details">
//                 <p>
//                   <strong>Name:</strong> {user?.name}
//                 </p>
//                 <p>
//                   <strong>Address:</strong>{' '}
//                   {user?.barangay || 'N/A'}, {user?.city || 'N/A'},{' '}
//                   {user?.country || 'N/A'}
//                 </p>
//                 <p>
//                   <strong>Age:</strong> {user?.age || 'N/A'}
//                 </p>
//                 <p>
//                   <strong>Gender:</strong> {user?.preference || 'N/A'}
//                 </p>
//                 <p>
//                   <strong>Phone:</strong> {user?.phone || 'N/A'}
//                 </p>
//                 <p>
//                   <strong>Email:</strong> {user?.email || 'N/A'}
//                 </p>

//                 {/* Display Ministry Categories */}
//                 <p>
//                   <strong>Ministry:</strong>{' '}
//                   {user?.ministryCategory && user?.ministryCategory.length > 0 ? (
//                     <ul>
//                       {user.ministryCategory.map((category) => (
//                         <li key={category?._id}>{category?.name}</li>
//                       ))}
//                     </ul>
//                   ) : (
//                     'N/A'
//                   )}
//                 </p>
//                 <p><strong>Ministry:</strong> {JSON.stringify(user?.ministryCategory)}</p>
//               </div>
//             </div>
//           </div>
//         </Fragment>
//       )}
//     </Fragment>
//   );
// };

// export default Profile;