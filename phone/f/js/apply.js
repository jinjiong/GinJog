	
/*第几个宠物*/
		var pet_nub =1;
		var pets=[];
		/*宠物对象*/
		var pet={
			nickname:'',
			variety:'',
			birth:'',
			sex:'1',
			weight:'',
			list:'1'
		}

		$('.new-form em').on('touchend',function(){
			$(this).addClass("active").siblings('em').removeClass('active');
		})
		$('.add-wrap').on('touchend','.add-form em',function(){

			$(this).addClass("active").siblings('em').removeClass('active');
		})


	/*	删除宠物平且重新排序*/
       $('.add-wrap').on('touchend','.dele',function(){
       	   var html_pets= $(this).parents('.add-box').siblings();
       	   $('.add-wrap').empty();
       	   pets=[];
       	   console.log(html_pets.length);
       	   if (html_pets.length != 0) {
	       	   	pet_nub=1;
       	   	 	getPets(html_pets);
	   	   		for (var i = 0; i <pets.length; i++) {
					addPetHtml(pets[i])
	   	   		}
       	   }else{
       	   		pet_nub=1;
       	   }
	   	  
       })

      /* 根据宠物html获得宠物数组 函数*/
      function getPets(html_pets){
   	    for (var i = 0; i < html_pets.length; i++) {
   	    	var a_pet=[];
   	    	a_pet.nickname = $(html_pets[i]).find(".nickname").val();
   	    	a_pet.variety = $(html_pets[i]).find(".variety").val();
   	    	a_pet.birth = $(html_pets[i]).find(".birth").val();
   	    	a_pet.sex = $(html_pets[i]).find(".sex-item.active").data('nub');
   	    	a_pet.weight = $(html_pets[i]).find(".weight").val();
   	    	a_pet.list = $(html_pets[i]).find(".list").val();
   	    	pets.push(a_pet);
   	    }
      }
       /* 遍历宠物对象到html中*/
		function addPetHtml(pet){
			var PetHtml='<div class="add-box">'+
			            '<div class="pet_title clearfix"><span>宠物'+pet_nub+'</span><span class="dele">删除</span></div>'+
						'<div class="add-form '+pet_nub+'add-form">'+
						   '<div class="input-item">'+
						        '<span class="title">宠物'+pet_nub+'昵称</span>'+
							   	'<input type="text" class="nickname" name="nickname'+pet_nub+'" value='+pet.nickname+'>'+
						  ' </div>'+
						    '<div class="input-item kind-item">'+
							    '<span class="title">宠物'+pet_nub+'品种</span>'+
							   	'<input type="text" class="variety" disabled="disabled" name="variety'+pet_nub+'" value='+pet.variety+'>'+
						   '</div>'+
						    '<div class="input-item">'+
							    '<span class="title">宠物'+pet_nub+'生日</span>'+
							   	'<input  class="demo1 birth" type="text" name="birth'+pet_nub+'" placeholder="y/m/d" readonly="readonly" value='+pet.birth+'>'+
						   '</div>'+
						    '<div class="input-item">'+
							    '<span class="title">宠物'+pet_nub+'性别</span>'+
								'<em class="sex-item w-sex-item" data-nub="1"><i class="icon_sex"></i>妹纸</em>'+
								'<em class="sex-item m-sex-item"  data-nub="2"><i class="icon_sex"></i>爷们</em>'+
						   '</div>'+
						    '<div class="input-item">'+
							    '<span  class="title">宠物'+pet_nub+'体重</span>'+
							   	'<input type="number" class="weight" name="weight'+pet_nub+'" placeholder="kg" value='+pet.weight+'>'+
						    '</div>'+
						    '<div class="input-item type-input clearfix">'+
							    '<span  class="title">宠物'+pet_nub+'类型</span>'+
							    '<div class="type-box">'+
							    	'<div class="mui-input-row mui-radio mui-left">'+
										'<label>小型犬</label>'+
										'<input class="list" name="list'+pet_nub+'" type="radio" value="1">'+
									'</div>'+
								    '<div class="mui-input-row mui-radio mui-left">'+
										'<label>中型犬</label>'+
										'<input  class="list" name="list'+pet_nub+'" type="radio" value="2">'+
									'</div>'+
									 '<div class="mui-input-row mui-radio mui-left">'+
										'<label>大型犬</label>'+
										'<input  class="list"  name="list'+pet_nub+'" type="radio" value="3">'+
									'</div>'+
									'<div class="mui-input-row mui-radio mui-left">'+
										'<label>巨型犬</label>'+
										'<input  class="list"  name="list'+pet_nub+'" type="radio" value="4">'+
									'</div>'+
									'<div class="mui-input-row mui-radio mui-left">'+
										'<label>猫</label>'+
										'<input  class="list"  name="list'+pet_nub+'" type="radio" value="5">'+
									'</div>'+
								'</div>'+
						    '</div>'+
						'</div>'+
					'</div>';
			if (pet_nub<4) {
				$('.add-wrap').append(PetHtml);
				// 给宠物的性别
				$('.'+pet_nub+'add-form .sex-item[data-nub='+pet.sex+']').addClass('active').siblings('em').removeClass('active')
				// 给宠物的类型
				$('.'+pet_nub+'add-form .type-box input[value='+pet.list+']').prop("checked", true);
				++pet_nub;
			}
		}
		/*累加增加宠物*/
		$('.new-btn-box .add-btn').on('touchend',function(){
			addPetHtml(pet);
		});
       /* 增加手机验证插件*/
        $.validator.addMethod("isMobile", function(value, element) { 
			  var length = value.length; 
			  var mobile = /^(((13[0-9]{1})|(15[0-9]{1}))+\d{8})$/; 
			  return this.optional(element) || (length == 11 && mobile.test(value)); 
		}, "请正确填写您的手机号码"); 
		/*表单验证*/
        $('#allForm').validate({
				rules:{
					phone: {
						required:true,
						isMobile:true,
					},
					name:{
						required:true
					},
					area:{
						required:true
					},
					detail:{
						required:true
					},
					email:{
						required:true,
						email:true
					},
					nickname1:{
						required:true
					},
					nickname2:{
						required:true
					},
					nickname3:{
						required:true
					},
					variety1:{
						required:true
					},
					variety2:{
						required:true
					},
					variety3:{
						required:true
					},
					birth1:{
						required:true,
					},
					birth2:{
						required:true,
					},
					birth3:{
						required:true,
					},
					weight1:{
						required:true,
						number:true
					},
					weight2:{
						required:true,
						number:true
					},
					weight3:{
						required:true,
						number:true
					}

				 },
			   messages :{
			   		phone: {
						required:'手机号为空',
						isMobile:'输入手机号有误',
					},
					name:{
						required:'用户名为空'
					},
					area:{
						required:'请选择区域'
					},
					detail:{
						required:'详细区域为空'
					},
					email:{
						required:'邮箱不能为空',
						email:'输入的邮箱有误'
					},
					nickname1:{
						required:'宠物1昵称为空'
					},
					nickname2:{
						required:'宠物2昵称为空'
					},
					nickname3:{
						required:'宠物3昵称为空'
					},
					variety1:{
						required:'宠物1类型不能为空'
					},
					variety2:{
						required:'宠物2类型不能为空'
					},
					variety3:{
						required:'宠物3类型不能为空'
					},
					weight1:{
						required:'宠物1体重为空',
						number:'宠物1体重不是数字'
					},
					weight2:{
						required:'宠物2体重为空',
						number:'宠物2体重不是数字'
					},
					weight3:{
						required:'宠物3体重为空',
						number:'宠物3体重不是数字'
					},
					birth1:{
						required:'宠物1生日为空',
					},
					birth2:{
						required:'宠物2生日为空',
					},
					birth3:{
						required:'宠物3生日为空',
					},
					
					
				},
				/*错误提示*/
				showErrors : function(errorMap, errorList) { 
					if(errorList.length>0){
						layer.open({
						    content: errorList[0].message
						    ,skin: 'msg'
						    ,time: 5 //5秒后自动关闭
						 })
					}
			    },
			   /* 失去焦点时不验证 输入时 */  
			   onfocusout : false,
			   onkeyup:false, 
		});
       /*宠物品种*/
		$('.add-wrap').on('click','.kind-item',function(){
			$('.kind-box').show();
			return false;
		});
		$('.dog').on('click',function(){
			$('.kind-box').hide();
			$('.dot-all').show();
		});
		$('.dot-all  ul>li>ul>li').click(function(){
			$('.kind-item input').val($(this).text())
			$('.dot-all').hide();
		})
		
		$('.cat').on('click',function(){
			$('.kind-box').hide();
			$('.cat-all').show();
		});
		$('.cat-all ul>li>ul>li').click(function(){
			$('.kind-item input').val($(this).text())
			$('.cat-all').hide();
		})
	
		/*提交申请*/
		$('.sub-btn').on('touchend',function(){
			$('.kind-item input').removeAttr("disabled"); 
          if ($("#allForm").valid() ) {
              var user={}
              user.phone = $('input[name="phone"]').val();
              user.name = $('input[name="name"]').val();
              user.gender = $('.gender-box em.active').data('nub');   //1 是女神   2 男神
              user.address = $('.area-box input[name="area"]').val()+" "+$('.area-box .detail-input').val();
              user.email =$('input[name="email"]').val();
              pets =[];
          	  getPets($('.add-wrap .add-box'));
          	  user.pets = pets;
          	  /* user是这个页面表单所有值，所有宠物封装成了该对象的数组 pets。 ajax提交即可*/
              console.log(user);
             
             window.location.href="succeed.html"

          }
		})
		
		