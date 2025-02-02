import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import baseURL from "../../../assets/common/baseUrl";
import { useNavigation } from '@react-navigation/native'; 

const MemberList = () => {
    const [members, setMembers] = useState([]);
    const navigation = useNavigation(); 

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get(`${baseURL}/member/`);
                console.log(response.data); 
                setMembers(response.data); 
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };
   
        fetchMembers();
    }, []);
   
    const renderMemberCard = ({ item }) => {
        const yearBatch = item.memberYearBatch;
        const yearRange = yearBatch ? `${yearBatch.yearRange.startYear} - ${yearBatch.yearRange.endYear}` : 'No Year Batch';
    
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('MemberDetail', { memberId: item._id })}
            >
                {item.image && <Image source={{ uri: item.image }} style={styles.image} />}
                
                <Text style={styles.name}>
                    {item.firstName} {item.lastName}
                </Text>
    
                <Text style={styles.category}>
                    {item.ministryCategory?.name || 'No Ministry Category'}
                </Text>
    
                <Text style={styles.yearBatch}>
                    {yearBatch ? `${yearBatch.name} (${yearRange})` : 'No Year Batch'}
                </Text>
            </TouchableOpacity>
        );
    };
    

    return (
        <FlatList
            data={members}
            renderItem={renderMemberCard}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.container}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        elevation: 3,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.1,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 10,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    category: {
        fontSize: 14,
        textAlign: 'center',
        color: '#555',
    },
    yearBatch: {
        fontSize: 12,
        textAlign: 'center',
        color: '#888',
    },
});

export default MemberList;
