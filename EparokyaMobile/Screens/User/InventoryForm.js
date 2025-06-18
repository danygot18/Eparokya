import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    TextInput,
    FlatList,
    Alert,
    RefreshControl,
} from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import baseURL from '../../assets/common/baseUrl';
import { useSelector } from 'react-redux';

const InventoryForm = () => {
    const { user, token } = useSelector((state) => state.auth);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [openBorrowDialog, setOpenBorrowDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [borrowQuantity, setBorrowQuantity] = useState('');
    
    // Enhanced borrow history state
    const [borrowHistory, setBorrowHistory] = useState({
        pending: [],
        borrowed: [],
        returned: [],
        rejected: []
    });
    
    const [tabValue, setTabValue] = useState(0); // For history tabs
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const getConfig = () => ({
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });

    const ministryRoles = Array.isArray(user?.ministryRoles)
        ? user.ministryRoles
        : user?.ministryRoles
            ? [user.ministryRoles]
            : [];

    const hasAllowedRole = ministryRoles.some(role =>
        role?.role === 'Coordinator' || role?.role === 'Assistant Coordinator'
    );

    useEffect(() => {
        const fetchInventory = async () => {
            if (!user?._id) return;

            setLoading(true);
            try {
                const { data } = await axios.get(`${baseURL}/inventory`, getConfig());
                setInventory(data.inventoryItems);

                // Enhanced borrow history organization
                const history = {
                    pending: [],
                    borrowed: [],
                    returned: [],
                    rejected: []
                };

                data.inventoryItems.forEach(item => {
                    item.borrowHistory.forEach(record => {
                        if (record.user === user._id || record.user._id === user._id) {
                            const historyRecord = {
                                ...record,
                                itemId: item._id,
                                itemName: item.name,
                                itemCategory: item.category,
                                itemLocation: item.location,
                                itemUnit: item.unit || 'pcs'
                            };
                            
                            if (record.status === 'pending') {
                                history.pending.push(historyRecord);
                            } else if (record.status === 'borrowed') {
                                history.borrowed.push(historyRecord);
                            } else if (record.status === 'returned') {
                                history.returned.push(historyRecord);
                            } else if (record.status === 'rejected') {
                                history.rejected.push(historyRecord);
                            }
                        }
                    });
                });

                setBorrowHistory(history);

            } catch (err) {
                Alert.alert('Error', 'Failed to fetch inventory');
                console.error('Inventory fetch error:', err);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        };

        fetchInventory();
    }, [user, token, refreshing]);

    const onRefresh = () => {
        setRefreshing(true);
    };

    const handleBorrowOpen = (item) => {
        setSelectedItem(item);
        setBorrowQuantity('1');
        setOpenBorrowDialog(true);
    };

    const handleBorrowClose = () => {
        setOpenBorrowDialog(false);
        setSelectedItem(null);
    };

    const handleBorrowSubmit = async () => {
        try {
            await axios.post(
                `${baseURL}/inventory/${selectedItem._id}/borrow`,
                { quantity: parseInt(borrowQuantity) },
                getConfig()
            );
            Alert.alert('Success', 'Borrow request submitted. Waiting for admin approval.');
            handleBorrowClose();
            setRefreshing(true); // Trigger refresh
        } catch (error) {
            Alert.alert('Error', error.response?.data?.message || 'Failed to request borrow');
            console.error('Borrow error:', error);
        }
    };

    const renderStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <MaterialIcons name="hourglass-empty" size={20} color="#FFA500" />;
            case 'borrowed': return <MaterialIcons name="check-circle" size={20} color="#1976D2" />;
            case 'returned': return <MaterialIcons name="check-circle" size={20} color="#4CAF50" />;
            case 'rejected': return <MaterialIcons name="cancel" size={20} color="#F44336" />;
            default: return null;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const getHistoryItems = () => {
        switch (tabValue) {
            case 0: return [...borrowHistory.pending, ...borrowHistory.borrowed, ...borrowHistory.returned, ...borrowHistory.rejected];
            case 1: return borrowHistory.pending;
            case 2: return borrowHistory.borrowed;
            case 3: return borrowHistory.returned;
            case 4: return borrowHistory.rejected;
            default: return [];
        }
    };

    // Get paginated history items
    const getPaginatedHistory = () => {
        const allItems = getHistoryItems().sort((a, b) => 
            new Date(b.borrowedAt || b.requestedAt) - new Date(a.borrowedAt || a.requestedAt)
        );
        const startIndex = (currentPage - 1) * itemsPerPage;
        return allItems.slice(startIndex, startIndex + itemsPerPage);
    };

    const totalPages = () => {
        const allItems = getHistoryItems();
        return Math.ceil(allItems.length / itemsPerPage);
    };

    const handleHistoryModalOpen = () => {
        setShowHistoryModal(true);
        setCurrentPage(1); // Reset to first page when opening modal
    };

    const handleHistoryModalClose = () => {
        setShowHistoryModal(false);
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
            </View>
            <Text style={styles.itemDescription}>
                {item.description?.substring(0, 50)}...
            </Text>
            <View style={styles.itemFooter}>
                <Text style={styles.itemQuantity}>
                    Available: {item.availableQuantity} {item.unit}
                </Text>
                <Text style={styles.itemLocation}>{item.location}</Text>
            </View>
            <TouchableOpacity
                style={[
                    styles.borrowButton,
                    item.availableQuantity <= 0 && styles.disabledButton
                ]}
                disabled={item.availableQuantity <= 0}
                onPress={() => handleBorrowOpen(item)}
            >
                <MaterialIcons name="inventory" size={20} color="white" />
                <Text style={styles.borrowButtonText}>Request Borrow</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHistoryItem = ({ item }) => (
        <View style={styles.historyItem}>
            <View style={styles.historyItemHeader}>
                <Text style={styles.historyItemName}>{item.itemName}</Text>
                <View style={styles.statusContainer}>
                    {renderStatusIcon(item.status)}
                    <Text style={[
                        styles.statusText,
                        item.status === 'pending' && styles.pendingStatus,
                        item.status === 'borrowed' && styles.borrowedStatus,
                        item.status === 'returned' && styles.returnedStatus,
                        item.status === 'rejected' && styles.rejectedStatus,
                    ]}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Text>
                </View>
            </View>
            
            <Text style={styles.historyItemDetail}>
                Quantity: {item.quantity} {item.itemUnit}
            </Text>
            
            <Text style={styles.historyItemDetail}>
                Borrowed: {formatDate(item.borrowedAt || item.requestedAt)}
            </Text>
            
            {(item.status === 'returned' || item.status === 'rejected') && (
                <Text style={styles.historyItemDetail}>
                    {item.status === 'returned' ? 'Returned' : 'Rejected'}: {formatDate(item.returnedAt || item.rejectedAt)}
                </Text>
            )}
            
            {item.status === 'rejected' && item.rejectionReason && (
                <Text style={[styles.historyItemDetail, styles.rejectionReason]}>
                    Reason: {item.rejectionReason}
                </Text>
            )}
        </View>
    );

    if (!hasAllowedRole) {
        return (
            <View style={styles.container}>
                <View style={styles.card}>
                    <Text style={styles.errorText}>
                        Only Coordinators or Assistant Coordinators can request to borrow items.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            <Text style={styles.title}>Request to Borrow Inventory</Text>

            {/* Borrow History Button */}
            <TouchableOpacity 
                style={styles.historyButton}
                onPress={handleHistoryModalOpen}
            >
                <MaterialIcons name="history" size={20} color="white" />
                <Text style={styles.historyButtonText}>View Borrow History</Text>
            </TouchableOpacity>

            {/* Inventory List */}
            {loading ? (
                <ActivityIndicator size="large" style={styles.loader} />
            ) : (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Available Items</Text>
                    {inventory.length === 0 ? (
                        <Text style={styles.noItemsText}>No inventory items found</Text>
                    ) : (
                        <FlatList
                            data={inventory}
                            renderItem={renderItem}
                            keyExtractor={item => item._id}
                            scrollEnabled={false}
                        />
                    )}
                </View>
            )}

            {/* Borrow Dialog */}
            <Modal
                visible={openBorrowDialog}
                animationType="slide"
                transparent={true}
                onRequestClose={handleBorrowClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Request to Borrow Item</Text>
                        <Text style={styles.modalText}>
                            <Text style={styles.boldText}>Item:</Text> {selectedItem?.name}
                        </Text>
                        <Text style={styles.modalText}>
                            <Text style={styles.boldText}>Available:</Text> {selectedItem?.availableQuantity} {selectedItem?.unit}
                        </Text>

                        <Text style={styles.inputLabel}>Quantity to Borrow</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={borrowQuantity}
                            onChangeText={(text) => {
                                const num = parseInt(text) || 0;
                                if (!isNaN(num)) {
                                    setBorrowQuantity(
                                        Math.max(1, Math.min(selectedItem?.availableQuantity, num)).toString()
                                    );
                                } else if (text === '') {
                                    setBorrowQuantity('');
                                }
                            }}
                        />

                        <Text style={styles.noteText}>
                            Your request will be reviewed by an admin before approval.
                        </Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={handleBorrowClose}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.submitButton]}
                                onPress={handleBorrowSubmit}
                                disabled={!borrowQuantity}
                            >
                                <Text style={styles.buttonText}>Submit Request</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Borrow History Modal */}
            <Modal
                visible={showHistoryModal}
                animationType="slide"
                transparent={false}
                onRequestClose={handleHistoryModalClose}
            >
                <View style={styles.historyModalContainer}>
                    <View style={styles.historyModalHeader}>
                        <Text style={styles.historyModalTitle}>My Borrow History</Text>
                        <TouchableOpacity onPress={handleHistoryModalClose}>
                            <MaterialIcons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    {/* History Tabs */}
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, tabValue === 0 && styles.activeTab]}
                            onPress={() => {
                                setTabValue(0);
                                setCurrentPage(1);
                            }}
                        >
                            <Text style={[styles.tabText, tabValue === 0 && styles.activeTabText]}>
                                All ({[...borrowHistory.pending, ...borrowHistory.borrowed, ...borrowHistory.returned, ...borrowHistory.rejected].length})
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[styles.tab, tabValue === 1 && styles.activeTab]}
                            onPress={() => {
                                setTabValue(1);
                                setCurrentPage(1);
                            }}
                        >
                            <Text style={[styles.tabText, tabValue === 1 && styles.activeTabText]}>
                                Pending ({borrowHistory.pending.length})
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[styles.tab, tabValue === 2 && styles.activeTab]}
                            onPress={() => {
                                setTabValue(2);
                                setCurrentPage(1);
                            }}
                        >
                            <Text style={[styles.tabText, tabValue === 2 && styles.activeTabText]}>
                                Borrowed ({borrowHistory.borrowed.length})
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[styles.tab, tabValue === 3 && styles.activeTab]}
                            onPress={() => {
                                setTabValue(3);
                                setCurrentPage(1);
                            }}
                        >
                            <Text style={[styles.tabText, tabValue === 3 && styles.activeTabText]}>
                                Returned ({borrowHistory.returned.length})
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[styles.tab, tabValue === 4 && styles.activeTab]}
                            onPress={() => {
                                setTabValue(4);
                                setCurrentPage(1);
                            }}
                        >
                            <Text style={[styles.tabText, tabValue === 4 && styles.activeTabText]}>
                                Rejected ({borrowHistory.rejected.length})
                            </Text>
                        </TouchableOpacity>
                    </View>
                    
                    {/* History List */}
                    {getHistoryItems().length === 0 ? (
                        <Text style={styles.noItemsText}>No history found for this status</Text>
                    ) : (
                        <FlatList
                            data={getPaginatedHistory()}
                            renderItem={renderHistoryItem}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={styles.historyListContainer}
                        />
                    )}

                    {/* Pagination Controls */}
                    {getHistoryItems().length > itemsPerPage && (
                        <View style={styles.paginationContainer}>
                            <TouchableOpacity
                                style={[styles.paginationButton, currentPage === 1 && styles.disabledPaginationButton]}
                                onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                            >
                                <Text style={styles.paginationText}>Previous</Text>
                            </TouchableOpacity>
                            
                            <Text style={styles.pageIndicator}>
                                Page {currentPage} of {totalPages()}
                            </Text>
                            
                            <TouchableOpacity
                                style={[styles.paginationButton, currentPage === totalPages() && styles.disabledPaginationButton]}
                                onPress={() => setCurrentPage(Math.min(totalPages(), currentPage + 1))}
                                disabled={currentPage === totalPages()}
                            >
                                <Text style={styles.paginationText}>Next</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        fontSize: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#444',
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    itemCategory: {
        backgroundColor: '#e0e0e0',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        fontSize: 14,
    },
    itemDescription: {
        color: '#666',
        marginBottom: 8,
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    itemQuantity: {
        fontWeight: 'bold',
        color: '#2e7d32',
    },
    itemLocation: {
        color: '#666',
    },
    borrowButton: {
        flexDirection: 'row',
        backgroundColor: '#1976d2',
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        backgroundColor: '#9e9e9e',
    },
    borrowButtonText: {
        color: 'white',
        marginLeft: 8,
        fontWeight: 'bold',
    },
    historyButton: {
        flexDirection: 'row',
        backgroundColor: '#4a148c',
        padding: 12,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    historyButtonText: {
        color: 'white',
        marginLeft: 8,
        fontWeight: 'bold',
        fontSize: 16,
    },
    historyItem: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 8,
    },
    historyItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    historyItemName: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
    },
    historyItemDetail: {
        color: '#666',
        fontSize: 14,
        marginBottom: 4,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        marginLeft: 4,
        fontSize: 14,
    },
    pendingStatus: {
        color: '#FFA500',
    },
    borrowedStatus: {
        color: '#1976D2',
    },
    returnedStatus: {
        color: '#4CAF50',
    },
    rejectedStatus: {
        color: '#F44336',
    },
    rejectionReason: {
        fontStyle: 'italic',
        color: '#F44336',
    },
    loader: {
        marginVertical: 24,
    },
    noItemsText: {
        textAlign: 'center',
        color: '#666',
        marginVertical: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 20,
        width: '90%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 8,
    },
    boldText: {
        fontWeight: 'bold',
    },
    inputLabel: {
        marginTop: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 10,
        marginBottom: 16,
    },
    noteText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        padding: 12,
        borderRadius: 4,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 4,
    },
    cancelButton: {
        backgroundColor: '#e0e0e0',
    },
    submitButton: {
        backgroundColor: '#1976d2',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        flexWrap: 'wrap',
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginRight: 8,
        marginBottom: 8,
        borderRadius: 4,
        backgroundColor: '#e0e0e0',
    },
    activeTab: {
        backgroundColor: '#1976d2',
    },
    tabText: {
        color: '#333',
        fontSize: 14,
    },
    activeTabText: {
        color: 'white',
    },
    historyModalContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    historyModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    historyModalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    historyListContainer: {
        paddingBottom: 16,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    paginationButton: {
        padding: 10,
        backgroundColor: '#1976d2',
        borderRadius: 4,
    },
    disabledPaginationButton: {
        backgroundColor: '#9e9e9e',
    },
    paginationText: {
        color: 'white',
        fontWeight: 'bold',
    },
    pageIndicator: {
        fontSize: 16,
        color: '#333',
    },
});

export default InventoryForm;