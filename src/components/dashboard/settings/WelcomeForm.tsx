'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// MUI Imports
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

// import Divider from '@mui/material/Divider'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

type Props = {
	guildId: string;
	initialSettings: any;
	channels: { id: string; name: string }[];
	roles: { id: string; name: string; color: string }[];
};

const WelcomeForm = ({ guildId, initialSettings, channels, roles }: Props) => {
	const [formData, setFormData] = useState(initialSettings);
	const [loading, setLoading] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [toast, setToast] = useState({
		open: false,
		message: '',
		severity: 'success' as 'success' | 'error',
	});
	const router = useRouter();

	// Helper Update State
	const updateState = (key: string, value: any) => {
		setFormData((prev: any) => ({ ...prev, [key]: value }));
	};

	// Handle Save
	const handleSave = async () => {
		setLoading(true);

		try {
			await fetch(`/api/proxy/guilds/settings/${guildId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});
			setToast({
				open: true,
				message: 'Welcome settings saved!',
				severity: 'success',
			});
			router.refresh();
		} catch (error) {
			setToast({
				open: true,
				message: 'Failed to save settings',
				severity: 'error',
			});
		} finally {
			setLoading(false);
		}
	};

	const [previewImage, setPreviewImage] = useState<string | null>(null);
	const [previewModalOpen, setPreviewModalOpen] = useState(false);

	// Handle Preview (Stub for Kythia Arts)
	const handlePreview = async (type: 'In' | 'Out') => {
		setLoading(true);
		try {
			// Gabungin formData dengan type yang mau di-preview
			const payload = {
				...formData,
				type: type,
			};

			const res = await fetch('/api/proxy/canvas/preview', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			const data = await res.json();

			if (data.success && data.image) {
				setPreviewImage(data.image);
				setPreviewModalOpen(true); // Buka modal khusus buat liat gambar
				setToast({
					open: true,
					message: 'Preview generated!',
					severity: 'success',
				});
			} else {
				throw new Error(data.message || 'Failed');
			}
		} catch (error: any) {
			setToast({
				open: true,
				message: error.message || 'Failed to generate preview',
				severity: 'error',
			});
		} finally {
			setLoading(false);
		}
	};

	// --- SUB-COMPONENT: Advanced Canvas Settings (UPDATED: No Defaults) ---
	const renderAdvancedSettings = (type: 'In' | 'Out') => {
		const prefix = `welcome${type}`; // welcomeIn atau welcomeOut

		// Helper kecil biar onChange gak ribet nulis berkali-kali
		// Kalau kosong -> set undefined biar backend pake default library
		const handleNumChange = (key: string, val: string) => {
			updateState(key, val === '' ? undefined : parseInt(val));
		};

		return (
			<Accordion>
				<AccordionSummary expandIcon={<i className="tabler-chevron-down" />}>
					<div className="flex items-center justify-between w-full mr-4">
						<Typography
							variant="h6"
							className="font-bold flex items-center gap-2"
						>
							<i className="tabler-palette" /> Advanced {type} Canvas Settings
						</Typography>
						<Button
							size="small"
							variant="contained"
							color="secondary"
							onClick={(e) => {
								e.stopPropagation();
								handlePreview(type);
							}}
							startIcon={<i className="tabler-photo" />}
						>
							Preview
						</Button>
					</div>
				</AccordionSummary>
				<AccordionDetails>
					<Grid container spacing={4}>
						{/* 1. Dimensions & Overlay */}
						<Grid item xs={12} md={6}>
							<Typography
								variant="subtitle2"
								className="mb-2 text-primary uppercase text-xs font-bold"
							>
								Base & Overlay
							</Typography>
							<div className="flex gap-4 mb-3">
								<TextField
									label="Width"
									type="number"
									size="small"
									fullWidth
									placeholder="Default: 1024"
									value={formData[`${prefix}BannerWidth`] ?? ''}
									onChange={(e) =>
										handleNumChange(`${prefix}BannerWidth`, e.target.value)
									}
									InputLabelProps={{ shrink: true }}
								/>
								<TextField
									label="Height"
									type="number"
									size="small"
									fullWidth
									placeholder="Default: 450"
									value={formData[`${prefix}BannerHeight`] ?? ''}
									onChange={(e) =>
										handleNumChange(`${prefix}BannerHeight`, e.target.value)
									}
									InputLabelProps={{ shrink: true }}
								/>
							</div>
							<TextField
								label="Overlay Color (Hex/RGBA)"
								size="small"
								fullWidth
								placeholder="Default: None"
								value={formData[`${prefix}OverlayColor`] ?? ''}
								onChange={(e) =>
									updateState(`${prefix}OverlayColor`, e.target.value)
								}
								helperText="Warna pelapis transparan (opsional)"
								InputLabelProps={{ shrink: true }}
							/>
						</Grid>

						{/* 2. Avatar Settings */}
						<Grid item xs={12} md={6}>
							<div className="flex justify-between items-center mb-2">
								<Typography
									variant="subtitle2"
									className="text-primary uppercase text-xs font-bold"
								>
									Avatar
								</Typography>
								<Switch
									size="small"
									checked={formData[`${prefix}AvatarEnabled`] ?? true}
									onChange={(e) =>
										updateState(`${prefix}AvatarEnabled`, e.target.checked)
									}
								/>
							</div>
							<div className="flex gap-4 mb-3">
								<TextField
									label="Size"
									type="number"
									size="small"
									fullWidth
									placeholder="Default: 256"
									value={formData[`${prefix}AvatarSize`] ?? ''}
									onChange={(e) =>
										handleNumChange(`${prefix}AvatarSize`, e.target.value)
									}
									InputLabelProps={{ shrink: true }}
								/>
								<TextField
									label="Y Offset"
									type="number"
									size="small"
									fullWidth
									placeholder="Default: 0"
									value={formData[`${prefix}AvatarYOffset`] ?? ''}
									onChange={(e) =>
										handleNumChange(`${prefix}AvatarYOffset`, e.target.value)
									}
									InputLabelProps={{ shrink: true }}
								/>
							</div>
							<div className="flex gap-4">
								<FormControl fullWidth size="small">
									<InputLabel shrink>Shape</InputLabel>
									<Select
										label="Shape"
										value={formData[`${prefix}AvatarShape`] || 'circle'}
										onChange={(e) =>
											updateState(`${prefix}AvatarShape`, e.target.value)
										}
										displayEmpty
									>
										<MenuItem value="circle">Circle</MenuItem>
										<MenuItem value="square">Square</MenuItem>
									</Select>
								</FormControl>
								<TextField
									label="Border Color"
									type="color"
									size="small"
									fullWidth
									value={formData[`${prefix}AvatarBorderColor`] ?? '#FFFFFF'}
									onChange={(e) =>
										updateState(`${prefix}AvatarBorderColor`, e.target.value)
									}
									className="p-0"
									InputLabelProps={{ shrink: true }}
								/>
							</div>
						</Grid>

						{/* 3. Main Text */}
						<Grid item xs={12} md={6}>
							<Typography
								variant="subtitle2"
								className="mb-2 text-primary uppercase text-xs font-bold"
							>
								Main Text
							</Typography>
							<TextField
								label="Content"
								size="small"
								fullWidth
								className="mb-3"
								placeholder={type === 'In' ? 'WELCOME' : 'GOODBYE'}
								value={formData[`${prefix}MainTextContent`] ?? ''}
								onChange={(e) =>
									updateState(`${prefix}MainTextContent`, e.target.value)
								}
								InputLabelProps={{ shrink: true }}
							/>
							<div className="flex gap-4 mb-3">
								<TextField
									label="Font Family"
									size="small"
									fullWidth
									placeholder="Default: Inter"
									value={formData[`${prefix}MainTextFontFamily`] ?? ''}
									onChange={(e) =>
										updateState(`${prefix}MainTextFontFamily`, e.target.value)
									}
									InputLabelProps={{ shrink: true }}
								/>
								<TextField
									label="Weight"
									size="small"
									fullWidth
									placeholder="Default: 800"
									value={formData[`${prefix}MainTextFontWeight`] ?? ''}
									onChange={(e) =>
										updateState(`${prefix}MainTextFontWeight`, e.target.value)
									}
									InputLabelProps={{ shrink: true }}
								/>
							</div>
							<div className="flex gap-4">
								<TextField
									label="Y Offset"
									type="number"
									size="small"
									fullWidth
									placeholder="Default: 0"
									value={formData[`${prefix}MainTextYOffset`] ?? ''}
									onChange={(e) =>
										handleNumChange(`${prefix}MainTextYOffset`, e.target.value)
									}
									InputLabelProps={{ shrink: true }}
								/>
								<TextField
									label="Color"
									type="color"
									size="small"
									fullWidth
									value={formData[`${prefix}MainTextColor`] ?? '#FFFFFF'}
									onChange={(e) =>
										updateState(`${prefix}MainTextColor`, e.target.value)
									}
									className="p-0"
									InputLabelProps={{ shrink: true }}
								/>
							</div>
						</Grid>

						{/* 4. Sub Text */}
						<Grid item xs={12} md={6}>
							<Typography
								variant="subtitle2"
								className="mb-2 text-primary uppercase text-xs font-bold"
							>
								Sub Text
							</Typography>
							<TextField
								label="Content"
								size="small"
								fullWidth
								className="mb-3"
								placeholder="Default: {username}"
								value={formData[`${prefix}SubTextContent`] ?? ''}
								onChange={(e) =>
									updateState(`${prefix}SubTextContent`, e.target.value)
								}
								InputLabelProps={{ shrink: true }}
							/>
							<div className="flex gap-4">
								<TextField
									label="Y Offset"
									type="number"
									size="small"
									fullWidth
									placeholder="Default: 0"
									value={formData[`${prefix}SubTextYOffset`] ?? ''}
									onChange={(e) =>
										handleNumChange(`${prefix}SubTextYOffset`, e.target.value)
									}
									InputLabelProps={{ shrink: true }}
								/>
								<TextField
									label="Color"
									type="color"
									size="small"
									fullWidth
									value={formData[`${prefix}SubTextColor`] ?? '#FFFFFF'}
									onChange={(e) =>
										updateState(`${prefix}SubTextColor`, e.target.value)
									}
									className="p-0"
									InputLabelProps={{ shrink: true }}
								/>
							</div>
						</Grid>

						{/* 5. Canvas Global Border */}
						<Grid item xs={12}>
							<div className="flex gap-4">
								<TextField
									label="Canvas Border Width"
									type="number"
									size="small"
									fullWidth
									placeholder="Default: 0"
									value={formData[`${prefix}BorderWidth`] ?? ''}
									onChange={(e) =>
										handleNumChange(`${prefix}BorderWidth`, e.target.value)
									}
									InputLabelProps={{ shrink: true }}
								/>
								<TextField
									label="Canvas Border Color"
									type="color"
									size="small"
									fullWidth
									value={formData[`${prefix}BorderColor`] ?? '#FFFFFF'}
									onChange={(e) =>
										updateState(`${prefix}BorderColor`, e.target.value)
									}
									className="p-0"
									InputLabelProps={{ shrink: true }}
								/>
							</div>
						</Grid>
					</Grid>
				</AccordionDetails>
			</Accordion>
		);
	};

	return (
		<Grid container spacing={6}>
			{/* --- HEADER BUTTON --- */}
			<Grid item xs={12} className="flex justify-end">
				<Button
					variant="outlined"
					color="info"
					startIcon={<i className="tabler-info-circle" />}
					onClick={() => setModalOpen(true)}
				>
					View Placeholders
				</Button>
			</Grid>

			{/* --- COL 1: TOGGLES & CHANNELS --- */}
			<Grid item xs={12} lg={6}>
				<div className="flex flex-col gap-6">
					{/* Feature Toggles */}
					<Card>
						<CardHeader title="🔧 Feature Settings" />
						<CardContent className="flex flex-col gap-4">
							<div className="flex items-center justify-between border-b border-divider pb-2">
								<div>
									<Typography variant="subtitle1" className="font-medium">
										Welcome In Message
									</Typography>
									<Typography variant="caption">
										Send message when member joins
									</Typography>
								</div>
								<Switch
									checked={formData.welcomeInOn || false}
									onChange={(e) => updateState('welcomeInOn', e.target.checked)}
								/>
							</div>
							<div className="flex items-center justify-between">
								<div>
									<Typography variant="subtitle1" className="font-medium">
										Goodbye Message
									</Typography>
									<Typography variant="caption">
										Send message when member leaves
									</Typography>
								</div>
								<Switch
									checked={formData.welcomeOutOn || false}
									onChange={(e) =>
										updateState('welcomeOutOn', e.target.checked)
									}
								/>
							</div>
						</CardContent>
					</Card>

					{/* Channel Settings */}
					<Card>
						<CardHeader title="📢 Channels & Roles" />
						<CardContent className="flex flex-col gap-4">
							<FormControl fullWidth>
								<InputLabel>Welcome In Channel</InputLabel>
								<Select
									label="Welcome In Channel"
									value={formData.welcomeInChannelId || ''}
									onChange={(e) =>
										updateState('welcomeInChannelId', e.target.value)
									}
								>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									{channels.map((c) => (
										<MenuItem key={c.id} value={c.id}>
											#{c.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<FormControl fullWidth>
								<InputLabel>Welcome Out Channel</InputLabel>
								<Select
									label="Welcome Out Channel"
									value={formData.welcomeOutChannelId || ''}
									onChange={(e) =>
										updateState('welcomeOutChannelId', e.target.value)
									}
								>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									{channels.map((c) => (
										<MenuItem key={c.id} value={c.id}>
											#{c.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<FormControl fullWidth>
								<InputLabel>Welcome Role (Auto-Role)</InputLabel>
								<Select
									label="Welcome Role (Auto-Role)"
									value={formData.welcomeRoleId || ''}
									onChange={(e) => updateState('welcomeRoleId', e.target.value)}
								>
									<MenuItem value="">
										<em>None</em>
									</MenuItem>
									{roles.map((r) => (
										<MenuItem
											key={r.id}
											value={r.id}
											style={{
												color: r.color !== '#000000' ? r.color : 'inherit',
											}}
										>
											@ {r.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</CardContent>
					</Card>
				</div>
			</Grid>

			{/* --- COL 2: EMBED & BACKGROUND --- */}
			<Grid item xs={12} lg={6}>
				<div className="flex flex-col gap-6">
					{/* Welcome In */}
					<Card>
						<CardHeader
							title="👋 Welcome In Message"
							action={
								<Switch
									checked={formData.welcomeInOn}
									onChange={(e) => updateState('welcomeInOn', e.target.checked)}
								/>
							}
						/>
						<CardContent className="flex flex-col gap-4">
							<TextField
								label="Embed Message Text"
								multiline
								rows={2}
								fullWidth
								placeholder="Welcome {mention} to the server!"
								value={formData.welcomeInEmbedText || ''}
								onChange={(e) =>
									updateState('welcomeInEmbedText', e.target.value)
								}
							/>
							<div className="flex gap-4">
								<TextField
									label="Embed Side Color"
									type="color"
									size="small"
									fullWidth
									value={formData.welcomeInEmbedColor || '#000000'}
									onChange={(e) =>
										updateState('welcomeInEmbedColor', e.target.value)
									}
									className="p-0"
								/>
								<TextField
									label="Background Image URL"
									fullWidth
									size="small"
									value={formData.welcomeInBackgroundUrl || ''}
									onChange={(e) =>
										updateState('welcomeInBackgroundUrl', e.target.value)
									}
								/>
							</div>
						</CardContent>
					</Card>

					{/* Welcome Out */}
					<Card>
						<CardHeader
							title="🚪 Goodbye Message"
							action={
								<Switch
									checked={formData.welcomeOutOn}
									onChange={(e) =>
										updateState('welcomeOutOn', e.target.checked)
									}
								/>
							}
						/>
						<CardContent className="flex flex-col gap-4">
							<TextField
								label="Embed Message Text"
								multiline
								rows={2}
								fullWidth
								placeholder="Goodbye {username}..."
								value={formData.welcomeOutEmbedText || ''}
								onChange={(e) =>
									updateState('welcomeOutEmbedText', e.target.value)
								}
							/>
							<div className="flex gap-4">
								<TextField
									label="Embed Side Color"
									type="color"
									size="small"
									fullWidth
									value={formData.welcomeOutEmbedColor || '#000000'}
									onChange={(e) =>
										updateState('welcomeOutEmbedColor', e.target.value)
									}
									className="p-0"
								/>
								<TextField
									label="Background Image URL"
									fullWidth
									size="small"
									value={formData.welcomeOutBackgroundUrl || ''}
									onChange={(e) =>
										updateState('welcomeOutBackgroundUrl', e.target.value)
									}
								/>
							</div>
						</CardContent>
					</Card>
				</div>
			</Grid>

			{/* --- FULL WIDTH: ADVANCED SETTINGS --- */}
			<Grid item xs={12}>
				{renderAdvancedSettings('In')}
			</Grid>
			<Grid item xs={12}>
				{renderAdvancedSettings('Out')}
			</Grid>

			{/* === FOOTER ACTION === */}
			<Grid item xs={12} className="flex justify-end sticky bottom-4 z-50">
				<Card className="shadow-xl border border-primary/50">
					<CardContent className="py-3 px-6 flex gap-4 items-center">
						<Typography
							variant="body2"
							className="text-textSecondary hidden sm:block"
						>
							Unsaved changes will be lost.
						</Typography>
						<Button
							variant="contained"
							size="large"
							onClick={handleSave}
							disabled={loading}
							startIcon={
								loading ? (
									<CircularProgress size={20} color="inherit" />
								) : (
									<i className="tabler-device-floppy" />
								)
							}
						>
							{loading ? 'Saving...' : 'Save Changes'}
						</Button>
					</CardContent>
				</Card>
			</Grid>

			{/* --- PLACEHOLDERS MODAL --- */}
			<Dialog
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				maxWidth="md"
				scroll="paper"
			>
				<DialogTitle className="flex items-center gap-2">
					<i className="tabler-code" /> Available Placeholders
				</DialogTitle>
				<DialogContent dividers>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						{/* Member Info */}
						<div className="col-span-full">
							<Typography
								variant="subtitle2"
								className="text-primary font-bold uppercase text-xs mt-2 mb-1"
							>
								Member Info
							</Typography>
						</div>
						{[
							{ code: '{userId}', desc: "Member's Discord ID" },
							{ code: '{username}', desc: "Member's Username" },
							{ code: '{tag}', desc: "Member's Full Tag (Name#0000)" },
							{ code: '{userTag}', desc: "Member's Tag ID" },
							{ code: '{mention}', desc: 'Mention Member (@User)' },
							{ code: '{memberJoin}', desc: 'Member Join Date' },
						].map((p, i) => (
							<div
								key={`member-${i}`}
								className="flex flex-col border-b border-divider pb-2"
							>
								<code className="text-primary font-boldtext p-2">{p.code}</code>
								<span className="text-textSecondary text-xs">{p.desc}</span>
							</div>
						))}

						{/* Separator */}
						<div className="col-span-full">
							<Typography
								variant="subtitle2"
								className="text-primary font-bold uppercase text-xs mt-2 mb-1"
							>
								Server Info
							</Typography>
						</div>

						{[
							{ code: '{guildName}', desc: 'Server Name' },
							{ code: '{guildId}', desc: 'Server ID' },
							{ code: '{ownerName}', desc: 'Server Owner Tag' },
							{ code: '{ownerId}', desc: 'Server Owner ID' },
							{ code: '{region}', desc: 'Server Region/Locale' },
							{ code: '{createdAt}', desc: 'Server Created Date' },
							{ code: '{verified}', desc: 'Verified Status' },
							{ code: '{partnered}', desc: 'Partnered Status' },
						].map((p, i) => (
							<div
								key={`server-${i}`}
								className="flex flex-col border-b border-divider pb-2"
							>
								<code className="text-primary font-bold p-2">{p.code}</code>
								<span className="text-textSecondary text-xs">{p.desc}</span>
							</div>
						))}

						{/* Counts */}
						<div className="col-span-full">
							<Typography
								variant="subtitle2"
								className="text-primary font-bold uppercase text-xs mt-2 mb-1"
							>
								Member Counts
							</Typography>
						</div>

						{[
							{ code: '{members}', desc: 'Total Member Count' },
							{ code: '{membersTotal}', desc: 'Total Cached Members' },
							{ code: '{humans}', desc: 'Human Members' },
							{ code: '{bots}', desc: 'Bot Members' },
							{ code: '{online}', desc: 'Online Members' },
							{ code: '{idle}', desc: 'Idle Members' },
							{ code: '{dnd}', desc: 'Do Not Disturb Members' },
							{ code: '{offline}', desc: 'Offline Members' },
							{ code: '{onlineHumans}', desc: 'Online Humans' },
							{ code: '{onlineBots}', desc: 'Online Bots' },
						].map((p, i) => (
							<div
								key={`count-${i}`}
								className="flex flex-col border-b border-divider pb-2"
							>
								<code className="text-primary font-bold p-2">{p.code}</code>
								<span className="text-textSecondary text-xs">{p.desc}</span>
							</div>
						))}

						{/* Server Stats */}
						<div className="col-span-full">
							<Typography
								variant="subtitle2"
								className="text-primary font-bold uppercase text-xs mt-2 mb-1"
							>
								Server Stats
							</Typography>
						</div>

						{[
							{ code: '{boosts}', desc: 'Server Boost Count' },
							{ code: '{boostLevel}', desc: 'Server Boost Level' },
							{ code: '{roles}', desc: 'Total Roles' },
							{ code: '{emojis}', desc: 'Total Emojis' },
							{ code: '{stickers}', desc: 'Total Stickers' },
						].map((p, i) => (
							<div
								key={`stats-${i}`}
								className="flex flex-col border-b border-divider pb-2"
							>
								<code className="text-primary font-bold p-2">{p.code}</code>
								<span className="text-textSecondary text-xs">{p.desc}</span>
							</div>
						))}

						{/* Channels */}
						<div className="col-span-full">
							<Typography
								variant="subtitle2"
								className="text-primary font-bold uppercase text-xs mt-2 mb-1"
							>
								Channels
							</Typography>
						</div>

						{[
							{ code: '{channels}', desc: 'Total Channels' },
							{ code: '{textChannels}', desc: 'Text Channels' },
							{ code: '{voiceChannels}', desc: 'Voice Channels' },
							{ code: '{categories}', desc: 'Categories' },
							{ code: '{announcementChannels}', desc: 'Announcement Channels' },
							{ code: '{stageChannels}', desc: 'Stage Channels' },
						].map((p, i) => (
							<div
								key={`channel-${i}`}
								className="flex flex-col border-b border-divider pb-2"
							>
								<code className="text-primary font-bold p-2">{p.code}</code>
								<span className="text-textSecondary text-xs">{p.desc}</span>
							</div>
						))}
					</div>
					<Alert severity="info" className="mt-4">
						💡 Use these placeholders in <strong>Embed Text</strong>,{' '}
						<strong>Main Text</strong>, and <strong>Sub Text</strong> fields.
						They will be replaced with real data when a member joins or leaves!
					</Alert>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setModalOpen(false)}>Close</Button>
				</DialogActions>
			</Dialog>

			{/* --- PREVIEW RESULT MODAL --- */}
			<Dialog
				open={previewModalOpen}
				onClose={() => setPreviewModalOpen(false)}
				maxWidth="lg"
				fullWidth
			>
				<DialogTitle className="flex items-center gap-2">
					<i className="tabler-photo" /> Canvas Preview
				</DialogTitle>
				<DialogContent className="flex justify-center items-center bg-black/5 p-4 overflow-hidden min-h-[300px]">
					{previewImage ? (
						<img
							src={previewImage}
							alt="Canvas Preview"
							className="max-w-full h-auto rounded-lg shadow-lg object-contain"
							style={{ maxHeight: '70vh' }}
						/>
					) : (
						<div className="flex flex-col items-center gap-2 text-textSecondary opacity-50">
							<CircularProgress size={40} />
							<Typography variant="body2">Loading image...</Typography>
						</div>
					)}
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => setPreviewModalOpen(false)}
						variant="outlined"
						color="secondary"
					>
						Close Preview
					</Button>
				</DialogActions>
			</Dialog>

			{/* Toast */}
			<Snackbar
				open={toast.open}
				autoHideDuration={3000}
				onClose={() => setToast((p) => ({ ...p, open: false }))}
			>
				<Alert severity={toast.severity} variant="filled">
					{toast.message}
				</Alert>
			</Snackbar>
		</Grid>
	);
};

export default WelcomeForm;
