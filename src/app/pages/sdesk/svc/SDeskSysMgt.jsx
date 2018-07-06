import React from 'react'
import SDEnv from 'sdesk-consts'

import BigBreadcrumbs from '../../../../components/layout/navigation/components/BigBreadcrumbs.jsx'
import WidgetGrid from '../../../../components/layout/widgets/WidgetGrid.jsx'
import JarvisWidget from '../../../../components/layout/widgets/JarvisWidget.jsx'

import Datatable from '../../../../components/tables/SdeskTableExam.jsx'

import {browserHistory} from 'react-router'

let SDeskSysMgt = React.createClass({
    _goSysInsert:function(){
        sd.set(SDEnv.PAGE.SYS_DETAIL,SDEnv.STATUS.INSERT);
        this.props.history.push(
            {
                pathname:'/svc/system/detail/ins',
                state:{'STATUS':SDEnv.STATUS.INSERT}
            });
    },
    _goSysDetail:function(cells){
        let sysId = cells[0].innerHTML;
        let stts = cells[5].innerHTML;
        
        //상태가 정상이 아닐 경우 상세 페이지로 이동하지 못함.
        if(stts != 'C'){
            $.toaster('<br>해당 시스템은 정지 상태입니다.','접근불가','warning');
            return;
        }
        
        sd.set(SDEnv.PAGE.SYS_DETAIL,SDEnv.STATUS.RETRIEVE);
        this.props.history.push(
        {
            pathname:'/svc/system/detail/'+sysId,
            state:{'STATUS':SDEnv.STATUS.RETRIEVE}
        });
    },
    render: function () {
        return (
            <div id="content">
                <div className="row">
                    <BigBreadcrumbs items={['서비스 관리', '시스템 관리']} icon="table"
                                    className="col-xs-12 col-sm-7 col-md-7 col-lg-4"/>
                </div>
                <p>
                    시스템 관리 페이지 입니다.
                </p>
                <div>
                    <a href-void className="btn btn-default pull-right bottom-gap" onClick={this._goSysInsert}><i className="fa fa-plus fa-lg right-gap"></i>시스템 추가</a>       
                </div>
                <WidgetGrid>
                <div className="row">
                <article className="col-sm-12">
                    <JarvisWidget editbutton={false} color="darken">
                    <header><span className="widget-icon"> <i className="fa fa-table"/> </span> 
                        <h2>시스템 리스트</h2>
                    </header>
                    <div><div className="widget-body no-padding">
                        <Datatable onSelect={this._goSysDetail}
                            options={{
                            ajax: 'api/sdesk/sys_list.json',
                            columns: [ {data: "sysId"}, {data: "sysNm"}, {data: "sysDetl"}, {data: "sysIndex"}, {data: "createDt"}, {data: "stts"} ] }}
                            paginationLength={true} className="table table-striped table-bordered table-hover"
                            width="100%">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>시스템 명</th>
                                <th data-hide="phone">시스템 설명</th>
                                <th data-hide="phone">시스템 기본 업무</th>
                                <th>생성일</th>
                                <th>상태</th>
                            </tr>
                            </thead>
                        </Datatable>
                    </div></div>
                    </JarvisWidget>
                </article></div>
                </WidgetGrid>
            </div>
        )
    }
});

export default SDeskSysMgt;