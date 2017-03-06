## Schema Fields

### MetaData
Field | Type | Desc | Example
--- | --- | --- | ---
columns | Column[] | 列信息 | [{"name": "来源", "isDim": true}, {"name": "访问用户量", "isDim": false}]

### Request

Field | Type | Desc | Example
--- | --- | --- | ---
type | Enum | 数据类型: funnel, retention| funnel
metrics | Metric[] | 指标 | [{"id": "id", "level": "simple"}]
dimensions | String[] | 维度 | ["tm", "kw", "cs10"]
granularities | Granularity[] | 粒度 | {"id": "kw", "period": 86400}
filter | Filter | 过滤 | {"op": "=", "key": "kw", "value": "gio"}
timeRange | String | 时间区域 | day:8,1
userTag | String | 用户分群 ID | xxxx
limit | Int | 数据行限制 | 10
orders | Order[] | 排序 | [{"id": "rp", "isDim": true, "orderType": "desc"}]
aggregateType | Enum | 聚合类型: sum, avg | sum
attrs | Object | 属性值 | {"userType": "nuv"}
interval ! | Long | 时间粒度(兼容) | 86400

### Response

Field | Type | Desc | Example
--- | --- | --- | ---
data | Object[] | 表格数据 | ["百度", 2345]
meta | MetaData | 元数据 | {"columns": [{"name": "来源", "isDim": true}, {"name": "访问用户量", "isDim": false}]}

## Example

### Line, DimensionLine, DimensionVBar, Bar, VBar, Table, Bubble

Request
```
{
	"metrics": [{"id": "0gw432", "level": "complex"}],
	"dimensions": ["tm"],
	"granularity": {"id": "tm", "interval": 86400},
	"timeRange": "day:8,1",
	"userTag": "yHw4520"
}
```

Response
```
{
	"meta": {
		"columns": [
			{"id": "tm", "name": "时间", "isDim": true},
			{"id": "0gw432", "name": "访问用户量", "isDim": false}
		]
	},
	"data": [
	    [14866560000, 54876]
	    ...
	]
}
```

### Comparison, SingleNumber

Request
```
{
	"metrics": [{"id": "0gw432", "level": "complex"}],
	"dimensions": ["tm"],
	"granularities": [{"id": "tm", "interval": 86400, "period": 7}],
	"timeRange": "day:8,1",
	"userTag": "yHw4520",
	"aggregateType": "sum"
}
```
- metrics 有且只有一个
- dimensions 有且只有一个

Response
```
{
	"meta": {
		"aggregates": [3928, 3000],
		"granularities": [{"id": "tm", "interval": 86400, "period": 7}],	
		"columns": [
			{"id": "tm", "name": "时间", "isDim": true},
			{"id": "0gw432", "name": "访问用户量", "isDim": false}
		]
	},
	"data": [
	    [14866560000, 54876]
	    ...
	]
}
```

### Funnel

Request
```
{
	"type": "funnel",
	"metrics": [{"id": "0gw432", "level": "complex"}, {"id": "0gw433", "level": "complex"}],
	"dimensions": ["rt"],
	"granularities": [{"id": "rt", "values": ["baidu", "google"]}],
	"timeRange": "day:8,1",
	"attrs": {"conversionWindow": 7}
}
```
- dimensions 可以为 empty

Response
```
{
	"meta": {
		"columns": [
			{"id": "rt", "name": "一级访问来源", "isDim": true},
			{"id": "0gw432", "name": "做了第一步的", "isDim": false}，
			{"id": "0gw433", "name": "做了第二步的", "isDim": false}
		]
	},
	"data": [
	    [14866560000, 54876, 3456]
	    ...
	]
}
```

### Retention 

Request
```
{
	"type": "retention",
	"metrics": [{"id": "0gw432", "level": "complex"}, {"id": "0gw433", "level": "complex"}],
	"dimensions": ["tm","rt"],
	"granularities": [{"id": "tm", "interval": 86400},{"id": "rt", "values": ["baidu", "google"]}]
	"timeRange": "day:8,1",
	"attrs": {"userType": "nuv"}
}
```

Response
```
{
	"meta": {
		"columns": [
			{"id": "rt", "name": "一级访问来源", "isDim": true},
			{"id": "tm", "name": "时间", "isDim": true},
			{"id": "rtn", "name": "留存", "isDim": false}
		]
	},
	"data": [
	    ["直接访问", 14866560000, 54876]
	    ...
	]
}
```
