import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import baseURL from '../../../assets/common/baseUrl';

const ConfirmedFuneralDetails = ({ route }) => {
    const { funeralId } = route.params;
    const [funeralDetails, setFuneralDetails] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            if (!funeralId) {
                setError('Funeral ID is missing.');
                return;
            }
            try {
                const response = await axios.get(`${baseURL}/funeral/${funeralId}`);
                const data = response.data;

                setFuneralDetails({
                    ...data,
                    userScheduledDate: data.userScheduledDate ? new Date(data.userScheduledDate) : null,
                    adminScheduledDate: data.adminScheduledDate ? new Date(data.adminScheduledDate) : null,
                });
            } catch (err) {
                console.error('Error fetching funeral details:', err.message);
                setError('Unable to fetch funeral details. Please try again later.');
            }
        };

        fetchDetails();
    }, [funeralId]);

    if (!funeralDetails) {
        return <Text style={styles.loading}>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.title}>Funeral Submission Details</Text>
                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Text>Name: {funeralDetails.name?.firstName} {funeralDetails.name?.lastName}</Text>
                <Text>Gender: {funeralDetails.gender || 'N/A'}</Text>
                <Text>Age: {funeralDetails.age || 'N/A'}</Text>
                <Text>Contact Person: {funeralDetails.contactPerson}</Text>
                <Text>Phone: {funeralDetails.phone || 'N/A'}</Text>
                <Text>
                    Address: {funeralDetails.address?.state}, {funeralDetails.address?.country}, {funeralDetails.address?.zip}
                </Text>
                <Text>
                    User Scheduled Date:{' '}
                    {funeralDetails.userScheduledDate
                        ? funeralDetails.userScheduledDate.toLocaleDateString()
                        : 'N/A'}
                </Text>
                <Text>
                    Admin Scheduled Date:{' '}
                    {funeralDetails.adminScheduledDate
                        ? funeralDetails.adminScheduledDate.toLocaleDateString()
                        : 'N/A'}
                </Text>
                <Text>Funeral Status: {funeralDetails.funeralStatus || 'N/A'}</Text>

                <View style={styles.commentsContainer}>
                    <Text style={styles.commentTitle}>Admin Replies:</Text>
                    {funeralDetails.comments?.length > 0 ? (
                        funeralDetails.comments.map((comment, index) => (
                            <View key={comment._id || index} style={styles.comment}>
                                <Text>
                                    <Text style={styles.bold}>Priest:</Text> {comment.priest || 'N/A'}
                                </Text>
                                <Text>
                                    <Text style={styles.bold}>Comment:</Text> {comment.text || 'No comment provided'}
                                </Text>
                                <Text>
                                    <Text style={styles.bold}>Date Added:</Text>{' '}
                                    {new Date(comment.createdAt).toLocaleString()}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text>No comments available.</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    error: {
        color: 'red',
        fontSize: 16,
    },
    loading: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
    },
    commentsContainer: {
        marginTop: 20,
    },
    commentTitle: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    comment: {
        backgroundColor: '#f8f8f8',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        borderColor: 'black',
        borderWidth: 2,
    },
    bold: {
        fontWeight: 'bold',
    },
});

export default ConfirmedFuneralDetails;
