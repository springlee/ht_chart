/**
 * Created by springlee on 2018/1/4.
 */
var url ='http://erp.haitungongyinglian.hk/open/chart';

function get_order_distribute_chart_option() {
    return {
        backgroundColor: '#fff',
        title: {
            text: '订单区域分布图',
            subtext: '海豚供应链(单位:件)',
            sublink: 'http://www.haitun.hk',
            left: 'center',
            textStyle: {
                color: '#404a59',
                fontSize:'18'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                return params.name + ' : ' + params.value[2];
            }
        },
        visualMap: {
            min: 0,
            max: 0,
            calculable: true,
            inRange: {
                color: ['#50a3ba', '#eac736', '#d94e5d']
            },
            textStyle: {
                color: '#404a59'
            }
        },
        geo: {
            map: 'china',
            label: {
                emphasis: {
                    show: true
                }
            },
            itemStyle: {
                //区块颜色
                normal: {
                    areaColor: '#323c48',
                    borderColor: '#111'
                },
                //鼠标悬浮去区块地图的颜色
                emphasis: {
                    areaColor: '#2a333d'
                }
            },
            zoom:1.25
        },
        series : [
            {
                type: 'scatter',
                coordinateSystem: 'geo',
                data: [],
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#ddb926'
                    }
                }
            }
        ]
    };
}

function get_category_chart_option() {
    return  {
        title: {
            text: '类目(单位:元)',
            itemStyle: {
                normal: {
                    color: '#404a59'
                }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {},
        xAxis: {
            data:[],
            axisTick: {
                alignWithLabel: true
            }

        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: [],
            itemStyle: {
                normal: {
                    color: '#404a59',
                }
            },
            barWidth: 40,
            barGap: '-100%', // Make series be overlap
        }]
    };
}

function get_tj_chart_option() {
    return {
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            data:['今日','昨日']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data:[]
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name:'今日',
                type:'line',
                data:[]
            },
            {
                name: '昨日',
                type: 'line',
                data: []
            }
        ]
    }
}
 function render_top10 (sku_num_top10 ,sku_total_top10) {
    $("#sku_num_top10 ,#sku_total_top10").empty();
    var sku_num_top10_html  = '';
    var sku_total_top10_html = '';
    $.each(sku_num_top10 ,function (index,val) {
        sku_num_top10_html +='<li>NO:'+(index+1)+'&nbsp;&nbsp;&nbsp;'+val['name']+'<span class="num_tips">('+val['num']+')</span></li>'
    });
    $.each(sku_total_top10 ,function (index,val) {
        sku_total_top10_html +='<li>NO:'+(index+1)+'&nbsp;&nbsp;&nbsp;'+val['name']+'<span class="num_tips">('+val['order_total']+'元)</span></li>'
    });
    $("#sku_num_top10").html(sku_num_top10_html);
    $("#sku_total_top10").html(sku_total_top10_html);
}

function get_now_format_date () {
    var date = new Date();
    var sep= "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    return year + sep + month + sep + strDate;
}

// 判断各种浏览器，找到正确的方法
function launch_full_screen (element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

function init_chart() {
    //初始化e_chart
    var pv_chart_1 = echarts.init(document.getElementById('pv_chart_1'));
    var pv_chart_2 = echarts.init(document.getElementById('pv_chart_2'));
    var category_chart = echarts.init(document.getElementById('category_chart'));
    var order_distribute_chart = echarts.init(document.getElementById('order_distribute_chart'));
    //地图 区域分布
    var order_distribute_chart_option = get_order_distribute_chart_option();
    order_distribute_chart.setOption(order_distribute_chart_option);
    //类目
    var category_chart_option = get_category_chart_option();
    category_chart.setOption(category_chart_option);

    var option_tj = get_tj_chart_option();
    pv_chart_1.setOption(option_tj);
    pv_chart_2.setOption(option_tj);

    pv_chart_1.showLoading();
    pv_chart_2.showLoading();
    category_chart.showLoading();
    order_distribute_chart.showLoading();
    $("#current_date").text(get_now_format_date());
    $.ajax({
        type: "post",
        url: url,
        dataType: "jsonp",
        jsonp: "callback",//传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
        async: false,
        success: function (json) {
            pv_chart_1.hideLoading();
            pv_chart_2.hideLoading();
            category_chart.hideLoading();
            order_distribute_chart.hideLoading();
            var chart_data = json;
            //初始化数量
            var today_order_total_price = accounting.formatMoney(chart_data.order_total, '');
            var today_order_total_num = chart_data.order_num;
            $("#today_order_total_price").html(today_order_total_price);
            $("#today_order_total_num").html(today_order_total_num);
            $("#today_order_total_price,#today_order_total_num").countUp({
                delay: 5,
                time: 500
            });
            $("#today_pv").html(chart_data.baidu_tj.today_pv);
            $("#today_uv").html(chart_data.baidu_tj.today_uv);

            //top10
            render_top10(chart_data.sku_num_top10,chart_data.sku_total_top10);
            order_distribute_chart.setOption({
                visualMap: {
                    min: parseInt(chart_data.city_min_num),
                    max: parseInt(chart_data.city_max_num),
                },
                series: [
                    {
                        data: chart_data.map_data ,
                        symbolSize: function (val) {
                            return val[2]/(chart_data.city_max_num/30);
                        }
                    }
                ]
            });
            category_chart.setOption({
                xAxis: {
                    data:chart_data.category.name
                },
                series: [{
                    data: chart_data.category.order_total
                }]
            });
            //折线(pv uv)
            var axis_label = chart_data.baidu_tj.xAxis_name;
            pv_chart_1.setOption({
                title: {
                    text: '网站PV'
                },
                tooltip: {
                    formatter: function (params) {
                        var html = '';
                        $.each(params,function (index,value) {
                            if(!index){
                                html+=axis_label[value.dataIndex]+'<br>';
                            }
                            html+= value.marker +value.seriesName +':'+value.data+'<br>';
                        })
                        return html;
                    }
                },
                xAxis: {
                    data:chart_data.baidu_tj.xAxis_key
                },
                series: [
                    {
                        name:'今日',
                        type:'line',
                        data:chart_data.baidu_tj.today_info.pv
                    },
                    {
                        name: '昨日',
                        type: 'line',
                        data: chart_data.baidu_tj.yesterday_info.pv
                    }
                ]
            });
            pv_chart_2.setOption({
                title: {
                    text: '网站UV'
                },
                tooltip: {
                    formatter: function (params) {
                        var html = '';
                        $.each(params,function (index,value) {
                            if(!index){
                                html+=axis_label[value.dataIndex]+'<br>';
                            }
                            html+= value.marker +value.seriesName +':'+value.data+'<br>';
                        })
                        return html;
                    }
                },
                xAxis: {
                    data:chart_data.baidu_tj.xAxis_key
                },
                series: [
                    {
                        name:'今日',
                        type:'line',
                        data:chart_data.baidu_tj.today_info.uv
                    },
                    {
                        name: '昨日',
                        type: 'line',
                        data: chart_data.baidu_tj.yesterday_info.uv
                    }
                ]
            });
        },
        error: function () {
            console.log('接口异常');
        }
    });
}