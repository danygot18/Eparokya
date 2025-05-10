import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    updateProfile,
    clearErrors,
    loadUser
} from "../../Redux/actions/userActions";
import { UPDATE_PROFILE_RESET } from "../../Redux/constants/userConstants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    TextField,
    Button,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Avatar,
    CircularProgress,
    Paper,
    Stack,
    Grid
} from "@mui/material";
import Metadata from "../Layout/MetaData";

import axios from "axios";

const UpdateProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user: currentUser, loading } = useSelector((state) => state.auth);
    console.log(currentUser);
    const { error, isUpdated } = useSelector((state) => state.user);
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        birthDate: "",
        preference: "",
        civilStatus: "",
        phone: "",
        address: {
            BldgNameTower: "",
            LotBlockPhaseHouseNo: "",
            SubdivisionVillageZone: "",
            Street: "",
            District: "",
            barangay: "",
            city: "",
            customCity: "",
        },
        ministryRoles: [],
    });

    const [ministryCategories, setMinistryCategories] = useState([]);
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/images/default_avatar.jpg");
    const [displayDate, setDisplayDate] = useState("");


    const notify = (message = "") =>
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });

    const notifySuccess = (message = "") =>
        toast.success(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });

    useEffect(() => {
        if (error) {
            notify(error);
            dispatch(clearErrors());
        }

        if (isUpdated) {
            notifySuccess("Profile updated successfully");
            // dispatch(loadUser());
            navigate("/profile", { replace: true });
            dispatch({ type: UPDATE_PROFILE_RESET });
        }

        // Load user data
        if (currentUser) {
            const formattedUser = {
                ...currentUser,
                birthDate: currentUser.birthDate ? new Date(currentUser.birthDate).toISOString().split('T')[0] : "",
                password: "" // Clear password field for security
            };

            setUser(formattedUser);
            setAvatarPreview(currentUser.avatar?.url || "/images/default_avatar.jpg");

            // Format birth date for display
            if (currentUser.birthDate) {
                const dateObj = new Date(currentUser.birthDate);
                const formattedDate = dateObj.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });
                setDisplayDate(formattedDate);
            }
        }

    }, [dispatch, error, isUpdated, navigate, currentUser]);

    const paperStyle = {
        padding: 40,
        height: 'auto',
        width: '100%',
        maxWidth: 1000,
        margin: "20px auto",
        backgroundColor: "#e2daeb"
    };

    const gridStyle = {
        paddingRight: 60,
        paddingTop: 20
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            address: { ...prev.address, [name]: value },
        }));
    };

    const handleDateChange = (e) => {
        const rawDate = e.target.value;
        setUser({ ...user, birthDate: rawDate });

        const dateObj = new Date(rawDate);
        if (!isNaN(dateObj.getTime())) {
            const formattedDate = dateObj.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
            setDisplayDate(formattedDate);
        } else {
            setDisplayDate("");
        }
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


        const formData = new FormData();

        Object.entries(user).forEach(([key, value]) => {
            if (key === "ministryRoles" || key === "address") {
                formData.append(key, JSON.stringify(value));
            } else if (key === "birthDate") {
                if (value) {
                    const dateObj = new Date(value);
                    if (!isNaN(dateObj.getTime())) {
                        const formattedDate = dateObj.toISOString().split("T")[0];
                        formData.append(key, formattedDate);
                    } else {
                        formData.append(key, "");
                    }
                } else {
                    formData.append(key, "");
                }
            } else if (key !== "avatar" && key !== "password") {
                formData.append(key, value);
            }
        });

        if (avatar) formData.append("avatar", avatar);

        if (user.password) {
            formData.append("password", user.password);
        }

        dispatch(updateProfile(formData));
    };

    const renderForm = () => (
        <Paper elevation={10} style={paperStyle}>
            <Typography variant='h3' align='center' padding='10px'>
                Update Profile
            </Typography>
            <form onSubmit={submitHandler} style={{ width: "100%" }}>
                <Stack spacing={3}>
                    <Box display="flex" justifyContent="center">
                        <Avatar
                            src={avatarPreview}
                            sx={{ width: 100, height: 100, mb: 2 }}
                        />
                    </Box>

                    <TextField
                        label="Name"
                        name="name"
                        fullWidth
                        variant="standard"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        required
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        required
                        disabled
                    />

                    <TextField
                        label="New Password (Leave blank to keep current)"
                        name="password"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        placeholder="Enter new password to change"
                    />

                    <TextField
                        label="Birth Date"
                        name="birthDate"
                        type="date"
                        fullWidth
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                        value={user.birthDate}
                        onChange={handleDateChange}
                        required
                    />
                    {displayDate && (
                        <Typography variant="caption" color="textSecondary">
                            Selected: {displayDate}
                        </Typography>
                    )}

                    <TextField
                        label="Phone"
                        name="phone"
                        fullWidth
                        variant="standard"
                        value={user.phone}
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                        required
                    />

                    <FormControl fullWidth variant="standard">
                        <InputLabel>Civil Status</InputLabel>
                        <Select
                            name="civilStatus"
                            value={user.civilStatus}
                            onChange={(e) => setUser({ ...user, civilStatus: e.target.value })}
                            required
                        >
                            <MenuItem value="Single">Single</MenuItem>
                            <MenuItem value="Married">Married</MenuItem>
                            <MenuItem value="Widowed">Widowed</MenuItem>
                            <MenuItem value="Separated">Separated</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Address Fields */}
                    <Typography variant="h6" gutterBottom>Address Information</Typography>
                    <TextField
                        label="Building Name/Tower"
                        name="BldgNameTower"
                        fullWidth
                        variant="standard"
                        value={user.address?.BldgNameTower || ""}
                        onChange={handleAddressChange}
                    />
                    <TextField
                        label="Lot/Block/Phase/House No."
                        name="LotBlockPhaseHouseNo"
                        fullWidth
                        variant="standard"
                        value={user.address?.LotBlockPhaseHouseNo || ""}
                        onChange={handleAddressChange}
                    />
                    <TextField
                        label="Subdivision/Village/Zone"
                        name="SubdivisionVillageZone"
                        fullWidth
                        variant="standard"
                        value={user.address?.SubdivisionVillageZone || ""}
                        onChange={handleAddressChange}
                    />
                    <TextField
                        label="Street"
                        name="Street"
                        fullWidth
                        variant="standard"
                   
                        value={user.address?.Street || ""}
                        onChange={handleAddressChange}
                    />
                    <TextField
                        label="District"
                        name="District"
                        fullWidth
                        variant="standard"
                      
                        value={user.address?.District || ""}
                        onChange={handleAddressChange}
                    />

                    <FormControl fullWidth variant="standard">
                        <InputLabel>Barangay</InputLabel>
                        <Select
                            name="barangay"
                            value={user.address?.barangay || ""}
                            onChange={handleAddressChange}
                            
                        >
                            {[
                                "Bagumbayan",
                                "Bambang",
                                "Calzada",
                                "Cembo",
                                "Central Bicutan",
                                "Central Signal Village",
                                "Comembo",
                                "East Rembo",
                                "Fort Bonifacio",
                                "Hagonoy",
                                "Ibayo-Tipas",
                                "Katuparan",
                                "Ligid-Tipas",
                                "Lower Bicutan",
                                "Maharlika Village",
                                "Napindan",
                                "New Lower Bicutan",
                                "North Daang Hari",
                                "North Signal Village",
                                "Palingon",
                                "Pembo",
                                "Pinagsama",
                                "Pitogo",
                                "Post Proper Northside",
                                "Post Proper Southside",
                                "Rizal",
                                "San Miguel",
                                "Santa Ana",
                                "South Cembo",
                                "South Daang Hari",
                                "South Signal Village",
                                "Tanyag",
                                "Tuktukan",
                                "Upper Bicutan",
                                "Ususan",
                                "Wawa",
                                "West Rembo",
                                "Western Bicutan",
                                "Others",
                            ].map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {user.address?.barangay === "Others" && (
                        <TextField
                            label="Custom Barangay"
                            name="customBarangay"
                            fullWidth
                            variant="standard"
                            value={user.address?.customBarangay || ""}
                            onChange={handleAddressChange}
                   
                        />
                    )}

                    <FormControl fullWidth variant="standard">
                        <InputLabel>City</InputLabel>
                        <Select
                            name="city"
                            value={user.address?.city || ""}
                            onChange={handleAddressChange}
                          
                        >
                            {["Taguig City", "Others"].map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {user.address?.city === "Others" && (
                        <TextField
                            label="Custom City"
                            name="customCity"
                            fullWidth
                            variant="standard"
                            value={user.address?.customCity || ""}
                            onChange={handleAddressChange}
                          
                        />
                    )}

                    <FormControl fullWidth variant="standard">
                        <InputLabel>Preference</InputLabel>
                        <Select
                            value={user.preference}
                            onChange={(e) => setUser({ ...user, preference: e.target.value })}
                     
                        >
                            <MenuItem value="He">He</MenuItem>
                            <MenuItem value="She">She</MenuItem>
                            <MenuItem value="They/Them">They/Them</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Ministry Categories */}
              

                    {/* Avatar Upload */}
                    <Box>
                        <Typography variant="subtitle1" gutterBottom>Profile Picture</Typography>
                        <input
                            type="file"
                            name="avatar"
                            id="avatar-upload"
                            accept="image/*"
                            onChange={onChange}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="avatar-upload">
                            <Button
                                variant="contained"
                                component="span"
                                fullWidth
                            >
                                Upload New Avatar
                            </Button>
                        </label>
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        fullWidth
                        size="large"
                        loading={false}
                        disabled={false}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            "Update Profile"
                        )}
                        

                    </Button>
                </Stack>
            </form>
        </Paper>
    );

    return (
        <Fragment>
            <Metadata title="Update Profile" />

            {currentUser && currentUser.role !== "admin" && (
                <Fragment>

                    <Grid container justifyContent="center" style={gridStyle}>
                        {renderForm()}
                    </Grid>
                </Fragment>
            )}

            {currentUser && currentUser.role === "admin" && (
                <Fragment>
                    <div className="row">
                        <div className="col-12 col-md-2">

                        </div>
                        <div className="col-12 col-md-10">
                            <Grid container justifyContent="center" style={gridStyle}>
                                {renderForm()}
                            </Grid>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

export default UpdateProfile;