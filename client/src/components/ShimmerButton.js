import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const ShimmerButton = styled(Button)(
    ({ theme, disabled }) => ({
        position: "relative",
        overflow: "hidden",
        backgroundColor: disabled
            ? theme.palette.primary.disabled
            : theme.palette.primary.light,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        "&:after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: "-50%",
            width: "200%",
            height: "100%",
            background: `linear-gradient(to right, transparent, rgba(255, 255, 255, 0.4), transparent)`,
            backgroundSize: "200% 100%",
            animation: "shimmer 5s infinite linear",
        },
        "@keyframes shimmer": {
            "0%": {
                backgroundPosition: "-200% 0",
            },
            "100%": {
                backgroundPosition: "200% 0",
            },
        },
    })
);

export default ShimmerButton;