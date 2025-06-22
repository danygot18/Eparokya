import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputLabel,
  FormControl,
  Paper,
} from "@mui/material";
import "./BaptismForm.css";
import GuestSidebar from "../../../../GuestSideBar";
import MetaData from "../../../../Layout/MetaData";
import TermsModal from "../../../../TermsModal";
import termsAndConditionsText from "../../../../TermsAndConditionText";
import ConfirmedBaptismOverlay from "./ConfirmBaptismModal";

const BaptismForm = () => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [NinongGodparents, setNinongGodparents] = useState([]);
  const [NinangGodparents, setNinangGodparents] = useState([]);
  const [user, setUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [baptisms, setBaptisms] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    baptismDate: "",
    baptismTime: "",
    phone: "",
    child: {
      fullName: "",
      dateOfBirth: "",
      placeOfBirth: "",
      gender: "",
    },
    parents: {
      fatherFullName: "",
      placeOfFathersBirth: "",
      motherFullName: "",
      placeOfMothersBirth: "",
      address: "",
      marriageStatus: "",
    },
    ninong: { name: "", address: "", religion: "" },
    ninang: { name: "", address: "", religion: "" },
    documents: {
      birthCertificate: null,
      marriageCertificate: null,
      baptismPermit: null,
      certificateOfNoRecordBaptism: null,
    },
    previews: {},
    additionalDocs: {
      baptismPermitFrom: "",
    },
  });

  const fetchBaptisms = useCallback(async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/confirmedBaptism`
      );
      const formatted = data.map((event) => ({
        id: event._id,
        title: `${event.child?.fullName || "Unknown"} Baptism`,
        start: new Date(event.baptismDate),
        end: new Date(event.baptismDate),
        childName: event.child?.fullName || "N/A",
        fatherName: event.parents?.fatherFullName || "N/A",
        motherName: event.parents?.motherFullName || "N/A",
        type: "Baptism",
      }));
      setBaptisms(formatted);
    } catch (err) {
      console.error("Failed to load baptisms:", err);
      setErrorMessage("Failed to load baptisms. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/profile`,
          { withCredentials: true }
        );
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
    fetchBaptisms();

    return () => {
      Object.values(formData.previews).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [fetchBaptisms]);

  const isDateDisabled = (date) => {
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const formattedDate = date.toISOString().split("T")[0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const confirmedDates = baptisms.map(
      (b) => b.start.toISOString().split("T")[0]
    );

    return (
      date < today || // Past dates
      day === 1 || // Mondays
      confirmedDates.includes(formattedDate) // Already booked dates
    );
  };

  const handleChange = (e, path) => {
    const value = e.target.value;
    const keys = path.split(".");
    const updatedFormData = { ...formData };
    let current = updatedFormData;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = value;
    setFormData(updatedFormData);
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const MAX_SIZE = 10 * 1024 * 1024;
    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (file.size > MAX_SIZE) {
      toast.error(`File too large (max 10MB): ${file.name}`);
      e.target.value = "";
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(`Unsupported file type: ${file.type}`);
      e.target.value = "";
      return;
    }

    const fileUrl = URL.createObjectURL(file);

    if (formData.previews[fieldName]) {
      URL.revokeObjectURL(formData.previews[fieldName]);
    }

    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [fieldName]: file,
      },
      previews: {
        ...prev.previews,
        [fieldName]: fileUrl,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!agreedToTerms) {
      setShowTermsModal(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append("baptismDate", formData.baptismDate);
      formDataObj.append("baptismTime", formData.baptismTime);
      formDataObj.append("phone", formData.phone);
      formDataObj.append("child", JSON.stringify(formData.child));
      formDataObj.append("parents", JSON.stringify(formData.parents));
      formDataObj.append("ninong", JSON.stringify(formData.ninong));
      formDataObj.append("ninang", JSON.stringify(formData.ninang));
      formDataObj.append("NinongGodparents", JSON.stringify(NinongGodparents));
      formDataObj.append("NinangGodparents", JSON.stringify(NinangGodparents));
      formDataObj.append(
        "baptismPermitFrom",
        formData.additionalDocs.baptismPermitFrom
      );

      if (formData.documents.birthCertificate) {
        formDataObj.append(
          "birthCertificate",
          formData.documents.birthCertificate
        );
      }
      if (formData.documents.marriageCertificate) {
        formDataObj.append(
          "marriageCertificate",
          formData.documents.marriageCertificate
        );
      }
      if (formData.documents.baptismPermit) {
        formDataObj.append("baptismPermit", formData.documents.baptismPermit);
      }
      if (formData.documents.certificateOfNoRecordBaptism) {
        formDataObj.append(
          "certificateOfNoRecordBaptism",
          formData.documents.certificateOfNoRecordBaptism
        );
      }

      await axios.post(
        `${process.env.REACT_APP_API}/api/v1/baptismCreate`,
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast.success("Form submitted successfully!");
      setFormData({
        baptismDate: "",
        baptismTime: "",
        phone: "",
        child: {
          fullName: "",
          dateOfBirth: "",
          placeOfBirth: "",
          gender: "",
        },
        parents: {
          fatherFullName: "",
          placeOfFathersBirth: "",
          motherFullName: "",
          placeOfMothersBirth: "",
          address: "",
          marriageStatus: "",
        },
        ninong: { name: "", address: "", religion: "" },
        ninang: { name: "", address: "", religion: "" },
        documents: {
          birthCertificate: null,
          marriageCertificate: null,
          baptismPermit: null,
          certificateOfNoRecordBaptism: null,
        },
        previews: {},
        additionalDocs: {
          baptismPermitFrom: "",
        },
      });
      setNinongGodparents([]);
      setNinangGodparents([]);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit form. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const DocumentPreview = ({ file, previewUrl }) => {
    if (!file || !previewUrl) return null;

    return file.type.startsWith("image/") ? (
      <Box mt={2}>
        <img
          src={previewUrl}
          alt="Preview"
          style={{ maxHeight: "150px", maxWidth: "100%" }}
        />
        <Typography variant="caption" display="block" mt={1}>
          {file.name}
        </Typography>
      </Box>
    ) : (
      <Box mt={2} sx={{ width: "100%", height: "300px", mb: 4 }}>
        <iframe
          src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          title="Document Preview"
          style={{
            width: "100%",
            height: "100%",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        />
        <Typography variant="caption" display="block" mt={1}>
          {file.name}
        </Typography>
      </Box>
    );
  };

  const handleAddGodparent = (type) => {
    if (type === "ninong") {
      setNinongGodparents([...NinongGodparents, { name: "" }]);
    } else {
      setNinangGodparents([...NinangGodparents, { name: "" }]);
    }
  };

  const handleRemoveGodparent = (type, index) => {
    if (type === "ninong") {
      setNinongGodparents(NinongGodparents.filter((_, i) => i !== index));
    } else {
      setNinangGodparents(NinangGodparents.filter((_, i) => i !== index));
    }
  };

  const handleGodparentChange = (type, index, value) => {
    if (type === "ninong") {
      const updated = [...NinongGodparents];
      updated[index].name = value;
      setNinongGodparents(updated);
    } else {
      const updated = [...NinangGodparents];
      updated[index].name = value;
      setNinangGodparents(updated);
    }
  };

  const styles = {
    disabledDate: {
      backgroundColor: "#ffebee", // Light red background
      color: "#b71c1c", // Dark red text
      cursor: "not-allowed",
      "&:hover": {
        backgroundColor: "#ffcdd2", // Slightly darker red on hover
      },
    },
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f9f9f9" }}>
      <MetaData title="Baptism Form" />
      <TermsModal
        show={showTermsModal}
        onHide={() => setShowTermsModal(false)}
        onAgree={() => {
          setAgreedToTerms(true);
          setShowTermsModal(false);
        }}
      />
      <GuestSidebar />
      <Box sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              maxWidth: 300,
            }}
          >
            <Typography variant="h6" sx={{ fontSize: "1.1rem" }}>
              Click here to see Available Dates
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              sx={{
                fontWeight: "bold",
                borderRadius: 1,
                px: 2,
                fontSize: "0.95rem",
              }}
              onClick={() => setShowOverlay(true)}
            >
              View Calendar
            </Button>
          </Box>
          <ConfirmedBaptismOverlay
            show={showOverlay}
            onClose={() => setShowOverlay(false)}
          />
        </Box>
        <Paper elevation={2} sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h4" gutterBottom>
            Baptism Form
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Baptism Date and Time */}
            <Box sx={{ mb: 3 }}>
              <TextField
                label="Baptism Date (Mondays not available)"
                type="date"
                value={formData.baptismDate}
                onChange={(e) => {
                  const selectedDate = new Date(e.target.value);
                  if (isDateDisabled(selectedDate)) {
                    if (selectedDate.getDay() === 1) {
                      toast.error("Monday schedules are not available");
                    } else if (
                      baptisms.some(
                        (b) =>
                          b.start.toISOString().split("T")[0] ===
                          selectedDate.toISOString().split("T")[0]
                      )
                    ) {
                      toast.error("This date is already booked");
                    } else {
                      toast.error("Please select a future date");
                    }
                    return;
                  }
                  setFormData({ ...formData, baptismDate: e.target.value });
                }}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                inputProps={{
                  min: new Date().toISOString().split("T")[0],
                  style: {
                    // This will apply to the input element
                  },
                }}
                sx={{
                  'input[type="date"]::-webkit-calendar-picker-indicator': {
                    filter:
                      formData.baptismDate &&
                      isDateDisabled(new Date(formData.baptismDate))
                        ? "grayscale(100%) brightness(100%)"
                        : "none",
                  },
                  'input[type="date"]': {
                    backgroundColor:
                      formData.baptismDate &&
                      isDateDisabled(new Date(formData.baptismDate))
                        ? "#ffebee"
                        : "inherit",
                  },
                }}
              />
              <TextField
                label="Baptism Time"
                type="time"
                value={formData.baptismTime}
                onChange={(e) => handleChange(e, "baptismTime")}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                sx={{ mt: 2 }}
              />
            </Box>

            {/* Child Information */}
            <Typography variant="h6" mt={3} mb={2}>
              Child Information
            </Typography>
            <TextField
              label="Child's Full Name"
              value={formData.child.fullName}
              onChange={(e) => handleChange(e, "child.fullName")}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Date of Birth"
                type="date"
                value={formData.child.dateOfBirth}
                onChange={(e) => handleChange(e, "child.dateOfBirth")}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
              <TextField
                label="Place of Birth"
                value={formData.child.placeOfBirth}
                onChange={(e) => handleChange(e, "child.placeOfBirth")}
                fullWidth
                required
              />
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.child.gender}
                  onChange={(e) => handleChange(e, "child.gender")}
                  label="Gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Parents Information */}
            <Typography variant="h6" mt={3} mb={2}>
              Parents Information
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Father's Full Name"
                value={formData.parents.fatherFullName}
                onChange={(e) => handleChange(e, "parents.fatherFullName")}
                fullWidth
                required
              />
              <TextField
                label="Father's Birthplace"
                value={formData.parents.placeOfFathersBirth}
                onChange={(e) => handleChange(e, "parents.placeOfFathersBirth")}
                fullWidth
                required
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Mother's Full Name"
                value={formData.parents.motherFullName}
                onChange={(e) => handleChange(e, "parents.motherFullName")}
                fullWidth
                required
              />
              <TextField
                label="Mother's Birthplace"
                value={formData.parents.placeOfMothersBirth}
                onChange={(e) => handleChange(e, "parents.placeOfMothersBirth")}
                fullWidth
                required
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Address"
                value={formData.parents.address}
                onChange={(e) => handleChange(e, "parents.address")}
                fullWidth
                required
              />
              <TextField
                label="Contact Number"
                value={formData.phone}
                onChange={(e) => handleChange(e, "phone")}
                fullWidth
                required
              />
              <FormControl fullWidth required>
                <InputLabel>Marriage Status</InputLabel>
                <Select
                  value={formData.parents.marriageStatus}
                  onChange={(e) => handleChange(e, "parents.marriageStatus")}
                  label="Marriage Status"
                >
                  <MenuItem value="Simbahan">Church Wedding</MenuItem>
                  <MenuItem value="Civil">Civil Wedding</MenuItem>
                  <MenuItem value="Nat">Not Married</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Godparents */}
            <Typography variant="h6" mt={3} mb={2}>
              Godparents
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Godfather Name"
                value={formData.ninong.name}
                onChange={(e) => handleChange(e, "ninong.name")}
                fullWidth
                required
              />
              <TextField
                label="Godfather Address"
                value={formData.ninong.address}
                onChange={(e) => handleChange(e, "ninong.address")}
                fullWidth
                required
              />
              <TextField
                label="Godfather Religion"
                value={formData.ninong.religion}
                onChange={(e) => handleChange(e, "ninong.religion")}
                fullWidth
                required
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                label="Godmother Name"
                value={formData.ninang.name}
                onChange={(e) => handleChange(e, "ninang.name")}
                fullWidth
                required
              />
              <TextField
                label="Godmother Address"
                value={formData.ninang.address}
                onChange={(e) => handleChange(e, "ninang.address")}
                fullWidth
                required
              />
              <TextField
                label="Godmother Religion"
                value={formData.ninang.religion}
                onChange={(e) => handleChange(e, "ninang.religion")}
                fullWidth
                required
              />
            </Box>

            {/* Documents */}
            <Typography variant="h6" mt={3} mb={2}>
              Required Documents
            </Typography>
            <Box sx={{ mb: 3 }}>
              <InputLabel sx={{ fontWeight: "bold", color: "error.main" }}>
                Birth Certificate *
              </InputLabel>
              <Button variant="contained" component="label" sx={{ mb: 1 }}>
                Upload Birth Certificate
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(e, "birthCertificate")}
                  accept="image/*,.pdf,.doc,.docx"
                  required
                />
              </Button>
              <DocumentPreview
                file={formData.documents.birthCertificate}
                previewUrl={formData.previews.birthCertificate}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 4,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreedToTerms}
                    onClick={(e) => {
                      if (!agreedToTerms) {
                        e.preventDefault();
                        setShowTermsModal(true);
                      } else {
                        setAgreedToTerms(false);
                      }
                    }}
                    required
                  />
                }
                label="I agree to the terms and conditions"
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting || !agreedToTerms}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default BaptismForm;
