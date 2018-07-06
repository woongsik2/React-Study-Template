import React from 'react'
import Reflux from 'reflux'
import SDEnv from 'sdesk-consts'

import BigBreadcrumbs from '../../../components/layout/navigation/components/BigBreadcrumbs.jsx'
import WidgetGrid from '../../../components/layout/widgets/WidgetGrid.jsx'
import JarvisWidget from '../../../components/layout/widgets/JarvisWidget.jsx'
import UiDatepicker from '../../../components/forms/inputs/UiDatepicker.jsx'
import Select2 from '../../../components/forms/inputs/Select2.jsx'
import Datatable from '../../../components/tables/PlanTable.jsx'

// import SDeskAction from './actions/SDeskSysMgtDetailAction.jsx'
// import SDeskStore from './stores/SDeskSysMgtDetailStore.jsx'

import LoadingDiv from './etc/loading.jsx'

let TestMain = React.createClass({
    // mixins: [Reflux.connect(SDeskStore)],
    getInitialState: function () {
        // return SDeskStore.getData();
        return{
            test:''
        };
    },
    componentWillMount: function(){
        sd.log("componentWillMount", "componentWillMount")
    },

    componentDidMount() {
        sd.log("componentDidMount", "componentDidMount")
    },
    
    componentDidUpdate(){
        sd.log("componentDidUpdate", "componentDidUpdate")
    },

    _delegInsert: () => {
        sd.log(">>>>>>>")

        for(var i=0; i<10; i++){
            (function(j){
                $('#target' + j ).on('click', function(){
                    console.log(j);
                });
            })(i);
        }
    },
    
    render: function () {

        let userListArray = [];
        userListArray.push({id:"ABC", text:"곰"});

        // 유저 목록 조회 - woongsik
        // if(Array.isArray(this.state.get_userList)){
        //         this.state.get_userList.map((obj, idx)=>{
        //         let userText = obj.userNm + "(" + obj.depNm + ")";
        //         userListArray.push({id:obj.loginId, text:userText})
        //     })
        // }

        let userListArrayToSelect = <div />
        if(userListArray.length > 0){
            userListArrayToSelect = <Select2 listData={userListArray} actionChange={this._userSelected}></Select2>
        }

        let empowermentRowSelected = <div/>
        empowermentRowSelected = <div className="row">
                                        <div className="col col-xs-12">
                                            <button type="button" className="btn btn-info btn-sm pull-right" onClick={this._delegInsert}>
                                                <i className="fa fa-plus fa-md right-gap"></i>등록
                                            </button>                                
                                        </div>

                                        <div className="col col-xs-12">
                                            <button id="target0" type="button" className="btn btn-info btn-sm pull-right" onClick={this._delegInsert}>
                                                <i className="fa fa-plus fa-md right-gap"></i>0
                                            </button>                                
                                        </div>
                                        <div className="col col-xs-12">
                                            <button id="target1" type="button" className="btn btn-info btn-sm pull-right" onClick={this._delegInsert}>
                                                <i className="fa fa-plus fa-md right-gap"></i>1
                                            </button>                                
                                        </div>
                                        <div className="col col-xs-12">
                                            <button id="target2" type="button" className="btn btn-info btn-sm pull-right" onClick={this._delegInsert}>
                                                <i className="fa fa-plus fa-md right-gap"></i>2
                                            </button>                                
                                        </div>
                                        <div className="col col-xs-12">
                                            <button id="target3" type="button" className="btn btn-info btn-sm pull-right" onClick={this._delegInsert}>
                                                <i className="fa fa-plus fa-md right-gap"></i>3
                                            </button>                                
                                        </div>
                                        <div className="col col-xs-12">
                                            <button id="target4" type="button" className="btn btn-info btn-sm pull-right" onClick={this._delegInsert}>
                                                <i className="fa fa-plus fa-md right-gap"></i>4
                                            </button>                                
                                        </div>
                                    </div>
        
        return (
            <div id="content">
                <WidgetGrid>
                    <JarvisWidget colorbutton={false} editbutton={false} custombutton={false}>
                        <header>
                            <span className="widget-icon"> <i className="fa fa-edit"/> </span>
                            <h2 className="txt-color-blue">권한 위임</h2>
                        </header>
                                
                        <div className="row">

                            <form className="smart-form">
                                <fieldset>

                                    <div className="row">
                                        <div className="col col-lg-3 col-md-6 col-sm-12 col-xs-12">
                                        <label className="label col col-lg-2 col-md-3 col-sm-3 col-xs-3">검색</label>
                                        <section className="col col-lg-10 col-md-9 col-sm-9 col-xs-9">                                           
                                            <label className="input">
                                                {userListArrayToSelect}
                                            </label>
                                        </section>
                                        </div>
                                    </div><hr/><br/>

                                    <div className="row">
                                        <div className="col col-lg-3 col-md-6 col-sm-12 col-xs-12">
                                            <label className="label col col-lg-2 col-md-3 col-sm-3 col-xs-3">ID</label>
                                            <section className="col col-lg-10 col-md-9 col-sm-9 col-xs-9">
                                                <label className="input">
                                                    <input type="text" name="name" value='' disabled/>
                                                </label>
                                            </section>
                                            <label className="label col col-lg-2 col-md-3 col-sm-3 col-xs-3">이름</label>
                                            <section className="col col-lg-10 col-md-9 col-sm-9 col-xs-9">
                                                <label className="input">
                                                    <input type="text" name="name" value='' disabled/>
                                                </label>
                                            </section>
                                            <label className="label col col-lg-2 col-md-3 col-sm-3 col-xs-3">부서</label>
                                            <section className="col col-lg-10 col-md-9 col-sm-9 col-xs-9">
                                                <label className="input">
                                                    <input type="text" name="name" value='' disabled/>
                                                </label>
                                            </section>
                                        </div>
                                        <div className="col col-lg-6 col-md-6 col-sm-12 col-xs-12">
                                            <label className="label col col-lg-2 col-md-3 col-sm-3 col-xs-3">위임 기간</label>                                       
                                                
                                                <section className="col col-lg-3 col-md-4 col-sm-4 col-xs-4">
                                                    <label className="input"> <i className="icon-append fa fa-calendar"/>
                                                        <UiDatepicker type="text" id="startDate" 
                                                            dateFormat="yy.mm.dd" placeholder="From"
                                                            minRestrict="#endDate"
                                                            numberOfMonths={3} changesMonth={true}
                                                            defaultDate="+1w" 
                                                            onDateChange={this._getStartDateChange}/>
                                                        <i className="icon-append fa fa-calendar"/>
                                                    </label>
                                                </section>
                                                <section className="col col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                                    <div className="force-text-align-center">
                                                        <h2>~</h2>
                                                    </div>
                                                </section>
                                                <section className="col col-lg-3 col-md-4 col-sm-4 col-xs-4">
                                                    <label className="input"> <i className="icon-append fa fa-calendar"/>
                                                        <UiDatepicker type="text" id="endDate" 
                                                            dateFormat="yy.mm.dd" placeholder="To"
                                                            maxRestrict="#startDate"
                                                            numberOfMonths={3} changesMonth={true}
                                                            defaultDate="+1w" 
                                                            onDateChange={this._getEndDateChange}/>
                                                        <i className="icon-append fa fa-calendar"/>
                                                    </label>
                                                </section>
                                        </div>
                                        <div className="col col-lg-3 col-md-12 col-sm-12 col-xs-12">
                                            {/*<div className="row">
                                                <label className="col col-2">상태</label>
                                                <section className="col col-5">
                                                    <label className="checkbox">
                                                    <input ref="delegedRlseYn" type="checkbox" name="checkbox"/>
                                                    <i/>수임해제</label>
                                                </section>
                                            </div> // 차후 추가 예정 */}

                                            
                                            <label className="col col-lg-2 col-md-3 col-sm-3 col-xs-3">권한</label>
                                            <section className="col col-lg-5 col-md-4 col-sm-4 col-xs-4">
                                                <label className="checkbox">
                                                <input ref="iptDelegedYn" type="checkbox" name="checkbox"
                                                        defaultChecked/>
                                                <i/>입력</label>
                                            </section>                                
                                            <section className="col col-lg-5 col-md-4 col-sm-4 col-xs-4">
                                                <label className="checkbox">
                                                <input ref="adjtDelegedYn" type="checkbox" name="checkbox"/>
                                                <i/>조정</label>
                                            </section>
                                        

                                            <div className="col col-12">
                                                <h6 className="txt-color-blue">
                                                    <span className="widget-icon"> <i className="fa fa-check"/> </span>                                                     
                                                    <span><small className="txt-color-blue"> 원하시는 항목을 체크하세요. </small></span>
                                                </h6>
                                            </div>                                        
                                        </div>


                                    </div>
                                    <hr/><br/>

                                    {empowermentRowSelected}

                                </fieldset>
                            </form>
                        </div>
                    </JarvisWidget>
                </WidgetGrid>
            </div>
        )
    }
});

export default TestMain;