export interface Feature {
  title: string;
  desc: string;
  icon: string;
}

export const features: Feature[] = [
  {
    title: "AI Agent бүр модулд",
    desc: "Борлуулалт, агуулах, HR, санхүү — модуль бүрт AI туслах автомат ажиллана. Хүн зөвхөн батална.",
    icon: "bot",
  },
  {
    title: "Event-Driven Автоматжуулалт",
    desc: "Бизнес үйл явдал тохиолдоход AI agent шууд хариу үйлдэл үзүүлнэ. Хүлээлт байхгүй.",
    icon: "zap",
  },
  {
    title: "Модульчлагдсан Архитектур",
    desc: "40+ модулиас хэрэгтэйгээ л сонго. Шаардлагагүй зүйлд төлөхгүй, хэрэгтэй болоход нэм.",
    icon: "blocks",
  },
  {
    title: "Multi-Tenant SaaS",
    desc: "Байгууллага бүр тусдаа орчин, тусдаа өгөгдөл. Нэг платформ дээр хэдэн ч бизнес.",
    icon: "building-2",
  },
  {
    title: "21 Бэлэн Tool",
    desc: "Email, SMS, төлбөр, файл хадгалалт, PDF, e-Barimt — бүгд бэлэн. Интеграцид цаг зарахгүй.",
    icon: "wrench",
  },
  {
    title: "Монгол Зах Зээлд",
    desc: "QPay, SocialPay, e-Barimt, банкны API, Монгол хэл — бүгд дэмжинэ.",
    icon: "map-pin",
  },
];

export const stats = [
  { value: "40+", label: "Модуль" },
  { value: "21", label: "Tool" },
  { value: "500+", label: "API Endpoint" },
  { value: "24/7", label: "AI Agent" },
];
