import {
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Navigation,
  Settings,
  ShoppingCart,
  Star,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Ingredient {
  name: string;
  qty: string;
}
interface Drink {
  id: number;
  name: string;
  kcal: number;
  price: number;
  category: "Protein" | "Veggies" | "Exotic Fruits" | "Milk Shakes";
  image: string;
  description: string;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: Ingredient[];
  tag?: string;
}
interface CartItem {
  drinkId: number;
  sugarPct: number;
  qty: number;
}
type Screen =
  | "home"
  | "menu"
  | "goal"
  | "target"
  | "matching"
  | "checkout"
  | "success"
  | "map"
  | "settings"
  | "signin"
  | "forgotpassword"
  | "register"
  | "aboutus"
  | "reportbug"
  | "reviewrating";

interface RegisteredUser {
  fullName: string;
  email: string;
  password: string;
}
interface CurrentUser {
  fullName: string;
  email: string;
}

// ─── Drink Data ───────────────────────────────────────────────────────────────
const GOAL_RANGES: Record<
  string,
  {
    cal: [number, number];
    protein: [number, number];
    fats: [number, number];
    carbs: [number, number];
  }
> = {
  Bulk: { cal: [300, 500], protein: [20, 35], fats: [5, 15], carbs: [30, 60] },
  Cut: { cal: [150, 300], protein: [20, 35], fats: [5, 15], carbs: [10, 30] },
  Debloat: { cal: [50, 200], protein: [5, 20], fats: [2, 10], carbs: [10, 40] },
  "Anti-Inflammatory": {
    cal: [150, 350],
    protein: [15, 30],
    fats: [5, 15],
    carbs: [20, 50],
  },
  "Energy Boost": {
    cal: [200, 450],
    protein: [10, 25],
    fats: [3, 10],
    carbs: [40, 80],
  },
  "Meal Replacement": {
    cal: [400, 700],
    protein: [25, 45],
    fats: [10, 25],
    carbs: [40, 80],
  },
};

const drinks: Drink[] = [
  // ── Fruit / Refresh → Exotic Fruits ──────────────────────────────────────
  {
    id: 1,
    name: "Blue Lemonade",
    kcal: 120,
    price: 5.5,
    category: "Exotic Fruits",
    image: "/assets/generated/drink-blue-lemonade.dim_400x400.png",
    description:
      "Electric blue spirulina lemonade with lemon slices and a refreshing citrus kick.",
    protein: 2,
    carbs: 28,
    fats: 1,
    tag: "Light 🌿",
    ingredients: [
      { name: "Blue spirulina water", qty: "250ml" },
      { name: "Lemon juice", qty: "60ml" },
      { name: "Agave syrup", qty: "20ml" },
      { name: "Sparkling water", qty: "20ml" },
    ],
  },
  {
    id: 2,
    name: "Coco Lime",
    kcal: 140,
    price: 6.0,
    category: "Exotic Fruits",
    image: "/assets/generated/drink-coco-lime.dim_400x400.png",
    description: "Creamy coconut water with zesty lime and a hint of mint.",
    protein: 2,
    carbs: 30,
    fats: 2,
    tag: "Light 🌿",
    ingredients: [
      { name: "Coconut water", qty: "250ml" },
      { name: "Lime juice", qty: "50ml" },
      { name: "Mint leaves", qty: "5g" },
      { name: "Agave syrup", qty: "15ml" },
    ],
  },
  {
    id: 3,
    name: "Berry Flow",
    kcal: 200,
    price: 6.5,
    category: "Exotic Fruits",
    image: "/assets/generated/drink-berry-flow.dim_400x400.png",
    description: "Purple-red mixed berry smoothie with deep fruity flavours.",
    protein: 3,
    carbs: 45,
    fats: 2,
    tag: "Light 🌿",
    ingredients: [
      { name: "Mixed berries", qty: "200g" },
      { name: "Apple juice", qty: "100ml" },
      { name: "Honey", qty: "20ml" },
      { name: "Water", qty: "50ml" },
    ],
  },
  {
    id: 4,
    name: "Tropical Splash",
    kcal: 220,
    price: 7.0,
    category: "Exotic Fruits",
    image: "/assets/generated/drink-tropical-splash.dim_400x400.png",
    description: "Bright tropical blend of mango, passionfruit and pineapple.",
    protein: 3,
    carbs: 50,
    fats: 2,
    tag: "Light 🌿",
    ingredients: [
      { name: "Mango chunks", qty: "150g" },
      { name: "Pineapple juice", qty: "120ml" },
      { name: "Passionfruit", qty: "50g" },
      { name: "Coconut water", qty: "80ml" },
    ],
  },
  {
    id: 5,
    name: "Watermelon Chill",
    kcal: 110,
    price: 5.5,
    category: "Exotic Fruits",
    image: "/assets/generated/drink-watermelon-chill.dim_400x400.png",
    description: "Ice-cold watermelon juice, light and ultra-refreshing.",
    protein: 2,
    carbs: 25,
    fats: 1,
    tag: "Light 🌿",
    ingredients: [
      { name: "Watermelon juice", qty: "300ml" },
      { name: "Lime juice", qty: "30ml" },
      { name: "Mint", qty: "5g" },
      { name: "Water", qty: "15ml" },
    ],
  },
  {
    id: 6,
    name: "Pineapple Boost",
    kcal: 180,
    price: 6.0,
    category: "Exotic Fruits",
    image: "/assets/generated/drink-pineapple-boost.dim_400x400.png",
    description: "Golden pineapple boost with ginger and fresh mint.",
    protein: 2,
    carbs: 40,
    fats: 1,
    tag: "Light 🌿",
    ingredients: [
      { name: "Pineapple juice", qty: "250ml" },
      { name: "Ginger", qty: "10g" },
      { name: "Mint", qty: "5g" },
      { name: "Lemon juice", qty: "20ml" },
    ],
  },
  {
    id: 7,
    name: "Citrus Glow",
    kcal: 130,
    price: 6.0,
    category: "Exotic Fruits",
    image: "/assets/generated/drink-citrus-glow.dim_400x400.png",
    description: "Vibrant citrus blend of orange, grapefruit and lemon.",
    protein: 2,
    carbs: 30,
    fats: 1,
    tag: "Light 🌿",
    ingredients: [
      { name: "Orange juice", qty: "150ml" },
      { name: "Grapefruit juice", qty: "100ml" },
      { name: "Lemon juice", qty: "40ml" },
      { name: "Honey", qty: "10ml" },
    ],
  },
  // ── Energy Drinks → Veggies ───────────────────────────────────────────────
  {
    id: 8,
    name: "Mango Energy Blast",
    kcal: 280,
    price: 8.0,
    category: "Veggies",
    image: "/assets/generated/drink-mango-tropical.dim_400x400.png",
    description:
      "Bright orange mango energy drink packed with natural sugars and vitamins.",
    protein: 5,
    carbs: 65,
    fats: 3,
    tag: "Energy ⚡",
    ingredients: [
      { name: "Mango puree", qty: "200g" },
      { name: "Orange juice", qty: "100ml" },
      { name: "Banana", qty: "50g" },
      { name: "Honey", qty: "20ml" },
    ],
  },
  {
    id: 9,
    name: "Banana Fuel",
    kcal: 300,
    price: 8.5,
    category: "Veggies",
    image: "/assets/generated/drink-banana-fuel.dim_400x400.png",
    description: "Thick creamy banana energy shake for sustained fuel.",
    protein: 6,
    carbs: 70,
    fats: 3,
    tag: "Energy ⚡",
    ingredients: [
      { name: "Banana", qty: "200g" },
      { name: "Oat milk", qty: "150ml" },
      { name: "Honey", qty: "20ml" },
      { name: "Flaxseed", qty: "10g" },
    ],
  },
  {
    id: 10,
    name: "Dates Power Drink",
    kcal: 320,
    price: 9.0,
    category: "Veggies",
    image: "/assets/generated/drink-dates-power.dim_400x400.png",
    description:
      "Rich caramel-brown date energy drink with deep natural sweetness.",
    protein: 5,
    carbs: 75,
    fats: 2,
    tag: "Energy ⚡",
    ingredients: [
      { name: "Medjool dates", qty: "100g" },
      { name: "Almond milk", qty: "200ml" },
      { name: "Cinnamon", qty: "2g" },
      { name: "Vanilla extract", qty: "5ml" },
    ],
  },
  {
    id: 11,
    name: "Apple Oats Energizer",
    kcal: 350,
    price: 9.5,
    category: "Veggies",
    image: "/assets/generated/drink-apple-oats.dim_400x400.png",
    description: "Hearty apple and oat energizer for all-day performance.",
    protein: 8,
    carbs: 65,
    fats: 6,
    tag: "Energy ⚡",
    ingredients: [
      { name: "Apple juice", qty: "150ml" },
      { name: "Rolled oats", qty: "60g" },
      { name: "Almond milk", qty: "150ml" },
      { name: "Cinnamon", qty: "2g" },
    ],
  },
  // ── Protein Drinks → Protein ──────────────────────────────────────────────
  {
    id: 12,
    name: "Whey Banana Shake",
    kcal: 380,
    price: 11.0,
    category: "Protein",
    image: "/assets/generated/drink-whey-banana.dim_400x400.png",
    description: "Thick banana whey protein shake with creamy texture.",
    protein: 28,
    carbs: 45,
    fats: 8,
    tag: "High Protein 💪",
    ingredients: [
      { name: "Whey protein", qty: "35g" },
      { name: "Banana", qty: "100g" },
      { name: "Whole milk", qty: "200ml" },
      { name: "Honey", qty: "15ml" },
    ],
  },
  {
    id: 13,
    name: "Berry Protein Smoothie",
    kcal: 320,
    price: 10.5,
    category: "Protein",
    image: "/assets/generated/drink-berry-protein.dim_400x400.png",
    description:
      "Deep purple berry protein smoothie with mixed berries and whey.",
    protein: 25,
    carbs: 40,
    fats: 6,
    tag: "High Protein 💪",
    ingredients: [
      { name: "Whey protein", qty: "30g" },
      { name: "Mixed berries", qty: "150g" },
      { name: "Almond milk", qty: "150ml" },
      { name: "Chia seeds", qty: "10g" },
    ],
  },
  {
    id: 14,
    name: "Chocolate Protein Shake",
    kcal: 400,
    price: 11.5,
    category: "Protein",
    image: "/assets/generated/drink-chocolate-protein.dim_400x400.png",
    description: "Rich dark chocolate protein shake with cocoa and whey.",
    protein: 30,
    carbs: 35,
    fats: 10,
    tag: "High Protein 💪",
    ingredients: [
      { name: "Chocolate whey protein", qty: "35g" },
      { name: "Cocoa powder", qty: "15g" },
      { name: "Whole milk", qty: "200ml" },
      { name: "Peanut butter", qty: "15g" },
    ],
  },
  {
    id: 15,
    name: "Vanilla Almond Protein",
    kcal: 350,
    price: 11.0,
    category: "Protein",
    image: "/assets/generated/drink-vanilla-almond.dim_400x400.png",
    description:
      "Creamy vanilla whey shake with almond pieces and smooth texture.",
    protein: 27,
    carbs: 30,
    fats: 9,
    tag: "High Protein 💪",
    ingredients: [
      { name: "Vanilla whey protein", qty: "35g" },
      { name: "Almond milk", qty: "200ml" },
      { name: "Sliced almonds", qty: "20g" },
      { name: "Vanilla bean", qty: "2g" },
    ],
  },
  {
    id: 16,
    name: "Green Protein Detox",
    kcal: 280,
    price: 10.5,
    category: "Protein",
    image: "/assets/generated/drink-green-protein.dim_400x400.png",
    description: "Vibrant green spinach and protein detox smoothie.",
    protein: 22,
    carbs: 25,
    fats: 8,
    tag: "High Protein 💪",
    ingredients: [
      { name: "Pea protein", qty: "30g" },
      { name: "Spinach", qty: "60g" },
      { name: "Cucumber", qty: "80g" },
      { name: "Almond milk", qty: "150ml" },
    ],
  },
  // ── Meal / Heavy Drinks → Milk Shakes ────────────────────────────────────
  {
    id: 17,
    name: "Peanut Butter Bulk Shake",
    kcal: 450,
    price: 13.5,
    category: "Milk Shakes",
    image: "/assets/generated/drink-peanut-butter.dim_400x400.png",
    description: "Extra-thick peanut butter protein shake for serious bulking.",
    protein: 30,
    carbs: 35,
    fats: 15,
    tag: "Meal 🍽️",
    ingredients: [
      { name: "Peanut butter", qty: "50g" },
      { name: "Whey protein", qty: "35g" },
      { name: "Whole milk", qty: "200ml" },
      { name: "Banana", qty: "50g" },
    ],
  },
  {
    id: 18,
    name: "Oats Muscle Builder",
    kcal: 500,
    price: 14.0,
    category: "Milk Shakes",
    image: "/assets/generated/drink-oats-muscle.dim_400x400.png",
    description: "Dense oat and protein muscle shake with hearty texture.",
    protein: 32,
    carbs: 60,
    fats: 12,
    tag: "Meal 🍽️",
    ingredients: [
      { name: "Rolled oats", qty: "80g" },
      { name: "Whey protein", qty: "35g" },
      { name: "Whole milk", qty: "200ml" },
      { name: "Honey", qty: "20ml" },
    ],
  },
  {
    id: 19,
    name: "Mass Gainer Supreme",
    kcal: 600,
    price: 15.5,
    category: "Milk Shakes",
    image: "/assets/generated/drink-mass-gainer.dim_400x400.png",
    description:
      "Ultimate mass gainer — chocolate and vanilla swirled powerhouse shake.",
    protein: 40,
    carbs: 70,
    fats: 18,
    tag: "Meal 🍽️",
    ingredients: [
      { name: "Mass gainer protein", qty: "80g" },
      { name: "Whole milk", qty: "200ml" },
      { name: "Cocoa powder", qty: "10g" },
      { name: "Oats", qty: "40g" },
    ],
  },
  {
    id: 20,
    name: "Complete Meal Shake",
    kcal: 550,
    price: 15.0,
    category: "Milk Shakes",
    image: "/assets/generated/drink-complete-meal.dim_400x400.png",
    description:
      "Nutritionally complete meal replacement shake with oats, fruits and protein.",
    protein: 35,
    carbs: 50,
    fats: 15,
    tag: "Meal 🍽️",
    ingredients: [
      { name: "Whey protein", qty: "35g" },
      { name: "Oats", qty: "60g" },
      { name: "Banana", qty: "80g" },
      { name: "Whole milk", qty: "200ml" },
    ],
  },
];

const GOALS = [
  "Bulk",
  "Cut",
  "Maintain",
  "Debloat",
  "Anti-Inflammatory",
  "Energy Boost",
  "Meal Replacement",
];
const CATEGORIES: Drink["category"][] = [
  "Protein",
  "Veggies",
  "Exotic Fruits",
  "Milk Shakes",
];
const SUGAR_OPTIONS = [0, 25, 50, 75, 100];

// ─── Shared Components ────────────────────────────────────────────────────────
function FruitBanner() {
  return (
    <div className="w-full h-28 overflow-hidden flex-shrink-0">
      <img
        src="/assets/generated/fruit-banner.dim_800x200.png"
        alt="Fruit banner"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

function DrinkBottomSheet({
  drink,
  onClose,
  cart,
  onAddToCart,
}: {
  drink: Drink;
  onClose: () => void;
  cart: CartItem[];
  onAddToCart: (drinkId: number, sugarPct: number, qty: number) => void;
}) {
  const [sugar, setSugar] = useState(50);
  const [qty, setQty] = useState(1);

  const totalInCart = cart.reduce((s, c) => s + c.qty, 0);
  const existing = cart.find((c) => c.drinkId === drink.id);
  const remaining = 3 - totalInCart;
  const maxQty = Math.max(1, remaining + (existing?.qty ?? 0));
  const canAdd = remaining > 0 || !!existing;

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={-1}
        aria-label="Close"
      />
      <motion.div
        className="relative bg-white rounded-t-3xl overflow-hidden"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>
        <div className="overflow-y-auto max-h-[520px] px-4 pb-4">
          {/* Drink image */}
          <div className="w-full h-36 rounded-2xl overflow-hidden mb-3">
            <img
              src={drink.image}
              alt={drink.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
          {/* Name + category */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-base text-gray-900 flex-1">
              {drink.name}
            </h3>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
              {drink.category}
            </span>
          </div>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            {drink.description}
          </p>
          {/* Macros row */}
          <div className="grid grid-cols-4 gap-1 mb-3">
            {[
              { label: "Kcal", val: drink.kcal, unit: "" },
              { label: "Protein", val: drink.protein, unit: "g" },
              { label: "Carbs", val: drink.carbs, unit: "g" },
              { label: "Fats", val: drink.fats, unit: "g" },
            ].map((m) => (
              <div
                key={m.label}
                className="bg-gray-50 rounded-xl p-2 text-center"
              >
                <div className="font-bold text-sm text-gray-900">
                  {m.val}
                  {m.unit}
                </div>
                <div className="text-xs text-gray-400">{m.label}</div>
              </div>
            ))}
          </div>
          {/* Ingredients */}
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-700 mb-1">
              Ingredients
            </p>
            <div className="flex flex-wrap gap-1">
              {drink.ingredients.map((ing) => (
                <span
                  key={ing.name}
                  className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100"
                >
                  {ing.name} <span className="opacity-60">{ing.qty}</span>
                </span>
              ))}
            </div>
          </div>
          {/* Sugar */}
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Sugar Level
            </p>
            <div className="flex gap-1">
              {SUGAR_OPTIONS.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSugar(s)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    sugar === s
                      ? "bg-[#3F8F57] text-white border-[#3F8F57]"
                      : "bg-white text-gray-600 border-gray-200"
                  }`}
                >
                  {s}%
                </button>
              ))}
            </div>
          </div>
          {/* Quantity selector */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-700 mb-2">Quantity</p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-full bg-[#3F8F57] text-white font-bold text-lg flex items-center justify-center active:scale-90 transition-transform"
              >
                −
              </button>
              <span className="w-10 h-8 bg-gray-50 rounded-lg flex items-center justify-center font-bold text-sm text-gray-900">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                className="w-8 h-8 rounded-full bg-[#3F8F57] text-white font-bold text-lg flex items-center justify-center active:scale-90 transition-transform"
              >
                +
              </button>
            </div>
            {totalInCart >= 3 && !existing && (
              <p className="text-center text-[10px] text-red-400 mt-1">
                Cart full (max 3 total)
              </p>
            )}
          </div>
          {/* Add to cart */}
          <button
            type="button"
            data-ocid="menu.add_to_cart_button"
            onClick={() => {
              if (canAdd) {
                onAddToCart(drink.id, sugar, qty);
                onClose();
              }
            }}
            disabled={!canAdd}
            className={`w-full py-3 rounded-2xl font-bold text-sm transition-all ${
              !canAdd
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#3F8F57] text-white active:scale-95"
            }`}
          >
            ADD TO CART
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Screen 1: Home ───────────────────────────────────────────────────────────
function HomeScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center"
      style={{ background: "#F5EDD8" }}
    >
      {/* Fruit decoration bg */}
      <img
        src="/assets/generated/fruits-decoration-transparent.dim_800x800.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />
      {/* Status bar */}
      <div className="absolute top-4 left-0 right-0 flex justify-between px-5 text-xs text-gray-600 font-medium z-10">
        <span>9:41</span>
        <span>▲ ◉ 🔋</span>
      </div>
      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="text-center">
          <div className="font-black text-[52px] leading-none text-gray-900 tracking-tight">
            PROTEIN
          </div>
          <div
            className="font-black text-[68px] leading-none text-[#3F8F57] tracking-tight"
            style={{ textShadow: "0 2px 12px rgba(63,143,87,0.25)" }}
          >
            HULK
          </div>
        </div>
        <button
          type="button"
          data-ocid="home.primary_button"
          onClick={() => onNavigate("menu")}
          className="mt-4 bg-gray-900 text-white font-bold text-base px-14 py-4 rounded-2xl active:scale-95 transition-transform shadow-lg"
        >
          START
        </button>
      </div>
    </div>
  );
}

// ─── Cart Bottom Sheet ────────────────────────────────────────────────────────
function CartSheet({
  cart,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onNavigate,
}: {
  cart: CartItem[];
  onClose: () => void;
  onUpdateQty: (drinkId: number, newQty: number) => void;
  onRemoveItem: (drinkId: number) => void;
  onClearCart: () => void;
  onNavigate: (s: Screen) => void;
}) {
  const [confirmClear, setConfirmClear] = useState(false);
  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  const totalPrice = cart.reduce((s, ci) => {
    const d = drinks.find((x) => x.id === ci.drinkId);
    return s + (d ? d.price * ci.qty : 0);
  }, 0);

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        role="button"
        tabIndex={-1}
        aria-label="Close cart"
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />
      <motion.div
        className="relative bg-white rounded-t-3xl overflow-hidden"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>
        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-2">
          <h3 className="font-black text-base text-gray-900">MY CART</h3>
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-green-100 text-[#3F8F57] font-bold px-2 py-0.5 rounded-full">
              {totalItems}/3 items
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full bg-gray-100"
            >
              <X size={14} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="overflow-y-auto max-h-[320px] px-4 pb-2 space-y-2">
          {cart.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">Your cart is empty</p>
            </div>
          ) : (
            cart.map((ci) => {
              const d = drinks.find((x) => x.id === ci.drinkId);
              if (!d) return null;
              const totalInCart = cart.reduce((s, c) => s + c.qty, 0);
              const canIncrease = totalInCart < 3;
              return (
                <div
                  key={ci.drinkId}
                  className="bg-gray-50 rounded-2xl p-2.5 flex items-center gap-2.5"
                >
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={d.image}
                      alt={d.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[11px] text-gray-900 truncate">
                      {d.name}
                    </p>
                    <p className="text-[9px] text-gray-400">
                      {d.kcal} kcal · Sugar {ci.sugarPct}%
                    </p>
                    <p className="text-[10px] font-bold text-[#3F8F57]">
                      ${(d.price * ci.qty).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => onUpdateQty(ci.drinkId, ci.qty - 1)}
                      className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-700 active:scale-90 transition-transform"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-gray-800 w-4 text-center">
                      {ci.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (canIncrease) onUpdateQty(ci.drinkId, ci.qty + 1);
                      }}
                      disabled={!canIncrease}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-transform active:scale-90 ${canIncrease ? "bg-[#3F8F57] text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(ci.drinkId)}
                      className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center ml-1 active:scale-90 transition-transform"
                    >
                      <Trash2 size={10} className="text-red-400" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Total */}
        {cart.length > 0 && (
          <div className="px-4 pb-2">
            <div className="flex justify-between items-center py-2 border-t border-gray-100">
              <span className="text-xs font-semibold text-gray-600">Total</span>
              <span className="text-sm font-black text-gray-900">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Clear confirm */}
        {confirmClear && (
          <div className="px-4 pb-2">
            <div className="bg-red-50 border border-red-100 rounded-xl p-2.5 flex items-center justify-between">
              <p className="text-xs text-red-600 font-medium">
                Clear all items?
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="text-xs text-gray-500 font-medium px-2 py-1 rounded-lg bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClearCart();
                    setConfirmClear(false);
                    onClose();
                  }}
                  className="text-xs text-white font-medium px-2 py-1 rounded-lg bg-red-500"
                >
                  Yes, Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="px-4 pb-5 pt-1 flex gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate("menu");
            }}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold border-2 border-[#3F8F57] text-[#3F8F57] active:scale-95 transition-transform"
          >
            ← Menu
          </button>
          {cart.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setConfirmClear(false);
                onClose();
                onNavigate("checkout");
              }}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-[#3F8F57] text-white active:scale-95 transition-transform"
            >
              Checkout →
            </button>
          )}
          {cart.length > 0 && (
            <button
              type="button"
              onClick={() => setConfirmClear(true)}
              className="w-10 py-2.5 rounded-xl text-xs font-bold bg-red-50 text-red-400 active:scale-95 transition-transform flex items-center justify-center"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Settings Screens ─────────────────────────────────────────────────────────
function SettingsHeader({
  title,
  onBack,
}: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-2 px-4 pt-10 pb-4 bg-white border-b border-gray-100">
      <button
        type="button"
        onClick={onBack}
        className="p-1.5 rounded-full bg-gray-100 active:scale-90 transition-transform"
      >
        <ChevronLeft size={16} className="text-gray-600" />
      </button>
      <h2 className="font-black text-base text-gray-900 flex-1 text-center pr-7">
        {title}
      </h2>
    </div>
  );
}

function AppInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  label?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="mb-3">
      {label && (
        <label
          htmlFor="app-input-field"
          className="block text-xs font-semibold text-gray-700 mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        id="app-input-field"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#3F8F57] transition-colors"
      />
    </div>
  );
}

function SettingsScreen({
  onNavigate,
  currentUser,
}: { onNavigate: (s: Screen) => void; currentUser: CurrentUser | null }) {
  const menuItems: { label: string; screen: Screen }[] = [
    { label: "Sign In / Register", screen: "signin" },
    { label: "About Us", screen: "aboutus" },
    { label: "Report a Bug", screen: "reportbug" },
    { label: "Review & Rating", screen: "reviewrating" },
  ];
  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ background: "#F5EDD8" }}
    >
      <SettingsHeader title="SETTINGS" onBack={() => onNavigate("menu")} />
      {currentUser && (
        <div className="px-4 py-3 bg-[#3F8F57]/10 border-b border-[#3F8F57]/20">
          <p className="text-xs font-semibold text-[#3F8F57]">
            Signed in as {currentUser.fullName}
          </p>
          <p className="text-[10px] text-gray-500">{currentUser.email}</p>
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.screen}
            type="button"
            onClick={() => onNavigate(item.screen)}
            className="w-full bg-white rounded-2xl px-4 py-3.5 flex items-center justify-between shadow-sm active:scale-98 transition-transform"
          >
            <span className="text-sm font-semibold text-gray-800">
              {item.label}
            </span>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
}

function SignInScreen({
  onNavigate,
  registeredUsers,
  onLogin,
}: {
  onNavigate: (s: Screen) => void;
  registeredUsers: RegisteredUser[];
  onLogin: (user: CurrentUser) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = () => {
    setError("");
    const user = registeredUsers.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password,
    );
    if (user) {
      onLogin({ fullName: user.fullName, email: user.email });
      onNavigate("menu");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ background: "#F5EDD8" }}
    >
      <SettingsHeader title="SIGN IN" onBack={() => onNavigate("settings")} />
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <AppInput
          label="Email / Username"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="Enter your email"
        />
        <AppInput
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Enter your password"
        />

        <div className="flex items-center gap-2 mb-5">
          <button
            type="button"
            onClick={() => setRememberMe(!rememberMe)}
            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${rememberMe ? "bg-[#3F8F57] border-[#3F8F57]" : "border-gray-300 bg-white"}`}
          >
            {rememberMe && <Check size={10} className="text-white" />}
          </button>
          <span className="text-xs text-gray-600">Remember Me</span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-4">
            <p className="text-xs text-red-500 font-medium">{error}</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleSignIn}
          className="w-full bg-gray-900 text-white font-bold text-sm py-3.5 rounded-2xl active:scale-95 transition-transform mb-4"
        >
          SIGN IN
        </button>

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate("forgotpassword")}
            className="text-xs text-[#3F8F57] font-semibold"
          >
            Forgot Password
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={() => onNavigate("register")}
            className="text-xs text-[#3F8F57] font-semibold"
          >
            Register
          </button>
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          <p className="text-[10px] text-amber-700 font-medium">
            Demo account: demo@protein.com / 1234
          </p>
        </div>
      </div>
    </div>
  );
}

function ForgotPasswordScreen({
  onNavigate,
}: { onNavigate: (s: Screen) => void }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ background: "#F5EDD8" }}
    >
      <SettingsHeader
        title="FORGOT PASSWORD"
        onBack={() => onNavigate("signin")}
      />
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="text-sm text-gray-600 mb-5 leading-relaxed">
          Enter your email address to reset your password
        </p>
        <AppInput
          label="Email Address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="Enter your email"
        />
        {sent ? (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mt-2">
            <p className="text-xs text-green-700 font-medium leading-relaxed">
              A password reset email has been sent to your registered email
              address
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setSent(true)}
            className="w-full bg-[#3F8F57] text-white font-bold text-sm py-3.5 rounded-2xl active:scale-95 transition-transform mt-2"
          >
            SEND RESET EMAIL
          </button>
        )}
      </div>
    </div>
  );
}

function RegisterScreen({
  onNavigate,
  onRegister,
}: {
  onNavigate: (s: Screen) => void;
  onRegister: (user: RegisteredUser) => void;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleRegister = () => {
    setError("");
    if (!fullName || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    onRegister({ fullName, email, password });
    setSuccess(true);
    setTimeout(() => onNavigate("menu"), 2000);
  };

  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ background: "#F5EDD8" }}
    >
      <SettingsHeader title="REGISTER" onBack={() => onNavigate("signin")} />
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {success ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Check size={28} className="text-[#3F8F57]" />
            </div>
            <p className="text-sm font-semibold text-gray-800 leading-relaxed">
              You have successfully registered on the PROTEIN HULK app
            </p>
            <p className="text-xs text-gray-400 mt-2">Redirecting to menu...</p>
          </div>
        ) : (
          <>
            <AppInput
              label="Full Name"
              value={fullName}
              onChange={setFullName}
              placeholder="Enter your full name"
            />
            <AppInput
              label="Username (Email)"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Enter your email"
            />
            <AppInput
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Create a password"
            />
            <AppInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Confirm your password"
            />
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-3 py-2 mb-3">
                <p className="text-xs text-red-500 font-medium">{error}</p>
              </div>
            )}
            <button
              type="button"
              onClick={handleRegister}
              className="w-full bg-[#3F8F57] text-white font-bold text-sm py-3.5 rounded-2xl active:scale-95 transition-transform"
            >
              REGISTER
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function AboutUsScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ background: "#F5EDD8" }}
    >
      <SettingsHeader title="ABOUT US" onBack={() => onNavigate("settings")} />
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-black text-base text-gray-900">PROTEIN </span>
            <span className="font-black text-base text-[#3F8F57]">HULK</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Protein Hulk is a smart drink vending kiosk app designed to help you
            achieve your nutrition goals. We provide personalized healthy drinks
            tailored to your unique fitness journey — whether you want to bulk,
            cut, maintain, or simply boost your daily energy.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Our intelligent recommendation system analyzes your target calories,
            protein, carbs, and fats to suggest the perfect drink from our
            premium menu of 23+ freshly prepared options.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Find your nearest Protein Hulk kiosk, customize your drink with the
            perfect sugar level, and fuel your body the smart way.
          </p>
        </div>
      </div>
    </div>
  );
}

function ReportBugScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ background: "#F5EDD8" }}
    >
      <SettingsHeader
        title="REPORT A BUG"
        onBack={() => onNavigate("settings")}
      />
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="text-xs text-gray-500 mb-4">
          Tell us what went wrong and we will fix it
        </p>
        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-green-700">
              Thank you! Your report has been submitted.
            </p>
          </div>
        ) : (
          <>
            <AppInput
              label="Subject"
              value={subject}
              onChange={setSubject}
              placeholder="Brief description of the issue"
            />
            <div className="mb-4">
              <label
                htmlFor="bug-description"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Description
              </label>
              <textarea
                id="bug-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the bug in detail..."
                rows={5}
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#3F8F57] transition-colors resize-none"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (subject || description) setSubmitted(true);
              }}
              className="w-full bg-[#3F8F57] text-white font-bold text-sm py-3.5 rounded-2xl active:scale-95 transition-transform"
            >
              SUBMIT
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function ReviewRatingScreen({
  onNavigate,
}: { onNavigate: (s: Screen) => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ background: "#F5EDD8" }}
    >
      <SettingsHeader
        title="REVIEW & RATING"
        onBack={() => onNavigate("settings")}
      />
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <p className="text-sm font-semibold text-green-700">
              Thank you for your review!
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <p className="text-xs font-semibold text-gray-700 mb-3">
                Rate your experience
              </p>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="active:scale-90 transition-transform"
                  >
                    <Star
                      size={28}
                      className={
                        star <= rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-xs text-center text-gray-500 mt-2">
                  {
                    ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                      rating
                    ]
                  }
                </p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="review-comment"
                className="block text-xs font-semibold text-gray-700 mb-1.5"
              >
                Comment (optional)
              </label>
              <textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={4}
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#3F8F57] transition-colors resize-none"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (rating > 0) setSubmitted(true);
              }}
              disabled={rating === 0}
              className={`w-full font-bold text-sm py-3.5 rounded-2xl transition-all ${rating > 0 ? "bg-[#3F8F57] text-white active:scale-95" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
            >
              SUBMIT REVIEW
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Screen 2: Menu ───────────────────────────────────────────────────────────
function MenuScreen({
  cart,
  onAddToCart,
  onNavigate,
  currentUser,
  onUpdateCartQty,
  onRemoveCartItem,
  onClearCart,
}: {
  cart: CartItem[];
  onAddToCart: (drinkId: number, sugarPct: number, qty: number) => void;
  onNavigate: (s: Screen) => void;
  currentUser: CurrentUser | null;
  onUpdateCartQty: (drinkId: number, newQty: number) => void;
  onRemoveCartItem: (drinkId: number) => void;
  onClearCart: () => void;
}) {
  const [activeCategory, setActiveCategory] =
    useState<Drink["category"]>("Protein");
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const filteredDrinks = drinks.filter((d) => d.category === activeCategory);
  const cartTotal = cart.reduce((sum, ci) => {
    const d = drinks.find((x) => x.id === ci.drinkId);
    return sum + (d ? d.price * ci.qty : 0);
  }, 0);

  return (
    <div
      className="relative w-full h-full flex flex-col"
      style={{ background: "#F5EDD8" }}
    >
      {/* Fruit Banner */}
      <FruitBanner />

      {/* Header row */}
      <div className="flex items-center px-3 py-2 bg-white">
        <button
          type="button"
          data-ocid="menu.find_kiosk_button"
          className="p-1.5 rounded-full bg-gray-50"
          onClick={() => onNavigate("map")}
        >
          <MapPin size={14} className="text-[#3F8F57]" />
        </button>
        <div className="flex-1 text-center">
          <span className="font-black text-sm text-gray-900">PROTEIN </span>
          <span className="font-black text-sm text-[#3F8F57]">HULK</span>
        </div>
        <button
          type="button"
          onClick={() => onNavigate("settings")}
          className="p-1.5 rounded-full bg-gray-50"
        >
          <Settings size={14} className="text-gray-500" />
        </button>
      </div>

      {/* Welcome message */}
      {currentUser && (
        <div className="px-3 pt-1.5 pb-0 bg-white">
          <p className="text-[11px] font-semibold text-[#3F8F57]">
            Welcome, {currentUser.fullName.split(" ")[0]} 👋
          </p>
        </div>
      )}

      {/* CTA button */}
      <div className="px-3 py-2 bg-white">
        <button
          type="button"
          data-ocid="menu.create_drink_button"
          onClick={() => onNavigate("goal")}
          className="w-full bg-[#3F8F57] text-white font-bold text-xs py-3 rounded-2xl active:scale-95 transition-transform"
        >
          🎯 CREATE YOUR OWN DRINK
        </button>
      </div>

      {/* Category tabs — 4 always visible */}
      <div className="grid grid-cols-4 gap-1 px-3 py-2 bg-white border-b border-gray-100">
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat}
            data-ocid={`menu.${cat.toLowerCase().replace(/ /g, "_")}.tab`}
            onClick={() => setActiveCategory(cat)}
            className={`py-1.5 rounded-xl text-[9px] font-semibold transition-all ${
              activeCategory === cat
                ? "bg-[#3F8F57] text-white shadow-sm"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Drink grid — scrollable */}
      <div className="flex-1 overflow-y-auto px-3 py-2 pb-24 scrollbar-hide">
        <div className="grid grid-cols-2 gap-2">
          {filteredDrinks.map((drink, idx) => (
            <motion.button
              type="button"
              key={drink.id}
              data-ocid={`menu.drink.item.${idx + 1}`}
              onClick={() => setSelectedDrink(drink)}
              className="bg-white rounded-2xl overflow-hidden shadow-card text-left active:scale-95 transition-transform"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={drink.image}
                  alt={drink.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent)
                      parent.innerHTML =
                        "<div class='w-full h-full flex items-center justify-center text-3xl bg-green-50'>🥤</div>";
                  }}
                />
              </div>
              <div className="p-2">
                <p className="font-semibold text-[10px] text-gray-900 leading-tight truncate">
                  {drink.name}
                </p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[9px] text-gray-400">
                    {drink.kcal} kcal
                  </span>
                  <span className="text-[10px] font-bold text-[#3F8F57]">
                    ${drink.price.toFixed(2)}
                  </span>
                </div>
                {drink.tag && (
                  <span className="inline-block mt-1 text-[8px] bg-green-50 text-[#3F8F57] border border-green-200 rounded-full px-1.5 py-0.5 leading-none">
                    {drink.tag}
                  </span>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Bottom bar — tappable to open cart */}
      <button
        type="button"
        className="absolute bottom-0 left-0 right-0 bg-[#1F3D2B] px-3 py-2 cursor-pointer active:brightness-90 transition-all text-left"
        onClick={() => setCartOpen(true)}
      >
        <div className="mb-1 space-y-0.5">
          {cart.length === 0 ? (
            <p className="text-[9px] text-green-300 opacity-60">
              Tap to view cart · $0.00
            </p>
          ) : (
            cart.map((ci) => {
              const d = drinks.find((x) => x.id === ci.drinkId);
              return d ? (
                <p
                  key={ci.drinkId}
                  className="text-[9px] text-green-200 truncate"
                >
                  {d.name} ×{ci.qty} — {d.kcal} kcal — {ci.sugarPct}%
                </p>
              ) : null;
            })
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <ShoppingCart size={12} className="text-green-300" />
            <span className="text-xs font-bold text-white">
              Total: ${cartTotal.toFixed(2)}
            </span>
          </div>
          <button
            type="button"
            data-ocid="menu.order_button"
            onClick={(e) => {
              e.stopPropagation();
              if (cart.length > 0) onNavigate("checkout");
            }}
            disabled={cart.length === 0}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              cart.length === 0
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-[#3F8F57] text-white active:scale-95"
            }`}
          >
            ORDER
          </button>
        </div>
      </button>

      {/* Bottom sheet + Cart */}
      <AnimatePresence>
        {selectedDrink && (
          <DrinkBottomSheet
            drink={selectedDrink}
            onClose={() => setSelectedDrink(null)}
            cart={cart}
            onAddToCart={onAddToCart}
          />
        )}
        {cartOpen && (
          <CartSheet
            cart={cart}
            onClose={() => setCartOpen(false)}
            onUpdateQty={onUpdateCartQty}
            onRemoveItem={onRemoveCartItem}
            onClearCart={onClearCart}
            onNavigate={onNavigate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Screen 3: Goal Selection ─────────────────────────────────────────────────
function GoalScreen({
  selectedGoal,
  onSelectGoal,
  onNavigate,
}: {
  selectedGoal: string;
  onSelectGoal: (g: string) => void;
  onNavigate: (s: Screen) => void;
}) {
  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ background: "#F5EDD8" }}
    >
      <FruitBanner />
      {/* Header */}
      <div className="px-4 pt-3 pb-2">
        <button
          type="button"
          onClick={() => onNavigate("menu")}
          className="flex items-center gap-1 text-gray-500 text-xs mb-2"
        >
          <ChevronLeft size={14} /> Menu
        </button>
        <h2 className="font-black text-xl text-gray-900">SELECT YOUR GOAL</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Choose a goal to tailor your drink
        </p>
      </div>
      {/* Goal list */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 scrollbar-hide">
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {GOALS.map((goal, idx) => (
            <button
              type="button"
              key={goal}
              data-ocid={`goal.item.${idx + 1}`}
              onClick={() => onSelectGoal(goal)}
              className={`w-full flex items-center justify-between px-4 py-3 transition-all ${
                idx < GOALS.length - 1 ? "border-b border-gray-50" : ""
              } ${selectedGoal === goal ? "bg-[#3F8F57]" : "hover:bg-gray-50"}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-semibold ${
                    selectedGoal === goal ? "text-white" : "text-gray-800"
                  }`}
                >
                  {goal}
                </span>
              </div>
              {selectedGoal === goal && (
                <Check size={14} className="text-white" />
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Next button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#F5EDD8]">
        <button
          type="button"
          data-ocid="goal.next_button"
          onClick={() => {
            if (selectedGoal) onNavigate("target");
          }}
          disabled={!selectedGoal}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm transition-all ${
            selectedGoal
              ? "bg-[#3F8F57] text-white active:scale-95"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          NEXT
        </button>
      </div>
    </div>
  );
}

// ─── Screen 4: Set Your Target ────────────────────────────────────────────────
function TargetScreen({
  selectedGoal,
  targetCalories,
  setTargetCalories,
  targetProtein,
  setTargetProtein,
  targetCarbs,
  setTargetCarbs,
  targetFats,
  setTargetFats,
  dietType,
  setDietType,
  onNavigate,
}: {
  selectedGoal: string;
  targetCalories: number;
  setTargetCalories: (v: number) => void;
  targetProtein: number;
  setTargetProtein: (v: number) => void;
  targetCarbs: number;
  setTargetCarbs: (v: number) => void;
  targetFats: number;
  setTargetFats: (v: number) => void;
  dietType: "vegan" | "non-vegan";
  setDietType: (v: "vegan" | "non-vegan") => void;
  onNavigate: (s: Screen) => void;
}) {
  const range = GOAL_RANGES[selectedGoal] ?? GOAL_RANGES.Bulk;
  const showHint =
    targetCalories < range.cal[0] || targetCalories > range.cal[1];

  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ background: "#F5EDD8" }}
    >
      <FruitBanner />
      <div className="flex-1 overflow-y-auto px-3 py-3 pb-24 scrollbar-hide space-y-3">
        {/* Back + title */}
        <div>
          <button
            type="button"
            onClick={() => onNavigate("goal")}
            className="flex items-center gap-1 text-gray-500 text-xs mb-1"
          >
            <ChevronLeft size={14} /> Goals
          </button>
          <h2 className="font-black text-xl text-gray-900">SET YOUR TARGET</h2>
          <div className="inline-block mt-1 bg-[#3F8F57] text-white text-xs font-bold px-3 py-1 rounded-full">
            GOAL: {selectedGoal.toUpperCase()}
          </div>
        </div>

        {/* Calories card */}
        <div className="bg-white rounded-2xl p-3 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700">
              Target Calories
            </span>
            <span className="bg-green-50 text-[#3F8F57] text-xs font-bold px-2.5 py-0.5 rounded-full border border-green-100">
              {targetCalories} kcal
            </span>
          </div>
          <input
            type="range"
            min={range.cal[0]}
            max={range.cal[1]}
            step={5}
            value={targetCalories}
            onChange={(e) => setTargetCalories(Number(e.target.value))}
            className="green-slider w-full"
            data-ocid="target.calories_input"
          />
          <div className="flex justify-between text-[9px] text-gray-400 mt-1">
            <span>{range.cal[0]} kcal</span>
            <span className="italic">Range based on your selected goal</span>
            <span>{range.cal[1]} kcal</span>
          </div>
        </div>

        {/* Macros card */}
        <div className="bg-white rounded-2xl p-3 shadow-card space-y-3">
          <p className="text-xs font-semibold text-gray-700">Macros</p>
          {[
            {
              label: "Protein",
              val: targetProtein,
              set: setTargetProtein,
              min: range.protein[0],
              max: range.protein[1],
              unit: "g",
            },
            {
              label: "Carbs",
              val: targetCarbs,
              set: setTargetCarbs,
              min: range.carbs[0],
              max: range.carbs[1],
              unit: "g",
            },
            {
              label: "Healthy Fats",
              val: targetFats,
              set: setTargetFats,
              min: range.fats[0],
              max: range.fats[1],
              unit: "g",
            },
          ].map((m) => (
            <div key={m.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-gray-600">{m.label}</span>
                <span className="text-[10px] font-bold text-[#3F8F57]">
                  {m.val}
                  {m.unit}
                </span>
              </div>
              <input
                type="range"
                min={m.min}
                max={m.max}
                step={0.5}
                value={m.val}
                onChange={(e) => m.set(Number(e.target.value))}
                className="green-slider w-full"
              />
            </div>
          ))}
          <p className="text-[9px] text-gray-400 italic">
            Adjusted based on your calorie selection and available drinks
          </p>
        </div>

        {/* Diet type */}
        <div className="bg-white rounded-2xl p-3 shadow-card">
          <p className="text-xs font-semibold text-gray-700 mb-2">Diet Type</p>
          <div className="flex gap-2">
            {(["vegan", "non-vegan"] as const).map((type) => (
              <button
                type="button"
                key={type}
                data-ocid={`target.${type}_toggle`}
                onClick={() => setDietType(type)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  dietType === type
                    ? "bg-[#3F8F57] text-white border-[#3F8F57]"
                    : "bg-white text-gray-500 border-gray-200"
                }`}
              >
                {type === "vegan" ? "🌱 Vegan" : "🥩 Non-Vegan"}
              </button>
            ))}
          </div>
        </div>

        {/* Hint */}
        {showHint && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
            <p className="text-[10px] text-amber-700 font-medium">
              ⚠️ Fewer drinks match this selection
            </p>
          </div>
        )}
      </div>

      {/* Confirm button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#F5EDD8]">
        <button
          type="button"
          data-ocid="target.confirm_button"
          onClick={() => onNavigate("matching")}
          className="w-full bg-[#3F8F57] text-white py-3.5 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
        >
          CONFIRM
        </button>
      </div>
    </div>
  );
}

// ─── Screen 5: Matching Drinks ────────────────────────────────────────────────
function MatchingScreen({
  targetCalories,
  targetProtein,
  targetCarbs,
  targetFats,
  selectedGoal,
  cart,
  onAddToCart,
  onNavigate,
  onUpdateCartQty,
  onRemoveCartItem,
  onClearCart,
}: {
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFats: number;
  selectedGoal: string;
  cart: CartItem[];
  onAddToCart: (drinkId: number, sugarPct: number, qty: number) => void;
  onNavigate: (s: Screen) => void;
  onUpdateCartQty: (drinkId: number, newQty: number) => void;
  onRemoveCartItem: (drinkId: number) => void;
  onClearCart: () => void;
}) {
  const [selectedDrink, setSelectedDrink] = useState<Drink | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const range = GOAL_RANGES[selectedGoal] ?? GOAL_RANGES.Bulk;

  const filtered = drinks.filter(
    (d) =>
      d.kcal >= range.cal[0] &&
      d.kcal <= range.cal[1] &&
      d.protein >= range.protein[0] &&
      d.protein <= range.protein[1] &&
      d.fats >= range.fats[0] &&
      d.fats <= range.fats[1] &&
      d.carbs >= range.carbs[0] &&
      d.carbs <= range.carbs[1],
  );

  const score = (d: Drink) =>
    Math.abs(d.kcal - targetCalories) / 100 +
    Math.abs(d.protein - targetProtein) +
    Math.abs(d.carbs - targetCarbs) +
    Math.abs(d.fats - targetFats);

  const ranked = [...filtered].sort((a, b) => score(a) - score(b));

  const getMatchLabel = (drink: Drink) => {
    const s = score(drink);
    const calDiff = drink.kcal - targetCalories;
    if (s <= 5)
      return { label: "Exact Match", color: "bg-green-100 text-green-700" };
    if (s <= 15)
      return { label: "Close Match", color: "bg-blue-100 text-blue-700" };
    if (calDiff > 0)
      return { label: "Above Match", color: "bg-amber-100 text-amber-700" };
    return { label: "Below Match", color: "bg-purple-100 text-purple-700" };
  };

  const getKcalDiff = (drink: Drink) => {
    const diff = drink.kcal - targetCalories;
    if (diff === 0) return null;
    return diff > 0 ? `+${diff} kcal` : `${diff} kcal`;
  };

  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ background: "#F5EDD8" }}
    >
      <FruitBanner />
      <div className="flex-1 overflow-y-auto px-3 py-3 pb-24 scrollbar-hide">
        {/* Title */}
        <div className="mb-3">
          <button
            type="button"
            onClick={() => onNavigate("target")}
            className="flex items-center gap-1 text-gray-500 text-xs mb-1"
          >
            <ChevronLeft size={14} /> Target
          </button>
          <h2 className="font-black text-xl text-gray-900">MATCHING DRINKS</h2>
          <p className="text-xs text-gray-500">
            Drinks close to your selected target
          </p>
        </div>

        {/* Summary card */}
        <div className="bg-white rounded-2xl p-3 shadow-card mb-3">
          <div className="grid grid-cols-4 gap-1 mb-2">
            {[
              { label: "Calories", val: `${targetCalories}kcal` },
              { label: "Protein", val: `${targetProtein}g` },
              { label: "Carbs", val: `${targetCarbs}g` },
              { label: "Fats", val: `${targetFats}g` },
            ].map((s) => (
              <div
                key={s.label}
                className="text-center bg-gray-50 rounded-xl p-1.5"
              >
                <div className="font-bold text-[10px] text-gray-900">
                  {s.val}
                </div>
                <div className="text-[9px] text-gray-400">{s.label}</div>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-gray-400 italic text-center">
            Showing drinks within your selected goal range
          </p>
        </div>

        {/* Ranked list */}
        <div className="space-y-2">
          {ranked.map((drink, idx) => {
            const { label, color } = getMatchLabel(drink);
            const diff = getKcalDiff(drink);
            return (
              <motion.button
                type="button"
                key={drink.id}
                data-ocid={`matching.drink.item.${idx + 1}`}
                onClick={() => setSelectedDrink(drink)}
                className="w-full bg-white rounded-2xl p-2.5 shadow-card flex items-center gap-2.5 active:scale-98 transition-transform"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={drink.image}
                    alt={drink.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="font-bold text-[11px] text-gray-900 truncate flex-1">
                      {drink.name}
                    </p>
                    <span
                      className={`text-[8px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${color}`}
                    >
                      {label}
                    </span>
                  </div>
                  <div className="flex gap-2 text-[9px] text-gray-500">
                    <span>{drink.kcal} kcal</span>
                    <span>P:{drink.protein}g</span>
                    <span>C:{drink.carbs}g</span>
                    <span>F:{drink.fats}g</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-bold text-[10px] text-[#3F8F57]">
                      ${drink.price.toFixed(2)}
                    </span>
                    {diff && (
                      <span className="text-[8px] text-gray-400">{diff}</span>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-[#1F3D2B] flex gap-2">
        <button
          type="button"
          data-ocid="matching.back_to_menu_button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate("menu");
          }}
          className="flex-1 py-3 rounded-2xl font-bold text-xs border-2 border-[#3F8F57] text-[#3F8F57] bg-white active:scale-95 transition-transform"
        >
          ← Back to Menu
        </button>
        <button
          type="button"
          data-ocid="matching.continue_to_cart_button"
          onClick={(e) => {
            e.stopPropagation();
            if (cart.length > 0) setCartOpen(true);
          }}
          disabled={cart.length === 0}
          className={`flex-1 py-3 rounded-2xl font-bold text-xs transition-all ${
            cart.length === 0
              ? "bg-gray-200 text-gray-400"
              : "bg-[#3F8F57] text-white active:scale-95"
          }`}
        >
          View Cart →
        </button>
      </div>

      {/* Bottom sheet + Cart */}
      <AnimatePresence>
        {selectedDrink && (
          <DrinkBottomSheet
            drink={selectedDrink}
            onClose={() => setSelectedDrink(null)}
            cart={cart}
            onAddToCart={onAddToCart}
          />
        )}
        {cartOpen && (
          <CartSheet
            cart={cart}
            onClose={() => setCartOpen(false)}
            onUpdateQty={onUpdateCartQty}
            onRemoveItem={onRemoveCartItem}
            onClearCart={onClearCart}
            onNavigate={onNavigate}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Screen 6: Checkout ───────────────────────────────────────────────────────
function SuccessPopup({
  onDone,
}: {
  onDone: () => void;
}) {
  const [phase, setPhase] = useState(0);
  // phase 0: initial, 1: order received, 2: preparing, 3: dispensing, 4: done

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3000),
      setTimeout(() => setPhase(4), 4000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const statusText =
    phase < 3
      ? "Preparing your drink..."
      : phase === 3
        ? "Will be ready in 1 min"
        : "Thank you 🙏";

  const steps = [
    { label: "Order received", done: phase >= 1 },
    { label: "Preparing drink", done: phase >= 2 },
    { label: "Dispensing", done: phase >= 3 },
  ];

  // fill progress: 0→1 over phases 0-3
  const fillPct = Math.min(100, phase * 33.3);

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <style>{`
        @keyframes liquidRise {
          from { height: 0%; }
          to { height: 100%; }
        }
        @keyframes glassGlow {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(63,143,87,0.4)); }
          50% { filter: drop-shadow(0 0 10px rgba(63,143,87,0.8)); }
        }
        @keyframes userPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.5; }
        }
      `}</style>
      <div className="absolute inset-0 bg-black/60" />
      <motion.div
        data-ocid="checkout.success_state"
        className="relative bg-white rounded-3xl mx-4 p-5 text-center shadow-2xl min-w-64"
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 280 }}
      >
        <h3 className="font-black text-xl text-[#3F8F57] mb-0.5">
          ORDER SUCCESS
        </h3>
        <p className="text-xs font-semibold text-gray-600 mb-3">
          Order #00000001
        </p>

        {/* Animated glass SVG */}
        <div
          className="flex justify-center mb-3"
          style={{ animation: "glassGlow 2s ease-in-out infinite" }}
        >
          <svg
            width="64"
            height="80"
            viewBox="0 0 64 80"
            fill="none"
            role="img"
            aria-label="Drink glass filling animation"
          >
            {/* Glass outline */}
            <path
              d="M10 4 L6 76 L58 76 L54 4 Z"
              stroke="#3F8F57"
              strokeWidth="3"
              fill="none"
              strokeLinejoin="round"
            />
            {/* Clip mask for liquid */}
            <defs>
              <clipPath id="glassClip">
                <path d="M10 4 L6 76 L58 76 L54 4 Z" />
              </clipPath>
            </defs>
            {/* Liquid fill — animated via inline style */}
            <g clipPath="url(#glassClip)">
              <rect
                x="0"
                y={76 - (72 * fillPct) / 100}
                width="64"
                height={(72 * fillPct) / 100}
                fill="url(#liquidGrad)"
                style={{ transition: "y 0.8s ease, height 0.8s ease" }}
              />
            </g>
            <defs>
              <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5ab87a" />
                <stop offset="100%" stopColor="#2d7a45" />
              </linearGradient>
            </defs>
            {/* Straw */}
            <rect
              x="36"
              y="0"
              width="4"
              height="40"
              rx="2"
              fill="#3F8F57"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Status text */}
        <motion.p
          key={statusText}
          className="text-sm font-semibold text-gray-700 mb-3"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {statusText}
        </motion.p>

        {/* Steps */}
        <div className="space-y-1.5 mb-4 text-left">
          {steps.map((step) => (
            <div key={step.label} className="flex items-center gap-2">
              <span
                className={`text-sm ${step.done ? "text-[#3F8F57]" : "text-gray-300"}`}
              >
                {step.done ? "✔" : "⏳"}
              </span>
              <span
                className={`text-xs ${step.done ? "text-gray-800 font-medium" : "text-gray-400"}`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>

        {/* Done button — appears after phase 4 */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.button
              type="button"
              data-ocid="checkout.done_button"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onDone}
              className="w-full bg-[#3F8F57] text-white py-3 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
            >
              Done
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

function CheckoutScreen({
  cart,
  onNavigate,
  onClearCart,
}: {
  cart: CartItem[];
  onNavigate: (s: Screen) => void;
  onClearCart: () => void;
}) {
  const [showSuccess, setShowSuccess] = useState(false);

  const subtotal = cart.reduce((sum, ci) => {
    const d = drinks.find((x) => x.id === ci.drinkId);
    return sum + (d ? d.price * ci.qty : 0);
  }, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div
      className="relative w-full h-full flex flex-col"
      style={{ background: "#F5EDD8" }}
    >
      {/* Header */}
      <div className="bg-white px-4 pt-10 pb-3 flex items-center gap-2 shadow-xs">
        <button
          type="button"
          onClick={() => onNavigate("menu")}
          className="p-1.5 rounded-full bg-gray-50"
        >
          <ChevronLeft size={16} className="text-gray-600" />
        </button>
        <h2 className="font-black text-lg text-gray-900 flex-1">Checkout</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 pb-24 scrollbar-hide space-y-3">
        {/* Info rows */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {[
            { label: "Machine ID", value: "#H2024" },
            { label: "Payment", value: "💳 Card" },
            { label: "Promos", value: "None" },
          ].map((row, i) => (
            <div
              key={row.label}
              className={`flex items-center justify-between px-4 py-2.5 ${
                i < 2 ? "border-b border-gray-50" : ""
              }`}
            >
              <span className="text-xs text-gray-500">{row.label}</span>
              <span className="text-xs font-semibold text-gray-900">
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* Items */}
        <div>
          <p className="text-xs font-bold text-gray-700 mb-2">Your Order</p>
          {cart.length === 0 ? (
            <div
              className="bg-white rounded-2xl p-4 text-center"
              data-ocid="checkout.empty_state"
            >
              <p className="text-sm text-gray-400">No items in cart</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cart.map((ci, idx) => {
                const d = drinks.find((x) => x.id === ci.drinkId);
                if (!d) return null;
                return (
                  <div
                    key={ci.drinkId}
                    data-ocid={`checkout.item.${idx + 1}`}
                    className="bg-white rounded-2xl p-3 shadow-card flex gap-3"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={d.image}
                        alt={d.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-xs text-gray-900">
                            {d.name} ×{ci.qty}
                          </p>
                          <p className="text-[9px] text-gray-500 mt-0.5">
                            {d.kcal} kcal · Sugar {ci.sugarPct}%
                          </p>
                          <div className="flex gap-1.5 mt-0.5 text-[8px] text-gray-400">
                            <span>P:{d.protein}g</span>
                            <span>C:{d.carbs}g</span>
                            <span>F:{d.fats}g</span>
                          </div>
                        </div>
                        <span className="font-bold text-xs text-[#3F8F57] flex-shrink-0">
                          ${(d.price * ci.qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Totals */}
        <div className="bg-white rounded-2xl p-3 shadow-card space-y-2">
          {[
            { label: "Subtotal", val: `$${subtotal.toFixed(2)}`, bold: false },
            { label: "Taxes (8%)", val: `$${tax.toFixed(2)}`, bold: false },
            { label: "Total", val: `$${total.toFixed(2)}`, bold: true },
          ].map((row) => (
            <div key={row.label} className="flex justify-between">
              <span
                className={`text-xs ${
                  row.bold ? "font-black text-gray-900" : "text-gray-500"
                }`}
              >
                {row.label}
              </span>
              <span
                className={`text-xs ${
                  row.bold ? "font-black text-[#3F8F57]" : "text-gray-700"
                }`}
              >
                {row.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Make payment button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#F5EDD8]">
        <button
          type="button"
          data-ocid="checkout.make_payment_button"
          onClick={() => setShowSuccess(true)}
          className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-sm active:scale-95 transition-transform shadow-lg"
        >
          Make Payment
        </button>
      </div>

      {/* Success overlay */}
      <AnimatePresence>
        {showSuccess && (
          <SuccessPopup
            onDone={() => {
              setShowSuccess(false);
              onClearCart();
              onNavigate("menu");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Screen 7: Map ────────────────────────────────────────────────────────────
const kiosks = [
  {
    id: 1,
    name: "Hulk Kiosk - Downtown",
    hours: "8am–10pm",
    distance: "0.3 km",
    top: "30%",
    left: "45%",
    connected: true,
  },
  {
    id: 2,
    name: "Hulk Kiosk - Mall",
    hours: "9am–11pm",
    distance: "0.8 km",
    top: "55%",
    left: "65%",
    connected: false,
  },
  {
    id: 3,
    name: "Hulk Kiosk - Park",
    hours: "7am–9pm",
    distance: "1.2 km",
    top: "20%",
    left: "25%",
    connected: false,
  },
  {
    id: 4,
    name: "Hulk Kiosk - Station",
    hours: "6am–12am",
    distance: "1.5 km",
    top: "70%",
    left: "30%",
    connected: false,
  },
  {
    id: 5,
    name: "Hulk Kiosk - Beach",
    hours: "8am–8pm",
    distance: "2.1 km",
    top: "45%",
    left: "80%",
    connected: false,
  },
];

function MapScreen({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  const [zoom, setZoom] = useState(1);
  const [search, setSearch] = useState("");

  const filteredKiosks = kiosks.filter((k) =>
    k.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div
      className="w-full h-full flex flex-col"
      style={{ background: "#F5EDD8" }}
    >
      <style>{`
        @keyframes userPing {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.6); opacity: 0.3; }
        }
      `}</style>

      <FruitBanner />

      {/* Header */}
      <div className="flex items-center px-3 py-2 bg-white shadow-sm flex-shrink-0">
        <button
          type="button"
          data-ocid="map.back_button"
          onClick={() => onNavigate("menu")}
          className="p-1.5 rounded-full bg-gray-50 mr-2"
        >
          <ChevronLeft size={14} className="text-gray-600" />
        </button>
        <h2 className="font-black text-sm text-gray-900 flex-1">
          FIND A KIOSK
        </h2>
        <div className="flex items-center gap-0.5 text-[9px] text-green-600 bg-green-50 px-2 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block mr-0.5" />
          Auto-detected
        </div>
      </div>

      {/* Search */}
      <div className="px-3 py-2 bg-white border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1.5">
          <Navigation size={12} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search kiosks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="map.search_input"
            className="flex-1 bg-transparent text-xs outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Map */}
      <div
        className="relative flex-shrink-0 overflow-hidden"
        style={{ height: "220px" }}
      >
        {/* Map background grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "#e8f0e8",
            backgroundImage:
              "linear-gradient(#c8d8c8 1px, transparent 1px), linear-gradient(90deg, #c8d8c8 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        {/* Scalable inner map */}
        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
            transition: "transform 0.25s ease",
          }}
        >
          {/* Road overlays */}
          <div
            className="absolute"
            style={{
              top: "48%",
              left: 0,
              right: 0,
              height: "6px",
              background: "rgba(180,200,180,0.7)",
            }}
          />
          <div
            className="absolute"
            style={{
              left: "48%",
              top: 0,
              bottom: 0,
              width: "6px",
              background: "rgba(180,200,180,0.7)",
            }}
          />
          <div
            className="absolute"
            style={{
              top: "25%",
              left: 0,
              right: 0,
              height: "4px",
              background: "rgba(180,200,180,0.5)",
              transform: "rotate(-3deg)",
            }}
          />
          <div
            className="absolute"
            style={{
              left: "70%",
              top: 0,
              bottom: 0,
              width: "4px",
              background: "rgba(180,200,180,0.5)",
              transform: "rotate(4deg)",
            }}
          />

          {/* User location pin */}
          <div
            className="absolute"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
            }}
          >
            <div className="relative" style={{ width: 16, height: 16 }}>
              <div
                className="absolute inset-0 rounded-full bg-blue-400 opacity-40"
                style={{ animation: "userPing 1.4s ease-in-out infinite" }}
              />
              <div className="absolute inset-1 rounded-full bg-blue-600 border-2 border-white" />
            </div>
          </div>

          {/* Kiosk pins */}
          {kiosks.map((k) => (
            <div
              key={k.id}
              className="absolute flex flex-col items-center"
              style={{
                top: k.top,
                left: k.left,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div
                className={`rounded-full p-1 shadow-md ${
                  k.connected
                    ? "bg-[#3F8F57]"
                    : "bg-white border-2 border-[#3F8F57]"
                }`}
              >
                <MapPin
                  size={12}
                  className={k.connected ? "text-white" : "text-[#3F8F57]"}
                />
              </div>
              <div className="text-[7px] font-bold whitespace-nowrap mt-0.5 px-1 py-0.5 rounded bg-white/80 shadow-sm text-gray-700">
                {k.name.replace("Hulk Kiosk - ", "")}
              </div>
            </div>
          ))}
        </div>

        {/* Zoom controls */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
          <button
            type="button"
            data-ocid="map.zoom_in_button"
            onClick={() => setZoom((z) => Math.min(2, z + 0.2))}
            className="w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center active:scale-90 transition-transform"
          >
            <ZoomIn size={12} className="text-gray-600" />
          </button>
          <button
            type="button"
            data-ocid="map.zoom_out_button"
            onClick={() => setZoom((z) => Math.max(0.8, z - 0.2))}
            className="w-7 h-7 bg-white rounded-lg shadow flex items-center justify-center active:scale-90 transition-transform"
          >
            <ZoomOut size={12} className="text-gray-600" />
          </button>
        </div>

        {/* Connected badge */}
        <div className="absolute bottom-2 left-2 bg-[#3F8F57] text-white text-[9px] font-bold px-2 py-1 rounded-full shadow">
          ✓ Connected: Downtown
        </div>
      </div>

      {/* Kiosk list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide">
        <p className="text-[9px] text-gray-400 mb-1.5 font-medium">
          NEARBY KIOSKS
        </p>
        <div className="space-y-1.5">
          {filteredKiosks.map((k, idx) => (
            <div
              key={k.id}
              data-ocid={`map.kiosk.item.${idx + 1}`}
              className={`bg-white rounded-xl px-3 py-2 flex items-center gap-2 shadow-sm ${
                k.connected ? "border border-green-200" : ""
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  k.connected ? "bg-[#3F8F57]" : "bg-gray-300"
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-gray-900 truncate">
                  {k.name}
                  {k.connected && (
                    <span className="ml-1 text-[8px] bg-green-100 text-green-700 px-1 py-0.5 rounded-full">
                      Connected
                    </span>
                  )}
                </p>
                <p className="text-[9px] text-gray-400">{k.hours}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] font-bold text-[#3F8F57]">
                  {k.distance}
                </p>
                <p className="text-[8px] text-blue-500 font-medium">
                  Directions ›
                </p>
              </div>
            </div>
          ))}
          {filteredKiosks.length === 0 && (
            <div className="text-center py-4" data-ocid="map.kiosk.empty_state">
              <p className="text-xs text-gray-400">No kiosks found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Phone Frame ──────────────────────────────────────────────────────────────
function PhoneFrame({
  isActive,
  children,
  label,
  onClick,
}: {
  isActive: boolean;
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2 flex-shrink-0">
      <button
        type="button"
        onClick={onClick}
        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
          isActive
            ? "bg-[#3F8F57] text-white shadow-md"
            : "bg-white text-gray-500 border border-gray-200 hover:border-[#3F8F57] hover:text-[#3F8F57]"
        }`}
      >
        {label}
      </button>
      <div
        className="relative overflow-hidden"
        style={{
          width: 290,
          height: 628,
          borderRadius: 44,
          background: "#1a1a1a",
          boxShadow: isActive
            ? "0 30px 80px rgba(0,0,0,0.45), 0 0 0 3px #3F8F57, 0 0 30px rgba(63,143,87,0.35)"
            : "0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)",
          padding: "12px",
          transition: "box-shadow 0.3s ease",
        }}
      >
        {/* Inner screen */}
        <div
          className="w-full h-full overflow-hidden relative"
          style={{ borderRadius: 34, background: "#F5EDD8" }}
        >
          {children}
        </div>
        {/* Dynamic island */}
        <div
          className="absolute top-5 left-1/2 -translate-x-1/2 bg-black rounded-full"
          style={{ width: 90, height: 26 }}
        />
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activePhone, setActivePhone] = useState(0);

  // Shared state across all phones
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([
    { fullName: "Demo User", email: "demo@protein.com", password: "1234" },
  ]);
  const [selectedGoal, setSelectedGoal] = useState("Bulk");
  const [targetCalories, setTargetCalories] = useState(400);
  const [targetProtein, setTargetProtein] = useState(27);
  const [targetCarbs, setTargetCarbs] = useState(45);
  const [targetFats, setTargetFats] = useState(10);
  const [dietType, setDietType] = useState<"vegan" | "non-vegan">("non-vegan");

  useEffect(() => {
    const r = GOAL_RANGES[selectedGoal] ?? GOAL_RANGES.Bulk;
    setTargetCalories(Math.round((r.cal[0] + r.cal[1]) / 2));
    setTargetProtein(Math.round((r.protein[0] + r.protein[1]) / 2));
    setTargetCarbs(Math.round((r.carbs[0] + r.carbs[1]) / 2));
    setTargetFats(Math.round((r.fats[0] + r.fats[1]) / 2));
  }, [selectedGoal]);

  // Per-phone screen state (each phone is independently navigable)
  const [phoneScreens, setPhoneScreens] = useState<Screen[]>([
    "home",
    "menu",
    "goal",
    "target",
    "matching",
    "checkout",
    "checkout",
  ]);

  const navigatePhone = (phoneIdx: number, screen: Screen) => {
    setPhoneScreens((prev) => {
      const next = [...prev];
      next[phoneIdx] = screen;
      return next;
    });
  };

  const addToCart = (drinkId: number, sugarPct: number, qty = 1) => {
    setCart((prev) => {
      const totalItems = prev.reduce((s, c) => s + c.qty, 0);
      const remaining = 3 - totalItems;
      if (remaining <= 0) return prev;
      const addQty = Math.min(qty, remaining);
      const existing = prev.find((c) => c.drinkId === drinkId);
      if (existing) {
        return prev.map((c) =>
          c.drinkId === drinkId ? { ...c, qty: c.qty + addQty } : c,
        );
      }
      return [...prev, { drinkId, sugarPct, qty: addQty }];
    });
  };

  const clearCart = () => setCart([]);

  const updateCartQty = (drinkId: number, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((c) => c.drinkId !== drinkId));
    } else {
      setCart((prev) => {
        const others = prev.filter((c) => c.drinkId !== drinkId);
        const othersTotal = others.reduce((s, c) => s + c.qty, 0);
        const maxForThis = 3 - othersTotal;
        const clampedQty = Math.min(newQty, maxForThis);
        return prev.map((c) =>
          c.drinkId === drinkId ? { ...c, qty: clampedQty } : c,
        );
      });
    }
  };

  const removeCartItem = (drinkId: number) => {
    setCart((prev) => prev.filter((c) => c.drinkId !== drinkId));
  };

  const handleLogin = (user: CurrentUser) => {
    setCurrentUser(user);
  };

  const handleRegister = (user: RegisteredUser) => {
    setRegisteredUsers((prev) => [...prev, user]);
    setCurrentUser({ fullName: user.fullName, email: user.email });
  };

  const screenLabels = [
    "Home",
    "Menu",
    "Goal",
    "Target",
    "Matching",
    "Checkout",
    "Success",
  ];
  const screenKeys: Screen[] = [
    "home",
    "menu",
    "goal",
    "target",
    "matching",
    "checkout",
    "success",
  ];

  const renderScreen = (phoneIdx: number, screen: Screen) => {
    const navigate = (s: Screen) => {
      navigatePhone(phoneIdx, s);
      // Sync active phone when navigating to checkout from menu/matching
      if (s === "checkout") setActivePhone(5);
      if (s === "matching" && phoneIdx !== 4) setActivePhone(4);
    };

    switch (screen) {
      case "home":
        return <HomeScreen onNavigate={navigate} />;
      case "menu":
        return (
          <MenuScreen
            cart={cart}
            onAddToCart={addToCart}
            onNavigate={navigate}
            currentUser={currentUser}
            onUpdateCartQty={updateCartQty}
            onRemoveCartItem={removeCartItem}
            onClearCart={clearCart}
          />
        );
      case "goal":
        return (
          <GoalScreen
            selectedGoal={selectedGoal}
            onSelectGoal={setSelectedGoal}
            onNavigate={navigate}
          />
        );
      case "target":
        return (
          <TargetScreen
            selectedGoal={selectedGoal}
            targetCalories={targetCalories}
            setTargetCalories={setTargetCalories}
            targetProtein={targetProtein}
            setTargetProtein={setTargetProtein}
            targetCarbs={targetCarbs}
            setTargetCarbs={setTargetCarbs}
            targetFats={targetFats}
            setTargetFats={setTargetFats}
            dietType={dietType}
            setDietType={setDietType}
            onNavigate={navigate}
          />
        );
      case "matching":
        return (
          <MatchingScreen
            targetCalories={targetCalories}
            targetProtein={targetProtein}
            targetCarbs={targetCarbs}
            targetFats={targetFats}
            selectedGoal={selectedGoal}
            cart={cart}
            onAddToCart={addToCart}
            onNavigate={navigate}
            onUpdateCartQty={updateCartQty}
            onRemoveCartItem={removeCartItem}
            onClearCart={clearCart}
          />
        );
      case "checkout":
      case "success":
        return (
          <CheckoutScreen
            cart={cart}
            onNavigate={navigate}
            onClearCart={clearCart}
          />
        );
      case "map":
        return <MapScreen onNavigate={navigate} />;
      case "settings":
        return (
          <SettingsScreen onNavigate={navigate} currentUser={currentUser} />
        );
      case "signin":
        return (
          <SignInScreen
            onNavigate={navigate}
            registeredUsers={registeredUsers}
            onLogin={handleLogin}
          />
        );
      case "forgotpassword":
        return <ForgotPasswordScreen onNavigate={navigate} />;
      case "register":
        return (
          <RegisterScreen onNavigate={navigate} onRegister={handleRegister} />
        );
      case "aboutus":
        return <AboutUsScreen onNavigate={navigate} />;
      case "reportbug":
        return <ReportBugScreen onNavigate={navigate} />;
      case "reviewrating":
        return <ReviewRatingScreen onNavigate={navigate} />;
      default:
        return <HomeScreen onNavigate={navigate} />;
    }
  };

  return (
    <div
      className="min-h-screen font-poppins"
      style={{ background: "#F5EDD8" }}
    >
      {/* App header */}
      <div className="text-center pt-10 pb-6 px-6">
        <h1 className="font-black text-4xl">
          <span className="text-gray-900">PROTEIN </span>
          <span style={{ color: "#3F8F57" }}>HULK</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Interactive App Preview — 7 Connected Screens
        </p>
      </div>

      {/* Phones row */}
      <div className="w-full overflow-x-auto pb-8">
        <div className="flex gap-6 px-6 w-max mx-auto">
          {phoneScreens.map((screen, phoneIdx) => (
            <PhoneFrame
              key={screenLabels[phoneIdx]}
              isActive={activePhone === phoneIdx}
              label={screenLabels[phoneIdx]}
              onClick={() => setActivePhone(phoneIdx)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${phoneIdx}-${screen}`}
                  className="w-full h-full"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.18 }}
                >
                  {renderScreen(phoneIdx, screen)}
                </motion.div>
              </AnimatePresence>
            </PhoneFrame>
          ))}
        </div>
      </div>

      {/* Quick nav */}
      <div className="flex justify-center gap-2 flex-wrap px-6 pb-8">
        {screenKeys.map((sk, i) => (
          <button
            type="button"
            key={sk}
            data-ocid={`nav.${sk}.link`}
            onClick={() => {
              setActivePhone(i);
              navigatePhone(i, sk);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              phoneScreens[i] === sk && activePhone === i
                ? "bg-[#3F8F57] text-white border-[#3F8F57]"
                : "bg-white text-gray-600 border-gray-200 hover:border-[#3F8F57] hover:text-[#3F8F57]"
            }`}
          >
            {screenLabels[i]}
          </button>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center pb-8 text-xs text-gray-400">
        © {new Date().getFullYear()}. Built with ❤️ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#3F8F57] font-medium hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}
