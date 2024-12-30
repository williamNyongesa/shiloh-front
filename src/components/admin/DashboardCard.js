import React from "react";
import { Card, CardContent, Box, Typography } from "@mui/material";

const icons = {
  attach_money: "AttachMoney",
  money_off: "MoneyOff",
  account_balance_wallet: "AccountBalanceWalletIcon",
};

const DashboardCard = ({ title, value, color, icon }) => {
  return (
    <Card sx={{ display: 'flex', justifyContent: 'space-between', padding: 3, borderRadius: 2, boxShadow: 3, backgroundColor: `${color}.main` }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ backgroundColor: 'white', color: 'black', paddingX: 2, textAlign: 'center', borderRadius: 1 }}>
          {title}
        </Typography>
      </CardContent>
      
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: 40 }}>
        <span className="material-icons">{icons[icon]}</span>
      </Box>
    </Card>
  );
};

export default DashboardCard;
