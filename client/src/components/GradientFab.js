import { useTheme } from "@mui/material/styles";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

function GradientFab({ openDialog, isOwner }) {
  const theme = useTheme();
  const radialGradient = `radial-gradient(circle, ${theme.palette.primary.dark}, ${theme.palette.primary.light})`;

  return (
    isOwner && (
      <Fab
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem",
          background: radialGradient,
          color: theme.palette.primary.contrastText,
          boxShadow: "0px 0px 20px 5px rgba(118,219,205, .45)",
        }}
        onClick={openDialog}
      >
        <AddIcon />
      </Fab>
    )
  );
}

export default GradientFab;
