
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  readAuditLog,
  type AuditEntry,
} from "./auditLog";

export default function HistoryPage() {
  const [entries, setEntries] = useState<AuditEntry[]>(readAuditLog);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("all");

  useEffect(() => {
    const refresh = () => setEntries(readAuditLog());

    window.addEventListener("fleethub-audit-updated", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("fleethub-audit-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchesAction = action === "all" || entry.action === action;
      const haystack = [
        entry.vehicleName,
        entry.vehicleId,
        entry.field,
        entry.oldValue,
        entry.newValue,
      ]
        .join(" ")
        .toLowerCase();

      return matchesAction && haystack.includes(query);
    });
  }, [entries, search, action]);

  return (
    <Box sx={{ maxWidth: 1400, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={800}>
        История изменений
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        Журнал действий с карточками автомобилей в этом браузере
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <TextField
          fullWidth
          label="Поиск"
          placeholder="Автомобиль, поле или значение"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <FormControl sx={{ minWidth: { sm: 220 } }}>
          <InputLabel id="audit-action-label">Тип операции</InputLabel>
          <Select
            labelId="audit-action-label"
            value={action}
            label="Тип операции"
            onChange={(e) => setAction(e.target.value)}
          >
            <MenuItem value="all">Все операции</MenuItem>
            <MenuItem value="created">Создание</MenuItem>
            <MenuItem value="updated">Изменение</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Chip label={`Всего записей: ${entries.length}`} variant="outlined" />
        <Chip label={`Найдено: ${filtered.length}`} variant="outlined" />
      </Stack>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Дата и время</TableCell>
              <TableCell>Автомобиль</TableCell>
              <TableCell>Операция</TableCell>
              <TableCell>Поле</TableCell>
              <TableCell>Было</TableCell>
              <TableCell>Стало</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.map((entry) => (
              <TableRow key={entry.id} hover>
                <TableCell sx={{ whiteSpace: "nowrap" }}>
                  {new Date(entry.date).toLocaleString("ru-RU")}
                </TableCell>
                <TableCell>
                  <Typography
                    component={Link}
                    to={`/vehicles/${entry.vehicleId}`}
                    color="primary"
                    sx={{ textDecoration: "none", fontWeight: 600 }}
                  >
                    {entry.vehicleName}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    color={entry.action === "created" ? "success" : "info"}
                    label={entry.action === "created" ? "Создание" : "Изменение"}
                  />
                </TableCell>
                <TableCell>{entry.field}</TableCell>
                <TableCell sx={{ maxWidth: 220, overflowWrap: "anywhere" }}>
                  {entry.oldValue}
                </TableCell>
                <TableCell sx={{ maxWidth: 220, overflowWrap: "anywhere" }}>
                  {entry.newValue}
                </TableCell>
              </TableRow>
            ))}

            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    Записей пока нет или ничего не найдено. Измени данные
                    автомобиля в каталоге, чтобы создать первую запись.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
