# 🚀 Redis vs DragonflyDB Benchmark

> **When Speed Takes Flight: How DragonflyDB Outruns Redis in Modern Caching**

A comprehensive benchmark comparison tool comparing Redis and DragonflyDB performance.

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+

## 🏃 Quick Start

### 1. Start the Databases

```bash
docker compose up -d
```

This will spin up:
- **Redis** on port `6379`
- **DragonflyDB** on port `6380`

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Benchmark

```bash
npm run benchmark
```

This runs a comprehensive benchmark comparing:
- SET operations (string storage)
- GET operations (data retrieval)
- INCR operations (atomic counters)
- LPUSH operations (list operations)
- HSET operations (hash tables)

### 4. (Optional) Live Dashboard

For a real-time visual dashboard:

```bash
npm run dashboard
```

Press `q` to quit the dashboard.

## 📊 What Gets Benchmarked

| Operation | Description | Use Case |
|-----------|-------------|----------|
| SET | Store key-value pairs | Session storage, caching |
| GET | Retrieve stored values | Cache reads |
| INCR | Atomic counter increment | Rate limiting, counters |
| LPUSH | Add items to list | Message queues, logs |
| HSET | Store hash field-value | Object storage, user profiles |

## 🎯 Benchmark Parameters

- **Default Operations**: 50,000 per test
- **Value Size**: 1KB (medium) for standard tests
- **Large Scale Test**: 100,000 operations with 10KB values

## 📸 Screenshot Guide for Your Blog

1. **Run the benchmark** and capture the colorful comparison table
2. **Run the dashboard** for real-time visual charts
3. **Terminal output** shows winner for each operation type

## 🔧 Configuration

Edit `benchmark.js` to customize:

```javascript
const OPERATIONS = {
  small: 10000,   // Quick test
  medium: 50000,  // Default
  large: 100000   // Stress test
};

const VALUE_SIZES = {
  tiny: 10,       // 10 bytes
  small: 100,     // 100 bytes
  medium: 1024,   // 1 KB
  large: 10240    // 10 KB
};
```

## 🐳 Docker Commands

```bash
# Start databases
docker compose up -d

# View logs
docker compose logs -f

# Stop databases
docker compose down

# Remove volumes (clean data)
docker compose down -v
```

## 📝 Blog Post Tips

- DragonflyDB is designed as a drop-in Redis replacement
- It uses a multi-threaded architecture vs Redis's single-threaded model
- Best performance gains seen in multi-core environments
- Both use the same Redis protocol and commands

## 🛑 Cleanup

```bash
docker compose down -v
```

---

Made with ❤️ for your blog post!

