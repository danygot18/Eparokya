import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@mui/material";

const WeddingPDFDownloadForm = ({ weddingDetails }) => {
  const handleDownloadPDF = () => {
    if (!weddingDetails) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Wedding Details", 14, 18);

    let y = 28;
    doc.setFontSize(12);

    // Application & Wedding Info
    doc.text(`Date of Application: ${weddingDetails?.dateOfApplication ? new Date(weddingDetails.dateOfApplication).toLocaleDateString() : "N/A"}`, 14, y);
    y += 8;
    doc.text(`Wedding Date: ${weddingDetails?.weddingDate ? new Date(weddingDetails.weddingDate).toLocaleDateString() : "N/A"}`, 14, y);
    y += 8;
    doc.text(`Wedding Time: ${weddingDetails?.weddingTime || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Wedding Theme: ${weddingDetails?.weddingTheme || "N/A"}`, 14, y);
    y += 12;

    // Groom Info
    doc.setFont(undefined, "bold");
    doc.text("Groom Information", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    doc.text(`Name: ${weddingDetails?.groomName || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Birth Date: ${weddingDetails?.groomBirthDate ? new Date(weddingDetails.groomBirthDate).toLocaleDateString() : "N/A"}`, 14, y);
    y += 8;
    doc.text(`Phone: ${weddingDetails?.groomPhone || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Occupation: ${weddingDetails?.groomOccupation || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Religion: ${weddingDetails?.groomReligion || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Father: ${weddingDetails?.groomFather || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Mother: ${weddingDetails?.groomMother || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Address: ${weddingDetails?.groomAddress
      ? [
          weddingDetails.groomAddress.BldgNameTower,
          weddingDetails.groomAddress.LotBlockPhaseHouseNo,
          weddingDetails.groomAddress.SubdivisionVillageZone,
          weddingDetails.groomAddress.Street,
          weddingDetails.groomAddress.District,
          weddingDetails.groomAddress.barangay,
          weddingDetails.groomAddress.customBarangay,
          weddingDetails.groomAddress.city,
          weddingDetails.groomAddress.customCity
        ].filter(Boolean).join(", ")
      : "N/A"}`, 14, y);
    y += 12;

    // Bride Info
    doc.setFont(undefined, "bold");
    doc.text("Bride Information", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    doc.text(`Name: ${weddingDetails?.brideName || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Birth Date: ${weddingDetails?.brideBirthDate ? new Date(weddingDetails.brideBirthDate).toLocaleDateString() : "N/A"}`, 14, y);
    y += 8;
    doc.text(`Phone: ${weddingDetails?.bridePhone || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Occupation: ${weddingDetails?.brideOccupation || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Religion: ${weddingDetails?.brideReligion || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Father: ${weddingDetails?.brideFather || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Mother: ${weddingDetails?.brideMother || "N/A"}`, 14, y);
    y += 8;
    doc.text(`Address: ${weddingDetails?.brideAddress
      ? [
          weddingDetails.brideAddress.BldgNameTower,
          weddingDetails.brideAddress.LotBlockPhaseHouseNo,
          weddingDetails.brideAddress.SubdivisionVillageZone,
          weddingDetails.brideAddress.Street,
          weddingDetails.brideAddress.District,
          weddingDetails.brideAddress.barangay,
          weddingDetails.brideAddress.customBarangay,
          weddingDetails.brideAddress.city,
          weddingDetails.brideAddress.customCity
        ].filter(Boolean).join(", ")
      : "N/A"}`, 14, y);
    y += 12;

    // Ninongs
    doc.setFont(undefined, "bold");
    doc.text("Ninongs", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    if (weddingDetails?.Ninong?.length) {
      weddingDetails.Ninong.forEach((ninong, i) => {
        doc.text(
          `${i + 1}. ${ninong.name} - ${ninong.address?.street || ""}, ${ninong.address?.city || ""}, ${ninong.address?.zip || ""}`,
          16,
          y
        );
        y += 8;
      });
    } else {
      doc.text("None", 16, y);
      y += 8;
    }

    // Ninangs
    doc.setFont(undefined, "bold");
    doc.text("Ninangs", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    if (weddingDetails?.Ninang?.length) {
      weddingDetails.Ninang.forEach((ninang, i) => {
        doc.text(
          `${i + 1}. ${ninang.name} - ${ninang.address?.street || ""}, ${ninang.address?.city || ""}, ${ninang.address?.zip || ""}`,
          16,
          y
        );
        y += 8;
      });
    } else {
      doc.text("None", 16, y);
      y += 8;
    }

    // Priest
    y += 4;
    doc.setFont(undefined, "bold");
    doc.text("Priest", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    doc.text(
      `Priest: ${weddingDetails?.customPriest || weddingDetails?.priest?.fullName || "N/A"}`,
      16,
      y
    );
    y += 12;

    // Additional Requirements
    doc.setFont(undefined, "bold");
    doc.text("Additional Requirements", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    const addReq = weddingDetails?.additionalReq;
    if (addReq) {
      doc.text(
        `Pre Marriage Seminar: ${addReq.PreMarriageSeminar?.date ? new Date(addReq.PreMarriageSeminar.date).toLocaleDateString() : "N/A"} at ${addReq.PreMarriageSeminar?.time || "N/A"}`,
        16,
        y
      );
      y += 8;
      doc.text(
        `Canonical Interview: ${addReq.CanonicalInterview?.date ? new Date(addReq.CanonicalInterview.date).toLocaleDateString() : "N/A"} at ${addReq.CanonicalInterview?.time || "N/A"}`,
        16,
        y
      );
      y += 8;
      doc.text(
        `Confession: ${addReq.Confession?.date ? new Date(addReq.Confession.date).toLocaleDateString() : "N/A"} at ${addReq.Confession?.time || "N/A"}`,
        16,
        y
      );
      y += 8;
      doc.text(
        `Last Updated: ${addReq.createdAt ? new Date(addReq.createdAt).toLocaleDateString() : "N/A"}`,
        16,
        y
      );
      y += 8;
    } else {
      doc.text("None", 16, y);
      y += 8;
    }

    // Comments
    doc.setFont(undefined, "bold");
    doc.text("Admin Comments", 14, y);
    doc.setFont(undefined, "normal");
    y += 8;
    if (weddingDetails?.comments?.length) {
      weddingDetails.comments.forEach((c, i) => {
        doc.text(
          `${i + 1}. ${c.selectedComment || "N/A"} | ${c.additionalComment || "N/A"} (${c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A"})`,
          16,
          y
        );
        y += 8;
      });
    } else {
      doc.text("None", 16, y);
      y += 8;
    }

    // Checklist (using autoTable)
if (weddingDetails?.checklistId && typeof weddingDetails.checklistId === 'object') {
  const checklistArray = Object.entries(weddingDetails.checklistId).map(([key, value]) => {
    if (key === '_id' || key === 'createdAt' || key === 'updatedAt' || key === '__v') return null;
    const label = key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
    return [label, value ? 'Done' : 'Pending'];
  }).filter(Boolean);


  y += 4;
  doc.setFont(undefined, 'bold');
  doc.text('Checklist', 14, y);
  doc.setFont(undefined, 'normal');
  y += 2;

  autoTable(doc, {
    startY: y + 2,
    head: [['Checklist Item', 'Status']],
    body: checklistArray,
    theme: 'grid',
    headStyles: { fillColor: [22, 160, 133] }
  });
}


    doc.save("wedding_details.pdf");
  };

  return (
    <Button
      variant="contained"
      color="success"
      sx={{ mt: 2, width: "100%" }}
      onClick={handleDownloadPDF}
      disabled={!weddingDetails}
    >
      Download PDF (Info & Checklist)
    </Button>
  );
};

export default WeddingPDFDownloadForm;