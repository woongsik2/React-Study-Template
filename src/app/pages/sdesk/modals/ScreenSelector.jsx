import React from 'react'
import SDEnv from 'sdesk-consts'

import Datatable from '../../../../components/tables/SdeskTableExam.jsx'

let ScreenSelector = React.createClass({
    getInitialState: function(){
        return {
            query:''
        }
    },
    _selectScreen: function(cells){
        this.props.onSelect(cells[0].innerHTML,cells[1].innerHTML);
    },
    _search: function(e){
        e.preventDefault();
        let ipt_query = this.refs.query.value;
        if(ipt_query.length < 2){
            sd.issue.query();
            return;
        }
        this.setState({query: ''});
        setTimeout(function(){
            this.setState({query: ipt_query});    
        }.bind(this),500);
        
        this.refs.query.value = '';
    },
    componentWillReceiveProps(nextProps){
        this.setState({query: nextProps.query});
    },
    render: function(){
        
        let query = this.state.query;
        let grid = (<div />);
        if(query){
            grid = (
                <Datatable onSelect={this._selectScreen}
                    options={{
                    ajax:'api/sdesk/catg_list.json',
                    columns: [ {data: "screenId"}, {data: "screenNm"}, {data: "sysNm"}] }}
                    paginationLength={true} className="table table-striped table-bordered table-hover"
                    width="100%">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>이름</th>
                        <th>소속</th>
                    </tr>
                    </thead>
                </Datatable>
            );
        }
        return (
            <div className="modal-dialog"><div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal" aria-hidden="true">
                        &times;
                    </button>
                    <h4 className="modal-title" id="UserSelectorLabel">업무 선택</h4>
                </div>
                <div className="modal-body">
                <form className="well well-sm" onSubmit={this._search}>
                    <fieldset>
                    <div className="row">
                        <div className="col-sm-12">
                            <label>검색어</label>
                            <div className="input-group">
                                <input type="text" className="form-control" ref="query" />
                                <div className="input-group-btn">
                                    <button className="btn btn-primary" type="button"
                                                onClick={this._search}>검색</button>
                                </div>
                            </div>
                            
                            <div className="note">
                                <strong><i className="glyphicon glyphicon-warning-sign right-gap color-red"/>2자 이상 필수</strong>
                            </div>
                        </div></div>
                    </fieldset>
                </form>
                    {grid}
                </div>
            </div></div>
        )
    }
})

export default ScreenSelector