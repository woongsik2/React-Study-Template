import React from 'react'
import SDEnv from 'sdesk-consts'
import _ from 'lodash'

import ScriptLoader from '../utils/mixins/ScriptLoader.jsx'
import ElementHolder from '../utils/mixins/ElementHolder.jsx'

import AjaxActions from '../actions/AjaxActions'

let Datatable = React.createClass({
    mixins: [ScriptLoader, ElementHolder],
    getInitialState: function () {
        return {tableObj:{}}
    },
    
    componentDidMount: function () {
        this.loadScript('/vendor.datatables.js').then(function () {
            this._datatable()
        }.bind(this))
    },
    
    _onSelect: function(id, selectedStts){
        if(typeof this.props.onSelect == 'function'){
            this.props.onSelect(id, selectedStts)
        }
    },
    
    _linkDataTable:function(dataTableObj){
        if(typeof this.props.linkDataTable == 'function'){
            this.props.linkDataTable(dataTableObj);
        }
    },

    _datatable: function () {
        var element = $(this.getHold());
        var options = this.props.options || {}


        let toolbar = '';
        if (options.buttons)
            toolbar += 'B';
        if (this.props.paginationLength)
            toolbar += 'l';
        if (this.props.columnsHide)
            toolbar += 'C';
          
        
        var pageLength = PLAEnv.PLANTABLE.PAGELENGTH;
        if(this.props.pageLength){
            pageLength = this.props.pageLength;
        }

        options = _.extend(options, {

            "dom": "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-12 hidden-xs text-right'" + toolbar + ">r>" +
            "t" +
            "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>",
            oLanguage: {
                "sSearch": "<span class='input-group-addon input-sm'><i class='glyphicon glyphicon-search'></i></span> ",
                "sLengthMenu": "_MENU_"
            },
            "autoWidth": false,
            "pageLength": pageLength,
            "pagingType": "simple",
            retrieve: true,
            responsive: true,
            select:true
        });

        var _dataTable;
        
        if(options.ajax && typeof options.ajax === 'string'){
            let url = options.ajax;

            

            $.getJSON(url).then(function(data){
                options.data = data;
                _dataTable = element.DataTable(options);

                // sd.log('_dataTable',_dataTable,options);
                
                element.on('click', 'tbody tr', function(event){
                    let clickIdx = $(event.currentTarget).attr('idx');
                    this._onSelect(data.data[clickIdx]);
                    
                    //sd.log($(event.currentTarget).attr('idx'));
                    // sd.log('df',data.data[clickIdx]);
                    //this._onSelect(event.currentTarget.cells);
                }.bind(this));
              
            }.bind(this))
        }else if(typeof options.postAjax.url === 'string'){
            let url = options.postAjax.url;
            let reqObj = options.postAjax.reqObj;
            
            // sd.log("reqData", reqData)
            
            AjaxActions.planComm(url, reqObj,'POST',(data)=>{
                // sd.log("PlanTable.jsx ::: ", data)
                
                //FIXME: 내부 데이터 값 전달 - 확인 안됨...
                // element.on('xhr',(event)=>{
                //    sd.log('_dataTable',_dataTable.ajax.json()); 
                // });
                
                //서버에서 정보를 가져와 셋팅
                options.data = data.data;
                _dataTable = element.DataTable(options);

                element.on('click', 'tbody tr', function(event){
                    let clickIdx = $(event.currentTarget).attr('idx');
                    this._onSelect(data.data[clickIdx]);
                }.bind(this));
                
                
                //click 이벤트 처리
                //element.on('click', 'tbody tr', (event)=>{
                //    this._onSelect(event.currentTarget.cells);
                //});
            });
        }

        element.on('click', 'button', function(e){
            //이벤트 전파 방지
            e.preventDefault();
            if(e.target.id == 'unitPrnlsCdAdd'){
                var data = _dataTable.row( $(e.target).parents('tr')).data();
                this.props.unitPrnlsCdAdd(data);
                e.stopPropagation();
            }else if(e.target.id == 'unitPrnlsCdSub'){
                var data = _dataTable.row( $(e.target).parents('tr')).data();
                this.props.unitPrnlsCdSub(data);
                e.stopPropagation();
            }else if(e.target.id == 'todoCreate'){
                // let clickIdx = $(event.currentTarget).attr('idx');
                // this._onSelect(data.data[clickIdx]);
                this.props.todoCreate(true);
                e.stopPropagation();
            }
        }.bind(this));

        if (this.props.filter) {
            // Apply the filter
            element.on('keyup change', 'thead th input[type=text]', function () {
                _dataTable
                    .column($(this).parent().index() + ':visible')
                    .search(this.value)
                    .draw();

            });
        }

        if (!toolbar) {
            element.parent().find(".dt-toolbar").append('<div class="text-right"><img src="styles/img/logo.png" alt="SmartAdmin" style="width: 111px; margin-top: 3px; margin-right: 10px;"></div>');
        }

        if(this.props.detailsFormat){
            let format = this.props.detailsFormat
            element.on('click', 'td.details-control', function () {
                var tr = $(this).closest('tr');
                var row = _dataTable.row( tr );
                
                if ( row.child.isShown() ) {
                    row.child.hide();
                    tr.removeClass('shown');
                }
                else {
                    row.child( format(row.data()) ).show();
                    tr.addClass('shown');
                }
            })
        }
    }
    ,
    render: function () {
        let {children, ...props} = this.props;
        return (
            <table {...props}>
                {children}
            </table>
        )
    }
});

export default Datatable