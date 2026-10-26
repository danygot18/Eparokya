# 🕊️ St. Joseph Church Management System

A comprehensive church management system built for **St. Joseph Church**, designed to modernize church administration and improve engagement between the church and its members.

The system allows users to **book appointments**, **chat in real time**, **track inventory**, and **analyze sentiment** — all while giving the admin a **powerful dashboard** to oversee operations. A **mobile version (React Native)** is also available for easy access on the go.

---

## ✨ Key Features

### 📝 Form & Appointment Management

* Users can submit and schedule forms for:

  * **Wedding**
  * **Baptism**
  * **Funeral**
  * Other church-related services
* Admins can **approve, decline, or reschedule** requests.
* Users receive status updates and notifications.

### 🗓️ Calendar Integration

* Displays all approved appointments directly on a calendar.
* Admin can view upcoming events and manage booking conflicts.
* Users can check available dates for scheduling.

### 💬 Real-Time Chat (Socket.IO)

* Live messaging between **admins** and **users**.
* Built using **Socket.IO** for instant communication.

### 📦 Inventory Management

* Manage and track church-owned items (e.g., chairs, speakers, tents, etc.).
* Admin can **approve borrowing requests** from members.
* Real-time item availability and return tracking.

### 📊 Sentiment & Experience Analysis

* Analyze feedback from church members.
* Displays metrics and visual charts on the dashboard.
* Helps the church improve its services and member satisfaction.

### 📰 Announcements & Posting

* Admins can post news, announcements, and upcoming events.
* Supports image uploads and categorized posts.
* Visible on both the **web** and **mobile app**.

---

## 📱 Mobile App (React Native)

* Built using **React Native** for Android and iOS.
* Includes:

  * Login and registration
  * Chat feature with admin
  * Form submission and status tracking
  * Calendar view for confirmed events
* Real-time synchronization with the web backend.

---

## 🖥️ Role-Based Dashboard

### 👤 Admin Dashboard

* Overview of forms, chat messages, and inventory.
* Graphs and analytics of sentiment and user activity.
* Access to post creation, calendar management, and member control.

### 🙋‍♂️ User Dashboard

* Track submitted forms and upcoming events.
* Access chat, announcements, and feedback submission.

---

## 🛠️ Tech Stack

**Frontend (Web):**

* React.js
* MUI - Material
* Socket.IO client
* React Toastify for notifications

**Mobile:**

* React Native (Expo)
* Axios for API communication
* SyncStorage for session and token management

**Backend:**
- Node.js + Express.js (for server and API handling)
- Socket.IO (for real-time chat)
- MongoDB (database)
- Cloudinary (for image and file uploads)

---


## 📈 Future Enhancements

* Push notifications for message and form updates
* Security
* Enhance web responsiveness for better performance on all devices

## 👥 Contributors
- [Dan Russell](https://github.com/danygot18)
- [Bea Clarisse](https://github.com/clarisseeal)

## 🙏 Acknowledgements

* **St. Joseph Church** for inspiration
* **TUP Taguig** – project guidance

