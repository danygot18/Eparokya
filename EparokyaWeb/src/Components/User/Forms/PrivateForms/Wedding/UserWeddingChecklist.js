import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
    List,
    ListItem,
    Chip,
    Button,
    Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';


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

    // console.log(weddingId)
    useEffect(() => {
        if (weddingId) {
            axios
                .get(`${process.env.REACT_APP_API}/api/v1/getWeddingChecklist/${weddingId}`, {
                    withCredentials: true,
                })
                .then((res) => {
                    if (res.data.checklist) {
                        setChecklist(res.data.checklist);
                        // console.log(res.data)
                    }
                })
                .catch((err) => {
                    console.error('Error fetching checklist:', err);
                });
        }
    }, [weddingId]);
    const formatLabel = (key) => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/(\d+)/g, ' $1')
            .trim();
    };

    // Group checklist items by category
    const groomItems = [
        'GroomNewBaptismalCertificate',
        'GroomNewConfirmationCertificate',
        'GroomMarriageLicense',
        'GroomMarriageBans',
        'GroomOrigCeNoMar',
        'GroomOrigPSA',
        'GroomOnebyOne',
        'GroomTwobyTwo'
    ];

    const brideItems = [
        'BrideNewBaptismalCertificate',
        'BrideNewConfirmationCertificate',
        'BrideMarriageLicense',
        'BrideMarriageBans',
        'BrideOrigCeNoMar',
        'BrideOrigPSA',
        'BrideOnebyOne',
        'BrideTwobyTwo'
    ];

    const otherDocs = [
        'PermitFromtheParishOftheBride',
        'ChildBirthCertificate'
    ];

    const seminars = [
        'PreMarriageSeminar1',
        'PreMarriageSeminar2',
        'PreMarriageSeminar3',
        'CanonicalInterview',
        'Confession'
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Wedding Checklist
            </Typography>

            {/* Groom Checklist */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Groom Documents
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <List>
                        {groomItems.map((item) => (
                            <ListItem key={item} sx={{ py: 1 }}>
                                <Typography sx={{ flexGrow: 1 }}>
                                    {formatLabel(item)}
                                </Typography>
                                <Chip
                                    label={checklist[item] ? "Verified" : "Unverified"}
                                    color={checklist[item] ? "success" : "default"}
                                    icon={checklist[item] ? <CheckCircleIcon /> : <CancelIcon />}
                                    variant="outlined"
                                />
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>

            {/* Bride Checklist */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Bride Documents
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <List>
                        {brideItems.map((item) => (
                            <ListItem key={item} sx={{ py: 1 }}>
                                <Typography sx={{ flexGrow: 1 }}>
                                    {formatLabel(item)}
                                </Typography>
                                <Chip
                                    label={checklist[item] ? "Verified" : "Unverified"}
                                    color={checklist[item] ? "success" : "default"}
                                    icon={checklist[item] ? <CheckCircleIcon /> : <CancelIcon />}
                                    variant="outlined"
                                />
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>

            {/* Other Documents */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Other Documents
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <List>
                        {otherDocs.map((item) => (
                            <ListItem key={item} sx={{ py: 1 }}>
                                <Typography sx={{ flexGrow: 1 }}>
                                    {formatLabel(item)}
                                </Typography>
                                <Chip
                                    label={checklist[item] ? "Verified" : "Unverified"}
                                    color={checklist[item] ? "success" : "default"}
                                    icon={checklist[item] ? <CheckCircleIcon /> : <CancelIcon />}
                                    variant="outlined"
                                />
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>

            {/* Seminars */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        Seminars
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <List>
                        {seminars.map((item) => (
                            <ListItem key={item} sx={{ py: 1 }}>
                                <Typography sx={{ flexGrow: 1 }}>
                                    {formatLabel(item)}
                                </Typography>
                                <Chip
                                    label={checklist[item] ? "Verified" : "Unverified"}
                                    color={checklist[item] ? "success" : "default"}
                                    icon={checklist[item] ? <CheckCircleIcon /> : <CancelIcon />}
                                    variant="outlined"
                                />
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>

            {/* Summary Paper */}

        </Box>
    );
};

export default UserWeddingChecklist;

