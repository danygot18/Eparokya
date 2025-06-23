import React from "react";
import jsPDF from "jspdf";
import { Button } from "@mui/material";

const FuneralPDFDownloadForm = ({ funeralDetails }) => {
  const handleDownloadPDF = () => {
    if (!funeralDetails) return;

    const doc = new jsPDF();

    // Header
    const addHeader = () => {
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("E:Parokya - Saint Joseph Parish - Taguig", 14, 10);
    };

    // Footer
    const addFooter = () => {
      const pageHeight = doc.internal.pageSize.height;
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("Contact us:", 14, pageHeight - 20);
      doc.text("Email us: eparokyasys@gmail.com", 14, pageHeight - 15);
      doc.text("E:Parokya", 14, pageHeight - 10);
    };

    addHeader();

    doc.setFontSize(18);
    doc.setTextColor(0);
    doc.text("Funeral Details", 14, 18);

    let y = 28;
    doc.setFontSize(12);

    // Main Info
    doc.text(`Name: ${funeralDetails?.name || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Date of Death: ${funeralDetails?.dateOfDeath ? new Date(funeralDetails.dateOfDeath).toLocaleDateString() : "N/A"}`, 14, y);
    y += 8;
    doc.text(`Status: ${funeralDetails?.personStatus || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Age: ${funeralDetails?.age || "N/A"}`, 14, y);
    y += 8;

    // Contact Person
    doc.text(`Contact Person: ${funeralDetails?.contactPerson || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Relationship: ${funeralDetails?.relationship || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Contact Number: ${funeralDetails?.phone || "N/A"}`, 14, y);
    y += 12;

    // Address
    doc.setFont(undefined, "bold");
    doc.text("Address", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    doc.text(
      [
        funeralDetails?.address?.BldgNameTower,
        funeralDetails?.address?.LotBlockPhaseHouseNo,
        funeralDetails?.address?.SubdivisionVillageZone,
        funeralDetails?.address?.Street,
        funeralDetails?.address?.District,
        funeralDetails?.address?.barangay,
        funeralDetails?.address?.customBarangay,
        funeralDetails?.address?.city,
        funeralDetails?.address?.customCity
      ].filter(Boolean).join(", ") || "N/A",
      14,
      y
    );
    y += 12;

    // Priest Visit & Reason of Death
    doc.text(`Priest Visit: ${funeralDetails?.priestVisit || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Reason of Death: ${funeralDetails?.reasonOfDeath || "N/A"}`, 14, y);
    y += 8;

    // Funeral Service Info
    doc.text(`Funeral Date: ${funeralDetails?.funeralDate ? new Date(funeralDetails.funeralDate).toLocaleDateString() : "N/A"}`, 14, y);
    y += 8;
    doc.text(`Funeral Time: ${funeralDetails?.funeraltime || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Place of Death: ${funeralDetails?.placeOfDeath || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Service Type: ${funeralDetails?.serviceType || "N/A"}`, 14, y);
    y += 8;

    // Placing of Pall
    doc.setFont(undefined, "bold");
    doc.text("Placing of Pall", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    doc.text(`By: ${funeralDetails?.placingOfPall?.by || "N/A"}`, 16, y);
    y += 8;
    if (funeralDetails?.placingOfPall?.by === "Family Member") {
      doc.text(
        `Family Members: ${funeralDetails.placingOfPall.familyMembers?.join(", ") || "N/A"}`,
        16,
        y
      );
      y += 8;
    }

    // Funeral Mass Info
    doc.setFont(undefined, "bold");
    doc.text("Funeral Mass", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    doc.text(`Funeral Mass Date: ${funeralDetails?.funeralMassDate ? new Date(funeralDetails.funeralMassDate).toLocaleDateString() : "N/A"}`, 16, y);
    y += 8;
    doc.text(`Funeral Mass Time: ${funeralDetails?.funeralMasstime || "N/A"}`, 16, y);
    y += 8;
    doc.text(`Funeral Mass: ${funeralDetails?.funeralMass || "N/A"}`, 16, y);
    y += 12;

    // Priest
    doc.setFont(undefined, "bold");
    doc.text("Priest", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    doc.text(
      `Priest: ${funeralDetails?.Priest?.fullName || "N/A"}`,
      16,
      y
    );
    y += 12;

    // Admin Rescheduled
    doc.setFont(undefined, "bold");
    doc.text("Admin Rescheduled", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    if (funeralDetails?.adminRescheduled?.date || funeralDetails?.adminRescheduled?.reason) {
      doc.text(
        `Date: ${funeralDetails.adminRescheduled.date ? new Date(funeralDetails.adminRescheduled.date).toLocaleDateString() : "N/A"}`,
        16,
        y
      );
      y += 8;
      doc.text(
        `Reason: ${funeralDetails.adminRescheduled.reason || "N/A"}`,
        16,
        y
      );
      y += 8;
    } else {
      doc.text("None", 16, y);
      y += 8;
    }

    // Admin Comments
    doc.setFont(undefined, "bold");
    doc.text("Admin Comments", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    if (funeralDetails?.comments?.length > 0) {
      funeralDetails.comments.forEach((comment, i) => {
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

    // Funeral Status
    doc.setFont(undefined, "bold");
    doc.text("Funeral Status", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    doc.text(`Status: ${funeralDetails?.funeralStatus || "N/A"}`, 16, y);
    y += 8;
    if (funeralDetails?.confirmedAt) {
      doc.text(`Confirmed At: ${new Date(funeralDetails.confirmedAt).toLocaleDateString()}`, 16, y);
      y += 8;
    }
    if (funeralDetails?.cancellingReason?.reason) {
      doc.text(`Cancelled By: ${funeralDetails.cancellingReason.user || "N/A"}`, 16, y);
      y += 8;
      doc.text(`Reason: ${funeralDetails.cancellingReason.reason}`, 16, y);
      y += 8;
    }

    addFooter();

    doc.save("funeral_details.pdf");
  };

  return (
    <Button
      variant="contained"
      color="success"
      sx={{ mt: 2, width: "100%" }}
      onClick={handleDownloadPDF}
      disabled={!funeralDetails}
    >
      Download PDF (Funeral Details)
    </Button>
  );
};

export default FuneralPDFDownloadForm;