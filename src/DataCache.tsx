/**
 * 脱离redux的chart数据缓存
 * { cacheKey: {expire, chartData}}
 */
import objectHash from "object-hash";
import { DataRequestProps } from "./chartProps";
import { assign } from "lodash";
let chartDataCache: any = {};

/**
 * 将默认的获取chartData的接口
 * @chartParams 请求参数
 * @hashKeys 需要做hash的key
 * return  返回生成的cacheKey
 */
function _generateCacheKey(params: DataRequestProps, hashKeys: string): string {
  let cacheKey: string = "";
  // 如果从外部传来hashKeys，则用hashKeys生成缓存的key;
  if (hashKeys) {
    cacheKey = objectHash(hashKeys);
  } else {
    cacheKey = objectHash(params);
  }
  return cacheKey;
}

/**
 * 清空缓存
 * return
 */
export function cleanCache(cacheKey: string) {
  if (cacheKey) {
    // console.log(`%c chartDataCache: cleanCache`, `color: #4CAF50; font-weight: bold`, chartDataCache[cacheKey]);
    delete chartDataCache[cacheKey];
  } else {
    chartDataCache = {};
  }
}

/**
 * 缓存中插入数据并设置过期时间
 * return
 */
export function setChartData(params: DataRequestProps, chartData: any, hashKeys: string, cacheOptions: any) {
  // 设置缓存key
  const cacheKey = _generateCacheKey(params, hashKeys);
  let ttl = -1;
  const cacheObj: any = {};

  // 加上过期时间戳
  if (cacheOptions
    && !isNaN(cacheOptions.ttl)
    && parseInt(cacheOptions.ttl, 10) !== -1
    && cacheOptions.ttl * 60 * 1000 !== 0) {
    ttl = cacheOptions.ttl * 60 * 1000 + Date.now();
  }

  cacheObj[cacheKey] = { ttl, chartData };

  assign(chartDataCache, cacheObj);

  // console.log(`%c chartDataCache: setChartData`, `color: #4CAF50; font-weight: bold`, cacheObj);
}

/**
 * 根据cacheKey和expire判断缓存中取数据
 * return
 */
export function getChartData(params: DataRequestProps, hashKeys: string) {
  let cacheKey  = "";
  let cacheData = null;
  let isExpire;

  cacheKey = _generateCacheKey(params, hashKeys);

  if (chartDataCache[cacheKey]) {
    // 检查缓存数据是否过期
    isExpire = chartDataCache[cacheKey].ttl !== -1 && chartDataCache[cacheKey].ttl < Date.now();
    if (!isExpire) {
      cacheData = chartDataCache[cacheKey].chartData;
    } else {
      // 清除过期数据
      cleanCache(cacheKey);
    }
  }

  // console.log(`%c chartDataCache: getChartData`, `color: #4CAF50; font-weight: bold`);
  return cacheData;
}

/**
 * 返回整个chart缓存，供外部使用
 * return
 */
export function getChartDataCache() {
  return chartDataCache;
}
