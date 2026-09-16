import React, { useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
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
  alpha,
  useTheme,
} from "@mui/material";

import {
  AccountBalanceRounded,
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  CheckCircleRounded,
  CloseRounded,
  DownloadRounded,
  FilterListRounded,
  PaymentsRounded,
  SearchRounded,
  ShowChartRounded,
  TrendingDownRounded,
  TrendingUpRounded,
  WarningAmberRounded,
} from "@mui/icons-material";

import { Line } from "react-chartjs-2";
import "chart.js/auto";

import { getDemoUser } from "../../demoData";

const FinanceOverview = () => {
  const theme = useTheme();

  const [period, setPeriod] = useState("This year");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showAllTransactions, setShowAllTransactions] =
    useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState(null);
  const [transactionDialog, setTransactionDialog] =
    useState(false);

  const [loading] = useState(false);

  /*
   * Demo transactions
   */
  const transactions = useMemo(() => {
    try {
      const storedData = JSON.parse(
        localStorage.getItem("userDATA") || "null"
      );

      if (storedData?.demo) {
        return getDemoUser("admin")?.transactions || [];
      }

      return [];
    } catch (error) {
      console.error("Unable to load transactions:", error);
      return [];
    }
  }, []);

  /*
   * Financial chart data
   *
   * This can later be replaced with API-generated
   * monthly financial data.
   */
  const monthlyData = useMemo(
    () => [
      {
        name: "Jan",
        revenue: 4000,
        expenses: 2400,
      },
      {
        name: "Feb",
        revenue: 5200,
        expenses: 2800,
      },
      {
        name: "Mar",
        revenue: 6200,
        expenses: 3100,
      },
      {
        name: "Apr",
        revenue: 5800,
        expenses: 3400,
      },
      {
        name: "May",
        revenue: 7100,
        expenses: 3800,
      },
      {
        name: "Jun",
        revenue: 7600,
        expenses: 4100,
      },
      {
        name: "Jul",
        revenue: 8400,
        expenses: 4300,
      },
      {
        name: "Aug",
        revenue: 9100,
        expenses: 4600,
      },
      {
        name: "Sep",
        revenue: 9800,
        expenses: 4900,
      },
    ],
    []
  );

  /*
   * Filter transactions
   */
  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesStatus =
        statusFilter === "All" ||
        transaction.status === statusFilter;

      const matchesSearch =
        !query ||
        String(transaction.id)
          .toLowerCase()
          .includes(query) ||
        String(transaction.description)
          .toLowerCase()
          .includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [transactions, search, statusFilter]);

  const visibleTransactions = showAllTransactions
    ? filteredTransactions
    : filteredTransactions.slice(0, 5);

  /*
   * Financial calculations
   */
  const revenue = useMemo(
    () =>
      monthlyData.reduce(
        (sum, month) => sum + month.revenue,
        0
      ),
    [monthlyData]
  );

  const expenses = useMemo(
    () =>
      monthlyData.reduce(
        (sum, month) => sum + month.expenses,
        0
      ),
    [monthlyData]
  );

  const profit = revenue - expenses;

  const collectionRate = 86.4;

  const completedTransactions = transactions.filter(
    (transaction) =>
      transaction.status === "Completed"
  ).length;

  const pendingTransactions = transactions.filter(
    (transaction) =>
      transaction.status === "Pending"
  ).length;

  const processingTransactions = transactions.filter(
    (transaction) =>
      transaction.status === "Processing"
  ).length;

  /*
   * Currency formatter
   */
  const formatCurrency = (amount) => {
    return `$${Number(amount || 0).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  /*
   * CSV export
   */
  const exportTransactions = () => {
    const rows = [
      [
        "Reference",
        "Description",
        "Status",
        "Amount",
        "Date",
      ],
      ...filteredTransactions.map((transaction) => [
        transaction.id,
        transaction.description,
        transaction.status,
        transaction.amount,
        transaction.date,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value ?? "").replaceAll(
                '"',
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `shiloh-finance-${period
      .toLowerCase()
      .replaceAll(" ", "-")}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /*
   * Chart
   */
  const chartData = {
    labels: monthlyData.map(
      (item) => item.name
    ),

    datasets: [
      {
        label: "Revenue",
        data: monthlyData.map(
          (item) => item.revenue
        ),
        borderColor: theme.palette.primary.main,
        backgroundColor: alpha(
          theme.palette.primary.main,
          0.1
        ),
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        borderWidth: 3,
      },
      {
        label: "Expenses",
        data: monthlyData.map(
          (item) => item.expenses
        ),
        borderColor: theme.palette.error.main,
        backgroundColor: alpha(
          theme.palette.error.main,
          0.04
        ),
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6,
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    interaction: {
      mode: "index",
      intersect: false,
    },

    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },

      tooltip: {
        padding: 12,
        callbacks: {
          label: (context) =>
            `${context.dataset.label}: ${formatCurrency(
              context.raw
            )}`,
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,

        grid: {
          color: alpha(
            theme.palette.text.primary,
            0.06
          ),
        },

        ticks: {
          callback: (value) =>
            `$${Number(value) / 1000}k`,
        },
      },

      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const metrics = [
    {
      label: "Total revenue",
      value: formatCurrency(revenue),
      change: "+14.8%",
      icon: <ArrowUpwardRounded />,
      tone: theme.palette.primary.main,
      positive: true,
    },
    {
      label: "Operating expenses",
      value: formatCurrency(expenses),
      change: "+6.2%",
      icon: <ArrowDownwardRounded />,
      tone: theme.palette.error.main,
      positive: false,
    },
    {
      label: "Net position",
      value: formatCurrency(profit),
      change: profit >= 0 ? "Positive" : "Review",
      icon: <AccountBalanceRounded />,
      tone: theme.palette.success.main,
      positive: profit >= 0,
    },
    {
      label: "Collection rate",
      value: `${collectionRate}%`,
      change: "On target",
      icon: <PaymentsRounded />,
      tone: theme.palette.warning.main,
      positive: true,
    },
  ];

  const openTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setTransactionDialog(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100%",
        py: { xs: 2, md: 4 },

        background: `linear-gradient(
          135deg,
          ${alpha(
            theme.palette.primary.main,
            0.035
          )},
          transparent 45%,
          ${alpha(
            theme.palette.secondary.main,
            0.035
          )}
        )`,
      }}
    >
      <Container maxWidth="xl">
        {/* ================= HEADER ================= */}

        <Stack
          direction={{
            xs: "column",
            lg: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            lg: "center",
          }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography
              variant="overline"
              sx={{
                fontWeight: 800,
                letterSpacing: "0.14em",
                color: "primary.main",
              }}
            >
              FINANCE CONTROL CENTER
            </Typography>

            <Typography
              variant="h4"
              fontWeight={850}
              sx={{
                mt: 0.4,
                letterSpacing: "-0.035em",
                fontSize: {
                  xs: "1.8rem",
                  md: "2.35rem",
                },
              }}
            >
              Financial Overview
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                mt: 0.8,
                maxWidth: 650,
              }}
            >
              Monitor revenue, expenses, collections and
              payment activity from one financial
              workspace.
            </Typography>
          </Box>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1}
            width={{
              xs: "100%",
              sm: "auto",
            }}
          >
            <Select
              size="small"
              value={period}
              onChange={(event) =>
                setPeriod(event.target.value)
              }
              sx={{
                minWidth: 145,
                borderRadius: 2,
              }}
            >
              <MenuItem value="This month">
                This month
              </MenuItem>

              <MenuItem value="This quarter">
                This quarter
              </MenuItem>

              <MenuItem value="This year">
                This year
              </MenuItem>
            </Select>

            <Button
              variant="contained"
              startIcon={<DownloadRounded />}
              onClick={exportTransactions}
              sx={{
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 700,
                minHeight: 40,
              }}
            >
              Export CSV
            </Button>
          </Stack>
        </Stack>

        {/* ================= METRICS ================= */}

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {metrics.map((metric) => (
            <Grid
              item
              xs={12}
              sm={6}
              lg={3}
              key={metric.label}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 2.2,
                  height: "100%",
                  borderRadius: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  background: alpha(
                    theme.palette.background.paper,
                    0.82
                  ),
                  backdropFilter: "blur(12px)",
                  transition:
                    "transform 180ms ease, box-shadow 180ms ease",

                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: `0 14px 35px ${alpha(
                      metric.tone,
                      0.1
                    )}`,
                  },
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: alpha(
                        metric.tone,
                        0.12
                      ),
                      color: metric.tone,
                    }}
                  >
                    {metric.icon}
                  </Avatar>

                  <Box sx={{ minWidth: 0 }}>
                    {loading ? (
                      <Skeleton width={100} />
                    ) : (
                      <Typography
                        variant="h5"
                        fontWeight={850}
                      >
                        {metric.value}
                      </Typography>
                    )}

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                    >
                      {metric.label}
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        color: metric.positive
                          ? "success.main"
                          : "warning.main",
                        fontWeight: 700,
                      }}
                    >
                      {metric.change}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* ================= MAIN CONTENT ================= */}

        <Grid container spacing={3}>
          {/* CHART */}

          <Grid item xs={12} lg={8}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                background: alpha(
                  theme.palette.background.paper,
                  0.85
                ),
                height: "100%",
              }}
            >
              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                justifyContent="space-between"
                alignItems={{
                  xs: "flex-start",
                  sm: "center",
                }}
                spacing={1}
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                  >
                    Revenue & Expenses
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Monthly financial performance
                  </Typography>
                </Box>

                <Chip
                  icon={<ShowChartRounded />}
                  label="Financial trend"
                  color="primary"
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 700 }}
                />
              </Stack>

              <Box
                sx={{
                  height: {
                    xs: 320,
                    md: 390,
                  },
                }}
              >
                <Line
                  data={chartData}
                  options={chartOptions}
                />
              </Box>
            </Paper>
          </Grid>

          {/* BUDGET */}

          <Grid item xs={12} lg={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                height: "100%",
                background: alpha(
                  theme.palette.background.paper,
                  0.85
                ),
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                  >
                    Budget Health
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Monthly collection target
                  </Typography>
                </Box>

                <Avatar
                  sx={{
                    bgcolor: alpha(
                      theme.palette.warning.main,
                      0.12
                    ),
                    color: "warning.main",
                  }}
                >
                  <WarningAmberRounded />
                </Avatar>
              </Stack>

              <Box sx={{ mt: 4 }}>
                <Stack
                  direction="row"
                  alignItems="baseline"
                  spacing={1}
                >
                  <Typography
                    variant="h2"
                    fontWeight={850}
                    sx={{
                      letterSpacing: "-0.05em",
                    }}
                  >
                    72%
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    collected
                  </Typography>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={72}
                  color="secondary"
                  sx={{
                    height: 11,
                    borderRadius: 10,
                    mt: 2,
                  }}
                />

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mt: 1 }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    $18,000 collected
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    $25,000 target
                  </Typography>
                </Stack>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Stack spacing={2}>
                <BudgetCategory
                  label="Tuition"
                  percentage={68}
                  color={theme.palette.primary.main}
                />

                <BudgetCategory
                  label="Student services"
                  percentage={20}
                  color={theme.palette.secondary.main}
                />

                <BudgetCategory
                  label="Other"
                  percentage={12}
                  color={theme.palette.warning.main}
                />
              </Stack>

              <Alert
                severity="warning"
                sx={{
                  mt: 3,
                  borderRadius: 2,
                }}
              >
                Collection is below the 80% monthly
                target.
              </Alert>
            </Paper>
          </Grid>
        </Grid>

        {/* ================= TRANSACTION PANEL ================= */}

        <Paper
          elevation={0}
          sx={{
            mt: 3,
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            overflow: "hidden",
            background: alpha(
              theme.palette.background.paper,
              0.88
            ),
          }}
        >
          {/* TRANSACTION HEADER */}

          <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Stack
              direction={{
                xs: "column",
                lg: "row",
              }}
              justifyContent="space-between"
              alignItems={{
                xs: "flex-start",
                lg: "center",
              }}
              spacing={2}
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={800}
                >
                  Recent Transactions
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Review and monitor recent payment
                  activity.
                </Typography>
              </Box>

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                spacing={1}
                width={{
                  xs: "100%",
                  lg: "auto",
                }}
              >
                <TextField
                  size="small"
                  placeholder="Search transactions..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  sx={{
                    minWidth: {
                      sm: 230,
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRounded
                          fontSize="small"
                        />
                      </InputAdornment>
                    ),
                  }}
                />

                <Select
                  size="small"
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                  startAdornment={
                    <FilterListRounded
                      fontSize="small"
                      sx={{ mr: 1 }}
                    />
                  }
                  sx={{
                    minWidth: 135,
                  }}
                >
                  <MenuItem value="All">
                    All statuses
                  </MenuItem>

                  <MenuItem value="Completed">
                    Completed
                  </MenuItem>

                  <MenuItem value="Pending">
                    Pending
                  </MenuItem>

                  <MenuItem value="Processing">
                    Processing
                  </MenuItem>
                </Select>
              </Stack>
            </Stack>
          </Box>

          {/* TRANSACTION STATUS SUMMARY */}

          <Box
            sx={{
              px: { xs: 2, md: 3 },
              pb: 2,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              useFlexGap
            >
              <Chip
                size="small"
                icon={<CheckCircleRounded />}
                label={`${completedTransactions} completed`}
                color="success"
                variant="outlined"
              />

              <Chip
                size="small"
                icon={<WarningAmberRounded />}
                label={`${pendingTransactions} pending`}
                color="warning"
                variant="outlined"
              />

              <Chip
                size="small"
                label={`${processingTransactions} processing`}
                color="info"
                variant="outlined"
              />
            </Stack>
          </Box>

          <Divider />

          {/* DESKTOP TABLE */}

          <TableContainer
            sx={{
              display: {
                xs: "none",
                md: "block",
              },
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography fontWeight={750}>
                      Reference
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight={750}>
                      Description
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight={750}>
                      Status
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Typography fontWeight={750}>
                      Amount
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight={750}>
                      Date
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Typography fontWeight={750}>
                      Action
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      {[1, 2, 3, 4, 5, 6].map(
                        (cell) => (
                          <TableCell key={cell}>
                            <Skeleton />
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  ))
                ) : visibleTransactions.length ? (
                  visibleTransactions.map(
                    (transaction) => (
                      <TableRow
                        key={transaction.id}
                        hover
                        sx={{
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          openTransaction(
                            transaction
                          )
                        }
                      >
                        <TableCell>
                          <Typography
                            fontWeight={800}
                          >
                            {transaction.id}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography>
                            {
                              transaction.description
                            }
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <StatusChip
                            status={
                              transaction.status
                            }
                          />
                        </TableCell>

                        <TableCell align="right">
                          <Typography
                            fontWeight={800}
                          >
                            {formatCurrency(
                              transaction.amount
                            )}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {transaction.date}
                          </Typography>
                        </TableCell>

                        <TableCell align="right">
                          <Button
                            size="small"
                            onClick={(event) => {
                              event.stopPropagation();
                              openTransaction(
                                transaction
                              );
                            }}
                            sx={{
                              textTransform:
                                "none",
                              fontWeight: 700,
                            }}
                          >
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  )
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ py: 8 }}
                    >
                      <Typography
                        fontWeight={700}
                      >
                        No transactions found
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        Try changing your search or
                        status filter.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* MOBILE TRANSACTIONS */}

          <Box
            sx={{
              display: {
                xs: "block",
                md: "none",
              },
              p: 1.5,
            }}
          >
            {visibleTransactions.map(
              (transaction) => (
                <Paper
                  key={transaction.id}
                  elevation={0}
                  onClick={() =>
                    openTransaction(transaction)
                  }
                  sx={{
                    p: 2,
                    mb: 1.2,
                    borderRadius: 2.5,
                    border: `1px solid ${theme.palette.divider}`,
                    cursor: "pointer",
                  }}
                >
                  <Stack spacing={1.2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography
                        fontWeight={800}
                      >
                        {transaction.id}
                      </Typography>

                      <StatusChip
                        status={
                          transaction.status
                        }
                      />
                    </Stack>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {transaction.description}
                    </Typography>

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography
                        fontWeight={800}
                      >
                        {formatCurrency(
                          transaction.amount
                        )}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {transaction.date}
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              )
            )}
          </Box>

          {/* VIEW ALL */}

          {filteredTransactions.length > 5 && (
            <Box
              sx={{
                p: 2,
                borderTop: `1px solid ${theme.palette.divider}`,
                textAlign: "center",
              }}
            >
              <Button
                onClick={() =>
                  setShowAllTransactions(
                    (previous) => !previous
                  )
                }
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                {showAllTransactions
                  ? "Show less"
                  : `View all ${filteredTransactions.length} transactions`}
              </Button>
            </Box>
          )}
        </Paper>

        {/* ================= INSIGHTS ================= */}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <InsightCard
              icon={<TrendingUpRounded />}
              title="Revenue is trending upward"
              description="Monthly revenue has increased consistently across the latest reporting period."
              color={theme.palette.success.main}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <InsightCard
              icon={<TrendingDownRounded />}
              title="Collections need attention"
              description="The current collection rate is below the preferred monthly target."
              color={theme.palette.warning.main}
            />
          </Grid>
        </Grid>
      </Container>

      {/* ================= TRANSACTION DIALOG ================= */}

      <Dialog
        open={transactionDialog}
        onClose={() =>
          setTransactionDialog(false)
        }
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h6"
                fontWeight={800}
              >
                Transaction Details
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Full payment information
              </Typography>
            </Box>

            <IconButton
              onClick={() =>
                setTransactionDialog(false)
              }
            >
              <CloseRounded />
            </IconButton>
          </Stack>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ py: 3 }}>
          {selectedTransaction && (
            <Stack spacing={2}>
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2.5,
                  background: alpha(
                    theme.palette.primary.main,
                    0.06
                  ),
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Transaction amount
                </Typography>

                <Typography
                  variant="h3"
                  fontWeight={850}
                  sx={{ mt: 0.4 }}
                >
                  {formatCurrency(
                    selectedTransaction.amount
                  )}
                </Typography>
              </Box>

              <DetailRow
                label="Reference"
                value={
                  selectedTransaction.id
                }
              />

              <DetailRow
                label="Description"
                value={
                  selectedTransaction.description
                }
              />

              <DetailRow
                label="Status"
                value={
                  <StatusChip
                    status={
                      selectedTransaction.status
                    }
                  />
                }
              />

              <DetailRow
                label="Date"
                value={
                  selectedTransaction.date
                }
              />
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() =>
              setTransactionDialog(false)
            }
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

/* =========================================================
   STATUS CHIP
========================================================= */

const StatusChip = ({ status }) => {
  const config = {
    Completed: {
      color: "success",
      icon: <CheckCircleRounded />,
    },

    Pending: {
      color: "warning",
      icon: <WarningAmberRounded />,
    },

    Processing: {
      color: "info",
      icon: <PaymentsRounded />,
    },
  };

  const current = config[status] || {
    color: "default",
    icon: null,
  };

  return (
    <Chip
      size="small"
      color={current.color}
      icon={current.icon}
      label={status}
      sx={{
        fontWeight: 700,
        borderRadius: 1.5,
      }}
    />
  );
};

/* =========================================================
   BUDGET CATEGORY
========================================================= */

const BudgetCategory = ({
  label,
  percentage,
  color,
}) => {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
    >
      <Box
        sx={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: color,
          flexShrink: 0,
        }}
      />

      <Typography
        variant="body2"
        sx={{ flex: 1 }}
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        fontWeight={800}
      >
        {percentage}%
      </Typography>
    </Stack>
  );
};

/* =========================================================
   DETAIL ROW
========================================================= */

const DetailRow = ({ label, value }) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      <Typography
        variant="body2"
        color="text.secondary"
      >
        {label}
      </Typography>

      <Box sx={{ textAlign: "right" }}>
        {typeof value === "string" ? (
          <Typography
            variant="body2"
            fontWeight={700}
          >
            {value}
          </Typography>
        ) : (
          value
        )}
      </Box>
    </Stack>
  );
};

/* =========================================================
   INSIGHT CARD
========================================================= */

const InsightCard = ({
  icon,
  title,
  description,
  color,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2.5,
        border: (theme) =>
          `1px solid ${theme.palette.divider}`,
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
      >
        <Avatar
          variant="rounded"
          sx={{
            bgcolor: alpha(color, 0.12),
            color,
          }}
        >
          {icon}
        </Avatar>

        <Box>
          <Typography
            fontWeight={750}
          >
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.4 }}
          >
            {description}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default FinanceOverview;