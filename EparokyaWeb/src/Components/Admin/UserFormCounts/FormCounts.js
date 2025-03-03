import React, { useEffect, useState } from "react";
import axios from "axios";

const UserFormCounts = () => {
    const [userForms, setUserForms] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/formCounts/user`, { withCredentials: true });
                setUserForms(response.data);
            } catch (error) {
                console.error("Error fetching user form counts:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2>User Form Submissions</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Wedding</th>
                        <th>Baptism</th>
                        <th>Counseling</th>
                        <th>House Blessing</th>
                    </tr>
                </thead>
                <tbody>
                    {userForms.map((user) => (
                        <tr key={user.userId}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.wedding}</td>
                            <td>{user.baptism}</td>
                            <td>{user.counseling}</td>
                            <td>{user.houseBlessing}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserFormCounts;
