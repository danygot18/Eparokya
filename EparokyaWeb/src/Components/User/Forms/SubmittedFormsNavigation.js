import React from 'react';
import { Link } from 'react-router-dom';
import GuestSideBar from '../../GuestSideBar';
import "./SubmittedFormsNavigation.css";

const SubmittedFormsNavigation = () => {
    const formCategories = [
        {
            title: 'Private Forms',
            forms: [
                { name: 'Private Wedding', path: '/user/SubmittedWeddingList' },
                { name: 'Private Baptism', path: '/user/SubmittedBaptismList' },
                { name: 'Private Funeral', path: '/user/SubmittedFuneralList' },
                { name: 'Mass Intentions', path: '/user/SubmittedPrayerRequestList' },
                { name: 'Counseling', path: '/user/SubmittedCounselingList' },
                { name: 'Street Mass', path: '/user/streetMassForm' },
                { name: 'House Blessing', path: '/user/SubmittedHouseBlessingList' },
            ],
        },
        {
            title: 'Mass Forms',
            forms: [
                { name: 'Kasalang Bayan', path: '/forms/mass/mass-wedding' },
                { name: 'Binyagang Bayan', path: '/forms/mass/mass-baptism' },
            ],
        },
    ];

    return (
        <div className="forms-container">
            {/* Sidebar */}
            <div className="forms-sidebar">
                <GuestSideBar />
            </div>

            {/* Main Content */}
            <div className="forms-content">
                <div className="forms-box">
                    <h2 className="forms-title">Submitted Forms</h2>
                    {formCategories.map((category, index) => (
                        <div key={index} className="forms-category">
                            <h3>{category.title}</h3>
                            <div className="forms-list">
                                {category.forms.map((form, formIndex) => (
                                    <Link key={formIndex} to={form.path} className="form-card">
                                        {form.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
};

export default SubmittedFormsNavigation;
