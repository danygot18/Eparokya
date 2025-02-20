import logo from './logo.svg';
import './App.css';
import { Home } from './Components/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Layout/Header';
import TermsModal from './Components/TermsModal';
import TermsAndConditionText from './Components/TermsAndConditionText';


import React, { useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


// User Routes
import { Login } from './Components/User/Login'
import Register from './Components/User/Register'
import Profile from './Components/User/Profile';
import UserCalendar from './Components/User/UserCalendar';
import NavigationForms from './Components/User/NavigationForms';

// User Forms

import ResourcePage from './Components/ResourcePage';
import WeddingWall from './Components/WeddingWall/WeddingWall';
import ParishPriest from './Components/ParishInformation/ParishPriests';

import SubmittedForms from './Components/User/Forms/SubmittedFormsNavigation';
import UserFormGuides from './Components/User/UserFormGuides';

import BaptismForm from './Components/User/Forms/PrivateForms/Baptism/BaptismForm';
import FuneralForm from './Components/User/Forms/PrivateForms/Funeral/FuneralForm';
import WeddingForm from './Components/User/Forms/PrivateForms/Wedding/WeddingForm';

import CounselingForm from './Components/User/Forms/PrivateForms/Counseling/CounselingForm';
import PrayerRequestForm from './Components/User/Forms/PrivateForms/Prayer/PrayerRequestForm';
import HouseBlessingForm from './Components/User/Forms/PrivateForms/PrivateSchedule/HouseBlessingForm';

import MySubmittedWeddingForm from './Components/User/Forms/PrivateForms/Wedding/MySubmittedWeddingForm';
import SubmittedWeddingList from './Components/User/Forms/PrivateForms/Wedding/SubmittedWeddingList';
// import UserWeddingChecklist from './Components/User/Forms/PrivateForms/Wedding/UserWeddingChecklist';

import MySubmittedBaptismForm from './Components/User/Forms/PrivateForms/Baptism/MySubmittedBaptismForm';
import SubmittedBaptismList from './Components/User/Forms/PrivateForms/Baptism/SubmittedBaptismList';
import UserBaptismChecklist from './Components/User/Forms/PrivateForms/Baptism/UserBaptismChecklist';

import MySubmittedFuneralForm from './Components/User/Forms/PrivateForms/Funeral/MySubmittedFuneralForm';
import SubmittedFuneralList from './Components/User/Forms/PrivateForms/Funeral/SubmittedFuneralList';

import MySubmittedCounselingForm from './Components/User/Forms/PrivateForms/Counseling/MySubmittedCounselingForm';
import SubmittedCounselingList from './Components/User/Forms/PrivateForms/Counseling/SubmittedCounselingList';

import MySubmittedHouseBlessingForm from './Components/User/Forms/PrivateForms/PrivateSchedule/MySubmittedHouseBlessingForm';
import SubmittedHouseBlessingList from './Components/User/Forms/PrivateForms/PrivateSchedule/SubmittedHouseBlessingList';

// import MySubmittedPrayerRequestForm from './Components/User/Forms/PrivateForms/Prayer/MySubmittedPrayerRequestForm';
// import SubmittedPrayerRequestList from './Components/User/Forms/PrivateForms/Prayer/SubmittedPrayerRequestList';

// import MySubmittedPrayerWallForm from './Components/User/Forms/PrivateForms/Prayer/MySubmittedPrayerWallForm';
import SubmittedPrayerWallList from './Components/User/PrayerWall/SubmittedPrayerWallList';


// User Navigations
import PrayerWall from './Components/User/PrayerWall/PrayerWall';
import PrayerRequestIntention from './Components/User/PrayerWall/PrayerRequestIntention';
import AnnouncementDetails from './Components/AnnouncementDetails';


import ProtectedRoute from './Components/Route/protectedRoute';

// Admin Routes
//Dashboard
import Dashboard from './Components/Admin/Dashboard';

//User
import UsersList from './Components/Admin/User/UserList';
import UpdateUser from './Components/Admin/User/UserUpdate';


// Members
import MemberBatchYear from './Components/Admin/Members/MemberBatchYear';

//Calendar
import Calendar from './Components/Admin/Calendar/Calendar';
import MinistryCalendar from './Components/User/MinistryCalendar';

import AdminDate from './Components/Admin/AdminDate';
import AddEvent from './Components/Admin/Calendar/AddEvent';

//Post
import CreatePost from './Components/Admin/Post/Post';
import PostLists from './Components/Admin/Post/PostLists';
import PostUpdate from './Components/Admin/Post/PostUpdate';

import EventPost from './Components/Admin/EventPost/EventPostCreate';
import EventPostLists from './Components/Admin/EventPost/EventPostList';
import EventPostUpdate from './Components/Admin/EventPost/UpdateEventPost';

// Announcement
import AnnouncementCategory from './Components/Admin/Announcement/CreateAnnouncementCategory';
import Announcement from './Components/Admin/Announcement/CreateAnnouncement';
import AnnouncementList from './Components/Admin/Announcement/AnnouncementList';

// resource
import Resource from './Components/Admin/Resources/Resource';
import ResourceList from './Components/Admin/Resources/ResourceList';

// Priest
import CreatePriest from './Components/Admin/Priest/CreatePriest';
import PriestList from './Components/Admin/Priest/PriestList';

// Prayer
import AdminPrayerReview from './Components/Admin/Prayers/AdminPrayerReview';
import PrayerIntentionsList from './Components/Admin/Prayers/prayerRequestIntentionList';
import PrayerIntentionDetails from './Components/Admin/Prayers/prayerRequestIntentionDetails';

// Private Forms
import WeddingList from './Components/Admin/Wedding/WeddingList';
import WeddingDetails from './Components/Admin/Wedding/WeddingDetails';
import WeddingChecklist from './Components/Admin/Wedding/WeddingChecklist';

import BaptismList from './Components/Admin/Baptism/BaptismList';
import BaptismDetails from './Components/Admin/Baptism/BapstismDetails';
import BaptismChecklist from './Components/Admin/Baptism/BaptismChecklist';


import FuneralList from './Components/Admin/Funeral/FuneralList';
import FuneralDetails from './Components/Admin/Funeral/FuneralDetails';

import CounselingList from './Components/Admin/Counseling/CounselingList';
import PrayerRequestList from './Components/Admin/Prayers/prayerRequestList';
import HouseBlessingList from './Components/Admin/PrivateSchedule/houseBlessingList';

import CounselingDetails from './Components/Admin/Counseling/CounselingDetails';
import HouseBlessingDetails from './Components/Admin/PrivateSchedule/HouseBlessingDetails';


//Admin
import MinistryCategory from './Components/Admin/Ministries/CreateMinistryCategory';
import MinistryCategoryDetails from './Components/Admin/Ministries/MinistryCategoryDetails';

import ResourceCategory from './Components/Admin/Resources/ResourceCategory';


//Guest View
import { Prayers } from './Components/Guest/Prayers';
import { Events } from './Components/Guest/Events';
import { Sermons } from './Components/Guest/Sermons';

//User Chat
import ChatList from "./Components/Chat/ChatList";
import Chat from "./Components/Chat/Chat";
import ChatSidebar from "./Components/Chat/ChatSideBar";

//Admin Chat
import AdminChat from './Components/Admin/AdminChat';

import { socket } from "./socket";
import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';

//Live Video
import AdminLive from './Components/Admin/AdminLive';
import UserLive from './Components/UserLive';


function App() {
  const { user } = useSelector(state => state.auth);

  useEffect(() => {

    if (user) {

      socket.connect();
      socket.emit("join", { userId: user._id });
    }

  }, [user]);


  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} exact="true" />
        <Route path="/login" element={<Login />} exact="true" />
        <Route path="/register" element={<Register />} exact="true" />
        <Route path="/profile" element={<Profile />} exact="true" />
        <Route path="/announcementDetails/:id" element={<AnnouncementDetails />} exact="true" />

        <Route path="/resourcePage" element={<ResourcePage />} exact="true" />
        <Route path="/weddingWall" element={<WeddingWall />} exact="true" />
        <Route path="/parishPriests" element={<ParishPriest />} exact="true" />

        <Route path="/user/calendar" element={<UserCalendar />} exact="true" />
        <Route path="/user/ministryCalendar" element={<MinistryCalendar />} exact="true" />
        <Route path="/user/NavigationForms" element={<NavigationForms />} exact="true" />

        <Route path="/user/SubmittedFormsNavigation" element={<SubmittedForms />} exact="true" />
        <Route path="/user/FormGuides" element={<UserFormGuides />} exact="true" />

        <Route path="/user/baptismForm" element={<BaptismForm />} exact="true" />
        <Route path="/user/funeralForm" element={<FuneralForm />} exact="true" />
        <Route path="/user/weddingForm" element={<WeddingForm />} exact="true" />
        <Route path="/user/counselingForm" element={<CounselingForm />} exact="true" />
        <Route path="/user/prayerRequest" element={<PrayerRequestForm />} exact="true" />
        <Route path="/user/houseBlessingForm" element={<HouseBlessingForm />} exact="true" />

        <Route path="/user/mySubmittedWeddingForm/:formId" element={<MySubmittedWeddingForm />} exact="true" />
        <Route path="/user/mySubmittedBaptismForm/:formId" element={<MySubmittedBaptismForm />} exact="true" />
        <Route path="/user/mySubmittedFuneralForm/:formId" element={<MySubmittedFuneralForm />} exact="true" />
        <Route path="/user/mySubmittedCounselingForm/:formId" element={<MySubmittedCounselingForm />} exact="true" />
        <Route path="/user/mySubmittedHouseBlessingForm/:formId" element={<MySubmittedHouseBlessingForm />} exact="true" />


        {/* 
        <Route path="/user/mySubmittedCounselingForm/:formId" element={<MySubmittedCounselingForm />} exact="true" />
        <Route path="/user/mySubmittedPrayerRequestForm/:formId" element={<MySubmittedPrayerRequestForm />} exact="true" />
        <Route path="/user/mySubmittedPrayerWallForm/:formId" element={<MySubmittedPrayerWallForm />} exact="true" /> */}

        <Route path="/user/SubmittedWeddingList" element={<SubmittedWeddingList />} exact="true" />
        <Route path="/user/SubmittedBaptismList" element={<SubmittedBaptismList />} exact="true" />
        <Route path="/user/SubmittedFuneralList" element={<SubmittedFuneralList />} exact="true" />
        <Route path="/user/SubmittedCounselingList" element={<SubmittedCounselingList />} exact="true" />
        <Route path="/user/SubmittedHouseBlessingList" element={<SubmittedHouseBlessingList />} exact="true" />
        <Route path="/user/SubmittedPrayerWallList" element={<SubmittedPrayerWallList />} exact="true" />

        {/*
        <Route path="/user/SubmittedCounselingList" element={<SubmittedCounselingList />} exact="true" />
        <Route path="/user/SubmittedPrayerRequestList" element={<SubmittedPrayerRequestList />} exact="true" />
        */}

        <Route path="/user/UserBaptismChecklist" element={<UserBaptismChecklist />} exact="true" />
        {/* <Route path="/user/UserWeddingChecklist" element={<UserWeddingCheklist />} exact="true" /> */}

        <Route path="/user/prayerWall" element={<PrayerWall />} exact="true" />
        <Route path="/user/prayerRequestIntention" element={<PrayerRequestIntention />} exact="true" />

        {/* Admin 
        need mo itago yung dashboard from the user*/}
        <Route path="/admin/dashboard" element={<ProtectedRoute isAdmin={true}> <Dashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute isAdmin={true}><UsersList /></ProtectedRoute>} />
        <Route path="/admin/user/:id" element={<ProtectedRoute isAdmin={true}><UpdateUser /></ProtectedRoute>} />

        {/* calendar */}
        <Route path="/admin/calendar" element={<ProtectedRoute isAdmin={true}><Calendar /></ProtectedRoute>} />
        {/* ministry */}
        <Route path="/admin/ministryCategory/create" element={<ProtectedRoute isAdmin={true}><MinistryCategory /></ProtectedRoute>} />
        <Route path="/admin/ministryCategoryDetails/:id" element={<ProtectedRoute isAdmin={true}><MinistryCategoryDetails /></ProtectedRoute>} />

        <Route path="/admin/prayerReview" element={<ProtectedRoute isAdmin={true}><AdminPrayerReview /></ProtectedRoute>} />


        {/* announcement - update */}
        <Route path="/admin/announcementCategory/create" element={<ProtectedRoute isAdmin={true}><AnnouncementCategory /></ProtectedRoute>} />
        <Route path="/admin/resourceCategory/create" element={<ProtectedRoute isAdmin={true}><ResourceCategory /></ProtectedRoute>} />
        <Route path="/admin/create/announcement" element={<ProtectedRoute isAdmin={true}><Announcement /></ProtectedRoute>} />
        <Route path="/admin/announcementList" element={<ProtectedRoute isAdmin={true}><AnnouncementList /></ProtectedRoute>} />

        {/* Members */}
        <Route path="/admin/memberBatchYear" element={<ProtectedRoute isAdmin={true}><MemberBatchYear /></ProtectedRoute>} />

        {/* Resource */}
        <Route path="/admin/resource/create" element={<ProtectedRoute isAdmin={true}><Resource /></ProtectedRoute>} />
        <Route path="/admin/resourceList" element={<ProtectedRoute isAdmin={true}><ResourceList /></ProtectedRoute>} />

        {/* Priest */}
        <Route path="/admin/create/priest" element={<ProtectedRoute isAdmin={true}><CreatePriest /></ProtectedRoute>} />
        <Route path="/admin/priestList" element={<ProtectedRoute isAdmin={true}><PriestList /></ProtectedRoute>} />

        {/* counseling */}
        <Route path="/admin/counselingList" element={<ProtectedRoute isAdmin={true}><CounselingList /></ProtectedRoute>} />
        <Route path="/admin/counselingDetails/:counselingId" element={<ProtectedRoute isAdmin={true}><CounselingDetails /></ProtectedRoute>} />

        {/* prayer */}
        <Route path="/admin/prayerRequestList" element={<ProtectedRoute isAdmin={true}><PrayerRequestList /></ProtectedRoute>} />
        <Route path="/admin/prayerIntentionList" element={<ProtectedRoute isAdmin={true}><PrayerIntentionsList /></ProtectedRoute>} />
        <Route path="/admin/prayerIntention/details/:prayerIntentionId" element={<ProtectedRoute isAdmin={true}><PrayerIntentionDetails /></ProtectedRoute>} />

        {/* Private Scheduling */}
        <Route path="/admin/houseBlessingList" element={<ProtectedRoute isAdmin={true}><HouseBlessingList /></ProtectedRoute>} />
        <Route path="/admin/houseBlessingDetails/:blessingId" element={<ProtectedRoute isAdmin={true}><HouseBlessingDetails /></ProtectedRoute>} />

        {/* Post */}
        <Route path="/admin/post/create" element={<ProtectedRoute isAdmin={true}><CreatePost /></ProtectedRoute>} />
        <Route path="/admin/postlist" element={<ProtectedRoute isAdmin={true}><PostLists /></ProtectedRoute>} />
        <Route path="/admin/post/:id" element={<ProtectedRoute isAdmin={true}><PostUpdate /></ProtectedRoute>} />

        {/* Event Post */}
        <Route path="/admin/eventpost/create" element={<ProtectedRoute isAdmin={true}><EventPost /></ProtectedRoute>} />
        <Route path="/admin/eventpostlist" element={<ProtectedRoute isAdmin={true}><EventPostLists /></ProtectedRoute>} />
        <Route path="/admin/editevent/:id" element={<ProtectedRoute isAdmin={true}><EventPostUpdate /></ProtectedRoute>} />

        <Route path="/admin/adminDate" element={<ProtectedRoute isAdmin={true}><AdminDate /></ProtectedRoute>} />
        <Route path="/admin/addEvent" element={<ProtectedRoute isAdmin={true}><AddEvent /></ProtectedRoute>} />

        <Route path="/admin/weddingList" element={<ProtectedRoute isAdmin={true}><WeddingList /></ProtectedRoute>} />
        <Route path="/admin/baptismList" element={<ProtectedRoute isAdmin={true}><BaptismList /></ProtectedRoute>} />
        <Route path="/admin/funeralList" element={<ProtectedRoute isAdmin={true}><FuneralList /></ProtectedRoute>} />

        <Route path="/admin/weddingDetails/:weddingId" element={<ProtectedRoute isAdmin={true}><WeddingDetails /></ProtectedRoute>} />
        <Route path="/admin/baptismDetails/:baptismId" element={<ProtectedRoute isAdmin={true}><BaptismDetails /></ProtectedRoute>} />
        <Route path="/admin/funeralDetails/:funeralId" element={<ProtectedRoute isAdmin={true}><FuneralDetails /></ProtectedRoute>} />

        <Route path="/admin/weddingChecklist/:weddingId" element={<ProtectedRoute isAdmin={true}><WeddingChecklist /></ProtectedRoute>} />
        <Route path="/admin/baptismChecklist/:baptismId" element={<ProtectedRoute isAdmin={true}><BaptismChecklist /></ProtectedRoute>} />


        {/* Guest View */}
        <Route path="/prayers" element={<Prayers />} exact="true" />
        <Route path="/sermons" element={<Sermons />} exact="true" />
        <Route path="/Events" element={<Events />} exact="true" />
        {/* <Route path="/chatlist" element={<ChatList />} exact="true" /> */}

        {/* Chat */}
        <Route path="/chatlist" element={<ChatList />} exact="true" />
        {/* <Route path="/chat/:chat" element={<Chat />} exact="true" /> */}
        <Route path="/chat/:chat/:email" element={<Chat />} />
        <Route path="/ChatSidebar" element={<ChatSidebar />} exact="true" />

        {/* Admin Chat */}
        <Route path="/adminChat/:chat/:email" element={<AdminChat />} exact="true" />

        {/* Terms and Condition */}
        {/* Prayer */}

        {/* Live */}
        <Route path="/admin/live" element={<ProtectedRoute isAdmin={true}><AdminLive /></ProtectedRoute>} />
        <Route path="/user/live" element={<UserLive />} />

      </Routes>
    </Router>
  );
}

export default App;