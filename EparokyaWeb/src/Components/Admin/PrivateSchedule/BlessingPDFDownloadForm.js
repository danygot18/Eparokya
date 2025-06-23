import React from "react";
import jsPDF from "jspdf";
import { Button } from "@mui/material";

const BlessingPDFDownloadForm = ({ blessingDetails, comments }) => {
  const handleDownloadPDF = () => {
    if (!blessingDetails) return;

    const doc = new jsPDF();

    // Header
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("E:Parokya - Saint Joseph Parish - Taguig", 14, 10);

    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.text("House Blessing Details", 14, 18);

    let y = 28;
    doc.setFontSize(12);

    // Requestor Info
    doc.text(`Requested By: ${blessingDetails?.userId?.name || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Contact Number: ${blessingDetails?.contactNumber || "N/A"}`, 14, y);
    y += 8;

    // Blessing Type
    doc.text(`Blessing Type: ${blessingDetails?.blessingType || "N/A"}`, 14, y);
    y += 8;

    // Date & Time
    doc.text(`Date: ${blessingDetails?.blessingDate ? new Date(blessingDetails.blessingDate).toLocaleDateString() : "N/A"}`, 14, y);
    y += 8;
    doc.text(`Time: ${blessingDetails?.blessingTime || "N/A"}`, 14, y);
    y += 8;

    // Full Address
    doc.setFont(undefined, "bold");
    doc.text("Address", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    const addr = blessingDetails?.address;
    const fullAddress = [
      addr?.BldgNameTower,
      addr?.LotBlockPhaseHouseNo,
      addr?.SubdivisionVillageZone,
      addr?.Street,
      addr?.District,
      addr?.barangay === 'Others' ? addr?.customBarangay : addr?.barangay,
      addr?.city === 'Others' ? addr?.customCity : addr?.city,
    ].filter(Boolean).join(", ");
    doc.text(fullAddress || "N/A", 14, y);
    y += 12;

    // Property Info
    doc.setFont(undefined, "bold");
    doc.text("Property Info", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    doc.text(`Property Type: ${blessingDetails?.propertyType === 'Others' ? blessingDetails?.customPropertyType : blessingDetails?.propertyType || 'N/A'}`, 14, y);
    y += 8;
    doc.text(`Floors: ${blessingDetails?.floors || 'N/A'}`, 14, y);
    y += 8;
    doc.text(`Rooms: ${blessingDetails?.rooms || 'N/A'}`, 14, y);
    y += 8;
    doc.text(`Size: ${blessingDetails?.propertySize || 'N/A'}`, 14, y);
    y += 8;
    doc.text(`New Construction: ${blessingDetails?.isNewConstruction ? 'Yes' : 'No'}`, 14, y);
    y += 12;

    // Purpose / Notes
    doc.text(`Special Requests: ${blessingDetails?.specialRequests || 'N/A'}`, 14, y);
    y += 12;

    // Priest
    doc.setFont(undefined, "bold");
    doc.text("Priest", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    doc.text(`Assigned: ${blessingDetails?.priest?.fullName || blessingDetails?.priest?.name || 'N/A'}`, 16, y);
    y += 12;

    // Status
    doc.setFont(undefined, "bold");
    doc.text("Status", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    doc.text(`Status: ${blessingDetails?.blessingStatus || "N/A"}`, 16, y);
    y += 8;
    doc.text(`Created At: ${blessingDetails?.createdAt ? new Date(blessingDetails.createdAt).toLocaleDateString() : "N/A"}`, 16, y);
    y += 8;
    doc.text(`Confirmed At: ${blessingDetails?.confirmedAt ? new Date(blessingDetails.confirmedAt).toLocaleDateString() : "N/A"}`, 16, y);
    y += 8;

    // Reschedule
    if (blessingDetails?.adminRescheduled?.date) {
      doc.text(`Rescheduled To: ${new Date(blessingDetails.adminRescheduled.date).toLocaleDateString()}`, 16, y);
      y += 8;
      doc.text(`Reason: ${blessingDetails.adminRescheduled.reason || "N/A"}`, 16, y);
      y += 8;
    }

    // Admin Comments
    doc.setFont(undefined, "bold");
    doc.text("Admin Comments", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    const commentList = comments || blessingDetails?.comments;
    if (commentList?.length > 0) {
      commentList.forEach((comment, i) => {
        doc.text(
          `${i + 1}. ${comment.selectedComment || "N/A"} | ${comment.additionalComment || "N/A"} (${comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "N/A"})`,
          16,
          y
        );
        y += 8;
      });
    } else {
      doc.text("None", 16, y);
      y += 8;
    }

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Contact us:", 14, pageHeight - 20);
    doc.text("Email us: eparokyasys@gmail.com", 14, pageHeight - 15);
    doc.text("E:Parokya", 14, pageHeight - 10);

    doc.save("house_blessing_details.pdf");
  };

  return (
    <Button
      variant="contained"
      color="success"
      sx={{ mt: 2, width: "100%" }}
      onClick={handleDownloadPDF}
      disabled={!blessingDetails}
    >
      Download PDF (Blessing Details)
    </Button>
  );
};

export default BlessingPDFDownloadForm;
