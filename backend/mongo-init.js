// MongoDB 初始化脚本
// 此脚本在 MongoDB 容器首次启动时执行
// 用于初始化副本集

try {
  rs.status();
  print("Replica set already initialized");
} catch (e) {
  print("Initializing replica set...");
  rs.initiate({
    _id: "rs0",
    members: [{ _id: 0, host: "localhost:27017" }]
  });
  print("Replica set initialized successfully");
}
