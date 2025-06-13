import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Form, Row, Col } from "react-bootstrap";
import {
  Box,
  Grid,
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

    return () => {
      Object.values(formData.previews).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, []);

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
    console.log("Form Data:", formData);

    try {
      const formDataObj = new FormData();

      // Append all form data
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

      // Append files if they exist
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

      const response = await axios.post(
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

      // Reset form
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
      <div className="mt-2">
        <img
          src={previewUrl}
          alt="Preview"
          className="img-thumbnail"
          style={{ maxHeight: "150px" }}
        />
        <div className="text-muted small mt-1">{file.name}</div>
      </div>
    ) : (
      <div
        className="mt-2"
        style={{ width: "100%", height: "300px", marginBottom: "30px" }}
      >
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
        <div className="text-muted small mt-1">{file.name}</div>
      </div>
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
      <Box sx={{ flex: 1, p: { xs: 1, md: 4 } }}>
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
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Araw ng Binyag (Monday Schedules are NOT Available)"
                  type="date"
                  value={formData.baptismDate}
                  onChange={(e) => handleChange(e, "baptismDate")}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Oras ng Binyag"
                  type="time"
                  value={formData.baptismTime}
                  onChange={(e) => handleChange(e, "baptismTime")}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>

            {/* Child Information */}
            <Typography variant="h6" mt={3}>
              Child Information
            </Typography>
            <TextField
              label="Buong Pangalan ng Bibinyagan"
              value={formData.child.fullName}
              onChange={(e) => handleChange(e, "child.fullName")}
              fullWidth
              required
              sx={{ mb: 2, mt: 1 }}
            />
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Araw ng Kapanganakan"
                  type="date"
                  value={formData.child.dateOfBirth}
                  onChange={(e) => handleChange(e, "child.dateOfBirth")}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  label="Lugar ng Kapanganakan"
                  value={formData.child.placeOfBirth}
                  onChange={(e) => handleChange(e, "child.placeOfBirth")}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel id="child-gender-label">Kasarian</InputLabel>
                  <Select
                    labelId="child-gender-label"
                    label="Kasarian"
                    value={formData.child.gender}
                    onChange={(e) => handleChange(e, "child.gender")}
                  >
                    <MenuItem value="">
                      <em>-- Piliin ang Kasarian --</em>
                    </MenuItem>
                    <MenuItem value="Male">Lalaki</MenuItem>
                    <MenuItem value="Female">Babae</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Parents Information */}
            <Typography variant="h6" mt={3}>
              Magulang ng Bibinyagan
            </Typography>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Buong Pangalan ng Ama"
                  value={formData.parents.fatherFullName}
                  onChange={(e) => handleChange(e, "parents.fatherFullName")}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Lugar ng Kapanganakan (Ama)"
                  value={formData.parents.placeOfFathersBirth}
                  onChange={(e) =>
                    handleChange(e, "parents.placeOfFathersBirth")
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Buong Pangalan ng Ina"
                  value={formData.parents.motherFullName}
                  onChange={(e) => handleChange(e, "parents.motherFullName")}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Lugar ng Kapanganakan (Ina)"
                  value={formData.parents.placeOfMothersBirth}
                  onChange={(e) =>
                    handleChange(e, "parents.placeOfMothersBirth")
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Tirahan"
                  value={formData.parents.address}
                  onChange={(e) => handleChange(e, "parents.address")}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Contact Number"
                  value={formData.phone}
                  onChange={(e) => handleChange(e, "phone")}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth required>
                  <InputLabel id="marriage-status-label">Saan Kasal</InputLabel>
                  <Select
                    labelId="marriage-status-label"
                    label="Saan Kasal"
                    value={formData.parents.marriageStatus}
                    onChange={(e) => handleChange(e, "parents.marriageStatus")}
                  >
                    <MenuItem value="">
                      <em>-- Saan Kasal --</em>
                    </MenuItem>
                    <MenuItem value="Simbahan">Simbahan (Katoliko)</MenuItem>
                    <MenuItem value="Civil">Civil (Huwes)</MenuItem>
                    <MenuItem value="Nat">Nat (Hindi Kasal)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Ninong */}
            <Typography variant="h6" mt={3}>
              Ninong
            </Typography>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} md={5}>
                <TextField
                  label="Pangalan"
                  value={formData.ninong.name}
                  onChange={(e) => handleChange(e, "ninong.name")}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  label="Tirahan"
                  value={formData.ninong.address}
                  onChange={(e) => handleChange(e, "ninong.address")}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label="Relihiyon"
                  value={formData.ninong.religion}
                  onChange={(e) => handleChange(e, "ninong.religion")}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>

            {/* Ninang */}
            <Typography variant="h6" mt={3}>
              Ninang
            </Typography>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12} md={5}>
                <TextField
                  label="Pangalan"
                  value={formData.ninang.name}
                  onChange={(e) => handleChange(e, "ninang.name")}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  label="Tirahan"
                  value={formData.ninang.address}
                  onChange={(e) => handleChange(e, "ninang.address")}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label="Relihiyon"
                  value={formData.ninang.religion}
                  onChange={(e) => handleChange(e, "ninang.religion")}
                  fullWidth
                  required
                />
              </Grid>
            </Grid>

            {/* Secondary Ninong */}
            <Typography variant="h6" mt={3}>
              Secondary Ninong
            </Typography>
            {NinongGodparents.map((godparent, index) => (
              <Grid container spacing={2} mb={1} key={`ninong-${index}`}>
                <Grid item xs={10}>
                  <TextField
                    label="Pangalan ng Ninong"
                    value={godparent.name}
                    onChange={(e) =>
                      handleGodparentChange("ninong", index, e.target.value)
                    }
                    fullWidth
                  />
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleRemoveGodparent("ninong", index)}
                    fullWidth
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            ))}
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleAddGodparent("ninong")}
              sx={{ mb: 3 }}
            >
              Add Secondary Ninong
            </Button>

            {/* Secondary Ninang */}
            <Typography variant="h6" mt={3}>
              Secondary Ninang
            </Typography>
            {NinangGodparents.map((godparent, index) => (
              <Grid container spacing={2} mb={1} key={`ninang-${index}`}>
                <Grid item xs={10}>
                  <TextField
                    label="Pangalan ng Ninang"
                    value={godparent.name}
                    onChange={(e) =>
                      handleGodparentChange("ninang", index, e.target.value)
                    }
                    fullWidth
                  />
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleRemoveGodparent("ninang", index)}
                    fullWidth
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
            ))}
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleAddGodparent("ninang")}
              sx={{ mb: 3 }}
            >
              Add Secondary Ninang
            </Button>

            {/* Required Documents */}
            <Typography variant="h6" mt={3}>
              Required Documents
            </Typography>
            <FormGroup sx={{ mb: 3 }}>
              <InputLabel className="fw-bold text-danger">
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
            </FormGroup>
            <FormGroup sx={{ mb: 3 }}>
              <InputLabel className="fw-bold text-danger">
                Marriage Certificate *
              </InputLabel>
              <Button variant="contained" component="label" sx={{ mb: 1 }}>
                Upload Marriage Certificate
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(e, "marriageCertificate")}
                  accept="image/*,.pdf,.doc,.docx"
                  required
                />
              </Button>
              <DocumentPreview
                file={formData.documents.marriageCertificate}
                previewUrl={formData.previews.marriageCertificate}
              />
            </FormGroup>

            {/* Additional Documents */}
            <Typography variant="h6" mt={3}>
              Additional Documents
            </Typography>
            <TextField
              label="Baptism Permit From"
              placeholder="Enter issuing parish"
              value={formData.additionalDocs.baptismPermitFrom}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  additionalDocs: {
                    ...prev.additionalDocs,
                    baptismPermitFrom: e.target.value,
                  },
                }))
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <FormGroup sx={{ mb: 3 }}>
              <InputLabel>Baptism Permit (FOR NON-PARISHIONERS)</InputLabel>
              <Button variant="contained" component="label" sx={{ mb: 1 }}>
                Upload Baptism Permit
                <input
                  type="file"
                  hidden
                  onChange={(e) => handleFileChange(e, "baptismPermit")}
                  accept="image/*,.pdf,.doc,.docx"
                />
              </Button>
              <DocumentPreview
                file={formData.documents.baptismPermit}
                previewUrl={formData.previews.baptismPermit}
              />
            </FormGroup>
            <FormGroup sx={{ mb: 3 }}>
              <InputLabel>
                Certificate Of No Record of Baptism (FOR 2 YEARS OLD AND ABOVE)
              </InputLabel>
              <Button variant="contained" component="label" sx={{ mb: 1 }}>
                Upload Certificate
                <input
                  type="file"
                  hidden
                  onChange={(e) =>
                    handleFileChange(e, "certificateOfNoRecordBaptism")
                  }
                  accept="image/*,.pdf,.doc,.docx"
                />
              </Button>
              <DocumentPreview
                file={formData.documents.certificateOfNoRecordBaptism}
                previewUrl={formData.previews.certificateOfNoRecordBaptism}
              />
            </FormGroup>

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
          e.preventDefault(); // block direct toggle
          setShowTermsModal(true); // open modal instead
        } else {
          setAgreedToTerms(false); // allow unchecking
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
  disabled={isSubmitting || !agreedToTerms} // Disable until agreed
>
  {isSubmitting ? "Submitting..." : "Submit"}
</Button>

{/* Terms and Conditions Modal */}
<TermsModal
  isOpen={showTermsModal}
  onClose={() => setShowTermsModal(false)}
  onAccept={() => {
    setAgreedToTerms(true);
    setShowTermsModal(false);
  }}
  termsText={termsAndConditionsText}
/>

            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default BaptismForm;
