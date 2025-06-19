import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, clearErrors } from "../../Redux/actions/userActions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  Container,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Metadata from "../Layout/MetaData";

const Register = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, error, loading } = useSelector(
    (state) => state.auth
  );
  const navigate = useNavigate();

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
  const [ministryRoles, setMinistryRoles] = useState({});
  const [customRoles, setCustomRoles] = useState({});
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [displayDate, setDisplayDate] = useState("");

  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "/images/default_avatar.jpg"
  );
  const [cities] = useState(["Taguig City", "Others"]);
  const [barangays] = useState([
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
  ]);
  const [customCity, setCustomCity] = useState("");
  const [customBarangay, setCustomBarangay] = useState("");

  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [pendingAvatar, setPendingAvatar] = useState(null);

  useEffect(() => {
    if (isAuthenticated) navigate("/");
    if (error) {
      alert(error);
      dispatch(clearErrors());
    }

    const fetchMinistryCategories = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/ministryCategory/getAllMinistryCategories`
        );
        if (data.success && data.categories) {
          setMinistryCategories(data.categories);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchMinistryCategories();
  }, [error, isAuthenticated, navigate, dispatch]);

  // const sendOtpHandler = async () => {
  //   try {
  //     const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/sendOtp`, { email: user.email });
  //     if (res.data.success) {
  //       alert("OTP sent to your email.");
  //       setOtpDialogOpen(true);
  //       setOtpSent(true);
  //     }
  //   } catch (err) {
  //     alert("Failed to send OTP.");
  //   }
  // };

  // const handleVerifyOtp = async () => {
  //   try {
  //     const { data } = await axios.post(`${process.env.REACT_APP_API}/api/v1/verifyOtp`, {
  //       email: user.email,
  //       otpCode,
  //     });

  //     navigate("/");
  //   } catch (error) {
  //     alert("OTP verification failed.");
  //   }
  // };
  // const handleMinistryChange = (event) => {
  //   const { value, checked } = event.target;
  //   setUser((prev) => {
  //     const updatedMinistryRoles = checked
  //       ? prev.ministryRoles.some((roleObj) => roleObj.ministry === value)
  //         ? prev.ministryRoles
  //         : [...prev.ministryRoles, { ministry: value, role: "" }]
  //       : prev.ministryRoles.filter((roleObj) => roleObj.ministry !== value);

  //     return { ...prev, ministryRoles: updatedMinistryRoles };
  //   });
  // };

  const handleMinistryChange = (event) => {
    const { value, checked } = event.target;

    setUser((prev) => {
      let updatedMinistryRoles = [...prev.ministryRoles];

      if (checked) {
        const startYear = prompt("Enter start year:");
        const endYear = prompt("Enter end year (optional):");

        if (!prev.ministryRoles.some((roleObj) => roleObj.ministry === value)) {
          updatedMinistryRoles.push({
            ministry: value,
            role: "",
            startYear: parseInt(startYear, 10),
            endYear: endYear ? parseInt(endYear, 10) : undefined,
          });
        }
      } else {
        updatedMinistryRoles = prev.ministryRoles.filter(
          (roleObj) => roleObj.ministry !== value
        );
      }

      return { ...prev, ministryRoles: updatedMinistryRoles };
    });
  };

  const handleStartYearChange = (event, ministryId) => {
    const { value } = event.target;
    setUser((prev) => ({
      ...prev,
      ministryRoles: prev.ministryRoles.map((roleObj) =>
        roleObj.ministry === ministryId ? { ...roleObj, startYear: value } : roleObj
      ),
    }));
  };

  const handleEndYearChange = (event, ministryId) => {
    const { value } = event.target;
    setUser((prev) => ({
      ...prev,
      ministryRoles: prev.ministryRoles.map((roleObj) =>
        roleObj.ministry === ministryId ? { ...roleObj, endYear: value } : roleObj
      ),
    }));
  };

  const handleRoleChange = (event, ministryId) => {
    const { value } = event.target;
    setUser((prev) => ({
      ...prev,
      ministryRoles: prev.ministryRoles.map((roleObj) =>
        roleObj.ministry === ministryId
          ? {
            ...roleObj,
            role: value,
            customRole: value === "Others" ? "" : undefined,
          }
          : roleObj
      ),
    }));
  };

  const handleCustomRoleChange = (event, ministryId) => {
    const { value } = event.target;
    setUser((prev) => ({
      ...prev,
      ministryRoles: prev.ministryRoles.map((roleObj) =>
        roleObj.ministry === ministryId
          ? { ...roleObj, customRole: value }
          : roleObj
      ),
    }));
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

    // Convert to readable format
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

  const submitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Validate email
    if (!user.email) {
      toast.error("Email is required");
      return;
    }
    setPendingUser(user);
    setPendingAvatar(avatar);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API}/api/v1/sendOtp`, {
        email: user.email
      });

      if (res.data.success) {
        setOtpEmail(user.email);
        setShowOtpDialog(true);
        toast.success("OTP sent to your email.");
      }
    } catch (err) {
      toast.error("Failed to send OTP.");
      console.error(err);
    }
  };

  const handleVerifyOtpAndRegister = async () => {
    try {
      const userData = {
        ...pendingUser,
        address: JSON.stringify(pendingUser.address),
        ministryRoles: JSON.stringify(pendingUser.ministryRoles),
      };

      const avatarBase64 = pendingAvatar;

      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/verifyOtp`,
        {
          email: otpEmail,
          otpCode: enteredOtp,
          userData,
          avatarBase64,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Registration successful!");
        setShowOtpDialog(false);
        navigate("/");
      } else {
        toast.error("OTP verification or registration failed.");
      }
    } catch (error) {
      console.error("OTP/Register error:", error);
      toast.error("Something went wrong during OTP verification.");
    }
  };

  return (
    <Container maxWidth="md">
      <Metadata title={"Register User"} />
      <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <Avatar src={avatarPreview} sx={{ width: 100, height: 100, mb: 2 }} />

        <form onSubmit={submitHandler} style={{ width: "100%" }}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            required
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
          />

          <TextField
            label="Birth Date"
            name="birthDate"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={user.birthDate} // Stays in YYYY-MM-DD format
            onChange={handleDateChange}
            required
          />
          {/* Show formatted date below the input */}
          {displayDate && (
            <p style={{ color: "#555", fontSize: "14px", marginTop: "-10px" }}>
              Selected: {displayDate}
            </p>
          )}

          <TextField
            label="Phone"
            name="phone"
            fullWidth
            margin="normal"
            value={user.phone}
            onChange={(e) => setUser({ ...user, phone: e.target.value })}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Civil Status</InputLabel>
            <Select
              name="civilStatus"
              value={user.civilStatus}
              onChange={(e) =>
                setUser({ ...user, civilStatus: e.target.value })
              }
              required
            >
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Married">Married</MenuItem>
              <MenuItem value="Widowed">Widowed</MenuItem>
              <MenuItem value="Separated">Separated</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Building Name/Tower"
            name="BldgNameTower"
            fullWidth
            margin="normal"
            value={user.address.BldgNameTower}
            onChange={handleAddressChange}
          />
          <TextField
            label="Lot/Block/Phase/House No."
            name="LotBlockPhaseHouseNo"
            fullWidth
            margin="normal"
            value={user.address.LotBlockPhaseHouseNo}
            onChange={handleAddressChange}
          />
          <TextField
            label="Subdivision/Village/Zone"
            name="SubdivisionVillageZone"
            fullWidth
            margin="normal"
            value={user.address.SubdivisionVillageZone}
            onChange={handleAddressChange}
          />
          <TextField
            label="Street"
            name="Street"
            fullWidth
            margin="normal"
            required
            value={user.address.Street}
            onChange={handleAddressChange}
          />
          <TextField
            label="District"
            name="District"
            fullWidth
            margin="normal"
            required
            value={user.address.District}
            onChange={handleAddressChange}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Barangay</InputLabel>
            <Select
              name="barangay"
              value={user.address.barangay}
              onChange={handleAddressChange}
              required
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
          {user.address.barangay === "Others" && (
            <TextField
              label="Custom Barangay"
              name="customBarangay"
              fullWidth
              margin="normal"
              value={user.address.customBarangay}
              onChange={handleAddressChange}
              required
            />
          )}

          <FormControl fullWidth margin="normal">
            <InputLabel>City</InputLabel>
            <Select
              name="city"
              value={user.address.city}
              onChange={handleAddressChange}
              required
            >
              {["Taguig City", "Others"].map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {user.address.city === "Others" && (
            <TextField
              label="Custom City"
              name="customCity"
              fullWidth
              margin="normal"
              value={user.address.customCity}
              onChange={handleAddressChange}
              required
            />
          )}
          {/* Preference Dropdown */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Preference</InputLabel>
            <Select
              value={user.preference}
              onChange={(e) => setUser({ ...user, preference: e.target.value })}
              required
            >
              <MenuItem value="He">He</MenuItem>
              <MenuItem value="She">She</MenuItem>
              <MenuItem value="They/Them">They/Them</MenuItem>
            </Select>
          </FormControl>

          {/* Ministry Categories */}
          <FormGroup>
            <Typography variant="subtitle1">Ministry Categories</Typography>
            {ministryCategories.map((category) => {
              const ministryObj = user.ministryRoles?.find(
                (roleObj) => roleObj.ministry === category._id
              );
              const ministryExists = Boolean(ministryObj);

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
                  {ministryExists && category.name !== "Parishioner" && (
                    <>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Role</InputLabel>
                        <Select
                          value={ministryObj.role || ""}
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

                      {ministryObj.role === "Others" && (
                        <TextField
                          label="Custom Role"
                          fullWidth
                          margin="normal"
                          value={ministryObj.customRole || ""}
                          onChange={(e) => handleCustomRoleChange(e, category._id)}
                          required
                        />
                      )}

                      {/* Start Year Input */}
                      <TextField
                        label="Start Year"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={ministryObj.startYear || ""}
                        onChange={(e) => handleStartYearChange(e, category._id)}
                        required
                      />

                      {/* End Year Input */}
                      <TextField
                        label="End Year (If on-going please state the on-going year)"
                        type="number"
                        fullWidth
                        margin="normal"
                        value={ministryObj.endYear || ""}
                        onChange={(e) => handleEndYearChange(e, category._id)}
                      />
                    </>
                  )}
                </div>
              );
            })}
          </FormGroup>


          {/* Avatar Upload */}
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Upload Avatar
            <input
              type="file"
              name="avatar"
              hidden
              onChange={onChange}
              accept="image/*"
            />
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Register"}
          </Button>
        </form>
      </Box>

      <Dialog open={showOtpDialog} onClose={() => setShowOtpDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>OTP Verification</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please enter the 6-digit OTP sent to <strong>{otpEmail}</strong>.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="OTP Code"
            type="text"
            fullWidth
            value={enteredOtp}
            onChange={(e) => setEnteredOtp(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOtpDialog(false)} color="secondary">Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleVerifyOtpAndRegister}
          >
            Verify
          </Button>
        </DialogActions>
      </Dialog>



    </Container>
  );
};

export default Register;
