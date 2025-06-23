import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@mui/material";

const BaptismPDFDownloadForm = ({ baptismDetails, comments, adminNotes }) => {
  const handleDownloadPDF = () => {
    if (!baptismDetails) return;

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
    doc.text("Baptism Details", 14, 18);

    let y = 28;
    doc.setFontSize(12);

    // User Info
    doc.text(`User: ${baptismDetails?.userId?.name || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Baptism Date: ${baptismDetails?.baptismDate ? new Date(baptismDetails.baptismDate).toLocaleDateString() : "N/A"}`, 14, y);
    y += 8;
    doc.text(`Baptism Time: ${baptismDetails?.baptismTime || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Contact Number: ${baptismDetails?.phone || "N/A"}`, 14, y);
    y += 12;

    // Child Info
    doc.setFont(undefined, "bold");
    doc.text("Child Information", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    doc.text(`Name: ${baptismDetails?.child?.fullName || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Birthdate: ${baptismDetails?.child?.dateOfBirth ? new Date(baptismDetails.child.dateOfBirth).toLocaleDateString() : "N/A"}`, 14, y);
    y += 8;
    doc.text(`Sex: ${baptismDetails?.child?.gender || "N/A"}`, 14, y);
    y += 12;

    // Parents Info
    doc.setFont(undefined, "bold");
    doc.text("Parents", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    doc.text(`Father: ${baptismDetails?.parents?.fatherFullName || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Father's Place of Birth: ${baptismDetails?.parents?.placeOfFathersBirth || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Mother: ${baptismDetails?.parents?.motherFullName || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Mother's Place of Birth: ${baptismDetails?.parents?.placeOfMothersBirth || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Address: ${baptismDetails?.parents?.address || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Marriage Status: ${baptismDetails?.parents?.marriageStatus || "N/A"}`, 14, y);
    y += 12;

    // Sponsors
    doc.setFont(undefined, "bold");
    doc.text("Sponsors", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    doc.text(`Primary Ninong: ${baptismDetails?.ninong?.name || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Primary Ninong Address: ${baptismDetails?.ninong?.address || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Primary Ninong Religion: ${baptismDetails?.ninong?.religion || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Primary Ninang: ${baptismDetails?.ninang?.name || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Primary Ninang Address: ${baptismDetails?.ninang?.address || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Primary Ninang Religion: ${baptismDetails?.ninang?.religion || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Additional Ninongs: ${baptismDetails?.NinongGodparents?.map((gp) => gp.name).join(", ") || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Additional Ninangs: ${baptismDetails?.NinangGodparents?.map((gp) => gp.name).join(", ") || "N/A"}`, 14, y);
    y += 12;

    // Admin Notes
    doc.setFont(undefined, "bold");
    doc.text("Admin Notes", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    if (baptismDetails?.adminNotes?.length > 0) {
      baptismDetails.adminNotes.forEach((note, i) => {
        doc.text(
          `${i + 1}. Priest: ${note.priest || "N/A"}, Recorded By: ${note.recordedBy || "N/A"}, Book#: ${note.bookNumber || "N/A"}, Page#: ${note.pageNumber || "N/A"}, Line#: ${note.lineNumber || "N/A"}`,
          16,
          y
        );
        y += 8;
      });
    } else {
      doc.text("None", 16, y);
      y += 8;
    }

    // Admin Comments
    doc.setFont(undefined, "bold");
    doc.text("Admin Comments", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    if (comments?.length > 0) {
      comments.forEach((comment, i) => {
        doc.text(
          `${i + 1}. ${comment.selectedComment || "N/A"} | ${comment.additionalComment || "N/A"}`,
          16,
          y
        );
        y += 8;
      });
    } else {
      doc.text("None", 16, y);
      y += 8;
    }

    addFooter();

    doc.save("baptism_details.pdf");
  };

  return (
    <Button
      variant="contained"
      color="success"
      sx={{ mt: 2, width: "100%" }}
      onClick={handleDownloadPDF}
      disabled={!baptismDetails}
    >
      Download PDF (Baptism Details)
    </Button>
  );
};

export default BaptismPDFDownloadForm;
