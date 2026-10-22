
import type { ReactNode } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import BuildOutlinedIcon from "@mui/icons-material/BuildOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link as RouterLink } from "react-router-dom";
import { useVehicles } from "./useVehicles";

const colors = {
  navy: "#20344D",
  blue: "#315A7D",
  background: "#F4F6F8",
  border: "#DCE2E8",
};

function parseServiceDate(value: string): Date | null {
  const text = value.trim();

  if (!text || text.toLowerCase() === "не указано") {
    return null;
  }

  // Поддерживаем формат ДД.ММ.ГГГГ.
  const ruDate = text.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);

  let date: Date;

  if (ruDate) {
    date = new Date(
      Number(ruDate[3]),
      Number(ruDate[2]) - 1,
      Number(ruDate[1]),
    );

    // Не допускаем автоматического преобразования неверных дат.
    if (
      date.getFullYear() !== Number(ruDate[3]) ||
      date.getMonth() !== Number(ruDate[2]) - 1 ||
      date.getDate() !== Number(ruDate[1])
    ) {
      return null;
    }
  } else {
    date = new Date(text);
  }

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setHours(0, 0, 0, 0);
  return date;
}

function MetricCard({
  title,
  value,
  description,
  icon,
  accent = colors.blue,
}: {
  title: string;
  value: number | string;
  description: string;
  icon: ReactNode;
  accent?: string;
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: "100%",
        borderColor: colors.border,
        borderRadius: 2,
        boxShadow: "0 1px 2px rgba(16,24,40,0.03)",
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={2}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>

            <Typography
              variant="h4"
              sx={{ fontWeight: 700, mt: 1, color: colors.navy }}
            >
              {value}
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 1 }}
            >
              {description}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 42,
              height: 42,
              display: "grid",
              placeItems: "center",
              borderRadius: 2,
              bgcolor: `${accent}14`,
              color: accent,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { vehicles } = useVehicles();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inRepair = vehicles.filter((vehicle) => {
    const status = vehicle.status.toLowerCase();

    return (
      status.includes("ремонт") ||
      status.includes("обслужив") ||
      status.includes("repair") ||
      status.includes("maintenance")
    );
  }).length;

  const available = vehicles.filter((vehicle) => {
    const status = vehicle.status.toLowerCase();

    return (
      status.includes("эксплуатац") ||
      status.includes("работ") ||
      status.includes("свободен") ||
      status.includes("active") ||
      status.includes("available")
    );
  }).length;

  const vehiclesWithServiceDate = vehicles
    .map((vehicle) => ({
      vehicle,
      serviceDate: parseServiceDate(vehicle.nextService),
    }))
    .filter(
      (
        item,
      ): item is {
        vehicle: (typeof vehicles)[number];
        serviceDate: Date;
      } => item.serviceDate !== null,
    );

  const upcomingService = vehiclesWithServiceDate.filter(({ serviceDate }) => {
    const days =
      (serviceDate.getTime() - today.getTime()) / 86400000;

    return days >= 0 && days <= 30;
  });

  const overdueService = vehiclesWithServiceDate.filter(
    ({ serviceDate }) => serviceDate.getTime() < today.getTime(),
  );

  const attentionVehicles = vehiclesWithServiceDate
    .filter(({ serviceDate }) => {
      const days =
        (serviceDate.getTime() - today.getTime()) / 86400000;

      return days <= 30;
    })
    .sort(
      (a, b) => a.serviceDate.getTime() - b.serviceDate.getTime(),
    );

  const vehiclesWithoutServiceDate = vehicles.filter(
    (vehicle) => parseServiceDate(vehicle.nextService) === null,
  ).length;

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        bgcolor: colors.background,
        minHeight: "100%",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: colors.navy }}
          >
            Панель управления
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Сводная информация по автопарку
          </Typography>
        </Box>

        <Chip
          icon={<DirectionsCarOutlinedIcon />}
          label="Демонстрационные данные"
          variant="outlined"
          sx={{ bgcolor: "#fff", borderColor: colors.border }}
        />
      </Stack>

      {/* Основные показатели */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <MetricCard
          title="Всего автомобилей"
          value={vehicles.length}
          description="Все записи в каталоге"
          icon={<DirectionsCarOutlinedIcon />}
        />

        <MetricCard
          title="Доступны / в эксплуатации"
          value={available}
          description="Свободные и используемые автомобили"
          icon={<DirectionsCarOutlinedIcon />}
          accent="#27815B"
        />

        <MetricCard
          title="На ремонте / обслуживании"
          value={inRepair}
          description="Требуют отдельного контроля"
          icon={<BuildOutlinedIcon />}
          accent="#B54736"
        />

        <MetricCard
          title="ТО в ближайшие 30 дней"
          value={upcomingService.length}
          description="По дате следующего ТО"
          icon={<EventBusyOutlinedIcon />}
          accent="#A66A13"
        />
      </Box>

      {/* Таблица обслуживания и боковая панель */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "minmax(0, 2fr) minmax(280px, 1fr)",
          },
          gap: 2,
          alignItems: "start",
        }}
      >
        <Card
          variant="outlined"
          sx={{
            borderColor: colors.border,
            borderRadius: 2,
            minWidth: 0,
          }}
        >
          <Box sx={{ p: 2.5 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: colors.navy }}
                >
                  Требуют внимания
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Просроченное и предстоящее техническое обслуживание
                </Typography>
              </Box>

              <Chip label={attentionVehicles.length} size="small" />
            </Stack>
          </Box>

          <Divider />

          {attentionVehicles.length === 0 ? (
            <Box sx={{ p: 3 }}>
              <Alert severity="success">
                Нет автомобилей с просроченным ТО или ТО в ближайшие 30 дней.
              </Alert>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Автомобиль</TableCell>
                    <TableCell>Госномер</TableCell>
                    <TableCell>Дата ТО</TableCell>
                    <TableCell>Состояние</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {attentionVehicles.map(({ vehicle, serviceDate }) => {
                    const isOverdue =
                      serviceDate.getTime() < today.getTime();

                    return (
                      <TableRow key={vehicle.id} hover>
                        <TableCell>
                          <Typography
                            component={RouterLink}
                            to={`/vehicles/${vehicle.id}`}
                            sx={{
                              color: colors.blue,
                              fontWeight: 600,
                              textDecoration: "none",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            {vehicle.brand} {vehicle.model}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            {vehicle.department || "Подразделение не указано"}
                          </Typography>
                        </TableCell>

                        <TableCell>{vehicle.plate || "—"}</TableCell>

                        <TableCell>
                          {serviceDate.toLocaleDateString("ru-RU")}
                        </TableCell>

                        <TableCell>
                          <Chip
                            size="small"
                            label={isOverdue ? "Просрочено" : "Скоро"}
                            color={isOverdue ? "error" : "warning"}
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>

        <Stack spacing={2}>
          <Card
            variant="outlined"
            sx={{ borderColor: colors.border, borderRadius: 2 }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: colors.navy }}
              >
                Контроль автопарка
              </Typography>

              <Stack spacing={2} sx={{ mt: 2 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2" color="text.secondary">
                    Просроченное ТО
                  </Typography>

                  <Chip
                    size="small"
                    color={overdueService.length ? "error" : "success"}
                    label={overdueService.length}
                  />
                </Stack>

                <Divider />

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2" color="text.secondary">
                    ТО в ближайшие 30 дней
                  </Typography>

                  <Chip
                    size="small"
                    color="warning"
                    label={upcomingService.length}
                  />
                </Stack>

                <Divider />

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body2" color="text.secondary">
                    Без даты следующего ТО
                  </Typography>

                  <Chip
                    size="small"
                    label={vehiclesWithoutServiceDate}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card
            variant="outlined"
            sx={{ borderColor: colors.border, borderRadius: 2 }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, color: colors.navy }}
              >
                Быстрый переход
              </Typography>

              <Stack spacing={1} sx={{ mt: 1.5 }}>
                <Box
                  component={RouterLink}
                  to="/"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 1,
                    color: colors.blue,
                    textDecoration: "none",
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    Каталог автомобилей
                  </Typography>

                  <ArrowForwardIcon fontSize="small" />
                </Box>

                <Divider />

                <Box
                  component={RouterLink}
                  to="/history"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 1,
                    color: colors.blue,
                    textDecoration: "none",
                  }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    История изменений
                  </Typography>

                  <ArrowForwardIcon fontSize="small" />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
}
