import React from 'react'
import Reflux from 'reflux'
import SDEnv from 'sdesk-consts'

import BigBreadcrumbs from '../../../../../components/layout/navigation/components/BigBreadcrumbs.jsx'
import WidgetGrid from '../../../../../components/layout/widgets/WidgetGrid.jsx'
import JarvisWidget from '../../../../../components/layout/widgets/JarvisWidget.jsx'

import SDeskAction from './actions/SDeskSysMgtDetailAction.jsx'
import SDeskStore from './stores/SDeskSysMgtDetailStore.jsx'

import LoadingDiv from '../../etc/loading.jsx'

import ScreenSelector from '../../modals/ScreenSelector.jsx'

import ScriptLoader from '../../../../../components/utils/mixins/ScriptLoader.jsx'

let SDeskSysMgtDetail = React.createClass({
    mixins: [Reflux.connect(SDeskStore),ScriptLoader],
    getInitialState: function () {
        return SDeskStore.getData();
    },
    componentWillMount: function(){
        //sd.log('componentWillMount','Call Actions For Init');
        SDeskAction.init();
        SDeskAction.loadSysData(this.props.params.id);
        SDeskAction.loadScrData(this.props.params.id);
    },
    
    componentDidUpdate(){
        this.loadScript('/vendor.ui.js').then(function(){
            $('#screenIndexSelector').off('hide.bs.modal');
            $('#screenInsertSelector').off('hide.bs.modal');
            
            $('#screenIndexSelector').on('hide.bs.modal',()=>{
                sd.log('HIDE MODAL');
                this.setState({screenIndexQuery:''});
            });
            
            $('#screenInsertSelector').on('hide.bs.modal',()=>{
                sd.log('HIDE MODAL');
                this.setState({screenInsertQuery:''});
            });
        }.bind(this));
    },
    
    _onModify: function(e){
         SDeskAction.modify();
    },
    _onModifyConfirm: function(e){
        SDeskAction.modifyConfirm(this.state.sysData, this.state.linkScreens);
    },
    _onModifyCancel: function(e){  
        SDeskAction.modifyCancel();
    },
    _onInsertConfirm: function(e){
        SDeskAction.insert(this.state.sysData, this.state.linkScreens);
    },
    _onInsertCancel: function(e){
        this.props.history.push('/svc/system/');
    },
    _onStop: function(e){
        let sysId = this.state.sysData.sysId;
        let sysNm = this.state.sysData.sysNm;
        $.SmartMessageBox({
            title: "시스템 사용 정지",
            content: sysNm+'('+sysId+')를 사용 정지 상태로 변경합니까?',
            buttons: '[Yes][No]'
        }, function (ButtonPressed) {
            if (ButtonPressed === "Yes") {
                sd.log('시스템 사용 상태','정지');
                SDeskAction.stop(sysId);
            }
            if (ButtonPressed === "No") {
                sd.log('시스템 사용 상태','정지 취소');
            }

        });
    },
    
    _onChangeIpt: function(e){
        SDeskAction.changeIpt(e.target.getAttribute('data-id'), e.target.value);
    },
    
    _onChangeIndexScreen: function(e){
        //Index Screen을 변경하는 버튼을 선택할 경우
    },
    
    _onRemoveScreen: function(e){
        //소속 업무를 삭제 버튼을 선택할 경우  
        if(this.state.STATUS == SDEnv.STATUS.RETRIEVE)return;
        let removeTargetId = e.currentTarget.getAttribute('data-id');
        SDeskAction.removeTag(removeTargetId);
    },
    
    _searchScreenIndex: function(e){
        if(this.state.STATUS == SDEnv.STATUS.RETRIEVE)return;
        $('#screenIndexSelector').modal('show');
    },
    
    _searchScreenInsert: function(e){
        if(this.state.STATUS == SDEnv.STATUS.RETRIEVE)return;
        $('#screenInsertSelector').modal('show');
    },
    
    _selectScreenIndex:function(screenId){
        $('#screenIndexSelector').modal('hide');
        SDeskAction.selectIndexScreen(screenId);
    },
    _selectScreenInsert:function(screenId,screenNm){
        $('#screenInsertSelector').modal('hide');
        SDeskAction.selectInsertScreen(screenId,screenNm);
    },
    
    render: function () {
        if(sd.get(SDEnv.PAGE.REDIRECT)){
            let pushUrl = sd.get(SDEnv.PAGE.REDIRECT);
            this.props.history.push(pushUrl);
            sd.set(SDEnv.PAGE.REDIRECT, '');
            // TODO : Redirect 전용
            
            return(<div />);
        }
        
        sd.log('SDeskSysMgtDetail render',this.state);
        //데이터가 로드 되지 않으면 비어있는 화면.
        if(this.state.isLoading)return(
            <LoadingDiv />
        );
        let disableClass = 'state-disabled';
        let disableFlag = 'disabled';
        let disableModifyClass = 'state-disabled';
        let disableModifyFlag = 'disabled';
        let btnSet = <div />
        let catgs = <div />
        
        if(this.state.linkScreens.length > 0){
            catgs = this.state.linkScreens.map((obj)=>{
                return (
                    <div className="tags">
                        <span className="left-gap">{obj.screenId}({obj.screenNm})</span>
                        <div className="remove" data-id={obj.screenId} onClick={this._onRemoveScreen}>
                            <i className="fa fa-times-circle" />
                        </div>
                    </div>
                )
            })
        }
        
        if(this.state.STATUS == SDEnv.STATUS.INSERT){
            disableClass = '';
            disableFlag = '';
            disableModifyFlag = '';
            disableModifyClass = '';
            
            btnSet = <div className="col-sm-6">
                    <a href-void className="btn btn-danger pull-right bottom-gap left-gap" onClick={this._onInsertCancel}>
                        <i className="fa fa-remove right-gap"></i>취소</a>
                    <a href-void className="btn btn-success pull-right bottom-gap" onClick={this._onInsertConfirm}>
                        <i className="fa fa-check right-gap"></i>확인</a>
                </div>
                
        }else if(this.state.STATUS == SDEnv.STATUS.MODIFY){
            disableClass = '';
            disableFlag = '';
            
            btnSet = <div className="col-sm-6">
                    <a href-void className="btn btn-danger pull-right bottom-gap left-gap" onClick={this._onModifyCancel}>
                        <i className="fa fa-remove right-gap"></i>취소</a>
                    <a href-void className="btn btn-success pull-right bottom-gap" onClick={this._onModifyConfirm}>
                        <i className="fa fa-check right-gap"></i>확인</a>
                    
                </div>
                
        }else if(this.state.STATUS == SDEnv.STATUS.RETRIEVE){
            btnSet = <div className="col-sm-6">
                    <a href-void className="btn btn-danger pull-right bottom-gap left-gap" onClick={this._onStop}>
                        <i className="fa fa-remove right-gap"></i>정지</a>
                    <a href-void className="btn btn-default pull-right bottom-gap" onClick={this._onModify}>수정</a>
                </div>
        }
        
        return (
            <div id="content">
                <div className="row">
                    <BigBreadcrumbs items={['서비스 관리', '시스템 관리']} icon="table"
                                    className="col-xs-12 col-sm-7 col-md-7 col-lg-4"/>
                </div>
                <p>시스템 관리 상세 페이지 입니다. </p>
                <div className="row">
                <h3 className="col-sm-6">시스템 상세</h3>
                {btnSet}
                </div>
                
                <WidgetGrid>
                <div className="row">
                <article className="col-sm-6">
                    <JarvisWidget editbutton={false} color="darken">
                    <header><span className="widget-icon"> </span> 
                        <h2>카테고리 기본 정보</h2>
                    </header>
                    <div><div className="widget-body no-padding">
                        <form className="smart-form">
                        <fieldset>
                            <section>
                                <label className="label">ID</label>
                                <label className={"input "+disableModifyClass}>
                                    <input type="text" className="input-sm" data-id="sysId" defaultValue={this.state.sysData.sysId}  onChange={this._onChangeIpt} disabled={disableModifyFlag}/>
                                </label>
                                
                                <div className="note">
                                    <strong><i className="glyphicon glyphicon-warning-sign right-gap color-red"/>필수</strong>
                                </div>
                            </section>
                            <section>
                                <label className="label">이름</label>
                                <label className={"input "+disableClass}>
                                    <input type="text" className="input-sm" data-id="sysNm" defaultValue={this.state.sysData.sysNm} onChange={this._onChangeIpt} disabled={disableFlag}/>
                                </label>
                                
                                <div className="note">
                                    <strong><i className="glyphicon glyphicon-warning-sign right-gap color-red"/>필수</strong>
                                </div>
                            </section>
                            <section>
                                <label className="label">설명</label>
                                <label className={"textarea "+disableClass}>
                                    <textarea rows="3" className="custom-scroll" data-id="sysDetl" defaultValue={this.state.sysData.sysDetl} onChange={this._onChangeIpt} disabled={disableFlag}/>
                                </label>
                            </section>
                        </fieldset>
                        </form>
                    </div></div>
                    </JarvisWidget>
                </article>
                <article className="col-sm-6">
                    <JarvisWidget editbutton={false} color="darken">
                    <header><span className="widget-icon"> </span> 
                        <h2>카테고리 연결 설정</h2>
                    </header>
                    <div><div className="widget-body">
                        <form>
                        <fieldset>
                            <div className="row">
                                <div className="col-sm-12">
                                    <label>기본 카테고리</label>
                                    <div className="input-group">
                                        <input id="ipt_staff" disabled="disabled" onChange={this._onChangeIpt}
                                                className="form-control" value={this.state.sysData.sysIndex}/>
                                        <div className="input-group-btn">
                                            <button className="btn btn-primary" type="button" disabled={disableFlag}
                                                onClick={this._searchScreenIndex}>변경</button>
                                        </div>
                                    </div><br/><br/>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <legend>소속 카테고리
                                                <a href-void className="btn btn-default pull-right legend-button" onClick={this._searchScreenInsert} disabled={disableFlag}>
                                                <i className="fa fa-plus fa-lg right-gap"></i>소속 카테고리 추가</a>
                                            </legend>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-12">
                                            {catgs}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                        </form>
                    </div></div>
                    </JarvisWidget>
                </article>
                </div>
                </WidgetGrid>
                <div className="modal fade" id="screenIndexSelector" tabIndex="-1" role="dialog" aria-labelledby="UserSelectorLabel" aria-hidden="true">
                    <ScreenSelector query={this.state.screenIndexQuery} onSelect={this._selectScreenIndex}/>
                </div>
                <div className="modal fade" id="screenInsertSelector" tabIndex="-1" role="dialog" aria-labelledby="UserSelectorLabel" aria-hidden="true">
                    <ScreenSelector query={this.state.screenInsertQuery} onSelect={this._selectScreenInsert}/>
                </div>
            </div>
        )
    }
});

export default SDeskSysMgtDetail;