<http://localhost:5175/api/travel/admin/management/?type=statistics>:
{
    "code": 200,
    "msg": "获取统计数据成功",
    "data": {
        "users": {
            "total": 11,
            "active": 11,
            "new_this_month": 11,
            "inactive": 0
        },
        "attractions": {
            "total": 17,
            "active": 17,
            "inactive": 0,
            "avg_rating": 2.69
        },
        "trips": {
            "total": 12,
            "completed": 3,
            "ongoing": 3,
            "planning": 6
        },
        "reviews": {
            "total": 58,
            "avg_rating": 4.31
        },
        "revenue": {
            "total": 0
        }
    }
}

<http://localhost:5175/api/travel/client/attractions/>:

{
    "code": 200,
    "msg": "获取景点列表成功",
    "data": {
        "attractions": [
            {
                "id": 11,
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
                "created_at": "2025-08-20T15:53:34.939942",
                "updated_at": "2025-08-20T15:53:34.939942"
            },
            {
                "id": 18,
                "name": "西湖",
                "description": "中国著名的淡水湖，世界文化遗产",
                "category": "natural",
                "address": "浙江省杭州市西湖区",
                "city": "杭州",
                "province": "浙江省",
                "latitude": "30.2741000",
                "longitude": "120.1551000",
                "ticket_price": "0.00",
                "opening_hours": "全天开放",
                "visit_duration": 300,
                "rating": "4.70",
                "rating_count": 0,
                "images": [
                    "https://example.com/images/xihu1.jpg",
                    "https://example.com/images/xihu2.jpg"
                ],
                "tags": [
                    "世界文化遗产",
                    "湖光山色",
                    "免费景点"
                ],
                "is_active": true,
                "created_at": "2025-08-20T15:53:34.958942",
                "updated_at": "2025-08-20T15:53:34.958942"
            },
            {
                "id": 13,
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
                "created_at": "2025-08-20T15:53:34.944942",
                "updated_at": "2025-08-20T15:53:34.944942"
            },
            {
                "id": 12,
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
                "created_at": "2025-08-20T15:53:34.941942",
                "updated_at": "2025-08-20T15:53:34.941942"
            },
            {
                "id": 15,
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
                "created_at": "2025-08-20T15:53:34.950946",
                "updated_at": "2025-08-20T15:53:34.950946"
            },
            {
                "id": 19,
                "name": "兵马俑",
                "description": "世界第八大奇迹，秦始皇陵的陪葬坑",
                "category": "cultural",
                "address": "陕西省西安市临潼区秦始皇陵以东1.5公里处",
                "city": "西安",
                "province": "陕西省",
                "latitude": "34.3848000",
                "longitude": "109.2734000",
                "ticket_price": "120.00",
                "opening_hours": "08:30-17:00",
                "visit_duration": 150,
                "rating": "4.60",
                "rating_count": 0,
                "images": [
                    "https://example.com/images/bingmayong1.jpg"
                ],
                "tags": [
                    "世界文化遗产",
                    "考古发现",
                    "历史奇迹"
                ],
                "is_active": true,
                "created_at": "2025-08-20T15:53:34.961942",
                "updated_at": "2025-08-20T15:53:34.961942"
            },
            {
                "id": 16,
                "name": "外滩",
                "description": "上海的标志性景观，万国建筑博览群",
                "category": "entertainment",
                "address": "上海市黄浦区中山东一路",
                "city": "上海",
                "province": "上海市",
                "latitude": "31.2397000",
                "longitude": "121.4900000",
                "ticket_price": "0.00",
                "opening_hours": "全天开放",
                "visit_duration": 90,
                "rating": "4.50",
                "rating_count": 0,
                "images": [
                    "https://example.com/images/waitan1.jpg"
                ],
                "tags": [
                    "城市地标",
                    "夜景",
                    "免费景点"
                ],
                "is_active": true,
                "created_at": "2025-08-20T15:53:34.953943",
                "updated_at": "2025-08-20T15:53:34.953943"
            },
            {
                "id": 14,
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
                "created_at": "2025-08-20T15:53:34.947946",
                "updated_at": "2025-08-20T15:53:34.947946"
            },
            {
                "id": 20,
                "name": "大雁塔",
                "description": "唐代佛教建筑，玄奘法师译经之地",
                "category": "cultural",
                "address": "陕西省西安市雁塔区雁塔路",
                "city": "西安",
                "province": "陕西省",
                "latitude": "34.2186000",
                "longitude": "108.9647000",
                "ticket_price": "50.00",
                "opening_hours": "08:00-17:30",
                "visit_duration": 90,
                "rating": "4.40",
                "rating_count": 0,
                "images": [
                    "https://example.com/images/dayanta1.jpg"
                ],
                "tags": [
                    "佛教文化",
                    "唐代建筑",
                    "历史古迹"
                ],
                "is_active": true,
                "created_at": "2025-08-20T15:53:34.964942",
                "updated_at": "2025-08-20T15:53:34.964942"
            },
            {
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
                "is_active": true,
                "created_at": "2025-08-20T15:53:34.955942",
                "updated_at": "2025-08-20T15:53:34.955942"
            }
        ],
        "is_recommendation": false,
        "pagination": {
            "current_page": 1,
            "total_pages": 2,
            "total_count": 17,
            "has_next": true,
            "has_previous": false
        }
    }
}

<http://localhost:5175/api/hzadmin/admin/user/users/?page=1&page_size=1000>

{
    "code": 200,
    "msg": null,
    "data": {
        "total": 11,
        "page": 1,
        "page_size": 1000,
        "users": [
            {
                "id": 14,
                "username": "test_user3",
                "first_name": "王",
                "last_name": "五",
                "email": "test3@example.com",
                "date_joined": "2025-08-20T15:53:34.762820",
                "last_login": null,
                "is_active": true,
                "is_staff": false,
                "is_superuser": false,
                "user_info": {
                    "id": 1,
                    "avatar": null,
                    "phone": null,
                    "wechat": null,
                    "qq": null,
                    "weibo": null,
                    "personal_site": null,
                    "bio": null,
                    "address": null,
                    "birthday": null,
                    "gender": null,
                    "created_at": "2025-08-21T10:12:03.743483",
                    "updated_at": "2025-08-21T10:12:03.747483"
                }
            },
            {
                "id": 13,
                "username": "test_user2",
                "first_name": "李",
                "last_name": "四",
                "email": "test2@example.com",
                "date_joined": "2025-08-20T15:53:34.587791",
                "last_login": null,
                "is_active": true,
                "is_staff": false,
                "is_superuser": false,
                "user_info": null
            },
            {
                "id": 12,
                "username": "test_user1",
                "first_name": "张",
                "last_name": "三",
                "email": "test1@example.com",
                "date_joined": "2025-08-20T15:53:34.408737",
                "last_login": null,
                "is_active": true,
                "is_staff": false,
                "is_superuser": false,
                "user_info": null
            },
            {
                "id": 11,
                "username": "user1",
                "first_name": "",
                "last_name": "",
                "email": "user1@example.com",
                "date_joined": "2025-08-20T15:48:05.616101",
                "last_login": "2025-08-21T11:34:08.400565",
                "is_active": true,
                "is_staff": false,
                "is_superuser": false,
                "user_info": null
            },
            {
                "id": 10,
                "username": "admin2",
                "first_name": "",
                "last_name": "",
                "email": "52@qq.com",
                "date_joined": "2025-08-20T15:28:05.508570",
                "last_login": "2025-08-20T17:59:07.486941",
                "is_active": true,
                "is_staff": true,
                "is_superuser": true,
                "user_info": null,
                "login_info": {
                    "user_id": 10,
                    "username": "admin2",
                    "login_time": "2025-08-20 17:59:07",
                    "ip": "192.168.124.11"
                }
            },
            {
                "id": 9,
                "username": "admin1",
                "first_name": "",
                "last_name": "",
                "email": "52@qq.com",
                "date_joined": "2025-08-20T15:27:27.397266",
                "last_login": "2025-08-21T10:07:50.444816",
                "is_active": true,
                "is_staff": true,
                "is_superuser": true,
                "user_info": null,
                "login_info": {
                    "user_id": 9,
                    "username": "admin1",
                    "login_time": "2025-08-21 10:07:50",
                    "ip": "192.168.124.14"
                }
            },
            {
                "id": 8,
                "username": "map_test_user",
                "first_name": "",
                "last_name": "",
                "email": "test@example.com",
                "date_joined": "2025-08-20T15:08:55.888018",
                "last_login": null,
                "is_active": true,
                "is_staff": false,
                "is_superuser": false,
                "user_info": null
            },
            {
                "id": 7,
                "username": "admin",
                "first_name": "",
                "last_name": "",
                "email": "admin@example.com",
                "date_joined": "2025-08-20T15:03:32.479542",
                "last_login": "2025-08-20T15:03:32.652172",
                "is_active": true,
                "is_staff": true,
                "is_superuser": true,
                "user_info": null
            },
            {
                "id": 6,
                "username": "testuser",
                "first_name": "",
                "last_name": "",
                "email": "test@example.com",
                "date_joined": "2025-08-20T15:01:16.369503",
                "last_login": "2025-08-20T15:02:25.417962",
                "is_active": true,
                "is_staff": false,
                "is_superuser": false,
                "user_info": null
            },
            {
                "id": 5,
                "username": "culture_lover",
                "first_name": "文化",
                "last_name": "探索者",
                "email": "culture@example.com",
                "date_joined": "2025-08-20T10:53:29.793444",
                "last_login": null,
                "is_active": true,
                "is_staff": false,
                "is_superuser": false,
                "user_info": null
            },
            {
                "id": 4,
                "username": "travel_enthusiast",
                "first_name": "旅游",
                "last_name": "爱好者",
                "email": "enthusiast@example.com",
                "date_joined": "2025-08-20T10:53:29.617900",
                "last_login": null,
                "is_active": true,
                "is_staff": false,
                "is_superuser": false,
                "user_info": null
            }
        ]
    }
}

<http://localhost:5175/api/travel/client/attractions/>

{
    "code": 200,
    "msg": "获取景点列表成功",
    "data": {
        "attractions": [
            {
                "id": 11,
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
                "created_at": "2025-08-20T15:53:34.939942",
                "updated_at": "2025-08-20T15:53:34.939942"
            },
            {
                "id": 18,
                "name": "西湖",
                "description": "中国著名的淡水湖，世界文化遗产",
                "category": "natural",
                "address": "浙江省杭州市西湖区",
                "city": "杭州",
                "province": "浙江省",
                "latitude": "30.2741000",
                "longitude": "120.1551000",
                "ticket_price": "0.00",
                "opening_hours": "全天开放",
                "visit_duration": 300,
                "rating": "4.70",
                "rating_count": 0,
                "images": [
                    "https://example.com/images/xihu1.jpg",
                    "https://example.com/images/xihu2.jpg"
                ],
                "tags": [
                    "世界文化遗产",
                    "湖光山色",
                    "免费景点"
                ],
                "is_active": true,
                "created_at": "2025-08-20T15:53:34.958942",
                "updated_at": "2025-08-20T15:53:34.958942"
            },
            {
                "id": 13,
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
                "created_at": "2025-08-20T15:53:34.944942",
                "updated_at": "2025-08-20T15:53:34.944942"
            },
            {
                "id": 12,
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
                "created_at": "2025-08-20T15:53:34.941942",
                "updated_at": "2025-08-20T15:53:34.941942"
            },
            {
                "id": 15,
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
                "created_at": "2025-08-20T15:53:34.950946",
                "updated_at": "2025-08-20T15:53:34.950946"
            },
            {
                "id": 19,
                "name": "兵马俑",
                "description": "世界第八大奇迹，秦始皇陵的陪葬坑",
                "category": "cultural",
                "address": "陕西省西安市临潼区秦始皇陵以东1.5公里处",
                "city": "西安",
                "province": "陕西省",
                "latitude": "34.3848000",
                "longitude": "109.2734000",
                "ticket_price": "120.00",
                "opening_hours": "08:30-17:00",
                "visit_duration": 150,
                "rating": "4.60",
                "rating_count": 0,
                "images": [
                    "https://example.com/images/bingmayong1.jpg"
                ],
                "tags": [
                    "世界文化遗产",
                    "考古发现",
                    "历史奇迹"
                ],
                "is_active": true,
                "created_at": "2025-08-20T15:53:34.961942",
                "updated_at": "2025-08-20T15:53:34.961942"
            },
            {
                "id": 16,
                "name": "外滩",
                "description": "上海的标志性景观，万国建筑博览群",
                "category": "entertainment",
                "address": "上海市黄浦区中山东一路",
                "city": "上海",
                "province": "上海市",
                "latitude": "31.2397000",
                "longitude": "121.4900000",
                "ticket_price": "0.00",
                "opening_hours": "全天开放",
                "visit_duration": 90,
                "rating": "4.50",
                "rating_count": 0,
                "images": [
                    "https://example.com/images/waitan1.jpg"
                ],
                "tags": [
                    "城市地标",
                    "夜景",
                    "免费景点"
                ],
                "is_active": true,
                "created_at": "2025-08-20T15:53:34.953943",
                "updated_at": "2025-08-20T15:53:34.953943"
            },
            {
                "id": 14,
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
                "created_at": "2025-08-20T15:53:34.947946",
                "updated_at": "2025-08-20T15:53:34.947946"
            },
            {
                "id": 20,
                "name": "大雁塔",
                "description": "唐代佛教建筑，玄奘法师译经之地",
                "category": "cultural",
                "address": "陕西省西安市雁塔区雁塔路",
                "city": "西安",
                "province": "陕西省",
                "latitude": "34.2186000",
                "longitude": "108.9647000",
                "ticket_price": "50.00",
                "opening_hours": "08:00-17:30",
                "visit_duration": 90,
                "rating": "4.40",
                "rating_count": 0,
                "images": [
                    "https://example.com/images/dayanta1.jpg"
                ],
                "tags": [
                    "佛教文化",
                    "唐代建筑",
                    "历史古迹"
                ],
                "is_active": true,
                "created_at": "2025-08-20T15:53:34.964942",
                "updated_at": "2025-08-20T15:53:34.964942"
            },
            {
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
                "is_active": true,
                "created_at": "2025-08-20T15:53:34.955942",
                "updated_at": "2025-08-20T15:53:34.955942"
            }
        ],
        "is_recommendation": false,
        "pagination": {
            "current_page": 1,
            "total_pages": 2,
            "total_count": 17,
            "has_next": true,
            "has_previous": false
        }
    }
}
