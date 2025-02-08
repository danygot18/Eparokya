import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserWeddingChecklist = ({ weddingId }) => {
    const [checklist, setChecklist] = useState({
        PreMarriageSeminar: false,
        GroomNewBaptismalCertificate: false,
        GroomNewConfirmationCertificate: false,
        GroomMarriageLicense: false,
        GroomMarriageBans: false,
        GroomOrigCeNoMar: false,
        GroomOrigPSA: false,
        GroomOnebyOne: false,
        GroomTwobyTwo: false,
        BrideNewBaptismalCertificate: false,
        BrideNewConfirmationCertificate: false,
        BrideMarriageLicense: false,
        BrideMarriageBans: false,
        BrideOrigCeNoMar: false,
        BrideOrigPSA: false,
        BrideOnebyOne: false,
        BrideTwobyTwo: false,
        PermitFromtheParishOftheBride: false,
        ChildBirthCertificate: false,
        PreMarriageSeminar1: false,
        PreMarriageSeminar2: false,
        PreMarriageSeminar3: false,
        CanonicalInterview: false,
        Confession: false,
    });

    useEffect(() => {
        if (weddingId) {
            axios
                .get(`${process.env.REACT_APP_API}/api/v1/getWeddingChecklist/${weddingId}`, { withCredentials: true })
                .then((res) => {
                    console.log("API Response:", res.data);
                    
                    // Ensure we update the checklist state correctly
                    if (res.data.checklist) {
                        setChecklist(res.data.checklist);
                        console.log("Checklist:", res.data.checklist);
                    }
                })
                .catch((err) => {
                    console.error("Error fetching checklist:", err);
                });
        }
    }, [weddingId]);
    
    return (
        <div className="wedding-checklist-container">
            <h2>Wedding Checklist</h2>

            {/* Groom Checklist Fields */}
            <div className="wedding-checklist-item">
                <span>Groom New Baptismal Certificate</span>
                <button
                    className={checklist.GroomNewBaptismalCertificate ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.GroomNewBaptismalCertificate ? "Checked" : "Unchecked"}
                </button>
            </div>

            <div className="wedding-checklist-item">
                <span>Groom New Confirmation Certificate</span>
                <button
                    className={checklist.GroomNewConfirmationCertificate ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.GroomNewConfirmationCertificate ? "Checked" : "Unchecked"}
                </button>
            </div>

            <div className="wedding-checklist-item">
                <span>Groom Marriage License</span>
                <button
                    className={checklist.GroomMarriageLicense ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.GroomMarriageLicense ? "Checked" : "Unchecked"}
                </button>
            </div>

            <div className="wedding-checklist-item">
                <span>Groom Marriage Bans</span>
                <button
                    className={checklist.GroomMarriageBans ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.GroomMarriageBans ? "Checked" : "Unchecked"}
                </button>
            </div>

            <div className="wedding-checklist-item">
                <span>Groom Original Certificate of No Marriage</span>
                <button
                    className={checklist.GroomOrigCeNoMar ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.GroomOrigCeNoMar ? "Checked" : "Unchecked"}
                </button>
            </div>

            <div className="wedding-checklist-item">
                <span>Groom Original PSA</span>
                <button
                    className={checklist.GroomOrigPSA ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.GroomOrigPSA ? "Checked" : "Unchecked"}
                </button>
            </div>

            <div className="wedding-checklist-item">
                <span>Groom 1x1 Photo</span>
                <button
                    className={checklist.GroomOnebyOne ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.GroomOnebyOne ? "Checked" : "Unchecked"}
                </button>
            </div>

            <div className="wedding-checklist-item">
                <span>Groom 2x2 Photo</span>
                <button
                    className={checklist.GroomTwobyTwo ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.GroomTwobyTwo ? "Checked" : "Unchecked"}
                </button>
            </div>

            {/* Bride Checklist Fields */}
            <div className="wedding-checklist-item">
                <span>Bride New Baptismal Certificate</span>
                <button
                    className={checklist.BrideNewBaptismalCertificate ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.BrideNewBaptismalCertificate ? "Checked" : "Unchecked"}
                </button>
            </div>

            <div className="wedding-checklist-item">
                <span>Bride New Confirmation Certificate</span>
                <button
                    className={checklist.BrideNewConfirmationCertificate ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.BrideNewConfirmationCertificate ? "Checked" : "Unchecked"}
                </button>
            </div>

            <div className="wedding-checklist-item">
                <span>Bride Marriage License</span>
                <button
                    className={checklist.BrideMarriageLicense ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.BrideMarriageLicense ? "Checked" : "Unchecked"}
                </button>
            </div>

            <div className="wedding-checklist-item">
                <span>Bride Marriage Bans</span>
                <button
                    className={checklist.BrideMarriageBans ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.BrideMarriageBans ? "Checked" : "Unchecked"}
                </button>
            </div>

            <div className="wedding-checklist-item">
                <span>Bride Original Certificate of No Marriage</span>
                <button
                    className={checklist.BrideOrigCeNoMar ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.BrideOrigCeNoMar ? "Checked" : "Unchecked"}
                </button>
            </div>

            <div className="wedding-checklist-item">
                <span>Bride Original PSA</span>
                <button
                    className={checklist.BrideOrigPSA ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.BrideOrigPSA ? "Checked" : "Unchecked"}
                </button>
            </div>

            <div className="wedding-checklist-item">
                <span>Bride 1x1 Photo</span>
                <button
                    className={checklist.BrideOnebyOne ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.BrideOnebyOne ? "Checked" : "Unchecked"}
                </button>
            </div>

            <div className="wedding-checklist-item">
                <span>Bride 2x2 Photo</span>
                <button
                    className={checklist.BrideTwobyTwo ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.BrideTwobyTwo ? "Checked" : "Unchecked"}
                </button>
            </div>

            <div className="wedding-checklist-item">
                <span>Permit from the Parish of the Bride</span>
                <button
                    className={checklist.PermitFromtheParishOftheBride ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.PermitFromtheParishOftheBride ? "Checked" : "Unchecked"}
                </button>
            </div>

            <div className="wedding-checklist-item">
                <span>Child Birth Certificate</span>
                <button
                    className={checklist.ChildBirthCertificate ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.ChildBirthCertificate ? "Checked" : "Unchecked"}
                </button>
            </div>

            {/* Seminar Fields */}
            <h3>Seminars</h3>
            <div className="wedding-checklist-item">
                <span>Pre-Marriage Seminar 1</span>
                <button
                    className={checklist.PreMarriageSeminar1 ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.PreMarriageSeminar1 ? "Checked" : "Unchecked"}
                </button>
            </div>

            <div className="wedding-checklist-item">
                <span>Pre-Marriage Seminar 2</span>
                <button
                    className={checklist.PreMarriageSeminar2 ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.PreMarriageSeminar2 ? "Checked" : "Unchecked"}
                </button>
            </div>

            <div className="wedding-checklist-item">
                <span>Pre-Marriage Seminar 3</span>
                <button
                    className={checklist.PreMarriageSeminar3 ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.PreMarriageSeminar3 ? "Checked" : "Unchecked"}
                </button>
            </div>

            <div className="wedding-checklist-item">
                <span>Canonical Interview</span>
                <button
                    className={checklist.CanonicalInterview ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.CanonicalInterview ? "Checked" : "Unchecked"}
                </button>
            </div>

            <div className="wedding-checklist-item">
                <span>Confession</span>
                <button
                    className={checklist.Confession ? "checked-btn" : "unchecked-btn"}
                    disabled
                >
                    {checklist.Confession ? "Checked" : "Unchecked"}
                </button>
            </div>

            <style>
                {`
                    .checked-btn {
                        background-color: green;
                        color: white;
                        padding: 5px 10px;
                        border: none;
                        border-radius: 5px;
                        cursor: not-allowed;
                    }
                    .unchecked-btn {
                        background-color: gray;
                        color: white;
                        padding: 5px 10px;
                        border: none;
                        border-radius: 5px;
                        cursor: not-allowed;
                    }
                    .wedding-checklist-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 10px;
                    }
                `}
            </style>
        </div>
    );
};

export default UserWeddingChecklist;
