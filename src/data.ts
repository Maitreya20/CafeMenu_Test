/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem } from "./types";

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "m1",
    name: "Paneer Tikka",
    category: "Starters",
    price: 340,
    emoji: "🍢",
    description: "Smokey & Spiced marinated paneer chunks cooked in clay oven.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNiLSPPBo5hOo4g5c6fMJP400PNcBDWEISorctGJpK6nv2H4FC4YM6p8bzB2ud56y6frLO5hi1A38S4ev8ISWsAnumTgzs0PfsyRHSyAvdNgnCKYnT4dtdyT484SRvECFNoyeTMpEgtPDpnpG10-2NmSaXcsnO9Uk5b9reSJlkcs9qBcwskgoTKKW5Npwis_CkitHRL54dulveL-moqJ9JrrRqHXGBTz07ftjMf3S4jeG7bQq7_9a9v6zmcgbR2Ae58ZvvORYu-xw",
    rating: 4.8,
    isTrending: true
  },
  {
    id: "m2",
    name: "Butter Chicken",
    category: "Mains",
    price: 480,
    emoji: "🍗",
    description: "Velvety & Classic tandoori chicken cooked in smooth buttery gravy.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDFzOvLuO55JwjwNpMzKCKs4PGlCW8k9P5FxksEsks5rPbaKUCOD5-01f9aGEn1ZN0g6kv8vb4ES855SFH3fNKR8Tn92r6sraChVKhI6ZUZBAQPdiJDVDpmlM4HiHcw2-Wau6aAKNNGPeZVA8TCIwU71QpTQU5knvebopzECN2HhxkTid6Fuk7gH623JjOk3lsjNE0qzQj6dtK5_FU830MTTmmOE7QLf56b2pVN-_BKJxj-yw09mwAWLERjVQ1hL5Eyor7jJdW-fUU",
    rating: 4.9,
    isChefPick: true
  },
  {
    id: "m3",
    name: "Gulab Jamun",
    category: "Desserts",
    price: 180,
    emoji: "🍨",
    description: "Warm & Sweet golden-brown milk dumplings soaked in sugar syrup.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDbg5fYWS_5O9B8CfOMajGxfKF-PCn1Ic0QTP7Uz35WbWyeOBVpNSzDi09DlbRdmVcXiNm1FzTO5jYRt9ZlswIJwzPhjTy6Ni6_5e55dzK_15n3E-2PSgGq5k10Scg5MJ_PURy_2U8mKbRtmvf2Vq1dZL-jsStCofPCDUAu6ESJTn-pGMzZAiQFg8uoxZ86o5T5mYA-YAgBlhg6yTkFACi_Powc70sskZRE1fx7xKXMlyY4xTfqaRuW13W2jczywIMs7-TCdbZLxdY",
    rating: 4.7
  },
  {
    id: "m4",
    name: "Garlic Naan",
    category: "Mains",
    price: 95,
    emoji: "🫓",
    description: "Buttery & Charred tandoori bread with fine minced garlic.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdiu0l_DLhJEZBQ9VkXgtlCitrhXNhFmgciOibtcIOtHQtY0J8b8G4f5nYlf-Zw7rO9LD6xMk98smfWJNmsk53uAQ1tPpzuRAJZo5G1pkYj9l5O1dIuzaQjINxQhzHgp-yb0wGhFnkreoReShFZv0Y_hDCUNwIGyysh0JqNj-v2o84AJ4oM93SDCH7qpOddLw00hFSr9G99smqQoddfe1LJSRDVWTsHU6e-Fbtuj6hP8-bPEaF0c3ijrodx0YZlzBDawPtmNW0N6E",
    rating: 4.9
  },
  {
    id: "m5",
    name: "Truffle Beef Burger",
    category: "Mains",
    price: 520, // ~18.50 USD formatted in local or kept consistent
    emoji: "🍔",
    description: "Medium Rare premium beef patty, Swiss cheese, truffle aioli.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
    rating: 4.9,
    isTrending: true
  },
  {
    id: "m6",
    name: "Cajun Spiced Fries",
    category: "Starters",
    price: 170, // ~6.00 USD
    emoji: "🍟",
    description: "With Garlic Aioli and special house spice mix.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60",
    rating: 4.6
  },
  {
    id: "m7",
    name: "Fresh Lime Soda",
    category: "Beverages",
    price: 130, // ~4.50 USD
    emoji: "🥤",
    description: "Sweetened sparkling refreshment with fresh lime.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60",
    rating: 4.5
  }
];

export const SUGGESTIONS: MenuItem[] = [
  {
    id: "s1",
    name: "Mango Lassi",
    category: "Beverages",
    price: 240, // $4.99 equivalents
    emoji: "🥛",
    description: "A vibrant and appetizing close-up of a Mango Lassi in a traditional glass, garnished with saffron strands and mint.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD48ea0e5jPGT9GSCVAe1YqPB42F7pMT8c4RSz8a91JxAKtheQ1jtGClr5B0bKkiBEElz-aTVEIFh3Ge0M2Knw1qqlUum7wnr9sPWxXayXVn8u52PCw-hrMaXbaIv_vnv9pBLHm_iU8byMTJe1CWt0awsqWCuuJfvaNypsoD8Ow_4yr8hkURW3LkyT2ULZWhq73Z6ZnudPZZDX_37-qZ6Q_E2uOsKsAWfkH1_XTn__WQKUm8NVXFhvuMkF8tDASDyVTc2cEjIw-ZYg",
    rating: 4.8
  },
  {
    id: "s2",
    name: "Crispy Corn",
    category: "Starters",
    price: 270, // $5.50 equivalents
    emoji: "🌽",
    description: "A golden, crispy plate of Mexican-style corn kernels seasoned with lime and chili powder, served in a sleek black bowl.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuApfq3lwU69zci9wBoL4d0EYLhToVtpXybrI3CCl2cBjdfhp2czOcvw8Tqjc3n1EsG9KFGE9hchYi4xkY__OOaoOzlXkbrsx8gQ4jOtXsvCMpRy8baJuwwrqvMR1qLgItn0sIAjaJKz2krQ7SaxunMVeQbRrM-liyl1st-iMcqMXGNposyPp3lONl_EV7Q1OEvn4Y0HJ3hUDKITkEz_hLRvEfUilW0FvT1nmcqaHRFRC3u_3Vo0BhemdM8rK-l_AAnthNVjRLYI_3M",
    rating: 4.7
  },
  {
    id: "s3",
    name: "Berry Blast",
    category: "Beverages",
    price: 180, // $3.50 equivalents
    emoji: "🍹",
    description: "Refreshing glass of sparkling berry lemonade with floating ice cubes and fresh raspberries.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAi7XEMwsHgW3QQ3Asumz6voL8aPUNDgQJ4Y8fk0cla_uMcjuvDpX8M00qOP73xmGX5bMEJ2okZnkqe71lj9ykWFU5FxgNgb-FHyafOtHwsyr82I0i3OXLtCxV_5Gztbxnj76h2Rhg4Tczz3tv4HxaTcQrLmRUCIV-394dd2sJMMd2rJF6BXK1vpFyb1ClQGqG2miXnUP5Ph7ujG4aZ_WI3lfQ9tZP6Spvhqm0xDZWlOHuIh0IaowrQMfwRUBBlOPcpcGVz_x1CXw",
    rating: 4.6
  }
];

export const INITIAL_TICKETS = (): import("./types").OrderTicket[] => [
  {
    id: "T12",
    orderNumber: "#BF-4821",
    status: "NEW",
    table: "Table 4",
    allergyNote: "ALLERGY NOTE: PEANUTS / SHELLFISH",
    kitchenNote: "No cilantro on the naan please, client is sensitive.",
    items: [
      { name: "Butter Chicken", quantity: 2, category: "Lrg" },
      { name: "Garlic Naan", quantity: 1, category: "Reg" }
    ],
    receivedTime: new Date(Date.now() - 240000), // 4m ago
    elapsedSeconds: 240,
    waiterNotified: false
  },
  {
    id: "T04",
    orderNumber: "#BF-4825",
    status: "NEW",
    table: "Table 4",
    items: [
      { name: "Signature Burger", quantity: 1, category: "Med-Rare" }
    ],
    receivedTime: new Date(Date.now() - 60000), // 1m ago
    elapsedSeconds: 60,
    waiterNotified: false
  },
  {
    id: "T21",
    orderNumber: "#BF-4829",
    status: "COOKING",
    table: "Table 4",
    items: [
      { name: "Truffle Pasta", quantity: 3, category: "Main" },
      { name: "Garden Salad", quantity: 1, category: "Side" }
    ],
    receivedTime: new Date(Date.now() - 765000), // 12m 45s ago
    elapsedSeconds: 765,
    waiterNotified: false
  },
  {
    id: "T08",
    orderNumber: "#BF-4831",
    status: "COOKING",
    table: "Table 8",
    items: [
      { name: "Fish & Chips", quantity: 2, category: "Main" }
    ],
    receivedTime: new Date(Date.now() - 372000), // 6m 12s ago
    elapsedSeconds: 372,
    waiterNotified: false
  },
  {
    id: "T15",
    orderNumber: "#BF-4819",
    status: "READY",
    table: "Table 15",
    items: [
      { name: "Ribeye Steak", quantity: 1, category: "Main" },
      { name: "Red Wine Jus", quantity: 1, category: "Side" }
    ],
    receivedTime: new Date(Date.now() - 1100000),
    elapsedSeconds: 1100,
    waiterNotified: true
  },
  {
    id: "T02",
    orderNumber: "#BF-4815",
    status: "READY",
    table: "Table 2",
    items: [
      { name: "Ice Cream", quantity: 4, category: "Dessert" }
    ],
    receivedTime: new Date(Date.now() - 1500000),
    elapsedSeconds: 1500,
    waiterNotified: true
  }
];
