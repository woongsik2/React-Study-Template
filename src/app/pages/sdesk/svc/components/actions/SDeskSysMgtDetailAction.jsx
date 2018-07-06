import Reflux from 'reflux'
import SDEnv from 'sdesk-consts'

import AjaxActions from '../../../../../../components/actions/AjaxActions'

let SDeskSysMgtDetailAction = Reflux.createActions({
    init:{},
    loadSysData: {asyncResult: true},
    loadScrData: {asyncResult: true},
    changeIpt:{},
    insert:{asyncResult: true},
    modify:{},
    modifyConfirm:{asyncResult: true},
    modifyCancel:{},
    cancel:{},
    stop:{asyncResult: true},
    selectIndexScreen:{},
    selectInsertScreen:{},
    removeTag:{}
});

SDeskSysMgtDetailAction.loadSysData.listen(function (sysId){
    $.getJSON('api/sdesk/sys_one.json').then(this.completed, this.failed)
});

SDeskSysMgtDetailAction.loadScrData.listen(function (sysId){
    //시스템에 소속한 화면 조회
    $.getJSON('api/sdesk/catg_in_sys.json').then(this.completed, this.failed)
    
});

SDeskSysMgtDetailAction.insert.listen(function (sysObj, linkScreens){
    if(!sd.hasValues(SDEnv.VALIDATE.SYSTEM,sysObj)){
        //필수값이 없는 경우...
        this.failed(SDEnv.STRS.NO_NEED_PARAM);
        return;
    }
    $.getJSON('api/sdesk/complete.json').then(this.completed, this.failed);
});

SDeskSysMgtDetailAction.modifyConfirm.listen(function (sysObj, linkScreens){
    $.getJSON('api/sdesk/complete.json').then(this.completed, this.failed);
});

SDeskSysMgtDetailAction.stop.listen(function (sysId){
    $.getJSON('api/sdesk/complete.json').then(this.completed, this.failed);
});

export default SDeskSysMgtDetailAction;