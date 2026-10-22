
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import HistoryIcon from "@mui/icons-material/History";
import { useNavigate, useParams } from "react-router-dom";
import { useVehicles } from "./useVehicles";

const statusColor = (status: string) => {
  if (status === "В эксплуатации") return "success";
  if (status === "Свободен") return "info";
  return "warning";
};

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { vehicles } = useVehicles();
  const [tab, setTab] = useState(0);

  const vehicle = vehicles.find((item) => item.id === id);

  if (!vehicle) {
    return (
      <Box p={4}>
        <Alert severity="warning">Автомобиль не найден.</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate("/")}>
          Вернуться в каталог
        </Button>
      </Box>
    );
  }

  const Info = ({ label, value }: { label: string; value: string | number }) => (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography fontWeight={600} sx={{ overflowWrap: "anywhere" }}>
        {value}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        sx={{ mb: 3, textTransform: "none" }}
      >
        Назад в каталог
      </Button>

      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 3 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2,
                bgcolor: "action.hover",
                display: "grid",
                placeItems: "center",
              }}
            >
              <DirectionsCarIcon sx={{ fontSize: 36, color: "primary.main" }} />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={750}>
                {vehicle.brand} {vehicle.model}
              </Typography>
              <Typography color="text.secondary">
                {vehicle.year} год · {vehicle.plate}
              </Typography>
            </Box>
          </Stack>
          <Chip
            label={vehicle.status}
            color={statusColor(vehicle.status) as "success" | "info" | "warning"}
          />
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Tabs
          value={tab}
          onChange={(_, value: number) => setTab(value)}
          variant="scrollable"
          sx={{ mb: 3 }}
        >
          <Tab label="Обзор" />
          <Tab icon={<DescriptionOutlinedIcon />} iconPosition="start" label="Документы" />
          <Tab icon={<HistoryIcon />} iconPosition="start" label="История" />
        </Tabs>

        {tab === 0 && (
          <Stack spacing={3}>
            <Typography variant="h6" fontWeight={700}>
              Основная информация
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, minmax(0, 1fr))",
                  lg: "repeat(3, minmax(0, 1fr))",
                },
                gap: 3,
              }}
            >
              <Info label="Марка" value={vehicle.brand} />
              <Info label="Модель" value={vehicle.model} />
              <Info label="Год выпуска" value={vehicle.year} />
              <Info label="Госномер (демо)" value={vehicle.plate} />
              <Info label="VIN (демо)" value={vehicle.vin} />
              <Info label="Пробег" value={`${vehicle.mileage.toLocaleString("ru-RU")} км`} />
              <Info label="Подразделение" value={vehicle.department} />
              <Info label="Ответственный" value={vehicle.owner} />
              <Info label="Следующее ТО" value={vehicle.nextService} />
              <Info label="Топливо" value={vehicle.fuel} />
              <Info label="Коробка передач" value={vehicle.transmission} />
              <Info label="Цвет" value={vehicle.color} />
            </Box>
            <Alert severity="info">
              Данные демонстрационные. Редактирование и загрузка документов пока не подключены.
            </Alert>
          </Stack>
        )}

        {tab === 1 && (
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={700}>
              Документы автомобиля
            </Typography>
            {vehicle.documents.map((doc) => (
              <Paper
                key={doc.number}
                variant="outlined"
                sx={{ p: 2, borderRadius: 2 }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="space-between"
                  spacing={1}
                >
                  <Box>
                    <Typography fontWeight={650}>{doc.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Номер: {doc.number}
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    Действует до: {doc.expires}
                  </Typography>
                </Stack>
              </Paper>
            ))}
            <Alert severity="info">
              В этой версии отображаются только тестовые записи, файлы документов не хранятся.
            </Alert>
          </Stack>
        )}

        {tab === 2 && (
          <Stack spacing={0}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
              История обслуживания
            </Typography>
            {vehicle.history.map((event, index) => (
              <Box key={`${event.date}-${event.title}`}>
                <Stack direction="row" spacing={2} sx={{ py: 2 }}>
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      flexShrink: 0,
                      borderRadius: "50%",
                      bgcolor: "action.hover",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <HistoryIcon color="action" />
                  </Box>
                  <Box>
                    <Typography fontWeight={650}>{event.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.date}
                    </Typography>
                    <Typography sx={{ mt: 0.5 }}>{event.description}</Typography>
                  </Box>
                </Stack>
                {index < vehicle.history.length - 1 && <Divider />}
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
