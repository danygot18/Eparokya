import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel
} from "@mui/material";
import InputField from "../../../../../Utils/InputField";
import DocumentPreview from "../../../../../Utils/documentPreview";
import { allFormConfigs, documentsInformation } from "../../FormsConfig/baptismFormConfig";
import GuestSidebar from "../../../../GuestSideBar";
import MetaData from "../../../../Layout/MetaData";
import TermsModal from "../../../../TermsModal";
import ConfirmedBaptismOverlay from "./ConfirmBaptismModal";

const useBaptismFormHook = () => {
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
  return { formData, setFormData };
};


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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const { formData, setFormData } = useBaptismFormHook();


  // Helper function to get nested values
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : '';
    }, obj);
  };

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
    const day = date.getDay();
    const formattedDate = date.toISOString().split("T")[0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const confirmedDates = baptisms.map(
      (b) => b.start.toISOString().split("T")[0]
    );

    return (
      date < today ||
      day === 1 ||
      confirmedDates.includes(formattedDate)
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

  const handleBaptismDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    if (isDateDisabled(selectedDate)) {
      if (selectedDate.getDay() === 1) {
        setModalMessage("Every Monday schedules are not available.");
      } else if (
        baptisms.some(
          (b) =>
            b.start.toISOString().split("T")[0] ===
            selectedDate.toISOString().split("T")[0]
        )
      ) {
        setModalMessage("This date is already booked. Please select a different date. See the calendar above to view available dates.");
      } else {
        setModalMessage("Please select a future date.");
      }
      setModalOpen(true);
      return;
    }
    setFormData({ ...formData, baptismDate: e.target.value });
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

      Object.entries(formData.documents).forEach(([key, file]) => {
        if (file) {
          formDataObj.append(key, file);
        }
      });

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
          baptismPermitForm: "",
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

  const renderFormFields = () => {
    return allFormConfigs.map((section, sectionIndex) => (
      <Box key={sectionIndex} sx={{ mb: 4 }}>
        <Typography variant="h6" mt={3} mb={2}>
          {section.section}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {section.fields.map((field, fieldIndex) => (
            <Box key={fieldIndex}>
              <InputField
                type={field.type}
                label={field.label}
                value={getNestedValue(formData, field.path)}
                onChange={handleChange}
                onFileChange={handleFileChange}
                path={field.path}
                fieldName={field.fieldName}
                required={field.required}
                options={field.options}
                inputProps={field.inputProps}
                customValidation={field.customValidation}
                onCustomValidation={field.path === 'baptismDate' ? handleBaptismDateChange : undefined}
              />

              {/* {field.type === 'file' && field.fieldName && (
                <>
                  <InputLabel sx={{
                    fontWeight: "bold",
                    color: field.required ? "error.main" : "inherit",
                    mt: 1
                  }}>
                    {field.label} {field.required && '*'}
                  </InputLabel>
                  <DocumentPreview
                    file={formData.documents[field.fieldName]}
                    previewUrl={formData.previews[field.fieldName]}
                  />
                </>
              )} */}
            </Box>
          ))}
        </Box>
      </Box>
    ));
  };

  const renderDocumentsField = () => {
    return documentsInformation.map((section, sectionIndex) => (
      <Box key={sectionIndex} sx={{ mb: 4 }}>
        <Typography variant="h6" mt={3} mb={2}>
          {section.section}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {section.fields.map((field, fieldIndex) => (
            <Box key={fieldIndex}>
              <>
                <InputLabel sx={{
                  fontWeight: "bold",
                  color: field.required ? "error.main" : "inherit",
                  mt: 1
                }}>
                  {field.label} {field.required && '*'}
                </InputLabel>
              </>
              <InputField
                type={field.type}
                label={field.label}
                value={getNestedValue(formData, field.path)}
                onChange={handleChange}
                onFileChange={handleFileChange}
                path={field.path}
                fieldName={field.fieldName}
                required={field.required}
                options={field.options}
                inputProps={field.inputProps}
                customValidation={field.customValidation}
                onCustomValidation={field.path === 'baptismDate' ? handleBaptismDateChange : undefined}
              />
              {field.type === 'file' && field.fieldName && (
                <>

                  <DocumentPreview
                    file={formData.documents[field.fieldName]}
                    previewUrl={formData.previews[field.fieldName]}
                  />
                </>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    ))
  }

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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, maxWidth: 300 }}>
            <Typography variant="h6" sx={{ fontSize: "1.1rem" }}>
              Click here to see Available Dates
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ fontWeight: "bold", borderRadius: 1, px: 2, fontSize: "0.95rem" }}
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
            {renderFormFields()}
            {renderDocumentsField()}

            <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
              <DialogTitle>Date Unavailable</DialogTitle>
              <DialogContent>{modalMessage}</DialogContent>
              <DialogActions>
                <Button onClick={() => setModalOpen(false)} autoFocus>OK</Button>
              </DialogActions>
            </Dialog>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreedToTerms}
                    onChange={(e) => {
                      if (e.target.checked) {
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