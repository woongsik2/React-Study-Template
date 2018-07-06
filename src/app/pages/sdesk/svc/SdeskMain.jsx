import React from 'react'
import Reflux from 'reflux'
import Moment from 'moment'

import BigBreadcrumbs from '../../../../components/layout/navigation/components/BigBreadcrumbs.jsx'

import WidgetGrid from '../../../../components/layout/widgets/WidgetGrid.jsx'
import JarvisWidget from '../../../../components/layout/widgets/JarvisWidget.jsx'
import LiveFeeds from '../../dashboard/LiveFeeds.jsx'

import ChartJsGraph from '../../../../components/graphs/chartjs/ChartJsGraph.jsx'

import AjaxActions from '../../../../components/actions/AjaxActions'

import LoadingDiv from '../etc/loading.jsx'

let actions = Reflux.createActions({
    init: {asyncResult: true},
    daySttcs: {asyncResult: true},
    monthSttcs: {asyncResult: true}
});
actions.init.listen(function(){
    $.getJSON('api/graphs/chartjs.json').then(this.completed, this.failed)
});
actions.daySttcs.listen(function(){
    //일별 통계 조회
    $.getJSON('api/sdesk/main_day.json').then(this.completed, this.failed)
});
actions.monthSttcs.listen(function(){
    //월별 통계 조회
    $.getJSON('api/sdesk/main_mon.json').then(this.completed, this.failed)
});

// Update the store when the init action's promise is completed
let store = Reflux.createStore({
    listenables: actions,
    init: function(){
        if(!this.data){
            this.data={
                init:{},
                day:{
                    uv:{},
                    pv:{},
                    atcl:{},
                    totalAtcl:{},
                    date:''
                },
                mon:{
                    uv:{},
                    pv:{},
                    atcl:{},
                    totalAtcl:{},
                    date:''
                },
                isLoadingDaySttcs:false,
                isLoadingMonthSttcs:false
            }
        }
    },
    onInitCompleted: function(data){
        this.data.init = data;
        //this.trigger(this.data);
        sd.log('this.data.isLoadingDaySttcs', this.data.isLoadingDaySttcs);
        sd.log('this.data.isLoadingMonthSttcs', this.data.isLoadingMonthSttcs);

        if(this.data.isLoadingDaySttcs == false || this.data.isLoadingMonthSttcs == false){
            actions.daySttcs();
            actions.monthSttcs();
        }        
    },
    onDaySttcsCompleted: function(data){
        this.settingSttcsData(this.data.day, data,'DAY');
        
        sd.log('this.data.day',this.data.day);
        this.data.isLoadingDaySttcs = true;
        this.trigger(this.data);
    },
    onMonthSttcsCompleted: function(data){
        this.settingSttcsData(this.data.mon, data,'MON');
        
        sd.log('this.data.mon',this.data.mon);
        this.data.isLoadingMonthSttcs = true;
        this.trigger(this.data);
    },
    settingSttcsData:function(targetObj, data, dateType){
        let barChartTemplate = _.cloneDeep(this.data.init['sdesk-chart']);
        
        targetObj.uv = _.cloneDeep(barChartTemplate);
        targetObj.pv = _.cloneDeep(barChartTemplate);
        targetObj.atcl = _.cloneDeep(barChartTemplate);
        targetObj.totalAtcl = _.cloneDeep(barChartTemplate);
        
        data.data.map((obj)=>{
            let dateStr;
            if(dateType == 'DAY'){
                dateStr = Moment(obj.dateDiv,'YYYYMMDD').format('YYYY.MM.DD');
            }else if(dateType == 'MON'){
                dateStr = Moment(obj.dateDiv,'YYYYMM').format('YYYY.MM');
            }else{
                dateStr = obj.dateDiv;
            }

            if(!targetObj.date)targetObj.date = dateStr;
            
            targetObj.uv.labels.unshift(dateStr);
            targetObj.pv.labels.unshift(dateStr);
            targetObj.atcl.labels.unshift(dateStr);
            targetObj.totalAtcl.labels.unshift(dateStr);
            
            targetObj.uv.datasets[0].data.unshift(obj.data01);
            targetObj.pv.datasets[0].data.unshift(obj.data02);
            targetObj.atcl.datasets[0].data.unshift(obj.data03);
            targetObj.totalAtcl.datasets[0].data.unshift(obj.data05);
        });
        targetObj.uv.default = sd.formatter(parseInt(_.last(targetObj.uv.datasets[0].data)));
        targetObj.pv.default = sd.formatter(parseInt(_.last(targetObj.pv.datasets[0].data)));
        targetObj.atcl.default = sd.formatter(parseInt(_.last(targetObj.atcl.datasets[0].data)));
        targetObj.totalAtcl.default = sd.formatter(parseInt(_.last(targetObj.totalAtcl.datasets[0].data)));
    },
    getData: function(){
        return this.data;
    }
});

let SdeskMain = React.createClass({
    mixins: [Reflux.connect(store)],
    getInitialState: function () {
        return store.getData();
    },
    componentWillMount: function () {
        actions.init();
        
    },
    render: function () {
        if(!(this.state.isLoadingDaySttcs && this.state.isLoadingMonthSttcs))return(
            <div id="content">
                <iframe id="fakeLoginView" className="gone"></iframe>
                <LoadingDiv />
            </div>
        );
        
        return (
			<div id="content">
                <div className="row">
                    <BigBreadcrumbs items={['서비스 관리', '메인']} icon="table"
                                    className="col-xs-12 col-sm-7 col-md-7 col-lg-4"/>
                </div>
                <h1>Social Desk Admin page</h1>
                <WidgetGrid>
                <div className="col-xs-12 bottom-gap line-solid">
                    <div className="row bottom-gap top-gap">
                    <div className="col-xs-12 col-lg-6">
                        <h4>{this.state.day.date}</h4>
                    </div>
                    <div className="col-xs-12 col-lg-6 ">
                        <h4 className="pull-right">일별</h4>
                    </div>
                    </div>
                </div>
                <div className="row">
                    <article className="col-xs-12 col-sm-6 col-md-6 col-lg-3">
                        <JarvisWidget editbutton={false}>
                            <header>
                                <span className="widget-icon"> <i className="fa fa-bar-chart-o"/> </span>
                                <h2>UV</h2>
                            </header>
                            <div>
                                <div className="widget-body">
                                    <div className="row">
                                    <div className="col-xs-12">
                                        <h4 className="sttcs-view pull-right">{this.state.day['uv']['default']}</h4>
                                        <p className="sttcs-view-label pull-right">로그인 수</p>
                                    </div>
                                    </div>
                                    <ChartJsGraph type="bar" data={this.state.day['uv']} />
                                </div>
                            </div>
                        </JarvisWidget>
                    </article>
                    <article className="col-xs-12 col-sm-6 col-md-6 col-lg-3">
                        <JarvisWidget editbutton={false}>
                            <header>
                                <span className="widget-icon"> <i className="fa fa-bar-chart-o"/> </span>
                                <h2>PV</h2>
                            </header>
                            <div>
                                <div className="widget-body">
                                    <div className="row">
                                    <div className="col-xs-12">
                                        <h4 className="sttcs-view pull-right">{this.state.day['pv']['default']}</h4>
                                        <p className="sttcs-view-label pull-right">페이지 뷰 수</p>
                                    </div>
                                    </div>
                                    <ChartJsGraph type="bar" data={this.state.day['pv']} />
                                </div>
                            </div>
                        </JarvisWidget>
                    </article>
                    <article className="col-xs-12 col-sm-6 col-md-6 col-lg-3">
                        <JarvisWidget editbutton={false}>
                            <header>
                                <span className="widget-icon"> <i className="fa fa-bar-chart-o"/> </span>
                                <h2>질문 작성 수</h2>
                            </header>
                            <div>
                                <div className="widget-body">
                                    <div className="row">
                                    <div className="col-xs-12">
                                        <h4 className="sttcs-view pull-right">{this.state.day['atcl']['default']}</h4>
                                        <p className="sttcs-view-label pull-right">질문 글 개수</p>
                                    </div>
                                    </div>
                                    <ChartJsGraph type="bar" data={this.state.day['atcl']} />
                                </div>
                            </div>
                        </JarvisWidget>
                    </article>
                    <article className="col-xs-12 col-sm-6 col-md-6 col-lg-3">
                        <JarvisWidget editbutton={false}>
                            <header>
                                <span className="widget-icon"> <i className="fa fa-bar-chart-o"/> </span>
                                <h2>총 질문 수</h2>
                            </header>
                            <div>
                                <div className="widget-body">
                                    <div className="row">
                                    <div className="col-xs-12">
                                        <h4 className="sttcs-view pull-right">{this.state.day['totalAtcl']['default']}</h4>
                                        <p className="sttcs-view-label pull-right">전체 질문 글 개수</p>
                                    </div>
                                    </div>
                                    <ChartJsGraph type="bar" data={this.state.day['totalAtcl']} />
                                </div>
                            </div>
                        </JarvisWidget>
                    </article>
                </div>
                
                <div className="col-xs-12 bottom-gap line-solid">
                    <div className="row bottom-gap top-gap">
                    <div className="col-xs-12 col-lg-6">
                        <h4>{this.state.mon.date}</h4>
                    </div>
                    <div className="col-xs-12 col-lg-6 ">
                        <h4 className="pull-right">월별</h4>
                    </div>
                    </div>
                </div>
                <div className="row">
                    <article className="col-xs-12 col-sm-6 col-md-6 col-lg-3">
                        <JarvisWidget editbutton={false}>
                            <header>
                                <span className="widget-icon"> <i className="fa fa-bar-chart-o"/> </span>
                                <h2>UV</h2>
                            </header>
                            <div>
                                <div className="widget-body">
                                    <div className="row">
                                    <div className="col-xs-12">
                                        <h4 className="sttcs-view pull-right">{this.state.mon['uv']['default']}</h4>
                                        <p className="sttcs-view-label pull-right">로그인 수</p>
                                    </div>
                                    </div>
                                    <ChartJsGraph type="bar" data={this.state.mon['uv']} />
                                </div>
                            </div>
                        </JarvisWidget>
                    </article>
                    <article className="col-xs-12 col-sm-6 col-md-6 col-lg-3">
                        <JarvisWidget editbutton={false}>
                            <header>
                                <span className="widget-icon"> <i className="fa fa-bar-chart-o"/> </span>
                                <h2>PV</h2>
                            </header>
                            <div>
                                <div className="widget-body">
                                    <div className="row">
                                    <div className="col-xs-12">
                                        <h4 className="sttcs-view pull-right">{this.state.mon['pv']['default']}</h4>
                                        <p className="sttcs-view-label pull-right">페이지 뷰 수</p>
                                    </div>
                                    </div>
                                    <ChartJsGraph type="bar" data={this.state.mon['pv']} />
                                </div>
                            </div>
                        </JarvisWidget>
                    </article>
                    <article className="col-xs-12 col-sm-6 col-md-6 col-lg-3">
                        <JarvisWidget editbutton={false}>
                            <header>
                                <span className="widget-icon"> <i className="fa fa-bar-chart-o"/> </span>
                                <h2>질문 작성 수</h2>
                            </header>
                            <div>
                                <div className="widget-body">
                                    <div className="row">
                                    <div className="col-xs-12">
                                        <h4 className="sttcs-view pull-right">{this.state.mon['atcl']['default']}</h4>
                                        <p className="sttcs-view-label pull-right">질문 글 개수</p>
                                    </div>
                                    </div>
                                    <ChartJsGraph type="bar" data={this.state.mon['atcl']} />
                                </div>
                            </div>
                        </JarvisWidget>
                    </article>
                    <article className="col-xs-12 col-sm-6 col-md-6 col-lg-3">
                        <JarvisWidget editbutton={false}>
                            <header>
                                <span className="widget-icon"> <i className="fa fa-bar-chart-o"/> </span>
                                <h2>총 질문 수</h2>
                            </header>
                            <div>
                                <div className="widget-body">
                                    <div className="row">
                                    <div className="col-xs-12">
                                        <h4 className="sttcs-view pull-right">{this.state.mon['totalAtcl']['default']}</h4>
                                        <p className="sttcs-view-label pull-right">전체 질문 글 개수</p>
                                    </div>
                                    </div>
                                    <ChartJsGraph type="bar" data={this.state.mon['totalAtcl']} />
                                </div>
                            </div>
                        </JarvisWidget>
                    </article>
                </div>   
                </WidgetGrid>
            </div>
		)
    }
});
export default SdeskMain