import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Modal,
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import baseURL from "../../../assets/common/baseUrl";
import UserWeddingChecklist from "./UserWeddingChecklist";
import { Linking } from "react-native";
import { Button } from "native-base";
import { Box, VStack, HStack } from "native-base";

const imageFields = [
  { label: "Groom Baptismal Certificate", key: "GroomNewBaptismalCertificate" },
  {
    label: "Groom Confirmation Certificate",
    key: "GroomNewConfirmationCertificate",
  },
  { label: "Groom Marriage License", key: "GroomMarriageLicense" },
  { label: "Groom Marriage Bans", key: "GroomMarriageBans" },
  { label: "Groom Orig Ce No Mar", key: "GroomOrigCeNoMar" },
  { label: "Groom Orig PSA", key: "GroomOrigPSA" },
  {
    label: "Groom Permit From Parish Of Bride",
    key: "GroomPermitFromtheParishOftheBride",
  },
  { label: "Groom Child Birth Certificate", key: "GroomChildBirthCertificate" },
  { label: "Groom 1x1", key: "GroomOneByOne" },
  { label: "Bride Baptismal Certificate", key: "BrideNewBaptismalCertificate" },
  {
    label: "Bride Confirmation Certificate",
    key: "BrideNewConfirmationCertificate",
  },
  { label: "Bride Marriage License", key: "BrideMarriageLicense" },
  { label: "Bride Marriage Bans", key: "BrideMarriageBans" },
  { label: "Bride Orig Ce No Mar", key: "BrideOrigCeNoMar" },
  { label: "Bride Orig PSA", key: "BrideOrigPSA" },
  {
    label: "Bride Permit From Parish Of Bride",
    key: "BridePermitFromtheParishOftheBride",
  },
  { label: "Bride Child Birth Certificate", key: "BrideChildBirthCertificate" },
  { label: "Bride 1x1", key: "BrideOneByOne" },
];

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  const [hour, minute] = timeString.split(":");
  const date = new Date();
  date.setHours(Number(hour), Number(minute));
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const tabLabels = ["Bride & Groom", "Images", "Comments", "Checklist"];

const SubmittedWeddingDetails = () => {
  const route = useRoute();
  const { weddingId } = route.params;
  const [wedding, setWedding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  const [viewImageModal, setViewImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState(null);

  const isImage = (url) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
  };

  useEffect(() => {
    fetchWedding();
  }, []);

  const fetchWedding = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/getWeddingForm/${weddingId}`);
      setWedding(res.data);
      console.log(res.data)
    } catch (err) {
      setWedding(null);
    }
    setLoading(false);
  };

  const handleCancel = async () => {
    if (!cancelReason.trim()) return;
    setCancelLoading(true);
    try {
      await axios.post(`${baseURL}/declineWedding/${weddingId}`, {
        reason: cancelReason,
        user: "User",
      });
      setCancelDialogOpen(false);
      fetchWedding();
    } catch (err) {
      // handle error
    }
    setCancelLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#154314" />
      </View>
    );
  }

  if (!wedding) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#d32f2f", fontSize: 16 }}>
          Wedding details not found.
        </Text>
      </View>
    );
  }


  return (
    <View style={{ flex: 1, backgroundColor: "#f4f4f4" }}>
      {/* Tabs */}
      <View style={styles.tabBar}>
        {tabLabels.map((label, idx) => (
          <TouchableOpacity
            key={label}
            style={[styles.tab, activeTab === idx && styles.activeTab]}
            onPress={() => setActiveTab(idx)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === idx && styles.activeTabText,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      {activeTab === 0 && (
        <ScrollView style={{ flex: 1, padding: 16 }}>
          {/* Wedding Info */}
          <View style={styles.cardStatus}>
            <Text style={styles.cardTitle}>Status: {wedding.weddingStatus}  </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Wedding Info</Text>
            <Text>
              Date of Application: {formatDate(wedding.dateOfApplication)}
            </Text>
            <Text>Wedding Date: {formatDate(wedding.weddingDate)}</Text>
            <Text>Wedding Time: {formatTime(wedding.weddingTime)}</Text>
            <Text>Wedding Theme: {wedding.weddingTheme}</Text>
          </View>
          {/* Groom Info */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Groom Info</Text>
            <Text>Name: {wedding.groomName}</Text>
            <Text>Phone: {wedding.groomPhone}</Text>
            <Text>Birth Date: {formatDate(wedding.groomBirthDate)}</Text>
            <Text>Occupation: {wedding.groomOccupation}</Text>
            <Text>Religion: {wedding.groomReligion}</Text>
            <Text>Father: {wedding.groomFather}</Text>
            <Text>Mother: {wedding.groomMother}</Text>
            <Text style={{ fontWeight: "bold", marginTop: 8 }}>Address:</Text>
            <Text>
              Bldg/Tower: {wedding.groomAddress?.BldgNameTower || "-"}
            </Text>
            <Text>
              Lot/Block/House No:{" "}
              {wedding.groomAddress?.LotBlockPhaseHouseNo || "-"}
            </Text>
            <Text>
              Subdivision/Zone:{" "}
              {wedding.groomAddress?.SubdivisionVillageZone || "-"}
            </Text>
            <Text>Street: {wedding.groomAddress?.Street}</Text>
            <Text>District: {wedding.groomAddress?.District}</Text>
            <Text>Barangay: {wedding.groomAddress?.barangay}</Text>
            {wedding.groomAddress?.barangay === "Others" && (
              <Text>
                Custom Barangay: {wedding.groomAddress?.customBarangay}
              </Text>
            )}
            <Text>City: {wedding.groomAddress?.city}</Text>
            {wedding.groomAddress?.city === "Others" && (
              <Text>Custom City: {wedding.groomAddress?.customCity}</Text>
            )}
          </View>
          {/* Bride Info */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Bride Info</Text>
            <Text>Name: {wedding.brideName}</Text>
            <Text>Phone: {wedding.bridePhone}</Text>
            <Text>Birth Date: {formatDate(wedding.brideBirthDate)}</Text>
            <Text>Occupation: {wedding.brideOccupation}</Text>
            <Text>Religion: {wedding.brideReligion}</Text>
            <Text>Father: {wedding.brideFather}</Text>
            <Text>Mother: {wedding.brideMother}</Text>
            <Text style={{ fontWeight: "bold", marginTop: 8 }}>Address:</Text>
            <Text>
              Bldg/Tower: {wedding.brideAddress?.BldgNameTower || "-"}
            </Text>
            <Text>
              Lot/Block/House No:{" "}
              {wedding.brideAddress?.LotBlockPhaseHouseNo || "-"}
            </Text>
            <Text>
              Subdivision/Zone:{" "}
              {wedding.brideAddress?.SubdivisionVillageZone || "-"}
            </Text>
            <Text>Street: {wedding.brideAddress?.Street}</Text>
            <Text>District: {wedding.brideAddress?.District}</Text>
            <Text>Barangay: {wedding.brideAddress?.barangay}</Text>
            {wedding.brideAddress?.barangay === "Others" && (
              <Text>
                Custom Barangay: {wedding.brideAddress?.customBarangay}
              </Text>
            )}
            <Text>City: {wedding.brideAddress?.city}</Text>
            {wedding.brideAddress?.city === "Others" && (
              <Text>Custom City: {wedding.brideAddress?.customCity}</Text>
            )}
          </View>
          {/* Ninong */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ninong</Text>
            {wedding.Ninong?.length ? (
              wedding.Ninong.map((ninong, idx) => (
                <View key={idx} style={{ marginBottom: 8 }}>
                  <Text>Name: {ninong.name}</Text>
                  <Text>Street: {ninong.address?.street}</Text>
                  <Text>ZIP: {ninong.address?.zip}</Text>
                  <Text>City: {ninong.address?.city}</Text>
                </View>
              ))
            ) : (
              <Text style={{ color: "#888" }}>No Ninong listed.</Text>
            )}
          </View>
          {/* Ninang */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ninang</Text>
            {wedding.Ninang?.length ? (
              wedding.Ninang.map((ninang, idx) => (
                <View key={idx} style={{ marginBottom: 8 }}>
                  <Text>Name: {ninang.name}</Text>
                  <Text>Street: {ninang.address?.street}</Text>
                  <Text>ZIP: {ninang.address?.zip}</Text>
                  <Text>City: {ninang.address?.city}</Text>
                </View>
              ))
            ) : (
              <Text style={{ color: "#888" }}>No Ninang listed.</Text>
            )}
          </View>
        </ScrollView>
      )}

      {activeTab === 1 && (
        <ScrollView style={{ flex: 1, padding: 16 }}>
          {imageFields.map(({ label, key }) => {
            const img = wedding[key];
            if (!img?.url) return null;
            return (
              <View key={key} style={styles.card}>
                <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                  {label}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    if (isImage(img.url)) {
                      setModalImageUrl(img.url);
                      setViewImageModal(true);
                    } else {
                      Linking.openURL(img.url);
                    }
                  }}
                  activeOpacity={0.8}
                >
                  {isImage(img.url) ? (
                    <Image
                      source={{ uri: img.url }}
                      style={{
                        width: "100%",
                        height: 200,
                        borderRadius: 10,
                        backgroundColor: "#eee",
                      }}
                      resizeMode="contain"
                    />
                  ) : (
                    <View
                      style={{
                        width: "100%",
                        height: 200,
                        borderRadius: 10,
                        backgroundColor: "#eee",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text style={{ color: "#154314", fontWeight: "bold" }}>
                        View File
                      </Text>
                      <Text
                        style={{ color: "#888", fontSize: 12, marginTop: 4 }}
                      >
                        (Tap to open)
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}

          {/* Image Modal */}
          <Modal
            visible={viewImageModal}
            transparent
            animationType="fade"
            onRequestClose={() => setViewImageModal(false)}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.8)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{ position: "absolute", top: 40, right: 30, zIndex: 2 }}
                onPress={() => setViewImageModal(false)}
              >
                <Text style={{ color: "#fff", fontSize: 22 }}>✕</Text>
              </TouchableOpacity>
              <Image
                source={{ uri: modalImageUrl }}
                style={{
                  width: "90%",
                  height: "70%",
                  borderRadius: 12,
                  resizeMode: "contain",
                  backgroundColor: "#fff",
                }}
              />
            </View>
          </Modal>
        </ScrollView>
      )}

      {activeTab === 2 && (
        <ScrollView style={{ flex: 1, padding: 16 }}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Admin Notes</Text>
            {wedding.comments && wedding.comments.length > 0 ? (
              wedding.comments.map((c, idx) => (
                <View key={idx} style={{ marginBottom: 8 }}>
                  <Text>Comment: {c.selectedComment || "N/A"}</Text>
                  <Text>Additional: {c.additionalComment || "N/A"}</Text>
                  <Text style={{ color: "#888", fontSize: 12 }}>
                    {c.createdAt ? formatDate(c.createdAt) : "N/A"}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={{ color: "#888" }}>N/A</Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Rescheduling Information</Text>
            {wedding.adminRescheduled ? (
              <View style={{ marginBottom: 8 }}>
                <Text>
                  Date: {wedding.adminRescheduled.date ? formatDate(wedding.adminRescheduled.date) : "N/A"}
                </Text>
                <Text>Reason: {wedding.adminRescheduled.reason || "N/A"}</Text>
              </View>
            ) : (
              <Text style={{ color: "#888" }}>N/A</Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Additional Requirements</Text>
            {wedding.additionalReq ? (
              <>
                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontWeight: 'bold' }}>Canonical Interview</Text>
                  <Text>Date: {wedding.additionalReq.CanonicalInterview?.date ? formatDate(wedding.additionalReq.CanonicalInterview.date) : "N/A"}</Text>
                  <Text>Time: {wedding.additionalReq.CanonicalInterview?.time || "N/A"}</Text>
                </View>

                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontWeight: 'bold' }}>Confession</Text>
                  <Text>Date: {wedding.additionalReq.Confession?.date ? formatDate(wedding.additionalReq.Confession.date) : "N/A"}</Text>
                  <Text>Time: {wedding.additionalReq.Confession?.time || "N/A"}</Text>
                </View>

                <View style={{ marginBottom: 8 }}>
                  <Text style={{ fontWeight: 'bold' }}>Pre-Marriage Seminar</Text>
                  <Text>Date: {wedding.additionalReq.PreMarriageSeminar?.date ? formatDate(wedding.additionalReq.PreMarriageSeminar.date) : "N/A"}</Text>
                  <Text>Time: {wedding.additionalReq.PreMarriageSeminar?.time || "N/A"}</Text>
                </View>
              </>
            ) : (
              <Text style={{ color: "#888" }}>N/A</Text>
            )}
          </View>


          <Button
            style={[
              styles.cancelButton,
              (wedding.weddingStatus === "Confirmed" || wedding.weddingStatus === "Cancelled") && styles.cancelButtonDisabled
            ]}
            onPress={() => setCancelDialogOpen(true)}

            disabled={wedding.weddingStatus === "Confirmed" || wedding.weddingStatus === "Cancelled"}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>
              Cancel Wedding
            </Text>
          </Button>


          {wedding.weddingStatus === "Cancelled" && (
            <Box p={4} borderWidth={1} borderRadius={8} mt={4} mb={10}>
              <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
                Wedding has been cancelled.
              </Text>
              <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
                Reason: {wedding?.cancellingReason?.reason || "N/A"}
              </Text>
              <Text style={{ color: "red", textAlign: "center", marginTop: 10 }}>
                From: {wedding?.cancellingReason?.user || "N/A"}
              </Text>
            </Box>
          )}


          {/* Cancel Dialog */}
          <Modal
            visible={cancelDialogOpen}
            transparent
            animationType="slide"
            onRequestClose={() => setCancelDialogOpen(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text
                  style={{ fontSize: 18, fontWeight: "bold", marginBottom: 12 }}
                >
                  Cancel Wedding
                </Text>
                <TextInput
                  placeholder="Enter reason for cancellation"
                  value={cancelReason}
                  onChangeText={setCancelReason}
                  style={styles.input}
                  multiline
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: 12,
                  }}
                >
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: "#e0e0e0" }]}
                    onPress={() => setCancelDialogOpen(false)}
                  >
                    <Text style={{ color: "#333" }}>Close</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.modalButton,
                      { backgroundColor: "#d32f2f", marginLeft: 8 },
                    ]}
                    onPress={handleCancel}
                    disabled={cancelLoading || !cancelReason.trim()}
                  >
                    <Text style={{ color: "#fff" }}>
                      {cancelLoading ? "Cancelling..." : "Confirm Cancel"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      )}

      {activeTab === 3 && (
        <View style={{ flex: 1, padding: 16 }}>
          <UserWeddingChecklist weddingId={weddingId} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 8,
    overflow: "hidden",
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "#f4f4f4",
  },
  activeTab: {
    backgroundColor: "#154314",
  },
  tabText: {
    color: "#333",
    fontWeight: "bold",
  },
  activeTabText: {
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardStatus: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    marginBottom: 16,
    
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: "#e53935", // red
    padding: 10,
    borderRadius: 6,
  },
  cancelButtonDisabled: {
    backgroundColor: "#ccc", // light gray when disabled
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
    padding: 20,
    width: "85%",
    elevation: 5,
  },
  input: {
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    textAlignVertical: "top",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
});

export default SubmittedWeddingDetails;
