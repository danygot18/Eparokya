import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import GuestSidebar from '../../../../GuestSideBar';
// import termsAndConditionsText from "../../../../Term";

const WeddingForm = () => {
    const [formData, setFormData] = useState({
        dateOfApplication: "",
        weddingDate: "",
        weddingTime: "",
        groomName: "",
        groomAddress: { street: "", zip: "", city: "" },
        groomPhone: "",
        groomBirthDate: "",
        groomOccupation: "",
        groomReligion: "",
        GroomFather: "",
        GroomMother: "",
        brideName: "",
        brideAddress: { street: "", zip: "", city: "" },
        bridePhone: "",
        brideBirthDate: "",
        brideOccupation: "",
        brideReligion: "",
        BrideFather: "",
        BrideMother: "",
        Ninong: [
            { name: "", address: { street: "", zip: "", city: "" } }
        ],
        Ninang: [
            { name: "", address: { street: "", zip: "", city: "" } }
        ],
        GroomNewBaptismalCertificate: "",
        GroomNewConfirmationCertificate: "",
        GroomMarriageLicense: "",
        GroomMarriageBans: "",
        GroomOrigCeNoMar: "",
        GroomOrigPSA: "",
        BrideNewBaptismalCertificate: "",
        BrideNewConfirmationCertificate: "",
        BrideMarriageLicense: "",
        BrideMarriageBans: "",
        BrideOrigCeNoMar: "",
        BrideOrigPSA: "",
        PermitFromtheParishOftheBride: "",
        ChildBirthCertificate: "",
    });
    const [user, setUser] = useState(null);
    const addNinong = () => {
        setFormData((prev) => ({
            ...prev,
            Ninong: [...prev.Ninong, { name: "", address: { street: "", zip: "", city: "" } }],
        }));
    };
    const addNinang = () => {
        setFormData((prev) => ({
            ...prev,
            Ninang: [...prev.Ninang, { name: "", address: { street: "", zip: "", city: "" } }],
        }));
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAgreed, setIsAgreed] = useState(false);

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
        const { name, files } = e.target;
        console.log(`File selected: ${name}`, files[0]); 
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
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/api/v1/profile`, config);
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user:', error.response ? error.response.data : error.message);
            }
        };
        fetchUser();
    }, []);

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
            images: {}
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataObj = new FormData();
            const imageFields = [
                "GroomNewBaptismalCertificate",
                "GroomNewConfirmationCertificate",
                "GroomMarriageLicense",
                "GroomMarriageBans",
                "GroomOrigCeNoMar",
                "GroomOrigPSA",
                "BrideNewBaptismalCertificate",
                "BrideNewConfirmationCertificate",
                "BrideMarriageLicense",
                "BrideMarriageBans",
                "BrideOrigCeNoMar",
                "BrideOrigPSA",
                "PermitFromtheParishOftheBride",
                "ChildBirthCertificate",
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
            
            Object.entries(formData).forEach(([key, value]) => {
                if (key !== 'images' && !imageFields.includes(key)) {
                    if (Array.isArray(value)) {
                        formDataObj.append(key, JSON.stringify(value));
                    } else if (typeof value === "object" && value !== null) {
                        formDataObj.append(key, JSON.stringify(value));
                    } else {
                        formDataObj.append(key, value);
                    }
                }
            });

            const response = await axios.post(
                `${process.env.REACT_APP_API}/api/v1/submitWeddingForm`,
                formDataObj,
                config
            );

            toast.success("Wedding form submitted successfully!");
            console.log("Response:", response.data);

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
                images: {}
            });

        } catch (error) {
            console.error("Error submitting wedding form:", error.response ? error.response.data : error.message);
            toast.error("Failed to submit wedding form. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                    <Form.Control
                        type="text"
                        placeholder="Street"
                        value={formData.groomAddress.street}
                        onChange={(e) => handleNestedChange(e, "groomAddress", null, "street")}
                    />
                    <Form.Control
                        type="text"
                        placeholder="Zip"
                        value={formData.groomAddress.zip}
                        onChange={(e) => handleNestedChange(e, "groomAddress", null, "zip")}
                    />
                    <Form.Control
                        type="text"
                        placeholder="City"
                        value={formData.groomAddress.city}
                        onChange={(e) => handleNestedChange(e, "groomAddress", null, "city")}
                    />
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
                        name="GroomFather"
                        value={formData.GroomFather}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Mother</Form.Label>
                    <Form.Control
                        type="text"
                        name="GroomMother"
                        value={formData.GroomMother}
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
                    <Form.Control
                        type="text"
                        placeholder="Street"
                        value={formData.brideAddress.street}
                        onChange={(e) => handleNestedChange(e, "brideAddress", null, "street")}
                    />
                    <Form.Control
                        type="text"
                        placeholder="Zip"
                        value={formData.brideAddress.zip}
                        onChange={(e) => handleNestedChange(e, "brideAddress", null, "zip")}
                    />
                    <Form.Control
                        type="text"
                        placeholder="City"
                        value={formData.brideAddress.city}
                        onChange={(e) => handleNestedChange(e, "brideAddress", null, "city")}
                    />
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
                        name="BrideFather"
                        value={formData.BrideFather}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Mother</Form.Label>
                    <Form.Control
                        type="text"
                        name="BrideMother"
                        value={formData.BrideMother}
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
                                onChange={(e) => handleNestedChange(e, "Ninong", index, "street")}
                                required
                            />
                            <Form.Control
                                type="text"
                                placeholder="Zip"
                                value={ninong.address.zip}
                                onChange={(e) => handleNestedChange(e, "Ninong", index, "zip")}
                                required
                            />
                            <Form.Control
                                type="text"
                                placeholder="City"
                                value={ninong.address.city}
                                onChange={(e) => handleNestedChange(e, "Ninong", index, "city")}
                                required
                            />
                        </Form.Group>
                    </div>
                ))}
                <button type="button" onClick={addNinong}>Add Ninong</button>
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
                                onChange={(e) => handleNestedChange(e, "Ninang", index, "street")}
                                required
                            />
                            <Form.Control
                                type="text"
                                placeholder="Zip"
                                value={ninang.address.zip}
                                onChange={(e) => handleNestedChange(e, "Ninang", index, "zip")}
                                required
                            />
                            <Form.Control
                                type="text"
                                placeholder="City"
                                value={ninang.address.city}
                                onChange={(e) => handleNestedChange(e, "Ninang", index, "city")}
                                required
                            />
                        </Form.Group>
                    </div>
                ))}
                <button type="button" onClick={addNinang}>Add Ninang</button>
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
                    <Form.Label>Permit From the Parish Of the Bride</Form.Label>
                    <Form.Control
                        type="file"
                        name="PermitFromtheParishOftheBride"
                        onChange={handleFileChange}
                    />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Child's Birth Certificate</Form.Label>
                    <Form.Control
                        type="file"
                        name="ChildBirthCertificate"
                        onChange={handleFileChange}
                    />
                </Form.Group>
            </fieldset>

            <button type="submit">Submit</button>
            <button type="button" onClick={handleClearFields}>Clear All Fields</button>
        </form>
    );

};

export default WeddingForm;
