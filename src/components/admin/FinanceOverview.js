import React from 'react';
import { Container, Box, Paper, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const data = [
    { name: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
    { name: 'Feb', revenue: 3000, expenses: 1398, profit: 1602 },
    { name: 'Mar', revenue: 2000, expenses: 9800, profit: -7800 },
    { name: 'Apr', revenue: 2780, expenses: 3908, profit: -1128 },
    { name: 'May', revenue: 1890, expenses: 4800, profit: -2910 },
    { name: 'Jun', revenue: 2390, expenses: 3800, profit: -1410 },
    { name: 'Jul', revenue: 3490, expenses: 4300, profit: -810 },
];

const chartData = {
    labels: data.map(item => item.name),
    datasets: [
        {
            label: 'Revenue',
            data: data.map(item => item.revenue),
            borderColor: '#8884d8',
            fill: false,
        },
        {
            label: 'Expenses',
            data: data.map(item => item.expenses),
            borderColor: '#82ca9d',
            fill: false,
        },
        {
            label: 'Profit',
            data: data.map(item => item.profit),
            borderColor: '#ff7300',
            fill: false,
        },
    ],
};

const FinanceOverview = () => {
    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Finance Overview
            </Typography>
            <Box display="flex" flexDirection="column" gap={3}>
                <Box>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <Typography variant="h6" gutterBottom>
                            Revenue vs Expenses
                        </Typography>
                        <Line data={{
                            labels: data.map(item => item.name),
                            datasets: [
                                {
                                    label: 'Revenue',
                                    data: data.map(item => item.revenue),
                                    borderColor: '#8884d8',
                                    fill: false,
                                },
                                {
                                    label: 'Expenses',
                                    data: data.map(item => item.expenses),
                                    borderColor: '#82ca9d',
                                    fill: false,
                                },
                            ],
                        }} />
                    </Paper>
                </Box>
                <Box>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <Typography variant="h6" gutterBottom>
                            Profit
                        </Typography>
                        <Line data={{
                            labels: data.map(item => item.name),
                            datasets: [
                                {
                                    label: 'Profit',
                                    data: data.map(item => item.profit),
                                    borderColor: '#ff7300',
                                    fill: false,
                                },
                            ],
                        }} />
                    </Paper>
                </Box>
                <Box>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <Typography variant="h6" gutterBottom>
                            Predictions
                        </Typography>
                        <Line data={chartData} />
                    </Paper>
                </Box>
                <Box>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <Typography variant="h6" gutterBottom>
                            Losses
                        </Typography>
                        <Line data={{
                            labels: data.map(item => item.name),
                            datasets: [
                                {
                                    label: 'Expenses',
                                    data: data.map(item => item.expenses),
                                    borderColor: '#ff0000',
                                    fill: false,
                                },
                            ],
                        }} />
                    </Paper>
                </Box>
                <Box>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        <Typography variant="h6" gutterBottom>
                            Financial Overview
                        </Typography>
                        <Line data={chartData} />
                    </Paper>
                </Box>
            </Box>
        </Container>
    );
};

export default FinanceOverview;