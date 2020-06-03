const redis = require("redis");
const bluebird = require("bluebird");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient(6379, "127.0.0.1");
client.on("error", (err) => {
  console.log(err);
});

const Redis = {
  async addIpCount(ip, expire) {
    let count = await client.getAsync(ip);
    // 若count不存在，令count为0
    count = count || 0;
    await client.setAsync(ip, ++count);
    if (expire) {
      client.expireat(ip, expire);
    }
    return true;
  },

  async getIpCount(ip) {
    const count = await client.getAsync(ip);
    return count;
  },

  async addUserCount(userId, expire) {
    let count = await client.getAsync(userId);
    count = count || 0;
    await client.setAsync(userId, ++count);
    if (expire) {
      client.expireat(ip, expire);
    }
    return true;
  },

  async getUserCount(userId) {
    const count = await client.getAsync(userId);
    return count;
  },
};

module.exports = {
  Redis,
};
