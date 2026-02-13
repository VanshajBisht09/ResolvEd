import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Chip,
  Tooltip,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { SignInButton, useUser } from "../components/MockAuth";
import { useColorMode } from "../components/ThemeContext";
import {
  ArrowRight,
  BarChart2,
  MessageCircle,
  Shield,
  GraduationCap,
  BookOpen,
  Library,
  Landmark,
  PlayCircle,
  Sun,
  Moon,
  Calendar,
} from "lucide-react";

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const { signIn } = useUser();
  const { setPreset, toggleColorMode, mode } = useColorMode();
  const theme = useTheme();

  // Enforce standard theme for Landing Page
  React.useEffect(() => {
    setPreset("midnight", false);
    return () => {
      const saved = localStorage.getItem("themePreset");
      if (saved) {
        setPreset(saved as any, false);
      }
    };
  }, [setPreset]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        overflow: "hidden",
        position: "relative",
        transition: "background-color 0.5s ease",
      }}
    >
      {/* Background Mesh Gradient */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 15% 50%, ${theme.palette.primary.main}15, transparent 25%), radial-gradient(circle at 85% 30%, ${theme.palette.secondary.main}15, transparent 25%)`,
          zIndex: 0,
        }}
      />

      {/* Navbar */}
      <Box
        component={motion.nav}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, md: 6 },
          py: 3,
          position: "relative",
          zIndex: 10,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: `0 8px 32px ${theme.palette.primary.main}40`,
            }}
          >
            <Landmark size={28} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800} lineHeight={1.1}>
              ResolvEd
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={500}
            >
              CAMPUS PORTAL
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="text"
            onClick={onLoginClick}
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              borderRadius: 1,
              "&:hover": { color: "primary.main", bgcolor: "action.hover" },
            }}
          >
            Sign In
          </Button>
          <Button
            variant="contained"
            onClick={onLoginClick}
            sx={{
              borderRadius: 1,
              boxShadow: theme.shadows[2],
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            }}
          >
            Get Started
          </Button>
        </Box>
      </Box>

      {/* Hero Section */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 5,
          pt: { xs: 8, md: 15 },
          pb: 10,
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Chip
            icon={
              <GraduationCap size={16} color={theme.palette.primary.main} />
            }
            label="Trusting the Future of Education"
            sx={{
              mb: 4,
              bgcolor: `${theme.palette.primary.main}10`,
              color: "primary.main",
              border: `1px solid ${theme.palette.primary.main}20`,
              fontWeight: 600,
              px: 1,
              py: 0.5,
            }}
          />
          <Typography
            variant="h1"
            fontWeight={900}
            sx={{
              fontSize: { xs: "3rem", md: "5rem" },
              lineHeight: 1.1,
              mb: 3,
              letterSpacing: "-0.02em",
              color: "text.primary",
            }}
          >
            Empowering Academic <br />
            <Box
              component="span"
              sx={{
                background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Excellence
            </Box>
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "text.secondary",
              maxWidth: 700,
              mx: "auto",
              mb: 6,
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            The unified digital campus platform. Streamline faculty
            coordination, enhance student support services, and drive
            institutional success with real-time analytics.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowRight size={18} />}
              onClick={onLoginClick}
              sx={{
                borderRadius: 1,
                px: 5,
                py: 1.8,
                fontSize: "1.05rem",
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 20px 40px -10px ${theme.palette.primary.main}50`,
              }}
            >
              Access Portal
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => signIn("admin")}
              startIcon={<PlayCircle size={18} />}
              sx={{
                borderRadius: 1,
                px: 5,
                py: 1.8,
                fontSize: "1.05rem",
                borderColor: "divider",
                color: "text.primary",
                borderWidth: "1px",
                "&:hover": {
                  borderColor: "text.primary",
                  bgcolor: "action.hover",
                },
              }}
            >
              Live Demo
            </Button>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="text"
              size="small"
              onClick={() => signIn("superadmin")}
              sx={{ color: "text.secondary", fontSize: "0.75rem" }}
            >
              Super Admin Login (Demo)
            </Button>
          </Box>
        </motion.div>
      </Container>

      {/* Academic Features Grid */}
      <Container maxWidth="lg" sx={{ pb: 15, position: "relative", zIndex: 5 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <FeatureCard
              delay={0.2}
              icon={<Calendar size={32} color={theme.palette.primary.main} />}
              title="Faculty Scheduling"
              desc="Seamlessly coordinate office hours, thesis reviews, and departmental meetings with automated conflict resolution."
              gradient={`linear-gradient(135deg, ${theme.palette.primary.main}08 0%, ${theme.palette.primary.main}02 100%)`}
              borderColor={`${theme.palette.primary.main}15`}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FeatureCard
              delay={0.3}
              icon={<BookOpen size={32} color={theme.palette.warning.main} />}
              title="Curriculum Management"
              desc="Digital repository for course materials and syllabus updates."
              gradient={`linear-gradient(135deg, ${theme.palette.warning.main}08 0%, ${theme.palette.warning.main}02 100%)`}
              borderColor={`${theme.palette.warning.main}15`}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <FeatureCard
              delay={0.4}
              icon={
                <MessageCircle size={32} color={theme.palette.secondary.main} />
              }
              title="Student Remedial Support"
              desc="Direct channels for grievance redressal and academic counseling."
              gradient={`linear-gradient(135deg, ${theme.palette.secondary.main}08 0%, ${theme.palette.secondary.main}02 100%)`}
              borderColor={`${theme.palette.secondary.main}15`}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <FeatureCard
              delay={0.5}
              icon={<BarChart2 size={32} color={theme.palette.success.main} />}
              title="Institutional Intelligence"
              desc="Comprehensive dashboards for Deans and Administrators to track student success metrics and resource allocation."
              gradient={`linear-gradient(135deg, ${theme.palette.success.main}08 0%, ${theme.palette.success.main}02 100%)`}
              borderColor={`${theme.palette.success.main}15`}
            />
          </Grid>
        </Grid>
      </Container>

      {/* University Trust Section */}
      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          py: 8,
          textAlign: "center",
          bgcolor: "background.paper",
        }}
      >
        <Typography
          variant="overline"
          sx={{
            color: "text.secondary",
            fontWeight: 700,
            letterSpacing: 2,
            mb: 5,
            display: "block",
          }}
        >
          Trusted by Leading Institutions
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: { xs: 4, md: 8 },
            opacity: 0.6,
            flexWrap: "wrap",
            px: 2,
          }}
        >
          {[Library, GraduationCap, Landmark, Shield].map((Icon, i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Icon size={28} />
              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ color: "text.primary" }}
              >
                {
                  [
                    "IVY UNIV",
                    "TECH INSTITUTE",
                    "STATE COLLEGE",
                    "FALCON ACADEMY",
                  ][i]
                }
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Theme Switcher FAB */}
      <Box sx={{ position: "fixed", bottom: 30, right: 30, zIndex: 100 }}>
        <Tooltip
          title={
            mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
          }
        >
          <Box
            onClick={toggleColorMode}
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              cursor: "pointer",
              bgcolor: "background.paper",
              color: "text.primary",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: theme.shadows[4],
              border: "1px solid",
              borderColor: "divider",
              transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              "&:hover": {
                transform: "scale(1.1) rotate(180deg)",
                boxShadow: theme.shadows[8],
              },
            }}
          >
            {mode === "dark" ? <Sun size={24} /> : <Moon size={24} />}
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};

const FeatureCard = ({
  icon,
  title,
  desc,
  gradient,
  borderColor,
  delay,
}: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.6 }}
  >
    <Paper
      sx={{
        p: 4,
        height: "100%",
        borderRadius: 1,
        background: gradient,
        border: "1px solid",
        borderColor: borderColor || "divider",
        backdropFilter: "blur(10px)",
        transition: "all 0.3s ease-out",
        boxShadow: "none",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Box sx={{ mb: 3 }}>{icon}</Box>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 1.5 }}>
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{ color: "text.secondary", lineHeight: 1.6 }}
      >
        {desc}
      </Typography>
    </Paper>
  </motion.div>
);

export default LandingPage;
