import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../Layout/Loader';
import MetaData from '../Layout/MetaData';
import { useSelector } from 'react-redux';
import '../Layout/styles/style.css'; // Custom CSS for exact layout
import axios from 'axios';

const Profile = () => {
  const { user: reduxUser, loading } = useSelector((state) => state.auth);
  const [user, setUser] = useState(reduxUser);

  console.log('user', user?.ministryCategory); // Check that "user" exists and is populated

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
        console.log('Fetched User Profile:', profileData);
        setUser(profileData.user); // Update the user state with the fetched profile data
      }
    };

    getUserProfile();
  }, []);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={'Profile'} />

          <div className="profile-container">
            {/* Left Side */}
            <div className="profile-left">
              <figure className="profile-avatar">
                <img
                  src={user?.avatar?.url || '/default-avatar.png'}
                  alt={user?.name || 'User Avatar'}
                />
              </figure>
              <p className="profile-joined">
                <strong>Joined</strong>
                <br />
                <span>{String(user?.createdAt).substring(0, 10)}</span>
              </p>

              {/* Buttons */}
              <div className="profile-buttons">
                <Link to="/me/update" className="btn-profile">
                  Edit Profile
                </Link>
                <Link to="/password/update" className="btn-profile">
                  Change Password
                </Link>
                <Link to="/user/SubmittedFormsNavigation" className="btn-profile">
                  View Forms
                </Link>
                <Link to="/user/SubmittedPrayerWallList" className="btn-profile">
                  Prayer Wall
                </Link>
                <Link to="/feedback-form" className="btn-profile">
                  Feedback Form
                </Link>
              </div>
            </div>

            {/* Right Side */}
            <div className="profile-right">
              <h2 className="profile-greeting">
                Hello, {user?.name?.split(' ')[0]}!
              </h2>

              <div className="profile-details">
                <p>
                  <strong>Name:</strong> {user?.name}
                </p>
                <p>
                  <strong>Address:</strong>{' '}
                  {user?.barangay || 'N/A'}, {user?.city || 'N/A'},{' '}
                  {user?.country || 'N/A'}
                </p>
                <p>
                  <strong>Age:</strong> {user?.age || 'N/A'}
                </p>
                <p>
                  <strong>Gender:</strong> {user?.preference || 'N/A'}
                </p>
                <p>
                  <strong>Phone:</strong> {user?.phone || 'N/A'}
                </p>
                <p>
                  <strong>Email:</strong> {user?.email || 'N/A'}
                </p>

                {/* Display Ministry Categories */}
                <p>
                  <strong>Ministry:</strong>{' '}
                  {user?.ministryCategory && user?.ministryCategory.length > 0 ? (
                    <ul>
                      {user.ministryCategory.map((category) => (
                        <li key={category?._id}>{category?.name}</li>
                      ))}
                    </ul>
                  ) : (
                    'N/A'
                  )}
                </p>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
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