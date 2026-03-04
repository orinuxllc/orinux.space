export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export const plans: PricingPlan[] = [
  {
    name: "Starter",
    price: "99,000",
    period: "сар",
    desc: "Жижиг бизнесүүдэд тохиромжтой",
    features: [
      "3 модуль хүртэл",
      "5 хэрэглэгч",
      "AI Agent (үндсэн)",
      "Email дэмжлэг",
      "5GB файл хадгалалт",
    ],
    cta: "Үнэгүй эхлэх",
  },
  {
    name: "Business",
    price: "299,000",
    period: "сар",
    desc: "Өсөж буй бизнесүүдэд",
    features: [
      "10 модуль хүртэл",
      "25 хэрэглэгч",
      "AI Agent (бүрэн)",
      "Тусгай дэмжлэг",
      "50GB файл хадгалалт",
      "API хандалт",
      "Custom domain",
    ],
    cta: "Эхлэх",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Тохиролцоно",
    period: "",
    desc: "Томоохон байгууллагуудад",
    features: [
      "Бүх модуль",
      "Хязгааргүй хэрэглэгч",
      "AI Agent (тусгай)",
      "Dedicated дэмжлэг",
      "Хязгааргүй хадгалалт",
      "On-premise суулгац",
      "SLA баталгаа",
      "Custom модуль",
    ],
    cta: "Холбоо барих",
  },
];
