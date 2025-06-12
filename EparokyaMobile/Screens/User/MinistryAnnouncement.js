import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useSelector } from "react-redux";
import baseURL from "../../assets/common/baseUrl";
// import eparokyaLogo from "../../assets/EPAROKYA-SYST.png";

const MinistryAnnouncement = () => {
  const [ministryCategoryId, setMinistryCategoryId] = useState(null);
  const [pinnedAnnouncements, setPinnedAnnouncements] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [ministryCategory, setMinistryCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const { user, token } = useSelector((state) => state.auth);

  // Helper function to check if user has acknowledged a post
  const hasUserAcknowledged = (announcement) => {
    if (!user || !announcement.acknowledgedBy) return false;
    return announcement.acknowledgedBy.some(
      (userObj) => userObj._id.toString() === user._id.toString()
    );
  };

  useEffect(() => {
    const fetchUserMinistries = async () => {
      try {
        const response = await axios.get(`${baseURL}/userMinistries`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.length > 0 && response.data[0].ministryId) {
          setMinistryCategories(response.data);
          setMinistryCategoryId(response.data[0].ministryId);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch user ministries.");
      }
    };
    fetchUserMinistries();
  }, []);

  useEffect(() => {
    if (!ministryCategoryId || ministryCategoryId === "undefined") return;
    const fetchAll = async () => {
      setLoading(true);
      await fetchPinnedAnnouncements(ministryCategoryId);
      await fetchAnnouncements(ministryCategoryId);
      await fetchMinistryUsers(ministryCategoryId);
      setLoading(false);
    };
    fetchAll();
  }, [ministryCategoryId, user]);

  const fetchMinistryUsers = async (id) => {
    if (!id || id === "undefined") return;
    try {
      const response = await axios.get(`${baseURL}/${id}/getUsers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users || []);
    } catch (error) {
      // handle error
    }
  };

  const fetchPinnedAnnouncements = async (id) => {
    if (!id || id === "undefined") return;
    try {
      const response = await axios.get(
        `${baseURL}/pinnedMinistryAnnouncement/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPinnedAnnouncements(response.data);
    } catch (error) {
      // handle error
    }
  };

  const fetchAnnouncements = async (id) => {
    if (!id || id === "undefined") return;
    try {
      const response = await axios.get(
        `${baseURL}/getMinistryAnnouncements/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnnouncements(response.data.filter((ann) => !ann.isPinned));
    } catch (error) {
      // handle error
    }
  };

  const handleAcknowledgeClick = (announcement) => {
    if (hasUserAcknowledged(announcement)) return;
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleConfirmAcknowledge = async () => {
    if (!selectedAnnouncement || !user?._id) {
      setIsModalOpen(false);
      return;
    }
    try {
      await axios.post(
        `${baseURL}/acknowledgeMinistryAnnouncement/${selectedAnnouncement._id}`,
        { user: user._id },
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchPinnedAnnouncements(ministryCategoryId);
      await fetchAnnouncements(ministryCategoryId);
      setIsModalOpen(false);
    } catch (error) {
      Alert.alert("Error", "Failed to acknowledge announcement.");
    }
  };

  const handleMinistryClick = (id) => {
    setMinistryCategoryId(id);
  };

  const filteredUsers = users.filter((user) => {
    const lowerSearch = searchTerm.toLowerCase();
    const nameMatch = user.name.toLowerCase().includes(lowerSearch);
    const roleMatch = user.ministryRoles?.some((ministryRole) => {
      const role =
        ministryRole.role === "Others"
          ? ministryRole.customRole || "others"
          : ministryRole.role || "member";
      return role.toLowerCase().includes(lowerSearch);
    });
    return nameMatch || roleMatch;
  });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#154314" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 0 && styles.activeTabBtn]}
          onPress={() => setActiveTab(0)}
        >
          <Text
            style={[styles.tabText, activeTab === 0 && styles.activeTabText]}
          >
            Announcements
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 1 && styles.activeTabBtn]}
          onPress={() => setActiveTab(1)}
        >
          <Text
            style={[styles.tabText, activeTab === 1 && styles.activeTabText]}
          >
            Members
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 0 && (
        <>
          {/* Ministry Buttons */}
          <ScrollView style={{ flex: 1 }}>
            {/* Ministry Buttons */}
            <ScrollView
              horizontal
              style={styles.ministryList}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingVertical: 0,
                paddingHorizontal: 2,
              }}
            >
              {ministryCategory.map((ministry) => (
                <TouchableOpacity
                  key={ministry.ministryId}
                  style={[
                    styles.ministryBtnSmall,
                    ministryCategoryId === ministry.ministryId &&
                      styles.activeMinistryBtnSmall,
                  ]}
                  onPress={() => handleMinistryClick(ministry.ministryId)}
                >
                  <Text
                    style={[
                      styles.ministryBtnSmallText,
                      ministryCategoryId === ministry.ministryId &&
                        styles.activeMinistryBtnSmallText,
                    ]}
                    numberOfLines={1}
                  >
                    {ministry.ministryName}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Announcements Section */}
            {pinnedAnnouncements.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pinned Announcements</Text>
                {pinnedAnnouncements.map((announcement) => {
                  const isAcknowledged = hasUserAcknowledged(announcement);
                  return (
                    <View
                      key={announcement._id}
                      style={styles.announcementCard}
                    >
                      <Text style={styles.announcementTitle}>
                        {announcement.title}
                      </Text>
                      <Text style={styles.announcementDesc}>
                        {announcement.description}
                      </Text>
                      {announcement.images?.length > 0 && (
                        <ScrollView horizontal style={styles.imageRow}>
                          {announcement.images.map((image, idx) => (
                            <Image
                              key={idx}
                              source={{ uri: image.url }}
                              style={styles.announcementImage}
                            />
                          ))}
                        </ScrollView>
                      )}
                      {announcement.tags?.length > 0 && (
                        <Text style={styles.announcementTags}>
                          Tags: {announcement.tags.join(", ")}
                        </Text>
                      )}
                      <Text style={styles.announcementMeta}>
                        Ministry: {announcement.ministryCategory?.name || "N/A"}
                      </Text>
                      <Text style={styles.announcementMeta}>
                        Acknowledge Count: {announcement.acknowledgeCount}
                      </Text>
                      {announcement.notedBy?.length > 0 && (
                        <Text style={styles.announcementMeta}>
                          Noted By: {announcement.notedBy.join(", ")}
                        </Text>
                      )}
                      <Text style={styles.announcementMeta}>
                        Date:{" "}
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </Text>
                      <TouchableOpacity
                        style={[
                          styles.ackButton,
                          isAcknowledged && styles.ackButtonDisabled,
                        ]}
                        disabled={isAcknowledged}
                        onPress={() => handleAcknowledgeClick(announcement)}
                      >
                        <Text
                          style={
                            isAcknowledged
                              ? styles.ackButtonTextDisabled
                              : styles.ackButtonText
                          }
                        >
                          {isAcknowledged
                            ? "Already Acknowledged"
                            : "Acknowledge"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Other Announcements */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Announcements</Text>
              {announcements.map((announcement) => {
                const isAcknowledged = hasUserAcknowledged(announcement);
                return (
                  <View key={announcement._id} style={styles.announcementCard}>
                    <Text style={styles.announcementTitle}>
                      {announcement.title}
                    </Text>
                    <Text style={styles.announcementDesc}>
                      {announcement.description}
                    </Text>
                    {announcement.images?.length > 0 && (
                      <ScrollView horizontal style={styles.imageRow}>
                        {announcement.images.map((image, idx) => (
                          <Image
                            key={idx}
                            source={{ uri: image.url }}
                            style={styles.announcementImage}
                          />
                        ))}
                      </ScrollView>
                    )}
                    {announcement.tags?.length > 0 && (
                      <Text style={styles.announcementTags}>
                        Tags: {announcement.tags.join(", ")}
                      </Text>
                    )}
                    <Text style={styles.announcementMeta}>
                      Ministry: {announcement.ministryCategory?.name || "N/A"}
                    </Text>
                    <Text style={styles.announcementMeta}>
                      Acknowledge Count: {announcement.acknowledgeCount}
                    </Text>
                    {announcement.notedBy?.length > 0 && (
                      <Text style={styles.announcementMeta}>
                        Noted By: {announcement.notedBy.join(", ")}
                      </Text>
                    )}
                    <Text style={styles.announcementMeta}>
                      Date:{" "}
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.ackButton,
                        isAcknowledged && styles.ackButtonDisabled,
                      ]}
                      disabled={isAcknowledged}
                      onPress={() => handleAcknowledgeClick(announcement)}
                    >
                      <Text
                        style={
                          isAcknowledged
                            ? styles.ackButtonTextDisabled
                            : styles.ackButtonText
                        }
                      >
                        {isAcknowledged ? "Acknowledged" : "Acknowledge"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </>
      )}

      {activeTab === 1 && (
        <View style={{ flex: 1 }}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search member..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.memberRow}>
                <Image
                  source={
                    item.avatar
                      ? { uri: item.avatar }
                      : require("../../assets/EPAROKYA-SYST.png")
                  }
                  style={styles.avatar}
                />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.memberName}>{item.name}</Text>
                  {item.ministryRoles?.length > 0 ? (
                    item.ministryRoles.map((ministryRole, idx) => (
                      <Text key={idx} style={styles.memberRole}>
                        {ministryRole.role === "Others"
                          ? ministryRole.customRole || "Others"
                          : ministryRole.role || "Member"}
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.memberRole}>Member</Text>
                  )}
                </View>
              </View>
            )}
            ListEmptyComponent={
              <Text
                style={{ color: "#888", textAlign: "center", marginTop: 10 }}
              >
                No members found.
              </Text>
            }
            style={{ maxHeight: 400 }}
          />
        </View>
      )}

      {/* Acknowledge Confirmation Modal */}
      <Modal visible={isModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text
              style={{ fontWeight: "bold", fontSize: 18, marginBottom: 12 }}
            >
              Are you sure you have read the announcement?
            </Text>
            <TouchableOpacity
              style={[styles.ackButton, { marginBottom: 10 }]}
              onPress={handleConfirmAcknowledge}
            >
              <Text style={styles.ackButtonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.ackButton, styles.ackButtonDisabled]}
              onPress={() => setIsModalOpen(false)}
            >
              <Text style={styles.ackButtonTextDisabled}>Read Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4", padding: 6 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  ministryList: { marginBottom: 8 },
  ministryButton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 8,
  },
  activeMinistryButton: {
    backgroundColor: "#154314",
  },
  ministryButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  activeMinistryButtonText: {
    color: "#fff",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    color: "#154314",
  },
  announcementCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    elevation: 1,
  },
  announcementTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  announcementDesc: {
    color: "#333",
    marginBottom: 6,
  },
  announcementTags: {
    color: "#888",
    fontSize: 13,
    marginBottom: 4,
  },
  announcementMeta: {
    color: "#888",
    fontSize: 12,
    marginBottom: 2,
  },
  imageRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  announcementImage: {
    width: 120,
    height: 80,
    borderRadius: 6,
    marginRight: 8,
    backgroundColor: "#eee",
  },
  ackButton: {
    backgroundColor: "#1976d2",
    borderRadius: 6,
    paddingVertical: 10,
    marginTop: 8,
    alignItems: "center",
  },
  ackButtonDisabled: {
    backgroundColor: "#ccc",
  },
  ackButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  ackButtonTextDisabled: {
    color: "#666",
    fontWeight: "bold",
  },
  searchInput: {
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#eee",
  },
  memberName: {
    fontWeight: "bold",
    fontSize: 15,
  },
  memberRole: {
    fontSize: 12,
    color: "#888",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "85%",
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    marginBottom: 6,
    marginTop: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    overflow: "hidden",
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    borderRadius: 0,
  },
  activeTabBtn: {
    backgroundColor: "#154314",
  },
  tabText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16,
  },
  activeTabText: {
    color: "#fff",
  },
  ministryBtnSmall: {
    backgroundColor: "#e0e0e0",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginHorizontal: 4,
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
    height: 32,
  },
  activeMinistryBtnSmall: {
    backgroundColor: "#154314",
  },
  ministryBtnSmallText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 13,
  },
  activeMinistryBtnSmallText: {
    color: "#fff",
  },
});

export default MinistryAnnouncement;
