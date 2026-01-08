import Redis from 'ioredis';
import blessed from 'blessed';
import contrib from 'blessed-contrib';

// Configuration
const REDIS_PORT = 6379;
const DRAGONFLY_PORT = 6380;
const HOST = 'localhost';

// Generate random string
function generateValue(size) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < size; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Quick benchmark
async function quickBenchmark(client, numOps, valueSize) {
  const value = generateValue(valueSize);
  const start = performance.now();
  
  const pipeline = client.pipeline();
  for (let i = 0; i < numOps; i++) {
    pipeline.set(`bench:${i}`, value);
  }
  await pipeline.exec();
  
  const end = performance.now();
  const duration = end - start;
  return Math.round((numOps / duration) * 1000);
}

async function main() {
  // Create blessed screen
  const screen = blessed.screen({
    smartCSR: true,
    title: 'Redis vs DragonflyDB - Live Dashboard'
  });

  // Create grid
  const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

  // Title box
  const titleBox = grid.set(0, 0, 1, 12, blessed.box, {
    content: '{center}{bold}🚀 REDIS vs DRAGONFLYDB - LIVE BENCHMARK DASHBOARD{/bold}{/center}',
    tags: true,
    style: {
      fg: 'white',
      bg: 'blue'
    }
  });

  // Line chart for real-time comparison
  const line = grid.set(1, 0, 5, 8, contrib.line, {
    style: {
      line: 'yellow',
      text: 'green',
      baseline: 'black'
    },
    xLabelPadding: 3,
    xPadding: 5,
    showLegend: true,
    legendWidth: 15,
    legendPosition: 'top-right',
    wholeNumbersOnly: false,
    label: ' Operations per Second (Live) '
  });

  // Bar chart for comparison
  const bar = grid.set(1, 8, 5, 4, contrib.bar, {
    label: ' Average Performance ',
    barWidth: 8,
    barSpacing: 4,
    xOffset: 0,
    maxHeight: 9
  });

  // Donut chart for wins
  const donut = grid.set(6, 0, 4, 4, contrib.donut, {
    label: ' Benchmark Wins ',
    radius: 10,
    arcWidth: 3,
    remainColor: 'black',
    yPadding: 2
  });

  // Stats table
  const statsTable = grid.set(6, 4, 4, 4, contrib.table, {
    keys: true,
    fg: 'white',
    selectedFg: 'white',
    selectedBg: 'blue',
    interactive: false,
    label: ' Statistics ',
    width: '100%',
    height: '100%',
    border: { type: 'line', fg: 'cyan' },
    columnSpacing: 3,
    columnWidth: [15, 15, 15]
  });

  // Log box
  const log = grid.set(6, 8, 4, 4, contrib.log, {
    fg: 'green',
    selectedFg: 'green',
    label: ' Activity Log '
  });

  // Info box
  const infoBox = grid.set(10, 0, 2, 12, blessed.box, {
    label: ' Configuration ',
    content: `{cyan-fg}Redis:{/cyan-fg} localhost:${REDIS_PORT}  |  {magenta-fg}DragonflyDB:{/magenta-fg} localhost:${DRAGONFLY_PORT}  |  {yellow-fg}Press 'q' to quit{/yellow-fg}`,
    tags: true,
    border: { type: 'line' },
    style: { border: { fg: 'gray' } }
  });

  // Connect to databases
  let redis, dragonfly;
  try {
    redis = new Redis({ host: HOST, port: REDIS_PORT, lazyConnect: true });
    dragonfly = new Redis({ host: HOST, port: DRAGONFLY_PORT, lazyConnect: true });
    await redis.connect();
    await dragonfly.connect();
    log.log('Connected to Redis');
    log.log('Connected to DragonflyDB');
  } catch (error) {
    log.log(`Error: ${error.message}`);
    log.log('Make sure both databases are running!');
    log.log('Run: docker compose up -d');
    screen.render();
    
    screen.key(['q', 'C-c'], function() {
      process.exit(0);
    });
    return;
  }

  // Data arrays
  const redisData = { title: 'Redis', x: [], y: [], style: { line: 'blue' } };
  const dragonflyData = { title: 'Dragonfly', x: [], y: [], style: { line: 'magenta' } };
  
  let iteration = 0;
  let redisTotal = 0;
  let dragonflyTotal = 0;
  let redisWins = 0;
  let dragonflyWins = 0;

  // Update function
  async function update() {
    try {
      const numOps = 10000;
      const valueSize = 1024;
      
      log.log(`Running iteration ${iteration + 1}...`);
      
      const redisOps = await quickBenchmark(redis, numOps, valueSize);
      const dragonflyOps = await quickBenchmark(dragonfly, numOps, valueSize);
      
      iteration++;
      redisTotal += redisOps;
      dragonflyTotal += dragonflyOps;
      
      if (dragonflyOps > redisOps) {
        dragonflyWins++;
        log.log(`Dragonfly wins! (${((dragonflyOps / redisOps) * 100 - 100).toFixed(1)}% faster)`);
      } else {
        redisWins++;
        log.log(`Redis wins! (${((redisOps / dragonflyOps) * 100 - 100).toFixed(1)}% faster)`);
      }
      
      // Update line chart
      const label = iteration.toString();
      redisData.x.push(label);
      redisData.y.push(redisOps / 1000); // Convert to K ops/sec
      dragonflyData.x.push(label);
      dragonflyData.y.push(dragonflyOps / 1000);
      
      // Keep last 20 data points
      if (redisData.x.length > 20) {
        redisData.x.shift();
        redisData.y.shift();
        dragonflyData.x.shift();
        dragonflyData.y.shift();
      }
      
      line.setData([redisData, dragonflyData]);
      
      // Update bar chart
      const redisAvg = Math.round(redisTotal / iteration / 1000);
      const dragonflyAvg = Math.round(dragonflyTotal / iteration / 1000);
      bar.setData({
        titles: ['Redis', 'Dragonfly'],
        data: [redisAvg, dragonflyAvg]
      });
      
      // Update donut
      donut.setData([
        { percent: redisWins / iteration, label: 'Redis', color: 'blue' },
        { percent: dragonflyWins / iteration, label: 'Dragonfly', color: 'magenta' }
      ]);
      
      // Update stats table
      statsTable.setData({
        headers: ['Metric', 'Redis', 'Dragonfly'],
        data: [
          ['Last (K ops/s)', (redisOps / 1000).toFixed(1), (dragonflyOps / 1000).toFixed(1)],
          ['Avg (K ops/s)', redisAvg.toString(), dragonflyAvg.toString()],
          ['Wins', redisWins.toString(), dragonflyWins.toString()],
          ['Win Rate', `${((redisWins / iteration) * 100).toFixed(0)}%`, `${((dragonflyWins / iteration) * 100).toFixed(0)}%`]
        ]
      });
      
      screen.render();
    } catch (error) {
      log.log(`Error: ${error.message}`);
    }
  }

  // Initial render
  bar.setData({ titles: ['Redis', 'Dragonfly'], data: [0, 0] });
  donut.setData([
    { percent: 0.5, label: 'Redis', color: 'blue' },
    { percent: 0.5, label: 'Dragonfly', color: 'magenta' }
  ]);
  statsTable.setData({
    headers: ['Metric', 'Redis', 'Dragonfly'],
    data: [
      ['Last (K ops/s)', '-', '-'],
      ['Avg (K ops/s)', '-', '-'],
      ['Wins', '0', '0'],
      ['Win Rate', '-', '-']
    ]
  });
  screen.render();

  // Run updates
  update();
  const interval = setInterval(update, 2000);

  // Handle quit
  screen.key(['q', 'C-c'], async function() {
    clearInterval(interval);
    await redis.disconnect();
    await dragonfly.disconnect();
    process.exit(0);
  });
}

main().catch(console.error);

