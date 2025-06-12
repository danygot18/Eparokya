import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Layout/styles/style.css";
import SideBar from "../SideBar";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";


const AdminAnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);

  const announcementsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnouncements();
    fetchCategories();
  }, [currentPage]);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getAllAnnouncements`
      );
      const sortedAnnouncements = response.data.announcements.sort((a, b) => {
        if (a.isFeatured === b.isFeatured) {
          return new Date(b.dateCreated) - new Date(a.dateCreated);
        }
        return a.isFeatured ? -1 : 1;
      });
      setAnnouncements(sortedAnnouncements || []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setAnnouncements([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/getAllannouncementCategory`
      );
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const newZoom = Math.min(Math.max(zoom + e.deltaY * -0.001, 1), 3);
    setZoom(newZoom);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    setStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({ x: e.clientX - start.x, y: e.clientY - start.y });
  };

  const handleMouseUp = () => setDragging(false);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleOpenDeleteDialog = (id) => {
    setAnnouncementToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setAnnouncementToDelete(null);
  };

  const handleDeleteAnnouncement = async () => {
    if (!announcementToDelete) return;

    try {
      setDeleteLoading(true);
      await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/deleteAnnouncement/${announcementToDelete}`
      );
      setAnnouncements(announcements.filter((a) => a._id !== announcementToDelete));
    } catch (error) {
      console.error("Error deleting announcement:", error);
    } finally {
      setDeleteLoading(false);
      handleCloseDeleteDialog();
      toast.success("Announcement deleted successfully!");
    }
  };

  const toggleFeatured = async (announcementId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/${announcementId}/toggleFeatured`
      );
      if (response.status === 200) {
        console.log(response.data.message);
        fetchAnnouncements();
      }
    } catch (error) {
      console.error("Failed to toggle featured status:", error);
    }
  };

  const filteredAnnouncements = announcements
    .filter((a) =>
      selectedCategory ? a.announcementCategory?._id === selectedCategory : true
    )
    .filter(
      (a) =>
        a.name.toLowerCase().includes(searchQuery) ||
        a.tags.some((tag) => tag.toLowerCase().includes(searchQuery))
    );

  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement =
    indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = filteredAnnouncements.slice(
    indexOfFirstAnnouncement,
    indexOfLastAnnouncement
  );
  const totalPages = Math.ceil(
    filteredAnnouncements.length / announcementsPerPage
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <SideBar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            mb: 3,
            fontWeight: "bold",
            color: "text.primary",
          }}
        >
          Announcements
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
            width: "100%",
            maxWidth: "1800px",
            mx: "auto",
          }}
        >
          {currentAnnouncements.map((announcement) => (
            <Card
              key={announcement._id}
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardHeader
                avatar={
                  <Avatar
                    src="/EPAROKYA-SYST.png"
                    alt="Saint Joseph Parish"
                    sx={{ width: 56, height: 56 }}
                  />
                }
                action={
                  <div style={{ gap: '8px', maxWidth: '50px' }}>
                    <Box>
                      <IconButton
                        onClick={() =>
                          navigate(`/admin/updateAnnouncementPage/${announcement._id}`)
                        }
                      >
                        <EditIcon color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleOpenDeleteDialog(announcement._id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Box>
                  </div>
                }
                title={announcement.name}
                subheader={
                  <Typography variant="caption" color="text.secondary">
                    {new Date(announcement.dateCreated).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                }
                sx={{
                  alignItems: "flex-start",
                  "& .MuiCardHeader-content": {
                    overflow: "hidden",
                  },
                }}
              />

              <CardContent sx={{ flexGrow: 1, py: 1 }}>
                <Typography variant="body1" paragraph>
                  {announcement.description}
                </Typography>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {announcement.richDescription}
                </Typography>

                {announcement.images?.length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      overflowX: "auto",
                      py: 1,
                      "& img": {
                        height: 120,
                        width: "auto",
                        borderRadius: 1,
                        cursor: "pointer",
                        transition: "transform 0.2s",
                        "&:hover": {
                          transform: "scale(1.03)",
                        },
                      },
                    }}
                  >
                    {announcement.images.map((img, index) => (
                      <img
                        key={index}
                        src={img.url}
                        alt={`Slide ${index + 1}`}
                        onClick={() => setPreviewImage(img.url)}
                      />
                    ))}
                  </Box>
                )}
              </CardContent>

              <CardActions
                sx={{
                  p: 2,
                  borderTop: "1px solid",
                  borderColor: "divider",
                  bgcolor: "action.hover",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={announcement.isFeatured}
                        onChange={() => toggleFeatured(announcement._id)}
                        size="small"
                      />
                    }
                    label="Featured"
                  />
                  {announcement.isFeatured && (
                    <Chip
                      label="Featured"
                      size="small"
                      color="primary"
                      icon={<StarIcon fontSize="small" />}
                    />
                  )}
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Chip
                    label={
                      announcement.announcementCategory?.name || "Uncategorized"
                    }
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </CardActions>
            </Card>
          ))}
        </Box>

        <div style={{ position: "relative", width: "50%", height: "100%", alignItems: "center", margin: "auto" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              mt: 3,
            }}
          >
            <div>
              <Button
                variant="outlined"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                startIcon={<ChevronLeftIcon />}
              >
                Previous
              </Button>
            </div>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
              <Typography variant="body1" color="text.secondary">
                Page {currentPage} of {totalPages}
              </Typography>
            </div>

            <div>
              <Button
                variant="outlined"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                endIcon={<ChevronRightIcon />}
              >
                Next
              </Button>
            </div>
          </Box>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this announcement?
              <br />
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDeleteDialog}
              disabled={deleteLoading}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAnnouncement}
              color="error"
              autoFocus
              disabled={deleteLoading}
            >
              {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {previewImage && (
        <Box
          onClick={() => setPreviewImage(null)}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1300,
            cursor: "zoom-out",
          }}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            sx={{
              overflow: "hidden",
              maxWidth: "90%",
              maxHeight: "90%",
              cursor: dragging ? "grabbing" : "grab",
            }}
          >
            <img
              src={previewImage}
              alt="Zoomed Preview"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                transformOrigin: "top left",
                transition: dragging ? "none" : "transform 0.2s ease",
                maxWidth: "100%",
                maxHeight: "100%",
                userSelect: "none",
                pointerEvents: "none",
              }}
              draggable={false}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AdminAnnouncementList;