import React from 'react';
import { Link } from 'react-router-dom';
import GuestSideBar from '../../GuestSideBar';

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
        <div className="flex min-h-screen p-4 gap-6">
            {/* Sidebar */}
            <div className="w-1/4 min-w-[250px]">
                <GuestSideBar />
            </div>

            {/* Forms Navigation */}
            <div className="flex-1">
                <div className="bg-white p-6 shadow-md rounded-lg border w-full">
                    <h2 className="text-xl font-bold mb-4">Submitted Forms</h2>
                    {formCategories.map((category, index) => (
                        <div key={index} className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {category.forms.map((form, formIndex) => (
                                    <Link 
                                        key={formIndex} 
                                        to={form.path} 
                                        className="block p-4 border rounded-lg shadow-md hover:shadow-lg transition bg-gray-100 hover:bg-gray-200"
                                    >
                                        <span className="text-blue-600 font-medium">{form.name}</span>
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