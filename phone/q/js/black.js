// 被评价方
var  user ={
	fromUserUuid:0,
	fromNickName:''
}
// 评价方 发送方 也是当前用户
var sender={
	toUserUuid:0,
	toNickName:'',
	toHeadImageUrl:'',
}
// 模板引擎
 var template ='';

 // 点击的那个评价者的jquery元素
 var  user_html='';

 // 点击回复jquey元素
 var operation='';

//点击给评价者进行评价
$('.eval-list').on('click','.back-main',function(e){
	var user_name = $(this).find(".back-user-name").text();
	user_html=$(this);
    $('.reply-box input').prop('placeholder','回复：'+user_name).focus();

   
})

// 点击回复字
$('.eval-list').on("click",".operation",function(e){
	var user_name = $(this).siblings('.user-info').find('.back-user-name').text();
	operation =$(this);
	$('.reply-box input').prop('placeholder','回复：'+user_name).focus(); 
})


// 对楼主进行评论
$('.reply-box input').on('keydown',function(e){
	if(e.keyCode == 13) {
		var val = $('.reply-box input').val();
		// 判断输入框的值是否为空
		if (val !='') {
			var content = addeval(val,e).resultForList;
			addhtml(content);
		}else{
			console.log('不能为空！');
		}
		//回复后输入框失去焦点跟输入的内容
		$(this).blur().val('');
    }
		
})
	   
//增加评价方法
function addeval(text,e) {
	return ajax(text);
}
// ajax往后端传的值
	function ajax(text){
		sender.toUserUuid=123;
		sender.toNickName ='张山';
		sender.toHeadImageUrl = 'img/user2.jpg';
		// ajax.send()传的值
		var sendnub={
	       toUserUuid:sender.toUserUuid,
	       toNickName:sender.toNickName,
	       toHeadImageUr:sender.toHeadImageUrl,
	       content:text
		}
		// 如果成功 返回值
		return {isOk:"1", message:"SUCCESS", resultForList:text};

	}
	// 数据加载到页面
	function addhtml(content){
		if (user_html != '') {
				console.log(user_html);
				template='<li class="back-main">'+
					'<span class="back-user-name">'+sender.toNickName+'</span>：回复:<span class="back-name">'+user_html.find('.back-user-name').text()+'</span>'+
					'<span class="back-content">'+content+'</span>'+
				'</li>';
				user_html.after(template);
				user_html="";
				 $('.reply-box input').prop('placeholder','回复楼主');
		 }else if (operation != ''){
		 	template='<li class="back-main">'+
					'<span class="back-user-name">'+sender.toNickName+'</span>：'+
					'<span class="back-content">'+content+'</span>'+
				'</li>';
				console.log(template);
				console.log(operation.parent('.eval-item-top').siblings('.back-panel'));
				operation.parent('.eval-item-top').siblings('.back-panel').find('ul').append(template);
				operation='';
				 $('.reply-box input').prop('placeholder','楼主')

		 }else{
		 	template ='<div class="eval-item">'+
	       	        '<div class="eval-item-top clearfix">'+
	                    '<div class="user-img"><img src="'+sender.toHeadImageUrl+'"></div>'+
	                    '<div class="user-info">'+
	                        '<span class="back-user-name">'+sender.toNickName+'</span>'+
	                    '</div>'+
	                    '<div class="operation"><span>[回复]</span></div>'+
	                '</div>'+
	            	'<div class="content">'+content+'</div>'+
	            	'<div class="back-panel">'+
	                	'<ul>'+
	                    	'<li class="back-main"></li>'+
	                	'</ul>'+
	            	'</div>'+
	       		'</div>';
	       	$('.eval-list').prepend(template);

		 }
	}