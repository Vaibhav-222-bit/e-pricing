// ============================================================
// E-PRICING — Product Database (data.js)
// Simulates scraped data from popular e-commerce websites.
// In production, this data comes from real-time web scraping.
// ============================================================

const ECOMMERCE_SITES = [
    { name: "Amazon",          icon: "🟡", color: "#FF9900", domain: "amazon.in" },
    { name: "Flipkart",        icon: "🔵", color: "#2874F0", domain: "flipkart.com" },
    { name: "Croma",           icon: "🟢", color: "#2DB200", domain: "croma.com" },
    { name: "JioMart",         icon: "🔷", color: "#0078AD", domain: "jiomart.com" },
    { name: "Reliance Digital", icon: "🔴", color: "#E31837", domain: "reliancedigital.in" },
    { name: "Myntra",          icon: "🩷", color: "#FF3F6C", domain: "myntra.com" },
    { name: "Vijay Sales",     icon: "🟠", color: "#F26522", domain: "vijaysales.com" }
];

// ─── Formula Weights (used by pricing engine) ───────────────
const FORMULA_WEIGHTS = {
    price:    0.35,  // 35% weight — lower price = better score
    quality:  0.25,  // 25% weight — higher rating = better
    stock:    0.20,  // 20% weight — in stock = major advantage
    trust:    0.20   // 20% weight — verified + reviews = trust
};

// ─── Product Database ────────────────────────────────────────
// Each product has listings from multiple e-commerce sites
const PRODUCT_DATABASE = [
    {
        id: 1, name: "Samsung Galaxy S24 Ultra 256GB", category: "Smartphones", image: "📱",
        brand: "Samsung", specs: "Snapdragon 8 Gen 3, 12GB RAM, 200MP Camera, 5000mAh",
        sites: [
            { site: "Amazon",           price: 127499, mrp: 134999, rating: 4.5, reviews: 12453, inStock: true,  verified: true,  delivery: "Free, 2 days",  seller: "Appario Retail Pvt Ltd" },
            { site: "Flipkart",         price: 124999, mrp: 134999, rating: 4.4, reviews: 18234, inStock: true,  verified: true,  delivery: "Free, 1 day",   seller: "RetailNet" },
            { site: "Croma",            price: 131999, mrp: 134999, rating: 4.3, reviews: 2341,  inStock: true,  verified: true,  delivery: "₹99, 3 days",   seller: "Croma Official" },
            { site: "JioMart",          price: 126999, mrp: 134999, rating: 4.2, reviews: 5678,  inStock: false, verified: true,  delivery: "Free, 4 days",  seller: "JioMart Official" },
            { site: "Reliance Digital", price: 128999, mrp: 134999, rating: 4.4, reviews: 3456,  inStock: true,  verified: true,  delivery: "₹149, 3 days",  seller: "Reliance Retail" }
        ]
    },
    {
        id: 2, name: "Apple MacBook Air M3 13-inch 8GB/256GB", category: "Laptops", image: "💻",
        brand: "Apple", specs: "Apple M3 Chip, 8-core CPU, 10-core GPU, Liquid Retina Display",
        sites: [
            { site: "Amazon",           price: 112990, mrp: 119900, rating: 4.6, reviews: 8234,  inStock: true,  verified: true,  delivery: "Free, 2 days",  seller: "Appario Retail" },
            { site: "Flipkart",         price: 109990, mrp: 119900, rating: 4.5, reviews: 14567, inStock: true,  verified: true,  delivery: "Free, 1 day",   seller: "SuperComNet" },
            { site: "Croma",            price: 114900, mrp: 119900, rating: 4.5, reviews: 1890,  inStock: true,  verified: true,  delivery: "Free, 2 days",  seller: "Croma Official" },
            { site: "Reliance Digital", price: 113490, mrp: 119900, rating: 4.3, reviews: 2345,  inStock: true,  verified: true,  delivery: "Free, 3 days",  seller: "Reliance Retail" },
            { site: "Vijay Sales",      price: 111990, mrp: 119900, rating: 4.2, reviews: 876,   inStock: false, verified: true,  delivery: "₹199, 4 days",  seller: "Vijay Sales" }
        ]
    },
    {
        id: 3, name: "Sony WH-1000XM5 Wireless Headphones", category: "Audio", image: "🎧",
        brand: "Sony", specs: "30hr Battery, ANC, LDAC, Multipoint, 30mm Driver",
        sites: [
            { site: "Amazon",           price: 27990, mrp: 34990, rating: 4.5, reviews: 9876,  inStock: true,  verified: true,  delivery: "Free, 1 day",   seller: "Cloudtail India" },
            { site: "Flipkart",         price: 26990, mrp: 34990, rating: 4.4, reviews: 11234, inStock: true,  verified: true,  delivery: "Free, 2 days",  seller: "RetailNet" },
            { site: "Croma",            price: 29990, mrp: 34990, rating: 4.3, reviews: 1567,  inStock: true,  verified: true,  delivery: "₹49, 3 days",   seller: "Croma Official" },
            { site: "JioMart",          price: 28490, mrp: 34990, rating: 4.1, reviews: 2341,  inStock: true,  verified: false, delivery: "Free, 3 days",  seller: "TechZone India" },
            { site: "Reliance Digital", price: 28990, mrp: 34990, rating: 4.4, reviews: 1890,  inStock: false, verified: true,  delivery: "₹99, 4 days",   seller: "Reliance Retail" }
        ]
    },
    {
        id: 4, name: "iPhone 16 Pro 128GB", category: "Smartphones", image: "📱",
        brand: "Apple", specs: "A18 Pro chip, 48MP Camera, Titanium, USB-C, Action Button",
        sites: [
            { site: "Amazon",           price: 119900, mrp: 124900, rating: 4.6, reviews: 15672, inStock: true,  verified: true,  delivery: "Free, 1 day",  seller: "Appario Retail" },
            { site: "Flipkart",         price: 117900, mrp: 124900, rating: 4.5, reviews: 21345, inStock: true,  verified: true,  delivery: "Free, 1 day",  seller: "SuperComNet" },
            { site: "Croma",            price: 121900, mrp: 124900, rating: 4.4, reviews: 3456,  inStock: true,  verified: true,  delivery: "Free, 2 days", seller: "Croma Official" },
            { site: "JioMart",          price: 118900, mrp: 124900, rating: 4.3, reviews: 7890,  inStock: true,  verified: true,  delivery: "Free, 2 days", seller: "JioMart Official" },
            { site: "Vijay Sales",      price: 120900, mrp: 124900, rating: 4.2, reviews: 1234,  inStock: true,  verified: true,  delivery: "₹199, 3 days", seller: "Vijay Sales" }
        ]
    },
    {
        id: 5, name: "Dell XPS 15 i7 16GB RAM 512GB SSD", category: "Laptops", image: "💻",
        brand: "Dell", specs: "13th Gen Intel i7, 16GB DDR5, NVIDIA RTX 4050, 15.6\" OLED",
        sites: [
            { site: "Amazon",           price: 156990, mrp: 179990, rating: 4.3, reviews: 3456, inStock: true,  verified: true,  delivery: "Free, 3 days", seller: "Appario Retail" },
            { site: "Flipkart",         price: 152990, mrp: 179990, rating: 4.2, reviews: 5678, inStock: true,  verified: true,  delivery: "Free, 2 days", seller: "RetailNet" },
            { site: "Croma",            price: 159990, mrp: 179990, rating: 4.1, reviews: 890,  inStock: false, verified: true,  delivery: "₹199, 4 days", seller: "Croma Official" },
            { site: "Reliance Digital", price: 155490, mrp: 179990, rating: 4.0, reviews: 1234, inStock: true,  verified: true,  delivery: "Free, 3 days", seller: "Reliance Retail" },
            { site: "Vijay Sales",      price: 154990, mrp: 179990, rating: 3.9, reviews: 567,  inStock: true,  verified: false, delivery: "₹299, 5 days", seller: "Vijay Sales" }
        ]
    },
    {
        id: 6, name: "Nike Air Max 270 React Running Shoes", category: "Fashion", image: "👟",
        brand: "Nike", specs: "Mesh upper, Air Max unit, React foam midsole, Men's UK 8-11",
        sites: [
            { site: "Amazon",   price: 11995, mrp: 15995, rating: 4.3, reviews: 5678,  inStock: true,  verified: true,  delivery: "Free, 3 days", seller: "Cloudtail India" },
            { site: "Flipkart", price: 10999, mrp: 15995, rating: 4.2, reviews: 8901,  inStock: true,  verified: true,  delivery: "Free, 2 days", seller: "RetailNet" },
            { site: "Myntra",   price: 10497, mrp: 15995, rating: 4.4, reviews: 12345, inStock: true,  verified: true,  delivery: "Free, 3 days", seller: "Myntra Official" },
            { site: "JioMart",  price: 11499, mrp: 15995, rating: 3.9, reviews: 2345,  inStock: true,  verified: false, delivery: "Free, 4 days", seller: "FootGear Store" },
            { site: "Croma",    price: 12995, mrp: 15995, rating: 4.0, reviews: 567,   inStock: false, verified: true,  delivery: "₹99, 5 days",  seller: "Croma Official" }
        ]
    },
    {
        id: 7, name: "Philips Air Fryer HD9200/90 4.1L", category: "Home Appliances", image: "🍳",
        brand: "Philips", specs: "4.1L capacity, Rapid Air, 1400W, Touch Panel, Dishwasher Safe",
        sites: [
            { site: "Amazon",           price: 7490,  mrp: 9995, rating: 4.4, reviews: 23456, inStock: true,  verified: true,  delivery: "Free, 1 day",  seller: "Cloudtail India" },
            { site: "Flipkart",         price: 6999,  mrp: 9995, rating: 4.3, reviews: 31245, inStock: true,  verified: true,  delivery: "Free, 2 days", seller: "SuperComNet" },
            { site: "Croma",            price: 7999,  mrp: 9995, rating: 4.2, reviews: 4567,  inStock: true,  verified: true,  delivery: "₹49, 3 days",  seller: "Croma Official" },
            { site: "JioMart",          price: 7299,  mrp: 9995, rating: 4.0, reviews: 6789,  inStock: true,  verified: true,  delivery: "Free, 3 days", seller: "JioMart Official" },
            { site: "Reliance Digital", price: 7690,  mrp: 9995, rating: 4.1, reviews: 2345,  inStock: false, verified: true,  delivery: "₹99, 4 days",  seller: "Reliance Retail" }
        ]
    },
    {
        id: 8, name: "JBL Charge 5 Bluetooth Speaker", category: "Audio", image: "🔊",
        brand: "JBL", specs: "IP67 Waterproof, 20hr Battery, PartyBoost, JBL Pro Sound",
        sites: [
            { site: "Amazon",           price: 13999, mrp: 18999, rating: 4.5, reviews: 16789, inStock: true,  verified: true,  delivery: "Free, 1 day",  seller: "Appario Retail" },
            { site: "Flipkart",         price: 12999, mrp: 18999, rating: 4.4, reviews: 21345, inStock: true,  verified: true,  delivery: "Free, 1 day",  seller: "RetailNet" },
            { site: "Croma",            price: 14999, mrp: 18999, rating: 4.3, reviews: 3456,  inStock: true,  verified: true,  delivery: "₹49, 2 days",  seller: "Croma Official" },
            { site: "JioMart",          price: 13499, mrp: 18999, rating: 4.1, reviews: 5678,  inStock: true,  verified: false, delivery: "Free, 3 days", seller: "SoundHub India" },
            { site: "Vijay Sales",      price: 13799, mrp: 18999, rating: 4.2, reviews: 1234,  inStock: true,  verified: true,  delivery: "₹99, 3 days",  seller: "Vijay Sales" }
        ]
    },
    {
        id: 9, name: "Fossil Gen 6 Hybrid Smartwatch", category: "Watches", image: "⌚",
        brand: "Fossil", specs: "Wear OS, SpO2, Heart Rate, GPS, 2-week battery, AMOLED",
        sites: [
            { site: "Amazon",   price: 21995, mrp: 28995, rating: 4.1, reviews: 4567, inStock: true,  verified: true,  delivery: "Free, 2 days", seller: "Fossil India" },
            { site: "Flipkart", price: 19995, mrp: 28995, rating: 4.0, reviews: 6789, inStock: true,  verified: true,  delivery: "Free, 2 days", seller: "RetailNet" },
            { site: "Myntra",   price: 20495, mrp: 28995, rating: 4.2, reviews: 8901, inStock: true,  verified: true,  delivery: "Free, 3 days", seller: "Myntra Fashion" },
            { site: "JioMart",  price: 22495, mrp: 28995, rating: 3.8, reviews: 1234, inStock: false, verified: false, delivery: "Free, 5 days", seller: "WatchStore" },
            { site: "Croma",    price: 23995, mrp: 28995, rating: 4.0, reviews: 890,  inStock: true,  verified: true,  delivery: "₹99, 3 days",  seller: "Croma Official" }
        ]
    },
    {
        id: 10, name: "Dyson V12 Detect Slim Vacuum Cleaner", category: "Home Appliances", image: "🧹",
        brand: "Dyson", specs: "Laser Slim Fluffy, 60min runtime, HEPA filtration, LCD display",
        sites: [
            { site: "Amazon",           price: 51990, mrp: 58900, rating: 4.4, reviews: 3456, inStock: true,  verified: true,  delivery: "Free, 2 days", seller: "Dyson Official" },
            { site: "Flipkart",         price: 49990, mrp: 58900, rating: 4.3, reviews: 5678, inStock: true,  verified: true,  delivery: "Free, 2 days", seller: "RetailNet" },
            { site: "Croma",            price: 53990, mrp: 58900, rating: 4.2, reviews: 1234, inStock: true,  verified: true,  delivery: "Free, 3 days", seller: "Croma Official" },
            { site: "Reliance Digital", price: 52490, mrp: 58900, rating: 4.1, reviews: 890,  inStock: false, verified: true,  delivery: "₹199, 4 days", seller: "Reliance Retail" },
            { site: "Vijay Sales",      price: 52990, mrp: 58900, rating: 4.0, reviews: 567,  inStock: true,  verified: false, delivery: "₹149, 4 days", seller: "Vijay Sales" }
        ]
    },
    {
        id: 11, name: "Levi's 511 Slim Fit Men's Jeans", category: "Fashion", image: "👖",
        brand: "Levi's", specs: "Slim fit, 98% Cotton, 2% Elastane, Dark Indigo wash",
        sites: [
            { site: "Amazon",   price: 2999, mrp: 4599, rating: 4.2, reviews: 15678, inStock: true,  verified: true,  delivery: "Free, 2 days", seller: "Levi's Official" },
            { site: "Flipkart", price: 2799, mrp: 4599, rating: 4.1, reviews: 19234, inStock: true,  verified: true,  delivery: "Free, 2 days", seller: "RetailNet" },
            { site: "Myntra",   price: 2609, mrp: 4599, rating: 4.3, reviews: 24567, inStock: true,  verified: true,  delivery: "Free, 3 days", seller: "Myntra Official" },
            { site: "JioMart",  price: 2899, mrp: 4599, rating: 3.7, reviews: 3456,  inStock: true,  verified: false, delivery: "Free, 4 days", seller: "DenimWorld" },
            { site: "Croma",    price: 3299, mrp: 4599, rating: 3.9, reviews: 567,   inStock: false, verified: false, delivery: "₹99, 5 days",  seller: "FashionHub" }
        ]
    },
    {
        id: 12, name: "Bose QuietComfort Ultra Earbuds", category: "Audio", image: "🎧",
        brand: "Bose", specs: "Immersive Audio, CustomTune ANC, 6hr battery, IPX4",
        sites: [
            { site: "Amazon",           price: 24990, mrp: 29900, rating: 4.4, reviews: 7890, inStock: true,  verified: true,  delivery: "Free, 1 day",  seller: "Appario Retail" },
            { site: "Flipkart",         price: 23490, mrp: 29900, rating: 4.3, reviews: 9012, inStock: true,  verified: true,  delivery: "Free, 2 days", seller: "SuperComNet" },
            { site: "Croma",            price: 26990, mrp: 29900, rating: 4.2, reviews: 1567, inStock: true,  verified: true,  delivery: "₹49, 2 days",  seller: "Croma Official" },
            { site: "Reliance Digital", price: 25490, mrp: 29900, rating: 4.1, reviews: 2345, inStock: false, verified: true,  delivery: "₹99, 3 days",  seller: "Reliance Retail" },
            { site: "JioMart",          price: 24490, mrp: 29900, rating: 3.9, reviews: 3456, inStock: true,  verified: false, delivery: "Free, 4 days", seller: "AudioMart" }
        ]
    },
    {
        id: 13, name: "Prestige Iris 750W Mixer Grinder", category: "Home Appliances", image: "🍹",
        brand: "Prestige", specs: "750W Motor, 3 Stainless Steel Jars, 3 Speed + Pulse",
        sites: [
            { site: "Amazon",   price: 4199, mrp: 5995, rating: 4.3, reviews: 28567, inStock: true,  verified: true,  delivery: "Free, 2 days", seller: "Cloudtail India" },
            { site: "Flipkart", price: 3899, mrp: 5995, rating: 4.2, reviews: 34567, inStock: true,  verified: true,  delivery: "Free, 1 day",  seller: "SuperComNet" },
            { site: "JioMart",  price: 3999, mrp: 5995, rating: 4.0, reviews: 8901,  inStock: true,  verified: true,  delivery: "Free, 2 days", seller: "JioMart Official" },
            { site: "Croma",    price: 4499, mrp: 5995, rating: 4.1, reviews: 2345,  inStock: true,  verified: true,  delivery: "₹49, 3 days",  seller: "Croma Official" },
            { site: "Vijay Sales", price: 4299, mrp: 5995, rating: 3.8, reviews: 678,  inStock: true,  verified: false, delivery: "₹99, 4 days",  seller: "Vijay Sales" }
        ]
    },
    {
        id: 14, name: "boAt Rockerz 550 Over-Ear Headphones", category: "Audio", image: "🎧",
        brand: "boAt", specs: "50mm drivers, 20hr battery, Bluetooth 5.0, Foldable, ANC",
        sites: [
            { site: "Amazon",   price: 1799, mrp: 4990, rating: 4.1, reviews: 67890, inStock: true,  verified: true,  delivery: "Free, 1 day",  seller: "Appario Retail" },
            { site: "Flipkart", price: 1499, mrp: 4990, rating: 4.0, reviews: 89012, inStock: true,  verified: true,  delivery: "Free, 1 day",  seller: "RetailNet" },
            { site: "JioMart",  price: 1699, mrp: 4990, rating: 3.8, reviews: 12345, inStock: true,  verified: true,  delivery: "Free, 2 days", seller: "JioMart Official" },
            { site: "Croma",    price: 1999, mrp: 4990, rating: 3.9, reviews: 3456,  inStock: true,  verified: true,  delivery: "₹49, 3 days",  seller: "Croma Official" },
            { site: "Myntra",   price: 1899, mrp: 4990, rating: 3.7, reviews: 5678,  inStock: false, verified: false, delivery: "Free, 5 days", seller: "GadgetZone" }
        ]
    },
    {
        id: 15, name: "Apple Watch Series 9 GPS 45mm", category: "Watches", image: "⌚",
        brand: "Apple", specs: "S9 SiP chip, Always-On Retina, Blood Oxygen, ECG, WR50",
        sites: [
            { site: "Amazon",           price: 41900, mrp: 49900, rating: 4.6, reviews: 8901, inStock: true,  verified: true,  delivery: "Free, 1 day",  seller: "Appario Retail" },
            { site: "Flipkart",         price: 39900, mrp: 49900, rating: 4.5, reviews: 12345, inStock: true,  verified: true,  delivery: "Free, 2 days", seller: "SuperComNet" },
            { site: "Croma",            price: 43900, mrp: 49900, rating: 4.4, reviews: 2345,  inStock: true,  verified: true,  delivery: "Free, 2 days", seller: "Croma Official" },
            { site: "Reliance Digital", price: 42490, mrp: 49900, rating: 4.3, reviews: 1890,  inStock: true,  verified: true,  delivery: "Free, 3 days", seller: "Reliance Retail" },
            { site: "Vijay Sales",      price: 41490, mrp: 49900, rating: 4.2, reviews: 789,   inStock: false, verified: true,  delivery: "₹149, 4 days", seller: "Vijay Sales" }
        ]
    }
];

// ─── Trending / Popular Searches ─────────────────────────────
const TRENDING_SEARCHES = [
    "Samsung Galaxy S24", "MacBook Air M3", "iPhone 16 Pro",
    "Sony WH-1000XM5", "Air Fryer", "JBL Charge 5",
    "Nike Air Max", "Dyson Vacuum", "boAt Rockerz", "Apple Watch"
];
