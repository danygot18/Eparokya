import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import GuestSidebar from "../../../../GuestSideBar";
import MetaData from "../../../../Layout/MetaData";
// import termsAndConditionsText from "../../../../Term";

const WeddingForm = () => {
  const [formData, setFormData] = useState({
    dateOfApplication: "",
    weddingDate: "",
    weddingTime: "",
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
    previews: {},
  });
  const [isMarried, setIsMarried] = useState(false);
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/profile`,
          config
        );
        setUser(response.data.user);
        if (response.data.user.civilStatus === "Married") {
          alert(
            "Sorry, but a 'Married' user cannot submit an application / Paumanhin. Ang kasal ay hindi na maaring magsagot ng applikasyon."
          );
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

  // const handleFileChange = (e) => {
  //   const { name, files } = e.target;
  //   console.log(`File selected: ${name}`, files[0]);
  //   const file = e.target.files[0];
  //   setFormData((prev) => ({
  //     ...prev,
  //     images: { ...prev.images, [name]: file },
  //   }));
  // };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) return;

    // Generate a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        images: { ...prev.images, [name]: file },
        previews: { ...prev.previews, [name]: reader.result },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleClearFields = () => {
    setFormData({
      dateOfApplication: "",
      weddingDate: "",
      weddingTime: "",
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
      },
    }));

    if (selectedCity === "Others") {
      setCustomCity("");
    }
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

    try {
      // Prepare groomAddress and brideAddress
      const groomAddress = {
        ...formData.groomAddress,
        customCity:
          formData.groomAddress.city === "Others" ? customCity : undefined,
        customBarangay:
          formData.groomAddress.barangay === "Others"
            ? customBarangay
            : undefined,
      };

      const brideAddress = {
        ...formData.brideAddress,
        customCity:
          formData.brideAddress.city === "Others" ? customCity : undefined,
        customBarangay:
          formData.brideAddress.barangay === "Others"
            ? customBarangay
            : undefined,
      };

      // Validate required fields
      if (!groomAddress.city || !groomAddress.barangay) {
        toast.error("Please complete the groom's address.");
        return;
      }
      if (!brideAddress.city || !brideAddress.barangay) {
        toast.error("Please complete the bride's address.");
        return;
      }

      // Prepare FormData
      const formDataObj = new FormData();
      const imageFields = [
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

      console.log("Form data before submit:", formData);
      imageFields.forEach((field) => {
        const file = formData.images[field];
        if (file) {
          console.log(`Appending ${field} to FormData`, file);
          formDataObj.append(field, file);
        } else {
          console.warn(`⚠️ No file found for ${field}`);
        }
      });

      // Append other form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "images") {
          if (key === "groomAddress") {
            formDataObj.append(key, JSON.stringify(groomAddress));
          } else if (key === "brideAddress") {
            formDataObj.append(key, JSON.stringify(brideAddress));
          } else if (Array.isArray(value)) {
            formDataObj.append(key, JSON.stringify(value));
          } else if (typeof value === "object" && value !== null) {
            formDataObj.append(key, JSON.stringify(value));
          } else {
            formDataObj.append(key, value);
          }
        }
      });

      // Submit the form
      const response = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/submitWeddingForm`,
        formDataObj,
        config
      );

      toast.success("Wedding form submitted successfully!");
      console.log("Response:", response.data);

      // Reset form data
      setFormData({
        dateOfApplication: "",
        weddingDate: "",
        weddingTime: "",
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
        groomFather: "",
        groomMother: "",
        brideFather: "",
        brideMother: "",
        Ninong: [],
        Ninang: [],
        images: {},
      });

      console.log("Form data after submit:", formData);
    } catch (error) {
      console.error(
        "Error submitting wedding form:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to submit wedding form. Please try again.");
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
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            style={{ paddingLeft: "30px" }}
          >
            <h2>Wedding Form</h2>

            {/* Warning message if user is married */}
            {isMarried && (
              <div
                style={{
                  color: "red",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                Sorry, but a "Married" user cannot submit an application. <br />
                Paumanhin, ang "kasal" ay hindi maaring mag-sagot ng
                applikasyon.
              </div>
            )}

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
              <Form.Label>Wedding Date</Form.Label>
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
                        handleNestedChange(e, "groomAddress", null, "BldgNameTower")
                      }
                    />
                  </Col>
                  <Col>
                    <Form.Label>Lot/Block/Phase/House No.</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.groomAddress.LotBlockPhaseHouseNo}
                      onChange={(e) =>
                        handleNestedChange(e, "groomAddress", null, "LotBlockPhaseHouseNo")
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
                        handleNestedChange(e, "groomAddress", null, "SubdivisionVillageZone")
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
                          value={customCity}
                          onChange={(e) => setCustomCity(e.target.value)}
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
                        handleNestedChange(e, "brideAddress", null, "BldgNameTower")
                      }
                    />
                  </Col>
                  <Col>
                    <Form.Label>Lot/Block/Phase/House No.</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.brideAddress.LotBlockPhaseHouseNo}
                      onChange={(e) =>
                        handleNestedChange(e, "brideAddress", null, "LotBlockPhaseHouseNo")
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
                        handleNestedChange(e, "brideAddress", null, "SubdivisionVillageZone")
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
                          value={customCity}
                          onChange={(e) => setCustomCity(e.target.value)}
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

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Bride's Baptismal Certificate</Form.Label>
                    <Form.Control
                      type="file"
                      name="BrideNewBaptismalCertificate"
                      onChange={handleFileChange}
                    />
                    {formData.previews?.BrideNewBaptismalCertificate && (
                      <img
                        src={formData.previews.BrideNewBaptismalCertificate}
                        alt="Preview"
                        className="img-thumbnail mt-2"
                        style={{ maxHeight: "150px" }}
                      />
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Bride's Confirmation Certificate</Form.Label>
                    <Form.Control
                      type="file"
                      name="BrideNewConfirmationCertificate"
                      onChange={handleFileChange}
                    />
                    {formData.previews?.BrideNewConfirmationCertificate && (
                      <img
                        src={formData.previews.BrideNewConfirmationCertificate}
                        alt="Preview"
                        className="img-thumbnail mt-2"
                        style={{ maxHeight: "150px" }}
                      />
                    )}
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
                    />
                    {formData.previews?.BrideMarriageLicense && (
                      <img
                        src={formData.previews.BrideMarriageLicense}
                        alt="Preview"
                        className="img-thumbnail mt-2"
                        style={{ maxHeight: "150px" }}
                      />
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Bride's Marriage Bans</Form.Label>
                    <Form.Control
                      type="file"
                      name="BrideMarriageBans"
                      onChange={handleFileChange}
                    />
                    {formData.previews?.BrideMarriageBans && (
                      <img
                        src={formData.previews.BrideMarriageBans}
                        alt="Preview"
                        className="img-thumbnail mt-2"
                        style={{ maxHeight: "150px" }}
                      />
                    )}
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
                    />
                    {formData.previews?.BrideOrigCeNoMar && (
                      <img
                        src={formData.previews.BrideOrigCeNoMar}
                        alt="Preview"
                        className="img-thumbnail mt-2"
                        style={{ maxHeight: "150px" }}
                      />
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Bride's Original PSA</Form.Label>
                    <Form.Control
                      type="file"
                      name="BrideOrigPSA"
                      onChange={handleFileChange}
                    />
                    {formData.previews?.BrideOrigPSA && (
                      <img
                        src={formData.previews.BrideOrigPSA}
                        alt="Preview"
                        className="img-thumbnail mt-2"
                        style={{ maxHeight: "150px" }}
                      />
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Bride's Permit From the Parish Of the Bride</Form.Label>
                    <Form.Control
                      type="file"
                      name="BridePermitFromtheParishOftheBride"
                      onChange={handleFileChange}
                    />
                    {formData.previews?.BridePermitFromtheParishOftheBride && (
                      <img
                        src={formData.previews.BridePermitFromtheParishOftheBride}
                        alt="Preview"
                        className="img-thumbnail mt-2"
                        style={{ maxHeight: "150px" }}
                      />
                    )}
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Bride's Child Birth Certificate</Form.Label>
                    <Form.Control
                      type="file"
                      name="BrideChildBirthCertificate"
                      onChange={handleFileChange}
                    />
                    {formData.previews?.BrideChildBirthCertificate && (
                      <img
                        src={formData.previews.BrideChildBirthCertificate}
                        alt="Preview"
                        className="img-thumbnail mt-2"
                        style={{ maxHeight: "150px" }}
                      />
                    )}
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

            <button type="submit">Submit</button>
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
