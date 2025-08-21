# 智能旅游规划与导航系统 API 文档

## 基础信息

- **API基础URL**: `/travel/`
- **客户端接口前缀**: `/travel/client/`
- **管理员接口前缀**: `/travel/admin/`
- **认证方式**: Bearer Token (JWT)
- **响应格式**: JSON
- **字符编码**: UTF-8

## 通用响应格式

```json
{
    "code": 200,
    "msg": "操作成功",
    "data": {},
    "timestamp": "2024-01-01T12:00:00Z"
}
```

## 1. AI行程规划模块

### 1.1 生成AI智能行程规划

**接口描述**: 根据用户输入的目的地、时间、预算等信息，生成智能化的旅游行程规划

- **路由**: `POST /travel/client/generate-trip-plan/`
- **权限**: 需要登录

**请求参数**:

```json
{
    "destination_city": "北京",
    "start_date": "2024-03-01",
    "end_date": "2024-03-03",
    "traveler_count": 2,
    "budget_range": "2000-5000",
    "travel_preferences": ["历史文化", "自然风光"]
}
```

**参数说明**:

- `destination_city` (string, 必填): 目的地城市
- `start_date` (string, 必填): 开始日期 (YYYY-MM-DD)
- `end_date` (string, 必填): 结束日期 (YYYY-MM-DD)
- `traveler_count` (integer, 必填): 旅行人数
- `budget_range` (string, 可选): 预算范围
- `travel_preferences` (array, 可选): 旅行偏好标签

**返回示例**:

```json
{
    "code": 200,
    "msg": "行程规划生成成功",
    "data": {
        "trip_plan": {
            "id": "trip_20240301_001",
            "destination_city": "北京",
            "start_date": "2024-03-01",
            "end_date": "2024-03-03",
            "total_days": 3,
            "estimated_budget": 3500,
            "daily_plans": [
                {
                    "day": 1,
                    "date": "2024-03-01",
                    "theme": "历史文化探索",
                    "attractions": [
                        {
                            "id": 1,
                            "name": "故宫博物院",
                            "visit_time": "09:00-12:00",
                            "estimated_duration": "3小时",
                            "ticket_price": 60,
                            "description": "明清两代的皇家宫殿，世界文化遗产"
                        },
                        {
                            "id": 2,
                            "name": "天安门广场",
                            "visit_time": "13:30-15:00",
                            "estimated_duration": "1.5小时",
                            "ticket_price": 0,
                            "description": "世界最大的城市广场之一"
                        }
                    ],
                    "transportation": [
                        {
                            "from": "酒店",
                            "to": "故宫博物院",
                            "method": "地铁",
                            "duration": "30分钟",
                            "cost": 4
                        }
                    ],
                    "accommodation": {
                        "name": "北京王府井希尔顿酒店",
                        "price_per_night": 800,
                        "rating": 4.5
                    }
                }
            ]
        },
        "total_attractions": 6
    }
}
```

### 1.2 保存行程规划

**接口描述**: 将生成的行程规划保存到用户账户中

- **路由**: `POST /travel/client/save-trip-plan/`
- **权限**: 需要登录

**请求参数**:

```json
{
    "trip_plan": {
        "destination_city": "北京",
        "start_date": "2024-03-01",
        "end_date": "2024-03-03",
        "daily_plans": [...]
    }
}
```

**返回示例**:

```json
{
    "code": 200,
    "msg": "行程保存成功",
    "data": {
        "trip_id": 123,
        "saved_at": "2024-01-01T12:00:00Z"
    }
}
```

## 2. 景点管理模块

### 2.1 获取景点列表

**接口描述**: 获取景点列表，支持搜索、过滤、排序和分页，集成协同过滤推荐功能

- **路由**: `GET /travel/client/attractions/`
- **权限**: 需要登录

**查询参数**:

- `search` (string): 搜索关键词
- `category` (string): 景点分类
- `city` (string): 城市筛选
- `min_rating` (float): 最低评分
- `max_price` (float): 最高票价
- `sort_by` (string): 排序字段 (rating, price, popularity)
- `page` (integer): 页码
- `page_size` (integer): 每页数量
- `recommend` (boolean): 是否启用推荐算法
- `algorithm` (string): 推荐算法类型 (user_based, item_based, hybrid)

**返回示例**:

```json
{
    "code": 200,
    "msg": "获取景点列表成功",
    "data": {
        "attractions": [
            {
                "id": 1,
                "name": "故宫博物院",
                "category": "历史文化",
                "city": "北京",
                "address": "北京市东城区景山前街4号",
                "rating": 4.8,
                "ticket_price": 60.0,
                "opening_hours": "08:30-17:00",
                "visit_duration": "3-4小时",
                "description": "明清两代的皇家宫殿，是世界上现存规模最大、保存最为完整的木质结构古建筑群",
                "images": [
                    "https://example.com/images/gugong1.jpg",
                    "https://example.com/images/gugong2.jpg"
                ],
                "tags": ["世界文化遗产", "皇家建筑", "历史古迹"],
                "facilities": ["停车场", "餐厅", "纪念品店", "无障碍设施"],
                "latitude": 39.9163,
                "longitude": 116.3972,
                "recommendation_score": 0.95
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 10,
            "total_count": 100,
            "page_size": 10
        },
        "filters_applied": {
            "category": "历史文化",
            "city": "北京"
        }
    }
}
```

### 2.2 创建新景点

**接口描述**: 添加新的景点信息

- **路由**: `POST /travel/admin/management/`
- **权限**: 需要管理员登录

**请求参数**:

```json
{
    "name": "颐和园",
    "category": "历史文化",
    "city": "北京",
    "address": "北京市海淀区新建宫门路19号",
    "ticket_price": 30.0,
    "opening_hours": "06:30-18:00",
    "visit_duration": "2-3小时",
    "description": "中国古典园林之首，世界文化遗产",
    "latitude": 39.9999,
    "longitude": 116.2755,
    "tags": "皇家园林,世界文化遗产",
    "facilities": "停车场,餐厅,游船"
}
```

### 2.3 获取景点详情

**接口描述**: 获取指定景点的详细信息

- **路由**: `GET /travel/client/attractions/{attraction_id}/`
- **权限**: 需要登录

**返回示例**:

```json
{
    "code": 200,
    "msg": "获取景点详情成功",
    "data": {
        "id": 1,
        "name": "故宫博物院",
        "category": "历史文化",
        "city": "北京",
        "address": "北京市东城区景山前街4号",
        "rating": 4.8,
        "ticket_price": 60.0,
        "opening_hours": "08:30-17:00",
        "visit_duration": "3-4小时",
        "description": "明清两代的皇家宫殿，是世界上现存规模最大、保存最为完整的木质结构古建筑群",
        "images": [
            "https://example.com/images/gugong1.jpg",
            "https://example.com/images/gugong2.jpg"
        ],
        "tags": ["世界文化遗产", "皇家建筑", "历史古迹"],
        "facilities": ["停车场", "餐厅", "纪念品店", "无障碍设施"],
        "latitude": 39.9163,
        "longitude": 116.3972,
        "weather_info": {
            "temperature": "15°C",
            "condition": "晴",
            "humidity": "45%"
        },
        "nearby_attractions": [
            {
                "id": 2,
                "name": "天安门广场",
                "distance": "0.5公里"
            }
        ],
        "reviews_summary": {
            "total_reviews": 1250,
            "average_rating": 4.8,
            "rating_distribution": {
                "5": 850,
                "4": 300,
                "3": 80,
                "2": 15,
                "1": 5
            }
        }
    }
}
```

## 3. 用户收藏模块

### 3.1 获取用户收藏列表

**接口描述**: 获取当前用户的景点收藏列表

- **路由**: `GET /travel/client/favorites/`
- **权限**: 需要登录

**查询参数**:

- `page` (integer): 页码
- `page_size` (integer): 每页数量

**返回示例**:

```json
{
    "code": 200,
    "msg": "获取收藏列表成功",
    "data": {
        "favorites": [
            {
                "id": 1,
                "attraction": {
                    "id": 1,
                    "name": "故宫博物院",
                    "category": "历史文化",
                    "city": "北京",
                    "rating": 4.8,
                    "ticket_price": 60.0,
                    "images": ["https://example.com/images/gugong1.jpg"]
                },
                "created_at": "2024-01-01T12:00:00Z",
                "notes": "下次一定要去看看"
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 3,
            "total_count": 25,
            "page_size": 10
        }
    }
}
```

### 3.2 添加景点收藏

**接口描述**: 将景点添加到用户收藏列表

- **路由**: `POST /travel/client/favorites/`
- **权限**: 需要登录

**请求参数**:

```json
{
    "attraction_id": 1,
    "notes": "计划春节期间参观"
}
```

### 3.3 删除收藏

**接口描述**: 从收藏列表中移除指定景点

- **路由**: `DELETE /travel/client/favorites/{favorite_id}/`
- **权限**: 需要登录

## 4. 景点评价模块

### 4.1 获取景点评价列表

**接口描述**: 获取指定景点的用户评价列表

- **路由**: `GET /travel/client/attractions/{attraction_id}/reviews/`
- **权限**: 需要登录

**查询参数**:

- `page` (integer): 页码
- `page_size` (integer): 每页数量
- `sort_by` (string): 排序方式 (latest, rating_high, rating_low)

**返回示例**:

```json
{
    "code": 200,
    "msg": "获取评价列表成功",
    "data": {
        "reviews": [
            {
                "id": 1,
                "user": {
                    "id": 123,
                    "username": "travel_lover",
                    "avatar": "https://example.com/avatars/123.jpg"
                },
                "rating": 5,
                "title": "绝对值得一去的地方！",
                "content": "故宫的建筑真的太震撼了，每一个细节都体现了古代工匠的智慧。建议提前预约，避开人流高峰。",
                "images": [
                    "https://example.com/reviews/review1_1.jpg",
                    "https://example.com/reviews/review1_2.jpg"
                ],
                "visit_date": "2024-01-15",
                "created_at": "2024-01-16T10:30:00Z",
                "helpful_count": 25,
                "is_helpful": false
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 15,
            "total_count": 150,
            "page_size": 10
        },
        "statistics": {
            "average_rating": 4.6,
            "total_reviews": 150,
            "rating_distribution": {
                "5": 85,
                "4": 45,
                "3": 15,
                "2": 3,
                "1": 2
            }
        }
    }
}
```

### 4.2 发表景点评价

**接口描述**: 为指定景点发表评价

- **路由**: `POST /travel/client/attractions/{attraction_id}/reviews/`
- **权限**: 需要登录

**请求参数**:

```json
{
    "rating": 5,
    "title": "非常棒的体验",
    "content": "景色优美，服务周到，强烈推荐！",
    "visit_date": "2024-01-15",
    "images": [
        "https://example.com/uploads/review_img1.jpg",
        "https://example.com/uploads/review_img2.jpg"
    ]
}
```

## 5. 用户偏好模块

### 5.1 获取用户偏好设置

**接口描述**: 获取当前用户的旅游偏好设置

- **路由**: `GET /travel/client/user/preferences/`
- **权限**: 需要登录

**返回示例**:

```json
{
    "code": 200,
    "msg": "获取用户偏好成功",
    "data": {
        "id": 1,
        "preferred_categories": ["历史文化", "自然风光", "美食体验"],
        "budget_range": "2000-5000",
        "travel_style": "深度游",
        "transportation_preference": "公共交通",
        "accommodation_level": "四星级",
        "dietary_restrictions": ["素食"],
        "accessibility_needs": false,
        "language_preference": "中文",
        "notification_settings": {
            "email_notifications": true,
            "push_notifications": true,
            "sms_notifications": false
        },
        "updated_at": "2024-01-01T12:00:00Z"
    }
}
```

### 5.2 更新用户偏好设置

**接口描述**: 更新用户的旅游偏好设置

- **路由**: `POST /travel/client/user/preferences/`
- **权限**: 需要登录

**请求参数**:

```json
{
    "preferred_categories": ["历史文化", "自然风光"],
    "budget_range": "3000-8000",
    "travel_style": "休闲游",
    "transportation_preference": "自驾",
    "accommodation_level": "五星级"
}
```

## 6. 用户资料模块

### 6.1 获取用户资料

**接口描述**: 获取当前用户的个人资料信息

- **路由**: `GET /travel/client/user/profile/`
- **权限**: 需要登录

**返回示例**:

```json
{
    "code": 200,
    "msg": "获取用户资料成功",
    "data": {
        "id": 123,
        "username": "travel_enthusiast",
        "email": "user@example.com",
        "first_name": "张",
        "last_name": "三",
        "phone": "+86 138****8888",
        "avatar": "https://example.com/avatars/123.jpg",
        "date_joined": "2023-06-15T08:30:00Z",
        "last_login": "2024-01-01T12:00:00Z",
        "travel_stats": {
            "total_trips": 15,
            "total_attractions_visited": 89,
            "total_reviews": 23,
            "favorite_destinations": ["北京", "上海", "西安"],
            "travel_badges": [
                {
                    "name": "文化探索者",
                    "description": "参观超过20个历史文化景点",
                    "earned_at": "2023-12-01T00:00:00Z"
                }
            ]
        },
        "preferences": {
            "preferred_categories": ["历史文化", "自然风光"],
            "budget_range": "2000-5000"
        }
    }
}
```

## 7. 行程管理模块

### 7.1 获取用户行程列表

**接口描述**: 获取当前用户的所有行程列表

- **路由**: `GET /travel/client/trips/`
- **权限**: 需要登录

**查询参数**:

- `status` (string): 行程状态 (planned, ongoing, completed, cancelled)
- `page` (integer): 页码
- `page_size` (integer): 每页数量

**返回示例**:

```json
{
    "code": 200,
    "msg": "获取行程列表成功",
    "data": {
        "trips": [
            {
                "id": 1,
                "title": "北京三日文化之旅",
                "destination_city": "北京",
                "start_date": "2024-03-01",
                "end_date": "2024-03-03",
                "status": "planned",
                "total_days": 3,
                "total_attractions": 8,
                "estimated_budget": 3500.0,
                "actual_cost": null,
                "traveler_count": 2,
                "created_at": "2024-01-01T12:00:00Z",
                "updated_at": "2024-01-02T15:30:00Z",
                "cover_image": "https://example.com/trips/trip1_cover.jpg",
                "highlights": ["故宫博物院", "长城", "颐和园"]
            }
        ],
        "pagination": {
            "current_page": 1,
            "total_pages": 5,
            "total_count": 45,
            "page_size": 10
        },
        "statistics": {
            "total_trips": 45,
            "planned_trips": 12,
            "completed_trips": 30,
            "ongoing_trips": 2,
            "cancelled_trips": 1
        }
    }
}
```

### 7.2 获取行程详情

**接口描述**: 获取指定行程的详细信息

- **路由**: `GET /travel/client/trips/{trip_id}/`
- **权限**: 需要登录

**返回示例**:

```json
{
    "code": 200,
    "msg": "获取行程详情成功",
    "data": {
        "id": 1,
        "title": "北京三日文化之旅",
        "destination_city": "北京",
        "start_date": "2024-03-01",
        "end_date": "2024-03-03",
        "status": "planned",
        "total_days": 3,
        "estimated_budget": 3500.0,
        "actual_cost": null,
        "traveler_count": 2,
        "description": "探索北京的历史文化魅力，感受古都的韵味",
        "daily_plans": [
            {
                "day": 1,
                "date": "2024-03-01",
                "theme": "皇家文化探索",
                "attractions": [
                    {
                        "id": 1,
                        "name": "故宫博物院",
                        "visit_time": "09:00-12:00",
                        "estimated_duration": "3小时",
                        "ticket_price": 60.0,
                        "status": "planned"
                    }
                ],
                "transportation": [
                    {
                        "from": "酒店",
                        "to": "故宫博物院",
                        "method": "地铁",
                        "duration": "30分钟",
                        "cost": 4.0
                    }
                ],
                "accommodation": {
                    "name": "北京王府井希尔顿酒店",
                    "address": "北京市东城区王府井大街8号",
                    "price_per_night": 800.0,
                    "rating": 4.5
                },
                "meals": [
                    {
                        "type": "午餐",
                        "restaurant": "全聚德烤鸭店",
                        "estimated_cost": 200.0
                    }
                ]
            }
        ],
        "created_at": "2024-01-01T12:00:00Z",
        "updated_at": "2024-01-02T15:30:00Z"
    }
}
```

## 8. 地图导航模块

### 8.1 创建导航路线

**接口描述**: 根据起点和终点创建导航路线

- **路由**: `POST /travel/client/navigation/route/`
- **权限**: 需要登录

**请求参数**:

```json
{
    "origin": "北京市东城区王府井大街",
    "destination": "北京市东城区景山前街4号故宫博物院",
    "waypoints": ["天安门广场"],
    "transportation": "walking"
}
```

**参数说明**:

- `origin` (string, 必填): 起点地址
- `destination` (string, 必填): 终点地址
- `waypoints` (array, 可选): 途经点列表
- `transportation` (string, 可选): 交通方式 (walking, driving, transit)

**返回示例**:

```json
{
    "code": 200,
    "msg": "路线规划成功",
    "data": {
        "route_id": 123,
        "origin": {
            "address": "北京市东城区王府井大街",
            "latitude": 39.9097,
            "longitude": 116.4074
        },
        "destination": {
            "address": "北京市东城区景山前街4号故宫博物院",
            "latitude": 39.9163,
            "longitude": 116.3972
        },
        "distance": 1200,
        "estimated_duration": 900,
        "travel_mode": "walking",
        "steps": [
            {
                "instruction": "从王府井大街向北步行",
                "distance": 300,
                "duration": 180,
                "polyline": "encoded_polyline_string"
            },
            {
                "instruction": "右转进入东华门大街",
                "distance": 500,
                "duration": 300,
                "polyline": "encoded_polyline_string"
            }
        ],
        "polyline": "complete_route_polyline",
        "created_at": "2024-01-01T12:00:00Z"
    }
}
```

### 8.2 开始导航

**接口描述**: 开始指定路线的导航

- **路由**: `POST /travel/client/navigation/start/`
- **权限**: 需要登录

**请求参数**:

```json
{
    "route_id": 123,
    "current_location": {
        "latitude": 39.9097,
        "longitude": 116.4074
    }
}
```

**返回示例**:

```json
{
    "code": 200,
    "msg": "导航启动成功",
    "data": {
        "navigation_id": "nav_123",
        "route_id": 123,
        "status": "navigating",
        "current_step": 1,
        "current_instruction": "从王府井大街向北步行",
        "remaining_distance": 1200,
        "remaining_time": 900,
        "next_instruction": "右转进入东华门大街",
        "traffic_info": {
            "traffic_status": "smooth",
            "congestion_level": 1,
            "estimated_delay": 0,
            "alerts": []
        },
        "started_at": "2024-01-01T12:00:00Z"
    }
}
```

### 8.3 获取导航状态

**接口描述**: 获取当前导航的实时状态

- **路由**: `GET /travel/client/navigation/status/{navigation_id}/`
- **权限**: 需要登录

**返回示例**:

```json
{
    "code": 200,
    "msg": "获取导航状态成功",
    "data": {
        "navigation_id": "nav_123",
        "route_id": 123,
        "status": "navigating",
        "current_step": 2,
        "total_steps": 5,
        "current_instruction": "右转进入东华门大街",
        "remaining_distance": "0.8公里",
        "remaining_time": "12分钟",
        "progress_percentage": 40,
        "route_info": {
            "origin": "北京市东城区王府井大街",
            "destination": "北京市东城区景山前街4号故宫博物院",
            "travel_mode": "walking"
        },
        "next_instruction": "直行通过天安门广场",
        "traffic_info": {
            "traffic_status": "smooth",
            "congestion_level": 1,
            "estimated_delay": 0,
            "alternative_routes": [],
            "alerts": []
        },
        "updated_at": "2024-01-01T12:15:00Z",
        "steps_remaining": [
            {
                "instruction": "直行通过天安门广场",
                "distance": 400,
                "duration": 240
            }
        ]
    }
}
```

### 8.4 更新导航状态

**接口描述**: 更新导航状态（暂停、继续、停止等）

- **路由**: `POST /travel/client/navigation/status/{navigation_id}/`
- **权限**: 需要登录

**请求参数**:

```json
{
    "action": "pause",
    "voice_enabled": false,
    "current_location": {
        "latitude": 39.9042,
        "longitude": 116.4074
    },
    "current_step": 3
}
```

**参数说明**:

- `action` (string, 必填): 操作类型 (pause, resume, stop, complete)
- `voice_enabled` (boolean, 可选): 是否启用语音导航
- `current_location` (object, 可选): 当前位置
- `current_step` (integer, 可选): 当前步骤

## 9. 附近景点推荐模块

### 9.1 获取附近景点

**接口描述**: 基于地理位置获取附近的景点推荐

- **路由**: `GET /travel/client/attractions/nearby/`
- **权限**: 需要登录

**查询参数**:

- `latitude` (float, 必填): 纬度
- `longitude` (float, 必填): 经度
- `radius` (integer, 可选): 搜索半径（米），默认5000
- `category` (string, 可选): 景点类别，默认"景点"

**返回示例**:

```json
{
    "code": 200,
    "msg": "获取附近景点成功",
    "data": {
        "attractions": [
            {
                "poi_id": "B000A83M6N",
                "id": 1,
                "name": "故宫博物院",
                "address": "北京市东城区景山前街4号",
                "distance": 1200,
                "location": {
                    "latitude": 39.9163,
                    "longitude": 116.3972
                },
                "category": "旅游景点",
                "phone": "010-85007421",
                "business_hours": "08:30-17:00",
                "description": "明清两代的皇家宫殿，世界文化遗产",
                "rating": 4.8,
                "ticket_price": "60元",
                "estimated_visit_time": "3-4小时",
                "images": [
                    "https://example.com/images/gugong1.jpg"
                ],
                "tags": ["世界文化遗产", "皇家建筑"],
                "facilities": ["停车场", "餐厅", "纪念品店"]
            }
        ],
        "search_center": {
            "latitude": 39.9042,
            "longitude": 116.4074
        },
        "search_radius": 5000,
        "search_category": "景点",
        "total_count": 15,
        "search_timestamp": "2024-01-01T12:00:00Z"
    }
}
```

## 10. 个性化推荐模块

### 10.1 获取个性化推荐

**接口描述**: 基于用户行为和偏好获取个性化景点推荐

- **路由**: `GET /travel/client/recommendations/`
- **权限**: 需要登录

**查询参数**:

- `algorithm` (string, 可选): 推荐算法 (user_based, item_based, hybrid)，默认hybrid
- `limit` (integer, 可选): 推荐数量，默认10
- `category` (string, 可选): 景点类别过滤
- `city` (string, 可选): 城市过滤

**返回示例**:

```json
{
    "code": 200,
    "msg": "获取个性化推荐成功",
    "data": {
        "recommendations": [
            {
                "attraction_id": 1,
                "name": "故宫博物院",
                "category": "历史文化",
                "city": "北京",
                "rating": 4.8,
                "recommendation_score": 0.95,
                "reason": "基于您对历史文化景点的偏好",
                "similar_users_count": 156,
                "images": ["https://example.com/images/gugong1.jpg"],
                "ticket_price": 60.0,
                "visit_duration": "3-4小时"
            }
        ],
        "algorithm_used": "hybrid",
        "user_profile": {
            "preferred_categories": ["历史文化", "自然风光"],
            "visited_attractions_count": 25,
            "average_rating_given": 4.2
        },
        "recommendation_metadata": {
            "total_candidates": 500,
            "filtered_count": 50,
            "algorithm_confidence": 0.87,
            "generated_at": "2024-01-01T12:00:00Z"
        }
    }
}
```

### 10.2 记录用户行为

**接口描述**: 记录用户行为数据，用于改进推荐算法

- **路由**: `POST /travel/client/recommendations/`
- **权限**: 需要登录

**请求参数**:

```json
{
    "attraction_id": 1,
    "action_type": "rating",
    "rating": 5,
    "visit_duration": 180,
    "notes": "非常棒的体验"
}
```

**参数说明**:

- `attraction_id` (integer, 必填): 景点ID
- `action_type` (string, 必填): 行为类型 (view, rating, favorite, visit)
- `rating` (integer, 可选): 评分 (1-5)
- `visit_duration` (integer, 可选): 访问时长（分钟）
- `notes` (string, 可选): 备注

## 11. 管理员接口模块

### 11.1 管理员综合管理接口

**接口描述**: 管理员统一管理接口，支持景点、用户、行程、评价的增删查改和数据统计

- **路由**: `/travel/admin/management/`
- **权限**: 需要管理员权限

#### 11.1.1 获取管理数据

**请求方式**: `GET`

**查询参数**:

- `type` (string, 必填): 数据类型 (statistics|attractions|users|trips|reviews)
- `page` (integer, 可选): 页码，默认1
- `page_size` (integer, 可选): 每页数量，默认10
- 其他筛选参数根据type不同而不同

**获取统计数据**:

```
GET /travel/admin/management/?type=statistics
```

**返回示例**:

```json
{
 "code": 200,
 "msg": "获取统计数据成功",
 "data": {
  "users": {
   "total": 10,
   "active": 10,
   "new_this_month": 10,
   "inactive": 0
  },
  "attractions": {
   "total": 10,
   "active": 10,
   "inactive": 0,
   "avg_rating": 4.57
  },
  "trips": {
   "total": 15,
   "completed": 5,
   "ongoing": 4,
   "planning": 6
  },
  "reviews": {
   "total": 48,
   "avg_rating": 4.15
  },
  "revenue": {
   "total": 0
  }
 }
}
```

**获取景点列表**:

```
GET /travel/admin/management/?type=attractions&city=北京&status=active&page=1&page_size=10
```

响应:

```json
{
 "code": 200,
 "msg": "获取景点列表成功",
 "data": {
  "attractions": [
   {
    "id": 5,
    "name": "天坛公园",
    "description": "明清两代皇帝祭天的场所，世界文化遗产",
    "category": "cultural",
    "address": "北京市东城区天坛路甲1号",
    "city": "北京",
    "province": "北京市",
    "latitude": "39.8832000",
    "longitude": "116.4067000",
    "ticket_price": "15.00",
    "opening_hours": "06:00-22:00",
    "visit_duration": 150,
    "rating": "4.60",
    "rating_count": 0,
    "images": [
     "https://example.com/images/tiantan1.jpg"
    ],
    "tags": [
     "世界文化遗产",
     "祭祀建筑",
     "古代礼制"
    ],
    "is_active": true,
    "created_at": "2025-08-20T10:53:29.979865",
    "updated_at": "2025-08-20T10:53:29.979865",
    "visit_count": 5
   },
   {
    "id": 4,
    "name": "长城（八达岭段）",
    "description": "万里长城最著名的一段，世界文化遗产",
    "category": "cultural",
    "address": "北京市延庆区八达岭镇",
    "city": "北京",
    "province": "北京市",
    "latitude": "40.3584000",
    "longitude": "116.0134000",
    "ticket_price": "40.00",
    "opening_hours": "07:00-18:00",
    "visit_duration": 240,
    "rating": "4.50",
    "rating_count": 0,
    "images": [
     "https://example.com/images/changcheng1.jpg"
    ],
    "tags": [
     "世界文化遗产",
     "古代军事",
     "登高望远"
    ],
    "is_active": true,
    "created_at": "2025-08-20T10:53:29.976796",
    "updated_at": "2025-08-20T10:53:29.976796",
    "visit_count": 5
   },
   {
    "id": 3,
    "name": "颐和园",
    "description": "中国古典园林之首，世界文化遗产",
    "category": "cultural",
    "address": "北京市海淀区新建宫门路19号",
    "city": "北京",
    "province": "北京市",
    "latitude": "39.9999000",
    "longitude": "116.2755000",
    "ticket_price": "30.00",
    "opening_hours": "06:30-18:00",
    "visit_duration": 150,
    "rating": "4.70",
    "rating_count": 0,
    "images": [
     "https://example.com/images/yiheyuan1.jpg",
     "https://example.com/images/yiheyuan2.jpg"
    ],
    "tags": [
     "皇家园林",
     "世界文化遗产",
     "湖光山色"
    ],
    "is_active": true,
    "created_at": "2025-08-20T10:53:29.974258",
    "updated_at": "2025-08-20T10:53:29.974258",
    "visit_count": 4
   },
   {
    "id": 2,
    "name": "天安门广场",
    "description": "世界最大的城市广场之一，中华人民共和国的象征",
    "category": "cultural",
    "address": "北京市东城区东长安街",
    "city": "北京",
    "province": "北京市",
    "latitude": "39.9042000",
    "longitude": "116.3974000",
    "ticket_price": "0.00",
    "opening_hours": "全天开放",
    "visit_duration": 90,
    "rating": "4.60",
    "rating_count": 0,
    "images": [
     "https://example.com/images/tiananmen1.jpg"
    ],
    "tags": [
     "政治中心",
     "历史意义",
     "免费景点"
    ],
    "is_active": true,
    "created_at": "2025-08-20T10:53:29.972156",
    "updated_at": "2025-08-20T10:53:29.972156",
    "visit_count": 5
   },
   {
    "id": 1,
    "name": "故宫博物院",
    "description": "明清两代的皇家宫殿，是世界上现存规模最大、保存最为完整的木质结构古建筑群",
    "category": "cultural",
    "address": "北京市东城区景山前街4号",
    "city": "北京",
    "province": "北京市",
    "latitude": "39.9163000",
    "longitude": "116.3972000",
    "ticket_price": "60.00",
    "opening_hours": "08:30-17:00",
    "visit_duration": 180,
    "rating": "4.80",
    "rating_count": 0,
    "images": [
     "https://example.com/images/gugong1.jpg",
     "https://example.com/images/gugong2.jpg"
    ],
    "tags": [
     "世界文化遗产",
     "皇家建筑",
     "历史古迹"
    ],
    "is_active": true,
    "created_at": "2025-08-20T10:53:29.969152",
    "updated_at": "2025-08-20T10:53:29.969152",
    "visit_count": 5
   }
  ],
  "pagination": {
   "current_page": 1,
   "total_pages": 1,
   "total_count": 5,
   "has_next": false,
   "has_previous": false
  }
 }
}
```

**获取用户列表**:

```
GET /travel/admin/management/?type=users&status=active&search=张三&page=1&page_size=10
```

响应体：

```json
{
 "code": 200,
 "msg": "获取用户列表成功",
 "data": {
  "users": [],
  "pagination": {
   "current_page": 1,
   "total_pages": 1,
   "total_count": 0,
   "has_next": false,
   "has_previous": false
  }
 }
}
```

**获取行程列表**:

```
GET /travel/admin/management/?type=trips&status=completed&user_id=123&page=1&page_size=10
```

响应体:

```json
{
 "code": 200,
 "msg": "获取行程列表成功",
 "data": {
  "trips": [
   {
    "id": 29,
    "days": [
     {
      "id": 71,
      "attractions": [
       {
        "id": 148,
        "attraction": {
         "id": 17,
         "name": "东方明珠塔",
         "description": "上海的标志性建筑，亚洲第一高塔",
         "category": "entertainment",
         "address": "上海市浦东新区世纪大道1号",
         "city": "上海",
         "province": "上海市",
         "latitude": "31.2397000",
         "longitude": "121.4995000",
         "ticket_price": "180.00",
         "opening_hours": "08:00-21:30",
         "visit_duration": 150,
         "rating": "4.30",
         "rating_count": 0,
         "images": [
          "https://example.com/images/dongfangmingzhu1.jpg"
         ],
         "tags": [
          "城市地标",
          "观景台",
          "现代建筑"
         ],
         "is_active": true
        },
        "visit_order": 1,
        "planned_start_time": "09:00:00",
        "planned_duration": 180,
        "actual_start_time": null,
        "actual_duration": null,
        "notes": null,
        "is_completed": false,
        "trip_day": 71
       }
      ],
      "day_number": 1,
      "date": "2025-10-04",
      "title": "第1天行程",
      "notes": null,
      "trip": 29
     }
    ],
    "user_name": "culture_lover",
    "title": "上海现代都市游",
    "destination_city": "上海",
    "start_date": "2025-10-04",
    "end_date": "2025-10-05",
    "total_budget": "2800.00",
    "actual_cost": "0.00",
    "traveler_count": 3,
    "status": "completed",
    "notes": "探索上海的魅力，感受当地的文化和风情",
    "is_public": false,
    "user": 5,
    "attraction_count": 4
   }
  ],
  "pagination": {
   "current_page": 1,
   "total_pages": 1,
   "total_count": 5,
   "has_next": false,
   "has_previous": false
  }
 }
}
```

**获取评价列表**:

```
GET /travel/admin/management/?type=reviews&attraction_id=1&rating=5&page=1&page_size=10
```

响应体:

```json
{
 "code": 200,
 "msg": "获取评价列表成功",
 "data": {
  "reviews": [
   {
    "id": 5,
    "user_name": "travel_enthusiast",
    "attraction_name": "故宫博物院",
    "rating": 5,
    "title": "绝对值得一去的地方！",
    "content": "景色优美，历史悠久，强烈推荐！建议提前预约，避开人流高峰。",
    "visit_date": "2025-07-24",
    "likes_count": 0,
    "created_at": "2025-08-20T10:53:30.072480",
    "is_anonymous": false
   },
   {
    "id": 4,
    "user_name": "test_user3",
    "attraction_name": "故宫博物院",
    "rating": 5,
    "title": "绝对值得一去的地方！",
    "content": "景色优美，历史悠久，强烈推荐！建议提前预约，避开人流高峰。",
    "visit_date": "2025-07-11",
    "likes_count": 0,
    "created_at": "2025-08-20T10:53:30.069480",
    "is_anonymous": false
   },
   {
    "id": 1,
    "user_name": "test_user2",
    "attraction_name": "故宫博物院",
    "rating": 5,
    "title": "超出期望！",
    "content": "比想象中更震撼！每一个细节都体现了古代工匠的智慧。",
    "visit_date": "2025-07-03",
    "likes_count": 0,
    "created_at": "2025-08-20T10:53:30.059690",
    "is_anonymous": false
   }
  ],
  "pagination": {
   "current_page": 1,
   "total_pages": 1,
   "total_count": 3,
   "has_next": false,
   "has_previous": false
  }
 }
}
```

#### 11.1.2 创建数据

**请求方式**: `POST`

**创建景点**:

参数格式：

```json
{
    "type": "attraction",
    "data": {
        "name": "新景点名称",
        "description": "景点描述",
        "category": "natural",
        "city": "北京",
        "province": "北京市",
        "address": "详细地址",
        "latitude": 39.9042,
        "longitude": 116.4074,
        "ticket_price": 50.00,
        "opening_hours": "08:00-18:00",
        "visit_duration": 120,
        "images": ["image1.jpg", "image2.jpg"],
        "tags": ["历史", "文化"],
        "is_active": true
    }
}
```

#### 11.1.3 更新数据

**请求方式**: `PUT`

**更新景点**:

参数格式：

```json
{
    "type": "attraction",
    "id": 1,
    "data": {
        "name": "更新后的景点名称",
        "ticket_price": 60.00,
        "is_active": true
    }
}
```

**更新用户**:

```json
{
    "type": "user",
    "id": 123,
    "data": {
        "is_active": false,
        "email": "newemail@example.com"
    }
}
```

**更新行程**:

```json
{
    "type": "trip",
    "id": 456,
    "data": {
        "status": "completed",
        "actual_cost": 2500.00
    }
}
```

#### 11.1.4 删除数据

**请求方式**: `DELETE`

**删除景点（软删除）**:

```json
{
    "type": "attraction",
    "id": 1
}
```

**删除用户（软删除）**:

```json
{
    "type": "user",
    "id": 123
}
```

**删除行程（硬删除）**:

```json
{
    "type": "trip",
    "id": 456
}
```

**删除评价（硬删除）**:

```json
{
    "type": "review",
    "id": 789
}
```

### 11.2 兼容性路由

为了保持向后兼容，以下路由仍然可用，但建议使用统一的管理接口：

- `GET /travel/admin/attractions/` - 获取景点列表
- `GET /travel/admin/users/` - 获取用户列表
- `GET /travel/admin/trips/` - 获取行程列表
- `GET /travel/admin/reviews/` - 获取评价列表
- `GET /travel/admin/statistics/` - 获取统计数据

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权，需要登录 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 数据插入脚本

为了测试API接口，以下是插入测试数据的Django管理命令脚本：

```python
# management/commands/insert_test_data.py
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from hzsystem_travel.models import *
from decimal import Decimal
from datetime import datetime, timedelta
import random

class Command(BaseCommand):
    help = '插入测试数据'

    def handle(self, *args, **options):
        # 创建测试用户
        test_user, created = User.objects.get_or_create(
            username='test_user',
            defaults={
                'email': 'test@example.com',
                'first_name': '测试',
                'last_name': '用户'
            }
        )

        # 插入景点数据
        attractions_data = [
            {
                'name': '故宫博物院',
                'category': '历史文化',
                'city': '北京',
                'address': '北京市东城区景山前街4号',
                'latitude': Decimal('39.9163'),
                'longitude': Decimal('116.3972'),
                'rating': Decimal('4.8'),
                'ticket_price': Decimal('60.0'),
                'opening_hours': '08:30-17:00',
                'visit_duration': '3-4小时',
                'description': '明清两代的皇家宫殿，世界文化遗产',
                'images': 'https://example.com/gugong1.jpg,https://example.com/gugong2.jpg',
                'tags': '世界文化遗产,皇家建筑,历史古迹',
                'facilities': '停车场,餐厅,纪念品店,无障碍设施'
            },
            # ... 更多景点数据
        ]

        for data in attractions_data:
            Attraction.objects.get_or_create(
                name=data['name'],
                defaults=data
            )

        self.stdout.write(self.style.SUCCESS('测试数据插入成功'))
```

## 使用说明

1. **认证**: 所有API接口都需要在请求头中包含JWT Token

   ```
   Authorization: Bearer <your_jwt_token>
   ```

2. **管理员权限**: 管理员接口需要管理员权限（IsAdminUser）

3. **分页**: 支持分页的接口使用标准的分页参数
   - `page`: 页码（从1开始）
   - `page_size`: 每页数量（默认10，最大100）

4. **搜索**: 支持模糊搜索，搜索关键词会匹配景点名称、描述等字段

5. **过滤**: 支持多种过滤条件，可以组合使用

6. **排序**: 支持按评分、价格、热度等字段排序

7. **推荐算法**:
   - `user_based`: 基于用户的协同过滤
   - `item_based`: 基于物品的协同过滤
   - `hybrid`: 混合推荐算法（默认）

8. **地图服务**: 集成高德地图API，提供路径规划和POI搜索功能

9. **实时数据**: 导航状态和交通信息支持实时更新

10. **数据删除**: 景点和用户的删除操作为软删除（设置is_active=False），行程和评价为硬删除

11. **批量操作**: 管理员接口支持批量操作和数据导出功能

## 更新日志

- **v1.0.0** (2024-01-01): 初始版本发布
- **v1.1.0** (2024-01-15): 新增协同过滤推荐功能
- **v1.2.0** (2024-01-20): 集成地图导航功能
- **v1.3.0** (2024-01-25): 优化个性化推荐算法
