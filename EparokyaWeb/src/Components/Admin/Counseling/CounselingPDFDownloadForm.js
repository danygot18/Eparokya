import React from "react";
import jsPDF from "jspdf";
import { Button } from "@mui/material";

const CounselingPDFDownloadForm = ({ counselingDetails, comments }) => {
  const handleDownloadPDF = () => {
    if (!counselingDetails) return;

    const doc = new jsPDF();

    // Header
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("E:Parokya - Saint Joseph Parish - Taguig", 14, 10);

    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.text("Counseling Details", 14, 18);

    let y = 28;
    doc.setFontSize(12);

    // Person Info
    doc.text(`Name: ${counselingDetails?.person?.fullName || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Date of Birth: ${counselingDetails?.person?.dateOfBirth ? new Date(counselingDetails.person.dateOfBirth).toLocaleDateString() : "N/A"}`, 14, y);
    y += 8;

    // Purpose
    doc.text(`Purpose: ${counselingDetails?.purpose || "N/A"}`, 14, y);
    y += 8;

    // Contact Person
    doc.setFont(undefined, "bold");
    doc.text("Contact Person", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    doc.text(`Name: ${counselingDetails?.contactPerson?.fullName || "N/A"}`, 16, y);
    y += 8;
    doc.text(`Contact Number: ${counselingDetails?.contactPerson?.contactNumber || "N/A"}`, 16, y);
    y += 8;
    doc.text(`Relationship: ${counselingDetails?.contactPerson?.relationship || "N/A"}`, 16, y);
    y += 12;

    // Main Contact Number
    doc.text(`Main Contact Number: ${counselingDetails?.contactNumber || "N/A"}`, 14, y);
    y += 8;

    // Address
    doc.setFont(undefined, "bold");
    doc.text("Address", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    doc.text(
      [
        counselingDetails?.address?.BldgNameTower,
        counselingDetails?.address?.LotBlockPhaseHouseNo,
        counselingDetails?.address?.SubdivisionVillageZone,
        counselingDetails?.address?.Street,
        counselingDetails?.address?.District,
        counselingDetails?.address?.barangay,
        counselingDetails?.address?.customBarangay,
        counselingDetails?.address?.city,
        counselingDetails?.address?.customCity
      ].filter(Boolean).join(", ") || "N/A",
      14,
      y
    );
    y += 12;

    // Counseling Schedule
    doc.text(`Counseling Date: ${counselingDetails?.counselingDate ? new Date(counselingDetails.counselingDate).toLocaleDateString() : "N/A"}`, 14, y);
    y += 8;
    doc.text(`Counseling Time: ${counselingDetails?.counselingTime || "N/A"}`, 14, y);
    y += 8;

    // User
    doc.text(`Requested By: ${counselingDetails?.userId?.name || "N/A"}`, 14, y);
    y += 8;

    // Status
    doc.text(`Status: ${counselingDetails?.counselingStatus || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Created At: ${counselingDetails?.createdAt ? new Date(counselingDetails.createdAt).toLocaleDateString() : "N/A"}`, 14, y);
    y += 8;
    doc.text(`Confirmed At: ${counselingDetails?.confirmedAt ? new Date(counselingDetails.confirmedAt).toLocaleDateString() : "N/A"}`, 14, y);
    y += 12;

    // Admin Rescheduled
    doc.setFont(undefined, "bold");
    doc.text("Admin Rescheduled", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    if (counselingDetails?.adminRescheduled?.date || counselingDetails?.adminRescheduled?.reason) {
      doc.text(
        `Date: ${counselingDetails.adminRescheduled.date ? new Date(counselingDetails.adminRescheduled.date).toLocaleDateString() : "N/A"}`,
        16,
        y
      );
      y += 8;
      doc.text(
        `Reason: ${counselingDetails.adminRescheduled.reason || "N/A"}`,
        16,
        y
      );
      y += 8;
    } else {
      doc.text("None", 16, y);
      y += 8;
    }

    // Cancelling Reason
    doc.setFont(undefined, "bold");
    doc.text("Cancelling Reason", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    if (counselingDetails?.cancellingReason?.reason) {
      doc.text(`By: ${counselingDetails.cancellingReason.user || "N/A"}`, 16, y);
      y += 8;
      doc.text(`Reason: ${counselingDetails.cancellingReason.reason}`, 16, y);
      y += 8;
    } else {
      doc.text("None", 16, y);
      y += 8;
    }

    // Priest
    doc.setFont(undefined, "bold");
    doc.text("Priest", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    doc.text(
      `Priest: ${counselingDetails?.Priest?.fullName || counselingDetails?.Priest?.name || "N/A"}`,
      16,
      y
    );
    y += 12;

    // Admin Comments
    doc.setFont(undefined, "bold");
    doc.text("Admin Comments", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    const commentList = comments || counselingDetails?.comments;
    if (commentList?.length > 0) {
      commentList.forEach((comment, i) => {
        doc.text(
          `${i + 1}. Priest: ${comment.priest || "N/A"} | Scheduled: ${comment.scheduledDate ? new Date(comment.scheduledDate).toLocaleDateString() : "N/A"} | ${comment.selectedComment || "N/A"} | ${comment.additionalComment || "N/A"} (${comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "N/A"})`,
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

    doc.save("counseling_details.pdf");
  };

  return (
    <Button
      variant="contained"
      color="success"
      sx={{ mt: 2, width: "100%" }}
      onClick={handleDownloadPDF}
      disabled={!counselingDetails}
    >
      Download PDF (Counseling Details)
    </Button>
  );
};

export default CounselingPDFDownloadForm;