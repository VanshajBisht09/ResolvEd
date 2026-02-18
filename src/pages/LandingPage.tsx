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
  Stack,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { useUser } from "../components/MockAuth";
import { useColorMode } from "../components/ThemeContext";
import { useNavigate } from "react-router-dom";
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
  Users,
  Clock,
  Globe,
  Twitter,
  Linkedin,
  Github,
  Building 
} from "lucide-react";

interface LandingPageProps {   
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const { signIn, isSignedIn } = useUser();
  const { setPreset, toggleColorMode, mode } = useColorMode();
  const theme = useTheme();
  const navigate = useNavigate();

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

  const handleScrollToFeatures = () => {
    const element = document.getElementById('features-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {/* Background Mesh Gradient */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 10% 10%, ${theme.palette.primary.main}10, transparent 40%),
            radial-gradient(circle at 90% 60%, ${theme.palette.secondary.main}10, transparent 40%),
            radial-gradient(circle at 50% 50%, ${theme.palette.background.default}, transparent 90%)
          `,
          zIndex: 0,
          pointerEvents: 'none'
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
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'rgba(255,255,255,0.01)'
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Box
            sx={{
              width: 40,
              height: 40,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              borderRadius: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              boxShadow: `0 8px 16px ${theme.palette.primary.main}30`,
            }}
          >
            <Landmark size={24} />
          </Box>
          <Typography variant="h6" fontWeight={800} letterSpacing={-0.5}>
            ResolvEd
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5 }}>
          {isSignedIn ? (
             <Button
                variant="contained"
                onClick={() => navigate('/dashboard')}
                sx={{
                  borderRadius: 2,
                  boxShadow: theme.shadows[4],
                  textTransform: 'none',
                  fontWeight: 600,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                }}
              >
                Go to Dashboard
              </Button>
          ) : (
            <>
              <Button
                variant="text"
                onClick={() => navigate('/login')}
                sx={{
                  color: "text.primary",
                  fontWeight: 600,
                  textTransform: 'none',
                  "&:hover": { color: "primary.main", bgcolor: "transparent" },
                }}
              >
                Sign In
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 700,
                  boxShadow: theme.shadows[4],
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                }}
              >
                Get Started
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 5, pt: 12, pb: 10, textAlign: "center" }}>
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <Chip
            label="New: AI-Powered Academic Scheduling 🚀"
            onClick={handleScrollToFeatures}
            sx={{
              mb: 4,
              bgcolor: `${theme.palette.primary.main}15`,
              color: "primary.main",
              fontWeight: 600,
              fontSize: '0.85rem',
              border: `1px solid ${theme.palette.primary.main}30`,
              backdropFilter: 'blur(10px)',
              cursor: 'pointer'
            }}
          />
          <Typography
            variant="h1"
            fontWeight={900}
            sx={{
              fontSize: { xs: "3rem", md: "5.5rem" },
              lineHeight: 1.05,
              mb: 3,
              letterSpacing: "-0.03em",
              color: "text.primary",
            }}
          >
            The Operating System <br />
            for <Box component="span" sx={{
                background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
            }}>Modern Campuses</Box>
          </Typography>
          
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: "auto", mb: 6, lineHeight: 1.6, fontWeight: 400 }}
          >
            Unified platform for faculty coordination, student success tracking, and institutional resource management.
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 10 }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowRight size={18} />}
              onClick={isSignedIn ? () => navigate('/dashboard') : () => navigate('/login')}
              sx={{
                py: 2, px: 5,
                fontSize: "1.1rem",
                borderRadius: 2,
                textTransform: 'none',
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                boxShadow: `0 20px 40px -10px ${theme.palette.primary.main}40`,
              }}
            >
              {isSignedIn ? "Launch Dashboard" : "Start Free Trial"}
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<PlayCircle size={18} />}
              onClick={() => signIn("superadmin")}
              sx={{
                py: 2, px: 5,
                fontSize: "1.1rem",
                borderRadius: 2,
                textTransform: 'none',
                borderWidth: 2,
                borderColor: 'divider',
                color: 'text.primary',
                "&:hover": { borderWidth: 2, borderColor: 'text.primary', bgcolor: 'transparent' }
              }}
            >
              View Live Demo
            </Button>
          </Stack>

          {/* Product Preview Mockup */}
          <Box
            component={motion.div}
            initial={{ y: 100, opacity: 0, rotateX: 20 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            sx={{
               perspective: '1000px',
               mx: 'auto',
               maxWidth: 1000,
               position: 'relative'
            }}
          >
             <Box sx={{
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: `0 40px 80px -20px rgba(0,0,0,0.5)`,
                border: `8px solid ${theme.palette.background.paper}`,
                bgcolor: 'background.paper',
                position: 'relative'
             }}>
                {/* Mock UI Header */}
                <Box sx={{ height: 40, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', px: 2, gap: 1 }}>
                   <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ef4444' }} />
                   <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                   <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#22c55e' }} />
                   <Box sx={{ mx: 'auto', width: '40%', height: 20, bgcolor: 'action.hover', borderRadius: 1 }} />
                </Box>
                {/* Mock Content Placeholder (Gradient) */}
                <Box sx={{ 
                   height: 500, 
                   background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   flexDirection: 'column',
                   gap: 2
                }}>
                   <BarChart2 size={64} color={theme.palette.text.disabled} />
                   <Typography variant="h6" color="text.secondary">Interactive Dashboard Preview</Typography>
                   <Button variant="outlined" size="small" onClick={() => signIn("admin")}>Enter Demo Mode</Button>
                </Box>
             </Box>
          </Box>
        </motion.div>
      </Container>


      {/* Stats / Why Us Section */}
      <Box sx={{ py: 12 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} textAlign="center">
             {[
                { label: 'Universities Onboarded', value: '450+', icon: Building },
                { label: 'Student Engagement', value: '3x', icon: Users },
                { label: 'Admin Time Saved', value: '30%', icon: Clock },
             ].map((stat, i) => (
                <Grid key={i} size={{ xs: 12, md: 4}}>
                   <Paper 
                      elevation={0}
                      sx={{ 
                          p: 4, 
                          borderRadius: 4,
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.6)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid',
                          borderColor: 'divider',
                          transition: 'transform 0.3s',
                          '&:hover': { transform: 'translateY(-5px)' }
                      }}
                   >
                       <Typography variant="h2" fontWeight={800} color="primary.main" sx={{ mb: 1 }}>
                          {stat.value}
                       </Typography>
                       <Typography variant="h6" fontWeight={600} color="text.primary">
                          {stat.label}
                       </Typography>
                   </Paper>
                </Grid>
             ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container id="features-section" maxWidth="lg" sx={{ py: 15, position: "relative", zIndex: 5 }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
           <Typography variant="overline" color="primary" fontWeight={700} letterSpacing={2}>
              PLATFORM CAPABILITIES
           </Typography>
           <Typography variant="h3" fontWeight={800} sx={{ mt: 1, mb: 2 }}>
              Everything needed to run a <br/> modern institution
           </Typography>
        </Box>

        <Grid container spacing={4}>
          {[
            { 
               icon: Calendar, 
               title: "Smart Scheduling", 
               desc: "AI-driven conflict resolution for faculty timetables and room allocation.",
               color: theme.palette.primary.main 
            },
            { 
               icon: Shield, 
               title: "Role-Based Access", 
               desc: "Granular permissions for Super Admins, Deans, Faculty, and Students.",
               color: theme.palette.secondary.main 
            },
            { 
               icon: BarChart2, 
               title: "Real-time Analytics", 
               desc: "Visualize student performance trends and resource utilization usage instantly.",
               color: theme.palette.success.main 
            },
            { 
               icon: MessageCircle, 
               title: "Unified Communication", 
               desc: "Integrated messaging for mentorship, grievances, and department announcements.",
               color: theme.palette.warning.main 
            },
            { 
               icon: BookOpen, 
               title: "Curriculum Manager", 
               desc: "Centralized repository for syllabus versioning and course material distribution.",
               color: theme.palette.info.main 
            },
            { 
               icon: Globe, 
               title: "Multi-Campus Support", 
               desc: "Manage multiple college branches from a single 'Super Admin' glass pane.",
               color: '#ec4899' 
            }
          ].map((feature, i) => (
             <Grid size={{ xs: 12, md: 4 }} key={i}>
                <FeatureCard feature={feature} index={i} theme={theme} />
             </Grid>
          ))}
        </Grid>
      </Container>


      {/* Marquee Section */}
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider', py: 8, overflow: 'hidden', bgcolor: 'background.paper' }}>
         <Typography variant="subtitle2" align="center" color="text.secondary" sx={{ mb: 4, letterSpacing: 2, fontWeight: 700, textTransform: 'uppercase' }}>
            Trusted by Forward-Thinking Institutions
         </Typography>
         <Box sx={{ display: 'flex', gap: 8, justifyContent: 'center', opacity: 0.5, flexWrap: 'wrap', px: 2 }}>
             {[Library, GraduationCap, Landmark, Building, Shield].map((Icon, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                   <Icon size={32} />
                   <Typography variant="h6" fontWeight={800} color="text.primary">
                      {['IVY LEAGUE', 'TECH INSTITUTE', 'STATE UNIV', 'POLYTECHNIC', 'GLOBAL ACADEMY'][i]}
                   </Typography>
                </Box>
             ))}
         </Box>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider', pt: 10, pb: 4 }}>
         <Container maxWidth="lg">
            <Grid container spacing={8}>
               <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                     <Box sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <Landmark size={20} />
                     </Box>
                     <Typography variant="h6" fontWeight={800}>ResolvEd</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 300 }}>
                     Empowering educational institutions with next-generation management tools. Built for the future of learning.
                  </Typography>
                  <Stack direction="row" spacing={2}>
                     <IconButton size="small"><Twitter size={20} /></IconButton>
                     <IconButton size="small"><Linkedin size={20} /></IconButton>
                     <IconButton size="small"><Github size={20} /></IconButton>
                  </Stack>
               </Grid>
               
               {[
                  { title: "Product", links: ["Features", "Pricing", "Security", "Roadmap"] },
                  { title: "Resources", links: ["Documentation", "API", "Community", "Help Center"] },
                  { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
               ].map((col, i) => (
                  <Grid size={{ xs: 6, md: 2 }} key={i}>
                     <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>{col.title}</Typography>
                     <Stack spacing={1.5}>
                        {col.links.map(link => (
                           <Typography 
                              key={link} 
                              variant="body2" 
                              color="text.secondary" 
                              sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                              onClick={() => {
                                 if (link === 'Features') handleScrollToFeatures();
                                 else navigate('/login'); // Fallback for demo
                              }}
                           >
                              {link}
                           </Typography>
                        ))}
                     </Stack>
                  </Grid>
               ))}
            </Grid>

            <Divider sx={{ my: 6 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
               <Typography variant="caption" color="text.secondary">
                  © 2026 ResolvEd Inc. All rights reserved.
               </Typography>
               <Stack direction="row" spacing={3}>
                  <Typography variant="caption" color="text.secondary" sx={{ cursor: 'pointer' }}>Privacy Policy</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ cursor: 'pointer' }}>Terms of Service</Typography>
               </Stack>
            </Box>
         </Container>
      </Box>

      {/* Theme Toggle */}
      <Box sx={{ position: "fixed", bottom: 30, right: 30, zIndex: 100 }}>
        <Tooltip title={mode === "dark" ? "Light Mode" : "Dark Mode"}>
          <Box
            onClick={toggleColorMode}
            sx={{
              width: 50, height: 50, borderRadius: "50%", cursor: "pointer",
              bgcolor: "background.paper", color: "text.primary",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: theme.shadows[6], border: "1px solid", borderColor: "divider",
              transition: "transform 0.2s", "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            {mode === "dark" ? <Sun size={24} /> : <Moon size={24} />}
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );
};

// Helper Components
const FeatureCard = ({ feature, index, theme }: any) => {
   const Icon = feature.icon;
   
   return (
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        sx={{
           p: 4, height: '100%',
           borderRadius: 3,
           border: '1px solid', borderColor: 'divider',
           background: `linear-gradient(135deg, ${feature.color}05 0%, transparent 100%)`,
           transition: 'all 0.3s ease',
           cursor: 'default',
           '&:hover': {
              transform: 'translateY(-8px)',
              boxShadow: `0 20px 40px -20px ${feature.color}40`,
              borderColor: `${feature.color}40`
           }
        }}
      >
         <Box sx={{ 
            width: 48, height: 48, borderRadius: 2, 
            bgcolor: `${feature.color}15`, color: feature.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2
         }}>
            <Icon size={24} />
         </Box>
         <Typography variant="h6" fontWeight={700} gutterBottom>{feature.title}</Typography>
         <Typography variant="body2" color="text.secondary" lineHeight={1.6}>{feature.desc}</Typography>
      </Paper>
   );
};

const IconButton = ({ children, size }: any) => (
   <Box sx={{
      width: 32, height: 32, borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid', borderColor: 'divider',
      color: 'text.secondary', cursor: 'pointer',
      '&:hover': { borderColor: 'primary.main', color: 'primary.main', bgcolor: 'action.hover' }
   }}>
      {children}
   </Box>
);

export default LandingPage;
