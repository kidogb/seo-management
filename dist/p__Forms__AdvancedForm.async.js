(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[11],{JDLn:function(e,a,t){e.exports={toolbar:"antd-pro-components-footer-toolbar-index-toolbar",left:"antd-pro-components-footer-toolbar-index-left",right:"antd-pro-components-footer-toolbar-index-right"}},erBf:function(e,a,t){"use strict";t.r(a);t("+L6B");var n=t("2/Rp"),r=(t("Xi6J"),t("kl6h")),l=(t("IzEo"),t("bx4M")),o=(t("14J3"),t("BMrR")),i=(t("jCWc"),t("kPKH")),c=(t("5NDa"),t("5rEg")),s=(t("Q9mQ"),t("diRs")),m=(t("Pwec"),t("CtXQ")),u=t("2Taf"),d=t.n(u),p=t("vZ4D"),f=t.n(p),h=t("l4Ni"),v=t.n(h),E=t("ujKo"),g=t.n(E),y=t("MhPg"),k=t.n(y),w=(t("y8nQ"),t("Vl3Y")),b=(t("iQDF"),t("+eQT")),C=(t("OaEy"),t("2fM7")),I=t("q1tI"),x=t.n(I),N=t("MuoO"),F=t("jehZ"),P=t.n(F),R=t("Y/ft"),q=t.n(R),S=t("17x9"),D=t.n(S),M=t("TSYQ"),z=t.n(M),K=t("JDLn"),T=t.n(K),B=function(e){function a(){var e,t;d()(this,a);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return t=v()(this,(e=g()(a)).call.apply(e,[this].concat(r))),t.state={width:void 0},t.resizeFooterToolbar=function(){var e=document.querySelector(".ant-layout-sider");if(null!=e){var a=t.context.isMobile,n=a?null:"calc(100% - ".concat(e.style.width,")"),r=t.state.width;r!==n&&t.setState({width:n})}},t}return k()(a,e),f()(a,[{key:"componentDidMount",value:function(){window.addEventListener("resize",this.resizeFooterToolbar),this.resizeFooterToolbar()}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.resizeFooterToolbar)}},{key:"render",value:function(){var e=this.props,a=e.children,t=e.className,n=e.extra,r=q()(e,["children","className","extra"]),l=this.state.width;return x.a.createElement("div",P()({className:z()(t,T.a.toolbar),style:{width:l}},r),x.a.createElement("div",{className:T.a.left},n),x.a.createElement("div",{className:T.a.right},a))}}]),a}(I["Component"]);B.contextTypes={isMobile:D.a.bool};var L,O,A,J,j=t("zHco"),Q=(t("g9YV"),t("wCAj")),Y=(t("P2fV"),t("NJEC")),V=(t("/zsF"),t("PArb")),W=(t("miYZ"),t("tsqr")),Z=t("p0pE"),_=t.n(Z),H=t("Y+p1"),U=t.n(H),X=t("Zpge"),G=t.n(X),$=function(e){function a(e){var t;return d()(this,a),t=v()(this,g()(a).call(this,e)),t.index=0,t.cacheOriginData={},t.toggleEditable=function(e,a){e.preventDefault();var n=t.state.data,r=n.map(function(e){return _()({},e)}),l=t.getRowByKey(a,r);l&&(l.editable||(t.cacheOriginData[a]=_()({},l)),l.editable=!l.editable,t.setState({data:r}))},t.newMember=function(){var e=t.state.data,a=e.map(function(e){return _()({},e)});a.push({key:"NEW_TEMP_ID_".concat(t.index),workId:"",name:"",department:"",editable:!0,isNew:!0}),t.index+=1,t.setState({data:a})},t.state={data:e.value,loading:!1,value:e.value},t}return k()(a,e),f()(a,[{key:"getRowByKey",value:function(e,a){var t=this.state.data;return(a||t).filter(function(a){return a.key===e})[0]}},{key:"remove",value:function(e){var a=this.state.data,t=this.props.onChange,n=a.filter(function(a){return a.key!==e});this.setState({data:n}),t(n)}},{key:"handleKeyPress",value:function(e,a){"Enter"===e.key&&this.saveRow(e,a)}},{key:"handleFieldChange",value:function(e,a,t){var n=this.state.data,r=n.map(function(e){return _()({},e)}),l=this.getRowByKey(t,r);l&&(l[a]=e.target.value,this.setState({data:r}))}},{key:"saveRow",value:function(e,a){var t=this;e.persist(),this.setState({loading:!0}),setTimeout(function(){if(t.clickedCancel)t.clickedCancel=!1;else{var n=t.getRowByKey(a)||{};if(!n.workId||!n.name||!n.department)return W["a"].error("\u8bf7\u586b\u5199\u5b8c\u6574\u6210\u5458\u4fe1\u606f\u3002"),e.target.focus(),void t.setState({loading:!1});delete n.isNew,t.toggleEditable(e,a);var r=t.state.data,l=t.props.onChange;l(r),t.setState({loading:!1})}},500)}},{key:"cancel",value:function(e,a){this.clickedCancel=!0,e.preventDefault();var t=this.state.data,n=t.map(function(e){return _()({},e)}),r=this.getRowByKey(a,n);this.cacheOriginData[a]&&(Object.assign(r,this.cacheOriginData[a]),delete this.cacheOriginData[a]),r.editable=!1,this.setState({data:n}),this.clickedCancel=!1}},{key:"render",value:function(){var e=this,a=[{title:"\u6210\u5458\u59d3\u540d",dataIndex:"name",key:"name",width:"20%",render:function(a,t){return t.editable?x.a.createElement(c["a"],{value:a,autoFocus:!0,onChange:function(a){return e.handleFieldChange(a,"name",t.key)},onKeyPress:function(a){return e.handleKeyPress(a,t.key)},placeholder:"\u6210\u5458\u59d3\u540d"}):a}},{title:"\u5de5\u53f7",dataIndex:"workId",key:"workId",width:"20%",render:function(a,t){return t.editable?x.a.createElement(c["a"],{value:a,onChange:function(a){return e.handleFieldChange(a,"workId",t.key)},onKeyPress:function(a){return e.handleKeyPress(a,t.key)},placeholder:"\u5de5\u53f7"}):a}},{title:"\u6240\u5c5e\u90e8\u95e8",dataIndex:"department",key:"department",width:"40%",render:function(a,t){return t.editable?x.a.createElement(c["a"],{value:a,onChange:function(a){return e.handleFieldChange(a,"department",t.key)},onKeyPress:function(a){return e.handleKeyPress(a,t.key)},placeholder:"\u6240\u5c5e\u90e8\u95e8"}):a}},{title:"\u64cd\u4f5c",key:"action",render:function(a,t){var n=e.state.loading;return t.editable&&n?null:t.editable?t.isNew?x.a.createElement("span",null,x.a.createElement("a",{onClick:function(a){return e.saveRow(a,t.key)}},"\u6dfb\u52a0"),x.a.createElement(V["a"],{type:"vertical"}),x.a.createElement(Y["a"],{title:"\u662f\u5426\u8981\u5220\u9664\u6b64\u884c\uff1f",onConfirm:function(){return e.remove(t.key)}},x.a.createElement("a",null,"\u5220\u9664"))):x.a.createElement("span",null,x.a.createElement("a",{onClick:function(a){return e.saveRow(a,t.key)}},"\u4fdd\u5b58"),x.a.createElement(V["a"],{type:"vertical"}),x.a.createElement("a",{onClick:function(a){return e.cancel(a,t.key)}},"\u53d6\u6d88")):x.a.createElement("span",null,x.a.createElement("a",{onClick:function(a){return e.toggleEditable(a,t.key)}},"\u7f16\u8f91"),x.a.createElement(V["a"],{type:"vertical"}),x.a.createElement(Y["a"],{title:"\u662f\u5426\u8981\u5220\u9664\u6b64\u884c\uff1f",onConfirm:function(){return e.remove(t.key)}},x.a.createElement("a",null,"\u5220\u9664")))}}],t=this.state,r=t.loading,l=t.data;return x.a.createElement(I["Fragment"],null,x.a.createElement(Q["a"],{loading:r,columns:a,dataSource:l,pagination:!1,rowClassName:function(e){return e.editable?G.a.editable:""}}),x.a.createElement(n["a"],{style:{width:"100%",marginTop:16,marginBottom:8},type:"dashed",onClick:this.newMember,icon:"plus"},"\u65b0\u589e\u6210\u5458"))}}],[{key:"getDerivedStateFromProps",value:function(e,a){return U()(e.value,a.value)?null:{data:e.value,value:e.value}}}]),a}(I["PureComponent"]),ee=$,ae=C["a"].Option,te=b["a"].RangePicker,ne={name:"\u4ed3\u5e93\u540d",url:"\u4ed3\u5e93\u57df\u540d",owner:"\u4ed3\u5e93\u7ba1\u7406\u5458",approver:"\u5ba1\u6279\u4eba",dateRange:"\u751f\u6548\u65e5\u671f",type:"\u4ed3\u5e93\u7c7b\u578b",name2:"\u4efb\u52a1\u540d",url2:"\u4efb\u52a1\u63cf\u8ff0",owner2:"\u6267\u884c\u4eba",approver2:"\u8d23\u4efb\u4eba",dateRange2:"\u751f\u6548\u65e5\u671f",type2:"\u4efb\u52a1\u7c7b\u578b"},re=[{key:"1",workId:"00001",name:"John Brown",department:"New York No. 1 Lake Park"},{key:"2",workId:"00002",name:"Jim Green",department:"London No. 1 Lake Park"},{key:"3",workId:"00003",name:"Joe Black",department:"Sidney No. 1 Lake Park"}],le=(L=Object(N["connect"])(function(e){var a=e.loading;return{submitting:a.effects["form/submitAdvancedForm"]}}),O=w["a"].create(),L(A=O((J=function(e){function a(){var e,t;d()(this,a);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return t=v()(this,(e=g()(a)).call.apply(e,[this].concat(r))),t.state={width:"100%"},t.getErrorInfo=function(){var e=t.props.form.getFieldsError,a=e(),n=Object.keys(a).filter(function(e){return a[e]}).length;if(!a||0===n)return null;var r=function(e){var a=document.querySelector('label[for="'.concat(e,'"]'));a&&a.scrollIntoView(!0)},l=Object.keys(a).map(function(e){return a[e]?x.a.createElement("li",{key:e,className:G.a.errorListItem,onClick:function(){return r(e)}},x.a.createElement(m["a"],{type:"cross-circle-o",className:G.a.errorIcon}),x.a.createElement("div",{className:G.a.errorMessage},a[e][0]),x.a.createElement("div",{className:G.a.errorField},ne[e])):null});return x.a.createElement("span",{className:G.a.errorIcon},x.a.createElement(s["a"],{title:"\u8868\u5355\u6821\u9a8c\u4fe1\u606f",content:l,overlayClassName:G.a.errorPopover,trigger:"click",getPopupContainer:function(e){return e.parentNode}},x.a.createElement(m["a"],{type:"exclamation-circle"})),n)},t.resizeFooterToolbar=function(){requestAnimationFrame(function(){var e=document.querySelectorAll(".ant-layout-sider")[0];if(e){var a="calc(100% - ".concat(e.style.width,")"),n=t.state.width;n!==a&&t.setState({width:a})}})},t.validate=function(){var e=t.props,a=e.form.validateFieldsAndScroll,n=e.dispatch;a(function(e,a){e||n({type:"form/submitAdvancedForm",payload:a})})},t}return k()(a,e),f()(a,[{key:"componentDidMount",value:function(){window.addEventListener("resize",this.resizeFooterToolbar,{passive:!0})}},{key:"componentWillUnmount",value:function(){window.removeEventListener("resize",this.resizeFooterToolbar)}},{key:"render",value:function(){var e=this.props,a=e.form.getFieldDecorator,t=e.submitting,s=this.state.width;return x.a.createElement(j["a"],{title:"\u9ad8\u7ea7\u8868\u5355",content:"\u9ad8\u7ea7\u8868\u5355\u5e38\u89c1\u4e8e\u4e00\u6b21\u6027\u8f93\u5165\u548c\u63d0\u4ea4\u5927\u6279\u91cf\u6570\u636e\u7684\u573a\u666f\u3002",wrapperClassName:G.a.advancedForm},x.a.createElement(l["a"],{title:"\u4ed3\u5e93\u7ba1\u7406",className:G.a.card,bordered:!1},x.a.createElement(w["a"],{layout:"vertical",hideRequiredMark:!0},x.a.createElement(o["a"],{gutter:16},x.a.createElement(i["a"],{lg:6,md:12,sm:24},x.a.createElement(w["a"].Item,{label:ne.name},a("name",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u4ed3\u5e93\u540d\u79f0"}]})(x.a.createElement(c["a"],{placeholder:"\u8bf7\u8f93\u5165\u4ed3\u5e93\u540d\u79f0"})))),x.a.createElement(i["a"],{xl:{span:6,offset:2},lg:{span:8},md:{span:12},sm:24},x.a.createElement(w["a"].Item,{label:ne.url},a("url",{rules:[{required:!0,message:"\u8bf7\u9009\u62e9"}]})(x.a.createElement(c["a"],{style:{width:"100%"},addonBefore:"http://",addonAfter:".com",placeholder:"\u8bf7\u8f93\u5165"})))),x.a.createElement(i["a"],{xl:{span:8,offset:2},lg:{span:10},md:{span:24},sm:24},x.a.createElement(w["a"].Item,{label:ne.owner},a("owner",{rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u7ba1\u7406\u5458"}]})(x.a.createElement(C["a"],{placeholder:"\u8bf7\u9009\u62e9\u7ba1\u7406\u5458"},x.a.createElement(ae,{value:"xiao"},"\u4ed8\u6653\u6653"),x.a.createElement(ae,{value:"mao"},"\u5468\u6bdb\u6bdb")))))),x.a.createElement(o["a"],{gutter:16},x.a.createElement(i["a"],{lg:6,md:12,sm:24},x.a.createElement(w["a"].Item,{label:ne.approver},a("approver",{rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u5ba1\u6279\u5458"}]})(x.a.createElement(C["a"],{placeholder:"\u8bf7\u9009\u62e9\u5ba1\u6279\u5458"},x.a.createElement(ae,{value:"xiao"},"\u4ed8\u6653\u6653"),x.a.createElement(ae,{value:"mao"},"\u5468\u6bdb\u6bdb"))))),x.a.createElement(i["a"],{xl:{span:6,offset:2},lg:{span:8},md:{span:12},sm:24},x.a.createElement(w["a"].Item,{label:ne.dateRange},a("dateRange",{rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u751f\u6548\u65e5\u671f"}]})(x.a.createElement(te,{placeholder:["\u5f00\u59cb\u65e5\u671f","\u7ed3\u675f\u65e5\u671f"],style:{width:"100%"}})))),x.a.createElement(i["a"],{xl:{span:8,offset:2},lg:{span:10},md:{span:24},sm:24},x.a.createElement(w["a"].Item,{label:ne.type},a("type",{rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u4ed3\u5e93\u7c7b\u578b"}]})(x.a.createElement(C["a"],{placeholder:"\u8bf7\u9009\u62e9\u4ed3\u5e93\u7c7b\u578b"},x.a.createElement(ae,{value:"private"},"\u79c1\u5bc6"),x.a.createElement(ae,{value:"public"},"\u516c\u5f00")))))))),x.a.createElement(l["a"],{title:"\u4efb\u52a1\u7ba1\u7406",className:G.a.card,bordered:!1},x.a.createElement(w["a"],{layout:"vertical",hideRequiredMark:!0},x.a.createElement(o["a"],{gutter:16},x.a.createElement(i["a"],{lg:6,md:12,sm:24},x.a.createElement(w["a"].Item,{label:ne.name2},a("name2",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165"}]})(x.a.createElement(c["a"],{placeholder:"\u8bf7\u8f93\u5165"})))),x.a.createElement(i["a"],{xl:{span:6,offset:2},lg:{span:8},md:{span:12},sm:24},x.a.createElement(w["a"].Item,{label:ne.url2},a("url2",{rules:[{required:!0,message:"\u8bf7\u9009\u62e9"}]})(x.a.createElement(c["a"],{placeholder:"\u8bf7\u8f93\u5165"})))),x.a.createElement(i["a"],{xl:{span:8,offset:2},lg:{span:10},md:{span:24},sm:24},x.a.createElement(w["a"].Item,{label:ne.owner2},a("owner2",{rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u7ba1\u7406\u5458"}]})(x.a.createElement(C["a"],{placeholder:"\u8bf7\u9009\u62e9\u7ba1\u7406\u5458"},x.a.createElement(ae,{value:"xiao"},"\u4ed8\u6653\u6653"),x.a.createElement(ae,{value:"mao"},"\u5468\u6bdb\u6bdb")))))),x.a.createElement(o["a"],{gutter:16},x.a.createElement(i["a"],{lg:6,md:12,sm:24},x.a.createElement(w["a"].Item,{label:ne.approver2},a("approver2",{rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u5ba1\u6279\u5458"}]})(x.a.createElement(C["a"],{placeholder:"\u8bf7\u9009\u62e9\u5ba1\u6279\u5458"},x.a.createElement(ae,{value:"xiao"},"\u4ed8\u6653\u6653"),x.a.createElement(ae,{value:"mao"},"\u5468\u6bdb\u6bdb"))))),x.a.createElement(i["a"],{xl:{span:6,offset:2},lg:{span:8},md:{span:12},sm:24},x.a.createElement(w["a"].Item,{label:ne.dateRange2},a("dateRange2",{rules:[{required:!0,message:"\u8bf7\u8f93\u5165"}]})(x.a.createElement(r["a"],{placeholder:"\u63d0\u9192\u65f6\u95f4",style:{width:"100%"},getPopupContainer:function(e){return e.parentNode}})))),x.a.createElement(i["a"],{xl:{span:8,offset:2},lg:{span:10},md:{span:24},sm:24},x.a.createElement(w["a"].Item,{label:ne.type2},a("type2",{rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u4ed3\u5e93\u7c7b\u578b"}]})(x.a.createElement(C["a"],{placeholder:"\u8bf7\u9009\u62e9\u4ed3\u5e93\u7c7b\u578b"},x.a.createElement(ae,{value:"private"},"\u79c1\u5bc6"),x.a.createElement(ae,{value:"public"},"\u516c\u5f00")))))))),x.a.createElement(l["a"],{title:"\u6210\u5458\u7ba1\u7406",bordered:!1},a("members",{initialValue:re})(x.a.createElement(ee,null))),x.a.createElement(B,{style:{width:s}},this.getErrorInfo(),x.a.createElement(n["a"],{type:"primary",onClick:this.validate,loading:t},"\u63d0\u4ea4")))}}]),a}(I["PureComponent"]),A=J))||A)||A);a["default"]=le}}]);