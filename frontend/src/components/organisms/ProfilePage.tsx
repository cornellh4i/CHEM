import React from 'react';
import { Box } from '@mui/material';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const ProfilePage = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '600px', margin: '0 auto' }}>
            {/* Personal Information Section */}
            <Box sx={{ mb: 4 }}>
                <Input label="First Name" placeholder="Enter first name" fullWidth />
                <Input label="Last Name" placeholder="Enter last name" fullWidth />
                <Input label="Role" value="Analyst" fullWidth readOnly />
                <Input label="Email" placeholder="Enter email" fullWidth />
            </Box>

            {/* Password Change Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                    variant="primary">
                    Change your password
                </Button>
                <Button
                    variant="primary">
                    Reset your password
                </Button>

            </Box>
        </Box>
    );
};

export default ProfilePage;
