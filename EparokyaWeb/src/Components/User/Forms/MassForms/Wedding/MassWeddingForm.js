import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import GuestSidebar from '../../../../GuestSideBar';
import MetaData from '../../../../Layout/MetaData';

const MassWeddingForm = () => {
  const [isMarried, setIsMarried] = useState(false);
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
    const [weddingDates, setWeddingDates] = useState([]);
    const [selectedWeddingDate, setSelectedWeddingDate] = useState("");
    const [user, setUser] = useState(null);

    console.log("User:", user);
    

    const [formData, setFormData] = useState({
    weddingDateTime: "",
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
    });
    

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

    const handleFileChange = (e) => {
        const { name } = e.target;
        const file = e.target.files[0];
        setFormData((prev) => ({
            ...prev,
            images: { ...prev.images, [name]: file },
        }));
    };

    const config = {
        withCredentials: true,
    };
    useEffect(() => {
        const fetchWeddingDates = async () => {
            try {
                const category = "Wedding";
                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/getActiveDatesByCategory/${category}`);
                console.log("Fetched Wedding Dates:", response.data);
                setWeddingDates(response.data);
                if (response.data.length > 0) {
                  setSelectedWeddingDate(response.data[0]);
                    setFormData((prev) => ({
                        ...prev,
                        weddingDateTime: response.data[0]._id,
                    }));
                }

            } catch (error) {
                console.error("Error fetching wedding dates:", error);
            }
        };

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
           fetchWeddingDates();
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

    const handleClearFields = () => {
        setFormData({

            weddingDateTime: "",
            groomName: "",
            groomAddress: "",
            brideName: "",
            brideAddress: "",
            Ninong: [],
            Ninang: [],
            images: {}
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
              // console.log(`Appending ${field} to FormData`, file);
              formDataObj.append(field, file);
            } else {
              console.warn(`No file found for ${field}`);
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
            `${process.env.REACT_APP_API}/api/v1/submitMassWeddingForm`,
            formDataObj,
            { withCredentials: true }
          );
    
          toast.success("Mass Wedding form submitted successfully!");
          console.log("Response:", response.data);
    
          // Reset form data
          setFormData({
            dateOfApplication: "",
            weddingDateTime: "",
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
          <MetaData title="Mass Wedding Form" />
          <div style={{ display: "flex", backgroundColor: "#f9f9f9", width: "100%" }}>
            <GuestSidebar />
            <div style={{ marginLeft: "20px", padding: "20px", width: "calc(100% - 270px)" }}>
              <form onSubmit={handleSubmit} encType="multipart/form-data" style={{ paddingLeft: "30px" }}>
                <h2>Wedding Form</h2>
      
                {/* Warning message if user is married */}
                {isMarried && (
                  <div style={{ color: "red", fontWeight: "bold", marginBottom: "10px" }}>
                    Sorry, but a "Married" user cannot submit an application. <br />
                    Paumanhin, ang "kasal" ay hindi maaring mag-sagot ng applikasyon.
                  </div>
                )}
      
                {/* Wedding Date & Time */}
                
                <Form.Group>
                  <Form.Label>Wedding Date and Time</Form.Label>
                  <Form.Control
                    type="text"
                    value={
                      selectedWeddingDate ? `${new Date(selectedWeddingDate.date).toLocaleDateString()} - ${selectedWeddingDate.time}` : ""
                    }
                    disabled
                  />VBN
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
                    <Form.Label>Building Name/Tower</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Building Name/Tower"
                      value={formData.groomAddress.BldgNameTower}
                      onChange={(e) =>
                        handleNestedChange(e, "groomAddress", null, "BldgNameTower")
                      }
                    />
      
                    <Form.Label>Lot/Block/Phase/House No.</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Lot/Block/Phase/House No."
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
      
                    <Form.Label>Subdivision/Village/Zone</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Subdivision/Village/Zone"
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
      
                    <Form.Label>Street</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Street"
                      value={formData.groomAddress.Street}
                      onChange={(e) =>
                        handleNestedChange(e, "groomAddress", null, "Street")
                      }
                    />
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
      
                    <Form.Label>District</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="District"
                      value={formData.groomAddress.District}
                      onChange={(e) =>
                        handleNestedChange(e, "groomAddress", null, "District")
                      }
                    />
      
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
                  </Form.Group>
      
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
                    <Form.Label>Building Name/Tower</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Building Name/Tower"
                      value={formData.brideAddress.BldgNameTower}
                      onChange={(e) =>
                        handleNestedChange(e, "brideAddress", null, "BldgNameTower")
                      }
                    />
      
                    <Form.Label>Lot/Block/Phase/House No.</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Lot/Block/Phase/House No."
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
      
                    <Form.Label>Subdivision/Village/Zone</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Subdivision/Village/Zone"
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
      
                    <Form.Label>Street</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Street"
                      value={formData.brideAddress.Street}
                      onChange={(e) =>
                        handleNestedChange(e, "brideAddress", null, "Street")
                      }
                    />
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
                    <Form.Label>District</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="District"
                      value={formData.brideAddress.District}
                      onChange={(e) =>
                        handleNestedChange(e, "brideAddress", null, "District")
                      }
                    />
      
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
                  </Form.Group>
      
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
                </fieldset>
      
                {/* Ninong Section */}
                <fieldset className="form-group">
                  <legend>Ninong</legend>
                  {formData.Ninong.map((ninong, index) => (
                    <div key={index}>
                      <Form.Group>
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Full Name"
                          value={ninong.name}
                          onChange={(e) => handleNestedChange(e, "Ninong", index)}
                          required
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Street"
                          value={ninong.address.street}
                          onChange={(e) =>
                            handleNestedChange(e, "Ninong", index, "street")
                          }
                          required
                        />
                        <Form.Control
                          type="text"
                          placeholder="Zip"
                          value={ninong.address.zip}
                          onChange={(e) =>
                            handleNestedChange(e, "Ninong", index, "zip")
                          }
                          required
                        />
                        <Form.Control
                          type="text"
                          placeholder="City"
                          value={ninong.address.city}
                          onChange={(e) =>
                            handleNestedChange(e, "Ninong", index, "city")
                          }
                          required
                        />
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
                      <Form.Group>
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Full Name"
                          value={ninang.name}
                          onChange={(e) => handleNestedChange(e, "Ninang", index)}
                          required
                        />
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Street"
                          value={ninang.address.street}
                          onChange={(e) =>
                            handleNestedChange(e, "Ninang", index, "street")
                          }
                          required
                        />
                        <Form.Control
                          type="text"
                          placeholder="Zip"
                          value={ninang.address.zip}
                          onChange={(e) =>
                            handleNestedChange(e, "Ninang", index, "zip")
                          }
                          required
                        />
                        <Form.Control
                          type="text"
                          placeholder="City"
                          value={ninang.address.city}
                          onChange={(e) =>
                            handleNestedChange(e, "Ninang", index, "city")
                          }
                          required
                        />
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
                  <Form.Group>
                    <Form.Label>Groom's Baptismal Certificate</Form.Label>
                    <Form.Control
                      type="file"
                      name="GroomNewBaptismalCertificate"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Groom's Confirmation Certificate</Form.Label>
                    <Form.Control
                      type="file"
                      name="GroomNewConfirmationCertificate"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Groom's Marriage License</Form.Label>
                    <Form.Control
                      type="file"
                      name="GroomMarriageLicense"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Groom's Marriage Bans</Form.Label>
                    <Form.Control
                      type="file"
                      name="GroomMarriageBans"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Groom's Original CeNoMar</Form.Label>
                    <Form.Control
                      type="file"
                      name="GroomOrigCeNoMar"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Groom's Original PSA</Form.Label>
                    <Form.Control
                      type="file"
                      name="GroomOrigPSA"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>
                      Groom's Permit from the Parish of the Bride
                    </Form.Label>
                    <Form.Control
                      type="file"
                      name="GroomPermitFromtheParishOftheBride"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Groom's Child Birth Certificate</Form.Label>
                    <Form.Control
                      type="file"
                      name="GroomChildBirthCertificate"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Groom's One By One Picture</Form.Label>
                    <Form.Control
                      type="file"
                      name="GroomOneByOne"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
      
                  <Form.Group>
                    <Form.Label>Bride's Baptismal Certificate</Form.Label>
                    <Form.Control
                      type="file"
                      name="BrideNewBaptismalCertificate"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Bride's Confirmation Certificate</Form.Label>
                    <Form.Control
                      type="file"
                      name="BrideNewConfirmationCertificate"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Bride's Marriage License</Form.Label>
                    <Form.Control
                      type="file"
                      name="BrideMarriageLicense"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Bride's Marriage Bans</Form.Label>
                    <Form.Control
                      type="file"
                      name="BrideMarriageBans"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Bride's Original CeNoMar</Form.Label>
                    <Form.Control
                      type="file"
                      name="BrideOrigCeNoMar"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Bride's Original PSA</Form.Label>
                    <Form.Control
                      type="file"
                      name="BrideOrigPSA"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>
                      Bride's Permit From the Parish Of the Bride
                    </Form.Label>
                    <Form.Control
                      type="file"
                      name="BridePermitFromtheParishOftheBride"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Bride's Child Birth Certificate</Form.Label>
                    <Form.Control
                      type="file"
                      name="BrideChildBirthCertificate"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Bride's One By One Picture</Form.Label>
                    <Form.Control
                      type="file"
                      name="BrideOneByOne"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
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

export default MassWeddingForm;
