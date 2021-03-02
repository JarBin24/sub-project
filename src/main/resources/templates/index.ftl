<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<div id="app">
    <div class="page-container">
        <div class="upload-demo">
            <input type="file" id="fileInt" id="fileContent" onchange="changeData()" accept=".mp4">
            <input type="button" ref="fileInt11" onclick="checkPermission" value="鉴权">
        </div>
    </div>
</div>
</body>
<script src="http://public.51ifind.com/static/v2/tools/jQuery/jquery-1.8.2.min.js"></script>
<script>

/*function checkPermission(){
    var data = {};
    data.vhost = 'education';
    data.transcode = 'true';
    data.origine = 'v3';
    data.password = 'fc949eac20c914cebe77e632c48750ca';
    data.file = 'gxTest.mp4';
    //axios.put('http://videoupload.10jqka.com.cn:6080/filemanage/upload?vhost=education&app=&stream=&transcode=true&origine=v3&password=fc949eac20c914cebe77e632c48750ca&file=gxTest.mp4&hexin-v=AnLVYbWKeZhVQEWk4dnHUzYDw7NXA3R2qAtqwTxKnCUR5hxlJJPGrXiXussP'
    $.ajax.put('http://videoupload.10jqka.com.cn:6080/filemanage/upload?vhost=education&app=&stream=&file=shuping1.mp4&transcode=true&origine=v3&password=fc949eac20c914cebe77e632c48750ca', data, {}
            //axios.put('http://videoupload.10jqka.com.cn:6080/filemanage/upload', JSON.stringify(data),
            /!*new Headers({
                'Content-Type':'application/json'
            })*!/
    ).then(res => {
        console.log(res);
}).catch(err => {
        console.log(err);
});*/

function  changeData(){
     var files = $('#fileInt').get(0).files;
    var filename = files[0].name.split('.').length > 2 ? 'error' : files[0].name.split('.')[0] ;
    var parttern = /[\|\~|\`|\!|\@|\#|\$|\%|\^|\&|\(|\)|\[|\]|\{|\}|\||\\|\-|\=|\_|\+|\:|\;|\, ！·￥……（）——【】、，。：“‘？；《》<>]/g;
    var superExg = /^[A-Z]+/;  //判断文件名大写后缀

    if(files.length){

        for (var i=0;i < files.length; i++) {
            var file = $('#fileInt').get(0).files[i];

            (function(file){

                filename = file.name;
                var config = {
                    filename:filename,
                    filesize: getMb(file.size)
                };

                getKey(file)
                        .then(function(res){
                            sendFile(file,res);
                        });
            })(file);
        }
    }
}

function serialize(obj){
    var str = '';
    for (var i in obj) {
        str+= i + '=' + obj[i] + '&';
    }
    return str.slice(0,str.length-1);
}

function createXHR(){
    var xhr;
    if(window.ActiveXObject){
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }else{
        xhr = new XMLHttpRequest();
    }
    return xhr;
}
function getKey(file){
    return new Promise(function(res,rej){
        var xhr = createXHR(),
                method = 'PUT',
                filename = file.name,
                oData = {
                    vhost:'defaultvhost',
                    app:'',
                    stream:'',
                    filename:filename,
                    transcode:true,
                    origine:'v1',
                    filigrane:false,
                    capture:true
                },
                x;
        var url =  'http://videoupload.10jqka.com.cn:6080/filemanage/upload?vhost=education&app=&stream=&transcode=true&origine=v3&password=fc949eac20c914cebe77e632c48750ca&file='+filename;

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

function sendFile(file,res){
    var xhr = createXHR();

    var method = 'PUT',
            url = res,
            formData = new FormData(),
            x;

    formData.append("file", file);

    xhr.open(method,url,true);


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

</script>

</html>