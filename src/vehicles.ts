
export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  vin: string;
  department: string;
  status: "В эксплуатации" | "На обслуживании" | "Свободен";
  mileage: number;
  fuel: string;
  transmission: string;
  color: string;
  owner: string;
  nextService: string;
  documents: { name: string; number: string; expires: string }[];
  history: { date: string; title: string; description: string }[];
};

export const vehicles: Vehicle[] = [
  {
    id: "car-001",
    brand: "Toyota",
    model: "Camry",
    year: 2023,
    plate: "А000АА 000",
    vin: "DEMO-CAMRY-001",
    department: "Администрация",
    status: "В эксплуатации",
    mileage: 28450,
    fuel: "Бензин",
    transmission: "Автоматическая",
    color: "Серебристый",
    owner: "Иван Петров",
    nextService: "15.12.2026",
    documents: [
      { name: "Свидетельство о регистрации", number: "ДЕМО-001", expires: "Не указано" },
      { name: "Страховой полис", number: "ДЕМО-002", expires: "31.12.2026" },
    ],
    history: [
      { date: "15.09.2026", title: "Плановое ТО", description: "Демонстрационная запись о техническом обслуживании" },
      { date: "10.06.2026", title: "Замена масла", description: "Демонстрационная запись о выполненных работах" },
      { date: "12.01.2026", title: "Осмотр автомобиля", description: "Проверка общего технического состояния" },
    ],
  },
  {
    id: "car-002",
    brand: "Toyota",
    model: "RAV4",
    year: 2024,
    plate: "А111АА 000",
    vin: "DEMO-RAV4-002",
    department: "Хозяйственный отдел",
    status: "Свободен",
    mileage: 12300,
    fuel: "Бензин",
    transmission: "Автоматическая",
    color: "Белый",
    owner: "Не назначен",
    nextService: "20.01.2027",
    documents: [
      { name: "Свидетельство о регистрации", number: "ДЕМО-003", expires: "Не указано" },
      { name: "Страховой полис", number: "ДЕМО-004", expires: "31.01.2027" },
    ],
    history: [
      { date: "20.09.2026", title: "Возврат в автопарк", description: "Автомобиль доступен для назначения" },
      { date: "01.08.2026", title: "Плановое ТО", description: "Демонстрационная запись об обслуживании" },
    ],
  },
  {
    id: "car-003",
    brand: "BMW",
    model: "X5",
    year: 2022,
    plate: "А222АА 000",
    vin: "DEMO-BMW-003",
    department: "Руководство",
    status: "На обслуживании",
    mileage: 41700,
    fuel: "Дизель",
    transmission: "Автоматическая",
    color: "Чёрный",
    owner: "Алексей Смирнов",
    nextService: "После завершения работ",
    documents: [
      { name: "Свидетельство о регистрации", number: "ДЕМО-005", expires: "Не указано" },
      { name: "Страховой полис", number: "ДЕМО-006", expires: "30.11.2026" },
    ],
    history: [
      { date: "18.10.2026", title: "Передан на обслуживание", description: "Демонстрационная запись о текущих работах" },
      { date: "18.07.2026", title: "Плановое ТО", description: "Демонстрационная запись об обслуживании" },
    ],
  },
];
