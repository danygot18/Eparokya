import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Tabs,
  Tab,
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Pagination,
  Chip,
  Button
} from "@mui/material";
import { format } from "date-fns";
import axios from "axios";

const groupByMonthYear = (records) => {
  const grouped = {};
  records.forEach((item) => {
    const date = new Date(item.doneAt || item.createdAt);
    const key = format(date, "MMMM yyyy");
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });
  return grouped;
};

const PrayerRequestIntentionHistory = ({ open, onClose, prayerType }) => {
  const [tab, setTab] = useState("upcoming");

  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    type: "", // 'archive' or 'delete'
    recordId: null,
  });

  useEffect(() => {
    if (open) fetchHistory();
  }, [open, tab, prayerType]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/intentionHistory`,
        {
          params: {
            filter: tab,
            prayerType,
            page,
          },
          withCredentials: true,
        }
      );
      setHistory(response.data || []);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const openConfirmDialog = (type, id) => {
    setConfirmDialog({ open: true, type, recordId: id });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog({ open: false, type: "", recordId: null });
  };


  const handleConfirmAction = async () => {
    const { type, recordId } = confirmDialog;
    try {
      if (type === "archive") {
        await axios.patch(
          `${process.env.REACT_APP_API}/api/v1/archivePrayerRequestIntention/${recordId}`,
          {},
          { withCredentials: true }
        );
      } else if (type === "delete") {
        await axios.delete(
          `${process.env.REACT_APP_API}/api/v1/deletePrayerRequestIntention/${recordId}`,
          { withCredentials: true }
        );
      } else if (type === "deleteAllDone") {
        await axios.delete(
          `${process.env.REACT_APP_API}/api/v1/prayerRequestIntention/deleteAllDone`,
          { withCredentials: true }
        );
      }

      closeConfirmDialog();
      fetchHistory();
    } catch (error) {
      console.error(`${type} action failed`, error);
    }
  };
  const grouped = groupByMonthYear(history.data || []);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle textAlign="center">
        Prayer History - {prayerType}
      </DialogTitle>
      <DialogContent>
        <Tabs
          value={tab}
          onChange={(e, newValue) => {
            setTab(newValue);
            setPage(1);
          }}
          centered
        >
          <Tab label="Upcoming" value="upcoming" />
          <Tab label="Done" value="done" />
          <Tab label="Not Done" value="notDone" />
        </Tabs>

        {grouped && Object.entries(grouped).map(([monthYear, records]) => (
          <Box key={monthYear} mt={3}>
            <Divider textAlign="left">
              <Chip label={monthYear} color="primary" />
            </Divider>

            {tab === "done" && (
              <Box display="flex" justifyContent="flex-end" mb={1}>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => openConfirmDialog("deleteAllDone")}
                >
                  Delete All Done
                </Button>
              </Box>
            )}

            <Table size="small" sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Offeror</strong></TableCell>
                  <TableCell><strong>Prayer Type</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records
                  .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                  .map((rec) => (
                    <TableRow key={rec._id}>
                      <TableCell>{rec.offerrorsName}</TableCell>
                      <TableCell>{rec.prayerType}</TableCell>
                      <TableCell>
                        {rec.prayerRequestDate
                          ? new Date(rec.prayerRequestDate).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={rec.isDone ? "Done" : "Not Done"}
                          color={rec.isDone ? "success" : "error"}
                          size="small"
                        />
                        {tab === "done" && (
                          <>
                            <Chip
                              label="Archive"
                              onClick={() => openConfirmDialog("archive", rec._id)}
                              size="small"
                              color="info"
                              sx={{ mx: 0.5, cursor: "pointer" }}
                            />
                            <Chip
                              label="Delete"
                              onClick={() => openConfirmDialog("delete", rec._id)}
                              size="small"
                              color="error"
                              sx={{ mx: 0.5, cursor: "pointer" }}
                            />
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>

            {records.length > rowsPerPage && (
              <Box mt={2} display="flex" justifyContent="center">
                <Pagination
                  count={Math.ceil(records.length / rowsPerPage)}
                  page={page}
                  onChange={(e, val) => setPage(val)}
                />
              </Box>
            )}
          </Box>
        ))}

        {Object.keys(grouped).length === 0 && (
          <Typography textAlign="center" mt={4}>
            No records found.
          </Typography>
        )}
      </DialogContent>

      <Dialog open={confirmDialog.open} onClose={closeConfirmDialog}>
        <DialogTitle>
          {confirmDialog.type === "archive"
            ? "Archive Prayer Request"
            : confirmDialog.type === "delete"
              ? "Delete Prayer Request"
              : "Delete All Done Prayer Requests"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to{" "}
            <strong>{confirmDialog.type === "deleteAllDone" ? "delete all done" : confirmDialog.type}</strong>{" "}
            {confirmDialog.type === "deleteAllDone"
              ? "prayer requests?"
              : "this prayer request?"}
          </Typography>
          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            <Chip label="Cancel" onClick={closeConfirmDialog} />
            <Chip
              label="Confirm"
              color={
                confirmDialog.type === "delete" || confirmDialog.type === "deleteAllDone"
                  ? "error"
                  : "primary"
              }
              onClick={handleConfirmAction}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Dialog>
  );

};

export default PrayerRequestIntentionHistory;
