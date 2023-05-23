import TimelineDot from "@mui/lab/TimelineDot";
import { styled } from "@mui/system";
import { keyframes } from "@mui/styled-engine";

const blink = keyframes`
80% {opacity: .8;}
90% {opacity: 0.9;}
100% {opacity: 1;}
`;

const generateGradient = (color1, color2) => `
  radial-gradient(circle at center, ${color1}, ${color2})
`;

const StatusLight = styled(TimelineDot)(({ color1, color2 }) => ({
    width: "5px",
    height: "5px",
    animation: `${blink} 1s linear infinite`,
    backgroundImage: generateGradient(color1, color2),
}));

export default StatusLight;
