"use client";

import React, { useState } from 'react';

type FormData = {
    firstName: string;
    lastName: string;
    role: string;
    email: string;
    phoneNumber: string;
};

const ProfilePage = () => {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        role: 'Analyst',
        email: '',
        phoneNumber: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Your Profile</h2>

            <form style={{ display: 'grid', gap: '1.5rem' }}>
                {/* First and Last Name */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <label>First Name:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label>Last Name:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                </div>

                <div>
                    <label>Role:</label>
                    <input
                        type="text"
                        name="role"
                        value={formData.role}
                        readOnly
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#f0f0f0' }}
                    />
                    <small style={{ color: '#888', fontSize: '0.875rem' }}>This was assigned by your administrator</small>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>




                {/* Password Section */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginTop: '2rem' }}>Password</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '25%' }}>
                    <button
                        type="button"
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: '#f9f9f9', width: '100%' }}
                    >
                        Change your password
                    </button>
                    <button
                        type="button"
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer', backgroundColor: '#f9f9f9', width: '100%' }}
                    >
                        Reset your password
                    </button>
                </div>


                {/* Save Changes Button */}
                <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
                    <button type="submit" style={{ padding: '10px 20px', borderRadius: '4px', backgroundColor: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer' }}>
                        Save Changes
                    </button>
                </div>
            </form>
        </div>

    );
};

export default ProfilePage;
