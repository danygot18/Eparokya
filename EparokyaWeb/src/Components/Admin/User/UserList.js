import React, { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Table, Button, Form } from 'react-bootstrap';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import MetaData from '../../Layout/MetaData';
import Loader from '../../Layout/Loader';
import SideBar from '../SideBar';
import axios from 'axios';
import { getToken, successMsg, errMsg } from '../../../Utils/helpers';

const UsersList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [isDeleted, setIsDeleted] = useState('');
  const [search, setSearch] = useState('');
  const [ministryCategories, setMinistryCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const config = {
    withCredentials: true,
  };

  const listUsers = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/users?search=${search}&ministry=${selectedCategory}`, 
        config
      );
      console.log("Fetched users:", data.users);
      setAllUsers(Array.isArray(data.users) ? data.users : []);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data.message || 'Failed to load users');
      setAllUsers([]);
    }
  };

  const fetchMinistryCategories = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/ministryCategory/getAllMinistryCategories`,
        config
      );
      setMinistryCategories(data.ministryCategories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setMinistryCategories([]);
    }
  };

  useEffect(() => {
    listUsers();
    fetchMinistryCategories();

    if (error) {
      errMsg(error);
      setError('');
    }

    if (isDeleted) {
      successMsg('User deleted successfully');
      navigate('/admin/users');
    }
  }, [error, isDeleted, search, selectedCategory]);

  const deleteUser = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/admin/user/${id}`,
        config
      );
      setIsDeleted(data.success);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data.message || 'Failed to delete user');
    }
  };

  useEffect(() => {
    listUsers();
  }, [error, isDeleted, search, selectedCategory]);

  useEffect(() => {
    fetchMinistryCategories();
  }, []);

  const deleteUserHandler = (id) => {
    deleteUser(id);
  };

  return (
    <Fragment>
      <MetaData title={'All Users'} />
      <div className="row">
        <div className="col-12 col-md-2">
          <SideBar />
        </div>

        <div className="col-12 col-md-10">
          <Fragment>
            <h1 className="my-5">All Users</h1>

            <Form className="mb-3">
              <Form.Group controlId="search">
                <Form.Control
                  type="text"
                  placeholder="Search by name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Form.Group>
            </Form>

            <Form className="mb-3">
              <Form.Group controlId="category">
                <Form.Label>Filter by Ministry Category:</Form.Label>
                <Form.Control as="select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                  <option value="">All Categories</option>
                  {ministryCategories.length === 0 ? (
                    <option disabled>No categories available</option>
                  ) : (
                    ministryCategories.map((category, index) => {
                      return (
                        <option key={category._id || index} value={category._id}>
                          {category.name || "Unnamed Category"}
                        </option>
                      );
                    })
                  )}
                </Form.Control>
              </Form.Group>
            </Form>

            {loading ? (
              <Loader />
            ) : (
              <Table bordered striped hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Ministry Categories</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(allUsers) && allUsers.length > 0 ? (
                    allUsers.map((user) => (
                      <tr key={user._id}>
                        <td>{user._id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          {Array.isArray(user.ministryRoles) && user.ministryRoles.length > 0
                            ? user.ministryRoles
                                .map((role) => role.ministry?.name || "Unknown")
                                .join(', ')
                            : "No Ministry"}
                        </td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>
                          <Link to={`/admin/user/${user._id}`} className="btn btn-primary btn-sm">
                            <FaEdit />
                          </Link>
                          <Button variant="danger" size="sm" onClick={() => deleteUser(user._id)}>
                            <FaTrashAlt />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">No users found</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            )}
          </Fragment>
        </div>
      </div>
    </Fragment>
  );
};

export default UsersList;
