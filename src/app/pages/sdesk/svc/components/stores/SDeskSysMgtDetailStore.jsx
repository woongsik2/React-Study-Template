import Reflux from 'reflux'
import SDEnv from 'sdesk-consts'

import SDeskActions from './../actions/SDeskSysMgtDetailAction.jsx'

let SDeskSysMgtDetailStore = Reflux.createStore({
    listenables: SDeskActions,
    init: function(){
        this.data={
            sysData:{
            },
            linkScreens:[],
            BACKUP:{},
            callCount:0,
            STATUS:SDEnv.STATUS.PREPARE,
            isLoading: true,
            screenIndexQuery:'',
            screenInsertQuery:''
        }
        
        this.data.callCount++;
        this.trigger(this.data);
    },
    onInit: function(){
        this.data.callCount++;
        //Storage의 값을 가져와 저장. 현재 페이지 상태 값.
        this.data.STATUS = sd.get(SDEnv.PAGE.SYS_DETAIL);
        //화면이 재구성 될 때 재 조회를 위해 로딩 플레그 셋팅.
        this.data.isLoading = true;
        this.data.sysData = {};
        this.data.linkScreens = [];
        
        this.trigger(this.data);
    },
    onChangeIpt: function(targetId, txt){
        this.data.sysData[targetId] = txt;
        
        this.trigger(this.data);
    },
    
    onLoadSysDataCompleted: function(data){
        this.data.callCount++;
        
        if(!data){
            //시스템 추가 일경우..
            this.data.sysData = {};
            this.data.linkScreens = [];
        }else{
            this.data.sysData = data.data[0];
            sd.log('LOAD SYSTEM','CHECK!!!!!',data.data[0]);
        }
        
        this.data.isLoading = false;
        this.trigger(this.data);
    },
    
    onLoadScrDataCompleted: function(data){
        //소속 업무 조회 후 셋팅
        this.data.callCount++;
        this.data.linkScreens = data.data;
        sd.log('LOAD SCREENS','CHECK!!!!!',data.data);
        
        this.trigger(this.data);
    },
    
    onSelectIndexScreen: function(indexScreenId){
        //기본 카테고리 선택
        this.data.sysData.sysIndex = indexScreenId;
        sd.log('SELECT INDEX SCREENS','CHECK!!!!!',indexScreenId);
        this.trigger(this.data);
    },
    
    onSelectInsertScreen: function(insertScreenId,insertScreenNm){
        let duplicationFlag = false;
        
        this.data.linkScreens.map((obj)=>{
            if(obj.screenId == insertScreenId){
                duplicationFlag = true;
            }
        })
        
        if(duplicationFlag){
            $.toaster('<br>기존에 동일한 업무가 등록되어 있습니다.','중복 이슈','warning');
            
        }else{
            this.data.linkScreens.push({
                screenId:insertScreenId,
                screenNm:insertScreenNm
            });
        }
        
        this.trigger(this.data);
    },
    
    onRemoveTag: function(targetId){
        _.remove(this.data.linkScreens, (obj)=>{
            return targetId == obj.screenId
        })
        
        this.trigger(this.data);
    },
    
    onInsertCompleted: function(data){
        sd.log('onInsertComplete',data);
        
        //일반 조회로 변경
        this.data.STATUS = SDEnv.STATUS.RETRIEVE;
        this.trigger(this.data);
    },
    
    onInsertFailed: function(...fails){
        sd.log('onInsertFailed',...fails);
        let failParams = [...fails];
        $.toaster("<br>에러 발생 ::: "+failParams[0],'ERROR','danger');
    },
    
    onModify: function(){
        this.data.STATUS = SDEnv.STATUS.MODIFY;
        this.data.BACKUP.sysData = _.clone(this.data.sysData);
        this.data.BACKUP.linkScreens = _.clone(this.data.linkScreens);
        
        this.trigger(this.data);
    },
    
    onModifyCancel: function(){
        this.data.sysData = _.clone(this.data.BACKUP.sysData);
        this.data.linkScreens = _.clone(this.data.BACKUP.linkScreens);
        
        this.data.STATUS = SDEnv.STATUS.RETRIEVE;
        this.data.isLoading = true;
        this.trigger(this.data);
        
        setTimeout(function(){
            this.data.isLoading = false;
            this.trigger(this.data);
        }.bind(this),500);
    },
    
    onModifyConfirmCompleted: function(data){
        sd.log('onModifyCompleted',data);
        
        //일반 조회로 변경
        this.data.STATUS = SDEnv.STATUS.RETRIEVE;
        this.trigger(this.data);
    },
    
    onStopCompleted: function(data){
        sd.log('onDeleteCompleted',data);
        
        //다시 화면 셋팅
        sd.set(SDEnv.PAGE.REDIRECT,'/svc/system/');
        
        this.data.STATUS = SDEnv.STATUS.RETRIEVE;
        this.trigger(this.data);
    },
    
    getData: function(){
        return this.data
    }
});

export default SDeskSysMgtDetailStore;