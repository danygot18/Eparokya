import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import GuestSidebar from "../../../../GuestSideBar";
import MetaData from "../../../../Layout/MetaData";
import ConfirmedWeddingModal from "./ConfirmedWeddingModal";
import { Modal as BsModal } from "react-bootstrap";
// import termsAndConditionsText from "../../../../Term";

const WeddingForm = () => {
  const [formData, setFormData] = useState({
    dateOfApplication: "",
    weddingDate: "",
    weddingTime: "",
    weddingTheme: "",
    groomName: "",
    groomAddress: {
      BldgNameTower: "",
      LotBlockPhaseHouseNo: "",
      SubdivisionVillageZone: "",
      Street: "",
      District: "",
      barangay: "",
      city: "",
    },
    groomPhone: "",
    groomBirthDate: "",
    groomOccupation: "",
    groomReligion: "",
    groomFather: "",
    groomMother: "",
    brideName: "",
    brideAddress: {
      BldgNameTower: "",
      LotBlockPhaseHouseNo: "",
      SubdivisionVillageZone: "",
      Street: "",
      District: "",
      barangay: "",
      city: "",
    },
    bridePhone: "",
    brideBirthDate: "",
    brideOccupation: "",
    brideReligion: "",
    brideFather: "",
    brideMother: "",
    Ninong: [{ name: "", address: { street: "", zip: "", city: "" } }],
    Ninang: [{ name: "", address: { street: "", zip: "", city: "" } }],
    GroomNewBaptismalCertificate: "",
    GroomNewConfirmationCertificate: "",
    GroomMarriageLicense: "",
    GroomMarriageBans: "",
    GroomOrigCeNoMar: "",
    GroomOrigPSA: "",
    GroomPermitFromtheParishOftheBride: "",
    GroomChildBirthCertificate: "",
    GroomOneByOne: "",
    BrideNewBaptismalCertificate: "",
    BrideNewConfirmationCertificate: "",
    BrideMarriageLicense: "",
    BrideMarriageBans: "",
    BrideOrigCeNoMar: "",
    BrideOrigPSA: "",
    BridePermitFromtheParishOftheBride: "",
    BrideChildBirthCertificate: "",
    BrideOneByOne: "",
    documents: {}, // Stores File objects
    previews: {},
  });
  const [isMarried, setIsMarried] = useState(false);
  const [showMarriedDialog, setShowMarriedDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const config = {
    withCredentials: true,
  };
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const FileUploadField = ({
    name,
    label,
    required,
    value,
    preview,
    onChange,
  }) => (
    <Form.Group className="mb-3">
      <Form.Label>
        {label} {required && <span className="text-danger">*</span>}
      </Form.Label>
      <Form.Control
        type="file"
        name={name}
        onChange={onChange}
        accept="image/*,.pdf,.doc,.docx"
        required={required}
      />
      {preview && (
        <div className="mt-2">
          {value?.type?.startsWith("image/") ? (
            <img
              src={preview}
              alt="Preview"
              className="img-thumbnail"
              style={{ maxHeight: "100px" }}
            />
          ) : (
            <div className="border p-2">
              <i className="fas fa-file me-2"></i>
              {value?.name}
            </div>
          )}
        </div>
      )}
    </Form.Group>
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/profile`,
          config
        );
        setUser(response.data.user);
        if (response.data.user.civilStatus === "Married") {
          setIsMarried(true);
          setShowMarriedDialog(true);
        }
      } catch (error) {
        console.error(
          "Error fetching user:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchUser();
  }, []);

  const addNinong = () => {
    setFormData((prev) => ({
      ...prev,
      Ninong: [
        ...prev.Ninong,
        { name: "", address: { street: "", zip: "", city: "" } },
      ],
    }));
  };
  const addNinang = () => {
    setFormData((prev) => ({
      ...prev,
      Ninang: [
        ...prev.Ninang,
        { name: "", address: { street: "", zip: "", city: "" } },
      ],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNestedChange = (e, field, index, subField) => {
    const { value } = e.target;

    setFormData((prev) => {
      if (index !== null) {
        const updatedArray = [...prev[field]];

        if (!updatedArray[index].address) {
          updatedArray[index].address = { street: "", zip: "", city: "" };
        }

        if (subField) {
          updatedArray[index].address[subField] = value;
        } else {
          updatedArray[index] = { ...updatedArray[index], name: value };
        }

        return { ...prev, [field]: updatedArray };
      } else {
        return {
          ...prev,
          [field]: {
            ...prev[field],
            [subField]: value,
          },
        };
      }
    });
  };

  // console.log("Form data:", formData);
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;

    // Validate file
    const MAX_SIZE = 10 * 1024 * 1024;
    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/png",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (file.size > MAX_SIZE) {
      toast.error(`File too large (max 10MB): ${file.name}`);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(`Unsupported file type: ${file.type}`);
      return;
    }

    const fileUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [name]: file,
      },
      previews: {
        ...prev.previews,
        [name]: file.type.startsWith("image/")
          ? fileUrl // Use object URL for images
          : fileUrl, // Also use object URL for PDFs (works better in iframes)
      },
    }));
  };

  const handleClearFields = () => {
    setFormData({
      dateOfApplication: "",
      weddingDate: "",
      weddingTime: "",
      weddingTheme: "",
      groomName: "",
      groomAddress: "",
      brideName: "",
      brideAddress: "",
      Ninong: [],
      Ninang: [],
      images: {},
    });
  };

  const handleCityChange = (e, addressType) => {
    const selectedCity = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        city: selectedCity,
        customCity: selectedCity === "Others" ? "" : undefined, // Clear if not "Others"
      },
    }));
  };

  const handleCustomCityChange = (e, addressType) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        customCity: value,
      },
    }));
  };

  const handleBarangayChange = (e, addressType) => {
    const selectedBarangay = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [addressType]: {
        ...prev[addressType],
        barangay: selectedBarangay,
      },
    }));

    if (selectedBarangay === "Others") {
      setCustomBarangay("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (isMarried) {
      toast.error('Sorry, but a "Married" user cannot submit an application.');
      setIsSubmitting(false);
      return;
    }

    // Match backend required documents exactly
    const REQUIRED_DOCUMENTS = [
      "GroomNewBaptismalCertificate",
      "GroomNewConfirmationCertificate",
      "GroomMarriageLicense",
      "GroomMarriageBans",
      "GroomOrigCeNoMar",
      "GroomOrigPSA",
      "GroomPermitFromtheParishOftheBride",
      "GroomChildBirthCertificate",
      "GroomOneByOne",
      "BrideNewBaptismalCertificate",
      "BrideNewConfirmationCertificate",
      "BrideMarriageLicense",
      "BrideMarriageBans",
      "BrideOrigCeNoMar",
      "BrideOrigPSA",
      "BridePermitFromtheParishOftheBride",
      "BrideChildBirthCertificate",
      "BrideOneByOne",
    ];

    const missingDocuments = REQUIRED_DOCUMENTS.filter(
      (field) => !formData.documents[field]
    );

    if (missingDocuments.length > 0) {
      toast.error(`Missing required documents: ${missingDocuments.join(", ")}`);
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataObj = new FormData();

      // Append documents
      Object.entries(formData.documents).forEach(([fieldName, file]) => {
        if (file) {
          formDataObj.append(fieldName, file);
        }
      });

      // Append other fields
      const { documents, previews, ...otherData } = formData;
      Object.entries(otherData).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          formDataObj.append(key, JSON.stringify(value));
        } else {
          formDataObj.append(key, value);
        }
      });

      // Submit the form
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/submitWeddingForm`,
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      toast.success("Wedding form submitted successfully!");
      setIsSubmitting(false);
      // Optionally reset form state here
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong during submission."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <MetaData title="Wedding Form" />
      <div
        style={{ display: "flex", backgroundColor: "#f9f9f9", width: "100%" }}
      >
        <GuestSidebar />
        <div
          style={{
            marginLeft: "20px",
            padding: "20px",
            width: "calc(100% - 270px)",
          }}
        >
          {/* Married User Dialog */}
          <BsModal
            show={showMarriedDialog}
            onHide={() => setShowMarriedDialog(false)}
            centered
            backdrop={false} // No gray overlay
          >
            <BsModal.Header closeButton>
              <BsModal.Title>Notice</BsModal.Title>
            </BsModal.Header>
            <BsModal.Body>
              <div
                style={{
                  color: "red",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Sorry, but a "Married" user cannot submit an application. <br />
                Paumanhin, ang "kasal" ay hindi maaring mag-sagot ng
                applikasyon.
              </div>
            </BsModal.Body>
            <BsModal.Footer style={{ justifyContent: "center" }}>
              <Button
                variant="secondary"
                onClick={() => setShowMarriedDialog(false)}
              >
                Close
              </Button>
            </BsModal.Footer>
          </BsModal>

          {/* wedding calendar */}
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            style={{ paddingLeft: "30px" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  maxWidth: "300px",
                }}
              >
                <div>
                  <h2 style={{ fontSize: "1.2rem", margin: 0 }}>
                    Click here to see Available Dates
                  </h2>
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
                    boxShadow: "none",
                  }}
                  onClick={() => setShowOverlay(true)}
                >
                  View Calendar
                </Button>
              </div>
              <ConfirmedWeddingModal
                show={showOverlay}
                onClose={() => setShowOverlay(false)}
              />
            </div>

            <h2>Wedding Form</h2>
            {/* Wedding Date & Time */}
            <Form.Group>
              <Form.Label>Date of Application</Form.Label>
              <Form.Control
                type="date"
                name="dateOfApplication"
                value={formData.dateOfApplication}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                Wedding Date (Monday Schedules are NOT Available)
              </Form.Label>
              <Form.Control
                type="date"
                name="weddingDate"
                value={formData.weddingDate}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Wedding Time</Form.Label>
              <Form.Control
                type="time"
                name="weddingTime"
                value={formData.weddingTime}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Wedding Theme</Form.Label>
              <Form.Control
                type="text"
                name="weddingTheme"
                value={formData.weddingTheme}
                onChange={handleChange}
                required
              />
            </Form.Group>

            {/* Groom's Information */}
            <fieldset className="form-group">
              <legend>Groom's Info</legend>

              <Form.Group>
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="groomName"
                  value={formData.groomName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Address</Form.Label>

                <Row>
                  <Col>
                    <Form.Label>Building Name/Tower</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.groomAddress.BldgNameTower}
                      onChange={(e) =>
                        handleNestedChange(
                          e,
                          "groomAddress",
                          null,
                          "BldgNameTower"
                        )
                      }
                    />
                  </Col>
                  <Col>
                    <Form.Label>Lot/Block/Phase/House No.</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.groomAddress.LotBlockPhaseHouseNo}
                      onChange={(e) =>
                        handleNestedChange(
                          e,
                          "groomAddress",
                          null,
                          "LotBlockPhaseHouseNo"
                        )
                      }
                    />
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Label>Subdivision/Village/Zone</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.groomAddress.SubdivisionVillageZone}
                      onChange={(e) =>
                        handleNestedChange(
                          e,
                          "groomAddress",
                          null,
                          "SubdivisionVillageZone"
                        )
                      }
                    />
                  </Col>
                  <Col>
                    <Form.Label>Street</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.groomAddress.Street}
                      onChange={(e) =>
                        handleNestedChange(e, "groomAddress", null, "Street")
                      }
                    />
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Label>Barangay</Form.Label>
                    <Form.Select
                      value={formData.groomAddress.barangay}
                      onChange={(e) => handleBarangayChange(e, "groomAddress")}
                    >
                      <option value="">Select Barangay</option>
                      {barangays.map((barangay) => (
                        <option key={barangay} value={barangay}>
                          {barangay}
                        </option>
                      ))}
                    </Form.Select>

                    {formData.groomAddress.barangay === "Others" && (
                      <>
                        <Form.Label>Add Barangay</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your barangay"
                          value={customBarangay}
                          onChange={(e) => setCustomBarangay(e.target.value)}
                        />
                      </>
                    )}
                  </Col>
                  <Col>
                    <Form.Label>City</Form.Label>
                    <Form.Select
                      value={formData.groomAddress.city}
                      onChange={(e) => handleCityChange(e, "groomAddress")}
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </Form.Select>

                    {formData.groomAddress.city === "Others" && (
                      <>
                        <Form.Label>Add City</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your city"
                          value={formData.groomAddress.customCity || ""}
                          onChange={(e) =>
                            handleCustomCityChange(e, "groomAddress")
                          }
                        />
                      </>
                    )}
                  </Col>
                  <Col>
                    <Form.Label>District</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.groomAddress.District}
                      onChange={(e) =>
                        handleNestedChange(e, "groomAddress", null, "District")
                      }
                    />
                  </Col>
                </Row>
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="groomPhone"
                      value={formData.groomPhone}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Birthday</Form.Label>
                    <Form.Control
                      type="date"
                      name="groomBirthDate"
                      value={formData.groomBirthDate}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Occupation</Form.Label>
                    <Form.Control
                      type="text"
                      name="groomOccupation"
                      value={formData.groomOccupation}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Religion</Form.Label>
                    <Form.Control
                      type="text"
                      name="groomReligion"
                      value={formData.groomReligion}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Father</Form.Label>
                    <Form.Control
                      type="text"
                      name="groomFather"
                      value={formData.groomFather}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Mother</Form.Label>
                    <Form.Control
                      type="text"
                      name="groomMother"
                      value={formData.groomMother}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>
            {/* Bride's Information */}
            <fieldset className="form-group">
              <legend>Bride's Info</legend>

              <Form.Group>
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="brideName"
                  value={formData.brideName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Address</Form.Label>

                <Row>
                  <Col>
                    <Form.Label>Building Name/Tower</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.brideAddress.BldgNameTower}
                      onChange={(e) =>
                        handleNestedChange(
                          e,
                          "brideAddress",
                          null,
                          "BldgNameTower"
                        )
                      }
                    />
                  </Col>
                  <Col>
                    <Form.Label>Lot/Block/Phase/House No.</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.brideAddress.LotBlockPhaseHouseNo}
                      onChange={(e) =>
                        handleNestedChange(
                          e,
                          "brideAddress",
                          null,
                          "LotBlockPhaseHouseNo"
                        )
                      }
                    />
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Label>Subdivision/Village/Zone</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.brideAddress.SubdivisionVillageZone}
                      onChange={(e) =>
                        handleNestedChange(
                          e,
                          "brideAddress",
                          null,
                          "SubdivisionVillageZone"
                        )
                      }
                    />
                  </Col>
                  <Col>
                    <Form.Label>Street</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.brideAddress.Street}
                      onChange={(e) =>
                        handleNestedChange(e, "brideAddress", null, "Street")
                      }
                    />
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Label>Barangay</Form.Label>
                    <Form.Select
                      value={formData.brideAddress.barangay}
                      onChange={(e) => handleBarangayChange(e, "brideAddress")}
                    >
                      <option value="">Select Barangay</option>
                      {barangays.map((barangay) => (
                        <option key={barangay} value={barangay}>
                          {barangay}
                        </option>
                      ))}
                    </Form.Select>

                    {formData.brideAddress.barangay === "Others" && (
                      <>
                        <Form.Label>Add Barangay</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your barangay"
                          value={customBarangay}
                          onChange={(e) => setCustomBarangay(e.target.value)}
                        />
                      </>
                    )}
                  </Col>
                  <Col>
                    <Form.Label>City</Form.Label>
                    <Form.Select
                      value={formData.brideAddress.city}
                      onChange={(e) => handleCityChange(e, "brideAddress")}
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </Form.Select>

                    {formData.brideAddress.city === "Others" && (
                      <>
                        <Form.Label>Add City</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter your city"
                          value={formData.brideAddress.customCity || ""}
                          onChange={(e) =>
                            handleCustomCityChange(e, "brideAddress")
                          }
                        />
                      </>
                    )}
                  </Col>
                  <Col>
                    <Form.Label>District</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.brideAddress.District}
                      onChange={(e) =>
                        handleNestedChange(e, "brideAddress", null, "District")
                      }
                    />
                  </Col>
                </Row>
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="bridePhone"
                      value={formData.bridePhone}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Birthday</Form.Label>
                    <Form.Control
                      type="date"
                      name="brideBirthDate"
                      value={formData.brideBirthDate}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Occupation</Form.Label>
                    <Form.Control
                      type="text"
                      name="brideOccupation"
                      value={formData.brideOccupation}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Religion</Form.Label>
                    <Form.Control
                      type="text"
                      name="brideReligion"
                      value={formData.brideReligion}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Father</Form.Label>
                    <Form.Control
                      type="text"
                      name="brideFather"
                      value={formData.brideFather}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Mother</Form.Label>
                    <Form.Control
                      type="text"
                      name="brideMother"
                      value={formData.brideMother}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>

            {/* Ninong Section */}
            <fieldset className="form-group">
              <legend>Ninong</legend>
              {formData.Ninong.map((ninong, index) => (
                <div key={index}>
                  <Form.Group className="mb-2">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Full Name"
                      value={ninong.name}
                      onChange={(e) => handleNestedChange(e, "Ninong", index)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Row>
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Street"
                          value={ninong.address.street}
                          onChange={(e) =>
                            handleNestedChange(e, "Ninong", index, "street")
                          }
                          required
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Zip"
                          value={ninong.address.zip}
                          onChange={(e) =>
                            handleNestedChange(e, "Ninong", index, "zip")
                          }
                          required
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="City"
                          value={ninong.address.city}
                          onChange={(e) =>
                            handleNestedChange(e, "Ninong", index, "city")
                          }
                          required
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                </div>
              ))}
              <button type="button" onClick={addNinong}>
                Add Ninong
              </button>
            </fieldset>

            {/* Ninang Section */}
            <fieldset className="form-group">
              <legend>Ninang</legend>
              {formData.Ninang.map((ninang, index) => (
                <div key={index}>
                  <Form.Group className="mb-2">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Full Name"
                      value={ninang.name}
                      onChange={(e) => handleNestedChange(e, "Ninang", index)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Row>
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Street"
                          value={ninang.address.street}
                          onChange={(e) =>
                            handleNestedChange(e, "Ninang", index, "street")
                          }
                          required
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="Zip"
                          value={ninang.address.zip}
                          onChange={(e) =>
                            handleNestedChange(e, "Ninang", index, "zip")
                          }
                          required
                        />
                      </Col>
                      <Col>
                        <Form.Control
                          type="text"
                          placeholder="City"
                          value={ninang.address.city}
                          onChange={(e) =>
                            handleNestedChange(e, "Ninang", index, "city")
                          }
                          required
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                </div>
              ))}
              <button type="button" onClick={addNinang}>
                Add Ninang
              </button>
            </fieldset>

            {/* File Uploads */}
            <fieldset className="form-group">
              <legend>Upload Documents</legend>

              {/* Bride's Documents Section */}
              <Row className="mb-3">
                <Col md={6} sx={{ marginBottom: "20px" }}>
                  <Form.Group>
                    <Form.Label>Bride's Baptismal Certificate</Form.Label>
                    <Form.Control
                      type="file"
                      name="BrideNewBaptismalCertificate"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      required
                    />
                    {formData.previews?.BrideNewBaptismalCertificate &&
                      (formData.documents?.BrideNewBaptismalCertificate?.type?.startsWith(
                        "image/"
                      ) ? (
                        <img
                          src={formData.previews.BrideNewBaptismalCertificate}
                          alt="Preview"
                          className="img-thumbnail mt-2"
                          style={{ maxHeight: "150px" }}
                        />
                      ) : (
                        <div
                          className="mt-2"
                          style={{
                            width: "100%",
                            height: "300px",
                            marginBottom: "30px",
                          }}
                        >
                          <iframe
                            src={`${formData.previews.BrideNewBaptismalCertificate}#toolbar=0&navpanes=0&scrollbar=0`}
                            title="Document Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                          <div className="mt-2 text-muted small">
                            {formData.documents?.BrideNewBaptismalCertificate
                              ?.name || "Document Preview"}
                          </div>
                        </div>
                      ))}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Bride's Confirmation Certificate</Form.Label>
                    <Form.Control
                      type="file"
                      name="BrideNewConfirmationCertificate"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      required
                    />
                    {formData.previews?.BrideNewConfirmationCertificate &&
                      (formData.documents?.BrideNewConfirmationCertificate?.type?.startsWith(
                        "image/"
                      ) ? (
                        <img
                          src={
                            formData.previews.BrideNewConfirmationCertificate
                          }
                          alt="Preview"
                          className="img-thumbnail mt-2"
                          style={{ maxHeight: "150px" }}
                        />
                      ) : (
                        <div
                          className="mt-2"
                          style={{
                            width: "100%",
                            height: "300px",
                            marginBottom: "30px",
                          }}
                        >
                          <iframe
                            src={`${formData.previews.BrideNewConfirmationCertificate}#toolbar=0&navpanes=0&scrollbar=0`}
                            title="Document Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                          <div className="mt-2 text-muted small">
                            {formData.documents?.BrideNewConfirmationCertificate
                              ?.name || "PDF Document"}
                          </div>
                        </div>
                      ))}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Bride's Marriage License</Form.Label>
                    <Form.Control
                      type="file"
                      name="BrideMarriageLicense"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      required
                    />
                    {formData.previews?.BrideMarriageLicense &&
                      (formData.documents?.BrideMarriageLicense?.type?.startsWith(
                        "image/"
                      ) ? (
                        <img
                          src={formData.previews.BrideMarriageLicense}
                          alt="Preview"
                          className="img-thumbnail mt-2"
                          style={{ maxHeight: "150px" }}
                        />
                      ) : (
                        <div
                          className="mt-2"
                          style={{
                            width: "100%",
                            height: "300px",
                            marginBottom: "30px",
                          }}
                        >
                          <iframe
                            src={`${formData.previews.BrideMarriageLicense}#toolbar=0&navpanes=0&scrollbar=0`}
                            title="Document Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                          <div className="mt-2 text-muted small">
                            {formData.documents?.BrideMarriageLicense?.name ||
                              "PDF Document"}
                          </div>
                        </div>
                      ))}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Bride's Marriage Bans</Form.Label>
                    <Form.Control
                      type="file"
                      name="BrideMarriageBans"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      required
                    />
                    {formData.previews?.BrideMarriageBans &&
                      (formData.documents?.BrideMarriageBans?.type?.startsWith(
                        "image/"
                      ) ? (
                        <img
                          src={formData.previews.BrideMarriageBans}
                          alt="Preview"
                          className="img-thumbnail mt-2"
                          style={{ maxHeight: "150px" }}
                        />
                      ) : (
                        <div
                          className="mt-2"
                          style={{
                            width: "100%",
                            height: "300px",
                            marginBottom: "30px",
                          }}
                        >
                          <iframe
                            src={`${formData.previews.BrideMarriageBans}#toolbar=0&navpanes=0&scrollbar=0`}
                            title="Document Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                          <div className="mt-2 text-muted small">
                            {formData.documents?.BrideMarriageBans?.name ||
                              "PDF Document"}
                          </div>
                        </div>
                      ))}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Bride's Original CeNoMar</Form.Label>
                    <Form.Control
                      type="file"
                      name="BrideOrigCeNoMar"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      required
                    />
                    {formData.previews?.BrideOrigCeNoMar &&
                      (formData.documents?.BrideOrigCeNoMar?.type?.startsWith(
                        "image/"
                      ) ? (
                        <img
                          src={formData.previews.BrideOrigCeNoMar}
                          alt="Preview"
                          className="img-thumbnail mt-2"
                          style={{ maxHeight: "150px" }}
                        />
                      ) : (
                        <div
                          className="mt-2"
                          style={{
                            width: "100%",
                            height: "300px",
                            marginBottom: "30px",
                          }}
                        >
                          <iframe
                            src={`${formData.previews.BrideOrigCeNoMar}#toolbar=0&navpanes=0&scrollbar=0`}
                            title="Document Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                          <div className="mt-2 text-muted small">
                            {formData.documents?.BrideOrigCeNoMar?.name ||
                              "PDF Document"}
                          </div>
                        </div>
                      ))}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Bride's Original PSA</Form.Label>
                    <Form.Control
                      type="file"
                      name="BrideOrigPSA"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      required
                    />
                    {formData.previews?.BrideOrigPSA &&
                      (formData.documents?.BrideOrigPSA?.type?.startsWith(
                        "image/"
                      ) ? (
                        <img
                          src={formData.previews.BrideOrigPSA}
                          alt="Preview"
                          className="img-thumbnail mt-2"
                          style={{ maxHeight: "150px" }}
                        />
                      ) : (
                        <div
                          className="mt-2"
                          style={{
                            width: "100%",
                            height: "300px",
                            marginBottom: "30px",
                          }}
                        >
                          <iframe
                            src={`${formData.previews.BrideOrigPSA}#toolbar=0&navpanes=0&scrollbar=0`}
                            title="Document Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                          <div className="mt-2 text-muted small">
                            {formData.documents?.BrideOrigPSA?.name ||
                              "PDF Document"}
                          </div>
                        </div>
                      ))}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      Bride's Permit From the Parish Of the Bride
                    </Form.Label>
                    <Form.Control
                      type="file"
                      name="BridePermitFromtheParishOftheBride"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      required
                    />
                    {formData.previews?.BridePermitFromtheParishOftheBride &&
                      (formData.documents?.BridePermitFromtheParishOftheBride?.type?.startsWith(
                        "image/"
                      ) ? (
                        <img
                          src={
                            formData.previews.BridePermitFromtheParishOftheBride
                          }
                          alt="Preview"
                          className="img-thumbnail mt-2"
                          style={{ maxHeight: "150px" }}
                        />
                      ) : (
                        <div
                          className="mt-2"
                          style={{
                            width: "100%",
                            height: "300px",
                            marginBottom: "30px",
                          }}
                        >
                          <iframe
                            src={`${formData.previews.BridePermitFromtheParishOftheBride}#toolbar=0&navpanes=0&scrollbar=0`}
                            title="Document Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                          <div className="mt-2 text-muted small">
                            {formData.documents
                              ?.BridePermitFromtheParishOftheBride?.name ||
                              "PDF Document"}
                          </div>
                        </div>
                      ))}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Bride's Child Birth Certificate</Form.Label>
                    <Form.Control
                      type="file"
                      name="BrideChildBirthCertificate"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                    />
                    {formData.previews?.BrideChildBirthCertificate &&
                      (formData.documents?.BrideChildBirthCertificate?.type?.startsWith(
                        "image/"
                      ) ? (
                        <img
                          src={formData.previews.BrideChildBirthCertificate}
                          alt="Preview"
                          className="img-thumbnail mt-2"
                          style={{ maxHeight: "150px" }}
                        />
                      ) : (
                        <div
                          className="mt-2"
                          style={{
                            width: "100%",
                            height: "300px",
                            marginBottom: "30px",
                          }}
                        >
                          <iframe
                            src={`${formData.previews.BrideChildBirthCertificate}#toolbar=0&navpanes=0&scrollbar=0`}
                            title="Document Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                          <div className="mt-2 text-muted small">
                            {formData.documents?.BrideChildBirthCertificate
                              ?.name || "PDF Document"}
                          </div>
                        </div>
                      ))}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Bride's One By One Picture</Form.Label>
                    <Form.Control
                      type="file"
                      name="BrideOneByOne"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    {formData.previews?.BrideOneByOne && (
                      <img
                        src={formData.previews.BrideOneByOne}
                        alt="Preview"
                        className="img-thumbnail mt-2"
                        style={{ maxHeight: "150px" }}
                      />
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>

            <fieldset className="form-group">
              {/* Bride's Documents Section */}
              <Row className="mb-3">
                <Col md={6} sx={{ marginBottom: "20px" }}>
                  <Form.Group>
                    <Form.Label>Grooms's Baptismal Certificate</Form.Label>
                    <Form.Control
                      type="file"
                      name="GroomNewBaptismalCertificate"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      required
                    />
                    {formData.previews?.GroomNewBaptismalCertificate &&
                      (formData.documents?.GroomNewBaptismalCertificate?.type?.startsWith(
                        "image/"
                      ) ? (
                        <img
                          src={formData.previews.GroomNewBaptismalCertificate}
                          alt="Preview"
                          className="img-thumbnail mt-2"
                          style={{ maxHeight: "150px" }}
                        />
                      ) : (
                        <div
                          className="mt-2"
                          style={{
                            width: "100%",
                            height: "300px",
                            marginBottom: "30px",
                          }}
                        >
                          <iframe
                            src={`${formData.previews.GroomNewBaptismalCertificate}#toolbar=0&navpanes=0&scrollbar=0`}
                            title="Document Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                          <div className="mt-2 text-muted small">
                            {formData.documents?.GroomNewBaptismalCertificate
                              ?.name || "Document Preview"}
                          </div>
                        </div>
                      ))}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Groom's Confirmation Certificate</Form.Label>
                    <Form.Control
                      type="file"
                      name="GroomNewConfirmationCertificate"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      required
                    />
                    {formData.previews?.GroomNewConfirmationCertificate &&
                      (formData.documents?.GroomNewConfirmationCertificate?.type?.startsWith(
                        "image/"
                      ) ? (
                        <img
                          src={
                            formData.previews.GroomNewConfirmationCertificate
                          }
                          alt="Preview"
                          className="img-thumbnail mt-2"
                          style={{ maxHeight: "150px" }}
                        />
                      ) : (
                        <div
                          className="mt-2"
                          style={{
                            width: "100%",
                            height: "300px",
                            marginBottom: "30px",
                          }}
                        >
                          <iframe
                            src={`${formData.previews.GroomNewConfirmationCertificate}#toolbar=0&navpanes=0&scrollbar=0`}
                            title="Document Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                          <div className="mt-2 text-muted small">
                            {formData.documents?.GroomNewConfirmationCertificate
                              ?.name || "PDF Document"}
                          </div>
                        </div>
                      ))}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Groom's Marriage License</Form.Label>
                    <Form.Control
                      type="file"
                      name="GroomMarriageLicense"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      required
                    />
                    {formData.previews?.GroomMarriageLicense &&
                      (formData.documents?.GroomMarriageLicense?.type?.startsWith(
                        "image/"
                      ) ? (
                        <img
                          src={formData.previews.GroomMarriageLicense}
                          alt="Preview"
                          className="img-thumbnail mt-2"
                          style={{ maxHeight: "150px" }}
                        />
                      ) : (
                        <div
                          className="mt-2"
                          style={{
                            width: "100%",
                            height: "300px",
                            marginBottom: "30px",
                          }}
                        >
                          <iframe
                            src={`${formData.previews.GroomMarriageLicense}#toolbar=0&navpanes=0&scrollbar=0`}
                            title="Document Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                          <div className="mt-2 text-muted small">
                            {formData.documents?.GroomMarriageLicense?.name ||
                              "PDF Document"}
                          </div>
                        </div>
                      ))}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Grooms's Marriage Bans</Form.Label>
                    <Form.Control
                      type="file"
                      name="GroomMarriageBans"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      required
                    />
                    {formData.previews?.GroomMarriageBans &&
                      (formData.documents?.GroomMarriageBans?.type?.startsWith(
                        "image/"
                      ) ? (
                        <img
                          src={formData.previews.GroomMarriageBans}
                          alt="Preview"
                          className="img-thumbnail mt-2"
                          style={{ maxHeight: "150px" }}
                        />
                      ) : (
                        <div
                          className="mt-2"
                          style={{
                            width: "100%",
                            height: "300px",
                            marginBottom: "30px",
                          }}
                        >
                          <iframe
                            src={`${formData.previews.GroomMarriageBans}#toolbar=0&navpanes=0&scrollbar=0`}
                            title="Document Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                          <div className="mt-2 text-muted small">
                            {formData.documents?.GroomMarriageBans?.name ||
                              "PDF Document"}
                          </div>
                        </div>
                      ))}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Groom's Original CeNoMar</Form.Label>
                    <Form.Control
                      type="file"
                      name="GroomOrigCeNoMar"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      required
                    />
                    {formData.previews?.GroomOrigCeNoMar &&
                      (formData.documents?.GroomOrigCeNoMar?.type?.startsWith(
                        "image/"
                      ) ? (
                        <img
                          src={formData.previews.GroomOrigCeNoMar}
                          alt="Preview"
                          className="img-thumbnail mt-2"
                          style={{ maxHeight: "150px" }}
                        />
                      ) : (
                        <div
                          className="mt-2"
                          style={{
                            width: "100%",
                            height: "300px",
                            marginBottom: "30px",
                          }}
                        >
                          <iframe
                            src={`${formData.previews.GroomOrigCeNoMar}#toolbar=0&navpanes=0&scrollbar=0`}
                            title="Document Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                          <div className="mt-2 text-muted small">
                            {formData.documents?.GroomOrigCeNoMar?.name ||
                              "PDF Document"}
                          </div>
                        </div>
                      ))}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Grooms's Original PSA</Form.Label>
                    <Form.Control
                      type="file"
                      name="GroomOrigPSA"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      required
                    />
                    {formData.previews?.GroomOrigPSA &&
                      (formData.documents?.GroomOrigPSA?.type?.startsWith(
                        "image/"
                      ) ? (
                        <img
                          src={formData.previews.GroomOrigPSA}
                          alt="Preview"
                          className="img-thumbnail mt-2"
                          style={{ maxHeight: "150px" }}
                        />
                      ) : (
                        <div
                          className="mt-2"
                          style={{
                            width: "100%",
                            height: "300px",
                            marginBottom: "30px",
                          }}
                        >
                          <iframe
                            src={`${formData.previews.GroomOrigPSA}#toolbar=0&navpanes=0&scrollbar=0`}
                            title="Document Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                          <div className="mt-2 text-muted small">
                            {formData.documents?.GroomOrigPSA?.name ||
                              "PDF Document"}
                          </div>
                        </div>
                      ))}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>
                      Grooms's Permit From the Parish Of the Bride
                    </Form.Label>
                    <Form.Control
                      type="file"
                      name="GroomPermitFromtheParishOftheBride"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                      required
                    />
                    {formData.previews?.GroomPermitFromtheParishOftheBride &&
                      (formData.documents?.GroomPermitFromtheParishOftheBride?.type?.startsWith(
                        "image/"
                      ) ? (
                        <img
                          src={
                            formData.previews.GroomPermitFromtheParishOftheBride
                          }
                          alt="Preview"
                          className="img-thumbnail mt-2"
                          style={{ maxHeight: "150px" }}
                        />
                      ) : (
                        <div
                          className="mt-2"
                          style={{
                            width: "100%",
                            height: "300px",
                            marginBottom: "30px",
                          }}
                        >
                          <iframe
                            src={`${formData.previews.GroomPermitFromtheParishOftheBride}#toolbar=0&navpanes=0&scrollbar=0`}
                            title="Document Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                          <div className="mt-2 text-muted small">
                            {formData.documents
                              ?.GroomPermitFromtheParishOftheBride?.name ||
                              "PDF Document"}
                          </div>
                        </div>
                      ))}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Grooms's Child Birth Certificate</Form.Label>
                    <Form.Control
                      type="file"
                      name="GroomChildBirthCertificate"
                      onChange={handleFileChange}
                      accept="image/*,.pdf"
                    />
                    {formData.previews?.GroomChildBirthCertificate &&
                      (formData.documents?.GroomChildBirthCertificate?.type?.startsWith(
                        "image/"
                      ) ? (
                        <img
                          src={formData.previews.GroomChildBirthCertificate}
                          alt="Preview"
                          className="img-thumbnail mt-2"
                          style={{ maxHeight: "150px" }}
                        />
                      ) : (
                        <div
                          className="mt-2"
                          style={{
                            width: "100%",
                            height: "300px",
                            marginBottom: "30px",
                          }}
                        >
                          <iframe
                            src={`${formData.previews.GroomChildBirthCertificate}#toolbar=0&navpanes=0&scrollbar=0`}
                            title="Document Preview"
                            style={{
                              width: "100%",
                              height: "100%",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                            }}
                          />
                          <div className="mt-2 text-muted small">
                            {formData.documents?.GroomChildBirthCertificate
                              ?.name || "PDF Document"}
                          </div>
                        </div>
                      ))}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Groom's One By One Picture</Form.Label>
                    <Form.Control
                      type="file"
                      name="GroomOneByOne"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    {formData.previews?.GroomOneByOne && (
                      <img
                        src={formData.previews.GroomOneByOne}
                        alt="Preview"
                        className="img-thumbnail mt-2"
                        style={{ maxHeight: "150px" }}
                      />
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </fieldset>

            <button type="submit" disabled={isSubmitting || isMarried}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
            <button type="button" onClick={handleClearFields}>
              Clear All Fields
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WeddingForm;
