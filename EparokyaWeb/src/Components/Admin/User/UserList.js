import React, { Fragment, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Table, Button } from 'react-bootstrap'; // Bootstrap Table and Button
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Icons from react-icons
import MetaData from '../../Layout/MetaData';
import Loader from '../../Layout/Loader';
import SideBar from '../SideBar';
import axios from 'axios';
import { getToken, successMsg, errMsg } from '../../../Utils/helpers'

const UsersList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [isDeleted, setIsDeleted] = useState('');
  const navigate = useNavigate();

  const config = {
    withCredentials: true
    // headers: {
    //   'Content-Type': 'application/json',
    //   Authorization: `Bearer ${getToken()}`,
    // },
  };

  const listUsers = async () => {
 
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/admin/users`,
        config
      );
      setAllUsers(data.users);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data.message || 'Failed to load users');
    }
  };

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

    if (error) {
      errMsg(error);
      setError('');
    }

    if (isDeleted) {
      successMsg('User deleted successfully');
      navigate('/admin/users');
    }
  }, [error, isDeleted]);

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

            {loading ? (
              <Loader />
            ) : (
              <Table bordered striped hover responsive className="table-sm">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user._id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.isAdmin ? 'Admin' : 'User'}</td> {/* Check if isAdmin is true */}
                      <td>
                        <Link
                          to={`/admin/user/${user._id}`}
                          className="btn btn-primary btn-sm mr-2"
                        >
                          <FaEdit />
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          className="ml-2"
                          onClick={() => deleteUserHandler(user._id)}
                        >
                          <FaTrashAlt />
                        </Button>
                      </td>
                    </tr>
                  ))}
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
