import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import GuestSidebar from "../../../../GuestSideBar";
import { getToken } from "../../../../../Utils/helpers";
import "./MassBaptismForms.css";

const MassBaptismForm = () => {
  const [user, setUser] = useState(null);
  const [baptismDates, setBaptismDates] = useState([]);
  const [selectedBaptismDate, setSelectedBaptismDate] = useState("");
  const [NinongGodparents, setNinongGodparents] = useState([]); 
  const [NinangGodparents, setNinangGodparents] = useState([]); 
  const [showPreviewModal, setShowPreviewModal] = useState(false); 
  const [filePreview, setFilePreview] = useState("");
  const [filePreviewType, setFilePreviewType] = useState(""); 

  const [formData, setFormData] = useState({
    baptismDateTime: "",
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
    ninong: {
      name: "",
      address: "",
      religion: "",
    },
    ninang: {
      name: "",
      address: "",
      religion: "",
    },
    Docs: {
      birthCertificate: [],
      marriageCertificate: [],
    },
    additionalDocs: {
      baptismPermitFrom: "",
      baptismPermit: [],
      certificateOfNoRecordBaptism: [],
    },
  });

  const config = { withCredentials: true };

  // Fetch User Details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/profile`,
          config
        );
        console.log("User Data:", response.data);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchBaptismDates = async () => {
      try {
        const category = "Baptism"; // Define the category here
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/getActiveDatesByCategory/${category}`,
          config
        );
        setBaptismDates(response.data);

        if (response.data.length > 0) {
          setSelectedBaptismDate(response.data[0]);
          setFormData((prev) => ({
            ...prev,
            baptismDateTime: response.data[0]._id,
          }));
          
        }
      } catch (error) {
        console.error("Error fetching baptism dates:", error);
      }
    };

    fetchBaptismDates();
  }, []);

  const handleChange = (e, fieldPath) => {
    const keys = fieldPath.split(".");
    setFormData((prev) => {
      const updated = { ...prev };
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = e.target.value;
      return { ...updated };
    });
  };

  const handleFileChange = (e, docType, isOptional = false) => {
    const files = Array.from(e.target.files);
    const updatedDocs = isOptional ? { ...formData.additionalDocs } : { ...formData.Docs };
  
    updatedDocs[docType] = isOptional ? files : files.slice(0, 1);
  
    setFormData((prev) => ({
      ...prev,
      [isOptional ? "additionalDocs" : "Docs"]: updatedDocs,
    }));
  };
  
  const handlePreview = (url, type) => {
    setFilePreview(url);
    setFilePreviewType(type);
    setShowPreviewModal(true);
  };

  const appendFiles = (formData, key, files) => {
    if (files && files.length > 0) {
      files.forEach(file => formData.append(key, file)); 
    } else {
      console.error(`No files found for ${key}`);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting formData:", formData);

    try {
        const formDataObj = new FormData();

        if (formData.Docs.birthCertificate?.length > 0) {
            formDataObj.append("birthCertificate", formData.Docs.birthCertificate[0]);
        }
        if (formData.Docs.marriageCertificate?.length > 0) {
            formDataObj.append("marriageCertificate", formData.Docs.marriageCertificate[0]);
        }

        if (formData.additionalDocs?.baptismPermitFrom?.trim()) {
            formDataObj.append("baptismPermitFrom", formData.additionalDocs.baptismPermitFrom);
        }

        if (formData.additionalDocs?.baptismPermit?.length > 0) {
            formData.additionalDocs.baptismPermit.forEach((file) => {
                formDataObj.append("baptismPermit", file);
            });
        }

        if (formData.additionalDocs?.certificateOfNoRecordBaptism?.length > 0) {
            formData.additionalDocs.certificateOfNoRecordBaptism.forEach((file) => {
                formDataObj.append("certificateOfNoRecordBaptism", file);
            });
        }

        for (let key in formData) {
            if (formData.hasOwnProperty(key) && key !== "Docs" && key !== "additionalDocs") {
                const value = formData[key];
                formDataObj.append(key, typeof value === "object" ? JSON.stringify(value) : value);
            }
        }

        console.log("FormData Before Sending:");
        for (let [key, value] of formDataObj.entries()) {
            console.log(key, value);
        }

        const response = await axios.post(
            `${process.env.REACT_APP_API}/api/v1/massBaptismCreate`,
            formDataObj,
            { withCredentials: true }
        );

        console.log("Response:", response.data);
        toast.success("Form submitted successfully!");

        setFormData({
            baptismDateTime: "",
            phone: "",
            child: { fullName: "", dateOfBirth: "", placeOfBirth: "", gender: "" },
            parents: { fatherFullName: "", placeOfFathersBirth: "", motherFullName: "", placeOfMothersBirth: "", address: "", marriageStatus: "" },
            ninong: { name: "", address: "", religion: "" },
            ninang: { name: "", address: "", religion: "" },
            Docs: { birthCertificate: [], marriageCertificate: [] },
            additionalDocs: {
                baptismPermitFrom: "",
                baptismPermit: [],
                certificateOfNoRecordBaptism: [],
            },
        });

    } catch (error) {
        console.error("Error submitting form:", error.response ? error.response.data : error.message);
        toast.error("Failed to submit form. Please try again.");
    }
};

  

  return (
    <div className="baptismForm-container mt-4">
      <div className="baptismForm-sidebar">
        <GuestSidebar />
      </div>

      <div className="baptismForm-content">
        <h2>Baptism Form</h2>
        <Form onSubmit={handleSubmit}>
          {/* Baptism Date and Time */}
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Baptism Date and Time</Form.Label>
                <Form.Control
                  type="text"
                  value={
                    selectedBaptismDate
                      ? `${new Date(
                          selectedBaptismDate.date
                        ).toLocaleDateString()} - ${selectedBaptismDate.time}`
                      : ""
                  }
                  disabled
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Child Information */}
          <h4 className="mt-4">Child Information</h4>
          <Form.Group>
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.child.fullName}
              onChange={(e) => handleChange(e, "child.fullName")}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Date of Birth</Form.Label>
            <Form.Control
              type="date"
              value={formData.child.dateOfBirth}
              onChange={(e) => handleChange(e, "child.dateOfBirth")}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Place of Birth</Form.Label>
            <Form.Control
              type="text"
              value={formData.child.placeOfBirth}
              onChange={(e) => handleChange(e, "child.placeOfBirth")}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Gender</Form.Label>
            <Form.Select
              value={formData.child.gender}
              onChange={(e) => handleChange(e, "child.gender")}
            >
              <option value="">-- Select Gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Select>
          </Form.Group>

          {/* Parents Information */}
          <h4 className="mt-4">Parents Information</h4>
          <Form.Group>
            <Form.Label>Father's Full Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.parents.fatherFullName}
              onChange={(e) => handleChange(e, "parents.fatherFullName")}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Mother's Full Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.parents.motherFullName}
              onChange={(e) => handleChange(e, "parents.motherFullName")}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Father's Place of Birth</Form.Label>
            <Form.Control
              type="text"
              value={formData.parents.placeOfFathersBirth}
              onChange={(e) => handleChange(e, "parents.placeOfFathersBirth")}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Mother's Place of Birth</Form.Label>
            <Form.Control
              type="text"
              value={formData.parents.placeOfMothersBirth}
              onChange={(e) => handleChange(e, "parents.placeOfMothersBirth")}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              value={formData.parents.address}
              onChange={(e) => handleChange(e, "parents.address")}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Contact Number</Form.Label>
            <Form.Control
              type="text"
              value={formData.phone}
              onChange={(e) => handleChange(e, "phone")}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Marriage Status</Form.Label>
            <Form.Select
              value={formData.parents.marriageStatus}
              onChange={(e) => handleChange(e, "parents.marriageStatus")}
            >
              <option value="">-- Select Marriage Status --</option>
              <option value="Church">Church (Catholic)</option>
              <option value="Civil">Civil (Judge)</option>
              <option value="Not Married">Not Married</option>
            </Form.Select>
          </Form.Group>

          {/* Godparents - Ninong */}
          <h4 className="mt-4">Godfather (Ninong)</h4>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.ninong.name}
              onChange={(e) => handleChange(e, "ninong.name")}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              value={formData.ninong.address}
              onChange={(e) => handleChange(e, "ninong.address")}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Religion</Form.Label>
            <Form.Control
              type="text"
              value={formData.ninong.religion}
              onChange={(e) => handleChange(e, "ninong.religion")}
            />
          </Form.Group>

          {/* Godparents - Ninang */}
          <h4 className="mt-4">GodMother (Ninang)</h4>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={formData.ninang.name}
              onChange={(e) => handleChange(e, "ninang.name")}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              value={formData.ninang.address}
              onChange={(e) => handleChange(e, "ninang.address")}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Religion</Form.Label>
            <Form.Control
              type="text"
              value={formData.ninang.religion}
              onChange={(e) => handleChange(e, "ninang.religion")}
            />
          </Form.Group>

          {/* Secondary Ninong */}
          <h4 className="mt-4">Secondary Godfather (Ninong)</h4>
          {NinongGodparents.map((item, index) => (
            <div key={index}>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const updatedNinongGodparents = [...NinongGodparents];
                        updatedNinongGodparents[index].name = e.target.value;
                        setNinongGodparents(updatedNinongGodparents);
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col className="d-flex align-items-center">
                  <Button
                    variant="danger"
                    onClick={() => {
                      const updatedNinongGodparents = NinongGodparents.filter(
                        (_, i) => i !== index
                      );
                      setNinongGodparents(updatedNinongGodparents);
                    }}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            </div>
          ))}
          <Button
            variant="secondary"
            onClick={() =>
              setNinongGodparents([...NinongGodparents, { name: "" }])
            }
          >
            Add Secondary Ninong
          </Button>

          {/* Secondary Ninang */}
          <h4 className="mt-4">Secondary Godmother (Ninang)</h4>
          {NinangGodparents.map((item, index) => (
            <div key={index}>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={item.name}
                      onChange={(e) => {
                        const updatedNinangGodparents = [...NinangGodparents];
                        updatedNinangGodparents[index].name = e.target.value;
                        setNinangGodparents(updatedNinangGodparents);
                      }}
                    />
                  </Form.Group>
                </Col>
                <Col className="d-flex align-items-center">
                  <Button
                    variant="danger"
                    onClick={() => {
                      const updatedNinangGodparents = NinangGodparents.filter(
                        (_, i) => i !== index
                      );
                      setNinangGodparents(updatedNinangGodparents);
                    }}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            </div>
          ))}
          <Button
            variant="secondary"
            onClick={() =>
              setNinangGodparents([...NinangGodparents, { name: "" }])
            }
          >
            Add Secondary Ninang
          </Button>

          {/* Required Documents */}
          <h4 className="mt-4">Required Documents</h4>
          {["birthCertificate", "marriageCertificate"].map((docType) => (
            <Form.Group key={docType}>
              <Form.Label className="fw-bold text-danger">
                {docType.replace(/([A-Z])/g, " $1").trim()} *
              </Form.Label>
              <Form.Control type="file" onChange={(e) => handleFileChange(e, docType)} required />

              <div className="mt-2">
                {formData.Docs[docType]?.map((file, index) => (
                  <Button
                    key={index}
                    variant="link"
                    onClick={() => handlePreview(file.url, file.type)}
                  >
                    {file.public_id || file.name}
                  </Button>
                ))}
              </div>
            </Form.Group>
          ))}

          {/* Optional Documents */}
          <h4 className="mt-4">Additional Documents</h4>
          <Form.Group>
            <Form.Label className="fw-bold">Baptism Permit From:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter issuing parish"
              value={formData.additionalDocs.baptismPermitFrom}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  additionalDocs: {
                    ...prevData.additionalDocs,
                    baptismPermitFrom: e.target.value,
                  },
                }))
              }
            />
          </Form.Group>

          {[
            {
              key: "baptismPermit",
              label: "Baptism Permit (FOR NON-PARISHIONERS)",
            },
            {
              key: "certificateOfNoRecordBaptism",
              label:
                "Certificate Of No Record of Baptism (FOR 2 YEARS OLD AND ABOVE)",
            },
          ].map(({ key, label }) => (
            <Form.Group key={key} className="mt-3">
              <Form.Label className="fw-bold">{label}</Form.Label>
              <Form.Control
                type="file"
                multiple
                onChange={(e) => handleFileChange(e, key, true)}
              />
              <div className="mt-2">
                {formData.additionalDocs[key]?.map((file, index) => (
                  <Button
                    key={index}
                    variant="link"
                    onClick={() => handlePreview(file.url, file.type)}
                  >
                    {file.public_id || file.name}
                  </Button>
                ))}
              </div>
            </Form.Group>
          ))}

          {/* Submit Button */}
          <Button type="submit" className="mt-4">
            Submit
          </Button>
        </Form>

        {/* Preview Modal */}
        <Modal
          show={showPreviewModal}
          onHide={() => setShowPreviewModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Preview</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {filePreviewType === "image" ? (
              <img src={filePreview} alt="Preview" className="img-fluid" />
            ) : (
              <iframe
                src={filePreview}
                title="Preview"
                className="w-100"
                style={{ height: "400px" }}
              />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowPreviewModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default MassBaptismForm;
