import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  LinearProgress,
  Paper,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import {
  AccountBalanceWallet,
  ArrowForward,
  CheckCircle,
  CreditCard,
  Download,
  Event,
  History,
  Payments,
  ReceiptLong,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "@mui/icons-material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  PayPalButtons,
  PayPalScriptProvider,
} from "@paypal/react-paypal-js";
import { getDemoUser } from "../../demoData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DEMO_FINANCIAL_DATA = {
  balance: 650,
  totalPaid: 1350,
  totalDue: 2000,
  nextDue: "2026-10-15",
  invoiceNumber: "INV-2026-00482",
  history: [
    {
      id: 1,
      description: "Tuition payment",
      amount: 500,
      date: "2026-09-02",
      status: "Paid",
      method: "PayPal",
      reference: "PAY-82931",
    },
    {
      id: 2,
      description: "Registration fee",
      amount: 350,
      date: "2026-08-18",
      status: "Paid",
      method: "Card",
      reference: "PAY-81244",
    },
    {
      id: 3,
      description: "Semester tuition",
      amount: 500,
      date: "2026-07-12",
      status: "Paid",
      method: "Bank transfer",
      reference: "PAY-79182",
    },
    {
      id: 4,
      description: "Technology & learning resources",
      amount: 150,
      date: "2026-06-20",
      status: "Paid",
      method: "Card",
      reference: "PAY-76823",
    },
  ],
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const formatDate = (date) => {
  if (!date) return "Not scheduled";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getPaymentStatusColor = (status) => {
  switch (String(status).toLowerCase()) {
    case "paid":
      return "success";

    case "pending":
      return "warning";

    case "failed":
      return "error";

    default:
      return "default";
  }
};

const MetricCard = ({
  label,
  value,
  subtitle,
  icon,
  color = "#5146e5",
}) => (
  <Paper
    elevation={0}
    sx={{
      p: 2.5,
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 4,
      height: "100%",
      transition: "transform .2s ease, box-shadow .2s ease",
      "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: "0 12px 30px rgba(25, 32, 56, .08)",
      },
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar
        variant="rounded"
        sx={{
          width: 48,
          height: 48,
          bgcolor: `${color}15`,
          color,
        }}
      >
        {icon}
      </Avatar>

      <Box sx={{ minWidth: 0 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 600 }}
        >
          {label}
        </Typography>

        <Typography
          variant="h5"
          sx={{
            mt: 0.25,
            fontWeight: 850,
            letterSpacing: "-.03em",
          }}
        >
          {value}
        </Typography>

        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  </Paper>
);

const PaymentSection = ({
  balance,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const amount = Number(balance || 0);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: "100%",
        borderRadius: 4,
        border: "1px solid",
        borderColor: "divider",
        background:
          "linear-gradient(145deg, #5146e5 0%, #3932ae 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: 180,
          height: 180,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,.07)",
          right: -70,
          top: -70,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: "rgba(255,255,255,.14)",
              color: "white",
            }}
          >
            <CreditCard />
          </Avatar>

          <Box>
            <Typography fontWeight={800}>
              Pay your balance
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,.7)" }}
            >
              Secure online payment
            </Typography>
          </Box>
        </Stack>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            mt: 3,
            letterSpacing: "-.04em",
          }}
        >
          {formatCurrency(amount)}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "rgba(255,255,255,.72)",
            mb: 2,
          }}
        >
          Outstanding balance
        </Typography>

        {amount > 0 ? (
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 3,
              p: 1,
              color: "text.primary",
            }}
          >
            <PayPalScriptProvider
              options={{
                "client-id": "sb",
                currency: "USD",
                intent: "capture",
              }}
            >
              <PayPalButtons
                style={{
                  layout: "vertical",
                  shape: "rect",
                  label: "pay",
                  height: 42,
                }}
                createOrder={(data, actions) =>
                  actions.order.create({
                    purchase_units: [
                      {
                        description: "Shiloh College student fees",
                        amount: {
                          currency_code: "USD",
                          value: amount.toFixed(2),
                        },
                      },
                    ],
                  })
                }
                onApprove={(data, actions) =>
                  actions.order
                    .capture()
                    .then((details) =>
                      onPaymentSuccess(details, data)
                    )
                    .catch(onPaymentError)
                }
                onError={onPaymentError}
              />
            </PayPalScriptProvider>
          </Box>
        ) : (
          <Alert severity="success" icon={<CheckCircle />}>
            Your account is fully paid.
          </Alert>
        )}
      </Box>
    </Paper>
  );
};

const FinancialDashboard = () => {
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState("success");

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const userData = JSON.parse(
          localStorage.getItem("userDATA") || "null"
        );

        const legacyUser = JSON.parse(
          localStorage.getItem("user") || "null"
        );

        const demoData = getDemoUser("student");

        const payments = userData?.demo
          ? demoData.payments || DEMO_FINANCIAL_DATA
          : userData?.payments || DEMO_FINANCIAL_DATA;

        const student = userData?.student || {};

        setStudentInfo({
          name:
            userData?.username ||
            legacyUser?.username ||
            student?.name ||
            "Learner",

          studentId:
            student?.student_id ||
            legacyUser?.studentId ||
            "SC-2026-001",

          balance:
            Number(payments?.balance ?? 650),

          totalPaid:
            Number(payments?.totalPaid ?? 1350),

          totalDue:
            Number(payments?.totalDue ?? 2000),

          nextDue:
            payments?.nextDue || "2026-10-15",

          invoiceNumber:
            payments?.invoiceNumber || "INV-2026-00482",

          history:
            payments?.history?.length
              ? payments.history
              : DEMO_FINANCIAL_DATA.history,
        });
      } catch (error) {
        console.error("Unable to load financial information:", error);

        setStudentInfo({
          name: "Learner",
          studentId: "SC-2026-001",
          balance: DEMO_FINANCIAL_DATA.balance,
          totalPaid: DEMO_FINANCIAL_DATA.totalPaid,
          totalDue: DEMO_FINANCIAL_DATA.totalDue,
          nextDue: DEMO_FINANCIAL_DATA.nextDue,
          invoiceNumber: DEMO_FINANCIAL_DATA.invoiceNumber,
          history: DEMO_FINANCIAL_DATA.history,
        });
      } finally {
        setLoading(false);
      }
    }, 650);

    return () => clearTimeout(timer);
  }, []);

  const paymentProgress = useMemo(() => {
    if (!studentInfo?.totalDue) return 0;

    return Math.min(
      100,
      Math.round(
        (studentInfo.totalPaid / studentInfo.totalDue) * 100
      )
    );
  }, [studentInfo]);

  const chartData = useMemo(() => {
    const history = studentInfo?.history || [];

    const sorted = [...history].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    let runningBalance = studentInfo?.totalDue || 0;

    const labels = [];
    const balances = [];

    sorted.forEach((payment) => {
      runningBalance = Math.max(
        0,
        runningBalance - Number(payment.amount || 0)
      );

      labels.push(
        new Date(payment.date).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })
      );

      balances.push(runningBalance);
    });

    if (!labels.length) {
      return {
        labels: ["Current"],
        datasets: [
          {
            label: "Outstanding balance",
            data: [studentInfo?.balance || 0],
          },
        ],
      };
    }

    return {
      labels,
      datasets: [
        {
          label: "Outstanding balance",
          data: balances,
          borderColor: "#5146e5",
          backgroundColor: "rgba(81,70,229,.10)",
          pointBackgroundColor: "#5146e5",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
          pointRadius: 5,
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [studentInfo]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) =>
            ` ${formatCurrency(context.raw)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0,0,0,.05)",
        },
        ticks: {
          callback: (value) => `$${value}`,
        },
      },
    },
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handlePaymentSuccess = (details) => {
    console.log("Payment Success:", details);

    showSnackbar(
      "Payment successful. Your financial record will be updated shortly.",
      "success"
    );

    setStudentInfo((previous) => {
      if (!previous) return previous;

      const paidAmount = Number(previous.balance);

      return {
        ...previous,
        balance: 0,
        totalPaid: previous.totalPaid + paidAmount,
        history: [
          {
            id: `payment-${Date.now()}`,
            description: "Online fee payment",
            amount: paidAmount,
            date: new Date().toISOString(),
            status: "Paid",
            method: "PayPal",
            reference:
              details?.id || `PAY-${Date.now()}`,
          },
          ...previous.history,
        ],
      };
    });
  };

  const handlePaymentError = (error) => {
    console.error("Payment Error:", error);

    showSnackbar(
      "Payment could not be completed. Please try again.",
      "error"
    );
  };

  const handleDownloadStatement = () => {
    window.print();
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 5 }}>
          <Skeleton width={280} height={38} />
          <Skeleton width={420} height={25} sx={{ mb: 4 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 2,
            }}
          >
            {[1, 2, 3, 4].map((item) => (
              <Skeleton
                key={item}
                variant="rounded"
                height={105}
              />
            ))}
          </Box>

          <Skeleton
            variant="rounded"
            height={380}
            sx={{ mt: 3 }}
          />
        </Box>
      </Container>
    );
  }

  if (!studentInfo) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 6 }}>
          <Alert severity="error">
            We couldn't load your financial information.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Box className="financial-dashboard">
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 3, md: 5 } }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: {
                xs: "flex-start",
                md: "center",
              },
              gap: 2,
              mb: 4,
              flexDirection: {
                xs: "column",
                md: "row",
              },
            }}
          >
            <Box>
              <Typography className="eyebrow">
                FINANCIAL OVERVIEW
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  mt: 0.5,
                  fontWeight: 850,
                  letterSpacing: "-.035em",
                }}
              >
                Your student finances
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 0.75 }}
              >
                Stay on top of your fees, payments and upcoming
                deadlines.
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleDownloadStatement}
              className="no-print"
              sx={{
                borderRadius: 3,
                px: 2,
              }}
            >
              Download statement
            </Button>
          </Box>

          {/* Account information */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
              alignItems: "center",
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                variant="rounded"
                sx={{
                  bgcolor: "#eeedff",
                  color: "#5146e5",
                }}
              >
                <Wallet />
              </Avatar>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Student
                </Typography>

                <Typography fontWeight={800}>
                  {studentInfo.name}
                </Typography>
              </Box>
            </Stack>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            />

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Student ID
              </Typography>

              <Typography fontWeight={800}>
                {studentInfo.studentId}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Invoice
              </Typography>

              <Typography fontWeight={800}>
                {studentInfo.invoiceNumber}
              </Typography>
            </Box>
          </Paper>

          {/* Metrics */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 2,
              mb: 3,
            }}
          >
            <MetricCard
              label="Outstanding balance"
              value={formatCurrency(studentInfo.balance)}
              subtitle={
                studentInfo.balance > 0
                  ? "Amount remaining"
                  : "Account settled"
              }
              icon={<AccountBalanceWallet />}
              color="#5146e5"
            />

            <MetricCard
              label="Total paid"
              value={formatCurrency(studentInfo.totalPaid)}
              subtitle={`${paymentProgress}% of fees paid`}
              icon={<TrendingUp />}
              color="#4fbf9f"
            />

            <MetricCard
              label="Total fees"
              value={formatCurrency(studentInfo.totalDue)}
              subtitle="Current academic period"
              icon={<Payments />}
              color="#e7a33e"
            />

            <MetricCard
              label="Next payment"
              value={formatDate(studentInfo.nextDue)}
              subtitle={
                studentInfo.balance > 0
                  ? "Payment deadline"
                  : "No payment required"
              }
              icon={<Event />}
              color="#f26b5e"
            />
          </Box>

          {/* Payment progress */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              justifyContent="space-between"
              gap={2}
              sx={{ mb: 1.5 }}
            >
              <Box>
                <Typography variant="h6" fontWeight={850}>
                  Fee payment progress
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {formatCurrency(studentInfo.totalPaid)} paid of{" "}
                  {formatCurrency(studentInfo.totalDue)}
                </Typography>
              </Box>

              <Typography
                variant="h5"
                fontWeight={900}
                color="primary.main"
              >
                {paymentProgress}%
              </Typography>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={paymentProgress}
              sx={{
                height: 10,
                borderRadius: 10,
                bgcolor: "#eeedff",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 10,
                  background:
                    "linear-gradient(90deg, #5146e5, #4fbf9f)",
                },
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
                Paid
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Remaining: {formatCurrency(studentInfo.balance)}
              </Typography>
            </Stack>
          </Paper>

          {/* Chart + payment */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                lg: "1.55fr 1fr",
              },
              gap: 2,
              mb: 3,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                minHeight: 390,
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                sx={{ mb: 2 }}
              >
                <Box>
                  <Typography variant="h6" fontWeight={850}>
                    Balance trend
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    How your outstanding balance has changed
                  </Typography>
                </Box>

                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: "#eeedff",
                    color: "#5146e5",
                  }}
                >
                  <TrendingDown />
                </Avatar>
              </Stack>

              <Box sx={{ height: 290 }}>
                <Line
                  data={chartData}
                  options={chartOptions}
                />
              </Box>
            </Paper>

            <PaymentSection
              balance={studentInfo.balance}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </Box>

          {/* Payment history */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: "#eeedff",
                    color: "#5146e5",
                  }}
                >
                  <History />
                </Avatar>

                <Box>
                  <Typography variant="h6" fontWeight={850}>
                    Payment history
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Your recent transactions
                  </Typography>
                </Box>
              </Stack>

              <Chip
                label={`${studentInfo.history?.length || 0} transactions`}
                size="small"
              />
            </Box>

            <Divider />

            {studentInfo.history?.length ? (
              <Box>
                {studentInfo.history.map((payment, index) => (
                  <Box
                    key={payment.id || index}
                    sx={{
                      p: 2.5,
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      borderBottom:
                        index !==
                        studentInfo.history.length - 1
                          ? "1px solid"
                          : "none",
                      borderColor: "divider",
                      transition: "background .2s ease",
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <Avatar
                      variant="rounded"
                      sx={{
                        bgcolor: "#eefaf6",
                        color: "#4fbf9f",
                      }}
                    >
                      <ReceiptLong />
                    </Avatar>

                    <Box
                      sx={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <Typography
                        fontWeight={800}
                        noWrap
                      >
                        {payment.description ||
                          "Fee payment"}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {formatDate(payment.date)}
                        {payment.method
                          ? ` · ${payment.method}`
                          : ""}
                      </Typography>

                      {payment.reference && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Ref: {payment.reference}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ textAlign: "right" }}>
                      <Typography fontWeight={850}>
                        {formatCurrency(payment.amount)}
                      </Typography>

                      <Chip
                        size="small"
                        label={payment.status || "Paid"}
                        color={getPaymentStatusColor(
                          payment.status
                        )}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box sx={{ p: 5, textAlign: "center" }}>
                <Avatar
                  sx={{
                    mx: "auto",
                    mb: 2,
                    bgcolor: "#eeedff",
                    color: "#5146e5",
                  }}
                >
                  <History />
                </Avatar>

                <Typography fontWeight={800}>
                  No payment history yet
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Your completed payments will appear here.
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Help / reminder */}
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 3,
              borderRadius: 4,
              bgcolor: "#f8f8ff",
              border: "1px solid #e8e7ff",
            }}
          >
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={2}
              alignItems={{
                xs: "flex-start",
                sm: "center",
              }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  bgcolor: "#5146e5",
                  color: "white",
                }}
              >
                <Payments />
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={850}>
                  Need help with your fees?
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Keep your account up to date to avoid interruptions
                  to your learning experience.
                </Typography>
              </Box>

              <Button
                endIcon={<ArrowForward />}
                variant="outlined"
                onClick={() =>
                  window.alert(
                    "Student finance support will be available here."
                  )
                }
              >
                Finance support
              </Button>
            </Stack>
          </Paper>
        </Box>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          severity={snackbarSeverity}
          variant="filled"
          onClose={() => setOpenSnackbar(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FinancialDashboard;