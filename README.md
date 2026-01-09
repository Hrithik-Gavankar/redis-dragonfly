# 🚀 Redis vs DragonflyDB Benchmark

> **When Speed Takes Flight: How DragonflyDB Outruns Redis in Modern Caching**

A comprehensive benchmark comparison tool for Redis and DragonflyDB performance analysis.

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 18+

## 🏃 Quick Start

### 1. Start the Databases

```bash
docker compose up -d
```

This will spin up:
- **Redis 7** on port `6379`
- **DragonflyDB** on port `6380` (with 4 threads)

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Benchmark

```bash
npm run benchmark
```

## 📊 Benchmarks Included

| Benchmark | Description | Why It Matters |
|-----------|-------------|----------------|
| Concurrent SCAN | Multiple clients scanning large datasets | Tests parallel scanning capability |
| KEYS Pattern | Pattern matching on large keyspace | Blocking in Redis, parallel in Dragonfly |
| Memory Info | Admin commands under load | Operational monitoring |
| Bulk MSET/MGET | Large batch operations | Throughput testing |
| Sorted Set Queries | Complex range queries | Real-world leaderboard patterns |
| Mixed Workload | SET, GET, INCR, LPUSH, HSET | Application simulation |

## 🏗️ Architecture Comparison

| Feature | Redis | DragonflyDB |
|---------|-------|-------------|
| Threading | Single-threaded | Multi-threaded |
| CPU Usage | 1 core | All available cores |
| Scaling | Horizontal (cluster) | Vertical (single instance) |
| Protocol | Redis Protocol | 100% Redis Compatible |

## 🐳 Docker Commands

```bash
# Start databases
docker compose up -d

# View logs
docker compose logs -f

# Stop databases
docker compose down

# Clean up (remove data)
docker compose down -v
```

## 📝 Key Insights

- **DragonflyDB** uses a multi-threaded shared-nothing architecture
- Excels at operations that would block Redis (SCAN, KEYS)
- Best performance on multi-core servers (8+ cores)
- Drop-in Redis replacement - same protocol, zero code changes

## 📚 Resources

- [DragonflyDB Official Benchmarks](https://www.dragonflydb.io/benchmarks)
- [DragonflyDB Documentation](https://www.dragonflydb.io/docs)
- [Redis Documentation](https://redis.io/docs)

## License

MIT
