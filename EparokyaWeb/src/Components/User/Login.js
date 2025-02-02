import React, { Fragment, useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { authenticate } from '../../Utils/helpers'
import Loader from '../Layout/Loader'
import Metadata from '../Layout/MetaData'

import { useDispatch, useSelector } from 'react-redux'
import { login, clearErrors } from '../../Redux/actions/userActions'

export const Login = () => {
    const dispatch = useDispatch()
    const { isAuthenticated, error, loading, user } = useSelector(state => state.auth)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    let location = useLocation();
    const redirect = location.search ? new URLSearchParams(location.search).get('redirect') : ''
    const notify = (error) => toast.error(error, {
        position: toast.POSITION.BOTTOM_RIGHT
    });

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login(email, password))
        console.log(user)
       
    }

    useEffect(() => {
        if (isAuthenticated && redirect === 'shipping') {
            navigate(`/${redirect}`)
        }
        else if (isAuthenticated)
            navigate('/')
        if (error) {
            // alert.error(error);
            console.log(error)
            notify(error)
            dispatch(clearErrors());
        }
    }, [error, isAuthenticated, dispatch, navigate, redirect])

    return (
        <div style={styles.container}>
        <ToastContainer />
        <div style={styles.loginBox}>
            <h2 className="mb-4">Login</h2>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email:</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={styles.input}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                </Form.Group>

                <Form.Group controlId="formBasicCheckbox" style={styles.checkboxGroup}>
                    <Form.Check type="checkbox" label="Remember Me" />
                </Form.Group>

                <Form.Group>
                    <Link to="" style={styles.forgotPasswordLink}>
                        Forgot Password?
                    </Link>
                </Form.Group>

                <Button
                    variant="dark"
                    className="mt-4 btn-block py-2 px-4"
                    type="submit"
                > Login
                </Button>

                <div style={styles.registerContainer}>
                        <span>Don't have an account? </span>
                        <Link to="/register" style={styles.registerLink}>
                            Sign Up
                        </Link>
                    </div>

            </Form>
        </div>
    </div>
    )
}


const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'left',
        height: '800vh',
        backgroundColor: '#e9ecef',
    },
    loginBox: {
        backgroundColor: '#ffffff',
        padding: '60px 40px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        width: '400px',
        height: '500px',
        textAlign: 'center',
    },
    input: {
        padding: '12px',
        marginLeft: '9px',
        marginTop: '2px',
        marginBottom: '20px',
        borderRadius: '8px',
        border: '1px solid #ced4da',
    },
    checkboxGroup: {
        textAlign: 'left',
        marginBottom: '15px',
    },
    forgotPasswordLink: {
        color: '#007bff',
        float: 'right',
        textDecoration: 'none',
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#343a40',
        border: 'none',
        borderRadius: '8px',
    },
    registerContainer: {
        marginTop: '25px',
        textAlign: 'center',
    },
    registerLink: {
        color: '#007bff',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
};