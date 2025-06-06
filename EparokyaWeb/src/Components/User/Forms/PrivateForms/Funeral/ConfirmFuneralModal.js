import React from "react";
import FuneralCalendar from "./FuneralCalendar";
import { Box, Paper, IconButton, Fade, Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ConfirmedFuneralOverlay = ({ show, onClose }) => {
    if (!show) return null;

    return (
        <Fade in={show}>
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    zIndex: 2000,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Paper
                    elevation={6}
                    sx={{
                        width: "90%",
                        maxWidth: "1000px",
                        maxHeight: "85vh",

                        borderRadius: 3,
                        p: 3,
                        position: "relative",
                    }}
                >
                    
                    <div style={{ marginBottom: "20px", display: "flex", justifyContent: "flex-end", width: "10%", position: "absolute", top: 10, right: 10 }}>
                        <Button
                            onClick={onClose}
                            size="small"
                            sx={{
                                color: "grey.700",
                                padding: "4px",
                            }}
                            aria-label="Close"
                        >
                            <CloseIcon fontSize="small" />
                        </Button>
                    </div>

                    <Box sx={{ minHeight: "600px" }}>
                        <FuneralCalendar onlyCalendar />
                        
                    </Box>

                </Paper>

            </Box>
        </Fade>
    );
};

export default ConfirmedFuneralOverlay;
