import React from 'react';
import { ArrowForward, AutoStories, CheckCircle, Groups, PlayArrow, School } from '@mui/icons-material';
import { Box, Button, Chip, Container, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import '../App.css';

const LandingPage = () => (
	<Box className="landing-page">
		<section className="landing-hero">
			<Container className="landing-hero-inner">
				<Box className="landing-copy">
					<Chip label="SHILOH COLLEGE · LEARN WITH PURPOSE" className="landing-chip" />
					<Typography variant="h1">A learning space made for becoming.</Typography>
					<Typography className="landing-lede">Build useful skills, find your people, and make steady progress with learning that feels personal from day one.</Typography>
					<Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4 }}>
						<Button component={Link} to="/signup" variant="contained" color="secondary" size="large" endIcon={<ArrowForward />}>Create your account</Button>
						<Button component={Link} to="/login" variant="outlined" size="large" startIcon={<PlayArrow />} className="landing-outline-button">Sign in</Button>
					</Stack>
					<Box className="landing-proof"><CheckCircle /><Typography variant="body2">Clear next steps</Typography><CheckCircle /><Typography variant="body2">Supportive community</Typography></Box>
				</Box>
				<Box className="landing-visual" aria-label="Shiloh learning journey preview">
					<Box className="landing-sun" />
					  <Box className="landing-path-card"><Typography variant="overline">YOUR LEARNING PATH</Typography><Typography variant="h5">Curiosity to confidence</Typography><Box className="landing-path-line"><span className="landing-node active"><School /></span><span /><span className="landing-node"><AutoStories /></span><span /><span className="landing-node"><Groups /></span></Box><Typography variant="body2" color="text.secondary">Start with one meaningful step today.</Typography></Box>
					<Box className="landing-note"><Typography variant="h6">Small wins matter.</Typography><Typography variant="body2">Your momentum is built one lesson at a time.</Typography></Box>
				</Box>
			</Container>
		</section>
		<section className="landing-beliefs"><Container><Box className="landing-section-heading"><Typography className="eyebrow">WHY SHILOH</Typography><Typography variant="h2">Education that moves with you.</Typography></Box><Box className="landing-belief-grid"><Box><AutoStories /><Typography variant="h6">Learn clearly</Typography><Typography color="text.secondary">Focused resources and simple paths help you spend more time learning.</Typography></Box><Box><School /><Typography variant="h6">Grow confidently</Typography><Typography color="text.secondary">Build practical knowledge with guidance from teachers who care.</Typography></Box><Box><Groups /><Typography variant="h6">Belong deeply</Typography><Typography color="text.secondary">Connect with a community that makes progress feel less lonely.</Typography></Box></Box></Container></section>
		<section className="landing-cta"><Container><Typography variant="h2">Ready to begin?</Typography><Typography>There is a place for your next idea here.</Typography><Button component={Link} to="/signup" variant="contained" color="secondary" endIcon={<ArrowForward />} sx={{ mt: 3 }}>Join Shiloh College</Button></Container></section>
	</Box>
);

export default LandingPage;
