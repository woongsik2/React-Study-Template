import React from 'react'
import ReactDOM from 'react-dom'
import ScriptLoader from '../../utils/mixins/ScriptLoader.jsx'
import ElementHolder from '../../utils/mixins/ElementHolder.jsx'

let Select2 = React.createClass({
    mixins: [ScriptLoader, ElementHolder],
    componentDidMount: function () {
        
        let deptCdList = this.props.listData;
        
        this.loadScript('/vendor.ui.js').then(function(){
            $(this.getHold()).select2({
                data:deptCdList,
                formatLoadMore:'불러오는 중...',
                placeholder:'선택하세요',
                query: function (q) {
                    var pageSize,
                        results;
                    pageSize = 20; // or whatever pagesize
                    results  = [];
                    if (q.term && q.term !== "") {
                        // HEADS UP; for the _.filter function i use underscore (actually lo-dash) here
                        results = _.filter(this.data, function (e) {
                        return (e.text.toUpperCase().indexOf(q.term.toUpperCase()) >= 0);
                        });
                    } else if (q.term === "") {
                        results = this.data;
                    }
                    q.callback({
                        results: results.slice((q.page - 1) * pageSize, q.page * pageSize),
                        more   : results.length >= q.page * pageSize
                    });
                }
            })
        }.bind(this))

        $(this.getHold()).on('select2-selecting',function(e){
            if(typeof this.props.actionChange == 'function'){
                this.props.actionChange(e.choice);
            }
        }.bind(this));

    },
    componentWillUnmount: function () {
        $(this.getHold()).select2('destroy');
    },
    render: function () {
        let {children, ...props} = this.props;
        return (
            <input type="hidden" style={{width:'100%'}} {...props}>
                
            </input>
        )
    }

});

export default Select2