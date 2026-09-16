import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Avatar,
    Badge,
    Box,
    Button,
    Chip,
    Container,
    Divider,
    IconButton,
    InputAdornment,
    LinearProgress,
    Paper,
    Skeleton,
    Snackbar,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';

import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import CampaignRoundedIcon from '@mui/icons-material/CampaignRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { getDemoUser } from '../../demoData';

const API_URL =
    'https://shiloh-server-2t51.onrender.com/communication/notifications';

const COLORS = {
    primary: '#6366f1',
    primaryLight: '#818cf8',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#38bdf8',
    background: '#0b1120',
    paper: '#111827',
    paperLight: '#172033',
    border: 'rgba(148, 163, 184, 0.12)',
    text: '#f8fafc',
    muted: '#94a3b8',
};

const getNotificationType = (type = '') => {
    const normalized = String(type).toLowerCase();

    if (
        normalized.includes('success') ||
        normalized.includes('complete') ||
        normalized.includes('approved')
    ) {
        return {
            color: COLORS.success,
            label: 'Success',
            icon: <CheckCircleRoundedIcon />,
        };
    }

    if (
        normalized.includes('warning') ||
        normalized.includes('alert')
    ) {
        return {
            color: COLORS.warning,
            label: 'Warning',
            icon: <WarningAmberRoundedIcon />,
        };
    }

    if (
        normalized.includes('error') ||
        normalized.includes('failed')
    ) {
        return {
            color: COLORS.error,
            label: 'Error',
            icon: <ErrorOutlineRoundedIcon />,
        };
    }

    if (
        normalized.includes('announcement') ||
        normalized.includes('campaign')
    ) {
        return {
            color: COLORS.primary,
            label: 'Announcement',
            icon: <CampaignRoundedIcon />,
        };
    }

    if (
        normalized.includes('assignment') ||
        normalized.includes('quiz')
    ) {
        return {
            color: '#a78bfa',
            label: 'Academic',
            icon: <AssignmentRoundedIcon />,
        };
    }

    if (normalized.includes('event')) {
        return {
            color: '#ec4899',
            label: 'Event',
            icon: <EventRoundedIcon />,
        };
    }

    return {
        color: COLORS.info,
        label: 'Information',
        icon: <InfoRoundedIcon />,
    };
};

const getTimestamp = (timestamp) => {
    if (!timestamp) return 'Recently';

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
        return 'Recently';
    }

    const now = new Date();
    const difference = now.getTime() - date.getTime();

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (difference < minute) {
        return 'Just now';
    }

    if (difference < hour) {
        const minutes = Math.floor(difference / minute);
        return `${minutes}m ago`;
    }

    if (difference < day) {
        const hours = Math.floor(difference / hour);
        return `${hours}h ago`;
    }

    if (difference < 7 * day) {
        const days = Math.floor(difference / day);
        return `${days}d ago`;
    }

    return date.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year:
            date.getFullYear() !== now.getFullYear()
                ? 'numeric'
                : undefined,
    });
};

const formatFullDate = (timestamp) => {
    if (!timestamp) return 'Date unavailable';

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
        return 'Date unavailable';
    }

    return date.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
};

const NotificationIcon = ({ type }) => {
    const config = getNotificationType(type);

    return (
        <Avatar
            sx={{
                width: 46,
                height: 46,
                flexShrink: 0,
                bgcolor: `${config.color}18`,
                color: config.color,
                border: `1px solid ${config.color}30`,
            }}
        >
            {config.icon}
        </Avatar>
    );
};

const NotificationCard = ({ notification, onMarkRead }) => {
    const type = getNotificationType(notification.type);

    const isUnread =
        notification.read === false ||
        notification.isRead === false ||
        notification.status === 'unread';

    return (
        <Paper
            elevation={0}
            sx={{
                position: 'relative',
                p: { xs: 2, sm: 2.5 },
                borderRadius: 3,
                border: `1px solid ${
                    isUnread ? `${type.color}35` : COLORS.border
                }`,
                background: isUnread
                    ? `linear-gradient(135deg, ${type.color}0d 0%, ${COLORS.paper} 48%)`
                    : COLORS.paper,
                transition: 'all 0.2s ease',
                overflow: 'hidden',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: `${type.color}45`,
                    boxShadow: `0 12px 35px rgba(0, 0, 0, 0.18)`,
                },
            }}
        >
            {isUnread && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: 3,
                        height: '100%',
                        bgcolor: type.color,
                    }}
                />
            )}

            <Stack
                direction="row"
                spacing={2}
                alignItems="flex-start"
            >
                <NotificationIcon type={notification.type} />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1}
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        justifyContent="space-between"
                        mb={0.75}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            flexWrap="wrap"
                        >
                            <Typography
                                variant="subtitle1"
                                fontWeight={700}
                                sx={{
                                    color: COLORS.text,
                                    lineHeight: 1.3,
                                }}
                            >
                                {notification.subject || 'Notification'}
                            </Typography>

                            {isUnread && (
                                <Box
                                    component="span"
                                    sx={{
                                        width: 7,
                                        height: 7,
                                        borderRadius: '50%',
                                        bgcolor: type.color,
                                        boxShadow: `0 0 0 4px ${type.color}15`,
                                    }}
                                />
                            )}
                        </Stack>

                        <Tooltip
                            title={formatFullDate(notification.timestamp)}
                        >
                            <Typography
                                variant="caption"
                                sx={{
                                    color: COLORS.muted,
                                    whiteSpace: 'nowrap',
                                    cursor: 'help',
                                }}
                            >
                                {getTimestamp(notification.timestamp)}
                            </Typography>
                        </Tooltip>
                    </Stack>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        mb={1.25}
                    >
                        <Chip
                            label={type.label}
                            size="small"
                            sx={{
                                height: 24,
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                color: type.color,
                                bgcolor: `${type.color}15`,
                                border: `1px solid ${type.color}25`,
                            }}
                        />

                        {notification.type &&
                            notification.type.toLowerCase() !==
                                type.label.toLowerCase() && (
                                <Typography
                                    variant="caption"
                                    sx={{ color: COLORS.muted }}
                                >
                                    {notification.type}
                                </Typography>
                            )}
                    </Stack>

                    <Typography
                        variant="body2"
                        sx={{
                            color: '#cbd5e1',
                            lineHeight: 1.7,
                            whiteSpace: 'pre-line',
                        }}
                    >
                        {notification.message || 'No message provided.'}
                    </Typography>

                    {isUnread && onMarkRead && (
                        <Button
                            size="small"
                            startIcon={<DoneAllRoundedIcon />}
                            onClick={() => onMarkRead(notification.id)}
                            sx={{
                                mt: 1.5,
                                color: type.color,
                                textTransform: 'none',
                                fontWeight: 700,
                                px: 0,
                                '&:hover': {
                                    bgcolor: 'transparent',
                                },
                            }}
                        >
                            Mark as read
                        </Button>
                    )}
                </Box>
            </Stack>
        </Paper>
    );
};

const NotificationSkeleton = () => (
    <Stack spacing={1.5}>
        {[1, 2, 3].map((item) => (
            <Paper
                key={item}
                sx={{
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: COLORS.paper,
                    border: `1px solid ${COLORS.border}`,
                }}
            >
                <Stack direction="row" spacing={2}>
                    <Skeleton
                        variant="circular"
                        width={46}
                        height={46}
                    />

                    <Box flex={1}>
                        <Skeleton width="55%" height={25} />
                        <Skeleton width="25%" height={20} />
                        <Skeleton width="90%" height={22} />
                        <Skeleton width="75%" height={22} />
                    </Box>
                </Stack>
            </Paper>
        ))}
    </Stack>
);

const Notification = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const showMessage = useCallback((message, severity = 'success') => {
        setSnackbar({
            open: true,
            message,
            severity,
        });
    }, []);

    const fetchNotifications = useCallback(
        async (showRefresh = false) => {
            try {
                if (showRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                const storedData = JSON.parse(
                    localStorage.getItem('userDATA') || 'null'
                );

                if (storedData?.demo) {
                    const demoNotifications =
                        getDemoUser('teacher')?.teacher
                            ?.notifications || [];

                    setNotifications(demoNotifications);
                    return;
                }

                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error(
                        `Request failed with status ${response.status}`
                    );
                }

                const data = await response.json();

                setNotifications(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error(
                    'Error fetching notifications:',
                    error
                );

                showMessage(
                    'Unable to load notifications. Please try again.',
                    'error'
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [showMessage]
    );

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const unreadCount = useMemo(
        () =>
            notifications.filter(
                (notification) =>
                    notification.read === false ||
                    notification.isRead === false ||
                    notification.status === 'unread'
            ).length,
        [notifications]
    );

    const filteredNotifications = useMemo(() => {
        const query = search.trim().toLowerCase();

        return notifications.filter((notification) => {
            const isUnread =
                notification.read === false ||
                notification.isRead === false ||
                notification.status === 'unread';

            const matchesFilter =
                filter === 'all' ||
                (filter === 'unread' && isUnread) ||
                (filter === 'read' && !isUnread);

            const searchableText = [
                notification.subject,
                notification.message,
                notification.type,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();

            const matchesSearch =
                !query || searchableText.includes(query);

            return matchesFilter && matchesSearch;
        });
    }, [notifications, search, filter]);

    const markAsRead = async (id) => {
        /*
         * Optimistic UI update.
         *
         * If the backend exposes a read-status endpoint, this is
         * the place to add the PATCH/PUT request.
         */
        setNotifications((current) =>
            current.map((notification) =>
                notification.id === id
                    ? {
                          ...notification,
                          read: true,
                          isRead: true,
                          status: 'read',
                      }
                    : notification
            )
        );

        showMessage('Notification marked as read.');
    };

    const markAllAsRead = () => {
        setNotifications((current) =>
            current.map((notification) => ({
                ...notification,
                read: true,
                isRead: true,
                status: 'read',
            }))
        );

        showMessage('All notifications marked as read.');
    };

    const closeSnackbar = () => {
        setSnackbar((current) => ({
            ...current,
            open: false,
        }));
    };

    return (
        <Box
            sx={{
                minHeight: '100%',
                bgcolor: COLORS.background,
                color: COLORS.text,
                py: { xs: 2, sm: 3, md: 4 },
            }}
        >
            <Container maxWidth="lg">
                {/* Header */}
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    justifyContent="space-between"
                    mb={3}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                    >
                        <Badge
                            badgeContent={unreadCount}
                            color="error"
                            max={99}
                            invisible={unreadCount === 0}
                        >
                            <Avatar
                                sx={{
                                    width: 54,
                                    height: 54,
                                    bgcolor: `${COLORS.primary}18`,
                                    color: COLORS.primaryLight,
                                    border: `1px solid ${COLORS.primary}30`,
                                }}
                            >
                                <NotificationsActiveRoundedIcon />
                            </Avatar>
                        </Badge>

                        <Box>
                            <Typography
                                variant="h4"
                                fontWeight={800}
                                sx={{
                                    letterSpacing: '-0.03em',
                                    fontSize: {
                                        xs: '1.65rem',
                                        sm: '2rem',
                                    },
                                }}
                            >
                                Notifications
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    color: COLORS.muted,
                                    mt: 0.4,
                                }}
                            >
                                Stay updated with your teaching activity
                                and platform alerts.
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        {unreadCount > 0 && (
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<DoneAllRoundedIcon />}
                                onClick={markAllAsRead}
                                sx={{
                                    borderColor: COLORS.border,
                                    color: '#cbd5e1',
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    '&:hover': {
                                        borderColor: COLORS.primary,
                                        bgcolor: `${COLORS.primary}0c`,
                                    },
                                }}
                            >
                                Mark all read
                            </Button>
                        )}

                        <Tooltip title="Refresh notifications">
                            <span>
                                <IconButton
                                    onClick={() => fetchNotifications(true)}
                                    disabled={refreshing}
                                    aria-label="Refresh notifications"
                                    sx={{
                                        width: 40,
                                        height: 40,
                                        color: '#cbd5e1',
                                        border: `1px solid ${COLORS.border}`,
                                        borderRadius: 2,
                                        '&:hover': {
                                            color: COLORS.primaryLight,
                                            bgcolor: `${COLORS.primary}0c`,
                                        },
                                    }}
                                >
                                    <RefreshRoundedIcon
                                        sx={{
                                            animation: refreshing
                                                ? 'spin 1s linear infinite'
                                                : 'none',
                                            '@keyframes spin': {
                                                from: {
                                                    transform:
                                                        'rotate(0deg)',
                                                },
                                                to: {
                                                    transform:
                                                        'rotate(360deg)',
                                                },
                                            },
                                        }}
                                    />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Stack>
                </Stack>

                {/* Summary */}
                <Paper
                    elevation={0}
                    sx={{
                        mb: 2,
                        p: { xs: 1.5, sm: 2 },
                        borderRadius: 3,
                        bgcolor: COLORS.paper,
                        border: `1px solid ${COLORS.border}`,
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1.5}
                        alignItems={{ xs: 'stretch', sm: 'center' }}
                    >
                        <TextField
                            fullWidth
                            size="small"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search notifications..."
                            aria-label="Search notifications"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchRoundedIcon
                                            sx={{
                                                color: COLORS.muted,
                                            }}
                                        />
                                    </InputAdornment>
                                ),
                                endAdornment: search && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={() => setSearch('')}
                                            aria-label="Clear search"
                                        >
                                            <CloseRoundedIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    bgcolor: '#0f172a',
                                    color: COLORS.text,
                                    '& fieldset': {
                                        borderColor: COLORS.border,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: `${COLORS.primary}70`,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: COLORS.primary,
                                    },
                                },
                            }}
                        />

                        <Stack
                            direction="row"
                            spacing={0.75}
                            sx={{
                                overflowX: 'auto',
                                pb: { xs: 0.5, sm: 0 },
                                '&::-webkit-scrollbar': {
                                    height: 3,
                                },
                            }}
                        >
                            {[
                                ['all', `All ${notifications.length}`],
                                ['unread', `Unread ${unreadCount}`],
                                [
                                    'read',
                                    `Read ${
                                        notifications.length -
                                        unreadCount
                                    }`,
                                ],
                            ].map(([value, label]) => (
                                <Chip
                                    key={value}
                                    label={label}
                                    onClick={() => setFilter(value)}
                                    sx={{
                                        flexShrink: 0,
                                        fontWeight: 700,
                                        borderRadius: 2,
                                        color:
                                            filter === value
                                                ? '#fff'
                                                : COLORS.muted,
                                        bgcolor:
                                            filter === value
                                                ? COLORS.primary
                                                : '#0f172a',
                                        border: `1px solid ${
                                            filter === value
                                                ? COLORS.primary
                                                : COLORS.border
                                        }`,
                                        '&:hover': {
                                            bgcolor:
                                                filter === value
                                                    ? COLORS.primary
                                                    : '#172033',
                                        },
                                    }}
                                />
                            ))}
                        </Stack>
                    </Stack>
                </Paper>

                {refreshing && <LinearProgress />}

                {/* Notification list */}
                <Box sx={{ mt: 2 }}>
                    {loading ? (
                        <NotificationSkeleton />
                    ) : filteredNotifications.length > 0 ? (
                        <Stack spacing={1.5}>
                            {filteredNotifications.map(
                                (notification) => (
                                    <NotificationCard
                                        key={
                                            notification.id ||
                                            `${notification.timestamp}-${notification.subject}`
                                        }
                                        notification={notification}
                                        onMarkRead={markAsRead}
                                    />
                                )
                            )}
                        </Stack>
                    ) : (
                        <Paper
                            elevation={0}
                            sx={{
                                py: 8,
                                px: 3,
                                textAlign: 'center',
                                borderRadius: 3,
                                bgcolor: COLORS.paper,
                                border: `1px solid ${COLORS.border}`,
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 68,
                                    height: 68,
                                    mx: 'auto',
                                    mb: 2,
                                    bgcolor: '#1e293b',
                                    color: COLORS.muted,
                                }}
                            >
                                <NotificationsNoneRoundedIcon
                                    sx={{ fontSize: 32 }}
                                />
                            </Avatar>

                            <Typography
                                variant="h6"
                                fontWeight={800}
                                mb={0.75}
                            >
                                {search || filter !== 'all'
                                    ? 'No matching notifications'
                                    : 'You’re all caught up'}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{
                                    maxWidth: 420,
                                    mx: 'auto',
                                    color: COLORS.muted,
                                    lineHeight: 1.7,
                                }}
                            >
                                {search || filter !== 'all'
                                    ? 'Try changing your search or notification filter.'
                                    : 'New announcements, quiz activity and important updates will appear here.'}
                            </Typography>

                            {(search || filter !== 'all') && (
                                <Button
                                    sx={{
                                        mt: 2,
                                        textTransform: 'none',
                                        fontWeight: 700,
                                    }}
                                    onClick={() => {
                                        setSearch('');
                                        setFilter('all');
                                    }}
                                >
                                    Clear filters
                                </Button>
                            )}
                        </Paper>
                    )}
                </Box>

                {/* Footer */}
                {!loading && notifications.length > 0 && (
                    <>
                        <Divider
                            sx={{
                                my: 3,
                                borderColor: COLORS.border,
                            }}
                        />

                        <Typography
                            variant="caption"
                            sx={{
                                display: 'block',
                                textAlign: 'center',
                                color: COLORS.muted,
                            }}
                        >
                            Showing {filteredNotifications.length} of{' '}
                            {notifications.length} notifications
                        </Typography>
                    </>
                )}
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={closeSnackbar}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={closeSnackbar}
                    variant="filled"
                    sx={{
                        width: '100%',
                        borderRadius: 2,
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Notification;