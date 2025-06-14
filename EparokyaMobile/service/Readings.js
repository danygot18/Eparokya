import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Modal,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import baseURL from '../assets/common/baseUrl';

const formatDate = (date) => {
    return date.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const getSunday = (offsetWeeks = 0) => {
    const date = new Date();
    const day = date.getDay();
    const sunday = new Date(date);
    sunday.setDate(date.getDate() + ((7 - day) % 7 + offsetWeeks * 7));
    return sunday;
};

const MassReadingsModal = () => {
    const [readings, setReadings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        axios
            .get(`${baseURL}/getAllreadings`)
            .then((res) => setReadings(res.data.readings || []))
            .catch(() => setReadings([]))
            .finally(() => setLoading(false));
    }, []);

    const thisSunday = getSunday();
    const nextSunday = getSunday(1);

    const findReading = (date) =>
        readings.find((r) => new Date(r.date).toDateString() === date.toDateString());

    const renderReading = (reading) => (
        <>
            <Text style={styles.readingText}>
                <Text style={styles.readingTitle}>First Reading: </Text>
                {reading.firstReading}
            </Text>
            <Text style={styles.readingText}>
                <Text style={styles.readingTitle}>Responsorial Psalm: </Text>
                {reading.responsorialPsalm}
            </Text>
            <Text style={styles.readingText}>
                <Text style={styles.readingTitle}>Response: </Text>
                {reading.response}
            </Text>
            <Text style={styles.readingText}>
                <Text style={styles.readingTitle}>Second Reading: </Text>
                {reading.secondReading}
            </Text>
            <Text style={[styles.readingText, { marginBottom: 0 }]}>
                <Text style={styles.readingTitle}>Gospel: </Text>
                {reading.gospel}
            </Text>
        </>
    );

    const currentReading = findReading(thisSunday);
    const upcomingReading = findReading(nextSunday);

    return (
        <>
            {/* Book Icon Button */}
            <TouchableOpacity
                style={styles.bookIconContainer}
                onPress={() => setModalVisible(true)}
            >
                <Icon name="book" size={28} color="#3F51B5" />
            </TouchableOpacity>

            {/* Readings Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Modal Header */}
                        <View style={styles.modalHeader}>
                            <Icon name="book" size={24} color="#3F51B5" />
                            <Text style={styles.modalTitle}>Mass Readings</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Icon name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>

                        {/* Modal Body */}
                        <ScrollView style={styles.modalBody}>
                            {loading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#3F51B5" />
                                </View>
                            ) : (
                                <>
                                    <View style={styles.readingSection}>
                                        <Text style={styles.sectionTitle}>
                                            Sunday ({formatDate(thisSunday)})
                                        </Text>
                                        {currentReading ? (
                                            renderReading(currentReading)
                                        ) : (
                                            <Text style={styles.noReadingsText}>No readings found for this Sunday.</Text>
                                        )}
                                    </View>

                                    <View style={styles.divider} />

                                    <View style={styles.readingSection}>
                                        <Text style={[styles.sectionTitle, styles.upcomingTitle]}>
                                            Upcoming Sunday ({formatDate(nextSunday)})
                                        </Text>
                                        {upcomingReading ? (
                                            renderReading(upcomingReading)
                                        ) : (
                                            <Text style={styles.noReadingsText}>No readings found for next Sunday.</Text>
                                        )}
                                    </View>
                                </>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    bookIconContainer: {
        
        padding: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: windowHeight * 0.8,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3F51B5',
        marginLeft: 10,
        flex: 1,
    },
    modalBody: {
        paddingHorizontal: 16,
    },
    loadingContainer: {
        paddingVertical: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    readingSection: {
        paddingVertical: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3F51B5',
        marginBottom: 12,
    },
    upcomingTitle: {
        color: '#9C27B0',
    },
    readingText: {
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 12,
        color: '#333',
    },
    readingTitle: {
        fontWeight: 'bold',
        color: '#555',
    },
    noReadingsText: {
        fontSize: 14,
        color: '#777',
        fontStyle: 'italic',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 8,
    },
});

export default MassReadingsModal;