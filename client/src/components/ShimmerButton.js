import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

const ShimmerButton = styled(Button)`
  position: relative;
  overflow: hidden;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: -50%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      to right,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    background-size: 200% 100%;
    animation: shimmer 5s infinite linear;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

export default ShimmerButton;
