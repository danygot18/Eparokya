import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, TextField, Grid, Avatar, Box, List, ListItem, ListItemText, Divider, Container } from '@mui/material';
import axios from 'axios';
import SideBar from '../SideBar';

const MemberDirectory = () => {
    const [users, setUsers] = useState([]);
    const [ministries, setMinistries] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMinistry, setSelectedMinistry] = useState(null);
    const config = {
        withCredentials: true,
    };

    useEffect(() => {
        fetchMinistries();
        fetchUsers();
    }, []);

    // useEffect(() => {
    //     console.log("Updated selectedMinistry:", selectedMinistry);
    // }, [selectedMinistry]);


    const fetchMinistries = async () => {
        try {
            const { data } = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/ministryCategory/getAllMinistryCategories`,
                config 
            );
            // console.log("Fetched ministries data:", data); 
            setMinistries(data.categories || []);
            setMinistries(Array.isArray(data.categories) ? data.categories : []);

        } catch (error) {
            console.error("Error fetching ministries:", error.response?.data || error);
        }
    };

    const fetchUsers = async (ministryCategoryId = null) => {
        try {
            const url = ministryCategoryId
                ? `${process.env.REACT_APP_API}/api/v1/${ministryCategoryId}/getUsers`
                : `${process.env.REACT_APP_API}/api/v1/admin/users`;

            const { data } = await axios.get(url, config); 

            // console.log("Fetched users:", data.users);
            setUsers(Array.isArray(data.users) ? data.users : []);
            setUsers(Array.isArray(data.users) ? data.users : []);

            setFilteredUsers(Array.isArray(data.users) ? data.users : []);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };


    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        filterUsers(value, selectedMinistry);
    };

    const filterUsers = (search, ministry) => {
        let filtered = [...users]; 
    
        if (search) {
            filtered = filtered.filter(user =>
                user?.name?.toLowerCase().includes(search) ||
                user?.phone?.includes(search)
            );
        }
    
        if (ministry) {
            filtered = filtered.filter(user =>
                user?.ministryRoles?.some(role => role?.ministry?._id === ministry._id)
            );
        }
    
        setFilteredUsers(filtered);
    };
    
    const handleMinistryClick = (ministry) => {
        if (!ministry || !ministry._id) {
            console.error("Invalid ministry object:", ministry);
            return;
        }

        if (selectedMinistry?._id === ministry._id) {
            setSelectedMinistry(null);
            setUsers([]);
        } else {
            setSelectedMinistry(ministry);
            fetchUsers(ministry._id);
        }
    };


    return (
        <Box display="flex">
            <SideBar />
            <Container maxWidth="lg" sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Box flex={3}>
                    <TextField
                        fullWidth
                        label="Search Users"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearch}
                        sx={{ mb: 2 }}
                    />
                    {selectedMinistry ? (
                        <Typography variant="h6" gutterBottom>
                            Users in Selected Ministry
                        </Typography>
                    ) : (
                        <Typography variant="h6" gutterBottom>
                            All Users
                        </Typography>
                    )}
                    <Grid container spacing={2}>
                        {filteredUsers.map(user => (
                            <Grid item xs={12} key={user._id}> 
                                <Card variant="outlined" sx={{ width: "100%", p: 2, display: "flex", alignItems: "center", gap: 2 }}>
                                    <Avatar src={user.avatar?.url} alt={user.name} sx={{ width: 80, height: 80 }} />
                                    <Box flex={1}>
                                        <Typography variant="h6">{user.name}</Typography>
                                        <Typography>{user.phone}</Typography>
                                        <Typography>{user.isAdmin ? 'Admin' : 'User'}</Typography>
                                        <Typography>
                                            {user.address?.Street}, {user.address?.District},
                                            {user.address?.barangay === 'Others' ? user.address?.customBarangay : user.address?.barangay},
                                            {user.address?.city === 'Others' ? user.address?.customCity : user.address?.city}
                                        </Typography>
                                        <Typography><strong>Ministry Roles:</strong></Typography>
                                        {user.ministryRoles.map((role, index) => (
                                            <Typography key={index}>
                                                {role?.ministry?.name || "Unknown Ministry"} - {role?.role || "No Role"}
                                            </Typography>
                                        ))}

                                        <Typography>
                                            Joined: {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                        </Typography>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>


                </Box>
                <Box flex={1}>
                    <Typography variant="h6">
                        {selectedMinistry && selectedMinistry.name
                            ? `Users in ${selectedMinistry.name}`
                            : "Ministries"}
                    </Typography>

                    <List>
                        {ministries.length > 0 ? (
                            ministries.map((ministry) => (
                                <ListItem
                                    button
                                    key={ministry?._id || Math.random()}
                                    onClick={() => ministry ? handleMinistryClick(ministry) : null}
                                >
                                    <ListItemText primary={ministry?.name || "Unknown Ministry"} />
                                </ListItem>
                            ))
                        ) : (
                            <Typography>No ministries found</Typography>
                        )}
                    </List>


                </Box>
            </Container>
        </Box>
    );
};

export default MemberDirectory;
