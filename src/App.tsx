
import { useState, type FormEvent } from "react";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import HistoryIcon from "@mui/icons-material/History";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import type { Vehicle } from "./vehicles";
import { createVehicleId } from "./vehicleStorage";
import { useVehicles } from "./useVehicles";
import VehicleDetails from "./VehicleDetails";
import HistoryPage from "./HistoryPage";

type VehicleForm = {
  brand: string;
  model: string;
  year: string;
  plate: string;
  department: string;
  status: Vehicle["status"];
  mileage: string;
  fuel: string;
  transmission: string;
  color: string;
  owner: string;
  nextService: string;
};

const emptyForm: VehicleForm = {
  brand: "",
  model: "",
  year: String(new Date().getFullYear()),
  plate: "",
  department: "",
  status: "Свободен",
  mileage: "0",
  fuel: "Бензин",
  transmission: "Автоматическая",
  color: "",
  owner: "Не назначен",
  nextService: "Не указано",
};

function toForm(vehicle: Vehicle): VehicleForm {
  return {
    brand: vehicle.brand,
    model: vehicle.model,
    year: String(vehicle.year),
    plate: vehicle.plate,
    department: vehicle.department,
    status: vehicle.status,
    mileage: String(vehicle.mileage),
    fuel: vehicle.fuel,
    transmission: vehicle.transmission,
    color: vehicle.color,
    owner: vehicle.owner,
    nextService: vehicle.nextService,
  };
}

function VehicleDialog({
  open,
  vehicle,
  onClose,
  onSave,
}: {
  open: boolean;
  vehicle: Vehicle | null;
  onClose: () => void;
  onSave: (form: VehicleForm) => void;
}) {
  const [form, setForm] = useState<VehicleForm>(emptyForm);
  const [error, setError] = useState("");

  // Заполняем форму при открытии или смене автомобиля.
  const [formKey, setFormKey] = useState("");

  if (open && formKey !== (vehicle?.id ?? "new")) {
    setForm(vehicle ? toForm(vehicle) : { ...emptyForm });
    setError("");
    setFormKey(vehicle?.id ?? "new");
  }

  const change = (field: keyof VehicleForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.brand.trim() || !form.model.trim()) {
      setError("Укажи марку и модель автомобиля.");
      return;
    }

    const year = Number(form.year);
    const mileage = Number(form.mileage);

    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      setError("Проверь год выпуска.");
      return;
    }

    if (!Number.isFinite(mileage) || mileage < 0) {
      setError("Пробег должен быть неотрицательным числом.");
      return;
    }

    onSave(form);
    setFormKey("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box component="form" onSubmit={submit}>
        <DialogTitle>
          {vehicle ? "Редактировать автомобиль" : "Добавить автомобиль"}
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                required
                label="Марка"
                value={form.brand}
                onChange={(e) => change("brand", e.target.value)}
              />
              <TextField
                fullWidth
                required
                label="Модель"
                value={form.model}
                onChange={(e) => change("model", e.target.value)}
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                required
                type="number"
                label="Год выпуска"
                value={form.year}
                inputProps={{ min: 1900, max: 2100 }}
                onChange={(e) => change("year", e.target.value)}
              />
              <TextField
                fullWidth
                label="Госномер (демо)"
                value={form.plate}
                onChange={(e) => change("plate", e.target.value)}
              />
            </Stack>

            <TextField
              fullWidth
              label="Подразделение"
              value={form.department}
              onChange={(e) => change("department", e.target.value)}
            />

            <FormControl fullWidth>
              <InputLabel id="vehicle-status-label">Статус</InputLabel>
              <Select
                labelId="vehicle-status-label"
                label="Статус"
                value={form.status}
                onChange={(e) =>
                  change("status", e.target.value as Vehicle["status"])
                }
              >
                <MenuItem value="В эксплуатации">В эксплуатации</MenuItem>
                <MenuItem value="Свободен">Свободен</MenuItem>
                <MenuItem value="На обслуживании">На обслуживании</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              required
              type="number"
              label="Пробег, км"
              value={form.mileage}
              inputProps={{ min: 0 }}
              onChange={(e) => change("mileage", e.target.value)}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                fullWidth
                label="Топливо"
                value={form.fuel}
                onChange={(e) => change("fuel", e.target.value)}
              />
              <TextField
                fullWidth
                label="Коробка передач"
                value={form.transmission}
                onChange={(e) => change("transmission", e.target.value)}
              />
            </Stack>

            <TextField
              fullWidth
              label="Цвет"
              value={form.color}
              onChange={(e) => change("color", e.target.value)}
            />
            <TextField
              fullWidth
              label="Ответственный"
              value={form.owner}
              onChange={(e) => change("owner", e.target.value)}
            />
            <TextField
              fullWidth
              label="Следующее ТО"
              value={form.nextService}
              onChange={(e) => change("nextService", e.target.value)}
            />
            <Alert severity="info">
              Используй только тестовые данные. Интеграции с корпоративными
              системами пока нет.
            </Alert>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

function Catalog() {
  const navigate = useNavigate();
  const { vehicles, updateVehicles } = useVehicles();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);

  const filtered = vehicles.filter((v) =>
    `${v.brand} ${v.model} ${v.plate} ${v.department} ${v.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (vehicle: Vehicle) => {
    setEditing(vehicle);
    setDialogOpen(true);
  };

  const saveVehicle = (form: VehicleForm) => {
    if (editing) {
      const updated = vehicles.map((v) =>
        v.id === editing.id
          ? {
              ...v,
              ...form,
              year: Number(form.year),
              mileage: Number(form.mileage),
            }
          : v
      );
      updateVehicles(updated);
    } else {
      const newVehicle: Vehicle = {
        ...form,
        id: createVehicleId(),
        year: Number(form.year),
        mileage: Number(form.mileage),
        vin: "DEMO-" + createVehicleId().toUpperCase(),
        documents: [],
        history: [
          {
            date: new Date().toLocaleDateString("ru-RU"),
            title: "Автомобиль добавлен",
            description: "Демонстрационная запись, созданная в FleetHub",
          },
        ],
      };
      updateVehicles([...vehicles, newVehicle]);
    }

    setDialogOpen(false);
    setEditing(null);
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Автопарк
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Каталог и информация о транспортных средствах
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAdd}
        >
          Добавить автомобиль
        </Button>
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Поиск по марке, модели, госномеру или подразделению"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Chip
          label={`${vehicles.length} автомобилей`}
          variant="outlined"
          sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
        />
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(3, minmax(0, 1fr))",
          },
          gap: 2.5,
        }}
      >
        {filtered.map((v) => (
          <Card
            key={v.id}
            variant="outlined"
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: "primary.main",
                boxShadow: 3,
                transform: "translateY(-2px)",
              },
            }}
          >
            <Box
              onClick={() => navigate(`/vehicles/${v.id}`)}
              sx={{
                height: 130,
                bgcolor: "action.hover",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
              }}
            >
              <DirectionsCarOutlinedIcon
                sx={{ fontSize: 72, color: "text.secondary" }}
              />
            </Box>
            <CardContent sx={{ p: 2.5 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={1}
              >
                <Box
                  onClick={() => navigate(`/vehicles/${v.id}`)}
                  sx={{ cursor: "pointer" }}
                >
                  <Typography variant="h6" fontWeight={750}>
                    {v.brand} {v.model}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {v.year} год · {v.plate}
                  </Typography>
                </Box>
                <Chip
                  size="small"
                  label={v.status}
                  color={
                    v.status === "В эксплуатации"
                      ? "success"
                      : v.status === "Свободен"
                        ? "info"
                        : "warning"
                  }
                />
              </Stack>

              <Stack spacing={1} sx={{ mt: 2 }}>
                <Stack direction="row" justifyContent="space-between" spacing={2}>
                  <Typography variant="body2" color="text.secondary">
                    Подразделение
                  </Typography>
                  <Typography variant="body2" fontWeight={600} textAlign="right">
                    {v.department || "Не указано"}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Пробег
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {v.mileage.toLocaleString("ru-RU")} км
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate(`/vehicles/${v.id}`)}
                >
                  Открыть
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<EditOutlinedIcon />}
                  onClick={() => openEdit(v)}
                >
                  Изменить
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {filtered.length === 0 && (
        <Typography color="text.secondary" sx={{ py: 6, textAlign: "center" }}>
          Автомобили не найдены.
        </Typography>
      )}

      <VehicleDialog
        key={`${editing?.id ?? "new"}-${dialogOpen}`}
        open={dialogOpen}
        vehicle={editing}
        onClose={() => {
          setDialogOpen(false);
          setEditing(null);
        }}
        onSave={saveVehicle}
      />
    </Box>
  );
}

function AppLayout() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f7f8fa" }}>
      <AppBar
        position="sticky"
        elevation={0}
        color="inherit"
        sx={{ borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Toolbar sx={{ gap: 1, flexWrap: "wrap" }}>
          <DirectionsCarOutlinedIcon color="primary" />
          <Typography
            component={Link}
            to="/"
            variant="h6"
            fontWeight={850}
            color="text.primary"
            sx={{ textDecoration: "none", mr: "auto" }}
          >
            FleetHub
          </Typography>
          <Button component={Link} to="/" startIcon={<DirectionsCarOutlinedIcon />}>
            Автопарк
          </Button>
          <Button
            color="inherit"
            startIcon={<MapOutlinedIcon />}
            onClick={() => alert("Раздел карты добавим следующим этапом.")}
          >
            Карта
          </Button>
          <Button
            color="inherit"
            startIcon={<DescriptionOutlinedIcon />}
            onClick={() => alert("Общий раздел документов добавим следующим этапом.")}
          >
            Документы
          </Button>
         <Button
          component={Link}
          to="/history"
          color="inherit"
          startIcon={<HistoryIcon />}
        >
          История
        </Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/vehicles/:id" element={<VehicleDetails />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="*" element={<Catalog />} />
      </Routes>

      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">
          FleetHub · локальный прототип · демонстрационные данные
        </Typography>
      </Box>
    </Box>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CssBaseline />
      <AppLayout />
    </BrowserRouter>
  );
}
