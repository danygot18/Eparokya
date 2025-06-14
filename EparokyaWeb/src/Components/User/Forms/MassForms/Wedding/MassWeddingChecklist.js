import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    Typography,
    styled,
    Chip,
    Modal,
    Paper,
    Button,
    ListItemText
} from '@mui/material';
import { CheckCircleOutline, HighlightOff } from '@mui/icons-material';
import { toast } from 'react-toastify';

const SectionCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    boxShadow: theme.shadows[3]
}));

const VerificationChip = ({ verified }) => (
    <Chip
        icon={verified ? <CheckCircleOutline /> : <HighlightOff />}
        label={verified ? "Verified" : "Unverified"}
        color={verified ? "success" : "error"}
        variant="outlined"
        sx={{
            minWidth: 120,
            borderWidth: 2,
            borderStyle: 'solid'
        }}
    />
);

const MassWeddingChecklist = ({ massWeddingId }) => {
    const [checklist, setChecklist] = useState({
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
        PreMarriageSeminar: false,
        CanonicalInterview: false,
        Confession: false,
    });

    useEffect(() => {
        if (massWeddingId) {
            axios
                .get(`${process.env.REACT_APP_API}/api/v1/massWedding/getWeddingChecklist/${massWeddingId}`, {
                    withCredentials: true,
                })
                .then((res) => {
                    if (res.data.checklist) {
                        setChecklist(res.data.checklist);
                    }
                })
                .catch((err) => {
                    console.error('Error fetching checklist:', err);
                    toast.error('Failed to fetch checklist.');
                });
        }
    }, [massWeddingId]);

    const verifiedItems = Object.keys(checklist).filter(key => checklist[key]);
    const unverifiedItems = Object.keys(checklist).filter(key => !checklist[key]);

    const formatLabel = (str) => {
        return str.replace(/([A-Z])/g, ' $1').trim();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Mass Wedding Checklist
            </Typography>

            <SectionCard>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Groom Checklist
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <List>
                        {Object.entries(checklist)
                            .filter(([key]) => key.startsWith('Groom'))
                            .map(([key, value]) => (
                                <ListItem key={key} sx={{ py: 1 }}>
                                    <Typography sx={{ flexGrow: 1 }}>
                                        {formatLabel(key)}
                                    </Typography>
                                    <VerificationChip verified={value} />
                                </ListItem>
                            ))}
                    </List>
                </CardContent>
            </SectionCard>

            <SectionCard>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Bride Checklist
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <List>
                        {Object.entries(checklist)
                            .filter(([key]) => key.startsWith('Bride'))
                            .map(([key, value]) => (
                                <ListItem key={key} sx={{ py: 1 }}>
                                    <Typography sx={{ flexGrow: 1 }}>
                                        {formatLabel(key)}
                                    </Typography>
                                    <VerificationChip verified={value} />
                                </ListItem>
                            ))}
                    </List>
                </CardContent>
            </SectionCard>

            <SectionCard>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Other Documents
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <List>
                        {Object.entries(checklist)
                            .filter(([key]) =>
                                key === 'PermitFromtheParishOftheBride' ||
                                key === 'ChildBirthCertificate'
                            )
                            .map(([key, value]) => (
                                <ListItem key={key} sx={{ py: 1 }}>
                                    <Typography sx={{ flexGrow: 1 }}>
                                        {formatLabel(key)}
                                    </Typography>
                                    <VerificationChip verified={value} />
                                </ListItem>
                            ))}
                    </List>
                </CardContent>
            </SectionCard>

            <SectionCard>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Seminar / Additional
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <List>
                        {Object.entries(checklist)
                            .filter(([key]) =>
                                key === 'PreMarriageSeminar' ||
                                key === 'CanonicalInterview' ||
                                key === 'Confession'
                            )
                            .map(([key, value]) => (
                                <ListItem key={key} sx={{ py: 1 }}>
                                    <Typography sx={{ flexGrow: 1 }}>
                                        {formatLabel(key)}
                                    </Typography>
                                    <VerificationChip verified={value} />
                                </ListItem>
                            ))}
                    </List>
                </CardContent>
            </SectionCard>
        </Box>
    );
};

export default MassWeddingChecklist;