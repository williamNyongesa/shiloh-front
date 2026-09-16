import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  alpha,
  Box,
  Chip,
  CircularProgress,
  Divider,
  InputAdornment,
  Paper,
  Pagination,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import {
  AccountBalanceWalletOutlined,
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  CheckCircleOutlineRounded,
  ErrorOutlineRounded,
  HourglassEmptyRounded,
  ReceiptLongRounded,
  SearchRounded,
  SyncRounded,
  TrendingUpRounded,
} from '@mui/icons-material';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getDemoUser } from '../../demoData';

const ITEMS_PER_PAGE = 10;

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  /* =========================================================
     TOKEN REFRESH
  ========================================================= */

  const refreshToken = useCallback(async () => {
    try {
      const refresh_token = localStorage.getItem('refresh_token');

      if (!refresh_token) {
        navigate('/login');
        return null;
      }

      const response = await axios.post(
        'https://shiloh-server-2t51.onrender.com/users/refresh',
        {},
        {
          headers: {
            Authorization: `Bearer ${refresh_token}`,
          },
        }
      );

      if (response.status === 200) {
        const newToken = response.data.access_token;

        localStorage.setItem('access_token', newToken);

        if (response.data.refresh_token) {
          localStorage.setItem(
            'refresh_token',
            response.data.refresh_token
          );
        }

        localStorage.setItem(
          'tokenExpiration',
          JSON.stringify(
            Date.now() + 60 * 60 * 1000
          )
        );

        return newToken;
      }

      navigate('/login');
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      navigate('/login');
      return null;
    }
  }, [navigate]);

  /* =========================================================
     FETCH TRANSACTIONS
  ========================================================= */

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const storedData = JSON.parse(
        localStorage.getItem('userDATA') || 'null'
      );

      /*
       * Demo mode
       */
      if (storedData?.demo) {
        const demoTransactions =
          getDemoUser('admin')?.transactions || [];

        setTransactions(demoTransactions);
        setCurrentPage(1);
        return;
      }

      let token = localStorage.getItem('access_token');

      if (!token) {
        navigate('/login');
        return;
      }

      let response = await fetch(
        'https://shiloh-server-2t51.onrender.com/finances',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      /*
       * Retry once after refreshing token.
       */
      if (response.status === 401) {
        const newToken = await refreshToken();

        if (!newToken) {
          return;
        }

        token = newToken;

        response = await fetch(
          'https://shiloh-server-2t51.onrender.com/finances',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (!response.ok) {
        throw new Error(
          `Failed to load transactions (${response.status})`
        );
      }

      const data = await response.json();

      setTransactions(
        Array.isArray(data)
          ? data
          : data?.transactions || []
      );

      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching transactions:', error);

      setError(
        'Unable to load transactions. Please try again.'
      );

      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [navigate, refreshToken]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return transactions;
    }

    return transactions.filter((transaction) => {
      const reference =
        transaction.id ||
        transaction.reference ||
        '';

      const description =
        transaction.description ||
        transaction.transaction_type ||
        '';

      const status =
        transaction.status ||
        '';

      const date =
        transaction.date ||
        '';

      const amount =
        String(transaction.amount || '');

      return [
        reference,
        description,
        status,
        date,
        amount,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [transactions, search]);

  /* =========================================================
     PAGINATION
  ========================================================= */

  const pageCount = Math.max(
    1,
    Math.ceil(
      filteredTransactions.length /
        ITEMS_PER_PAGE
    )
  );

  const currentTransactions =
    filteredTransactions.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (_, page) => {
    setCurrentPage(page);
  };

  /* =========================================================
     STATISTICS
  ========================================================= */

  const statistics = useMemo(() => {
    const completed = transactions.filter(
      (transaction) =>
        String(transaction.status || '')
          .toLowerCase() === 'completed'
    );

    const pending = transactions.filter(
      (transaction) =>
        ['pending', 'processing'].includes(
          String(transaction.status || '')
            .toLowerCase()
        )
    );

    const total = transactions.reduce(
      (sum, transaction) =>
        sum +
        Number(transaction.amount || 0),
      0
    );

    return {
      total,
      count: transactions.length,
      completed: completed.length,
      pending: pending.length,
    };
  }, [transactions]);

  /* =========================================================
     HELPERS
  ========================================================= */

  const getStatusConfig = (status) => {
    const normalized = String(
      status || 'Completed'
    ).toLowerCase();

    if (normalized === 'completed') {
      return {
        label: 'Completed',
        color: 'success',
        icon: (
          <CheckCircleOutlineRounded
            sx={{ fontSize: 16 }}
          />
        ),
      };
    }

    if (normalized === 'pending') {
      return {
        label: 'Pending',
        color: 'warning',
        icon: (
          <HourglassEmptyRounded
            sx={{ fontSize: 16 }}
          />
        ),
      };
    }

    if (normalized === 'processing') {
      return {
        label: 'Processing',
        color: 'info',
        icon: (
          <SyncRounded
            sx={{ fontSize: 16 }}
          />
        ),
      };
    }

    if (
      normalized === 'failed' ||
      normalized === 'cancelled'
    ) {
      return {
        label:
          normalized === 'cancelled'
            ? 'Cancelled'
            : 'Failed',
        color: 'error',
        icon: (
          <ErrorOutlineRounded
            sx={{ fontSize: 16 }}
          />
        ),
      };
    }

    return {
      label: status || 'Completed',
      color: 'default',
      icon: null,
    };
  };

  const formatAmount = (amount) =>
    new Intl.NumberFormat('en-KE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount || 0));

  const formatDate = (date) => {
    if (!date) return '—';

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString(
      'en-KE',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100%',
          p: { xs: 2, md: 3 },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Skeleton
                  width={190}
                  height={36}
                />
                <Skeleton width={260} />
              </Box>

              <Skeleton
                width={140}
                height={42}
                variant="rounded"
              />
            </Stack>

            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
            >
              {[1, 2, 3].map((item) => (
                <Skeleton
                  key={item}
                  variant="rounded"
                  height={100}
                  sx={{ flex: 1 }}
                />
              ))}
            </Stack>

            <Table>
              <TableHead>
                <TableRow>
                  {[
                    'Reference',
                    'Description',
                    'Amount',
                    'Status',
                    'Date',
                  ].map((heading) => (
                    <TableCell key={heading}>
                      <Skeleton width={100} />
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {Array.from({
                  length: 8,
                }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({
                      length: 5,
                    }).map((__, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Stack>
        </Paper>
      </Box>
    );
  }

  /* =========================================================
     MAIN VIEW
  ========================================================= */

  return (
    <Box
      sx={{
        minHeight: '100%',
        p: { xs: 2, md: 3 },
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark'
            ? '#0B1120'
            : '#F8FAFC',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          overflow: 'hidden',
          borderRadius: 2,
          border: '1px solid',
          borderColor: (theme) =>
            alpha(
              theme.palette.divider,
              0.8
            ),
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark'
              ? alpha('#111827', 0.92)
              : '#FFFFFF',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 20px 60px rgba(0,0,0,0.25)'
              : '0 10px 40px rgba(15,23,42,0.06)',
        }}
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <Box
          sx={{
            px: { xs: 2, md: 3 },
            pt: 3,
            pb: 2,
          }}
        >
          <Stack
            direction={{
              xs: 'column',
              md: 'row',
            }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{
              xs: 'stretch',
              md: 'center',
            }}
          >
            <Box>
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    display: 'grid',
                    placeItems: 'center',
                    background:
                      'linear-gradient(135deg, #2563EB, #7C3AED)',
                    color: '#fff',
                    boxShadow:
                      '0 8px 24px rgba(37,99,235,0.25)',
                  }}
                >
                  <ReceiptLongRounded />
                </Box>

                <Box>
                  <Typography
                    variant="h5"
                    fontWeight={800}
                    letterSpacing="-0.02em"
                  >
                    Transactions
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Monitor and manage financial activity
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Tooltip title="Refresh transactions">
              <Box
                component="button"
                onClick={fetchTransactions}
                sx={{
                  border: 0,
                  cursor: 'pointer',
                  borderRadius: 2.5,
                  px: 2,
                  py: 1.2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontWeight: 700,
                  color: 'primary.main',
                  backgroundColor: (theme) =>
                    alpha(
                      theme.palette.primary.main,
                      0.08
                    ),
                  transition:
                    'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: (theme) =>
                      alpha(
                        theme.palette.primary.main,
                        0.14
                      ),
                    transform:
                      'translateY(-1px)',
                  },
                }}
              >
                <SyncRounded
                  sx={{ fontSize: 19 }}
                />
                Refresh
              </Box>
            </Tooltip>
          </Stack>
        </Box>

        {/* =====================================================
            STAT CARDS
        ====================================================== */}

        <Box
          sx={{
            px: { xs: 2, md: 3 },
            pb: 3,
          }}
        >
          <Stack
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            spacing={2}
          >
            {/* Total volume */}
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                background:
                  'linear-gradient(135deg, rgba(37,99,235,0.10), rgba(124,58,237,0.06))',
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={700}
                  >
                    TOTAL VOLUME
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{ mt: 0.5 }}
                  >
                    Ksh{' '}
                    {formatAmount(
                      statistics.total
                    )}
                  </Typography>
                </Box>

                <AccountBalanceWalletOutlined
                  color="primary"
                />
              </Stack>
            </Paper>

            {/* Transaction count */}
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={700}
                  >
                    TRANSACTIONS
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{ mt: 0.5 }}
                  >
                    {statistics.count.toLocaleString()}
                  </Typography>
                </Box>

                <TrendingUpRounded
                  color="primary"
                />
              </Stack>
            </Paper>

            {/* Completed */}
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={700}
                  >
                    COMPLETED
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{ mt: 0.5 }}
                  >
                    {statistics.completed.toLocaleString()}
                  </Typography>
                </Box>

                <CheckCircleOutlineRounded
                  color="success"
                />
              </Stack>
            </Paper>

            {/* Pending */}
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={700}
                  >
                    PENDING
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={800}
                    sx={{ mt: 0.5 }}
                  >
                    {statistics.pending.toLocaleString()}
                  </Typography>
                </Box>

                <HourglassEmptyRounded
                  color="warning"
                />
              </Stack>
            </Paper>
          </Stack>
        </Box>

        <Divider />

        {/* =====================================================
            SEARCH
        ====================================================== */}

        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 2,
          }}
        >
          <TextField
            fullWidth
            value={search}
            onChange={handleSearch}
            placeholder="Search reference, description, amount or status..."
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchRounded
                    sx={{
                      color: 'text.secondary',
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              maxWidth: 520,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2.5,
                backgroundColor:
                  'action.hover',
              },
            }}
          />
        </Box>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <Box px={{ xs: 2, md: 3 }} pb={2}>
            <Alert
              severity="error"
              action={
                <Box
                  component="button"
                  onClick={fetchTransactions}
                  sx={{
                    border: 0,
                    background: 'transparent',
                    cursor: 'pointer',
                    fontWeight: 700,
                    color: 'inherit',
                  }}
                >
                  Retry
                </Box>
              }
            >
              {error}
            </Alert>
          </Box>
        )}

        {/* =====================================================
            TABLE
        ====================================================== */}

        <TableContainer
          sx={{
            width: '100%',
            overflowX: 'auto',
          }}
        >
          <Table
            sx={{
              minWidth: 850,
              '& .MuiTableCell-root': {
                borderColor: 'divider',
              },
            }}
          >
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? alpha('#fff', 0.025)
                      : '#F8FAFC',
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 800,
                    fontSize: 12,
                    color: 'text.secondary',
                    textTransform:
                      'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Reference
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    fontSize: 12,
                    color: 'text.secondary',
                    textTransform:
                      'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Description
                </TableCell>

                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 800,
                    fontSize: 12,
                    color: 'text.secondary',
                    textTransform:
                      'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Amount
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    fontSize: 12,
                    color: 'text.secondary',
                    textTransform:
                      'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Status
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    fontSize: 12,
                    color: 'text.secondary',
                    textTransform:
                      'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Date
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {currentTransactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 8 }}
                  >
                    <Stack
                      alignItems="center"
                      spacing={1}
                    >
                      <ReceiptLongRounded
                        sx={{
                          fontSize: 42,
                          color:
                            'text.disabled',
                        }}
                      />

                      <Typography
                        fontWeight={700}
                      >
                        No transactions found
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Try changing your search
                        criteria.
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              ) : (
                currentTransactions.map(
                  (transaction) => {
                    const status =
                      getStatusConfig(
                        transaction.status
                      );

                    const description =
                      transaction.description ||
                      transaction.transaction_type ||
                      'Transaction';

                    return (
                      <TableRow
                        key={transaction.id}
                        hover
                        sx={{
                          transition:
                            'background-color 0.15s ease',

                          '&:hover': {
                            backgroundColor:
                              'action.hover',
                          },

                          '&:last-child td': {
                            borderBottom: 0,
                          },
                        }}
                      >
                        {/* Reference */}
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            <Box
                              sx={{
                                width: 38,
                                height: 38,
                                borderRadius: 2,
                                display: 'grid',
                                placeItems:
                                  'center',
                                flexShrink: 0,
                                backgroundColor:
                                  (theme) =>
                                    alpha(
                                      theme
                                        .palette
                                        .primary
                                        .main,
                                      0.1
                                    ),
                                color:
                                  'primary.main',
                              }}
                            >
                              <ReceiptLongRounded
                                sx={{
                                  fontSize: 19,
                                }}
                              />
                            </Box>

                            <Box>
                              <Typography
                                variant="body2"
                                fontWeight={750}
                              >
                                {transaction.id ||
                                  transaction.reference ||
                                  '—'}
                              </Typography>

                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Transaction
                              </Typography>
                            </Box>
                          </Stack>
                        </TableCell>

                        {/* Description */}
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                          >
                            {description}
                          </Typography>

                          {transaction.studentId && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Student #
                              {transaction.studentId}
                            </Typography>
                          )}
                        </TableCell>

                        {/* Amount */}
                        <TableCell align="right">
                          <Stack
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            spacing={0.5}
                          >
                            <ArrowUpwardRounded
                              sx={{
                                fontSize: 16,
                                color:
                                  'success.main',
                              }}
                            />

                            <Typography
                              variant="body2"
                              fontWeight={800}
                            >
                              Ksh{' '}
                              {formatAmount(
                                transaction.amount
                              )}
                            </Typography>
                          </Stack>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          <Chip
                            icon={status.icon}
                            label={status.label}
                            color={status.color}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontWeight: 700,
                              borderRadius: 1.5,
                              '& .MuiChip-icon': {
                                ml: 0.7,
                              },
                            }}
                          />
                        </TableCell>

                        {/* Date */}
                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                          >
                            {formatDate(
                              transaction.date
                            )}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  }
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* =====================================================
            FOOTER / PAGINATION
        ====================================================== */}

        <Divider />

        <Stack
          direction={{
            xs: 'column',
            sm: 'row',
          }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{
            xs: 'flex-start',
            sm: 'center',
          }}
          sx={{
            px: { xs: 2, md: 3 },
            py: 2,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Showing{' '}
            <strong>
              {filteredTransactions.length === 0
                ? 0
                : (currentPage - 1) *
                    ITEMS_PER_PAGE +
                  1}
            </strong>{' '}
            –{' '}
            <strong>
              {Math.min(
                currentPage *
                  ITEMS_PER_PAGE,
                filteredTransactions.length
              )}
            </strong>{' '}
            of{' '}
            <strong>
              {filteredTransactions.length.toLocaleString()}
            </strong>{' '}
            transactions
          </Typography>

          <Pagination
            count={pageCount}
            page={Math.min(
              currentPage,
              pageCount
            )}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            size="small"
            siblingCount={1}
            boundaryCount={1}
          />
        </Stack>
      </Paper>
    </Box>
  );
};

export default TransactionList;