import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import baseURL from "../../../assets/common/baseUrl";

const MemberDetail = ({ route }) => {
    const { memberId } = route.params;
    const [member, setMember] = useState(null);

    useEffect(() => {
        const fetchMemberDetails = async () => {
            try {
                const response = await axios.get(`${baseURL}/member/${memberId}`);
                setMember(response.data);  
            } catch (error) {
                console.error("Error fetching member details:", error);
            }
        };
    
        fetchMemberDetails();  
    }, [memberId]);
    

    if (!member) {
        return <Text>Loading...</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: member.image }} style={styles.image} />
            <Text style={styles.name}>{member.firstName} {member.lastName}</Text>
            <Text style={styles.details}>Position: {member.position}</Text>
            <Text style={styles.details}>Age: {member.age}</Text>
            <Text style={styles.details}>Birthday: {new Date(member.birthday).toLocaleDateString()}</Text>
            <Text style={styles.details}>Address:</Text>
            <Text style={styles.details}>Barangay: {member.address.baranggay}</Text>
            <Text style={styles.details}>Zip: {member.address.zip}</Text>
            <Text style={styles.details}>City: {member.address.city}</Text>
            <Text style={styles.details}>Country: {member.address.country}</Text>

            <Text style={styles.details}>Contributions:</Text>
            {member.contributions.map((contribution, index) => (
                <View key={index} style={styles.contribution}>
                    <Text style={styles.details}>Title: {contribution.title}</Text>
                    <Text style={styles.details}>Description: {contribution.description}</Text>
                    {contribution.image && <Image source={{ uri: contribution.image }} style={styles.contributionImage} />}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
        alignSelf: 'center',
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    details: {
        fontSize: 16,
        marginVertical: 5,
    },
    contribution: {
        marginVertical: 10,
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    contributionImage: {
        width: 100,
        height: 100,
        marginTop: 10,
    },
});

export default MemberDetail;
