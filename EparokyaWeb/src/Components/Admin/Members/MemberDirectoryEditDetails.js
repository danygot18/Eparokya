import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Paper,
} from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";
import SideBar from "../SideBar";

const civilStatusOptions = [
  "Single",
  "Married",
  "Widowed",
  "Separated",
  "Divorced",
  "In Civil Partnership",
  "Former Civil Partner",
];

const roles = [
  "Coordinator",
  "Assistant Coordinator",
  "Office Worker",
  "Member",
  "Others",
];

const MemberDirectoryEditDetails = ({ onClose, onUpdated }) => {
  const { id: userId } = useParams();
  const [user, setUser] = useState(null);
  const [ministries, setMinistries] = useState([]);
  const [ministryOptions, setMinistryOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [userRes, ministriesRes] = await Promise.all([
          axios.get(
            `${process.env.REACT_APP_API}/api/v1/getMemberDirectoryUser/${userId}`
          ),
          axios.get(
            `${process.env.REACT_APP_API}/api/v1/ministryCategory/getAllMinistryCategories`
          ),
        ]);
        setUser(userRes.data.user);
        setMinistries(userRes.data.user.ministryRoles || []);
        setMinistryOptions(ministriesRes.data.categories);

      } catch (err) {
        alert("Failed to fetch data.");
      }
      setLoading(false);
    };
    if (userId) fetchData();
  }, [userId]);

  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleMinistryChange = (idx, field, value) => {
    setMinistries((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );
  };

  const handleAddMinistry = () => {
    setMinistries((prev) => [
      ...prev,
      { ministry: "", role: "", customRole: "", startYear: "", endYear: "" },
    ]);
  };

  const handleRemoveMinistry = (idx) => {
    setMinistries((prev) => prev.filter((_, i) => i !== idx));
  };

 const handleSave = async () => {
  setSaving(true);
  try {
    const preparedMinistries = ministries.map((m) => ({
      ...m,
      ministry: typeof m.ministry === "object" && m.ministry._id ? m.ministry._id : m.ministry,
    }));

    await axios.put(
      `${process.env.REACT_APP_API}/api/v1/updateMemberDirectoryUser/${userId}`,
      {
        civilStatus: user.civilStatus,
        ministryRoles: preparedMinistries,
      }
    );

    alert("Member details updated!");
    if (onUpdated) onUpdated();
    if (onClose) onClose();
  } catch (err) {
    alert("Failed to update member.");
  }
  setSaving(false);
};



  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={200}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box display="flex">
      <SideBar />
      <Box flexGrow={1} p={3}>
        <Paper sx={{ p: 3, maxWidth: 800, margin: "0 auto" }}>
          <Typography variant="h5" gutterBottom>
            Edit Member Details
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel>Civil Status</InputLabel>
            <Select
              value={user?.civilStatus || ""}
              label="Civil Status"
              onChange={(e) => handleChange("civilStatus", e.target.value)}
            >
              {civilStatusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="h6" mt={2}>
            Ministries & Roles
          </Typography>

          {ministries.map((ministry, idx) => (
            <Box
              key={idx}
              display="flex"
              gap={1}
              alignItems="center"
              mb={2}
              flexWrap="wrap"
            >
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Ministry</InputLabel>
                <Select
                  value={ministry.ministry?._id || ""}
                  onChange={(e) => {
                    const selectedMinistry = ministryOptions.find(m => m._id === e.target.value);
                    handleMinistryChange(idx, "ministry", selectedMinistry);
                  }}
                  label="Ministry"
                  size="small"
                >

                  {ministryOptions.map((m) => (
                    <MenuItem key={m._id} value={m._id}>
                      {m.name}
                    </MenuItem>
                  ))}
                </Select>

              </FormControl>

              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Role</InputLabel>
                <Select
                  value={ministry.role || ""}
                  label="Role"
                  onChange={(e) =>
                    handleMinistryChange(idx, "role", e.target.value)
                  }
                  size="small"
                >
                  {roles.map((r) => (
                    <MenuItem key={r} value={r}>
                      {r}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {ministry.role === "Others" && (
                <TextField
                  label="Custom Role"
                  value={ministry.customRole || ""}
                  onChange={(e) =>
                    handleMinistryChange(idx, "customRole", e.target.value)
                  }
                  size="small"
                  sx={{ minWidth: 150 }}
                />
              )}

              <TextField
                label="Start Year"
                type="number"
                value={ministry.startYear || ""}
                onChange={(e) =>
                  handleMinistryChange(idx, "startYear", e.target.value)
                }
                size="small"
              />
              <TextField
                label="End Year"
                type="number"
                value={ministry.endYear || ""}
                onChange={(e) =>
                  handleMinistryChange(idx, "endYear", e.target.value)
                }
                size="small"
              />
              <Button
                color="error"
                onClick={() => handleRemoveMinistry(idx)}
                size="small"
              >
                ×
              </Button>
            </Box>
          ))}

          <Button
            onClick={handleAddMinistry}
            variant="outlined"
            sx={{ mt: 1, mb: 2 }}
          >
            Add Ministry
          </Button>

          <Box mt={2} display="flex" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={saving}
            >
              Save Changes
            </Button>
            <Button variant="outlined" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default MemberDirectoryEditDetails;
