import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Modal,
    Dimensions,
} from 'react-native';
import axios from 'axios';
import { Calendar, Agenda, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import baseURL from '../../assets/common/baseUrl';

// Calendar locale config
LocaleConfig.locales['en'] = {
    monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ],
    monthNamesShort: [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ],
    dayNames: [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
    ],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};
LocaleConfig.defaultLocale = 'en';

const MinistryCalendar = ({ navigation }) => {
    const { colors } = useTheme();
    const [ministries, setMinistries] = useState([]);
    const [selectedMinistry, setSelectedMinistry] = useState(null);
    const [events, setEvents] = useState([]);
    const [selectedEvents, setSelectedEvents] = useState([]); // For all events on a date
    const [calendarTitle, setCalendarTitle] = useState('General Calendar');
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState('month');
    const [showMinistries, setShowMinistries] = useState(false);
    const [currentDate, setCurrentDate] = useState(moment().format('YYYY-MM-DD'));
    const [showEventModal, setShowEventModal] = useState(false);

    useEffect(() => {
        const fetchMinistries = async () => {
            try {
                const response = await axios.get(
                    `${baseURL}/ministryCategory/getAllMinistryCategories`,
                    { withCredentials: true }
                );
                setMinistries(response.data.categories || []);
            } catch (error) {
                console.error('Error fetching ministries:', error);
            }
        };

        const fetchGeneralEvents = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                    `${baseURL}/ministryCategory/getAllMinistryEvents`,
                    { withCredentials: true }
                );
                const formattedEvents = response.data.map((event) => ({
                    ...event,
                    date: moment(event.customeventDate).format('YYYY-MM-DD'),
                    title: event.title,
                    customeventTime: event.customeventTime || null,
                }));
                setEvents(formattedEvents);
            } catch (error) {
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMinistries();
        fetchGeneralEvents();
    }, []);

    const handleMinistryClick = async (ministry) => {
        setSelectedMinistry(ministry);
        setCalendarTitle(`${ministry.name} Calendar`);
        setLoading(true);
        try {
            const response = await axios.get(
                `${baseURL}/ministryCategory/ministryEvents/${ministry._id}`,
                { withCredentials: true }
            );
            const formattedEvents = response.data.map((event) => ({
                ...event,
                date: moment(event.customeventDate).format('YYYY-MM-DD'),
                title: event.title,
                customeventTime: event.customeventTime || null,
            }));
            setEvents(formattedEvents);
        } catch (error) {
            setEvents([]);
        } finally {
            setLoading(false);
        }
        setShowMinistries(false);
    };

    // Show all events for a date in modal
    const fetchEventsForDate = (date) => {
        const dayEvents = events.filter(e => e.date === date);
        setSelectedEvents(dayEvents);
        setShowEventModal(true);
    };

    const handleDayPress = (day) => {
        fetchEventsForDate(day.dateString);
    };

    const renderMonthView = () => (
        <View style={styles.calendarContainer}>
            <Calendar
                current={currentDate}
                onDayPress={handleDayPress}
                markedDates={events.reduce((acc, event) => {
                    acc[event.date] = { marked: true, dotColor: '#388e3c' };
                    return acc;
                }, {})}
                theme={{
                    backgroundColor: '#ffffff',
                    calendarBackground: '#ffffff',
                    textSectionTitleColor: '#388e3c',
                    selectedDayBackgroundColor: '#388e3c',
                    selectedDayTextColor: '#ffffff',
                    todayTextColor: '#388e3c',
                    dayTextColor: '#2d4150',
                    textDisabledColor: '#d9e1e8',
                    dotColor: '#388e3c',
                    selectedDotColor: '#ffffff',
                    arrowColor: '#388e3c',
                    monthTextColor: '#388e3c',
                    textDayFontWeight: '500',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '500',
                    textDayFontSize: 14,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 14,
                }}
                renderArrow={(direction) => (
                    <Icon
                        name={direction === 'left' ? 'chevron-left' : 'chevron-right'}
                        size={24}
                        color="#388e3c"
                    />
                )}
                onPressArrowLeft={() => {
                    const newDate = moment(currentDate).subtract(1, 'month').format('YYYY-MM-DD');
                    setCurrentDate(newDate);
                }}
                onPressArrowRight={() => {
                    const newDate = moment(currentDate).add(1, 'month').format('YYYY-MM-DD');
                    setCurrentDate(newDate);
                }}
            />
        </View>
    );

    const renderAgendaView = () => (
        <Agenda
            items={events.reduce((acc, event) => {
                if (!acc[event.date]) {
                    acc[event.date] = [];
                }
                acc[event.date].push(event);
                return acc;
            }, {})}
            selected={currentDate}
            onDayPress={(day) => setCurrentDate(day.dateString)}
            renderItem={(item) => (
                <TouchableOpacity
                    style={styles.agendaItem}
                    onPress={() => fetchEventsForDate(item.date)}
                >
                    <Text style={styles.agendaItemTitle}>{item.title}</Text>
                    {item.customeventTime && (
                        <Text style={styles.agendaItemTime}>
                            {moment(item.customeventTime, 'h:mm A').format('h:mm A')}
                        </Text>
                    )}
                </TouchableOpacity>
            )}
            renderEmptyDate={() => (
                <View style={styles.emptyDate}>
                    <Text style={styles.emptyDateText}>No events scheduled</Text>
                </View>
            )}
            theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                agendaKnobColor: '#388e3c',
                agendaDayTextColor: '#388e3c',
                agendaDayNumColor: '#388e3c',
                agendaTodayColor: '#388e3c',
                selectedDayBackgroundColor: '#388e3c',
                selectedDayTextColor: '#ffffff',
                dotColor: '#388e3c',
            }}
        />
    );

    const renderView = () => {
        switch (currentView) {
            case 'month':
                return renderMonthView();
            case 'week':
            case 'day':
                return renderAgendaView();
            default:
                return renderMonthView();
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>{calendarTitle}</Text>
                <TouchableOpacity
                    onPress={() => setShowMinistries(!showMinistries)}
                    style={styles.ministryButton}
                >
                    <Icon name="filter-list" size={24} color="#388e3c" />
                </TouchableOpacity>
            </View>

            {/* View Selector */}
            <View style={styles.viewSelector}>
                <TouchableOpacity
                    style={[
                        styles.viewButton,
                        currentView === 'month' && styles.activeViewButton
                    ]}
                    onPress={() => setCurrentView('month')}
                >
                    <Text style={[
                        styles.viewButtonText,
                        currentView === 'month' && styles.activeViewButtonText
                    ]}>
                        Month
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.viewButton,
                        currentView === 'week' && styles.activeViewButton
                    ]}
                    onPress={() => setCurrentView('week')}
                >
                    <Text style={[
                        styles.viewButtonText,
                        currentView === 'week' && styles.activeViewButtonText
                    ]}>
                        Week
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.viewButton,
                        currentView === 'day' && styles.activeViewButton
                    ]}
                    onPress={() => setCurrentView('day')}
                >
                    <Text style={[
                        styles.viewButtonText,
                        currentView === 'day' && styles.activeViewButtonText
                    ]}>
                        Day
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Main Content */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#388e3c" />
                </View>
            ) : (
                <View style={styles.content}>
                    {renderView()}
                </View>
            )}

            {/* Ministries Modal */}
            <Modal
                visible={showMinistries}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowMinistries(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Ministry</Text>
                            <TouchableOpacity onPress={() => setShowMinistries(false)}>
                                <Icon name="close" size={24} color="#388e3c" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            <TouchableOpacity
                                style={[
                                    styles.ministryItem,
                                    !selectedMinistry && styles.selectedMinistryItem,
                                ]}
                                onPress={() => {
                                    setSelectedMinistry(null);
                                    setCalendarTitle('General Calendar');
                                    setShowMinistries(false);
                                }}
                            >
                                <Text style={!selectedMinistry ? styles.selectedMinistryText : styles.ministryText}>
                                    General Calendar
                                </Text>
                            </TouchableOpacity>
                            {ministries.map((ministry) => (
                                <TouchableOpacity
                                    key={ministry._id}
                                    style={[
                                        styles.ministryItem,
                                        selectedMinistry && selectedMinistry._id === ministry._id && styles.selectedMinistryItem,
                                    ]}
                                    onPress={() => handleMinistryClick(ministry)}
                                >
                                    <Text
                                        style={[
                                            styles.ministryText,
                                            selectedMinistry && selectedMinistry._id === ministry._id && styles.selectedMinistryText
                                        ]}
                                    >
                                        {ministry.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Event Details Modal (shows all events for the selected date) */}
            <Modal
                visible={showEventModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowEventModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.eventModalContent}>

                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Event Details</Text>
                            <TouchableOpacity onPress={() => setShowEventModal(false)}>
                                <Icon name="close" size={24} color="#388e3c" />
                            </TouchableOpacity>
                        </View>

                        {selectedEvents.length === 0 ? (
                            <Text style={{ color: '#888', textAlign: 'center', marginTop: 20 }}>
                                No events for this date.
                            </Text>
                        ) : (
                            selectedEvents.map((event) => (
                                <View key={event._id} style={{ marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 }}>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Title:</Text>
                                        <Text style={styles.detailValue}>{event.title}</Text>
                                    </View>
                                    {/* <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Title:</Text>
                                        <Text style={styles.detailValue}>{event.title}</Text>
                                    </View> */}
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Description:</Text>
                                        <Text style={styles.detailValue}>{event.description || 'No description provided.'}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Date:</Text>
                                        <Text style={styles.detailValue}>{moment(event.customeventDate).format('MMMM D, YYYY')}</Text>
                                    </View>
                                    {event.customeventTime && (
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Time:</Text>
                                            <Text style={styles.detailValue}>{event.customeventTime}</Text>
                                        </View>
                                    )}
                                </View>
                            ))
                        )}

                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#388e3c',
    },
    ministryButton: {
        padding: 5,
    },
    viewSelector: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    viewButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    activeViewButton: {
        backgroundColor: '#388e3c',
    },
    viewButtonText: {
        color: '#388e3c',
        fontWeight: '500',
    },
    activeViewButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
    },
    calendarContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: '#ffffff',
    },
    agendaItem: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        padding: 15,
        marginRight: 10,
        marginTop: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#388e3c',
        elevation: 2,
    },
    agendaItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#388e3c',
    },
    agendaItemTime: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30,
        alignItems: 'center',
    },
    emptyDateText: {
        color: '#888',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: Dimensions.get('window').height * 0.7,
    },
    eventModalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: Dimensions.get('window').height * 0.7,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#388e3c',
    },
    ministryItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    selectedMinistryItem: {
        backgroundColor: '#e8f5e9',
    },
    ministryText: {
        fontSize: 16,
        color: '#333',
    },
    selectedMinistryText: {
        fontWeight: 'bold',
        color: '#388e3c',
    },
    eventDetails: {
        flex: 1,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 15,
        flexWrap: 'wrap',
    },
    detailLabel: {
        fontWeight: 'bold',
        width: 100,
        color: '#388e3c',
    },
    detailValue: {
        flex: 1,
        color: '#333',
    },
});

export default MinistryCalendar;