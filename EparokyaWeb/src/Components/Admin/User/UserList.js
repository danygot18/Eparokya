import React, { useEffect, useState } from 'react';
import { Table, Form } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import MetaData from '../../Layout/MetaData';
import Loader from '../../Layout/Loader';
import SideBar from '../SideBar';
import axios from 'axios';
import { successMsg, errMsg } from '../../../Utils/helpers';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress, Button } from '@mui/material';

const UsersList = () => {
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [ministryCategories, setMinistryCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const navigate = useNavigate();

  const config = { withCredentials: true };

  const listUsers = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/users?search=${search}&ministry=${selectedCategory}`,
        config
      );
      setAllUsers(data.users || []);
      console.log(data.users)
      setLoading(false);
    } catch (error) {
      errMsg(error.response?.data.message || 'Failed to load users');
    }
  };

  const fetchMinistryCategories = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/ministryCategory/getAllMinistryCategories`,
        config
      );
      setMinistryCategories(data.categories || []);
    } catch (error) {
      errMsg('Failed to fetch categories');
    }
  };

  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  const deleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setDeleteLoading(true);
      await axios.delete(`${process.env.REACT_APP_API}/api/v1/admin/user/${userToDelete._id}`, config);
      successMsg("User deleted successfully");
      listUsers(); // Refresh the user list
    } catch (error) {
      errMsg(error.response?.data.message || "Failed to delete user");
    } finally {
      setDeleteLoading(false);
      handleCloseDeleteDialog();
    }
  };

  useEffect(() => {
    listUsers();
    fetchMinistryCategories();
  }, [search, selectedCategory]);

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase()) 
  );

  return (
    <div>
      <MetaData title="All Users" />

      {/* Flexbox Layout to Align Sidebar & User List Side by Side */}
      <div className="d-flex">

        {/* Sidebar: Fixed width, full height */}
        <div className="bg-light" 
        style={{ width: '250px' }}
        >
          <SideBar />
        </div>

        {/* User List: Takes Remaining Space */}
        <div className="flex-grow-1 p-4">
          <h1 className="mb-4">All Users</h1>

          {/* Search Input */}
          <Form className="mb-3">
            <Form.Group controlId="search">
              <Form.Control
                type="text"
                placeholder="Search by Name or Email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}  
              />
            </Form.Group>
          </Form>

          {/* Category Filter */}
          <Form className="mb-3">
            <Form.Group controlId="category">
              <Form.Label>Filter by Ministry Category:</Form.Label>
              <Form.Control
                as="select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {ministryCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name || "Unnamed Category"}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>

          {/* Users Table */}
          {loading ? (
            <Loader />
          ) : (
            <Table bordered striped hover responsive>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Priest</th>
                  <th>Ministry Categories</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.length > 0 ? (
                  allUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                      <td>{user.isPriest ? 'Father' : 'No'}</td>
                      <td>
                        {user.ministryRoles?.map((role) => role.ministry?.name || "Unknown").join(', ') || "No Ministry"}
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Button
                          color="primary"
                          className="btn-sm mx-1"
                          onClick={() => navigate(`/admin/user/${user._id}`)}
                        >
                          <FaEdit variant="primary"/>
                        </Button>
                        <Button
                          color="error" 
                          className="btn-sm mx-1"
                          onClick={() => handleOpenDeleteDialog(user)}
                        >
                          <FaTrashAlt />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">No users found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete User Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete user <strong>{userToDelete?.name}</strong> ({userToDelete?.email})?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button 
            onClick={deleteUser} 
            color="error" 
            autoFocus
            disabled={deleteLoading}
            
          >
            {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UsersList;