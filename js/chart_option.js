/**
 * Created by springlee on 2018/1/4.
 */

function get_order_distribute_chart_option(city_min_num,city_max_num,map_data) {
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
            min: parseInt(city_min_num),
            max: parseInt(city_max_num),
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
                data: map_data,
                symbolSize: function (val) {
                    return val[2]/(city_max_num/30) ;
                },
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

function get_category_chart_option(category) {
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
            data: category.name,
            axisTick: {
                alignWithLabel: true
            }

        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: category.order_total,
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

function get_tj_chart_option(title ,axis_label,xAxis_key,today_info_value,yesterday_info_value) {
    return {
        title: {
            text: title
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                var html = '';
                $.each(params,function (index,value) {
                    if(index==0){
                        html+=axis_label[value.dataIndex]+'<br>';
                    }
                    html+= value.marker +value.seriesName +':'+value.data+'<br>';
                })
                return html;
            }
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
            data:xAxis_key
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name:'今日',
                type:'line',
                data:today_info_value
            },
            {
                name: '昨日',
                type: 'line',
                data: yesterday_info_value
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
    })
    $.each(sku_total_top10 ,function (index,val) {
        sku_total_top10_html +='<li>NO:'+(index+1)+'&nbsp;&nbsp;&nbsp;'+val['name']+'<span class="num_tips">('+val['order_total']+'元)</span></li>'
    })
    $("#sku_num_top10").html(sku_num_top10_html);
    $("#sku_total_top10").html(sku_total_top10_html);
}
