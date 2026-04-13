export interface Service {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
  desc: string;
  features: string[];
  tag: string;
}

export const services: Service[] = [
  {
    id: "ai-agent",
    name: "AI Agent Суурилуулалт",
    nameEn: "AI Agent Deployment",
    icon: "M12 8V4H8M12 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM4 12a8 8 0 0 0 16 0M9 17v1m6-1v1",
    desc: "Танай байгууллагын үйл ажиллагааг бүрэн автоматжуулах AI Agent тохируулж, суурилуулж өгнө. Борлуулалт, агуулах, санхүү, HR зэрэг бизнесийн бүх процесст тохирсон agent deploy хийнэ.",
    features: [
      "Бизнес процесс шинжилгээ",
      "Custom AI Agent бүтээх",
      "Одоо байгаа системтэй холбох",
      "Ажилтнуудыг сургах",
      "Гүйцэтгэл хянах dashboard",
      "Тасралтгүй сайжруулалт",
    ],
    tag: "Хамгийн эрэлттэй",
  },
  {
    id: "rag-setup",
    name: "RAG Систем Тохируулалт",
    nameEn: "RAG Setup & Integration",
    icon: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19v16H6.5a2.5 2.5 0 0 0 0 5H19M9 10h6M9 6h6M9 14h4",
    desc: "Танай байгууллагын бичиг баримт, мэдлэгийн сан, гарын авлага зэргийг AI-д ойлгуулж, ажилтнууд болон хэрэглэгчдэд хиймэл оюун ухаанаар хариулт өгөх RAG систем бүтээж өгнө.",
    features: [
      "Бичиг баримт vectorization",
      "Мэдлэгийн сан бүтээх",
      "LLM сонголт, тохиргоо",
      "Chatbot / Q&A интерфэйс",
      "Аюулгүй байдал, эрхийн удирдлага",
      "Тогтмол шинэчлэлт pipeline",
    ],
    tag: "AI Шийдэл",
  },
  {
    id: "automation",
    name: "Процесс Автоматжуулалт",
    nameEn: "Business Process Automation",
    icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8",
    desc: "Давтагдах ажлуудыг бүрэн автоматжуулна. Email илгээх, тайлан гаргах, мэдэгдэл, батламж workflow — бүгдийг event-driven automation-оор шийднэ.",
    features: [
      "Workflow mapping & дизайн",
      "Event-driven trigger тохируулах",
      "Гуравдагч системтэй интеграц",
      "Approval workflow бүтээх",
      "Автомат тайлан, мэдэгдэл",
      "ROI хэмжилт, оновчлол",
    ],
    tag: "Үр ашигтай",
  },
  {
    id: "data-integration",
    name: "Дата Интеграц & Шилжүүлэг",
    nameEn: "Data Integration & Migration",
    icon: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12",
    desc: "Хуучин системээс шинэ рүү өгөгдөл зөөх, олон системийг нэг дор холбох, API интеграц хийх үйлчилгээ. Excel, Access, хуучин ERP-ээс аюулгүй шилжүүлнэ.",
    features: [
      "Өгөгдлийн аудит, цэвэрлэгээ",
      "ETL pipeline бүтээх",
      "API интеграц хөгжүүлэлт",
      "Хуучин системээс шилжүүлэг",
      "Мэдээллийн бүрэн бүтэн байдал",
      "Тестчилэл, баталгаажуулалт",
    ],
    tag: "Шилжилт",
  },
  {
    id: "consulting",
    name: "AI Зөвлөх Үйлчилгээ",
    nameEn: "AI Consulting",
    icon: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 1-4 4v14a3 3 0 0 0 3-3h7z",
    desc: "Танай байгууллагад AI хэрхэн нэвтрүүлэх, ямар процессыг автоматжуулах нь хамгийн үр дүнтэй болохыг тодорхойлж, замын зураглал гаргаж өгнө.",
    features: [
      "AI бэлэн байдлын үнэлгээ",
      "Үйл ажиллагааны шинжилгээ",
      "AI стратеги, замын зураглал",
      "Технологийн сонголт зөвлөгөө",
      "ROI тооцоолол",
      "Хэрэгжүүлэлтийн төлөвлөгөө",
    ],
    tag: "Стратеги",
  },
  {
    id: "custom-dev",
    name: "Custom AI Шийдэл",
    nameEn: "Custom AI Development",
    icon: "M16 18l6-6-6-6M8 6l-6 6 6 6M14.5 4l-5 16",
    desc: "Танай бизнесийн онцлогт тохирсон тусгай AI шийдэл хөгжүүлж өгнө. Тусгай модель сургах, fine-tuning, computer vision, NLP зэрэг.",
    features: [
      "Custom модель хөгжүүлэлт",
      "Fine-tuning & prompt engineering",
      "Computer vision шийдэл",
      "NLP / текст боловсруулалт",
      "API endpoint бүтээх",
      "Deployment & monitoring",
    ],
    tag: "Тусгай захиалга",
  },
];

export interface ServiceProcess {
  num: string;
  title: string;
  desc: string;
}

export const serviceProcess: ServiceProcess[] = [
  {
    num: "01",
    title: "Шинжилгээ & Зөвлөгөө",
    desc: "Танай байгууллагын одоогийн үйл ажиллагаа, процесс, хэрэгцээг бүрэн судална.",
  },
  {
    num: "02",
    title: "Төлөвлөлт & Дизайн",
    desc: "AI шийдлийн архитектур, интеграцийн төлөвлөгөө, хугацааны хуваарь гаргана.",
  },
  {
    num: "03",
    title: "Хэрэгжүүлэлт & Тест",
    desc: "Agent суурилуулж, RAG тохируулж, automation бүтээж, бүрэн тестчилнэ.",
  },
  {
    num: "04",
    title: "Сургалт & Дэмжлэг",
    desc: "Ажилтнуудыг сургаж, тасралтгүй дэмжлэг, сайжруулалт хийнэ.",
  },
];
