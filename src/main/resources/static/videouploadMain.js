//@charset "utf-8";
//创作平台 视频上传
//@date 2017年12月19日11:18:15
define(['text!tpl/creation/uploadtr.tpl','artTemplate','promise','lib/titleTips','lib/wordlimit'],
function(uploadtrTpl,artTemplate,promise,TitleTips,wordlimit){
    var commonUriObj = SNS.strToObject($('.globalParam').attr('data-action'));
    var allFile = {};

    // allFile = {
    //     'keyName':{ filename + 自增数
    //         xhr:
    //         status: del 删除.uploading 上传 uploaded 上传完成 changing 转码中 changeDone 转码完成 disappear 视频不存在
    //         key:用来给接口，获取该资源转码状态
    //     }
    // }

    var keyunique = 0;
	var ajaxFlag = false;

	function VideouploadMain(){
		this.init();
	}

	VideouploadMain.prototype = {
		init:function(){
			if(!this.isSupport()){
				SNS.alertBox({"type":'error',"tipContent":'该浏览器不支持文件上传，请使用高版本浏览器。如谷歌浏览器。'});
				return false;
			}

			this.varInit();
			this.bindEvent();
            this.wordLimitInit();
            new TitleTips({
                maxWidth:'200px',
                defaultPosition:'bottom'
            });
		},
        wordLimitInit:function(){
            var opt = {
                callback:handleWL
            };
            $('[data-wordlimit]').wordLimit(opt);
        },
		bindEvent:function(){
			this.uploadBindEvent();/*上传*/
            this.deleteTrBindEvent();
            this.leaveBindEvent();
            this.inputBindEvent();
            this.isTranscode(); //是否解码
		},
		createXHR:function(){
            var xhr;
            if(window.ActiveXObject){
                xhr = new ActiveXObject('Microsoft.XMLHTTP');
            }else{
                xhr = new XMLHttpRequest();
            }
            return xhr;
        },
		varInit:function(){
            $('.rest').text(getMb(commonUriObj.sizeuse));
		},
        isTranscode: function(){ //是否解码
            $('.transcode-box').on('click', function(){
                if ($(this).find('.js-transcode').hasClass('icon-cw-materalselected')) {
                    $(this).find('.js-transcode').removeClass('icon-cw-materalselected').addClass('icon-cw-materalselect');
                } else {
                    $(this).find('.js-transcode').removeClass('icon-cw-materalselect').addClass('icon-cw-materalselected');
                }
            });
        },
        inputBindEvent:function () {
		    var self = this;
		    $('.js-name').on('input propertychange', function(event) {
                var name = $(this).val();
                var desc = $('.js-desc').val();
                var keyName = $('.viedo-upload-info').attr('data-keyname') || '';

                if(name.length>0 && desc.length>0 && keyName.length>0 && allFile[keyName].status == 'changeDone' ){
                    $('.js-submit').removeClass('graybg').addClass('coolbluebg');
                }else {
                    $('.js-submit').removeClass('coolbluebg').addClass('graybg');
                }
            });
            $('.js-desc').on('input propertychange', function(event) {
                var desc = $(this).val();
                var name = $('.js-name').val();
                var keyName = $('.viedo-upload-info').attr('data-keyname') || '';

                if(name.length>0 && desc.length>0 && keyName.length>0 && allFile[keyName].status == 'changeDone'){
                    $('.js-submit').removeClass('graybg').addClass('coolbluebg');
                }else {
                    $('.js-submit').removeClass('coolbluebg').addClass('graybg');
                }
            });
            $('.js-submit').on('click',function () {
                var desc = $('.js-desc').val();
                var name = $('.js-name').val();
                var keyName = $('.viedo-upload-info').attr('data-keyname') || '';
                if($(this).hasClass('graybg')){
                    return false;
                }
                if($('.viedo-upload-info .upload-single').length === 0){
                    SNS.alertBox({"type":"error","tipContent":'请先上传视频'});
                    return false;
                }
                if(keyName){
                    if(allFile[keyName].status != 'changeDone'){
                        return false;
                    }
                }else {
                    return false;
                }
                var key = allFile[keyName].key;
                var oData = {
                    title:name,
                    desc:desc,
                    source:'submit',
                    key:key
                };
                self.submitAjax(oData);
            });
        },
		uploadBindEvent:function(){
			var self = this;
			$('#file').on('change', function(event) {
				var files = $('#file').get(0).files;
				var filename = files[0].name.split('.').length > 2 ? 'error' : files[0].name.split('.')[0] ;
				var parttern = /[\|\~|\`|\!|\@|\#|\$|\%|\^|\&|\(|\)|\[|\]|\{|\}|\||\\|\-|\=|\_|\+|\:|\;|\, ！·￥……（）——【】、，。：“‘？；《》<>]/g;
				var superExg = /^[A-Z]+/;  //判断文件名大写后缀
                if(filename === 'error'){
                    SNS.alertBox({"type":'error',"tipContent":'<div class="lh2">上传文件名称暂不支持特殊符号</div>'});
                    $(this).val('');
                    return;
                }else if(parttern.test(files[0].name)){
                    SNS.alertBox({"type":'error',"tipContent":'<div class="lh2">上传文件名称暂不支持特殊符号</div>'});
                    $(this).val('');
                    return;
                }

                if (superExg.test(files[0].name.split('.')[1])) {
                    SNS.alertBox({"type":'error',"tipContent":'<div class="lh2">暂不支持大写后缀名的文件</div>'});
                    $(this).val('');
                    return;
                }

				if($('.video-upload').hasClass('graybg')){ //只支持单个视频上传
				    return;
                }
                self.checkVideoStatus();
                if(files.length){
				    $('.video-upload').addClass('graybg').removeClass('coolbluebg');
                    $('#file').attr('disabled','false');
		            for (var i=0;i < files.length; i++) {
		                var file = $('#file').get(0).files[i];

		                (function(file){
							//2019年5月22日17:11:29 先去掉限额
                            // if(file.size > commonUriObj.sizefree){
                            //     return;
                            //     SNS.alertBox({"type":'error',"tipContent":file.name+'文件超出限额，剩余限额为'+getMb(commonUriObj.sizefree)});
                            //     $('.video-upload').removeClass('graybg').addClass('coolbluebg');
                            //     $('#file').attr('disabled','true');
                            //     return;
                            // }
		                    filename = file.name;
		                    var config = {
		                    	filename:filename,
		                    	filesize: getMb(file.size)
		                    };
		                    $('.viedo-upload-info').removeClass('hide');
                            $('.viedo-upload-info').find('.upload-single').remove();
		                    var $tr = self.createTr(config);
		                    var $percent = $tr.find('.percent');
		                    var $progress = $tr.find('.range-inner');

		                    getKey(file)
		                    .then(function(res){
		                        sendFile(file,res,$percent,$progress);
		                    });
		                })(file);
		            }
				}
			});
		},
		createTr:function(config){
            // var $tableWrap = $('.cw-table-wrap');
            // if($tableWrap.hasClass('hide')){
            //     $tableWrap.removeClass('hide');
            //     $('.empty-wrap').addClass('hide');
            // }
			var render = artTemplate.compile(uploadtrTpl);
			var htmlStr = render(config);
			var $html = $(htmlStr).appendTo('.cw-form-table tbody .viedo-upload-info');
			return $html;
		},
        deleteTrBindEvent:function(){
            $('body').on('click','.js-del', function(event) {
                var self = this;
                var $tr = $(self).parents('tr');
                SNS.confirmBox({
                    tipContent:'是否中断正在上传中的文件'
                },function(){
                    var keyName = $tr.attr('data-keyname');
                    $('.video-upload').removeClass('graybg').addClass('coolbluebg');
                    $('#file').removeAttr('disabled');
                    if(keyName){
                        try {
                            allFile[keyName].xhr.abort();
                        }catch (e){
                            allFile[keyName].status = 'del';
                            $tr.addClass('hide');
                        }
                        allFile[keyName].status = 'del';
                        $tr.addClass('hide');
                        $tr.attr('data-keyname','');
                    }
                    /*添加背景*/
                    // var $tableWrap = $('.cw-table-wrap .viedo-upload-info');
                    // if(!$tableWrap.find('tr').length){
                    //     $tableWrap.addClass('hide');
                    //     $('.empty-wrap').removeClass('hide');
                    // }
                });
            });
        },
        leaveBindEvent:function(){
            window.onbeforeunload = function(e){
                e = e || window.event;

                if(e){
                    e.returnValue = '离开前请先确保视频已上传完毕，否则将中断视频上传。';
                }
                return '离开前请先确保视频已上传完毕，否则将中断视频上传。';
            };
        },
        /*检测视频文件状态*/
        checkVideoStatus:function(){
            var self = this;
            setInterval(function(){
                var $trs = $('.cw-table-wrap .viedo-upload-info');
                // $.each($trs,function(index, el) {
                var keyName = $trs.attr('data-keyname');
                if(!keyName){
                    return;
                }

                if(allFile[keyName].status == 'uploaded' || allFile[keyName].status == 'changing' || allFile[keyName].status == 'disappear'){
                    var oData = {
                        key:allFile[keyName].key
                    };

                    self.checkAjax(oData,$trs);
                }
                // });
            }, 1000);
        },
        checkAjax:function(oData,$tr){
            $.ajax({
                url: '/newcircle/package/getVideoStatus/',
                type: 'get',
                dataType: 'json',
                data: oData
            })
            .done(function(json) {
                var keyName = $tr.attr('data-keyname');

                if(json.errorCode >= 0){ //大于0 则表示后端拿到视频数据 不关注转码状态
                    if($('.js-name').val().length>0 && $('.js-desc').val().length>0){
                        $('.js-submit').removeClass('graybg').addClass('coolbluebg');
                    }
                    $tr.find('.status').removeClass('hide');
                    $tr.find('.status span').text('视频上传成功');
                    $tr.find('.videoprogress').addClass('hide');
                    allFile[keyName].status = 'changeDone'; //表示上传完成后端拿到数据 替换原有转码完成状态
                    $tr.find('.status span').addClass('orangetext');
                }else {
                    $('.js-submit').removeClass('coolbluebg').addClass('graybg');
                }

                // if(json.errorCode === 2){
                //     allFile[keyName].status = 'changing';
                //     $tr.find('.status span').addClass('orangetext');
                // }else if(json.errorCode === 3){
                //     allFile[keyName].status = 'changeDone';
                //     $tr.find('.status span').removeClass('orangetext');
                // }else if(json.errorCode === -11){
                //     /*视频不存在*/
                //     allFile[keyName].status = 'disappear';
                //     $tr.find('.status span').addClass('orangetext');
                // }else{
                //     $tr.find('.status span').removeClass('orangetext');
                // }
            });
        },
		isSupport:function(){
			var flag = true;
			if(typeof FormData == 'undefined'){
				flag = false;
			}
			if(typeof Object.keys == 'undefined'){
				flag = false;
			}
			return flag;
		},
        submitAjax:function (oData) {
            $.ajax({
                url: '/newcircle/package/updVideoInfo/',
                type: 'get',
                dataType: 'json',
                data: oData
            })
            .done(function(json) {
                if(json.errorCode === 0 ){
                    SNS.alertBox({"type":"error","tipContent":'提交成功'});
                    window.location.href = '//t.10jqka.com.cn/newcircle/creation/userMaterial/?source=media&currentpage=1';
                }else {
                    SNS.alertBox({"type":"error","tipContent":json.errorMsg});
                }
            });
        }
	};

    function serialize(obj){
        var str = '';
        for (var i in obj) {
            str+= i + '=' + obj[i] + '&';
        }
        return str.slice(0,str.length-1);
    }


	function getKey(file){
        return new Promise(function(res,rej){
            var xhr = vm.createXHR(),
                method = 'PUT',
                filename = file.name,
                oData = {
                    vhost:'defaultvhost',
                    app:'',
                    stream:'',
                    filename:encodeURIComponent(base64encode(utf16to8(filename))),
                    transcode:true,
                    origine:'v1',
                    filigrane:false,
                    capture:true
                },
                x;

            $.extend(oData,commonUriObj);

            /*特殊处理需要非转码的逻辑*/
            if ($('.transcode-box .js-transcode.icon-cw-materalselected').length) {
                oData.transcode = false;
                oData.origine = 'super';
                oData.password = $('.globalParam').attr('data-password');
            }

            var pinyinArr = pinyin(filename,{style:pinyin.STYLE_NORMAL});
            var reg     = /[\u4e00-\u9fa5]/g;
            oData.file = pinyinArr.join('').replace(reg,'').replace(/\s/g,'');

            // 替换完中文之后防止文件名为空上传失败，为空时用时间戳替换
            if (oData.file.split('.').length >= 2 && oData.file.split('.')[0].length === 0) {
            	var timeStr = Date.now();
	            oData.file	= timeStr + oData.file;
            }

            var url = decodeURIComponent(commonUriObj.url) + '/filemanage/upload?'+serialize(oData);

            xhr.open(method,url,true);


            xhr.onreadystatechange = function(){
                if(xhr.status == 200 && this.readyState == 4){
                    var response = this.responseText;
                    res(response);
                }
            };
            xhr.send(null);
        });
    }

	function sendFile(file,res,$percent,$progress){
        var xhr = vm.createXHR();
        var $tr = $progress.parents('tr');
        var method = 'PUT',
            url = res,
            formData = new FormData(),
            x;

        formData.append("file", file);

        xhr.open(method,url,true);

        var urlSearch = res.split('?')[1];
        var urlObj = SNS.unparam(urlSearch);
        var keyName = file.name+getUniqueKeyId();


        /*特殊处理需要非转码的逻辑*/
        if ($('.transcode-box .js-transcode.icon-cw-materalselected').length) {
            allFile[keyName] = {
                key : urlObj.key,
                xhr : xhr
            };
        } else {
            allFile[keyName] = {
                key : urlObj.tcfilekey,
                xhr : xhr
            };
        }
        

        $tr.attr('data-keyname',keyName);

        xhr.upload.addEventListener('progress', function(e){
            if (e.lengthComputable) {
                var percentComplete = e.loaded / e.total;
                $percent.text(parseInt(percentComplete * 100)+'%');
                $progress.css({
                    width:percentComplete * 100 + '%'
                });

                allFile[keyName].status = 'uploading';
                $('.js-submit').removeClass('coolbluebg').addClass('graybg');

                if(percentComplete == "1"){
                    allFile[keyName].status = 'uploaded';
                    $tr.find('.js-del').hide();
                }
            }
        }, false);

        xhr.upload.addEventListener('error', function(e){
            SNS.alertBox({"type":"error","tipContent":'视频上传失败，请稍后再试'});
            $('.video-upload').removeClass('graybg').addClass('coolbluebg');
            $('#file').attr('disabled','true');
            $tr.addClass('hide');
            $tr.find('.upload-single').remove();
        }, false);


        xhr.onreadystatechange = function(){
            if(xhr.status == 200 && this.readyState == 4){
                var response = this.responseText;
            }
        };
        xhr.send(formData);
    }

    function getMb(size){
        if(size < 1000){
            return size + 'b';
        }else if(size < 1000 *1000){
            return (size/1000).toFixed(2) + 'kb';
        }else if( size < 1000 *1000 *1000 ){
            return (size /1000 /1000).toFixed(2) + 'Mb';
        }else if( size < 1000 *1000 *1000 *1000 ){
            return (size /1000 /1000 /1000).toFixed(2) + 'Gb';
        }else if( size < 1000 *1000 *1000 *1000 *1000 ){
            return (size /1000 /1000 /1000 /1000).toFixed(2) + 'Tb';
        }
    }

    function getUniqueKeyId(){
        return keyunique++;
    }

    /*字数超出*/
    function handleWL(self,status,len){
        if(status == 'more'){
            self.$container.addClass('hintred');
        }else{
            self.$container.removeClass('hintred');
        }
    }

    $(document).ready(function(){
    	vm = new VideouploadMain();

    });
});