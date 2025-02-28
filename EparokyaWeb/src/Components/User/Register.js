import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearErrors } from '../../Redux/actions/userActions';
import axios from 'axios';
import {
    Container, TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem, Checkbox, FormGroup, FormControlLabel, Avatar, CircularProgress
} from '@mui/material';
import Metadata from '../Layout/MetaData';

const Register = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, error, loading } = useSelector(state => state.auth);
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        age: '',
        preference: '',
        phone: '',
        address: {
            BldgNameTower: '',
            LotBlockPhaseHouseNo: '',
            SubdivisionVillageZone: '',
            Street: '',
            District: '',
            barangay: '',
            city: '',
            customCity: ''
        },
        ministryRoles: []
    });

    const [ministryCategories, setMinistryCategories] = useState([]);
    const [ministryRoles, setMinistryRoles] = useState({});
    const [customRoles, setCustomRoles] = useState({});
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg');
    const [cities] = useState(['Taguig City', 'Others']);
    const [barangays] = useState([
        'Bagumbayan', 'Bambang', 'Calzada', 'Cembo', 'Central Bicutan',
        'Central Signal Village',
        'Comembo',
        'East Rembo',
        'Fort Bonifacio',
        'Hagonoy',
        'Ibayo-Tipas',
        'Katuparan',
        'Ligid-Tipas',
        'Lower Bicutan',
        'Maharlika Village',
        'Napindan',
        'New Lower Bicutan',
        'North Daang Hari',
        'North Signal Village',
        'Palingon',
        'Pembo',
        'Pinagsama',
        'Pitogo',
        'Post Proper Northside',
        'Post Proper Southside',
        'Rizal',
        'San Miguel',
        'Santa Ana',
        'South Cembo',
        'South Daang Hari',
        'South Signal Village',
        'Tanyag',
        'Tuktukan',
        'Upper Bicutan',
        'Ususan',
        'Wawa',
        'West Rembo',
        'Western Bicutan',
        'Others'
    ]);
    const [customCity, setCustomCity] = useState('');
    const [customBarangay, setCustomBarangay] = useState('');

    useEffect(() => {
        if (isAuthenticated) navigate('/');
        if (error) {
            alert(error);
            dispatch(clearErrors());
        }

        const fetchMinistryCategories = async () => {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/ministryCategory/getAllMinistryCategories`);
                if (data.success && data.categories) {
                    setMinistryCategories(data.categories);
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };

        fetchMinistryCategories();
    }, [error, isAuthenticated, navigate, dispatch]);

    const handleMinistryChange = (event) => {
        const { value, checked } = event.target;
        setUser((prev) => {
            const updatedMinistryRoles = checked
                ? prev.ministryRoles.some(roleObj => roleObj.ministry === value)
                    ? prev.ministryRoles // Already exists, return unchanged
                    : [...prev.ministryRoles, { ministry: value, role: "" }] // Add new ministry
                : prev.ministryRoles.filter(roleObj => roleObj.ministry !== value); // Remove ministry if unchecked

            return { ...prev, ministryRoles: updatedMinistryRoles };
        });
    };

    const handleRoleChange = (event, ministryId) => {
        const { value } = event.target;
        setUser(prev => ({
            ...prev,
            ministryRoles: prev.ministryRoles.map(roleObj =>
                roleObj.ministry === ministryId
                    ? { ...roleObj, role: value, customRole: value === 'Others' ? '' : undefined }
                    : roleObj
            )
        }));
    };


    const handleCustomRoleChange = (event, ministryId) => {
        const { value } = event.target;
        setUser(prev => ({
            ...prev,
            ministryRoles: prev.ministryRoles.map(roleObj =>
                roleObj.ministry === ministryId ? { ...roleObj, customRole: value } : roleObj
            )
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        }));
    };

    const onChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatar(reader.result);
                    setAvatarPreview(reader.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
        if (loading) return;
    
        const formData = new FormData();
    
        Object.entries(user).forEach(([key, value]) => {
            if (key === 'ministryRoles') {
                console.log(`Before appending: ${key} =`, value);
                formData.append(key, JSON.stringify(value)); // ✅ Ensure it's valid JSON
            } else if (key === 'address') {
                console.log(`Before appending: ${key} =`, value);
                formData.append(key, JSON.stringify(value)); // ✅ Send address correctly
            } else {
                formData.append(key, value);
            }
        });
    
        if (avatar) formData.append('avatar', avatar);
    
        console.log("Final formData:", Object.fromEntries(formData)); // ✅ Check before sending
        dispatch(register(formData));
    };
    


    return (
        <Container maxWidth="md">
            <Metadata title={'Register User'} />
            <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                <Typography variant="h4" gutterBottom>Register</Typography>
                <Avatar src={avatarPreview} sx={{ width: 100, height: 100, mb: 2 }} />

                <form onSubmit={submitHandler} style={{ width: '100%' }}>
                    <TextField label="Name" name="name" fullWidth margin="normal" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} required />
                    <TextField label="Email" name="email" type="email" fullWidth margin="normal" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} required />
                    <TextField label="Password" name="password" type="password" fullWidth margin="normal" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} required />
                    <TextField label="Age" name="age" type="number" fullWidth margin="normal" value={user.age} onChange={(e) => setUser({ ...user, age: e.target.value })} required />
                    <TextField label="Phone" name="phone" fullWidth margin="normal" value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} required />
                    <TextField label="Building Name/Tower" name="BldgNameTower" fullWidth margin="normal" value={user.address.BldgNameTower} onChange={handleAddressChange} />
                    <TextField label="Lot/Block/Phase/House No." name="LotBlockPhaseHouseNo" fullWidth margin="normal" value={user.address.LotBlockPhaseHouseNo} onChange={handleAddressChange} />
                    <TextField label="Subdivision/Village/Zone" name="SubdivisionVillageZone" fullWidth margin="normal" value={user.address.SubdivisionVillageZone} onChange={handleAddressChange} />
                    <TextField label="Street" name="Street" fullWidth margin="normal" required value={user.address.Street} onChange={handleAddressChange} />
                    <TextField label="District" name="District" fullWidth margin="normal" required value={user.address.District} onChange={handleAddressChange} />

                    <FormControl fullWidth margin="normal">
                        <InputLabel>Barangay</InputLabel>
                        <Select name="barangay" value={user.address.barangay} onChange={handleAddressChange} required>
                            {['Bagumbayan', 'Bambang', 'Calzada', 'Cembo', 'Central Bicutan', 'Central Signal Village', 'Comembo', 'East Rembo', 'Fort Bonifacio', 'Hagonoy', 'Ibayo-Tipas', 'Katuparan', 'Ligid-Tipas', 'Lower Bicutan', 'Maharlika Village', 'Napindan', 'New Lower Bicutan', 'North Daang Hari', 'North Signal Village', 'Palingon', 'Pembo', 'Pinagsama', 'Pitogo', 'Post Proper Northside', 'Post Proper Southside', 'Rizal', 'San Miguel', 'Santa Ana', 'South Cembo', 'South Daang Hari', 'South Signal Village', 'Tanyag', 'Tuktukan', 'Upper Bicutan', 'Ususan', 'Wawa', 'West Rembo', 'Western Bicutan', 'Others'].map(option => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {user.address.barangay === 'Others' && (
                        <TextField label="Custom Barangay" name="customBarangay" fullWidth margin="normal" value={user.address.customBarangay} onChange={handleAddressChange} required />
                    )}

                    <FormControl fullWidth margin="normal">
                        <InputLabel>City</InputLabel>
                        <Select name="city" value={user.address.city} onChange={handleAddressChange} required>
                            {['Taguig City', 'Others'].map(option => (
                                <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {user.address.city === 'Others' && (
                        <TextField label="Custom City" name="customCity" fullWidth margin="normal" value={user.address.customCity} onChange={handleAddressChange} required />
                    )}
                    {/* Preference Dropdown */}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Preference</InputLabel>
                        <Select value={user.preference} onChange={(e) => setUser({ ...user, preference: e.target.value })} required>
                            <MenuItem value="He">He</MenuItem>
                            <MenuItem value="She">She</MenuItem>
                            <MenuItem value="They/Them">They/Them</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Ministry Categories */}
                    <FormGroup>
                        <Typography variant="subtitle1">Ministry Categories</Typography>
                        {ministryCategories.map(category => {
                            const ministryExists = user.ministryRoles?.some(roleObj => roleObj.ministry === category._id);

                            return (
                                <div key={category._id}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                value={category._id}
                                                checked={ministryExists}
                                                onChange={handleMinistryChange}
                                            />
                                        }
                                        label={category.name}
                                    />
                                    {ministryExists && category.name !== 'Parishioner' && (
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel>Role</InputLabel>
                                            <Select
                                                value={user.ministryRoles.find(roleObj => roleObj.ministry === category._id)?.role || ''}
                                                onChange={(e) => handleRoleChange(e, category._id)}
                                                required
                                            >
                                                <MenuItem value="Coordinator">Coordinator</MenuItem>
                                                <MenuItem value="Assistant Coordinator">Assistant Coordinator</MenuItem>
                                                <MenuItem value="Office Worker">Office Worker</MenuItem>
                                                <MenuItem value="Member">Member</MenuItem>
                                                <MenuItem value="Others">Others</MenuItem>
                                            </Select>
                                        </FormControl>
                                    )}
                                    {user.ministryRoles.find(roleObj => roleObj.ministry === category._id)?.role === 'Others' && (
                                        <TextField
                                            label="Custom Role"
                                            fullWidth
                                            margin="normal"
                                            value={user.ministryRoles.find(roleObj => roleObj.ministry === category._id)?.customRole || ''}
                                            onChange={(e) => handleCustomRoleChange(e, category._id)}
                                            required
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </FormGroup>


                    {/* Avatar Upload */}
                    <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
                        Upload Avatar
                        <input type="file" name="avatar" hidden onChange={onChange} accept="image/*" />
                    </Button>

                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Register'}
                    </Button>
                </form>
            </Box>
        </Container>
    );

};

export default Register;
