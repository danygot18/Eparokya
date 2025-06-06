import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "./BaptismForm.css";
import GuestSidebar from "../../../../GuestSideBar";
import MetaData from "../../../../Layout/MetaData";
import TermsModal from "../../../../TermsModal";
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
      certificateOfNoRecordBaptism: null
    },
    previews: {},
    additionalDocs: {
      baptismPermitFrom: ""
    }
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
      // Clean up object URLs to avoid memory leaks
      Object.values(formData.previews).forEach(url => {
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

    // Validation
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (file.size > MAX_SIZE) {
      toast.error(`File too large (max 10MB): ${file.name}`);
      e.target.value = ''; // Clear the file input
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(`Unsupported file type: ${file.type}`);
      e.target.value = ''; // Clear the file input
      return;
    }

    // Create preview URL
    const fileUrl = URL.createObjectURL(file);

    // Clean up previous preview URL if exists
    if (formData.previews[fieldName]) {
      URL.revokeObjectURL(formData.previews[fieldName]);
    }

    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [fieldName]: file
      },
      previews: {
        ...prev.previews,
        [fieldName]: fileUrl
      }
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
      formDataObj.append('baptismDate', formData.baptismDate);
      formDataObj.append('baptismTime', formData.baptismTime);
      formDataObj.append('phone', formData.phone);
      formDataObj.append('child', JSON.stringify(formData.child));
      formDataObj.append('parents', JSON.stringify(formData.parents));
      formDataObj.append('ninong', JSON.stringify(formData.ninong));
      formDataObj.append('ninang', JSON.stringify(formData.ninang));
      formDataObj.append('NinongGodparents', JSON.stringify(NinongGodparents));
      formDataObj.append('NinangGodparents', JSON.stringify(NinangGodparents));
      formDataObj.append('baptismPermitFrom', formData.additionalDocs.baptismPermitFrom);

      // Append files if they exist
      if (formData.documents.birthCertificate) {
        formDataObj.append('birthCertificate', formData.documents.birthCertificate);
      }
      if (formData.documents.marriageCertificate) {
        formDataObj.append('marriageCertificate', formData.documents.marriageCertificate);
      }
      if (formData.documents.baptismPermit) {
        formDataObj.append('baptismPermit', formData.documents.baptismPermit);
      }
      if (formData.documents.certificateOfNoRecordBaptism) {
        formDataObj.append('certificateOfNoRecordBaptism', formData.documents.certificateOfNoRecordBaptism);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/baptismCreate`,
        formDataObj,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
        }
      );

      toast.success('Form submitted successfully!');

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
          certificateOfNoRecordBaptism: null
        },
        previews: {},
        additionalDocs: {
          baptismPermitFrom: ""
        }
      });
      setNinongGodparents([]);
      setNinangGodparents([]);

    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(error.response?.data?.message || 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const DocumentPreview = ({ file, previewUrl }) => {
    if (!file || !previewUrl) return null;

    return file.type.startsWith('image/') ? (
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
      <div className="mt-2" style={{ width: "100%", height: "300px", marginBottom: "30px" }}>
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
    if (type === 'ninong') {
      setNinongGodparents([...NinongGodparents, { name: "" }]);
    } else {
      setNinangGodparents([...NinangGodparents, { name: "" }]);
    }
  };

  const handleRemoveGodparent = (type, index) => {
    if (type === 'ninong') {
      setNinongGodparents(NinongGodparents.filter((_, i) => i !== index));
    } else {
      setNinangGodparents(NinangGodparents.filter((_, i) => i !== index));
    }
  };

  const handleGodparentChange = (type, index, value) => {
    if (type === 'ninong') {
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
    <div style={{ display: "flex" }}>
      <MetaData title="Baptism Form" />
      <TermsModal
        show={showTermsModal}
        onHide={() => setShowTermsModal(false)}
        onAgree={() => {
          setAgreedToTerms(true);
          setShowTermsModal(false);
        }}
      />
      <div style={{ display: "flex", backgroundColor: "#f9f9f9", width: "100%" }}>
        <GuestSidebar />
        <div className="baptismForm-content">
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", maxWidth: "300px" }}>
              <div>
                <h2 style={{ fontSize: "1.2rem", margin: 0 }}>Click here to see Available Dates</h2>
              </div>
              <Button
                variant="outline-secondary"
                style={{
                  border: "1px solid #aaa",
                  background: "transparent",
                  color: "#333",
                  fontWeight: "bold",
                  borderRadius: 6,
                  padding: "4px 14px",
                  fontSize: "0.95rem",
                  boxShadow: "none"
                }}
                onClick={() => setShowOverlay(true)}
              >
                View Calendar
              </Button>
            </div>
            <ConfirmedBaptismOverlay show={showOverlay} onClose={() => setShowOverlay(false)} />
          </div>
          <h2>Baptism Form</h2>
          <Form onSubmit={handleSubmit}>
            {/* Baptism Date and Time */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Araw ng Binyag (Monday Schedules are NOT Available) </Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.baptismDate}
                    onChange={(e) => handleChange(e, "baptismDate")}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Oras ng Binyag</Form.Label>
                  <Form.Control
                    type="time"
                    value={formData.baptismTime}
                    onChange={(e) => handleChange(e, "baptismTime")}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Child Information */}
            <h4 className="mt-4">Child Information</h4>
            <Form.Group className="mb-3">
              <Form.Label>Buong Pangalan ng Bibinyagan</Form.Label>
              <Form.Control
                type="text"
                value={formData.child.fullName}
                onChange={(e) => handleChange(e, "child.fullName")}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Araw ng Kapanganakan, Lugar ng Kapanganakan, at Kasarian</Form.Label>
              <Row>
                <Col md={4}>
                  <Form.Control
                    type="date"
                    value={formData.child.dateOfBirth}
                    onChange={(e) => handleChange(e, "child.dateOfBirth")}
                    required
                  />
                </Col>
                <Col md={4}>
                  <Form.Control
                    type="text"
                    value={formData.child.placeOfBirth}
                    onChange={(e) => handleChange(e, "child.placeOfBirth")}
                    placeholder="Lugar ng Kapanganakan"
                    required
                  />
                </Col>
                <Col md={4}>
                  <Form.Select
                    value={formData.child.gender}
                    onChange={(e) => handleChange(e, "child.gender")}
                    required
                  >
                    <option value="">-- Piliin ang Kasarian --</option>
                    <option value="Male">Lalaki</option>
                    <option value="Female">Babae</option>
                  </Form.Select>
                </Col>
              </Row>
            </Form.Group>

            {/* Parents Information */}
            <h4 className="mt-4">Magulang ng Bibinyagan</h4>
            <Form.Group className="mb-3">
              <Form.Label>Buong Pangalan ng Ama at Lugar ng Kapanganakan</Form.Label>
              <Row>
                <Col md={6}>
                  <Form.Control
                    type="text"
                    value={formData.parents.fatherFullName}
                    onChange={(e) => handleChange(e, "parents.fatherFullName")}
                    placeholder="Buong Pangalan ng Ama"
                    required
                  />
                </Col>
                <Col md={6}>
                  <Form.Control
                    type="text"
                    value={formData.parents.placeOfFathersBirth}
                    onChange={(e) => handleChange(e, "parents.placeOfFathersBirth")}
                    placeholder="Lugar ng Kapanganakan"
                    required
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Buong Pangalan ng Ina at Lugar ng Kapanganakan</Form.Label>
              <Row>
                <Col md={6}>
                  <Form.Control
                    type="text"
                    value={formData.parents.motherFullName}
                    onChange={(e) => handleChange(e, "parents.motherFullName")}
                    placeholder="Buong Pangalan ng Ina"
                    required
                  />
                </Col>
                <Col md={6}>
                  <Form.Control
                    type="text"
                    value={formData.parents.placeOfMothersBirth}
                    onChange={(e) => handleChange(e, "parents.placeOfMothersBirth")}
                    placeholder="Lugar ng Kapanganakan"
                    required
                  />
                </Col>
              </Row>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tirahan, Contact Number, at Saan Kasal</Form.Label>
              <Row>
                <Col md={6}>
                  <Form.Control
                    type="text"
                    value={formData.parents.address}
                    onChange={(e) => handleChange(e, "parents.address")}
                    placeholder="Tirahan"
                    required
                  />
                </Col>
                <Col md={3}>
                  <Form.Control
                    type="text"
                    value={formData.phone}
                    onChange={(e) => handleChange(e, "phone")}
                    placeholder="Contact Number"
                    required
                  />
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={formData.parents.marriageStatus}
                    onChange={(e) => handleChange(e, "parents.marriageStatus")}
                    required
                  >
                    <option value="">-- Saan Kasal --</option>
                    <option value="Simbahan">Simbahan (Katoliko)</option>
                    <option value="Civil">Civil (Huwes)</option>
                    <option value="Nat">Nat (Hindi Kasal)</option>
                  </Form.Select>
                </Col>
              </Row>
            </Form.Group>

            {/* Ninong */}
            <h4 className="mt-4">Ninong</h4>
            <Form.Group className="mb-3">
              <Form.Label>Pangalan, Tirahan, at Relihiyon</Form.Label>
              <Row>
                <Col md={5}>
                  <Form.Control
                    type="text"
                    value={formData.ninong.name}
                    onChange={(e) => handleChange(e, "ninong.name")}
                    placeholder="Pangalan"
                    required
                  />
                </Col>
                <Col md={5}>
                  <Form.Control
                    type="text"
                    value={formData.ninong.address}
                    onChange={(e) => handleChange(e, "ninong.address")}
                    placeholder="Tirahan"
                    required
                  />
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="text"
                    value={formData.ninong.religion}
                    onChange={(e) => handleChange(e, "ninong.religion")}
                    placeholder="Relihiyon"
                    required
                  />
                </Col>
              </Row>
            </Form.Group>

            {/* Ninang */}
            <h4 className="mt-4">Ninang</h4>
            <Form.Group className="mb-3">
              <Form.Label>Pangalan, Tirahan, at Relihiyon</Form.Label>
              <Row>
                <Col md={5}>
                  <Form.Control
                    type="text"
                    value={formData.ninang.name}
                    onChange={(e) => handleChange(e, "ninang.name")}
                    placeholder="Pangalan"
                    required
                  />
                </Col>
                <Col md={5}>
                  <Form.Control
                    type="text"
                    value={formData.ninang.address}
                    onChange={(e) => handleChange(e, "ninang.address")}
                    placeholder="Tirahan"
                    required
                  />
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="text"
                    value={formData.ninang.religion}
                    onChange={(e) => handleChange(e, "ninang.religion")}
                    placeholder="Relihiyon"
                    required
                  />
                </Col>
              </Row>
            </Form.Group>

            {/* Secondary Ninong */}
            <h4 className="mt-4">Secondary Ninong</h4>
            {NinongGodparents.map((godparent, index) => (
              <Row key={`ninong-${index}`} className="mb-2">
                <Col md={10}>
                  <Form.Control
                    type="text"
                    value={godparent.name}
                    onChange={(e) => handleGodparentChange('ninong', index, e.target.value)}
                    placeholder="Pangalan ng Ninong"
                  />
                </Col>
                <Col md={2} className="d-flex align-items-center">
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveGodparent('ninong', index)}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            ))}
            <Button
              variant="secondary"
              onClick={() => handleAddGodparent('ninong')}
              className="mb-4"
            >
              Add Secondary Ninong
            </Button>

            {/* Secondary Ninang */}
            <h4 className="mt-4">Secondary Ninang</h4>
            {NinangGodparents.map((godparent, index) => (
              <Row key={`ninang-${index}`} className="mb-2">
                <Col md={10}>
                  <Form.Control
                    type="text"
                    value={godparent.name}
                    onChange={(e) => handleGodparentChange('ninang', index, e.target.value)}
                    placeholder="Pangalan ng Ninang"
                  />
                </Col>
                <Col md={2} className="d-flex align-items-center">
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveGodparent('ninang', index)}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            ))}
            <Button
              variant="secondary"
              onClick={() => handleAddGodparent('ninang')}
              className="mb-4"
            >
              Add Secondary Ninang
            </Button>

            {/* Required Documents */}
            <h4 className="mt-4">Required Documents</h4>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-danger">Birth Certificate *</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => handleFileChange(e, 'birthCertificate')}
                accept="image/*,.pdf,.doc,.docx"
                required
              />
              <DocumentPreview
                file={formData.documents.birthCertificate}
                previewUrl={formData.previews.birthCertificate}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-danger">Marriage Certificate *</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => handleFileChange(e, 'marriageCertificate')}
                accept="image/*,.pdf,.doc,.docx"
                required
              />
              <DocumentPreview
                file={formData.documents.marriageCertificate}
                previewUrl={formData.previews.marriageCertificate}
              />
            </Form.Group>

            {/* Additional Documents */}
            <h4 className="mt-4">Additional Documents</h4>

            <Form.Group className="mb-4">
              <Form.Label>Baptism Permit From:</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter issuing parish"
                value={formData.additionalDocs.baptismPermitFrom}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  additionalDocs: {
                    ...prev.additionalDocs,
                    baptismPermitFrom: e.target.value
                  }
                }))}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Baptism Permit (FOR NON-PARISHIONERS)</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => handleFileChange(e, 'baptismPermit')}
                accept="image/*,.pdf,.doc,.docx"
              />
              <DocumentPreview
                file={formData.documents.baptismPermit}
                previewUrl={formData.previews.baptismPermit}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Certificate Of No Record of Baptism (FOR 2 YEARS OLD AND ABOVE)</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => handleFileChange(e, 'certificateOfNoRecordBaptism')}
                accept="image/*,.pdf,.doc,.docx"
              />
              <DocumentPreview
                file={formData.documents.certificateOfNoRecordBaptism}
                previewUrl={formData.previews.certificateOfNoRecordBaptism}
              />
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <Form.Check
                type="checkbox"
                label="I agree to the terms and conditions"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                required
              />
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default BaptismForm;