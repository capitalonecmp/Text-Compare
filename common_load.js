$(document).ready(function() {
	 
	$(".navtoggle").click(function () {
        $(".mainnav").toggle("slow");
        $(".navtoggle").toggle("slow");
        $(".navtoggleclose").toggle("slow");
        $(".navbutton").toggle("slow");
    });

    $(".navtoggleclose").click(function(){
        $(".mainnav").toggle("slow");
        $(".navtoggle").toggle("slow");
        $(".navbutton").toggle("slow");
        $(".navtoggleclose").toggle("slow");
    });
    
    
    $(window).resize(function() {
    	  $(".ui-dialog-content").dialog("option", "position", ['center', 'center']);
    	});
    
    
});
//disable console.logs
//var DEBUG = false;
//if(!DEBUG){
//    if(!window.console) window.console = {};
//    var methods = ["log", "debug", "warn", "info"];
//    for(var i=0;i<methods.length;i++){
//    	console[methods[i]] = function(){};
//    }
//}

//function handleErr(msg, url, line_no)
//{
// errorMsg = "Error: " + msg + "\n";
// errorMsg += "URL: " + url + "\n";
// errorMsg += "Line: " + line_no + "\n";
//console.log(errorMsg);
// return true; // It will not show error in browser JavaScript console.
//}

//onerror = handleErr; 


var globalurl="/";
 


function redirect(url)
{
	window.location="/"+url;
}




$(document).ajaxSend(
		function(event, jqxhr, settings) {
			
		if(settings.url != "/service/check_url"){		 
			if(settings.url!="/service/wordcount"){
				showProgress();
			}
			else
			{
				$("#counterLoader").show();
			}
		
		  }
		});

$(document).ajaxComplete(
		function(event, jqxhr, settings) {
		
		if(settings.url!="/service/wordcount"){
			hideProgress();
			$("#path").val("");
		}
		else
			{
			$("#counterLoader").hide();
			}
		});
var spinnerVisible = false;

    function showProgress() {
//        if (!spinnerVisible) {
//            $("div#spinner").fadeIn("fast");
//            spinnerVisible = true;
//        }
    	$( ".some_other_box" ).css({width: 0,'display':'block'});
    	  $( ".some_other_box" ).animate({
  		    width: "90%",
  		    display:"block",
  		    
  		  }, 1000 );
    };
    function hideProgress() {
//        if (spinnerVisible) {
//            var spinner = $("div#spinner");
//            spinner.stop();
//            spinner.fadeOut("fast");
//            spinnerVisible = false;
//        }
    	
    	 $( ".some_other_box" ).animate({
			    width: "100%",
			    display:"none",
			  }, 1000 ,function(){
				  $(this).hide();
			  });
    };
	
 
	function openFile(btnID, fileExt) {
		 

		new AjaxUpload($('#' + btnID),
				{
					action :globalurl+"readfile/uploadFile",
					name : 'userfile',
					onSubmit : function(file, ext1) {
					 
						var ext=ext1[0];
						if (fileExt == "Excel") {
							if (ext.trim() == 'xls' || ext.trim() == 'xlsx') {
							}
							else{
								openErrorDialog("Selected file is not Excel File");
								return false;
							}
 						}
						else if (fileExt!="any" && fileExt != ext) {
						 
							openErrorDialog("Selected file is not " + fileExt
									+ " file");
							return false;
						}
						else if(fileExt=="any")
						{
							 
							if(ext=="jpeg" || ext=="png" || ext=="jpg" || ext=="gif" || ext=="bmp" || ext=="pdf"  || ext=="pptx"  || ext=="ppt")
								{
								openErrorDialog("Selected file is not supported");
								return false;
								}
						}
 					 
						showProgress();

					},
					onComplete : function(file, response) {

						if(response!='error'){
							 
							 readFile(response, btnID);
						}else
						{
							openErrorDialog("Error in Loading File.");
						}
						
						hideProgress();

					}
				});

	}

	
	function readFile(fName,btnID){
		 
		var url="readfile/readFile";
		
		var n = fName.lastIndexOf(".");
		
		var ext=fName.substring(n+1,fName.length);
		console.log(ext);
		
		if(btnID=="excelTohtml"){
			url="readfile/convertHTML";
			$("#fName").text(fName);
		}
		
		$.ajax({
			 type:"post",
			 url :globalurl+url,
			data : {
				fileName : fName
			},
			success : function(response) {
				 
				 
				if(response!='error'){
					
					if(btnID=="F2"){
						setFileName(2,fName);
						setToEditor2(response);
					}
					else{
						if(btnID=="F1"){
							setFileName(1,fName);
						}
					setToEditor(response);
					}
				}else
				{
					openErrorDialog("Error in Loading File.");
					$("#fName").text("");
				}
			},
			error : function(e, s, a) {
				openErrorDialog("Failed to load data=" + s);
				$("#fName").text("");
			}
		});
	}
	
	function openFileImage(btnID, fileExt) {
		 

		new AjaxUpload($('#' + btnID),
				{
					action :globalurl+"convter/convertToBase64",
					name : 'userfile',
					onSubmit : function(file, ext1) {
						 var ext=ext1[0];
						
						if(ext=="jpeg" || ext=="png" || ext=="jpg" || ext=="gif" || ext=="bmp" || ext=="psd" )
							{
							showProgress();
							return true;
							}
						else{
							openErrorDialog("Please Select Image File Only...!");
							return false;
						}
						

					},
					onComplete : function(file, response) {

						if(response!='error' && response.search("Filename")==-1){
							//console.log(response);
							$("#baseConvertImage").prop('src',response);
							$("#baseConvertImage" ).removeClass( "baseurlopa" ).addClass( "baseurlopa1" );

							$("#baseConvertImageTag").val("<img src='"+response+"'/>");
							$("#baseConvertImageCSS").val("background-image: url("+response+")");
							$("#allcontents").css("display",'Block');
							$("#allcontents").css("margin",' 53px 0px 0px');
							
						}else
						{
							openErrorDialog("Error in Loading File.");
						}
						
						hideProgress();

					}
				});

	}
	
	
	
	function getDataFromUrlId(urlid)
	{
		$.ajax({
			 type:"post",
			 url :globalurl+"service/getDataFromID",
			dataType : "text",
			data : {
				urlid : urlid
			},
			success : function(response) {
				 
				setToEditor(response);
				 $(".sharelinkurl").attr("st_url",window.location);
				 $(".sharelinkurl").attr("st_title",$("#save_link_title").val());
			},
			error : function(e, s, a) {
				openErrorDialog("Failed to load data=" + s);
				 
			}
		});
	}
	
 	
	function convertToCSV(typedata) {
		var content = editorAce.getValue();
        var validXML=true;
		if (content.trim().length>0) {
			var data="";
			if (typedata == 'xml') {
				data = editorAce.getValue();
				
				
			} else if (typedata == 'json') {
				var obj = editorAce.getValue();
				var xotree = new XML.ObjTree();
				data = xotree.writeXML(JSON.parse(obj));
				
			}

			 try{
				 
					date=$.parseXML(data);
					}
				catch(e)
				{
					validXML=false;
					openErrorDialog("Invalid data format");
				} 
			
			if(validXML){
			$.ajax({
				type:"post",
				 url :globalurl+"convter",
				data : {
					type : 'xml2csv',
					data : data
				},
				success : function(response) {
			
					console.log(response);
//					 var blob = new Blob([ "" + response + "" ], {
//						type : "text/plain;charset=utf-8"
//					});
//					 if (typedata == 'xml') {
//					saveAs(blob, "xml2csv.csv");
//					 }
//					 else if (typedata == 'json') {
//						saveAs(blob, "json2csv.csv");
//					 }

				},
				error : function(e) {
					openErrorDialog("Failed to Convert into CSV");
				}
			});
			}
		}

	}

function clearEditorInput() {
	
	//this is for jsvalidate to clear textarea
	$("#jsData").val('');
	
	//this is for cssvalidate to clear textarea
	$("#cssData").val("");
	
 
	
	//this is for wordcounter to clear textarea
	$("#tData").val('');
	
	if(typeof editorAce != 'undefined'){
		editorAce.setValue("");
	}
	
	if(typeof editorResult != 'undefined'){
		editorResult.setValue("");
	}
	else
		{
		$("#result1").html("");
		$("#result").text("");
	}
		
	$("#result1").html("");
	if(typeof editor != 'undefined'){
		if(typeof editor.set != 'undefined') {
		editor.set();
		}
	}
	
	var old;
	if(old != undefined){
		var result1 = document.getElementById("result1");
		var d = result1.contentWindow.document;
		old = "";
		d.open();
		d.write("");
		d.close();
	}
	
		$("#outputMsg").html("Result");
		
}

function setOutputMsg(msg)
{
		$("#outputMsg").html("Result : "+msg);
}

	
function openErrorDialog(msg) {
	$('<div></div>').appendTo('#openError').html('<div>' + msg + '</h5></div>')
			.dialog({
				modal : true,
				title : "Message",
				zIndex : 10000,
				autoOpen : true,
				width:'400',
				resizable : false,
				buttons : {
					Ok : function() {
						$(this).dialog('destroy');
					}
				}
			});
}



function detectHtmlTags(scripttext){
	 var htmlTagRegexp = new RegExp('</?(?:article|aside|bdi|command|'+
	            'details|dialog|summary|figure|figcaption|footer|header|hgroup|mark|'+
	            'meter|nav|progress|ruby|rt|rp|section|time|wbr|audio|'+
	            'video|source|embed|track|canvas|datalist|keygen|output|'+
	            '!--|!DOCTYPE|a|abbr|address|area|b|base|bdo|blockquote|body|'+
	            'br|button|canvas|caption|cite|code|col|colgroup|dd|del|dfn|div|'+
	            'dl|dt|em|embed|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|'+
	            'h5|h6|head|hr|html|i|iframe|img|input|ins|kdb|keygen|label|legend|'+
	            'li|link|map|menu|meta|noscript|object|ol|optgroup|option|p|param|'+
	            'pre|q|s|samp|select|small|source|span|strong|style|sub|'+
	            'sup|table|tbody|td|textarea|tfoot|th|thead|title|tr|u|ul|var|'+
	            'acronym|applet|basefont|big|center|dir|font|frame|'+
	            'frameset|noframes|strike|tt)(?:(?: [^<>]*)>|>?)', 'i');
	
	
	 console.log(scripttext.match(htmlTagRegexp));
	 
	if(scripttext.match(htmlTagRegexp)){
		return true;
	}
	else{
		return false;
	}
}

function getjs(scripttext)
{ 
var re = /<script.*?>([\s\S]*?)<\/script>/gmi;

var match;
var js="";

while (match = re.exec(scripttext)) {
	
	console.log(match[1]);
  js=js+match[1];
}
	 
 
   return js;
}
function randomFileName(len, charSet) {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var fileName = '';
    for (var i = 0; i < len; i++) {
    	var randomPoz = Math.floor(Math.random() * charSet.length);
    	fileName += charSet.substring(randomPoz,randomPoz+1);
    }
    return fileName;
}


var fsr=0;
function fullScreenLeft(){
	
	
	
	$(".leftThum").hide();
	$(".rightThum").hide();
	
	if(fsr==0){
		
		fsr=1;
		
		$("#fsimg").attr('src', '/img/fsout.png');
		$("#fsimg").attr('title', 'Small Screen');
		
	$("#mainRightDiv").hide();
	$("#mainLeftDiv").addClass('mainDivLeft');
	$("#editor").css({
		'width':'100%'
	});
	$("#buttonDiv").css({
		'float':'right'
	});
	 
	
	if(typeof editorResult != 'undefined'){
		editorResult.getSession().setUseWrapMode(false);
	}
	
	
	
	}
	else
	{
		fsr=0;
		//$(".leftThum").show();
		//$(".rightThum").show();
		$("#fsimg").attr('src', '/img/fsin.png');
		$("#fsimg").attr('title', 'Full Screen');
		
		$("#mainRightDiv").show();
		$("#mainLeftDiv").removeClass('mainDivLeft');
		$("#editor").css({
			'width':'100%'
		});
		$("#buttonDiv").css({
			'float':'left'
		});
		 
		
		if(typeof editorResult != 'undefined'){
		editorResult.getSession().setUseWrapMode(true);
		var data=editorResult.getValue();
		editorResult.setValue(data);
		
		
		}
	}
	
	if(typeof editorResult != 'undefined'){
		editorResult.resize();
	}
	if(typeof editorAce != 'undefined'){
		editorAce.resize();
	}
}

var fsr1=0;
function fullScreenRight(){
	
	$(".leftThum").hide();
	$(".rightThum").hide();
	
	if(fsr1==0){
		
		fsr1=1;
		$("#fs1img").attr('src', '/img/fsout.png');
		$("#fs1img1").attr('title', 'Small Screen');
		
	$("#mainLeftDiv").hide();
	$("#mainRightDiv").addClass('mainDivLeft');
	$("#result").css({
		'width':'100%'
	});
	 
	 
	if(typeof editorResult != 'undefined'){
	editorResult.getSession().setUseWrapMode(false);
	}
	
	
	}
	else
	{
		fsr1=0;
		//$(".leftThum").show();
		//$(".rightThum").show();
		$("#fs1img").attr('src', '/img/fsin.png');
		$("#fs1img").attr('title', 'Full Screen');
		
		$("#mainLeftDiv").show();
		$("#mainRightDiv").removeClass('mainDivLeft');
		$("#result").css({
			'width':'100%'
		});
		 
		 
		
		if(typeof editorResult != 'undefined'){
		editorResult.getSession().setUseWrapMode(true);
		}
		
		
		
	}
	
	if(typeof editorResult != 'undefined'){
		editorResult.resize();
	}
	if(typeof editorAce != 'undefined'){
		editorAce.resize();
	}
}

$(document).ready(function(){
	
	
	$('.close1').click(function() {
		$(".ui-dialog-content").dialog("destroy");
	});
	
	
    $(".btn,.span11").on('click',function(){
    	
    	//fsr1==1 means right side div on full screen mode
    	if(fsr1==1)
    	{
    		fullScreenRight();
    	}
    	
    	//fsr==1 means left side div on full screen mode
    	else if(fsr==1)
    	{
    		fullScreenLeft();
    	}
    });
});



function changeLeftDiv(){
	 
		$("#editor").css({
			'width':'20%'
		});
		$("#mainLeftDiv").css({
			'width':'20%'
		});
		$("#mainRightDiv").css({
			'width':'60%'
		});
		
		$("#result").css({
			'width':'58%'
		});
		
		if(typeof editorResult != 'undefined'){
		editorResult.getSession().setUseWrapMode(true);
		var data=editorResult.getValue();
		editorResult.setValue(data);
		}
}

function changeRightDiv(){
	 
	$("#editor").css({
		'width':'58%'
	});
	$("#mainLeftDiv").css({
		'width':'60%'
	});
	$("#mainRightDiv").css({
		'width':'20%'
	});
	
	$("#result").css({
		'width':'20%'
	});
	
	if(typeof editorResult != 'undefined'){
	editorResult.getSession().setUseWrapMode(true);
	var data=editorResult.getValue();
	editorResult.setValue(data);
	}
}
 
function normalScreen(){
	
	$("#editor").css({
		'width':'100%'
	});
	
	$("#result").css({
		'width':'100%'
	});
	
	$("#mainLeftDiv").css({
		'width':'100%'
	});
	$("#mainRightDiv").css({
		'width':'100%'
	});
	
}

//Login

//login dialog
function login(msg){
	
	if(msg==undefined){
	$("#logFail").text("");
	
	$("#username_txt1").val("");
	$("#email_txt1").val("");
	$("#pass_txt1").val("");
	$("#pass_txt").val("");
	$("#email_txt").val("");
	
	$("#signinDiv").show();
	$("#signupDiv").hide();
	}
	else
	{
		$("#logFail").text(msg);
	}
	$("#customLogin").dialog({
		  
		
		modal : true,
		width: "auto",
		draggable: false,
		height: "auto",
		title : "LOGIN",
		autoOpen : true,
		resizable : false,
	});
	$(".ui-dialog-titlebar-close").hide();
	$(".ui-dialog .ui-dialog-titlebar").hide();
	
}

//custom login
function customLogin()
{
	var email=$("#email_txt").val();
	var pass=$("#pass_txt").val();
  if(email.trim()=="" || pass.trim()=="" )
		{
	  openErrorDialog("Please Enter the Email and Password");
		return false;
		}
	else
		{
	$("#logFail").text("");
	$("#customLogin").dialog('destroy');
	$.ajax({		 
		 url :"/service/login",
		 dataType : "text",
		 type:"post",
		 data:{
			 email:email,
			 password:pass,
		 },
		 success : function(response) {
		 
			
			 if(response=="success"){
				 location.reload(); 
			 }
			 else
			 {
				 var msg="Invalid username and password";
				 login(msg);
			 }
			 
		},
		error : function(e, s, a) {
			 
			openErrorDialog("Failed to Login Pls Try Again");
			 
		}
	});
}
}


//sign up with codebeautify
function customSignup()
{
	var email=$("#email_txt1").val();
	var password=$("#pass_txt1").val();
	var username=$("#username_txt1").val();
  if(email.trim()=="" || password.trim()=="" && username.trim()=="")
		{
	  openErrorDialog("Please Enter the required information");
		return false;
		}
	else
	{
	$("#logFail").text("");
	$("#customLogin").dialog('destroy');
	$.ajax({		 
		 url :"/service/signup",
		 dataType : "text",
		 type:"post",
		 data:{
			 username:username,
			 email:email,
			 password:password
		 },
		 success : function(response) {
		 
			 if(response=="success"){
				 location.reload(); 
			 }
			 else if(response=="duplicateEmail")
			 {
				 var msg="Email id is already registered....";
				 login(msg);
			 }
			 else
			 {
				 var msg="Failed to Create an Account, Pls Try Again";
				 login(msg);
			 }
			 
		},
		error : function(e, s, a) {
			 
			openErrorDialog("Failed to Login, Pls Try Again");
			 
		}
	});
		}
}


//facebook login
function loginwithfb(){
	
		
	$("#logFail").text("");
	$("#customLogin").dialog('destroy');
	showProgress();
	/*$.ajax({	
		 crossDomain: true,
		 url :"/hauth/login/Facebook",
		 dataType:"text",
		 success : function(response) {
		
			
			if(response=="success"){
				 location.reload(); 
			 }
			 else
			 {
				 var msg="Failed to Login, Pls Try Again";
				 login(msg);
			 }
			 
		},
		error : function(e, s, a) {
			 
			openErrorDialog("Failed to Login, Pls Try Again");
			 
		}
	});*/
}

//logout
function logout()
{
	
	$.ajax({	
		 crossDomain: true,
		 url :"/hauth/logout/Facebook",
		 dataType:"text",
		 success : function(response) {
			 if(response=="logout"){
			 $.ajax({
				 url :"/service/logout",
				 success : function(res) {
					 window.location.href = "/";
				}
			});
			 }
			 else
			 {
				 openErrorDialog("Error in Logout from facebook.");
			 }
		},
		error : function(e, s, a) {
			 
			//openErrorDialog("Failed to Logout, Pls Try Again");
			$.ajax({
				 url :"/service/logout",
				 success : function(res) {
					 window.location.href = "/";
				}
			});
		}
	});

	
}

function signupView()
{
	$("#signinDiv").hide();
	$("#signupDiv").show();
}


function checkEmail(id) {
	if($("#"+id).val()!=null && $("#"+id).val()!=""){
	var email = document.getElementById(id);
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (!filter.test(email.value)) {
    	$("#logFail").text('Please provide a valid email address');
    	$("#"+id).focus();
    }
    else
    {
    	$("#logFail").text('');
    }
    return false;
	}
 }


//get all saved links of user
function getsaveLink()
{
	$.ajax({		 
		 url :"/service/saveLinks",
		 dataType : "JSON",
		 success : function(response) {
			 createLinkView(response);
		},
		error : function(e, s, a) {
			 
			openErrorDialog("Failed to load data, Pls Try Again");
			 
		}
	});
}

//get all recents saved links of user
function getrecentsLink()
{
	$.ajax({		 
		 url :"/service/recentsLinks",
		 dataType : "json",
		 success : function(response) {
			 
			 console.log(response);
			 
			 createLinkView(response);
		},
		error : function(e, s, a) {
			 
			openErrorDialog("Failed to load data, Pls Try Again");
			 
		}
	});
}

var linksData=Array();
function createLinkView(response)
{
	linksData=[];
	var data="<ul>";
	$.each(response,function(i,value){
		
		
		
		linksData[i]={"id":value.id,"title":value.title,"desc":value.description};
		
		console.log(value.viewname);
		
		if(value.viewname != 0){
		
		data+="<li>";
		   data+="<h5><b>Title : </b>"+value.title+"</h5>";
		      data+="<ul>";
		          data+="<li><b>Link : </b><a href="+value.link+">http://codebeautify.org/"+value.link+"</a></li>";
		          data+="<li><b>Description : </b>"+value.description+"</li>";
		      data+="</ul>";
	    data+="</li>";
	    
	    if(value.user_id!="0"){
	    	
	    data+="<div style='padding: 9px;margin-bottom: -16px;'>";
	    	data+="<a href='#' onclick=editSavelink('"+i+"') style='padding-right: 6px;'>Edit</a>";
	    	data+="<a href='#' onclick='deleteSavelink("+value.id+")'>Delete</a>";
	    data+="</div>";
	    }
	    
	    data+="<hr>";
		}
	    
	});
	data+="</ul>";
	
	$("#saveLinksDiv").html("");
	$("#saveLinksDiv").append(data);
}

function editSavelink(i)
{
	
	 $("#edit_link_id").val(linksData[i].id);
	 $("#save_link_title").val(linksData[i].title);
	 $("#save_link_description").val(linksData[i].desc);
	 
	$("#savedialog").dialog({
		modal : true,
		title : "Edit Description",
		zIndex : 10000,
		autoOpen : true,
		width : '30%',
		resizable : false,
		buttons : {
			Save : function() {
				$("#openError").html('');
				editLink();
				$(this).dialog('destroy');
			},
		
		Cancel : function(event, ui) {
			$("#openError").html('');
			$(this).dialog('destroy');
		}
		},
	});
}




function ylogin()
{
	
	$("#yloginsection").dialog({
		modal : true,
		title : "Why you need to Login Or Register ?",
		zIndex : 10000,
		autoOpen : true,
		width : 'auto',
		resizable : false,
		
	});
}

function editLink()
{
	
	$.ajax({		 
		 url :"/service/updateSaveLink",
		 dataType : "text",
		 type:"post",
		 data:{
			 id:$("#edit_link_id").val(),
			 title:$("#save_link_title").val(),
			 desc:$("#save_link_description").val()
		 },
		 success : function(response) {

			 if(response=="success"){
			 openErrorDialog("Successfully Updated");
			location.reload(); 
			 }
			 else
			 {
				 openErrorDialog("Error in Update");
			 }
		},
		error : function(e, s, a) {
			 
			 openErrorDialog("Error in Update");
			 
		}
	});
}

function deleteSavelink(id)
{
	
	$('<div></div>').appendTo('#openError').html('<div>Do you want to Delete..?</h5></div>')
	.dialog({
		modal : true,
		title : "Confirm Delete",
		zIndex : 10000,
		autoOpen : true,
		width : '30%',
		resizable : false,
		buttons : {
			Delete : function() {
				
				$.ajax({		 
					 url :"/service/deleteSaveLink",
					 dataType : "text",
					 type:"post",
					 data:{
						 id:id,
					 },
					 success : function(response) {

						 if(response=="success"){
						// openErrorDialog("Successfully Deleted");
						 location.reload(); 
						 }
						 else
						 {
							 openErrorDialog("Error in Delete");
						 }
					},
					error : function(e, s, a) {
						 
						 openErrorDialog("Error in Delete");
						 
					}
				});
				
				$(this).dialog('destroy');
			},
			Close : function(event, ui) {
				$("#openError").html('');
				$(this).dialog('destroy');
			}
		},
	});
	
	
}


//open any file from url
function loadAnyFileFromUrl(storeID)
{
	$("#loadUrlPathDiv").dialog({
		modal : true,
		title : "Enter Url",
		zIndex : 10000,
		autoOpen : true,
		width : '400',
		resizable : false,
		buttons : {
			Load : function() {
				var path=$("#path").val();
				if(path.length>5){
					$.ajax({
						 type:"post",
						 url :globalurl+"service/getdata",
						dataType : "text",
						data : {
							path : path
						},
						success : function(response) {
							 $("#"+storeID).val(response);
							 $("#"+storeID).focus();
						},
						error : function(e, s, a) {
							openErrorDialog("Failed to load data=" + s);
							 
						}
					});
				}
				$(this).dialog('destroy');
			},
			Cancel : function(event, ui) {
				$("#openError").html('');
				$(this).dialog('destroy');
			}
		} 
	});
}
	
function decodeSpecialCharacter(str)
{
	return str.replace(/\&amp;/g,'&')
	.replace(/\&gt;/g,'>')
	.replace(/\&lt;/g,'<')
	.replace(/\&quot;/g,'"');
}


function encryptDecrypt(perform)
{

	var text=$("#text").val();
	
	if(text.trim().length>0){
		$.ajax({
			type:'post',
			url:"encryptDecrypt/"+perform,
			data:{
				key:$("#key").val(),
				alg:$("#alg").val(),
				mode:$("#mode").val(),
				text:text
			},
			dataType:"text",
			success:function(response){
				$("#result_ed").val('');
				$("#result_ed").val(response);
			},
			error : function(e, s, a) {
				openErrorDialog("Failed to Perform Operation" + s);
				 
			}
		});
	}
}

function makeFileDiff(){

	 var data_file1=$("#file1").val();
	 var data_file2=$("#file2").val();
	 
 if(data_file1!=null && data_file2!=null && data_file1.trim().length>0 && data_file2.trim().length>0){
	base = difflib.stringAsLines(data_file1);
	newtxt = difflib.stringAsLines(data_file2);
	sm = new difflib.SequenceMatcher(base, newtxt);
	 
	opcodes = sm.get_opcodes();
	 
	diffoutputdiv =document.getElementById("showDiff");

 
	diffoutputdiv.innerHTML ="";
    


diffoutputdiv.appendChild(diffview.buildView({
	baseTextLines: base,
	newTextLines: newtxt,
	opcodes: opcodes,
	baseTextName: fileName1,
	newTextName: fileName2,
	contextSize: null,
	viewType: 0
	}));
$(".diffinfo").show();
//$("#showDiff").show();

	showOnlyDiff();
 }
}


function showOnlyDiff()//function for  show only  differnce for file-diff tool
{
	 if($("#showonlydiff").is(':checked'))
		 {
		  $(".diff tbody tr td.equal").parent().hide();
		 }
	 else
		 {
		 $(".diff tbody tr td.equal").parent().show();
		 }
		 
}


function postTofb(){
	var user=$("#fbUserName").text();
	if(user!=null && user!='Sign in'){
	 showProgress();
	$.ajax({
		url:'/hauth/postTOFacebook',
		type:'post',
		data:{
			link:$("#fblink").text(),
			viewname:$("#subTitle").text()
			},
		success:function(res){
			if(res=="fail"){
				 openErrorDialog("Please Login to Facebook :<a href='/hauth/login/Facebook'>Login Facebook</a>");
			}
			else{
				openErrorDialog("Successfully post to facebook");
			}
				hideProgress();
		}
		});
	}
	else
	{
		 openErrorDialog("Please Login to Facebook :<a href='/hauth/login/Facebook'>Login Facebook</a>");
	}
}

function openPostToFbDialog(){
	
	$("#shareDiv").html($("#shareLinksOption").html());
	
    $("#shareDiv span.stButton").css({"margin-right" : "1px","margin-top" : "18px" ,"width" : "135px"});
	
	$("#fbpost").dialog({
		modal : true,
		title : "Share Post",
		zIndex : 10000,
		autoOpen : false,
		width : '50%',
		resizable : false,
		buttons : {
			Close : function() {
				$(this).dialog('destroy');
			}
		}
		});
	
	 
}
function removeCommentsFromJs(str) {
	 
    var uid = '_' + +new Date(),
        primatives = [],
        primIndex = 0;
 
    return (
        str
        /* Remove strings */
        .replace(/(['"])(\\\1|.)+?\1/g, function(match){
            primatives[primIndex] = match;
            return (uid + '') + primIndex++;
        })
 
        /* Remove Regexes */
        .replace(/([^\/])(\/(?!\*|\/)(\\\/|.)+?\/[gim]{0,3})/g, function(match, $1, $2){
            primatives[primIndex] = $2;
            return $1 + (uid + '') + primIndex++;
        })
 
        /*
        - Remove single-line comments that contain would-be multi-line delimiters
            E.g. // Comment /* <--
        - Remove multi-line comments that contain would be single-line delimiters
            E.g. /* // <-- 
       */
        .replace(/\/\/.*?\/?\*.+?(?=\n|\r|$)|\/\*[\s\S]*?\/\/[\s\S]*?\*\//g, '')
 
        /*
        Remove single and multi-line comments,
        no consideration of inner-contents
       */
        .replace(/\/\/.+?(?=\n|\r|$)|\/\*[\s\S]+?\*\//g, '')
 
        /*
        Remove multi-line comments that have a replaced ending (string/regex)
        Greedy, so no inner strings/regexes will stop it.
       */
        .replace(RegExp('\\/\\*[\\s\\S]+' + uid + '\\d+', 'g'), '')
 
        /* Bring back strings & regexes */
        .replace(RegExp(uid + '(\\d+)', 'g'), function(match, n){
            return primatives[n];
        })
    );
 
}



//test api functions
function deleteRow(tableID,row)
{
	 var i=row.parentNode.parentNode.rowIndex;
    document.getElementById(tableID).deleteRow(i);
    
    var table = document.getElementById(tableID);
    var rowCount = table.rows.length;
  
    if(rowCount==1){
    	 document.getElementById(tableID).deleteRow(0);
    	 addRow(tableID);
    }
}
function addRow(tableID) {


	var placeHolderContent="QueryString";
	var placeHolderValue="Value";
	
	var fieldKeyName="qsKey[]";
	var fieldValueName="qsValue[]";
	if(tableID=='headerTable'){
		placeHolderContent="Content-Type";
		
		fieldKeyName="hdrKey[]";
		fieldValueName="hdrValue[]";
	}
	
	var table = document.getElementById(tableID);

    var rowCount = table.rows.length;
    
    if(rowCount>0){
    	table.rows[rowCount-1].cells[3].innerHTML="<input  type='button' value='-' onclick=deleteRow('"+tableID+"',this); class='btn_customsetting'>";
    }
    
    var row = table.insertRow(rowCount);

    var cell1 = row.insertCell(0);
    cell1.className="span3";
    cell1.innerHTML = cell1.innerHTML+"<input name="+fieldKeyName+" class='span12' type='text' placeholder="+placeHolderContent+">";
    
    var cell2 = row.insertCell(1);
    cell2.innerHTML = cell2.innerHTML+"=";
    
    var cell3 = row.insertCell(2);
    cell3.className="span9";
    cell3.innerHTML = cell3.innerHTML+"<input name="+fieldValueName+" class='span12' type='text' placeholder="+placeHolderValue+">";
    
    var cell4 = row.insertCell(3);
     
    cell4.innerHTML = cell4.innerHTML+"<input type='button' class='btn_customsetting' value='+' onclick=addRow('"+tableID+"');>";
    
}


function getTableData(tableID){
	 
	 var table = document.getElementById(tableID);
	 var rowCount = table.rows.length;
	 var aarray=new Array();
	 for(var i=0;i<rowCount;i++){
		 var t1=table.rows[i].cells[0].firstElementChild.value;
		 var t2=table.rows[i].cells[2].firstElementChild.value;
		 
		aarray[t1]=t2;
	 }
	 return aarray;
}

function shownewApi(){
	
	  $("#queryStringTable").html('');
	  addRow("queryStringTable");
	 
	  $("#headerTable").html('');
	  addRow("headerTable");
	  
	  $("#apiData").show();
	  $("#resultView").hide();
	  
	  $("#apiMethod").val('get');
	  $("#cType").val('text');
	  $("#apiUrl").val('');
	  editorResult.setValue("");
	  $("html, body").animate({scrollTop: 0}, 10);
}

function showResult(){
	 $("#apiData").hide();
	 editorResult.setValue(" ");
	  $("#resultView").show();
}

function checkContentType(){
	var type=$("#cType").val();
	
	if(type=='other'){
		$("#oCtype").show();
	}
	else{
		$("#oCtype").hide();
	}
}

 
function callApi(){
	 
	var url=$("#apiUrl").val();
	
	if(url!=null && url.trim().length>8){
	showResult();
	editorResult.setValue(" ");
	$.ajax({
		type:$("#apiMethod").val(),
		url:"/service/testAPI",
		data: $("#apiForm").serialize(),
		dataType:'json',
		success:function(data){
			
				setToEditor(data);
		},
		error: function(jqXHR, textStatus,errorThrown) {
			setErrorToEditor("API Url content error or may not use cross domain request","html");
		}
	});
	}
	else{
		openErrorDialog("Please Enter Url");
	}
}

 
function setLangauge(){
	var lang=$("#editorLanguage").val();
	editorAce.getSession().setMode("ace/mode/"+lang);
	editorAce.setOptions({
	    enableBasicAutocompletion: true,
	    enableSnippets: true,
	    enableLiveAutocompletion: true
	});
}







/********************start Header Home js code******************/


var _gaq = _gaq || [];
_gaq.push([ '_setAccount', 'UA-36251023-1' ]);
_gaq.push([ '_setDomainName', 'jqueryscript.net' ]);
_gaq.push([ '_trackPageview' ]);

(function() {
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl'
			: 'http://www')
			+ '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();

(function(d, s, id) {
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) return;
js = d.createElement(s); js.id = id;
js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId=1379987838916043";
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk')); 

/******************end  HeaderHome js code ***********************/

/**********start  footerwitheditors js code *************/

$(document).ready(function(){
$("#more").click(function(){       
	
    $('html, body').animate({
         scrollTop: $(".footer_container").offset().top
   }, 1000);               
});
// hide #back-top first
$("#back-top").hide();

// fade in #back-top
$(function () {
	$(window).scroll(function () {
		if ($(this).scrollTop() > 100) {
			$('#back-top').fadeIn();
		} else {
			$('#back-top').fadeOut();
		}
	});

	// scroll body to 0px on click
	$('#back-top a').click(function () {
		$('body,html').animate({
			scrollTop: 0
		}, 800);
		return false;
	});
});
});						
//this for temporary to get file input on page




$(".btn").addClass("span11");

//this for temporary to get file input on page


/********** end footerwitheditors js code *************/

/**************start  Footer.php  js code *****************/

function downloadcode(viewname,ext) {
	//console.log("hello");
		$.ajax({
			 type:"post",
			 url :globalurl+"service/sampleData",
			dataType : "text",
			data : {
				viewname : viewname
			},
			success : function(response) {

				var blob = new Blob([ "" + response + "" ], {
					type : "text/plain;charset=utf-8"
				});
					
				
				var	fileName = "sampleData."+ext;
				
				saveAs(blob,fileName);
			},
			error : function(e, s, a) {
				openErrorDialog("Failed to Download data=" + s);
				 
			}
		});
	}

	$(".stButton").css({'display':'none!important'});

/************ End Footer.php  js code *****************/

/************start   Load Url Js function *********************/
function loadFromURL(view) {   
	 
	//loadFromURLJSON(view)
	//isJsonData=true;
	$("#loadUrlPathDiv").dialog({
		modal : true,
		title : "Enter Url",
		zIndex : 10000,
		autoOpen : true,
		width : '400',
		resizable : false,
		buttons : {
			Load : function() {
				var path=$("#path").val();
				if(path.trim().length>5){
									
					$.ajax({
						 type:"post",
						 url :globalurl+"service/getdata",
						dataType : "text",
						data : {
							path : path
						},
						success : function(response) {
							try {
								if(view=='RSS')
									{
								
										$("#result1").rssfeed(path);
									
									}
						
								//editorAce.setValue(response);
								setToEditor(response);

							} catch (e) {
								console.log(e);
								openErrorDialog("Invalid " + view + " Data");
								
							}
						},
						error : function(e, s, a) {
							openErrorDialog("Failed to load data=" + s);
							 
						}
					});
				}
				$(this).dialog('destroy');
			},
			Cancel : function(event, ui) {
				$("#openError").html('');
				$(this).dialog('destroy');
			}
		} 
	});
	
	 
}


/************ End  Load Url Js function *********************/


/***********Screenfly device array*************/
var modelSizeArr =
	//smart phones
	 [
       {
            "name": "Alcatel One Touch Idol Ultra",
            "os": "Android",
            "sizeinch": "4.7",
            "sizecm": "11.9",
            "widthpx": "720",
            "heightpx": "1280",
            "ppi": "316",
            "pxd" : "2",
            "category" : "SmartPhones"
        },
        {
            "name": "Alcatel One Touch Ultra 995",
            "os": "Android",
            "sizeinch": "4.3",
            "sizecm": "10.9",
            "widthpx": "480",
            "heightpx": "800",
            "ppi": "217",
            "pxd" : "1.5"
        },
        {   "name": " BlackBerry Bold 9930", 
        	"os": "BlackBerry",
        	"widthpx": "480", 
        	"heightpx": "640",
        	"sizeinch": "2.8", 
        	"sizecm": "7.11",
        	"pxd": "1" 
        },
        {
			"name" : "BlackBerry Torch 9810",
			"os": "BlackBerry",
			"widthpx" : "480",
			"heightpx" : "640",
			"sizeinch" : "3.2",
			"sizecm": "8.13",
			"pxd" : "1"
		},
		{
			"name" : "BlackBerry Torch 9850",
			"os": "BlackBerry",
			"widthpx" : "400",
			"heightpx" : "800",
			"sizeinch" : "3.7",
			"sizecm": "9.40",
			"pxd" : "2"
		}, 
        {
            "name": "BlackBerry Q10",
            "os": "BlackBerry",
            "sizeinch": "3.1",
            "sizecm": "7.9",
            "widthpx": "720",
            "heightpx": "720",
            "ppi": "330",
            "pxd" : "2"
        },
        {
            "name": "BlackBerry Z10",
            "os": "BlackBerry",
            "sizeinch": "4.2",
            "sizecm": "10.7",
            "widthpx": "768",
            "heightpx": "1280",
            "ppi": "356",
            "pxd" : "2"
        },
        {
            "name": "Droid",
            "os": "Android",
            "sizeinch": "3.7",
            "sizecm": "9.4",
            "widthpx": "480",
            "heightpx": "854",
            "ppi": "265",
            "pxd" : "2"
        },
        {
            "name": "Droid 3 & 4",
            "os": "Android",
            "sizeinch": "4.0",
            "sizecm": "10.0",
            "widthpx": "540",
            "heightpx": "960",
            "ppi": "280",
            "pxd" : "2"
        },
        {
            "name": "Droid Razr",
            "os": "Android",
            "sizeinch": "4.3",
            "sizecm": "11.0",
            "widthpx": "540",
            "heightpx": "960",
            "ppi": "256",
            "pxd" : "2"
        },
        {
            "name": "Droid Razr Maxx",
            "os": "Android",
            "sizeinch": "4.3",
            "sizecm": "11.0",
            "widthpx": "540",
            "heightpx": "960",
            "ppi": "256",
            "pxd" : "2"
        },
        {
            "name": "Galaxy Nexus",
            "os": "Android",
            "sizeinch": "4.6",
            "sizecm": "11.8",
            "widthpx": "720",
            "heightpx": "1280",
            "ppi": "316",
            "pxd" : 2
        },
        {
            "name": "Galaxy Note",
            "os": "Android",
            "sizeinch": "5.3",
            "sizecm": "13.5",
            "widthpx": "800",
            "heightpx": "1280",
            "ppi": "285",
            "pxd" : 2
        },
        {
            "name": "Galaxy Note II",
            "os": "Android",
            "sizeinch": "5.5",
            "sizecm": "14.1",
            "widthpx": "720",
            "heightpx": "1280",
            "ppi": "267",
            "pxd" : 2
        },
        {
            "name": "Galaxy S",
            "os": "Android",
            "sizeinch": "4.0",
            "sizecm": "10.0",
            "widthpx": "480",
            "heightpx": "800",
            "ppi": "233",
            "pxd" : 1.5
        },
        {
            "name": "Galaxy S Plus",
            "os": "Android",
            "sizeinch": "4.0",
            "sizecm": "10.0",
            "widthpx": "480",
            "heightpx": "800",
            "ppi": "233"
        },
        {
            "name": "Galaxy SII",
            "os": "Android",
            "sizeinch": "4.3",
            "sizecm": "10.8",
            "widthpx": "480",
            "heightpx": "800",
            "ppi": "219",
            "pxd" : 1.5
        },
        {
            "name": "Galaxy SIII",
            "os": "Android",
            "sizeinch": "4.8",
            "sizecm": "12.0",
            "widthpx": "720",
            "heightpx": "1280",
            "ppi": "306",
            "pxd" : 2
        },
        {
            "name": "Galaxy SIV",
            "os": "Android",
            "sizeinch": "5.0",
            "sizecm": "12.7",
            "widthpx": "1080",
            "heightpx": "1920",
            "ppi": "441",
            "pxd" : 3
        },
        {
            "name": "Google Nexus 4 by LG",
            "os": "Android",
            "sizeinch": "4.7",
            "sizecm": "12.0",
            "widthpx": "768",
            "heightpx": "1280",
            "ppi": "320",
            "pxd" : 2
        },
		{
			"name" : "HTC Desire 200",
			 "os": "Android",
			"widthpx" : 320,
			"heightpx" : 480,
			"sizeinch" : "3.5",
			"sizecm": "8.9",
			"pxd" : 1
		}, {
			"name" : "HTC Desire X",
			 "os": "Android",
			"widthpx" : 480,
			"heightpx" : 800,
			"sizeinch" : "4.0",
			"sizecm": "10.16",
			"pxd" : 1.5
		}, {
			"name" : "HTC Sensation",
			 "os": "Android",
			"widthpx" : 540,
			"heightpx" : 960,
			"sizeinch" : "4.5",
			"sizecm": "11.43",
			"pxd" : 1.5
		},
        {
            "name": "HTC Desire SV",
            "os": "Android",
            "sizeinch": "3.7",
            "sizecm": "9.4",
            "widthpx": "480",
            "heightpx": "800",
            "ppi": "252",
            "pxd": 1.5
        },
        {
            "name": "HTC Desire HD",
            "os": "Android",
            "sizeinch": "4.3",
            "sizecm": "11.0",
            "widthpx": "480",
            "heightpx": "800",
            "ppi": "217",
            "pxd": 1.5
            	
        },
        {
            "name": "HTC Evo",
            "os": "Android",
            "sizeinch": "4.3",
            "sizecm": "11.0",
            "widthpx": "480",
            "heightpx": "800",
            "ppi": "217",
            "pxd": 1.5
        },
        {
            "name": "HTC One",
            "os": "Android",
            "sizeinch": "4.7",
            "sizecm": "12.0",
            "widthpx": "1080",
            "heightpx": "1920",
            "ppi": "468",
            "pxd": 3
        },
		{
			"name" : "LG Optimus L5",
			"os": "Android",
			"widthpx" : 320,
			"heightpx" : 480,
			"sizeinch" : "4.0",
			"sizecm": "10.16",
			"pxd" : 1
		}, {
			"name" : "LG Optimus 3D",
			"os": "Android",
			"widthpx" : 480,
			"heightpx" : 800,
			"sizeinch" : "4.3",
			"sizecm": "10.92",
			"pxd" : 1.5
		}, {
			"name" : "LG Optimus 4X HD",
			 "os": "Android",
			"widthpx" : 720,
			"heightpx" : 1280,
			"sizeinch" : "4.7",
			"sizecm": "11.94",
			"pxd" : 2
		}, {
			"name" : "LG Optimus G Pro",
			 "os": "Android",
			"widthpx" : 1080,
			"heightpx" : 1920,
			"sizeinch" : "5.5",
			"sizecm": "13.97",
			"pxd" : 3
		}, {
			"name" : "LG Nexus 4",
			 "os": "Android",
			"widthpx" : 768,
			"heightpx" : 1280,
			"sizeinch" : "4.7",
			"sizecm": "11.94",
			"pxd" : 2
		},
        {
            "name": "iPhone (Original - 3GS)",
            "os": "iOS",
            "sizeinch": "3.5",
            "sizecm": "8.9",
            "widthpx": "320",
            "heightpx": "480",
            "ppi": "163",
            "pxd" : "1"
        },
        {
            "name": "iPhone 4 (4, 4S)",
            "os": "iOS",
            "sizeinch": "3.5",
            "sizecm": "8.9",
            "widthpx": "640",
            "heightpx": "960",
            "ppi": "326",
            "pxd" : "2"
        },
        {
            "name": "iPhone 5 & 5C",
            "os": "iOS",
            "sizeinch": "4.0",
            "sizecm": "10.0",
            "widthpx": "640",
            "heightpx": "1136",
            "ppi": "326",
            "pxd" : "2"
        },
        {
            "name": "Nokia Lumia (710, 800)",
            "os": "Windows",
            "sizeinch": "3.7",
            "sizecm": "9.4",
            "widthpx": "480",
            "heightpx": "800",
            "ppi": "252",
            "pxd" : 1.5
        },
        {
            "name": "Nokia Lumia 1020",
            "os": "Windows",
            "sizeinch": "4.5",
            "sizecm": "11.0",
            "widthpx": "768",
            "heightpx": "1280",
            "ppi": "332",
            "pxd" : 2
        },
        {
            "name": "Nokia Lumia 520",
            "os": "Windows",
            "sizeinch": "4.0",
            "sizecm": "10.0",
            "widthpx": "480",
            "heightpx": "800",
            "ppi": "233",
            "pxd" : 1.5
        },
        {
            "name": "Nokia Lumia 620",
            "os": "Windows",
            "sizeinch": "3.8",
            "sizecm": "9.7",
            "widthpx": "480",
            "heightpx": "800",
            "ppi": "246",
            "pxd" : 1.5
        },
        {
            "name": "Nokia Lumia 720",
            "os": "Windows",
            "sizeinch": "4.3",
            "sizecm": "10.9",
            "widthpx": "480",
            "heightpx": "800",
            "ppi": "217",
            "pxd" : 1.5
        },
        {
            "name": "Nokia Lumia 900",
            "os": "Windows",
            "sizeinch": "4.3",
            "sizecm": "11.0",
            "widthpx": "480",
            "heightpx": "800",
            "ppi": "217",
            "pxd" : 1.5
        },
        {
            "name": "Nokia Lumia 920",
            "os": "Windows",
            "sizeinch": "4.5",
            "sizecm": "11.0",
            "widthpx": "768",
            "heightpx": "1280",
            "ppi": "332",
            "pxd" : 2
        },
        {
            "name": "Nokia Lumia 925",
            "os": "Windows",
            "sizeinch": "4.5",
            "sizecm": "11.0",
            "widthpx": "768",
            "heightpx": "1280",
            "ppi": "332",
            "pxd" : 2
        },
        {
            "name": "Samsung Nexus S",
            "os": "Android",
            "sizeinch": "4.0",
            "sizecm": "10.0",
            "widthpx": "480",
            "heightpx": "800",
            "ppi": "235",
            "pxd" : "1.5"
        },
		{
			"name" : "Samsung S & S2",
			"os": "Android",
			"widthpx" : 480,
			"heightpx" : 800,
			"sizeinch" : "4.5",
			"sizecm": "11.43",
			"pxd" : 1.5
		}, {
			"name" : "Samsung S3",
			"os": "Android",
			"widthpx" : 720,
			"heightpx" : 1280,
			"sizeinch" : "4.8",
			"sizecm": "12.19",
			"pxd" : 2
		}, {
			"name" : "Samsung S4",
			"os": "Android",
			"widthpx" : 1080,
			"heightpx" : 1920,
			"sizeinch" : "5",
			"sizecm": "12.7",
			"pxd" : 3
		},
		{
			"name" : "Samsung Y",
			"os": "Android",
			"widthpx" : "240",
			"heightpx" : "320",
			"sizeinch" : "3.0",
			"sizecm": "7.62",
			"pxd" : "1"
		},
        {
            "name": "Sony Xperia Z",
            "os": "Android",
            "sizeinch": "5.0",
            "sizecm": "12.7",
            "widthpx": "1080",
            "heightpx": "1920",
            "ppi": "441",
            "pxd" : 3
        },

//tablets

      {
          "name": "Acer Picasso",
          "os": "Android",
          "sizeinch": "11.6",
          "sizecm": "29.0",
          "widthpx": "768",
          "heightpx": "1280",
          "ppi": "190",
          "pxd" : 1.5,
          "category" : "Tabltes"
      },
      {
          "name": "Ainol Novo 10 Hero",
          "os": "Android",
          "sizeinch": "10.0",
          "sizecm": "25.0",
          "widthpx": "1280",
          "heightpx": "800",
          "ppi": "151",
          "pxd" : 1.5
      },
      {
          "name": "Ainol Novo 7 Crystal",
          "os": "Android",
          "sizeinch": "7.0",
          "sizecm": "18.0",
          "widthpx": "1024",
          "heightpx": "600",
          "ppi": "169",
          "pxd" : 1
      },
      {
          "name": "Ainol Novo 9 Spark",
          "os": "Android",
          "sizeinch": "9.7",
          "sizecm": "25.0",
          "widthpx": "2048",
          "heightpx": "1536",
          "ppi": "264",
          "pxd" : 2
      },
      {
          "name": "Amazon Kindle Fire 1st Gen",
          "os": "Android",
          "sizeinch": "7.0",
          "sizecm": "18.0",
          "widthpx": "600",
          "heightpx": "1024",
          "ppi": "169",
          "pxd": 1
      },
      {
          "name": "Amazon Kindle Fire HD 7\"",
          "os": "Android",
          "sizeinch": "7.0",
          "sizecm": "18.0",
          "widthpx": "800",
          "heightpx": "1280",
          "ppi": "216",
          "pxd": 1.5
      },
      {
          "name": "Amazon Kindle Fire HD 8.9\"",
          "os": "Android",
          "sizeinch": "8.9",
          "sizecm": "23.0",
          "widthpx": "1200",
          "heightpx": "1920",
          "ppi": "254",
          "pxd": 1.5
      },
      {
          "name": "Apple iPad 1 & 2",
          "os": "iOS",
          "sizeinch": "9.7",
          "sizecm": "25.0",
          "widthpx": "768",
          "heightpx": "1024",
          "ppi": "132",
          "pxd": 1
      },
      {
          "name": "Apple IPad 3 & 4",
          "os": "iOS",
          "sizeinch": "9.7",
          "sizecm": "25.0",
          "widthpx": "1536",
          "heightpx": "2048",
          "ppi": "264",
          "pxd": 2
      },
      {
          "name": "Apple iPad Mini",
          "os": "iOS",
          "sizeinch": "7.9",
          "sizecm": "20.0",
          "widthpx": "768",
          "heightpx": "1024",
          "ppi": "163",
          "pxd": 1
      },
      {
          "name": "Transformer Pad TF300",
          "os": "Android",
          "sizeinch": "10.1",
          "sizecm": "26.0",
          "widthpx": "1280",
          "heightpx": "800",
          "ppi": "224",
          "pxd": 1
      },
      {
          "name": "Asus Transformer Pad Infinity",
          "os": "Android",
          "sizeinch": "10.1",
          "sizecm": "26.0",
          "widthpx": "1920",
          "heightpx": "1200",
          "ppi": "224",
          "pxd": 1
      },
      {
          "name": "New Transformer Pad Infinity",
          "os": "Android",
          "sizeinch": "10.1",
          "sizecm": "26.0",
          "widthpx": "2560",
          "heightpx": "1600",
          "ppi": "224",
          "pxd": 1
      },
      {
          "name": "BlackBerry PlayBook",
          "os": "BlackBerry",
          "sizeinch": "7.0",
          "sizecm": "18.0",
          "widthpx": "1024",
          "heightpx": "600",
          "ppi": "169",
          "pxd" : 1
      },
      {
          "name": "Galaxy Note 10.1",
          "os": "Android",
          "sizeinch": "10.1",
          "sizecm": "26.0",
          "widthpx": "800",
          "heightpx": "1280",
          "ppi": "149",
          "pxd" : 1.5
      },
      {
          "name": "Google Nexus 10 by Samsung",
          "os": "Android",
          "sizeinch": "10.1",
          "sizecm": "26.0",
          "widthpx": "2560",
          "heightpx": "1600",
          "ppi": "300",
          "pxd" : 2.5
      },
      {
          "name": "Google Nexus 7 by Asus(2012)",
          "os": "Android",
          "sizeinch": "7.0",
          "sizecm": "18.0",
          "widthpx": "800",
          "heightpx": "1280",
          "ppi": "216",
          "pxd": 1.33
      },
      {
          "name": "Google Nexus 7 by Asus(2013)",
          "os": "Android",
          "sizeinch": "7.02",
          "sizecm": "18.0",
          "widthpx": "1200",
          "heightpx": "1920",
          "ppi": "216",
          "pxd": 1.33
      },
	  {
			"name" : "HP Slate 7",
			 "os": "Android",
			"widthpx" : 1024,
			"heightpx" : 600,
			"sizeinch" : "8.9",
			"sizecm": "22.60",
			"pxd" : 1
		}, {
			"name" : "HP Touchpad",
			 "os": "Android",
			"widthpx" : 1024,
			"heightpx" : 768,
			"sizeinch" : "9.7",
			"sizecm": "24.64", 
			"pxd" : 1
		},
      {
          "name": "Microsoft Surface RT",
          "os": "Windows",
          "sizeinch": "10.1",
          "sizecm": "26.0",
          "widthpx": "1366",
          "heightpx": "768",
          "ppi": "148",
          "pxd": 1
      },
      {
          "name": "Microsoft Surface Pro",
          "os": "Windows",
          "sizeinch": "10.1",
          "sizecm": "26.0",
          "widthpx": "1920",
          "heightpx": "1080",
          "ppi": "208",
          "pxd": 1.5
      },
      {
          "name": "Motorola Xoom",
          "os": "Android",
          "sizeinch": "10.1",
          "sizecm": "26.0",
          "widthpx": "1280",
          "heightpx": "800",
          "ppi": "149",
          "pxd" : 1.5
      },
      {
          "name": "Nook Tablet",
          "os": "Android",
          "sizeinch": "7.0",
          "sizecm": "18.0",
          "widthpx": "600",
          "heightpx": "1024",
          "ppi": "167",
          "pxd": 1
      },
      {
          "name": "Nook Tablet HD",
          "os": "Android",
          "sizeinch": "7.0",
          "sizecm": "18.0",
          "widthpx": "1440",
          "heightpx": "900",
          "ppi": "167",
          "pxd": 1
      },
      {
          "name": "Nook Tablet HD+",
          "os": "Android",
          "sizeinch": "7.0",
          "sizecm": "18.0",
          "widthpx": "1920",
          "heightpx": "1280",
          "ppi": "167",
          "pxd": 1
      },
      {
          "name": "Samsung Galaxy Tab",
          "os": "Android",
          "sizeinch": "7.0",
          "sizecm": "18.0",
          "widthpx": "600",
          "heightpx": "1024",
          "ppi": "171",
          "pxd": 1
      },
      {
          "name": "Samsung Galaxy Tab 10.1",
          "os": "Android",
          "sizeinch": "10.1",
          "sizecm": "25.7",
          "widthpx": "800",
          "heightpx": "1280",
          "ppi": "149",
          "pxd": 1
      },
      {
          "name": "Samsung Galaxy Tab 2",
          "os": "Android",
          "sizeinch": "7.7",
          "sizecm": "20.0",
          "widthpx": "600",
          "heightpx": "1024",
          "ppi": "170",
          "pxd": 1
      },
      {
          "name": "Samsung Galaxy Tab 2 10.1",
          "os": "Android",
          "sizeinch": "10.1",
          "sizecm": "26.0",
          "widthpx": "800",
          "heightpx": "1280",
          "ppi": "149",
          "pxd": 1
      },
	  {
			"name" : "Samsung Galaxy Note",
			"os" : "Android",
			"widthpx" : 800,
			"heightpx" : 1280,
			"sizeinch" : "5.29",
			"sizecm": "13.43",
			"pxd" : 1
		}, {
			"name" : "Samsung Galaxy Note 2",
			"os" : "Android",
			"widthpx" : 720,
			"heightpx" : 1280,
			"sizeinch" : "5.55",
			"sizecm": "14.10",
			"pxd" : 1
		}, {
			"name" : "Samsung Galaxy Tab 7.0",
			"os" : "Android",
			"widthpx" : 1024,
			"heightpx" : 600,
			"sizeinch" : "7",
			"sizecm": "17.78",
			"pxd" : 1
		}, {
			"name" : "Samsung Galaxy Tab 7.7",
			"os" : "Android",
			"widthpx" : 1280,
			"heightpx" : 800,
			"sizeinch" : "7.7",
			"sizecm": "19.56",
			"pxd" : 1
		}, {
			"name" : "Samsung Galaxy Tab 8.9",
			"os" : "Android",
			"widthpx" : 1280,
			"heightpx" : 800,
			"sizeinch" : "8.9",
			"sizecm": "22.61",
			"pxd" : 1
		}, {
			"name" : "Samsung Galaxy Tab 10.1",
			"os" : "Android",
			"widthpx" : 1280,
			"heightpx" : 800,
			"sizeinch" : "10.1",
			"sizecm": "25.65",
			"pxd" : 1
		}, {
			"name" : "Samsung Google Nexus 10",
			"os" : "Android",
			"widthpx" : 2560,
			"heightpx" : 1600,
			"sizeinch" : "10.1",
			"sizecm": "25.65",
			"pxd" : 2
		},
		{
			"name" : "Sony Xperia Tablet S",
			"os" : "Android",
			"widthpx" : 1280,
			"heightpx" : 800,
			"sizeinch" : "9.4",
			"sizecm": "23.88",
			"pxd" : 1
		}, {
			"name" : "Sony Xperia Tablet Z",
			"os" : "Android",
			"widthpx" : 1920,
			"heightpx" : 1200,
			"sizeinch" : "10.1",
			"sizecm": "25.65",
			"pxd" : 1
		},
      {
          "name": "Toshiba AT100",
          "os": "Android",
          "sizeinch": "10.1",
          "sizecm": "25.7",
          "widthpx": "1280",
          "heightpx": "800",
          "ppi": "149",
          "pxd" : 1
      },

  //laptops
	 {
			"name" : "Apple 11\" Macbook Air",
			"widthpx" : 1366,
			"heightpx" : 768,
			"sizeinch" : "11",
			"sizecm": "27.94",
			"pxd" : 1,
			"category" : "Laptops"
		}, {
			"name" : "Apple 13\" Macbook Air",
			"widthpx" : 1440,
			"heightpx" : 900,
			"sizeinch" : "13",
			"sizecm": "33.02",
			"pxd" : 1
		}, {
			"name" : "Apple 15\" Macbook Pro",
			"widthpx" : 1440,
			"heightpx" : 900,
			"sizeinch" : "15",
			"sizecm": "38.1",
			"pxd" : 1
		}, {
			"name" : "Apple 15\" Macbook Pro Restina",
			"widthpx" : 2880,
			"heightpx" : 1800,
			"sizeinch" : "15",
			"sizecm": "38.1",
			"pxd" : 1
		},
		{
			"name" : "Acer Aspire M5-583P",
			"widthpx" : 1366,
			"heightpx" : 768,
			"sizeinch" : "15.6",
			"sizecm": "39.62",
			"pxd" : 1
		}, {
			"name" : "Acer Aspire V7",
			"widthpx" : 1920,
			"heightpx" : 1080,
			"sizeinch" : "14",
			"sizecm": "35.56",
			"pxd" : 1
		},
		{
			"name" : "Asus Zenbook Infinity",
			"widthpx" : 2560,
			"heightpx" : 1440,
			"sizeinch" : "13.3",
			"sizecm": "33.78",
			"pxd" : 1
		}, {
			"name" : "Asus Taichi",
			"widthpx" : 1920,
			"heightpx" : 1080,
			"sizeinch" : "13.3",
			"sizecm": "33.78",
			"pxd" : 1
		}, {
			"name" : "Asus VivoBook S400",
			"widthpx" : 1366,
			"heightpx" : 768,
			"sizeinch" : "14.1",
			"sizecm": "35.81",
			"pxd" : 1
		}, {
			"name" : "Asus G75VW",
			"widthpx" : 1600,
			"heightpx" : 900,
			"sizeinch" : "17.3",
			"sizecm": "43.94",
			"pxd" : 1
		},
		{
			"name" : "Dell XPS 11",
			"widthpx" : 2560,
			"heightpx" : 1440,
			"sizeinch" : "11.6",
			"sizecm": "29.46",
			"pxd" : 1
		}, {
			"name" : "Dell XPS 12",
			"widthpx" : 1920,
			"heightpx" : 1080,
			"sizeinch" : "12.5",
			"sizecm": "31.75",
			"pxd" : 1
		}, {
			"name" : "Dell Inspiron 15R",
			"widthpx" : 1366,
			"heightpx" : 768,
			"sizeinch" : "15.6",
			"sizecm": "3962",
			"pxd" : 1
		}, {
			"name" : "Dell Inspiron 17R",
			"widthpx" : 1600,
			"heightpx" : 900,
			"sizeinch" : "17.3",
			"sizecm": "43.94",
			"pxd" : 1
		},
		{
			"name" : "HP Envy Touchsmart 14",
			"widthpx" : 3200,
			"heightpx" : 1800,
			"sizeinch" : "14",
			"sizecm": "35.56",
			"pxd" : 1
		}, {
			"name" : "HP Envy 15",
			"widthpx" : 1366,
			"heightpx" : 768,
			"sizeinch" : "15.6",
			"sizecm": "39.62",
			"pxd" : 1
		}, {
			"name" : "HP Envy 17",
			"widthpx" : 1920,
			"heightpx" : 1080,
			"sizeinch" : "17.3",
			"sizecm": "43.94",
			"pxd" : 1
		},
		{
			"name" : "Lenovo ThinkPad T440s",
			"widthpx" : 1600,
			"heightpx" : 900,
			"sizeinch" : "14",
			"sizecm": "35.56",
			"pxd" : 1
		}, {
			"name" : "Lenovo IdeaPad S500 Touch",
			"widthpx" : 1366,
			"heightpx" : 768,
			"sizeinch" : "15.6",
			"sizecm": "39.62",
			"pxd" : 1
		},
		{
			"name" : "Sony VAIO Pro 13",
			"widthpx" : 1920,
			"heightpx" : 1080,
			"sizeinch" : "13.3",
			"sizecm": "33.78",
			"pxd" : 1
		}, {
			"name" : "Sony VAIO E Series 14",
			"widthpx" : 1366,
			"heightpx" : 768,
			"sizeinch" : "14",
			"sizecm": "35.56",
			"pxd" : 1
		}, {
			"name" : "Sony VAIO Fit E 14",
			"widthpx" : 1600,
			"heightpx" : 900,
			"sizeinch" : "14",
			"sizecm": "35.56",
			"pxd" : 1
		},
		{
			"name" : "Toshiba Kirabook",
			"widthpx" : 2560,
			"heightpx" : 1440,
			"sizeinch" : "13.3",
			"sizecm" : "33.78",
			"pxd" : 1
		}, {
			"name" : "Toshiba Satellite P845t",
			"widthpx" : 1366,
			"heightpx" : 768,
			"sizeinch" : "14",
			"sizecm" : "35.56",
			"pxd" : 1
		}, {
			"name" : "Toshiba Qosmio X75",
			"widthpx" : 1920,
			"heightpx" : 1080,
			"sizeinch" : "17.3",
			"sizecm" : "43.94",
			"pxd" : 1
		}, {
			"name" : "Toshiba Qosmio X870",
			"widthpx" : 1600,
			"heightpx" : 900,
			"sizeinch" : "17.3",
			"sizecm" : "43.94",
			"pxd" : 1
		},
      
//monitors

      {
          "name": "Acer Chromebook",
          "sizeinch": "11.6",
          "sizecm": "29.0",
          "widthpx": "1366",
          "heightpx": "768",
          "ppi": "135",
          "category" : "Monitors",
          "pxd" : 1
      },
      {
          "name": "Acer Picasso",
          "sizeinch": "Android",
          "sizecm": "11.6",
          "widthpx": "29.0",
          "heightpx": "768",
          "ppi": "768",
          "pxd" : 1
      },
	  {
			"name" : "Acer Aspire ZC-605",
			"widthpx" : 1600,
			"heightpx" : 900,
			"sizeinch" : "19.5",
			"sizecm" : "49.53",
			"pxd" : 1
		}, {
			"name" : "Acer Aspire 7600U",
			"widthpx" : 1920,
			"heightpx" : 1080,
			"sizeinch" : "27",
			"sizecm" : "68.58",
			"pxd" : 1
		},
      {
          "name": "Apple 30\" Cinema Display",
          "sizeinch": "30.0",
          "sizecm": "76.0",
          "widthpx": "2560",
          "heightpx": "1600",
          "ppi": "100",
          "pxd" : 1
      },
	 {
			"name" : "21.5' iMac",
			"widthpx" : 1920,
			"heightpx" : 1080,
			"sizeinch" : "21.5",
			"sizecm" : "54.61",
			"pxd" : 1
		}, {
			"name" : "27' iMac",
			"widthpx" : 2560,
			"heightpx" : 1440,
			"sizeinch" : "27",
			"sizecm" : "68.58",
			"pxd" : 1
		},
      {
          "name": "Apple Thunderbolt Display",
          "sizeinch": "27.0",
          "sizecm": "69.0",
          "widthpx": "2560",
          "heightpx": "1440",
          "ppi": "109",
          "pxd" : 1
      },
      
      {
          "name": "ASUS K55N-DS81 15.6 in",
          "sizeinch": "15.6",
          "sizecm": "40.0",
          "widthpx": "1366",
          "heightpx": "768",
          "ppi": "100",
          "pxd" : 1
      },
	  {
			"name" : "ASUS ET2311",
			"widthpx" : 1920,
			"heightpx" : 1080,
			"sizeinch" : "23",
			"sizecm" : "58.42",
			"pxd" : 1
		}, {
			"name" : "ASUS ET2702",
			"widthpx" : 2560,
			"heightpx" : 1440,
			"sizeinch" : "27",
			"sizecm" : "68.58",
			"pxd" : 1
		},
      {
          "name": "Chromebook Pixel",
          "sizeinch": "12.9",
          "sizecm": "33.0",
          "widthpx": "2560",
          "heightpx": "1700",
          "ppi": "239","pxd" : 1
      },
      {
          "name": "DELL Inspiron 14 series 36\"",
          "sizeinch": "14.1",
          "sizecm": "36.0",
          "widthpx": "1600",
          "heightpx": "900",
          "ppi": "130",
          "pxd" : 1
      },
	  {
			"name" : "Dell Inspiron One 20",
			"widthpx" : 1600,
			"heightpx" : 900,
			"sizeinch" : "20",
			"sizecm" : "50.8",
			"pxd" : 1
		},
      {
          "name": "Dell S2340M 23\" Monitor",
          "sizeinch": "23.0",
          "sizecm": "58.0",
          "widthpx": "1920",
          "heightpx": "1080",
          "ppi": "96",
          "pxd" : 1
      },
      {
          "name": "Dell U2713HM 27\" Monitor",
          "sizeinch": "27.0",
          "sizecm": "69.0",
          "widthpx": "2560",
          "heightpx": "1440",
          "ppi": "109",
          "pxd" : 1
      },
      {
          "name": "Dell UltraSharp U2412M 24\" Monitor",
          "sizeinch": "24.0",
          "sizecm": "61.0",
          "widthpx": "1920",
          "heightpx": "1200",
          "ppi": "94",
          "pxd" : 1
      },
	  {
			"name" : "HP Envy Rove 20",
			"widthpx" : 1600,
			"heightpx" : 900,
			"sizeinch" : "20",
			"sizecm" : "50.8",
			"pxd" : 1
		}, {
			"name" : "HP Pavilion 23",
			"widthpx" : 1920,
			"heightpx" : 1080,
			"sizeinch" : "23",
			"sizecm": "58.0",
			"pxd" : 1
		},
		{
			"name" : "Lenovo IdeaCentre Horizon",
			"widthpx" : 1920,
			"heightpx" : 1080,
			"sizeinch" : "27",
			"sizecm" : "68.58",
			"pxd" : 1
		},
		{
			"name" : "Sony VAIO Tap 20",
			"widthpx" : 1600,
			"heightpx" : 900,
			"sizeinch" : "20",
			"sizecm" : "50.8",
			"pxd" : 1
		}, {
			"name" : "Sony VAIO L",
			"widthpx" : 1920,
			"heightpx" : 1080,
			"sizeinch" : "24",
			"sizecm" : "60.96",
			"pxd" : 1
		}
];

function getDeviceData(){
	var data = new Array();
	var category = "";
	$.each(modelSizeArr, function(i, value) {
		if(value.category != undefined){
			category = value.category;
		}
		data[i] ={value : value.name,device : value,category : category};
	});
	return data;
}

/************************Color Converter******************************************/

function convertTo(from,to){
	
	var color = "";
	
	//rgb to hex
	if(from == "rgb" && to == "hex"){
		
		$("#h").val(rgbToHex($("#r").val(),$("#g").val(),$("#b").val()));
		
		color = "#"+$("#h").val();
	}
	//hex to rgb
	else if(from == "hex" && to == "rgb"){
		
		var rgb = hexTorgb($("#h").val());
		
		rgb = rgb.split(",");
		
		$("#r").val(rgb[0]);
		$("#g").val(rgb[1]);
		$("#b").val(rgb[2]);
		
		color = "#"+$("#h").val().replace("#","").trim();
	}
	//rgb to hsv
	else if(from == "rgb" && to == "hsv"){
		
		var hsv = rgb2hsv($("#r").val(),$("#g").val(),$("#b").val());
		
		hsv = hsv.split(",");
		
		$("#h").val(hsv[0]);
		$("#s").val(hsv[1]);
		$("#v").val(hsv[2]);
		
		color = "#"+rgbToHex($("#r").val(),$("#g").val(),$("#b").val());
	}
	//rgb to cmyk
	else if(from == "rgb" && to == "cmyk"){
		
		var cmyk = RgbToCmyk($("#r").val(),$("#g").val(),$("#b").val());
		
		cmyk = cmyk.split(",");
		
		$("#c").val(cmyk[0]);
		$("#m").val(cmyk[1]);
		$("#y").val(cmyk[2]);
		$("#k").val(cmyk[3]);
		
		color = "#"+rgbToHex($("#r").val(),$("#g").val(),$("#b").val());
	}
	//hex to rgb
	else if(from == "hex" && to == "cmyk"){
		
		var rgb = hexTorgb($("#h").val());
		
		rgb = rgb.split(",");
		
		var cmyk = RgbToCmyk(rgb[0],rgb[1],rgb[2]);
		
		cmyk = cmyk.split(",");
		
		$("#c").val(cmyk[0]);
		$("#m").val(cmyk[1]);
		$("#y").val(cmyk[2]);
		$("#k").val(cmyk[3]);
		
		color = "#"+$("#h").val().replace("#","").trim();
	}
	
	
	$("#colorEffect").css({
		"background-color" : color
	});
	 
	
}


function hexTorgb(val){
	val = val.replace("#","");
	val = val.trim();
	
	return (parseInt(val.substring(0,2),16) + "," + parseInt(val.substring(2,4),16) + "," + parseInt(val.substring(4,6),16));
}

function rgbToHex(R, G, B) {
	return toHex(R) + toHex(G) + toHex(B);
}


function toHex(n) {
	n = parseInt(n, 10);
	if (isNaN(n))
		return "00";
	n = Math.max(0, Math.min(n, 255));
	return "0123456789ABCDEF".charAt((n - n % 16) / 16)
			+ "0123456789ABCDEF".charAt(n % 16);
}

function rgb2hsv(r, g, b) {
	var computedH = 0;
	var computedS = 0;
	var computedV = 0;

	// remove spaces from input RGB values, convert to int
	var r = parseInt(('' + r).replace(/\s/g, ''), 10);
	var g = parseInt(('' + g).replace(/\s/g, ''), 10);
	var b = parseInt(('' + b).replace(/\s/g, ''), 10);

	if (r == null || g == null || b == null || isNaN(r) || isNaN(g) || isNaN(b)) {
		openErrorDialog('Please enter numeric RGB values!');
		return;
	}
	if (r < 0 || g < 0 || b < 0 || r > 255 || g > 255 || b > 255) {
		alert('RGB values must be in the range 0 to 255.');
		return;
	}
	r = r / 255;
	g = g / 255;
	b = b / 255;
	var minRGB = Math.min(r, Math.min(g, b));
	var maxRGB = Math.max(r, Math.max(g, b));

	// Black-gray-white
	if (minRGB == maxRGB) {
		computedV = minRGB.toFixed(4);
		return (0 + "," + 0 + "," + computedV);
	}

	// Colors other than black-gray-white:
	var d = (r == minRGB) ? g - b : ((b == minRGB) ? r - g : b - r);
	var h = (r == minRGB) ? 3 : ((b == minRGB) ? 1 : 5);
	computedH = (60 * (h - d / (maxRGB - minRGB))).toFixed(1);
	computedS = ((maxRGB - minRGB) / maxRGB).toFixed(4);
	computedV = maxRGB.toFixed(4);
	return (computedH + "," + computedS + "," + computedV);
}

function RgbToCmyk(R,G,B)
{
    if ((R == 0) && (G == 0) && (B == 0)) {
        return [0, 0, 0, 1];
    } else {
        var calcR = 1 - (R / 255),
            calcG = 1 - (G / 255),
            calcB = 1 - (B / 255);

        var K = Math.min(calcR, Math.min(calcG, calcB)),
            C = (calcR - K) / (1 - K),
            M = (calcG - K) / (1 - K),
            Y = (calcB - K) / (1 - K);

        return (C.toFixed(4) + ","+ M.toFixed(4) +","+ Y.toFixed(4) +","+ K.toFixed(4));
    }
}

var colors = [
             {
                 "name": "AliceBlue",
                 "hex": "#f0f8ff",
                 "rgb": "240,248,255",
                 "hsv": "208.0,0.0588,1.0000",
                 "cmyk": "0.0588,0.0275,0.0000,0.0000"
             },
             {
                 "name": "AntiqueWhite",
                 "hex": "#faebd7",
                 "rgb": "250,235,215",
                 "hsv": "34.3,0.1400,0.9804",
                 "cmyk": "0.0000,0.0600,0.1400,0.0196"
             },
             {
                 "name": "AntiqueWhite1",
                 "hex": "#ffefdb",
                 "rgb": "255,239,219",
                 "hsv": "33.3,0.1412,1.0000",
                 "cmyk": "0.0000,0.0627,0.1412,0.0000"
             },
             {
                 "name": "AntiqueWhite2",
                 "hex": "#eedfcc",
                 "rgb": "238,223,204",
                 "hsv": "33.5,0.1429,0.9333",
                 "cmyk": "0.0000,0.0630,0.1429,0.0667"
             },
             {
                 "name": "AntiqueWhite3",
                 "hex": "#cdc0b0",
                 "rgb": "205,192,176",
                 "hsv": "33.1,0.1415,0.8039",
                 "cmyk": "0.0000,0.0634,0.1415,0.1961"
             },
             {
                 "name": "AntiqueWhite4",
                 "hex": "#8b8378",
                 "rgb": "139,131,120",
                 "hsv": "34.7,0.1367,0.5451",
                 "cmyk": "0.0000,0.0576,0.1367,0.4549"
             },
             {
                 "name": "aquamarine1",
                 "hex": "#7fffd4",
                 "rgb": "127,255,212",
                 "hsv": "159.8,0.5020,1.0000",
                 "cmyk": "0.5020,0.0000,0.1686,0.0000"
             },
             {
                 "name": "aquamarine2",
                 "hex": "#76eec6",
                 "rgb": "118,238,198",
                 "hsv": "160.0,0.5042,0.9333",
                 "cmyk": "0.5042,0.0000,0.1681,0.0667"
             },
             {
                 "name": "aquamarine4",
                 "hex": "#458b74",
                 "rgb": "69,139,116",
                 "hsv": "160.3,0.5036,0.5451",
                 "cmyk": "0.5036,0.0000,0.1655,0.4549"
             },
             {
                 "name": "azure1",
                 "hex": "#f0ffff",
                 "rgb": "240,255,255",
                 "hsv": "180.0,0.0588,1.0000",
                 "cmyk": "0.0588,0.0000,0.0000,0.0000"
             },
             {
                 "name": "azure2",
                 "hex": "#e0eeee",
                 "rgb": "224,238,238",
                 "hsv": "180.0,0.0588,0.9333",
                 "cmyk": "0.0588,0.0000,0.0000,0.0667"
             },
             {
                 "name": "azure3",
                 "hex": "#c1cdcd",
                 "rgb": "193,205,205",
                 "hsv": "180.0,0.0585,0.8039",
                 "cmyk": "0.0585,0.0000,0.0000,0.1961"
             },
             {
                 "name": "azure4",
                 "hex": "#838b8b",
                 "rgb": "131,139,139",
                 "hsv": "180.0,0.0576,0.5451",
                 "cmyk": "0.0576,0.0000,0.0000,0.4549"
             },
             {
                 "name": "beige",
                 "hex": "#f5f5dc",
                 "rgb": "245,245,220",
                 "hsv": "60.0,0.1020,0.9608",
                 "cmyk": "0.0000,0.0000,0.1020,0.0392"
             },
             {
                 "name": "bisque1",
                 "hex": "#ffe4c4",
                 "rgb": "255,228,196",
                 "hsv": "32.5,0.2314,1.0000",
                 "cmyk": "0.0000,0.1059,0.2314,0.0000"
             },
             {
                 "name": "bisque2",
                 "hex": "#eed5b7",
                 "rgb": "238,213,183",
                 "hsv": "32.7,0.2311,0.9333",
                 "cmyk": "0.0000,0.1050,0.2311,0.0667"
             },
             {
                 "name": "bisque3",
                 "hex": "#cdb79e",
                 "rgb": "205,183,158",
                 "hsv": "31.9,0.2293,0.8039",
                 "cmyk": "0.0000,0.1073,0.2293,0.1961"
             },
             {
                 "name": "bisque4",
                 "hex": "#8b7d6b",
                 "rgb": "139,125,107",
                 "hsv": "33.8,0.2302,0.5451",
                 "cmyk": "0.0000,0.1007,0.2302,0.4549"
             },
             {
                 "name": "black",
                 "hex": "#000000",
                 "rgb": "0,0,0",
                 "hsv": "0,0,0.0000",
                 "cmyk": [
                     0,
                     0,
                     0,
                     1
                 ]
             },
             {
                 "name": "BlanchedAlmond",
                 "hex": "#ffebcd",
                 "rgb": "255,235,205",
                 "hsv": "36.0,0.1961,1.0000",
                 "cmyk": "0.0000,0.0784,0.1961,0.0000"
             },
             {
                 "name": "blue1",
                 "hex": "#0000ff",
                 "rgb": "0,0,255",
                 "hsv": "240.0,1.0000,1.0000",
                 "cmyk": "1.0000,1.0000,0.0000,0.0000"
             },
             {
                 "name": "blue2",
                 "hex": "#0000ee",
                 "rgb": "0,0,238",
                 "hsv": "240.0,1.0000,0.9333",
                 "cmyk": "1.0000,1.0000,0.0000,0.0667"
             },
             {
                 "name": "blue4",
                 "hex": "#00008b",
                 "rgb": "0,0,139",
                 "hsv": "240.0,1.0000,0.5451",
                 "cmyk": "1.0000,1.0000,0.0000,0.4549"
             },
             {
                 "name": "BlueViolet",
                 "hex": "#8a2be2",
                 "rgb": "138,43,226",
                 "hsv": "271.1,0.8097,0.8863",
                 "cmyk": "0.3894,0.8097,0.0000,0.1137"
             },
             {
                 "name": "brown",
                 "hex": "#a52a2a",
                 "rgb": "165,42,42",
                 "hsv": "0.0,0.7455,0.6471",
                 "cmyk": "0.0000,0.7455,0.7455,0.3529"
             },
             {
                 "name": "brown1",
                 "hex": "#ff4040",
                 "rgb": "255,64,64",
                 "hsv": "0.0,0.7490,1.0000",
                 "cmyk": "0.0000,0.7490,0.7490,0.0000"
             },
             {
                 "name": "brown2",
                 "hex": "#ee3b3b",
                 "rgb": "238,59,59",
                 "hsv": "0.0,0.7521,0.9333",
                 "cmyk": "0.0000,0.7521,0.7521,0.0667"
             },
             {
                 "name": "brown3",
                 "hex": "#cd3333",
                 "rgb": "205,51,51",
                 "hsv": "0.0,0.7512,0.8039",
                 "cmyk": "0.0000,0.7512,0.7512,0.1961"
             },
             {
                 "name": "brown4",
                 "hex": "#8b2323",
                 "rgb": "139,35,35",
                 "hsv": "0.0,0.7482,0.5451",
                 "cmyk": "0.0000,0.7482,0.7482,0.4549"
             },
             {
                 "name": "burlywood",
                 "hex": "#deb887",
                 "rgb": "222,184,135",
                 "hsv": "33.8,0.3919,0.8706",
                 "cmyk": "0.0000,0.1712,0.3919,0.1294"
             },
             {
                 "name": "burlywood1",
                 "hex": "#ffd39b",
                 "rgb": "255,211,155",
                 "hsv": "33.6,0.3922,1.0000",
                 "cmyk": "0.0000,0.1725,0.3922,0.0000"
             },
             {
                 "name": "burlywood2",
                 "hex": "#eec591",
                 "rgb": "238,197,145",
                 "hsv": "33.5,0.3908,0.9333",
                 "cmyk": "0.0000,0.1723,0.3908,0.0667"
             },
             {
                 "name": "burlywood3",
                 "hex": "#cdaa7d",
                 "rgb": "205,170,125",
                 "hsv": "33.7,0.3902,0.8039",
                 "cmyk": "0.0000,0.1707,0.3902,0.1961"
             },
             {
                 "name": "burlywood4",
                 "hex": "#8b7355",
                 "rgb": "139,115,85",
                 "hsv": "33.3,0.3885,0.5451",
                 "cmyk": "0.0000,0.1727,0.3885,0.4549"
             },
             {
                 "name": "CadetBlue",
                 "hex": "#5f9ea0",
                 "rgb": "95,158,160",
                 "hsv": "181.8,0.4063,0.6275",
                 "cmyk": "0.4063,0.0125,0.0000,0.3725"
             },
             {
                 "name": "CadetBlue1",
                 "hex": "#98f5ff",
                 "rgb": "152,245,255",
                 "hsv": "185.8,0.4039,1.0000",
                 "cmyk": "0.4039,0.0392,0.0000,0.0000"
             },
             {
                 "name": "CadetBlue2",
                 "hex": "#8ee5ee",
                 "rgb": "142,229,238",
                 "hsv": "185.6,0.4034,0.9333",
                 "cmyk": "0.4034,0.0378,0.0000,0.0667"
             },
             {
                 "name": "CadetBlue3",
                 "hex": "#7ac5cd",
                 "rgb": "122,197,205",
                 "hsv": "185.8,0.4049,0.8039",
                 "cmyk": "0.4049,0.0390,0.0000,0.1961"
             },
             {
                 "name": "CadetBlue4",
                 "hex": "#53868b",
                 "rgb": "83,134,139",
                 "hsv": "185.4,0.4029,0.5451",
                 "cmyk": "0.4029,0.0360,0.0000,0.4549"
             },
             {
                 "name": "chartreuse1",
                 "hex": "#7fff00",
                 "rgb": "127,255,0",
                 "hsv": "90.1,1.0000,1.0000",
                 "cmyk": "0.5020,0.0000,1.0000,0.0000"
             },
             {
                 "name": "chartreuse2",
                 "hex": "#76ee00",
                 "rgb": "118,238,0",
                 "hsv": "90.3,1.0000,0.9333",
                 "cmyk": "0.5042,0.0000,1.0000,0.0667"
             },
             {
                 "name": "chartreuse3",
                 "hex": "#66cd00",
                 "rgb": "102,205,0",
                 "hsv": "90.1,1.0000,0.8039",
                 "cmyk": "0.5024,0.0000,1.0000,0.1961"
             },
             {
                 "name": "chartreuse4",
                 "hex": "#458b00",
                 "rgb": "69,139,0",
                 "hsv": "90.2,1.0000,0.5451",
                 "cmyk": "0.5036,0.0000,1.0000,0.4549"
             },
             {
                 "name": "chocolate",
                 "hex": "#d2691e",
                 "rgb": "210,105,30",
                 "hsv": "25.0,0.8571,0.8235",
                 "cmyk": "0.0000,0.5000,0.8571,0.1765"
             },
             {
                 "name": "chocolate1",
                 "hex": "#ff7f24",
                 "rgb": "255,127,36",
                 "hsv": "24.9,0.8588,1.0000",
                 "cmyk": "0.0000,0.5020,0.8588,0.0000"
             },
             {
                 "name": "chocolate2",
                 "hex": "#ee7621",
                 "rgb": "238,118,33",
                 "hsv": "24.9,0.8613,0.9333",
                 "cmyk": "0.0000,0.5042,0.8613,0.0667"
             },
             {
                 "name": "chocolate3",
                 "hex": "#cd661d",
                 "rgb": "205,102,29",
                 "hsv": "24.9,0.8585,0.8039",
                 "cmyk": "0.0000,0.5024,0.8585,0.1961"
             },
             {
                 "name": "coral",
                 "hex": "#ff7f50",
                 "rgb": "255,127,80",
                 "hsv": "16.1,0.6863,1.0000",
                 "cmyk": "0.0000,0.5020,0.6863,0.0000"
             },
             {
                 "name": "coral1",
                 "hex": "#ff7256",
                 "rgb": "255,114,86",
                 "hsv": "9.9,0.6627,1.0000",
                 "cmyk": "0.0000,0.5529,0.6627,0.0000"
             },
             {
                 "name": "coral2",
                 "hex": "#ee6a50",
                 "rgb": "238,106,80",
                 "hsv": "9.9,0.6639,0.9333",
                 "cmyk": "0.0000,0.5546,0.6639,0.0667"
             },
             {
                 "name": "coral3",
                 "hex": "#cd5b45",
                 "rgb": "205,91,69",
                 "hsv": "9.7,0.6634,0.8039",
                 "cmyk": "0.0000,0.5561,0.6634,0.1961"
             },
             {
                 "name": "coral4",
                 "hex": "#8b3e2f",
                 "rgb": "139,62,47",
                 "hsv": "9.8,0.6619,0.5451",
                 "cmyk": "0.0000,0.5540,0.6619,0.4549"
             },
             {
                 "name": "CornflowerBlue",
                 "hex": "#6495ed",
                 "rgb": "100,149,237",
                 "hsv": "218.5,0.5781,0.9294",
                 "cmyk": "0.5781,0.3713,0.0000,0.0706"
             },
             {
                 "name": "cornsilk1",
                 "hex": "#fff8dc",
                 "rgb": "255,248,220",
                 "hsv": "48.0,0.1373,1.0000",
                 "cmyk": "0.0000,0.0275,0.1373,0.0000"
             },
             {
                 "name": "cornsilk2",
                 "hex": "#eee8cd",
                 "rgb": "238,232,205",
                 "hsv": "49.1,0.1387,0.9333",
                 "cmyk": "0.0000,0.0252,0.1387,0.0667"
             },
             {
                 "name": "cornsilk3",
                 "hex": "#cdc8b1",
                 "rgb": "205,200,177",
                 "hsv": "49.3,0.1366,0.8039",
                 "cmyk": "0.0000,0.0244,0.1366,0.1961"
             },
             {
                 "name": "cornsilk4",
                 "hex": "#8b8878",
                 "rgb": "139,136,120",
                 "hsv": "50.5,0.1367,0.5451",
                 "cmyk": "0.0000,0.0216,0.1367,0.4549"
             },
             {
                 "name": "cyan1",
                 "hex": "#00ffff",
                 "rgb": "0,255,255",
                 "hsv": "180.0,1.0000,1.0000",
                 "cmyk": "1.0000,0.0000,0.0000,0.0000"
             },
             {
                 "name": "cyan2",
                 "hex": "#00eeee",
                 "rgb": "0,238,238",
                 "hsv": "180.0,1.0000,0.9333",
                 "cmyk": "1.0000,0.0000,0.0000,0.0667"
             },
             {
                 "name": "cyan3",
                 "hex": "#00cdcd",
                 "rgb": "0,205,205",
                 "hsv": "180.0,1.0000,0.8039",
                 "cmyk": "1.0000,0.0000,0.0000,0.1961"
             },
             {
                 "name": "cyan4",
                 "hex": "#008b8b",
                 "rgb": "0,139,139",
                 "hsv": "180.0,1.0000,0.5451",
                 "cmyk": "1.0000,0.0000,0.0000,0.4549"
             },
             {
                 "name": "DarkGoldenrod",
                 "hex": "#b8860b",
                 "rgb": "184,134,11",
                 "hsv": "42.7,0.9402,0.7216",
                 "cmyk": "0.0000,0.2717,0.9402,0.2784"
             },
             {
                 "name": "DarkGoldenrod1",
                 "hex": "#ffb90f",
                 "rgb": "255,185,15",
                 "hsv": "42.5,0.9412,1.0000",
                 "cmyk": "0.0000,0.2745,0.9412,0.0000"
             },
             {
                 "name": "DarkGoldenrod2",
                 "hex": "#eead0e",
                 "rgb": "238,173,14",
                 "hsv": "42.6,0.9412,0.9333",
                 "cmyk": "0.0000,0.2731,0.9412,0.0667"
             },
             {
                 "name": "DarkGoldenrod3",
                 "hex": "#cd950c",
                 "rgb": "205,149,12",
                 "hsv": "42.6,0.9415,0.8039",
                 "cmyk": "0.0000,0.2732,0.9415,0.1961"
             },
             {
                 "name": "DarkGoldenrod4",
                 "hex": "#8b6508",
                 "rgb": "139,101,8",
                 "hsv": "42.6,0.9424,0.5451",
                 "cmyk": "0.0000,0.2734,0.9424,0.4549"
             },
             {
                 "name": "DarkGreen",
                 "hex": "#006400",
                 "rgb": "0,100,0",
                 "hsv": "120.0,1.0000,0.3922",
                 "cmyk": "1.0000,0.0000,1.0000,0.6078"
             },
             {
                 "name": "DarkKhaki",
                 "hex": "#bdb76b",
                 "rgb": "189,183,107",
                 "hsv": "55.6,0.4339,0.7412",
                 "cmyk": "0.0000,0.0317,0.4339,0.2588"
             },
             {
                 "name": "DarkOliveGreen",
                 "hex": "#556b2f",
                 "rgb": "85,107,47",
                 "hsv": "82.0,0.5607,0.4196",
                 "cmyk": "0.2056,0.0000,0.5607,0.5804"
             },
             {
                 "name": "DarkOliveGreen1",
                 "hex": "#caff70",
                 "rgb": "202,255,112",
                 "hsv": "82.2,0.5608,1.0000",
                 "cmyk": "0.2078,0.0000,0.5608,0.0000"
             },
             {
                 "name": "DarkOliveGreen2",
                 "hex": "#bcee68",
                 "rgb": "188,238,104",
                 "hsv": "82.4,0.5630,0.9333",
                 "cmyk": "0.2101,0.0000,0.5630,0.0667"
             },
             {
                 "name": "DarkOliveGreen3",
                 "hex": "#a2cd5a",
                 "rgb": "162,205,90",
                 "hsv": "82.4,0.5610,0.8039",
                 "cmyk": "0.2098,0.0000,0.5610,0.1961"
             },
             {
                 "name": "DarkOliveGreen4",
                 "hex": "#6e8b3d",
                 "rgb": "110,139,61",
                 "hsv": "82.3,0.5612,0.5451",
                 "cmyk": "0.2086,0.0000,0.5612,0.4549"
             },
             {
                 "name": "DarkOrange",
                 "hex": "#ff8c00",
                 "rgb": "255,140,0",
                 "hsv": "32.9,1.0000,1.0000",
                 "cmyk": "0.0000,0.4510,1.0000,0.0000"
             },
             {
                 "name": "DarkOrange1",
                 "hex": "#ff7f00",
                 "rgb": "255,127,0",
                 "hsv": "29.9,1.0000,1.0000",
                 "cmyk": "0.0000,0.5020,1.0000,0.0000"
             },
             {
                 "name": "DarkOrange2",
                 "hex": "#ee7600",
                 "rgb": "238,118,0",
                 "hsv": "29.7,1.0000,0.9333",
                 "cmyk": "0.0000,0.5042,1.0000,0.0667"
             },
             {
                 "name": "DarkOrange3",
                 "hex": "#cd6600",
                 "rgb": "205,102,0",
                 "hsv": "29.9,1.0000,0.8039",
                 "cmyk": "0.0000,0.5024,1.0000,0.1961"
             },
             {
                 "name": "DarkOrange4",
                 "hex": "#8b4500",
                 "rgb": "139,69,0",
                 "hsv": "29.8,1.0000,0.5451",
                 "cmyk": "0.0000,0.5036,1.0000,0.4549"
             },
             {
                 "name": "DarkOrchid",
                 "hex": "#9932cc",
                 "rgb": "153,50,204",
                 "hsv": "280.1,0.7549,0.8000",
                 "cmyk": "0.2500,0.7549,0.0000,0.2000"
             },
             {
                 "name": "DarkOrchid1",
                 "hex": "#bf3eff",
                 "rgb": "191,62,255",
                 "hsv": "280.1,0.7569,1.0000",
                 "cmyk": "0.2510,0.7569,0.0000,0.0000"
             },
             {
                 "name": "DarkOrchid2",
                 "hex": "#b23aee",
                 "rgb": "178,58,238",
                 "hsv": "280.0,0.7563,0.9333",
                 "cmyk": "0.2521,0.7563,0.0000,0.0667"
             },
             {
                 "name": "DarkOrchid3",
                 "hex": "#9a32cd",
                 "rgb": "154,50,205",
                 "hsv": "280.3,0.7561,0.8039",
                 "cmyk": "0.2488,0.7561,0.0000,0.1961"
             },
             {
                 "name": "DarkOrchid4",
                 "hex": "#68228b",
                 "rgb": "104,34,139",
                 "hsv": "280.0,0.7554,0.5451",
                 "cmyk": "0.2518,0.7554,0.0000,0.4549"
             },
             {
                 "name": "DarkSalmon",
                 "hex": "#e9967a",
                 "rgb": "233,150,122",
                 "hsv": "15.1,0.4764,0.9137",
                 "cmyk": "0.0000,0.3562,0.4764,0.0863"
             },
             {
                 "name": "DarkSeaGreen",
                 "hex": "#8fbc8f",
                 "rgb": "143,188,143",
                 "hsv": "120.0,0.2394,0.7373",
                 "cmyk": "0.2394,0.0000,0.2394,0.2627"
             },
             {
                 "name": "DarkSeaGreen1",
                 "hex": "#c1ffc1",
                 "rgb": "193,255,193",
                 "hsv": "120.0,0.2431,1.0000",
                 "cmyk": "0.2431,0.0000,0.2431,0.0000"
             },
             {
                 "name": "DarkSeaGreen2",
                 "hex": "#b4eeb4",
                 "rgb": "180,238,180",
                 "hsv": "120.0,0.2437,0.9333",
                 "cmyk": "0.2437,0.0000,0.2437,0.0667"
             },
             {
                 "name": "DarkSeaGreen3",
                 "hex": "#9bcd9b",
                 "rgb": "155,205,155",
                 "hsv": "120.0,0.2439,0.8039",
                 "cmyk": "0.2439,0.0000,0.2439,0.1961"
             },
             {
                 "name": "DarkSeaGreen4",
                 "hex": "#698b69",
                 "rgb": "105,139,105",
                 "hsv": "120.0,0.2446,0.5451",
                 "cmyk": "0.2446,0.0000,0.2446,0.4549"
             },
             {
                 "name": "DarkSlateBlue",
                 "hex": "#483d8b",
                 "rgb": "72,61,139",
                 "hsv": "248.5,0.5612,0.5451",
                 "cmyk": "0.4820,0.5612,0.0000,0.4549"
             },
             {
                 "name": "DarkSlateGray",
                 "hex": "#2f4f4f",
                 "rgb": "47,79,79",
                 "hsv": "180.0,0.4051,0.3098",
                 "cmyk": "0.4051,0.0000,0.0000,0.6902"
             },
             {
                 "name": "DarkSlateGray1",
                 "hex": "#97ffff",
                 "rgb": "151,255,255",
                 "hsv": "180.0,0.4078,1.0000",
                 "cmyk": "0.4078,0.0000,0.0000,0.0000"
             },
             {
                 "name": "DarkSlateGray2",
                 "hex": "#8deeee",
                 "rgb": "141,238,238",
                 "hsv": "180.0,0.4076,0.9333",
                 "cmyk": "0.4076,0.0000,0.0000,0.0667"
             },
             {
                 "name": "DarkSlateGray3",
                 "hex": "#79cdcd",
                 "rgb": "121,205,205",
                 "hsv": "180.0,0.4098,0.8039",
                 "cmyk": "0.4098,0.0000,0.0000,0.1961"
             },
             {
                 "name": "DarkSlateGray4",
                 "hex": "#528b8b",
                 "rgb": "82,139,139",
                 "hsv": "180.0,0.4101,0.5451",
                 "cmyk": "0.4101,0.0000,0.0000,0.4549"
             },
             {
                 "name": "DarkTurquoise",
                 "hex": "#00ced1",
                 "rgb": "0,206,209",
                 "hsv": "180.9,1.0000,0.8196",
                 "cmyk": "1.0000,0.0144,0.0000,0.1804"
             },
             {
                 "name": "DarkViolet",
                 "hex": "#9400d3",
                 "rgb": "148,0,211",
                 "hsv": "282.1,1.0000,0.8275",
                 "cmyk": "0.2986,1.0000,0.0000,0.1725"
             },
             {
                 "name": "DeepPink1",
                 "hex": "#ff1493",
                 "rgb": "255,20,147",
                 "hsv": "327.6,0.9216,1.0000",
                 "cmyk": "0.0000,0.9216,0.4235,0.0000"
             },
             {
                 "name": "DeepPink2",
                 "hex": "#ee1289",
                 "rgb": "238,18,137",
                 "hsv": "327.5,0.9244,0.9333",
                 "cmyk": "0.0000,0.9244,0.4244,0.0667"
             },
             {
                 "name": "DeepPink3",
                 "hex": "#cd1076",
                 "rgb": "205,16,118",
                 "hsv": "327.6,0.9220,0.8039",
                 "cmyk": "0.0000,0.9220,0.4244,0.1961"
             },
             {
                 "name": "DeepPink4",
                 "hex": "#8b0a50",
                 "rgb": "139,10,80",
                 "hsv": "327.4,0.9281,0.5451",
                 "cmyk": "0.0000,0.9281,0.4245,0.4549"
             },
             {
                 "name": "DeepSkyBlue1",
                 "hex": "#00bfff",
                 "rgb": "0,191,255",
                 "hsv": "195.1,1.0000,1.0000",
                 "cmyk": "1.0000,0.2510,0.0000,0.0000"
             },
             {
                 "name": "DeepSkyBlue2",
                 "hex": "#00b2ee",
                 "rgb": "0,178,238",
                 "hsv": "195.1,1.0000,0.9333",
                 "cmyk": "1.0000,0.2521,0.0000,0.0667"
             },
             {
                 "name": "DeepSkyBlue3",
                 "hex": "#009acd",
                 "rgb": "0,154,205",
                 "hsv": "194.9,1.0000,0.8039",
                 "cmyk": "1.0000,0.2488,0.0000,0.1961"
             },
             {
                 "name": "DeepSkyBlue4",
                 "hex": "#00688b",
                 "rgb": "0,104,139",
                 "hsv": "195.1,1.0000,0.5451",
                 "cmyk": "1.0000,0.2518,0.0000,0.4549"
             },
             {
                 "name": "DimGray",
                 "hex": "#696969",
                 "rgb": "105,105,105",
                 "hsv": "0,0,0.4118",
                 "cmyk": "0.0000,0.0000,0.0000,0.5882"
             },
             {
                 "name": "DodgerBlue1",
                 "hex": "#1e90ff",
                 "rgb": "30,144,255",
                 "hsv": "209.6,0.8824,1.0000",
                 "cmyk": "0.8824,0.4353,0.0000,0.0000"
             },
             {
                 "name": "DodgerBlue2",
                 "hex": "#1c86ee",
                 "rgb": "28,134,238",
                 "hsv": "209.7,0.8824,0.9333",
                 "cmyk": "0.8824,0.4370,0.0000,0.0667"
             },
             {
                 "name": "DodgerBlue3",
                 "hex": "#1874cd",
                 "rgb": "24,116,205",
                 "hsv": "209.5,0.8829,0.8039",
                 "cmyk": "0.8829,0.4341,0.0000,0.1961"
             },
             {
                 "name": "DodgerBlue4",
                 "hex": "#104e8b",
                 "rgb": "16,78,139",
                 "hsv": "209.8,0.8849,0.5451",
                 "cmyk": "0.8849,0.4388,0.0000,0.4549"
             },
             {
                 "name": "firebrick",
                 "hex": "#b22222",
                 "rgb": "178,34,34",
                 "hsv": "0.0,0.8090,0.6980",
                 "cmyk": "0.0000,0.8090,0.8090,0.3020"
             },
             {
                 "name": "firebrick1",
                 "hex": "#ff3030",
                 "rgb": "255,48,48",
                 "hsv": "0.0,0.8118,1.0000",
                 "cmyk": "0.0000,0.8118,0.8118,0.0000"
             },
             {
                 "name": "firebrick2",
                 "hex": "#ee2c2c",
                 "rgb": "238,44,44",
                 "hsv": "0.0,0.8151,0.9333",
                 "cmyk": "0.0000,0.8151,0.8151,0.0667"
             },
             {
                 "name": "firebrick3",
                 "hex": "#cd2626",
                 "rgb": "205,38,38",
                 "hsv": "0.0,0.8146,0.8039",
                 "cmyk": "0.0000,0.8146,0.8146,0.1961"
             },
             {
                 "name": "firebrick4",
                 "hex": "#8b1a1a",
                 "rgb": "139,26,26",
                 "hsv": "0.0,0.8129,0.5451",
                 "cmyk": "0.0000,0.8129,0.8129,0.4549"
             },
             {
                 "name": "FloralWhite",
                 "hex": "#fffaf0",
                 "rgb": "255,250,240",
                 "hsv": "40.0,0.0588,1.0000",
                 "cmyk": "0.0000,0.0196,0.0588,0.0000"
             },
             {
                 "name": "ForestGreen",
                 "hex": "#228b22",
                 "rgb": "34,139,34",
                 "hsv": "120.0,0.7554,0.5451",
                 "cmyk": "0.7554,0.0000,0.7554,0.4549"
             },
             {
                 "name": "gainsboro",
                 "hex": "#dcdcdc",
                 "rgb": "220,220,220",
                 "hsv": "0,0,0.8627",
                 "cmyk": "0.0000,0.0000,0.0000,0.1373"
             },
             {
                 "name": "GhostWhite",
                 "hex": "#f8f8ff",
                 "rgb": "248,248,255",
                 "hsv": "240.0,0.0275,1.0000",
                 "cmyk": "0.0275,0.0275,0.0000,0.0000"
             },
             {
                 "name": "gold1",
                 "hex": "#ffd700",
                 "rgb": "255,215,0",
                 "hsv": "50.6,1.0000,1.0000",
                 "cmyk": "0.0000,0.1569,1.0000,0.0000"
             },
             {
                 "name": "gold2",
                 "hex": "#eec900",
                 "rgb": "238,201,0",
                 "hsv": "50.7,1.0000,0.9333",
                 "cmyk": "0.0000,0.1555,1.0000,0.0667"
             },
             {
                 "name": "gold3",
                 "hex": "#cdad00",
                 "rgb": "205,173,0",
                 "hsv": "50.6,1.0000,0.8039",
                 "cmyk": "0.0000,0.1561,1.0000,0.1961"
             },
             {
                 "name": "gold4",
                 "hex": "#8b7500",
                 "rgb": "139,117,0",
                 "hsv": "50.5,1.0000,0.5451",
                 "cmyk": "0.0000,0.1583,1.0000,0.4549"
             },
             {
                 "name": "goldenrod",
                 "hex": "#daa520",
                 "rgb": "218,165,32",
                 "hsv": "42.9,0.8532,0.8549",
                 "cmyk": "0.0000,0.2431,0.8532,0.1451"
             },
             {
                 "name": "goldenrod1",
                 "hex": "#ffc125",
                 "rgb": "255,193,37",
                 "hsv": "42.9,0.8549,1.0000",
                 "cmyk": "0.0000,0.2431,0.8549,0.0000"
             },
             {
                 "name": "goldenrod2",
                 "hex": "#eeb422",
                 "rgb": "238,180,34",
                 "hsv": "42.9,0.8571,0.9333",
                 "cmyk": "0.0000,0.2437,0.8571,0.0667"
             },
             {
                 "name": "goldenrod3",
                 "hex": "#cd9b1d",
                 "rgb": "205,155,29",
                 "hsv": "43.0,0.8585,0.8039",
                 "cmyk": "0.0000,0.2439,0.8585,0.1961"
             },
             {
                 "name": "goldenrod4",
                 "hex": "#8b6914",
                 "rgb": "139,105,20",
                 "hsv": "42.9,0.8561,0.5451",
                 "cmyk": "0.0000,0.2446,0.8561,0.4549"
             },
             {
                 "name": "gray",
                 "hex": "#bebebe",
                 "rgb": "190,190,190",
                 "hsv": "0,0,0.7451",
                 "cmyk": "0.0000,0.0000,0.0000,0.2549"
             },
             {
                 "name": "gray1",
                 "hex": "#030303",
                 "rgb": "3,3,3",
                 "hsv": "0,0,0.0118",
                 "cmyk": "0.0000,0.0000,0.0000,0.9882"
             },
             {
                 "name": "gray10",
                 "hex": "#1a1a1a",
                 "rgb": "26,26,26",
                 "hsv": "0,0,0.1020",
                 "cmyk": "0.0000,0.0000,0.0000,0.8980"
             },
             {
                 "name": "gray11",
                 "hex": "#1c1c1c",
                 "rgb": "28,28,28",
                 "hsv": "0,0,0.1098",
                 "cmyk": "0.0000,0.0000,0.0000,0.8902"
             },
             {
                 "name": "gray12",
                 "hex": "#1f1f1f",
                 "rgb": "31,31,31",
                 "hsv": "0,0,0.1216",
                 "cmyk": "0.0000,0.0000,0.0000,0.8784"
             },
             {
                 "name": "gray13",
                 "hex": "#212121",
                 "rgb": "33,33,33",
                 "hsv": "0,0,0.1294",
                 "cmyk": "0.0000,0.0000,0.0000,0.8706"
             },
             {
                 "name": "gray14",
                 "hex": "#242424",
                 "rgb": "36,36,36",
                 "hsv": "0,0,0.1412",
                 "cmyk": "0.0000,0.0000,0.0000,0.8588"
             },
             {
                 "name": "gray15",
                 "hex": "#262626",
                 "rgb": "38,38,38",
                 "hsv": "0,0,0.1490",
                 "cmyk": "0.0000,0.0000,0.0000,0.8510"
             },
             {
                 "name": "gray16",
                 "hex": "#292929",
                 "rgb": "41,41,41",
                 "hsv": "0,0,0.1608",
                 "cmyk": "0.0000,0.0000,0.0000,0.8392"
             },
             {
                 "name": "gray17",
                 "hex": "#2b2b2b",
                 "rgb": "43,43,43",
                 "hsv": "0,0,0.1686",
                 "cmyk": "0.0000,0.0000,0.0000,0.8314"
             },
             {
                 "name": "gray18",
                 "hex": "#2e2e2e",
                 "rgb": "46,46,46",
                 "hsv": "0,0,0.1804",
                 "cmyk": "0.0000,0.0000,0.0000,0.8196"
             },
             {
                 "name": "gray19",
                 "hex": "#303030",
                 "rgb": "48,48,48",
                 "hsv": "0,0,0.1882",
                 "cmyk": "0.0000,0.0000,0.0000,0.8118"
             },
             {
                 "name": "gray2",
                 "hex": "#050505",
                 "rgb": "5,5,5",
                 "hsv": "0,0,0.0196",
                 "cmyk": "0.0000,0.0000,0.0000,0.9804"
             },
             {
                 "name": "gray20",
                 "hex": "#333333",
                 "rgb": "51,51,51",
                 "hsv": "0,0,0.2000",
                 "cmyk": "0.0000,0.0000,0.0000,0.8000"
             },
             {
                 "name": "gray21",
                 "hex": "#363636",
                 "rgb": "54,54,54",
                 "hsv": "0,0,0.2118",
                 "cmyk": "0.0000,0.0000,0.0000,0.7882"
             },
             {
                 "name": "gray22",
                 "hex": "#383838",
                 "rgb": "56,56,56",
                 "hsv": "0,0,0.2196",
                 "cmyk": "0.0000,0.0000,0.0000,0.7804"
             },
             {
                 "name": "gray23",
                 "hex": "#3b3b3b",
                 "rgb": "59,59,59",
                 "hsv": "0,0,0.2314",
                 "cmyk": "0.0000,0.0000,0.0000,0.7686"
             },
             {
                 "name": "gray24",
                 "hex": "#3d3d3d",
                 "rgb": "61,61,61",
                 "hsv": "0,0,0.2392",
                 "cmyk": "0.0000,0.0000,0.0000,0.7608"
             },
             {
                 "name": "gray25",
                 "hex": "#404040",
                 "rgb": "64,64,64",
                 "hsv": "0,0,0.2510",
                 "cmyk": "0.0000,0.0000,0.0000,0.7490"
             },
             {
                 "name": "gray26",
                 "hex": "#424242",
                 "rgb": "66,66,66",
                 "hsv": "0,0,0.2588",
                 "cmyk": "0.0000,0.0000,0.0000,0.7412"
             },
             {
                 "name": "gray27",
                 "hex": "#454545",
                 "rgb": "69,69,69",
                 "hsv": "0,0,0.2706",
                 "cmyk": "0.0000,0.0000,0.0000,0.7294"
             },
             {
                 "name": "gray28",
                 "hex": "#474747",
                 "rgb": "71,71,71",
                 "hsv": "0,0,0.2784",
                 "cmyk": "0.0000,0.0000,0.0000,0.7216"
             },
             {
                 "name": "gray29",
                 "hex": "#4a4a4a",
                 "rgb": "74,74,74",
                 "hsv": "0,0,0.2902",
                 "cmyk": "0.0000,0.0000,0.0000,0.7098"
             },
             {
                 "name": "gray3",
                 "hex": "#080808",
                 "rgb": "8,8,8",
                 "hsv": "0,0,0.0314",
                 "cmyk": "0.0000,0.0000,0.0000,0.9686"
             },
             {
                 "name": "gray30",
                 "hex": "#4d4d4d",
                 "rgb": "77,77,77",
                 "hsv": "0,0,0.3020",
                 "cmyk": "0.0000,0.0000,0.0000,0.6980"
             },
             {
                 "name": "gray31",
                 "hex": "#4f4f4f",
                 "rgb": "79,79,79",
                 "hsv": "0,0,0.3098",
                 "cmyk": "0.0000,0.0000,0.0000,0.6902"
             },
             {
                 "name": "gray32",
                 "hex": "#525252",
                 "rgb": "82,82,82",
                 "hsv": "0,0,0.3216",
                 "cmyk": "0.0000,0.0000,0.0000,0.6784"
             },
             {
                 "name": "gray33",
                 "hex": "#545454",
                 "rgb": "84,84,84",
                 "hsv": "0,0,0.3294",
                 "cmyk": "0.0000,0.0000,0.0000,0.6706"
             },
             {
                 "name": "gray34",
                 "hex": "#575757",
                 "rgb": "87,87,87",
                 "hsv": "0,0,0.3412",
                 "cmyk": "0.0000,0.0000,0.0000,0.6588"
             },
             {
                 "name": "gray35",
                 "hex": "#595959",
                 "rgb": "89,89,89",
                 "hsv": "0,0,0.3490",
                 "cmyk": "0.0000,0.0000,0.0000,0.6510"
             },
             {
                 "name": "gray36",
                 "hex": "#5c5c5c",
                 "rgb": "92,92,92",
                 "hsv": "0,0,0.3608",
                 "cmyk": "0.0000,0.0000,0.0000,0.6392"
             },
             {
                 "name": "gray37",
                 "hex": "#5e5e5e",
                 "rgb": "94,94,94",
                 "hsv": "0,0,0.3686",
                 "cmyk": "0.0000,0.0000,0.0000,0.6314"
             },
             {
                 "name": "gray38",
                 "hex": "#616161",
                 "rgb": "97,97,97",
                 "hsv": "0,0,0.3804",
                 "cmyk": "0.0000,0.0000,0.0000,0.6196"
             },
             {
                 "name": "gray39",
                 "hex": "#636363",
                 "rgb": "99,99,99",
                 "hsv": "0,0,0.3882",
                 "cmyk": "0.0000,0.0000,0.0000,0.6118"
             },
             {
                 "name": "gray4",
                 "hex": "#0a0a0a",
                 "rgb": "10,10,10",
                 "hsv": "0,0,0.0392",
                 "cmyk": "0.0000,0.0000,0.0000,0.9608"
             },
             {
                 "name": "gray40",
                 "hex": "#666666",
                 "rgb": "102,102,102",
                 "hsv": "0,0,0.4000",
                 "cmyk": "0.0000,0.0000,0.0000,0.6000"
             },
             {
                 "name": "gray41",
                 "hex": "#696969",
                 "rgb": "105,105,105",
                 "hsv": "0,0,0.4118",
                 "cmyk": "0.0000,0.0000,0.0000,0.5882"
             },
             {
                 "name": "gray42",
                 "hex": "#6b6b6b",
                 "rgb": "107,107,107",
                 "hsv": "0,0,0.4196",
                 "cmyk": "0.0000,0.0000,0.0000,0.5804"
             },
             {
                 "name": "gray43",
                 "hex": "#6e6e6e",
                 "rgb": "110,110,110",
                 "hsv": "0,0,0.4314",
                 "cmyk": "0.0000,0.0000,0.0000,0.5686"
             },
             {
                 "name": "gray44",
                 "hex": "#707070",
                 "rgb": "112,112,112",
                 "hsv": "0,0,0.4392",
                 "cmyk": "0.0000,0.0000,0.0000,0.5608"
             },
             {
                 "name": "gray45",
                 "hex": "#737373",
                 "rgb": "115,115,115",
                 "hsv": "0,0,0.4510",
                 "cmyk": "0.0000,0.0000,0.0000,0.5490"
             },
             {
                 "name": "gray46",
                 "hex": "#757575",
                 "rgb": "117,117,117",
                 "hsv": "0,0,0.4588",
                 "cmyk": "0.0000,0.0000,0.0000,0.5412"
             },
             {
                 "name": "gray47",
                 "hex": "#787878",
                 "rgb": "120,120,120",
                 "hsv": "0,0,0.4706",
                 "cmyk": "0.0000,0.0000,0.0000,0.5294"
             },
             {
                 "name": "gray48",
                 "hex": "#7a7a7a",
                 "rgb": "122,122,122",
                 "hsv": "0,0,0.4784",
                 "cmyk": "0.0000,0.0000,0.0000,0.5216"
             },
             {
                 "name": "gray49",
                 "hex": "#7d7d7d",
                 "rgb": "125,125,125",
                 "hsv": "0,0,0.4902",
                 "cmyk": "0.0000,0.0000,0.0000,0.5098"
             },
             {
                 "name": "gray5",
                 "hex": "#0d0d0d",
                 "rgb": "13,13,13",
                 "hsv": "0,0,0.0510",
                 "cmyk": "0.0000,0.0000,0.0000,0.9490"
             },
             {
                 "name": "gray50",
                 "hex": "#7f7f7f",
                 "rgb": "127,127,127",
                 "hsv": "0,0,0.4980",
                 "cmyk": "0.0000,0.0000,0.0000,0.5020"
             },
             {
                 "name": "gray51",
                 "hex": "#828282",
                 "rgb": "130,130,130",
                 "hsv": "0,0,0.5098",
                 "cmyk": "0.0000,0.0000,0.0000,0.4902"
             },
             {
                 "name": "gray52",
                 "hex": "#858585",
                 "rgb": "133,133,133",
                 "hsv": "0,0,0.5216",
                 "cmyk": "0.0000,0.0000,0.0000,0.4784"
             },
             {
                 "name": "gray53",
                 "hex": "#878787",
                 "rgb": "135,135,135",
                 "hsv": "0,0,0.5294",
                 "cmyk": "0.0000,0.0000,0.0000,0.4706"
             },
             {
                 "name": "gray54",
                 "hex": "#8a8a8a",
                 "rgb": "138,138,138",
                 "hsv": "0,0,0.5412",
                 "cmyk": "0.0000,0.0000,0.0000,0.4588"
             },
             {
                 "name": "gray55",
                 "hex": "#8c8c8c",
                 "rgb": "140,140,140",
                 "hsv": "0,0,0.5490",
                 "cmyk": "0.0000,0.0000,0.0000,0.4510"
             },
             {
                 "name": "gray56",
                 "hex": "#8f8f8f",
                 "rgb": "143,143,143",
                 "hsv": "0,0,0.5608",
                 "cmyk": "0.0000,0.0000,0.0000,0.4392"
             },
             {
                 "name": "gray57",
                 "hex": "#919191",
                 "rgb": "145,145,145",
                 "hsv": "0,0,0.5686",
                 "cmyk": "0.0000,0.0000,0.0000,0.4314"
             },
             {
                 "name": "gray58",
                 "hex": "#949494",
                 "rgb": "148,148,148",
                 "hsv": "0,0,0.5804",
                 "cmyk": "0.0000,0.0000,0.0000,0.4196"
             },
             {
                 "name": "gray59",
                 "hex": "#969696",
                 "rgb": "150,150,150",
                 "hsv": "0,0,0.5882",
                 "cmyk": "0.0000,0.0000,0.0000,0.4118"
             },
             {
                 "name": "gray6",
                 "hex": "#0f0f0f",
                 "rgb": "15,15,15",
                 "hsv": "0,0,0.0588",
                 "cmyk": "0.0000,0.0000,0.0000,0.9412"
             },
             {
                 "name": "gray60",
                 "hex": "#999999",
                 "rgb": "153,153,153",
                 "hsv": "0,0,0.6000",
                 "cmyk": "0.0000,0.0000,0.0000,0.4000"
             },
             {
                 "name": "gray61",
                 "hex": "#9c9c9c",
                 "rgb": "156,156,156",
                 "hsv": "0,0,0.6118",
                 "cmyk": "0.0000,0.0000,0.0000,0.3882"
             },
             {
                 "name": "gray62",
                 "hex": "#9e9e9e",
                 "rgb": "158,158,158",
                 "hsv": "0,0,0.6196",
                 "cmyk": "0.0000,0.0000,0.0000,0.3804"
             },
             {
                 "name": "gray63",
                 "hex": "#a1a1a1",
                 "rgb": "161,161,161",
                 "hsv": "0,0,0.6314",
                 "cmyk": "0.0000,0.0000,0.0000,0.3686"
             },
             {
                 "name": "gray64",
                 "hex": "#a3a3a3",
                 "rgb": "163,163,163",
                 "hsv": "0,0,0.6392",
                 "cmyk": "0.0000,0.0000,0.0000,0.3608"
             },
             {
                 "name": "gray65",
                 "hex": "#a6a6a6",
                 "rgb": "166,166,166",
                 "hsv": "0,0,0.6510",
                 "cmyk": "0.0000,0.0000,0.0000,0.3490"
             },
             {
                 "name": "gray66",
                 "hex": "#a8a8a8",
                 "rgb": "168,168,168",
                 "hsv": "0,0,0.6588",
                 "cmyk": "0.0000,0.0000,0.0000,0.3412"
             },
             {
                 "name": "gray67",
                 "hex": "#ababab",
                 "rgb": "171,171,171",
                 "hsv": "0,0,0.6706",
                 "cmyk": "0.0000,0.0000,0.0000,0.3294"
             },
             {
                 "name": "gray68",
                 "hex": "#adadad",
                 "rgb": "173,173,173",
                 "hsv": "0,0,0.6784",
                 "cmyk": "0.0000,0.0000,0.0000,0.3216"
             },
             {
                 "name": "gray69",
                 "hex": "#b0b0b0",
                 "rgb": "176,176,176",
                 "hsv": "0,0,0.6902",
                 "cmyk": "0.0000,0.0000,0.0000,0.3098"
             },
             {
                 "name": "gray7",
                 "hex": "#121212",
                 "rgb": "18,18,18",
                 "hsv": "0,0,0.0706",
                 "cmyk": "0.0000,0.0000,0.0000,0.9294"
             },
             {
                 "name": "gray70",
                 "hex": "#b3b3b3",
                 "rgb": "179,179,179",
                 "hsv": "0,0,0.7020",
                 "cmyk": "0.0000,0.0000,0.0000,0.2980"
             },
             {
                 "name": "gray71",
                 "hex": "#b5b5b5",
                 "rgb": "181,181,181",
                 "hsv": "0,0,0.7098",
                 "cmyk": "0.0000,0.0000,0.0000,0.2902"
             },
             {
                 "name": "gray72",
                 "hex": "#b8b8b8",
                 "rgb": "184,184,184",
                 "hsv": "0,0,0.7216",
                 "cmyk": "0.0000,0.0000,0.0000,0.2784"
             },
             {
                 "name": "gray73",
                 "hex": "#bababa",
                 "rgb": "186,186,186",
                 "hsv": "0,0,0.7294",
                 "cmyk": "0.0000,0.0000,0.0000,0.2706"
             },
             {
                 "name": "gray74",
                 "hex": "#bdbdbd",
                 "rgb": "189,189,189",
                 "hsv": "0,0,0.7412",
                 "cmyk": "0.0000,0.0000,0.0000,0.2588"
             },
             {
                 "name": "gray75",
                 "hex": "#bfbfbf",
                 "rgb": "191,191,191",
                 "hsv": "0,0,0.7490",
                 "cmyk": "0.0000,0.0000,0.0000,0.2510"
             },
             {
                 "name": "gray76",
                 "hex": "#c2c2c2",
                 "rgb": "194,194,194",
                 "hsv": "0,0,0.7608",
                 "cmyk": "0.0000,0.0000,0.0000,0.2392"
             },
             {
                 "name": "gray77",
                 "hex": "#c4c4c4",
                 "rgb": "196,196,196",
                 "hsv": "0,0,0.7686",
                 "cmyk": "0.0000,0.0000,0.0000,0.2314"
             },
             {
                 "name": "gray78",
                 "hex": "#c7c7c7",
                 "rgb": "199,199,199",
                 "hsv": "0,0,0.7804",
                 "cmyk": "0.0000,0.0000,0.0000,0.2196"
             },
             {
                 "name": "gray79",
                 "hex": "#c9c9c9",
                 "rgb": "201,201,201",
                 "hsv": "0,0,0.7882",
                 "cmyk": "0.0000,0.0000,0.0000,0.2118"
             },
             {
                 "name": "gray8",
                 "hex": "#141414",
                 "rgb": "20,20,20",
                 "hsv": "0,0,0.0784",
                 "cmyk": "0.0000,0.0000,0.0000,0.9216"
             },
             {
                 "name": "gray80",
                 "hex": "#cccccc",
                 "rgb": "204,204,204",
                 "hsv": "0,0,0.8000",
                 "cmyk": "0.0000,0.0000,0.0000,0.2000"
             },
             {
                 "name": "gray81",
                 "hex": "#cfcfcf",
                 "rgb": "207,207,207",
                 "hsv": "0,0,0.8118",
                 "cmyk": "0.0000,0.0000,0.0000,0.1882"
             },
             {
                 "name": "gray82",
                 "hex": "#d1d1d1",
                 "rgb": "209,209,209",
                 "hsv": "0,0,0.8196",
                 "cmyk": "0.0000,0.0000,0.0000,0.1804"
             },
             {
                 "name": "gray83",
                 "hex": "#d4d4d4",
                 "rgb": "212,212,212",
                 "hsv": "0,0,0.8314",
                 "cmyk": "0.0000,0.0000,0.0000,0.1686"
             },
             {
                 "name": "gray84",
                 "hex": "#d6d6d6",
                 "rgb": "214,214,214",
                 "hsv": "0,0,0.8392",
                 "cmyk": "0.0000,0.0000,0.0000,0.1608"
             },
             {
                 "name": "gray85",
                 "hex": "#d9d9d9",
                 "rgb": "217,217,217",
                 "hsv": "0,0,0.8510",
                 "cmyk": "0.0000,0.0000,0.0000,0.1490"
             },
             {
                 "name": "gray86",
                 "hex": "#dbdbdb",
                 "rgb": "219,219,219",
                 "hsv": "0,0,0.8588",
                 "cmyk": "0.0000,0.0000,0.0000,0.1412"
             },
             {
                 "name": "gray87",
                 "hex": "#dedede",
                 "rgb": "222,222,222",
                 "hsv": "0,0,0.8706",
                 "cmyk": "0.0000,0.0000,0.0000,0.1294"
             },
             {
                 "name": "gray88",
                 "hex": "#e0e0e0",
                 "rgb": "224,224,224",
                 "hsv": "0,0,0.8784",
                 "cmyk": "0.0000,0.0000,0.0000,0.1216"
             },
             {
                 "name": "gray89",
                 "hex": "#e3e3e3",
                 "rgb": "227,227,227",
                 "hsv": "0,0,0.8902",
                 "cmyk": "0.0000,0.0000,0.0000,0.1098"
             },
             {
                 "name": "gray9",
                 "hex": "#171717",
                 "rgb": "23,23,23",
                 "hsv": "0,0,0.0902",
                 "cmyk": "0.0000,0.0000,0.0000,0.9098"
             },
             {
                 "name": "gray90",
                 "hex": "#e5e5e5",
                 "rgb": "229,229,229",
                 "hsv": "0,0,0.8980",
                 "cmyk": "0.0000,0.0000,0.0000,0.1020"
             },
             {
                 "name": "gray91",
                 "hex": "#e8e8e8",
                 "rgb": "232,232,232",
                 "hsv": "0,0,0.9098",
                 "cmyk": "0.0000,0.0000,0.0000,0.0902"
             },
             {
                 "name": "gray92",
                 "hex": "#ebebeb",
                 "rgb": "235,235,235",
                 "hsv": "0,0,0.9216",
                 "cmyk": "0.0000,0.0000,0.0000,0.0784"
             },
             {
                 "name": "gray93",
                 "hex": "#ededed",
                 "rgb": "237,237,237",
                 "hsv": "0,0,0.9294",
                 "cmyk": "0.0000,0.0000,0.0000,0.0706"
             },
             {
                 "name": "gray94",
                 "hex": "#f0f0f0",
                 "rgb": "240,240,240",
                 "hsv": "0,0,0.9412",
                 "cmyk": "0.0000,0.0000,0.0000,0.0588"
             },
             {
                 "name": "gray95",
                 "hex": "#f2f2f2",
                 "rgb": "242,242,242",
                 "hsv": "0,0,0.9490",
                 "cmyk": "0.0000,0.0000,0.0000,0.0510"
             },
             {
                 "name": "gray97",
                 "hex": "#f7f7f7",
                 "rgb": "247,247,247",
                 "hsv": "0,0,0.9686",
                 "cmyk": "0.0000,0.0000,0.0000,0.0314"
             },
             {
                 "name": "gray98",
                 "hex": "#fafafa",
                 "rgb": "250,250,250",
                 "hsv": "0,0,0.9804",
                 "cmyk": "0.0000,0.0000,0.0000,0.0196"
             },
             {
                 "name": "gray99",
                 "hex": "#fcfcfc",
                 "rgb": "252,252,252",
                 "hsv": "0,0,0.9882",
                 "cmyk": "0.0000,0.0000,0.0000,0.0118"
             },
             {
                 "name": "green1",
                 "hex": "#00ff00",
                 "rgb": "0,255,0",
                 "hsv": "120.0,1.0000,1.0000",
                 "cmyk": "1.0000,0.0000,1.0000,0.0000"
             },
             {
                 "name": "green2",
                 "hex": "#00ee00",
                 "rgb": "0,238,0",
                 "hsv": "120.0,1.0000,0.9333",
                 "cmyk": "1.0000,0.0000,1.0000,0.0667"
             },
             {
                 "name": "green3",
                 "hex": "#00cd00",
                 "rgb": "0,205,0",
                 "hsv": "120.0,1.0000,0.8039",
                 "cmyk": "1.0000,0.0000,1.0000,0.1961"
             },
             {
                 "name": "green4",
                 "hex": "#008b00",
                 "rgb": "0,139,0",
                 "hsv": "120.0,1.0000,0.5451",
                 "cmyk": "1.0000,0.0000,1.0000,0.4549"
             },
             {
                 "name": "GreenYellow",
                 "hex": "#adff2f",
                 "rgb": "173,255,47",
                 "hsv": "83.7,0.8157,1.0000",
                 "cmyk": "0.3216,0.0000,0.8157,0.0000"
             },
             {
                 "name": "honeydew1",
                 "hex": "#f0fff0",
                 "rgb": "240,255,240",
                 "hsv": "120.0,0.0588,1.0000",
                 "cmyk": "0.0588,0.0000,0.0588,0.0000"
             },
             {
                 "name": "honeydew2",
                 "hex": "#e0eee0",
                 "rgb": "224,238,224",
                 "hsv": "120.0,0.0588,0.9333",
                 "cmyk": "0.0588,0.0000,0.0588,0.0667"
             },
             {
                 "name": "honeydew3",
                 "hex": "#c1cdc1",
                 "rgb": "193,205,193",
                 "hsv": "120.0,0.0585,0.8039",
                 "cmyk": "0.0585,0.0000,0.0585,0.1961"
             },
             {
                 "name": "honeydew4",
                 "hex": "#838b83",
                 "rgb": "131,139,131",
                 "hsv": "120.0,0.0576,0.5451",
                 "cmyk": "0.0576,0.0000,0.0576,0.4549"
             },
             {
                 "name": "HotPink",
                 "hex": "#ff69b4",
                 "rgb": "255,105,180",
                 "hsv": "330.0,0.5882,1.0000",
                 "cmyk": "0.0000,0.5882,0.2941,0.0000"
             },
             {
                 "name": "HotPink1",
                 "hex": "#ff6eb4",
                 "rgb": "255,110,180",
                 "hsv": "331.0,0.5686,1.0000",
                 "cmyk": "0.0000,0.5686,0.2941,0.0000"
             },
             {
                 "name": "HotPink2",
                 "hex": "#ee6aa7",
                 "rgb": "238,106,167",
                 "hsv": "332.3,0.5546,0.9333",
                 "cmyk": "0.0000,0.5546,0.2983,0.0667"
             },
             {
                 "name": "HotPink3",
                 "hex": "#cd6090",
                 "rgb": "205,96,144",
                 "hsv": "333.6,0.5317,0.8039",
                 "cmyk": "0.0000,0.5317,0.2976,0.1961"
             },
             {
                 "name": "HotPink4",
                 "hex": "#8b3a62",
                 "rgb": "139,58,98",
                 "hsv": "330.4,0.5827,0.5451",
                 "cmyk": "0.0000,0.5827,0.2950,0.4549"
             },
             {
                 "name": "IndianRed",
                 "hex": "#cd5c5c",
                 "rgb": "205,92,92",
                 "hsv": "0.0,0.5512,0.8039",
                 "cmyk": "0.0000,0.5512,0.5512,0.1961"
             },
             {
                 "name": "IndianRed1",
                 "hex": "#ff6a6a",
                 "rgb": "255,106,106",
                 "hsv": "0.0,0.5843,1.0000",
                 "cmyk": "0.0000,0.5843,0.5843,0.0000"
             },
             {
                 "name": "IndianRed2",
                 "hex": "#ee6363",
                 "rgb": "238,99,99",
                 "hsv": "0.0,0.5840,0.9333",
                 "cmyk": "0.0000,0.5840,0.5840,0.0667"
             },
             {
                 "name": "IndianRed3",
                 "hex": "#cd5555",
                 "rgb": "205,85,85",
                 "hsv": "0.0,0.5854,0.8039",
                 "cmyk": "0.0000,0.5854,0.5854,0.1961"
             },
             {
                 "name": "IndianRed4",
                 "hex": "#8b3a3a",
                 "rgb": "139,58,58",
                 "hsv": "0.0,0.5827,0.5451",
                 "cmyk": "0.0000,0.5827,0.5827,0.4549"
             },
             {
                 "name": "ivory1",
                 "hex": "#fffff0",
                 "rgb": "255,255,240",
                 "hsv": "60.0,0.0588,1.0000",
                 "cmyk": "0.0000,0.0000,0.0588,0.0000"
             },
             {
                 "name": "ivory2",
                 "hex": "#eeeee0",
                 "rgb": "238,238,224",
                 "hsv": "60.0,0.0588,0.9333",
                 "cmyk": "0.0000,0.0000,0.0588,0.0667"
             },
             {
                 "name": "ivory3",
                 "hex": "#cdcdc1",
                 "rgb": "205,205,193",
                 "hsv": "60.0,0.0585,0.8039",
                 "cmyk": "0.0000,0.0000,0.0585,0.1961"
             },
             {
                 "name": "ivory4",
                 "hex": "#8b8b83",
                 "rgb": "139,139,131",
                 "hsv": "60.0,0.0576,0.5451",
                 "cmyk": "0.0000,0.0000,0.0576,0.4549"
             },
             {
                 "name": "khaki",
                 "hex": "#f0e68c",
                 "rgb": "240,230,140",
                 "hsv": "54.0,0.4167,0.9412",
                 "cmyk": "0.0000,0.0417,0.4167,0.0588"
             },
             {
                 "name": "khaki1",
                 "hex": "#fff68f",
                 "rgb": "255,246,143",
                 "hsv": "55.2,0.4392,1.0000",
                 "cmyk": "0.0000,0.0353,0.4392,0.0000"
             },
             {
                 "name": "khaki2",
                 "hex": "#eee685",
                 "rgb": "238,230,133",
                 "hsv": "55.4,0.4412,0.9333",
                 "cmyk": "0.0000,0.0336,0.4412,0.0667"
             },
             {
                 "name": "khaki3",
                 "hex": "#cdc673",
                 "rgb": "205,198,115",
                 "hsv": "55.3,0.4390,0.8039",
                 "cmyk": "0.0000,0.0341,0.4390,0.1961"
             },
             {
                 "name": "khaki4",
                 "hex": "#8b864e",
                 "rgb": "139,134,78",
                 "hsv": "55.1,0.4388,0.5451",
                 "cmyk": "0.0000,0.0360,0.4388,0.4549"
             },
             {
                 "name": "lavender",
                 "hex": "#e6e6fa",
                 "rgb": "230,230,250",
                 "hsv": "240.0,0.0800,0.9804",
                 "cmyk": "0.0800,0.0800,0.0000,0.0196"
             },
             {
                 "name": "LavenderBlush1",
                 "hex": "#fff0f5",
                 "rgb": "255,240,245",
                 "hsv": "340.0,0.0588,1.0000",
                 "cmyk": "0.0000,0.0588,0.0392,0.0000"
             },
             {
                 "name": "LavenderBlush2",
                 "hex": "#eee0e5",
                 "rgb": "238,224,229",
                 "hsv": "338.6,0.0588,0.9333",
                 "cmyk": "0.0000,0.0588,0.0378,0.0667"
             },
             {
                 "name": "LavenderBlush3",
                 "hex": "#cdc1c5",
                 "rgb": "205,193,197",
                 "hsv": "340.0,0.0585,0.8039",
                 "cmyk": "0.0000,0.0585,0.0390,0.1961"
             },
             {
                 "name": "LavenderBlush4",
                 "hex": "#8b8386",
                 "rgb": "139,131,134",
                 "hsv": "337.5,0.0576,0.5451",
                 "cmyk": "0.0000,0.0576,0.0360,0.4549"
             },
             {
                 "name": "LawnGreen",
                 "hex": "#7cfc00",
                 "rgb": "124,252,0",
                 "hsv": "90.5,1.0000,0.9882",
                 "cmyk": "0.5079,0.0000,1.0000,0.0118"
             },
             {
                 "name": "LemonChiffon1",
                 "hex": "#fffacd",
                 "rgb": "255,250,205",
                 "hsv": "54.0,0.1961,1.0000",
                 "cmyk": "0.0000,0.0196,0.1961,0.0000"
             },
             {
                 "name": "LemonChiffon2",
                 "hex": "#eee9bf",
                 "rgb": "238,233,191",
                 "hsv": "53.6,0.1975,0.9333",
                 "cmyk": "0.0000,0.0210,0.1975,0.0667"
             },
             {
                 "name": "LemonChiffon3",
                 "hex": "#cdc9a5",
                 "rgb": "205,201,165",
                 "hsv": "54.0,0.1951,0.8039",
                 "cmyk": "0.0000,0.0195,0.1951,0.1961"
             },
             {
                 "name": "LemonChiffon4",
                 "hex": "#8b8970",
                 "rgb": "139,137,112",
                 "hsv": "55.6,0.1942,0.5451",
                 "cmyk": "0.0000,0.0144,0.1942,0.4549"
             },
             {
                 "name": "light",
                 "hex": "#eedd82",
                 "rgb": "238,221,130",
                 "hsv": "50.6,0.4538,0.9333",
                 "cmyk": "0.0000,0.0714,0.4538,0.0667"
             },
             {
                 "name": "LightBlue",
                 "hex": "#add8e6",
                 "rgb": "173,216,230",
                 "hsv": "194.7,0.2478,0.9020",
                 "cmyk": "0.2478,0.0609,0.0000,0.0980"
             },
             {
                 "name": "LightBlue1",
                 "hex": "#bfefff",
                 "rgb": "191,239,255",
                 "hsv": "195.0,0.2510,1.0000",
                 "cmyk": "0.2510,0.0627,0.0000,0.0000"
             },
             {
                 "name": "LightBlue2",
                 "hex": "#b2dfee",
                 "rgb": "178,223,238",
                 "hsv": "195.0,0.2521,0.9333",
                 "cmyk": "0.2521,0.0630,0.0000,0.0667"
             },
             {
                 "name": "LightBlue3",
                 "hex": "#9ac0cd",
                 "rgb": "154,192,205",
                 "hsv": "195.3,0.2488,0.8039",
                 "cmyk": "0.2488,0.0634,0.0000,0.1961"
             },
             {
                 "name": "LightBlue4",
                 "hex": "#68838b",
                 "rgb": "104,131,139",
                 "hsv": "193.7,0.2518,0.5451",
                 "cmyk": "0.2518,0.0576,0.0000,0.4549"
             },
             {
                 "name": "LightCoral",
                 "hex": "#f08080",
                 "rgb": "240,128,128",
                 "hsv": "0.0,0.4667,0.9412",
                 "cmyk": "0.0000,0.4667,0.4667,0.0588"
             },
             {
                 "name": "LightCyan1",
                 "hex": "#e0ffff",
                 "rgb": "224,255,255",
                 "hsv": "180.0,0.1216,1.0000",
                 "cmyk": "0.1216,0.0000,0.0000,0.0000"
             },
             {
                 "name": "LightCyan2",
                 "hex": "#d1eeee",
                 "rgb": "209,238,238",
                 "hsv": "180.0,0.1218,0.9333",
                 "cmyk": "0.1218,0.0000,0.0000,0.0667"
             },
             {
                 "name": "LightCyan3",
                 "hex": "#b4cdcd",
                 "rgb": "180,205,205",
                 "hsv": "180.0,0.1220,0.8039",
                 "cmyk": "0.1220,0.0000,0.0000,0.1961"
             },
             {
                 "name": "LightCyan4",
                 "hex": "#7a8b8b",
                 "rgb": "122,139,139",
                 "hsv": "180.0,0.1223,0.5451",
                 "cmyk": "0.1223,0.0000,0.0000,0.4549"
             },
             {
                 "name": "LightGoldenrod1",
                 "hex": "#ffec8b",
                 "rgb": "255,236,139",
                 "hsv": "50.2,0.4549,1.0000",
                 "cmyk": "0.0000,0.0745,0.4549,0.0000"
             },
             {
                 "name": "LightGoldenrod2",
                 "hex": "#eedc82",
                 "rgb": "238,220,130",
                 "hsv": "50.0,0.4538,0.9333",
                 "cmyk": "0.0000,0.0756,0.4538,0.0667"
             },
             {
                 "name": "LightGoldenrod3",
                 "hex": "#cdbe70",
                 "rgb": "205,190,112",
                 "hsv": "50.3,0.4537,0.8039",
                 "cmyk": "0.0000,0.0732,0.4537,0.1961"
             },
             {
                 "name": "LightGoldenrod4",
                 "hex": "#8b814c",
                 "rgb": "139,129,76",
                 "hsv": "50.5,0.4532,0.5451",
                 "cmyk": "0.0000,0.0719,0.4532,0.4549"
             },
             {
                 "name": "LightGoldenrodYellow",
                 "hex": "#fafad2",
                 "rgb": "250,250,210",
                 "hsv": "60.0,0.1600,0.9804",
                 "cmyk": "0.0000,0.0000,0.1600,0.0196"
             },
             {
                 "name": "LightGray",
                 "hex": "#d3d3d3",
                 "rgb": "211,211,211",
                 "hsv": "0,0,0.8275",
                 "cmyk": "0.0000,0.0000,0.0000,0.1725"
             },
             {
                 "name": "LightPink",
                 "hex": "#ffb6c1",
                 "rgb": "255,182,193",
                 "hsv": "351.0,0.2863,1.0000",
                 "cmyk": "0.0000,0.2863,0.2431,0.0000"
             },
             {
                 "name": "LightPink1",
                 "hex": "#ffaeb9",
                 "rgb": "255,174,185",
                 "hsv": "351.9,0.3176,1.0000",
                 "cmyk": "0.0000,0.3176,0.2745,0.0000"
             },
             {
                 "name": "LightPink2",
                 "hex": "#eea2ad",
                 "rgb": "238,162,173",
                 "hsv": "351.3,0.3193,0.9333",
                 "cmyk": "0.0000,0.3193,0.2731,0.0667"
             },
             {
                 "name": "LightPink3",
                 "hex": "#cd8c95",
                 "rgb": "205,140,149",
                 "hsv": "351.7,0.3171,0.8039",
                 "cmyk": "0.0000,0.3171,0.2732,0.1961"
             },
             {
                 "name": "LightPink4",
                 "hex": "#8b5f65",
                 "rgb": "139,95,101",
                 "hsv": "351.8,0.3165,0.5451",
                 "cmyk": "0.0000,0.3165,0.2734,0.4549"
             },
             {
                 "name": "LightSalmon1",
                 "hex": "#ffa07a",
                 "rgb": "255,160,122",
                 "hsv": "17.1,0.5216,1.0000",
                 "cmyk": "0.0000,0.3725,0.5216,0.0000"
             },
             {
                 "name": "LightSalmon2",
                 "hex": "#ee9572",
                 "rgb": "238,149,114",
                 "hsv": "16.9,0.5210,0.9333",
                 "cmyk": "0.0000,0.3739,0.5210,0.0667"
             },
             {
                 "name": "LightSalmon3",
                 "hex": "#cd8162",
                 "rgb": "205,129,98",
                 "hsv": "17.4,0.5220,0.8039",
                 "cmyk": "0.0000,0.3707,0.5220,0.1961"
             },
             {
                 "name": "LightSalmon4",
                 "hex": "#8b5742",
                 "rgb": "139,87,66",
                 "hsv": "17.3,0.5252,0.5451",
                 "cmyk": "0.0000,0.3741,0.5252,0.4549"
             },
             {
                 "name": "LightSeaGreen",
                 "hex": "#20b2aa",
                 "rgb": "32,178,170",
                 "hsv": "176.7,0.8202,0.6980",
                 "cmyk": "0.8202,0.0000,0.0449,0.3020"
             },
             {
                 "name": "LightSkyBlue",
                 "hex": "#87cefa",
                 "rgb": "135,206,250",
                 "hsv": "203.0,0.4600,0.9804",
                 "cmyk": "0.4600,0.1760,0.0000,0.0196"
             },
             {
                 "name": "LightSkyBlue1",
                 "hex": "#b0e2ff",
                 "rgb": "176,226,255",
                 "hsv": "202.0,0.3098,1.0000",
                 "cmyk": "0.3098,0.1137,0.0000,0.0000"
             },
             {
                 "name": "LightSkyBlue2",
                 "hex": "#a4d3ee",
                 "rgb": "164,211,238",
                 "hsv": "201.9,0.3109,0.9333",
                 "cmyk": "0.3109,0.1134,0.0000,0.0667"
             },
             {
                 "name": "LightSkyBlue3",
                 "hex": "#8db6cd",
                 "rgb": "141,182,205",
                 "hsv": "201.6,0.3122,0.8039",
                 "cmyk": "0.3122,0.1122,0.0000,0.1961"
             },
             {
                 "name": "LightSkyBlue4",
                 "hex": "#607b8b",
                 "rgb": "96,123,139",
                 "hsv": "202.3,0.3094,0.5451",
                 "cmyk": "0.3094,0.1151,0.0000,0.4549"
             },
             {
                 "name": "LightSlateBlue",
                 "hex": "#8470ff",
                 "rgb": "132,112,255",
                 "hsv": "248.4,0.5608,1.0000",
                 "cmyk": "0.4824,0.5608,0.0000,0.0000"
             },
             {
                 "name": "LightSlateGray",
                 "hex": "#778899",
                 "rgb": "119,136,153",
                 "hsv": "210.0,0.2222,0.6000",
                 "cmyk": "0.2222,0.1111,0.0000,0.4000"
             },
             {
                 "name": "LightSteelBlue",
                 "hex": "#b0c4de",
                 "rgb": "176,196,222",
                 "hsv": "213.9,0.2072,0.8706",
                 "cmyk": "0.2072,0.1171,0.0000,0.1294"
             },
             {
                 "name": "LightSteelBlue1",
                 "hex": "#cae1ff",
                 "rgb": "202,225,255",
                 "hsv": "214.0,0.2078,1.0000",
                 "cmyk": "0.2078,0.1176,0.0000,0.0000"
             },
             {
                 "name": "LightSteelBlue2",
                 "hex": "#bcd2ee",
                 "rgb": "188,210,238",
                 "hsv": "213.6,0.2101,0.9333",
                 "cmyk": "0.2101,0.1176,0.0000,0.0667"
             },
             {
                 "name": "LightSteelBlue3",
                 "hex": "#a2b5cd",
                 "rgb": "162,181,205",
                 "hsv": "213.5,0.2098,0.8039",
                 "cmyk": "0.2098,0.1171,0.0000,0.1961"
             },
             {
                 "name": "LightSteelBlue4",
                 "hex": "#6e7b8b",
                 "rgb": "110,123,139",
                 "hsv": "213.1,0.2086,0.5451",
                 "cmyk": "0.2086,0.1151,0.0000,0.4549"
             },
             {
                 "name": "LightYellow1",
                 "hex": "#ffffe0",
                 "rgb": "255,255,224",
                 "hsv": "60.0,0.1216,1.0000",
                 "cmyk": "0.0000,0.0000,0.1216,0.0000"
             },
             {
                 "name": "LightYellow2",
                 "hex": "#eeeed1",
                 "rgb": "238,238,209",
                 "hsv": "60.0,0.1218,0.9333",
                 "cmyk": "0.0000,0.0000,0.1218,0.0667"
             },
             {
                 "name": "LightYellow3",
                 "hex": "#cdcdb4",
                 "rgb": "205,205,180",
                 "hsv": "60.0,0.1220,0.8039",
                 "cmyk": "0.0000,0.0000,0.1220,0.1961"
             },
             {
                 "name": "LightYellow4",
                 "hex": "#8b8b7a",
                 "rgb": "139,139,122",
                 "hsv": "60.0,0.1223,0.5451",
                 "cmyk": "0.0000,0.0000,0.1223,0.4549"
             },
             {
                 "name": "LimeGreen",
                 "hex": "#32cd32",
                 "rgb": "50,205,50",
                 "hsv": "120.0,0.7561,0.8039",
                 "cmyk": "0.7561,0.0000,0.7561,0.1961"
             },
             {
                 "name": "linen",
                 "hex": "#faf0e6",
                 "rgb": "250,240,230",
                 "hsv": "30.0,0.0800,0.9804",
                 "cmyk": "0.0000,0.0400,0.0800,0.0196"
             },
             {
                 "name": "magenta",
                 "hex": "#ff00ff",
                 "rgb": "255,0,255",
                 "hsv": "300.0,1.0000,1.0000",
                 "cmyk": "0.0000,1.0000,0.0000,0.0000"
             },
             {
                 "name": "magenta2",
                 "hex": "#ee00ee",
                 "rgb": "238,0,238",
                 "hsv": "300.0,1.0000,0.9333",
                 "cmyk": "0.0000,1.0000,0.0000,0.0667"
             },
             {
                 "name": "magenta3",
                 "hex": "#cd00cd",
                 "rgb": "205,0,205",
                 "hsv": "300.0,1.0000,0.8039",
                 "cmyk": "0.0000,1.0000,0.0000,0.1961"
             },
             {
                 "name": "magenta4",
                 "hex": "#8b008b",
                 "rgb": "139,0,139",
                 "hsv": "300.0,1.0000,0.5451",
                 "cmyk": "0.0000,1.0000,0.0000,0.4549"
             },
             {
                 "name": "maroon",
                 "hex": "#b03060",
                 "rgb": "176,48,96",
                 "hsv": "337.5,0.7273,0.6902",
                 "cmyk": "0.0000,0.7273,0.4545,0.3098"
             },
             {
                 "name": "maroon1",
                 "hex": "#ff34b3",
                 "rgb": "255,52,179",
                 "hsv": "322.5,0.7961,1.0000",
                 "cmyk": "0.0000,0.7961,0.2980,0.0000"
             },
             {
                 "name": "maroon2",
                 "hex": "#ee30a7",
                 "rgb": "238,48,167",
                 "hsv": "322.4,0.7983,0.9333",
                 "cmyk": "0.0000,0.7983,0.2983,0.0667"
             },
             {
                 "name": "maroon3",
                 "hex": "#cd2990",
                 "rgb": "205,41,144",
                 "hsv": "322.3,0.8000,0.8039",
                 "cmyk": "0.0000,0.8000,0.2976,0.1961"
             },
             {
                 "name": "maroon4",
                 "hex": "#8b1c62",
                 "rgb": "139,28,98",
                 "hsv": "322.2,0.7986,0.5451",
                 "cmyk": "0.0000,0.7986,0.2950,0.4549"
             },
             {
                 "name": "medium",
                 "hex": "#66cdaa",
                 "rgb": "102,205,170",
                 "hsv": "159.6,0.5024,0.8039",
                 "cmyk": "0.5024,0.0000,0.1707,0.1961"
             },
             {
                 "name": "MediumAquamarine",
                 "hex": "#66cdaa",
                 "rgb": "102,205,170",
                 "hsv": "159.6,0.5024,0.8039",
                 "cmyk": "0.5024,0.0000,0.1707,0.1961"
             },
             {
                 "name": "MediumBlue",
                 "hex": "#0000cd",
                 "rgb": "0,0,205",
                 "hsv": "240.0,1.0000,0.8039",
                 "cmyk": "1.0000,1.0000,0.0000,0.1961"
             },
             {
                 "name": "MediumOrchid",
                 "hex": "#ba55d3",
                 "rgb": "186,85,211",
                 "hsv": "288.1,0.5972,0.8275",
                 "cmyk": "0.1185,0.5972,0.0000,0.1725"
             },
             {
                 "name": "MediumOrchid1",
                 "hex": "#e066ff",
                 "rgb": "224,102,255",
                 "hsv": "287.8,0.6000,1.0000",
                 "cmyk": "0.1216,0.6000,0.0000,0.0000"
             },
             {
                 "name": "MediumOrchid2",
                 "hex": "#d15fee",
                 "rgb": "209,95,238",
                 "hsv": "287.8,0.6008,0.9333",
                 "cmyk": "0.1218,0.6008,0.0000,0.0667"
             },
             {
                 "name": "MediumOrchid3",
                 "hex": "#b452cd",
                 "rgb": "180,82,205",
                 "hsv": "287.8,0.6000,0.8039",
                 "cmyk": "0.1220,0.6000,0.0000,0.1961"
             },
             {
                 "name": "MediumOrchid4",
                 "hex": "#7a378b",
                 "rgb": "122,55,139",
                 "hsv": "287.9,0.6043,0.5451",
                 "cmyk": "0.1223,0.6043,0.0000,0.4549"
             },
             {
                 "name": "MediumPurple",
                 "hex": "#9370db",
                 "rgb": "147,112,219",
                 "hsv": "259.6,0.4886,0.8588",
                 "cmyk": "0.3288,0.4886,0.0000,0.1412"
             },
             {
                 "name": "MediumPurple1",
                 "hex": "#ab82ff",
                 "rgb": "171,130,255",
                 "hsv": "259.7,0.4902,1.0000",
                 "cmyk": "0.3294,0.4902,0.0000,0.0000"
             },
             {
                 "name": "MediumPurple2",
                 "hex": "#9f79ee",
                 "rgb": "159,121,238",
                 "hsv": "259.5,0.4916,0.9333",
                 "cmyk": "0.3319,0.4916,0.0000,0.0667"
             },
             {
                 "name": "MediumPurple3",
                 "hex": "#8968cd",
                 "rgb": "137,104,205",
                 "hsv": "259.6,0.4927,0.8039",
                 "cmyk": "0.3317,0.4927,0.0000,0.1961"
             },
             {
                 "name": "MediumPurple4",
                 "hex": "#5d478b",
                 "rgb": "93,71,139",
                 "hsv": "259.4,0.4892,0.5451",
                 "cmyk": "0.3309,0.4892,0.0000,0.4549"
             },
             {
                 "name": "MediumSeaGreen",
                 "hex": "#3cb371",
                 "rgb": "60,179,113",
                 "hsv": "146.7,0.6648,0.7020",
                 "cmyk": "0.6648,0.0000,0.3687,0.2980"
             },
             {
                 "name": "MediumSlateBlue",
                 "hex": "#7b68ee",
                 "rgb": "123,104,238",
                 "hsv": "248.5,0.5630,0.9333",
                 "cmyk": "0.4832,0.5630,0.0000,0.0667"
             },
             {
                 "name": "MediumSpringGreen",
                 "hex": "#00fa9a",
                 "rgb": "0,250,154",
                 "hsv": "157.0,1.0000,0.9804",
                 "cmyk": "1.0000,0.0000,0.3840,0.0196"
             },
             {
                 "name": "MediumTurquoise",
                 "hex": "#48d1cc",
                 "rgb": "72,209,204",
                 "hsv": "177.8,0.6555,0.8196",
                 "cmyk": "0.6555,0.0000,0.0239,0.1804"
             },
             {
                 "name": "MediumVioletRed",
                 "hex": "#c71585",
                 "rgb": "199,21,133",
                 "hsv": "322.2,0.8945,0.7804",
                 "cmyk": "0.0000,0.8945,0.3317,0.2196"
             },
             {
                 "name": "MidnightBlue",
                 "hex": "#191970",
                 "rgb": "25,25,112",
                 "hsv": "240.0,0.7768,0.4392",
                 "cmyk": "0.7768,0.7768,0.0000,0.5608"
             },
             {
                 "name": "MintCream",
                 "hex": "#f5fffa",
                 "rgb": "245,255,250",
                 "hsv": "150.0,0.0392,1.0000",
                 "cmyk": "0.0392,0.0000,0.0196,0.0000"
             },
             {
                 "name": "MistyRose1",
                 "hex": "#ffe4e1",
                 "rgb": "255,228,225",
                 "hsv": "6.0,0.1176,1.0000",
                 "cmyk": "0.0000,0.1059,0.1176,0.0000"
             },
             {
                 "name": "MistyRose2",
                 "hex": "#eed5d2",
                 "rgb": "238,213,210",
                 "hsv": "6.4,0.1176,0.9333",
                 "cmyk": "0.0000,0.1050,0.1176,0.0667"
             },
             {
                 "name": "MistyRose3",
                 "hex": "#cdb7b5",
                 "rgb": "205,183,181",
                 "hsv": "5.0,0.1171,0.8039",
                 "cmyk": "0.0000,0.1073,0.1171,0.1961"
             },
             {
                 "name": "MistyRose4",
                 "hex": "#8b7d7b",
                 "rgb": "139,125,123",
                 "hsv": "7.5,0.1151,0.5451",
                 "cmyk": "0.0000,0.1007,0.1151,0.4549"
             },
             {
                 "name": "moccasin",
                 "hex": "#ffe4b5",
                 "rgb": "255,228,181",
                 "hsv": "38.1,0.2902,1.0000",
                 "cmyk": "0.0000,0.1059,0.2902,0.0000"
             },
             {
                 "name": "NavajoWhite1",
                 "hex": "#ffdead",
                 "rgb": "255,222,173",
                 "hsv": "35.9,0.3216,1.0000",
                 "cmyk": "0.0000,0.1294,0.3216,0.0000"
             },
             {
                 "name": "NavajoWhite2",
                 "hex": "#eecfa1",
                 "rgb": "238,207,161",
                 "hsv": "35.8,0.3235,0.9333",
                 "cmyk": "0.0000,0.1303,0.3235,0.0667"
             },
             {
                 "name": "NavajoWhite3",
                 "hex": "#cdb38b",
                 "rgb": "205,179,139",
                 "hsv": "36.4,0.3220,0.8039",
                 "cmyk": "0.0000,0.1268,0.3220,0.1961"
             },
             {
                 "name": "NavajoWhite4",
                 "hex": "#8b795e",
                 "rgb": "139,121,94",
                 "hsv": "36.0,0.3237,0.5451",
                 "cmyk": "0.0000,0.1295,0.3237,0.4549"
             },
             {
                 "name": "NavyBlue",
                 "hex": "#000080",
                 "rgb": "0,0,128",
                 "hsv": "240.0,1.0000,0.5020",
                 "cmyk": "1.0000,1.0000,0.0000,0.4980"
             },
             {
                 "name": "OldLace",
                 "hex": "#fdf5e6",
                 "rgb": "253,245,230",
                 "hsv": "39.1,0.0909,0.9922",
                 "cmyk": "0.0000,0.0316,0.0909,0.0078"
             },
             {
                 "name": "OliveDrab",
                 "hex": "#6b8e23",
                 "rgb": "107,142,35",
                 "hsv": "79.6,0.7535,0.5569",
                 "cmyk": "0.2465,0.0000,0.7535,0.4431"
             },
             {
                 "name": "OliveDrab1",
                 "hex": "#c0ff3e",
                 "rgb": "192,255,62",
                 "hsv": "79.6,0.7569,1.0000",
                 "cmyk": "0.2471,0.0000,0.7569,0.0000"
             },
             {
                 "name": "OliveDrab2",
                 "hex": "#b3ee3a",
                 "rgb": "179,238,58",
                 "hsv": "79.7,0.7563,0.9333",
                 "cmyk": "0.2479,0.0000,0.7563,0.0667"
             },
             {
                 "name": "OliveDrab4",
                 "hex": "#698b22",
                 "rgb": "105,139,34",
                 "hsv": "79.4,0.7554,0.5451",
                 "cmyk": "0.2446,0.0000,0.7554,0.4549"
             },
             {
                 "name": "orange1",
                 "hex": "#ffa500",
                 "rgb": "255,165,0",
                 "hsv": "38.8,1.0000,1.0000",
                 "cmyk": "0.0000,0.3529,1.0000,0.0000"
             },
             {
                 "name": "orange2",
                 "hex": "#ee9a00",
                 "rgb": "238,154,0",
                 "hsv": "38.8,1.0000,0.9333",
                 "cmyk": "0.0000,0.3529,1.0000,0.0667"
             },
             {
                 "name": "orange3",
                 "hex": "#cd8500",
                 "rgb": "205,133,0",
                 "hsv": "38.9,1.0000,0.8039",
                 "cmyk": "0.0000,0.3512,1.0000,0.1961"
             },
             {
                 "name": "orange4",
                 "hex": "#8b5a00",
                 "rgb": "139,90,0",
                 "hsv": "38.8,1.0000,0.5451",
                 "cmyk": "0.0000,0.3525,1.0000,0.4549"
             },
             {
                 "name": "OrangeRed1",
                 "hex": "#ff4500",
                 "rgb": "255,69,0",
                 "hsv": "16.2,1.0000,1.0000",
                 "cmyk": "0.0000,0.7294,1.0000,0.0000"
             },
             {
                 "name": "OrangeRed2",
                 "hex": "#ee4000",
                 "rgb": "238,64,0",
                 "hsv": "16.1,1.0000,0.9333",
                 "cmyk": "0.0000,0.7311,1.0000,0.0667"
             },
             {
                 "name": "OrangeRed3",
                 "hex": "#cd3700",
                 "rgb": "205,55,0",
                 "hsv": "16.1,1.0000,0.8039",
                 "cmyk": "0.0000,0.7317,1.0000,0.1961"
             },
             {
                 "name": "OrangeRed4",
                 "hex": "#8b2500",
                 "rgb": "139,37,0",
                 "hsv": "16.0,1.0000,0.5451",
                 "cmyk": "0.0000,0.7338,1.0000,0.4549"
             },
             {
                 "name": "orchid",
                 "hex": "#da70d6",
                 "rgb": "218,112,214",
                 "hsv": "302.3,0.4862,0.8549",
                 "cmyk": "0.0000,0.4862,0.0183,0.1451"
             },
             {
                 "name": "orchid1",
                 "hex": "#ff83fa",
                 "rgb": "255,131,250",
                 "hsv": "302.4,0.4863,1.0000",
                 "cmyk": "0.0000,0.4863,0.0196,0.0000"
             },
             {
                 "name": "orchid2",
                 "hex": "#ee7ae9",
                 "rgb": "238,122,233",
                 "hsv": "302.6,0.4874,0.9333",
                 "cmyk": "0.0000,0.4874,0.0210,0.0667"
             },
             {
                 "name": "orchid3",
                 "hex": "#cd69c9",
                 "rgb": "205,105,201",
                 "hsv": "302.4,0.4878,0.8039",
                 "cmyk": "0.0000,0.4878,0.0195,0.1961"
             },
             {
                 "name": "orchid4",
                 "hex": "#8b4789",
                 "rgb": "139,71,137",
                 "hsv": "301.8,0.4892,0.5451",
                 "cmyk": "0.0000,0.4892,0.0144,0.4549"
             },
             {
                 "name": "pale",
                 "hex": "#db7093",
                 "rgb": "219,112,147",
                 "hsv": "340.4,0.4886,0.8588",
                 "cmyk": "0.0000,0.4886,0.3288,0.1412"
             },
             {
                 "name": "PaleGoldenrod",
                 "hex": "#eee8aa",
                 "rgb": "238,232,170",
                 "hsv": "54.7,0.2857,0.9333",
                 "cmyk": "0.0000,0.0252,0.2857,0.0667"
             },
             {
                 "name": "PaleGreen",
                 "hex": "#98fb98",
                 "rgb": "152,251,152",
                 "hsv": "120.0,0.3944,0.9843",
                 "cmyk": "0.3944,0.0000,0.3944,0.0157"
             },
             {
                 "name": "PaleGreen1",
                 "hex": "#9aff9a",
                 "rgb": "154,255,154",
                 "hsv": "120.0,0.3961,1.0000",
                 "cmyk": "0.3961,0.0000,0.3961,0.0000"
             },
             {
                 "name": "PaleGreen2",
                 "hex": "#90ee90",
                 "rgb": "144,238,144",
                 "hsv": "120.0,0.3950,0.9333",
                 "cmyk": "0.3950,0.0000,0.3950,0.0667"
             },
             {
                 "name": "PaleGreen3",
                 "hex": "#7ccd7c",
                 "rgb": "124,205,124",
                 "hsv": "120.0,0.3951,0.8039",
                 "cmyk": "0.3951,0.0000,0.3951,0.1961"
             },
             {
                 "name": "PaleGreen4",
                 "hex": "#548b54",
                 "rgb": "84,139,84",
                 "hsv": "120.0,0.3957,0.5451",
                 "cmyk": "0.3957,0.0000,0.3957,0.4549"
             },
             {
                 "name": "PaleTurquoise",
                 "hex": "#afeeee",
                 "rgb": "175,238,238",
                 "hsv": "180.0,0.2647,0.9333",
                 "cmyk": "0.2647,0.0000,0.0000,0.0667"
             },
             {
                 "name": "PaleTurquoise1",
                 "hex": "#bbffff",
                 "rgb": "187,255,255",
                 "hsv": "180.0,0.2667,1.0000",
                 "cmyk": "0.2667,0.0000,0.0000,0.0000"
             },
             {
                 "name": "PaleTurquoise2",
                 "hex": "#aeeeee",
                 "rgb": "174,238,238",
                 "hsv": "180.0,0.2689,0.9333",
                 "cmyk": "0.2689,0.0000,0.0000,0.0667"
             },
             {
                 "name": "PaleTurquoise3",
                 "hex": "#96cdcd",
                 "rgb": "150,205,205",
                 "hsv": "180.0,0.2683,0.8039",
                 "cmyk": "0.2683,0.0000,0.0000,0.1961"
             },
             {
                 "name": "PaleTurquoise4",
                 "hex": "#668b8b",
                 "rgb": "102,139,139",
                 "hsv": "180.0,0.2662,0.5451",
                 "cmyk": "0.2662,0.0000,0.0000,0.4549"
             },
             {
                 "name": "PaleVioletRed",
                 "hex": "#db7093",
                 "rgb": "219,112,147",
                 "hsv": "340.4,0.4886,0.8588",
                 "cmyk": "0.0000,0.4886,0.3288,0.1412"
             },
             {
                 "name": "PaleVioletRed1",
                 "hex": "#ff82ab",
                 "rgb": "255,130,171",
                 "hsv": "340.3,0.4902,1.0000",
                 "cmyk": "0.0000,0.4902,0.3294,0.0000"
             },
             {
                 "name": "PaleVioletRed2",
                 "hex": "#ee799f",
                 "rgb": "238,121,159",
                 "hsv": "340.5,0.4916,0.9333",
                 "cmyk": "0.0000,0.4916,0.3319,0.0667"
             },
             {
                 "name": "PaleVioletRed3",
                 "hex": "#cd6889",
                 "rgb": "205,104,137",
                 "hsv": "340.4,0.4927,0.8039",
                 "cmyk": "0.0000,0.4927,0.3317,0.1961"
             },
             {
                 "name": "PaleVioletRed4",
                 "hex": "#8b475d",
                 "rgb": "139,71,93",
                 "hsv": "340.6,0.4892,0.5451",
                 "cmyk": "0.0000,0.4892,0.3309,0.4549"
             },
             {
                 "name": "PapayaWhip",
                 "hex": "#ffefd5",
                 "rgb": "255,239,213",
                 "hsv": "37.1,0.1647,1.0000",
                 "cmyk": "0.0000,0.0627,0.1647,0.0000"
             },
             {
                 "name": "PeachPuff1",
                 "hex": "#ffdab9",
                 "rgb": "255,218,185",
                 "hsv": "28.3,0.2745,1.0000",
                 "cmyk": "0.0000,0.1451,0.2745,0.0000"
             },
             {
                 "name": "PeachPuff2",
                 "hex": "#eecbad",
                 "rgb": "238,203,173",
                 "hsv": "27.7,0.2731,0.9333",
                 "cmyk": "0.0000,0.1471,0.2731,0.0667"
             },
             {
                 "name": "PeachPuff3",
                 "hex": "#cdaf95",
                 "rgb": "205,175,149",
                 "hsv": "27.9,0.2732,0.8039",
                 "cmyk": "0.0000,0.1463,0.2732,0.1961"
             },
             {
                 "name": "PeachPuff4",
                 "hex": "#8b7765",
                 "rgb": "139,119,101",
                 "hsv": "28.4,0.2734,0.5451",
                 "cmyk": "0.0000,0.1439,0.2734,0.4549"
             },
             {
                 "name": "pink",
                 "hex": "#ffc0cb",
                 "rgb": "255,192,203",
                 "hsv": "349.5,0.2471,1.0000",
                 "cmyk": "0.0000,0.2471,0.2039,0.0000"
             },
             {
                 "name": "pink1",
                 "hex": "#ffb5c5",
                 "rgb": "255,181,197",
                 "hsv": "347.0,0.2902,1.0000",
                 "cmyk": "0.0000,0.2902,0.2275,0.0000"
             },
             {
                 "name": "pink2",
                 "hex": "#eea9b8",
                 "rgb": "238,169,184",
                 "hsv": "347.0,0.2899,0.9333",
                 "cmyk": "0.0000,0.2899,0.2269,0.0667"
             },
             {
                 "name": "pink3",
                 "hex": "#cd919e",
                 "rgb": "205,145,158",
                 "hsv": "347.0,0.2927,0.8039",
                 "cmyk": "0.0000,0.2927,0.2293,0.1961"
             },
             {
                 "name": "pink4",
                 "hex": "#8b636c",
                 "rgb": "139,99,108",
                 "hsv": "346.5,0.2878,0.5451",
                 "cmyk": "0.0000,0.2878,0.2230,0.4549"
             },
             {
                 "name": "plum",
                 "hex": "#dda0dd",
                 "rgb": "221,160,221",
                 "hsv": "300.0,0.2760,0.8667",
                 "cmyk": "0.0000,0.2760,0.0000,0.1333"
             },
             {
                 "name": "plum1",
                 "hex": "#ffbbff",
                 "rgb": "255,187,255",
                 "hsv": "300.0,0.2667,1.0000",
                 "cmyk": "0.0000,0.2667,0.0000,0.0000"
             },
             {
                 "name": "plum2",
                 "hex": "#eeaeee",
                 "rgb": "238,174,238",
                 "hsv": "300.0,0.2689,0.9333",
                 "cmyk": "0.0000,0.2689,0.0000,0.0667"
             },
             {
                 "name": "plum3",
                 "hex": "#cd96cd",
                 "rgb": "205,150,205",
                 "hsv": "300.0,0.2683,0.8039",
                 "cmyk": "0.0000,0.2683,0.0000,0.1961"
             },
             {
                 "name": "plum4",
                 "hex": "#8b668b",
                 "rgb": "139,102,139",
                 "hsv": "300.0,0.2662,0.5451",
                 "cmyk": "0.0000,0.2662,0.0000,0.4549"
             },
             {
                 "name": "PowderBlue",
                 "hex": "#b0e0e6",
                 "rgb": "176,224,230",
                 "hsv": "186.7,0.2348,0.9020",
                 "cmyk": "0.2348,0.0261,0.0000,0.0980"
             },
             {
                 "name": "purple",
                 "hex": "#a020f0",
                 "rgb": "160,32,240",
                 "hsv": "276.9,0.8667,0.9412",
                 "cmyk": "0.3333,0.8667,0.0000,0.0588"
             },
             {
                 "name": "purple1",
                 "hex": "#9b30ff",
                 "rgb": "155,48,255",
                 "hsv": "271.0,0.8118,1.0000",
                 "cmyk": "0.3922,0.8118,0.0000,0.0000"
             },
             {
                 "name": "purple2",
                 "hex": "#912cee",
                 "rgb": "145,44,238",
                 "hsv": "271.2,0.8151,0.9333",
                 "cmyk": "0.3908,0.8151,0.0000,0.0667"
             },
             {
                 "name": "purple3",
                 "hex": "#7d26cd",
                 "rgb": "125,38,205",
                 "hsv": "271.3,0.8146,0.8039",
                 "cmyk": "0.3902,0.8146,0.0000,0.1961"
             },
             {
                 "name": "purple4",
                 "hex": "#551a8b",
                 "rgb": "85,26,139",
                 "hsv": "271.3,0.8129,0.5451",
                 "cmyk": "0.3885,0.8129,0.0000,0.4549"
             },
             {
                 "name": "red1",
                 "hex": "#ff0000",
                 "rgb": "255,0,0",
                 "hsv": "0.0,1.0000,1.0000",
                 "cmyk": "0.0000,1.0000,1.0000,0.0000"
             },
             {
                 "name": "red2",
                 "hex": "#ee0000",
                 "rgb": "238,0,0",
                 "hsv": "0.0,1.0000,0.9333",
                 "cmyk": "0.0000,1.0000,1.0000,0.0667"
             },
             {
                 "name": "red3",
                 "hex": "#cd0000",
                 "rgb": "205,0,0",
                 "hsv": "0.0,1.0000,0.8039",
                 "cmyk": "0.0000,1.0000,1.0000,0.1961"
             },
             {
                 "name": "red4",
                 "hex": "#8b0000",
                 "rgb": "139,0,0",
                 "hsv": "0.0,1.0000,0.5451",
                 "cmyk": "0.0000,1.0000,1.0000,0.4549"
             },
             {
                 "name": "RosyBrown",
                 "hex": "#bc8f8f",
                 "rgb": "188,143,143",
                 "hsv": "0.0,0.2394,0.7373",
                 "cmyk": "0.0000,0.2394,0.2394,0.2627"
             },
             {
                 "name": "RosyBrown1",
                 "hex": "#ffc1c1",
                 "rgb": "255,193,193",
                 "hsv": "0.0,0.2431,1.0000",
                 "cmyk": "0.0000,0.2431,0.2431,0.0000"
             },
             {
                 "name": "RosyBrown2",
                 "hex": "#eeb4b4",
                 "rgb": "238,180,180",
                 "hsv": "0.0,0.2437,0.9333",
                 "cmyk": "0.0000,0.2437,0.2437,0.0667"
             },
             {
                 "name": "RosyBrown3",
                 "hex": "#cd9b9b",
                 "rgb": "205,155,155",
                 "hsv": "0.0,0.2439,0.8039",
                 "cmyk": "0.0000,0.2439,0.2439,0.1961"
             },
             {
                 "name": "RosyBrown4",
                 "hex": "#8b6969",
                 "rgb": "139,105,105",
                 "hsv": "0.0,0.2446,0.5451",
                 "cmyk": "0.0000,0.2446,0.2446,0.4549"
             },
             {
                 "name": "RoyalBlue",
                 "hex": "#4169e1",
                 "rgb": "65,105,225",
                 "hsv": "225.0,0.7111,0.8824",
                 "cmyk": "0.7111,0.5333,0.0000,0.1176"
             },
             {
                 "name": "RoyalBlue1",
                 "hex": "#4876ff",
                 "rgb": "72,118,255",
                 "hsv": "224.9,0.7176,1.0000",
                 "cmyk": "0.7176,0.5373,0.0000,0.0000"
             },
             {
                 "name": "RoyalBlue2",
                 "hex": "#436eee",
                 "rgb": "67,110,238",
                 "hsv": "224.9,0.7185,0.9333",
                 "cmyk": "0.7185,0.5378,0.0000,0.0667"
             },
             {
                 "name": "RoyalBlue3",
                 "hex": "#3a5fcd",
                 "rgb": "58,95,205",
                 "hsv": "224.9,0.7171,0.8039",
                 "cmyk": "0.7171,0.5366,0.0000,0.1961"
             },
             {
                 "name": "RoyalBlue4",
                 "hex": "#27408b",
                 "rgb": "39,64,139",
                 "hsv": "225.0,0.7194,0.5451",
                 "cmyk": "0.7194,0.5396,0.0000,0.4549"
             },
             {
                 "name": "SaddleBrown",
                 "hex": "#8b4513",
                 "rgb": "139,69,19",
                 "hsv": "25.0,0.8633,0.5451",
                 "cmyk": "0.0000,0.5036,0.8633,0.4549"
             },
             {
                 "name": "salmon",
                 "hex": "#fa8072",
                 "rgb": "250,128,114",
                 "hsv": "6.2,0.5440,0.9804",
                 "cmyk": "0.0000,0.4880,0.5440,0.0196"
             },
             {
                 "name": "salmon1",
                 "hex": "#ff8c69",
                 "rgb": "255,140,105",
                 "hsv": "14.0,0.5882,1.0000",
                 "cmyk": "0.0000,0.4510,0.5882,0.0000"
             },
             {
                 "name": "salmon2",
                 "hex": "#ee8262",
                 "rgb": "238,130,98",
                 "hsv": "13.7,0.5882,0.9333",
                 "cmyk": "0.0000,0.4538,0.5882,0.0667"
             },
             {
                 "name": "salmon3",
                 "hex": "#cd7054",
                 "rgb": "205,112,84",
                 "hsv": "13.9,0.5902,0.8039",
                 "cmyk": "0.0000,0.4537,0.5902,0.1961"
             },
             {
                 "name": "salmon4",
                 "hex": "#8b4c39",
                 "rgb": "139,76,57",
                 "hsv": "13.9,0.5899,0.5451",
                 "cmyk": "0.0000,0.4532,0.5899,0.4549"
             },
             {
                 "name": "SandyBrown",
                 "hex": "#f4a460",
                 "rgb": "244,164,96",
                 "hsv": "27.6,0.6066,0.9569",
                 "cmyk": "0.0000,0.3279,0.6066,0.0431"
             },
             {
                 "name": "SeaGreen1",
                 "hex": "#54ff9f",
                 "rgb": "84,255,159",
                 "hsv": "146.3,0.6706,1.0000",
                 "cmyk": "0.6706,0.0000,0.3765,0.0000"
             },
             {
                 "name": "SeaGreen2",
                 "hex": "#4eee94",
                 "rgb": "78,238,148",
                 "hsv": "146.3,0.6723,0.9333",
                 "cmyk": "0.6723,0.0000,0.3782,0.0667"
             },
             {
                 "name": "SeaGreen3",
                 "hex": "#43cd80",
                 "rgb": "67,205,128",
                 "hsv": "146.5,0.6732,0.8039",
                 "cmyk": "0.6732,0.0000,0.3756,0.1961"
             },
             {
                 "name": "SeaGreen4",
                 "hex": "#2e8b57",
                 "rgb": "46,139,87",
                 "hsv": "146.5,0.6691,0.5451",
                 "cmyk": "0.6691,0.0000,0.3741,0.4549"
             },
             {
                 "name": "seashell1",
                 "hex": "#fff5ee",
                 "rgb": "255,245,238",
                 "hsv": "24.7,0.0667,1.0000",
                 "cmyk": "0.0000,0.0392,0.0667,0.0000"
             },
             {
                 "name": "seashell2",
                 "hex": "#eee5de",
                 "rgb": "238,229,222",
                 "hsv": "26.3,0.0672,0.9333",
                 "cmyk": "0.0000,0.0378,0.0672,0.0667"
             },
             {
                 "name": "seashell3",
                 "hex": "#cdc5bf",
                 "rgb": "205,197,191",
                 "hsv": "25.7,0.0683,0.8039",
                 "cmyk": "0.0000,0.0390,0.0683,0.1961"
             },
             {
                 "name": "seashell4",
                 "hex": "#8b8682",
                 "rgb": "139,134,130",
                 "hsv": "26.7,0.0647,0.5451",
                 "cmyk": "0.0000,0.0360,0.0647,0.4549"
             },
             {
                 "name": "sienna",
                 "hex": "#a0522d",
                 "rgb": "160,82,45",
                 "hsv": "19.3,0.7187,0.6275",
                 "cmyk": "0.0000,0.4875,0.7187,0.3725"
             },
             {
                 "name": "sienna1",
                 "hex": "#ff8247",
                 "rgb": "255,130,71",
                 "hsv": "19.2,0.7216,1.0000",
                 "cmyk": "0.0000,0.4902,0.7216,0.0000"
             },
             {
                 "name": "sienna2",
                 "hex": "#ee7942",
                 "rgb": "238,121,66",
                 "hsv": "19.2,0.7227,0.9333",
                 "cmyk": "0.0000,0.4916,0.7227,0.0667"
             },
             {
                 "name": "sienna3",
                 "hex": "#cd6839",
                 "rgb": "205,104,57",
                 "hsv": "19.1,0.7220,0.8039",
                 "cmyk": "0.0000,0.4927,0.7220,0.1961"
             },
             {
                 "name": "sienna4",
                 "hex": "#8b4726",
                 "rgb": "139,71,38",
                 "hsv": "19.6,0.7266,0.5451",
                 "cmyk": "0.0000,0.4892,0.7266,0.4549"
             },
             {
                 "name": "SkyBlue",
                 "hex": "#87ceeb",
                 "rgb": "135,206,235",
                 "hsv": "197.4,0.4255,0.9216",
                 "cmyk": "0.4255,0.1234,0.0000,0.0784"
             },
             {
                 "name": "SkyBlue1",
                 "hex": "#87ceff",
                 "rgb": "135,206,255",
                 "hsv": "204.5,0.4706,1.0000",
                 "cmyk": "0.4706,0.1922,0.0000,0.0000"
             },
             {
                 "name": "SkyBlue2",
                 "hex": "#7ec0ee",
                 "rgb": "126,192,238",
                 "hsv": "204.6,0.4706,0.9333",
                 "cmyk": "0.4706,0.1933,0.0000,0.0667"
             },
             {
                 "name": "SkyBlue3",
                 "hex": "#6ca6cd",
                 "rgb": "108,166,205",
                 "hsv": "204.1,0.4732,0.8039",
                 "cmyk": "0.4732,0.1902,0.0000,0.1961"
             },
             {
                 "name": "SkyBlue4",
                 "hex": "#4a708b",
                 "rgb": "74,112,139",
                 "hsv": "204.9,0.4676,0.5451",
                 "cmyk": "0.4676,0.1942,0.0000,0.4549"
             },
             {
                 "name": "SlateBlue",
                 "hex": "#6a5acd",
                 "rgb": "106,90,205",
                 "hsv": "248.3,0.5610,0.8039",
                 "cmyk": "0.4829,0.5610,0.0000,0.1961"
             },
             {
                 "name": "SlateBlue1",
                 "hex": "#836fff",
                 "rgb": "131,111,255",
                 "hsv": "248.3,0.5647,1.0000",
                 "cmyk": "0.4863,0.5647,0.0000,0.0000"
             },
             {
                 "name": "SlateBlue2",
                 "hex": "#7a67ee",
                 "rgb": "122,103,238",
                 "hsv": "248.4,0.5672,0.9333",
                 "cmyk": "0.4874,0.5672,0.0000,0.0667"
             },
             {
                 "name": "SlateBlue3",
                 "hex": "#6959cd",
                 "rgb": "105,89,205",
                 "hsv": "248.3,0.5659,0.8039",
                 "cmyk": "0.4878,0.5659,0.0000,0.1961"
             },
             {
                 "name": "SlateBlue4",
                 "hex": "#473c8b",
                 "rgb": "71,60,139",
                 "hsv": "248.4,0.5683,0.5451",
                 "cmyk": "0.4892,0.5683,0.0000,0.4549"
             },
             {
                 "name": "SlateGray",
                 "hex": "#708090",
                 "rgb": "112,128,144",
                 "hsv": "210.0,0.2222,0.5647",
                 "cmyk": "0.2222,0.1111,0.0000,0.4353"
             },
             {
                 "name": "SlateGray1",
                 "hex": "#c6e2ff",
                 "rgb": "198,226,255",
                 "hsv": "210.5,0.2235,1.0000",
                 "cmyk": "0.2235,0.1137,0.0000,0.0000"
             },
             {
                 "name": "SlateGray2",
                 "hex": "#b9d3ee",
                 "rgb": "185,211,238",
                 "hsv": "210.6,0.2227,0.9333",
                 "cmyk": "0.2227,0.1134,0.0000,0.0667"
             },
             {
                 "name": "SlateGray3",
                 "hex": "#9fb6cd",
                 "rgb": "159,182,205",
                 "hsv": "210.0,0.2244,0.8039",
                 "cmyk": "0.2244,0.1122,0.0000,0.1961"
             },
             {
                 "name": "SlateGray4",
                 "hex": "#6c7b8b",
                 "rgb": "108,123,139",
                 "hsv": "211.0,0.2230,0.5451",
                 "cmyk": "0.2230,0.1151,0.0000,0.4549"
             },
             {
                 "name": "snow1",
                 "hex": "#fffafa",
                 "rgb": "255,250,250",
                 "hsv": "0.0,0.0196,1.0000",
                 "cmyk": "0.0000,0.0196,0.0196,0.0000"
             },
             {
                 "name": "snow2",
                 "hex": "#eee9e9",
                 "rgb": "238,233,233",
                 "hsv": "0.0,0.0210,0.9333",
                 "cmyk": "0.0000,0.0210,0.0210,0.0667"
             },
             {
                 "name": "snow3",
                 "hex": "#cdc9c9",
                 "rgb": "205,201,201",
                 "hsv": "0.0,0.0195,0.8039",
                 "cmyk": "0.0000,0.0195,0.0195,0.1961"
             },
             {
                 "name": "snow4",
                 "hex": "#8b8989",
                 "rgb": "139,137,137",
                 "hsv": "0.0,0.0144,0.5451",
                 "cmyk": "0.0000,0.0144,0.0144,0.4549"
             },
             {
                 "name": "SpringGreen1",
                 "hex": "#00ff7f",
                 "rgb": "0,255,127",
                 "hsv": "149.9,1.0000,1.0000",
                 "cmyk": "1.0000,0.0000,0.5020,0.0000"
             },
             {
                 "name": "SpringGreen2",
                 "hex": "#00ee76",
                 "rgb": "0,238,118",
                 "hsv": "149.7,1.0000,0.9333",
                 "cmyk": "1.0000,0.0000,0.5042,0.0667"
             },
             {
                 "name": "SpringGreen3",
                 "hex": "#00cd66",
                 "rgb": "0,205,102",
                 "hsv": "149.9,1.0000,0.8039",
                 "cmyk": "1.0000,0.0000,0.5024,0.1961"
             },
             {
                 "name": "SpringGreen4",
                 "hex": "#008b45",
                 "rgb": "0,139,69",
                 "hsv": "149.8,1.0000,0.5451",
                 "cmyk": "1.0000,0.0000,0.5036,0.4549"
             },
             {
                 "name": "SteelBlue",
                 "hex": "#4682b4",
                 "rgb": "70,130,180",
                 "hsv": "207.3,0.6111,0.7059",
                 "cmyk": "0.6111,0.2778,0.0000,0.2941"
             },
             {
                 "name": "SteelBlue1",
                 "hex": "#63b8ff",
                 "rgb": "99,184,255",
                 "hsv": "207.3,0.6118,1.0000",
                 "cmyk": "0.6118,0.2784,0.0000,0.0000"
             },
             {
                 "name": "SteelBlue2",
                 "hex": "#5cacee",
                 "rgb": "92,172,238",
                 "hsv": "207.1,0.6134,0.9333",
                 "cmyk": "0.6134,0.2773,0.0000,0.0667"
             },
             {
                 "name": "SteelBlue3",
                 "hex": "#4f94cd",
                 "rgb": "79,148,205",
                 "hsv": "207.1,0.6146,0.8039",
                 "cmyk": "0.6146,0.2780,0.0000,0.1961"
             },
             {
                 "name": "SteelBlue4",
                 "hex": "#36648b",
                 "rgb": "54,100,139",
                 "hsv": "207.5,0.6115,0.5451",
                 "cmyk": "0.6115,0.2806,0.0000,0.4549"
             },
             {
                 "name": "tan",
                 "hex": "#d2b48c",
                 "rgb": "210,180,140",
                 "hsv": "34.3,0.3333,0.8235",
                 "cmyk": "0.0000,0.1429,0.3333,0.1765"
             },
             {
                 "name": "tan1",
                 "hex": "#ffa54f",
                 "rgb": "255,165,79",
                 "hsv": "29.3,0.6902,1.0000",
                 "cmyk": "0.0000,0.3529,0.6902,0.0000"
             },
             {
                 "name": "tan2",
                 "hex": "#ee9a49",
                 "rgb": "238,154,73",
                 "hsv": "29.5,0.6933,0.9333",
                 "cmyk": "0.0000,0.3529,0.6933,0.0667"
             },
             {
                 "name": "tan3",
                 "hex": "#cd853f",
                 "rgb": "205,133,63",
                 "hsv": "29.6,0.6927,0.8039",
                 "cmyk": "0.0000,0.3512,0.6927,0.1961"
             },
             {
                 "name": "tan4",
                 "hex": "#8b5a2b",
                 "rgb": "139,90,43",
                 "hsv": "29.4,0.6906,0.5451",
                 "cmyk": "0.0000,0.3525,0.6906,0.4549"
             },
             {
                 "name": "thistle",
                 "hex": "#d8bfd8",
                 "rgb": "216,191,216",
                 "hsv": "300.0,0.1157,0.8471",
                 "cmyk": "0.0000,0.1157,0.0000,0.1529"
             },
             {
                 "name": "thistle1",
                 "hex": "#ffe1ff",
                 "rgb": "255,225,255",
                 "hsv": "300.0,0.1176,1.0000",
                 "cmyk": "0.0000,0.1176,0.0000,0.0000"
             },
             {
                 "name": "thistle2",
                 "hex": "#eed2ee",
                 "rgb": "238,210,238",
                 "hsv": "300.0,0.1176,0.9333",
                 "cmyk": "0.0000,0.1176,0.0000,0.0667"
             },
             {
                 "name": "thistle3",
                 "hex": "#cdb5cd",
                 "rgb": "205,181,205",
                 "hsv": "300.0,0.1171,0.8039",
                 "cmyk": "0.0000,0.1171,0.0000,0.1961"
             },
             {
                 "name": "thistle4",
                 "hex": "#8b7b8b",
                 "rgb": "139,123,139",
                 "hsv": "300.0,0.1151,0.5451",
                 "cmyk": "0.0000,0.1151,0.0000,0.4549"
             },
             {
                 "name": "tomato1",
                 "hex": "#ff6347",
                 "rgb": "255,99,71",
                 "hsv": "9.1,0.7216,1.0000",
                 "cmyk": "0.0000,0.6118,0.7216,0.0000"
             },
             {
                 "name": "tomato2",
                 "hex": "#ee5c42",
                 "rgb": "238,92,66",
                 "hsv": "9.1,0.7227,0.9333",
                 "cmyk": "0.0000,0.6134,0.7227,0.0667"
             },
             {
                 "name": "tomato3",
                 "hex": "#cd4f39",
                 "rgb": "205,79,57",
                 "hsv": "8.9,0.7220,0.8039",
                 "cmyk": "0.0000,0.6146,0.7220,0.1961"
             },
             {
                 "name": "tomato4",
                 "hex": "#8b3626",
                 "rgb": "139,54,38",
                 "hsv": "9.5,0.7266,0.5451",
                 "cmyk": "0.0000,0.6115,0.7266,0.4549"
             },
             {
                 "name": "turquoise",
                 "hex": "#40e0d0",
                 "rgb": "64,224,208",
                 "hsv": "174.0,0.7143,0.8784",
                 "cmyk": "0.7143,0.0000,0.0714,0.1216"
             },
             {
                 "name": "turquoise1",
                 "hex": "#00f5ff",
                 "rgb": "0,245,255",
                 "hsv": "182.4,1.0000,1.0000",
                 "cmyk": "1.0000,0.0392,0.0000,0.0000"
             },
             {
                 "name": "turquoise2",
                 "hex": "#00e5ee",
                 "rgb": "0,229,238",
                 "hsv": "182.3,1.0000,0.9333",
                 "cmyk": "1.0000,0.0378,0.0000,0.0667"
             },
             {
                 "name": "turquoise3",
                 "hex": "#00c5cd",
                 "rgb": "0,197,205",
                 "hsv": "182.3,1.0000,0.8039",
                 "cmyk": "1.0000,0.0390,0.0000,0.1961"
             },
             {
                 "name": "turquoise4",
                 "hex": "#00868b",
                 "rgb": "0,134,139",
                 "hsv": "182.2,1.0000,0.5451",
                 "cmyk": "1.0000,0.0360,0.0000,0.4549"
             },
             {
                 "name": "violet",
                 "hex": "#ee82ee",
                 "rgb": "238,130,238",
                 "hsv": "300.0,0.4538,0.9333",
                 "cmyk": "0.0000,0.4538,0.0000,0.0667"
             },
             {
                 "name": "VioletRed",
                 "hex": "#d02090",
                 "rgb": "208,32,144",
                 "hsv": "321.8,0.8462,0.8157",
                 "cmyk": "0.0000,0.8462,0.3077,0.1843"
             },
             {
                 "name": "VioletRed1",
                 "hex": "#ff3e96",
                 "rgb": "255,62,150",
                 "hsv": "332.6,0.7569,1.0000",
                 "cmyk": "0.0000,0.7569,0.4118,0.0000"
             },
             {
                 "name": "VioletRed2",
                 "hex": "#ee3a8c",
                 "rgb": "238,58,140",
                 "hsv": "332.7,0.7563,0.9333",
                 "cmyk": "0.0000,0.7563,0.4118,0.0667"
             },
             {
                 "name": "VioletRed3",
                 "hex": "#cd3278",
                 "rgb": "205,50,120",
                 "hsv": "332.9,0.7561,0.8039",
                 "cmyk": "0.0000,0.7561,0.4146,0.1961"
             },
             {
                 "name": "VioletRed4",
                 "hex": "#8b2252",
                 "rgb": "139,34,82",
                 "hsv": "332.6,0.7554,0.5451",
                 "cmyk": "0.0000,0.7554,0.4101,0.4549"
             },
             {
                 "name": "wheat",
                 "hex": "#f5deb3",
                 "rgb": "245,222,179",
                 "hsv": "39.1,0.2694,0.9608",
                 "cmyk": "0.0000,0.0939,0.2694,0.0392"
             },
             {
                 "name": "wheat1",
                 "hex": "#ffe7ba",
                 "rgb": "255,231,186",
                 "hsv": "39.1,0.2706,1.0000",
                 "cmyk": "0.0000,0.0941,0.2706,0.0000"
             },
             {
                 "name": "wheat2",
                 "hex": "#eed8ae",
                 "rgb": "238,216,174",
                 "hsv": "39.4,0.2689,0.9333",
                 "cmyk": "0.0000,0.0924,0.2689,0.0667"
             },
             {
                 "name": "wheat3",
                 "hex": "#cdba96",
                 "rgb": "205,186,150",
                 "hsv": "39.3,0.2683,0.8039",
                 "cmyk": "0.0000,0.0927,0.2683,0.1961"
             },
             {
                 "name": "wheat4",
                 "hex": "#8b7e66",
                 "rgb": "139,126,102",
                 "hsv": "38.9,0.2662,0.5451",
                 "cmyk": "0.0000,0.0935,0.2662,0.4549"
             },
             {
                 "name": "white",
                 "hex": "#ffffff",
                 "rgb": "255,255,255",
                 "hsv": "0,0,1.0000",
                 "cmyk": "0.0000,0.0000,0.0000,0.0000"
             },
             {
                 "name": "WhiteSmoke",
                 "hex": "#f5f5f5",
                 "rgb": "245,245,245",
                 "hsv": "0,0,0.9608",
                 "cmyk": "0.0000,0.0000,0.0000,0.0392"
             },
             {
                 "name": "yellow1",
                 "hex": "#ffff00",
                 "rgb": "255,255,0",
                 "hsv": "60.0,1.0000,1.0000",
                 "cmyk": "0.0000,0.0000,1.0000,0.0000"
             },
             {
                 "name": "yellow2",
                 "hex": "#eeee00",
                 "rgb": "238,238,0",
                 "hsv": "60.0,1.0000,0.9333",
                 "cmyk": "0.0000,0.0000,1.0000,0.0667"
             },
             {
                 "name": "yellow3",
                 "hex": "#cdcd00",
                 "rgb": "205,205,0",
                 "hsv": "60.0,1.0000,0.8039",
                 "cmyk": "0.0000,0.0000,1.0000,0.1961"
             },
             {
                 "name": "yellow4",
                 "hex": "#8b8b00",
                 "rgb": "139,139,0",
                 "hsv": "60.0,1.0000,0.5451",
                 "cmyk": "0.0000,0.0000,1.0000,0.4549"
             },
             {
                 "name": "YellowGreen",
                 "hex": "#9acd32",
                 "rgb": "154,205,50",
                 "hsv": "79.7,0.7561,0.8039",
                 "cmyk": "0.2488,0.0000,0.7561,0.1961"
             }
         ];

function drawColorTable(){
	
	var colorArr = [];
	
	$.each(colors,function(i,color){
		var div = "<div style='height:15px;margin:0 auto;width:50%;border:1px solid;background-color:"+color.hex+"'></div>";
		colorArr[i] = [div,color.name,color.hex,color.rgb,color.hsv,color.cmyk];
	});
	
	$('#colorTable').dataTable({
		"bRetrieve" : false,
		"bDestroy" : true,
		"bPaginate" : true,
		"bJQueryUI" : true,
		"aaSorting" : [ [ 1, 'asc' ] ],
		"aaData" : colorArr,
		"oLanguage" : {
			"sEmptyTable" : "No Color Available"
		},
		"aoColumns" : [{
			"sTitle" : "Color",
			"bVisible" : true,
			"sWidth": "3%",
			"cClass":"even"
		}, {
			"sTitle" : "Name",
			"bVisible" : true,
			"sWidth": "5%",

		}, {
			"sTitle" : "Hex",
			"bVisible" : true,
			"sWidth": "5%",

		}, {
			"sTitle" : "RGB",
			"bVisible" : true,
			"sWidth": "5%",
			
		}, {
			"sTitle" : "HSV",
			"bVisible" : true,
			"sWidth": "5%",
			 
		} , {
			"sTitle" : "CMYK",
			"bVisible" : true,
			"sWidth": "5%",
			 
		}  ]
	});

	$.fn.dataTableExt.sErrMode = 'mute';
	
	
	$("#colorEffect").parent().css({
		"margin" : "0px 20px"

	});

	$(".sourceCodeOptionDiv :input").keyup(function(e){

		var keycode = e.keyCode || e.which;

		if(keycode == 13){
			$("#convertbtn").click();
		}
		
	});

	$('#colorPallete').colpick({
		flat:true,
		layout:'hex',
		submit:0,
		onChange:function(hsb,hex,rgb,el,bySetColor) {
			
			var view = $("#viewName").val().split("-")[0];
			
			if(view == "rgb"){
				$("#r").val(rgb.r);
				$("#g").val(rgb.g);
				$("#b").val(rgb.b);
			}
			else{
				$("#h").val(hex);
			}
			
			$("#convertbtn").click();
			 
		}
	});
}

/************************ header page javascript *******************************/
function save(data) {

	$.ajax({
		url: "/service/save",
		dataType: "text",
		type: "post",
		data: {
			content: data,
			viewname: $("#viewName").val().trim(),
			title: $("#save_link_title").val(),
			desc: $("#save_link_description").val(),
			tags: $("#save_link_tags").val().trim()
		},
		success: function(response) {

			var link = "http://"+location.host+"/"+$("#viewName").val().trim() + "/" + response;
			$("#subTitle").find('h4').remove();
			$("#permalink").find('a').remove();
			$("#subTitle").append("<h4 style='padding-left:10px'>" + $("#save_link_title").val() + "</h4>");
			$("#permalink").append("<a href=" + link + " style='float:left;width:100%;'>" + link + "</a>");
			$(".sharelinkurl").attr("st_url", link);
			$(".sharelinkurl").attr("st_title", $("#save_link_title").val());
			$("#permalink").parent().show();
			// openPostToFbDialog();
			//openErrorDialog("Pls save this link for sharing.<a href="+link+">("+link+")</a>");
		},
		error: function(e, s, a) {

			openErrorDialog("Error in data saving");

		}
	});
}


function update(data) {

	$.ajax({
		url: "/service/update",
		dataType: "text",
		type: "post",
		data: {
			id: $("#edit_link_id").val(),
			content: data,
			viewname: $("#viewName").val().trim(),
			title: $("#save_link_title").val(),
			desc: $("#save_link_description").val(),
			tags: $("#save_link_tags").val().trim()
		},
		success: function(response) {
			$("#subTitle").find('h4').remove();
			$("#permalink").find('a').remove();
			$("#subTitle").append("<h4 style='padding-left:10px'>" + $("#save_link_title").val() + "</h4>");
			$("#permalink").append("<a href=" + location.href + ">" + location.href + "</a>");
			$(".sharelinkurl").attr("st_url", location.href);
			$(".sharelinkurl").attr("st_title", $("#save_link_title").val());
			$("#permalink").parent().show();
			//openPostToFbDialog();
		},
		error: function(e, s, a) {

			openErrorDialog("Error in data updating");

		}
	});
}

function openSavedialog() {

	var isLogin = $("#isLogin").val();
	
	
	if (isLogin != "1" && $("#edit_link_id").val() != "") {
		login();
		return false;
	}

	var data = "";
	if ($("#viewName").val().trim() == 'cssvalidate') {
		data = $("#cssData").val();
	} else if ($("#viewName").val().trim() == 'jsvalidate') {

		data = $("#jsData").val();
	} else if ($("#viewName").val().trim() == 'wordcounter') {

		data = $("#tData").val();
	} else if ($("#viewName").val().trim() == 'alleditor') {
		if (editorAce.getValue() == null && editorAce.getValue().trim().length == 0) {
			flag = false;
			return false;
		}
		data = editorAce.getValue() + "|" + $("#editorLanguage").val();

	} else {
		if(typeof editorAce != 'undefined'){
			data = editorAce.getValue();
		}
		else{
			data = $("#input").val();
		}
			
	}

	if (data != null && data != "" && data.trim().length > 0) {


		$("#savedialog").dialog({
			modal: true,
			title: "Save",
			zIndex: 10000,
			autoOpen: false,
			width: '30%',
			resizable: false,
			buttons: {
				Save: function() {
					var title = $("#save_link_title").val();

					if (title != null && title.trim().length != 0) {
						$('#savedialog').dialog('close');
						$("#openError").html('');
						if ($("#edit_link_id").val() == "" || $("#edit_link_id").val() == "0") {
							save(data);
							$(this).dialog('destroy');

						} else {
							if (isLogin == "1") {
								$("#savedialog").dialog("option", "disabled", true);
								$('<div></div>').appendTo('#openError').html('<div>Do you want to save as new file..?</h5></div>')
									.dialog({
									modal: true,
									title: "Confirm",
									zIndex: 10000,
									autoOpen: true,
									width: '30%',
									resizable: false,
									buttons: {
										Yes: function() {
											$("#openError").html('');
											save(data);
											$(this).dialog('destroy');
											$("#savedialog").dialog('destroy');
										},
										No: function(event, ui) {
											$("#openError").html('');
											update(data);
											$(this).dialog('destroy');
											$("#savedialog").dialog('destroy');
										},
										Close: function(event, ui) {
											$("#openError").html('');
											$(this).dialog('destroy');
											$('#savedialog').dialog('open');
										}
									},
								});
							}
							else{ $("#openError").html('');
							save(data);
							$(this).dialog('destroy');
						}
					}

				} else {
					openErrorDialog("Please Enter Title");
				}
			},
			Cancel: function(event, ui) {
				$("#openError").html('');
				$(this).dialog('destroy');

			}
		},
		});
} else {
	openErrorDialog("No Data in Input view");
}

$('#savedialog').dialog('open');
}
/*******************Private Note/Snap JS******************/
function saveSnap(){
	
	var minute = $("#m").val().trim();
	 
	if(minute.length != 0){
		
		if(isNaN(minute) == true){
			openErrorDialog("Minute Must be number.");
			return false;
		} 
		if(parseInt(minute) > 6){
			openErrorDialog("Minute is not valid,Please Enter minutes between 1 to 5.");
			return false;
		}
		
	}
	
	   var note = $("#note").val().trim(),
	    email = $("#email").val(),
	    note_ref = $("#note_ref").val(),
		photoId  = $("#photoId").text();
	   
	   if(note.trim().length == 0){
		   $("#note").focus();
		   return false;
	   }
	
	
	$.ajax({
		url: globalurl+"service/savePrivateNote",
		dataType: "text",
		type: "post",
		data: {
			note: note,
			email: email,
			note_ref: note_ref,
			timer: minute,
			photoId : photoId
		},
		success: function(response) {
			
			 $('.MainMessageContainerDiv').addClass('hideImportant');
			 $('.messageAlertDiv').show();
			 $('.createMessageLink').html(window.location+"/"+response);
		},
		error: function(e, s, a) {

			openErrorDialog("Error in save");

		}
	});
	
}

function deletePhoto(){
	
	var photoId  = $("#photoId").text();
	
	$.ajax({
		url: globalurl+"service/deletePrivateNotePhoto",
		dataType: "text",
		type: "post",
		data: {
			photoId : photoId
		},
		success: function(response) {
			if(response == "success"){
				$("#photoId").text("");
	 			$("#uploadPhotobtn").show();
	 			$("#photoSpan").hide();
			}
			else{
				openErrorDialog("Error in Deleting photo Please Try Agains");
			}
		},
		error: function(e, s, a) {

			openErrorDialog("Error in Delete");

		}
	});
}

function uploadPrivateNotePhoto(){

	//globalurl = "/index.php/"
		new AjaxUpload($('#uploadPhotobtn'),
				{
					action : globalurl+"readfile/uploadPrivateNotePhoto",
					name : 'userfile',
					onSubmit : function(file, ext1) {
						 var ext=ext1[0];
						
						if(ext=="jpeg" || ext=="png" || ext=="jpg" || ext=="gif" || ext=="bmp" || ext=="psd" )
							{
							showProgress();
							return true;
							}
						else{
							openErrorDialog("Please Select Image File Only...!");
							return false;
						}
						

					},
					onComplete : function(file, response) {

						if(response!='error' && response.search("Filename")==-1){
							 			$("#photoId").text(response);
							 			$("#uploadPhotobtn").hide();
							 			$("#photoSpan").show();
						}else
						{
							openErrorDialog("Error in Loading File.");
						}
						
						hideProgress();

					}
				});

}

/**********csv parser *************/
/*
Papa Parse
v3.0.1
https://github.com/mholt/PapaParse
*/
;(function(e){"use strict";function u(e,r){var i=t?r:g(r);var s=i.worker&&Papa.WORKERS_SUPPORTED&&n;if(s){var o=d();o.userStep=i.step;o.userChunk=i.chunk;o.userComplete=i.complete;o.userError=i.error;i.step=b(i.step);i.chunk=b(i.chunk);i.complete=b(i.complete);i.error=b(i.error);delete i.worker;o.postMessage({input:e,config:i,workerId:o.id})}else{if(typeof e==="string"){if(i.download){var u=new f(i);u.stream(e)}else{var a=new c(i);var h=a.parse(e);if(b(i.complete))i.complete(h);return h}}else if(e instanceof File){if(i.step||i.chunk){var u=new l(i);u.stream(e)}else{var a=new c(i);if(t){var p=new FileReaderSync;var v=p.readAsText(e,i.encoding);return a.parse(v)}else{p=new FileReader;p.onload=function(e){var t=new c(i);var n=t.parse(e.target.result);if(b(i.complete))i.complete(n)};p.readAsText(e,i.encoding)}}}}}function a(t,n){function a(){if(typeof n!=="object")return;if(typeof n.delimiter==="string"&&n.delimiter.length==1&&e.Papa.BAD_DELIMITERS.indexOf(n.delimiter)==-1){o=n.delimiter}if(typeof n.quotes==="boolean"||n.quotes instanceof Array)s=n.quotes;if(typeof n.newline==="string")u=n.newline}function f(e){if(typeof e!=="object")return[];var t=[];for(var n in e)t.push(n);return t}function l(e,t){var n="";if(typeof e==="string")e=JSON.parse(e);if(typeof t==="string")t=JSON.parse(t);var r=e instanceof Array&&e.length>0;var i=!(t[0]instanceof Array);if(r){for(var s=0;s<e.length;s++){if(s>0)n+=o;n+=c(e[s],s)}if(t.length>0)n+=u}for(var a=0;a<t.length;a++){var f=r?e.length:t[a].length;for(var l=0;l<f;l++){if(l>0)n+=o;var h=r&&i?e[l]:l;n+=c(t[a][h],l)}if(a<t.length-1)n+=u}return n}function c(t,n){if(typeof t==="undefined")return"";t=t.toString().replace(/"/g,'""');var r=typeof s==="boolean"&&s||s instanceof Array&&s[n]||h(t,e.Papa.BAD_DELIMITERS)||t.indexOf(o)>-1||t.charAt(0)==" "||t.charAt(t.length-1)==" ";return r?'"'+t+'"':t}function h(e,t){for(var n=0;n<t.length;n++)if(e.indexOf(t[n])>-1)return true;return false}var r="";var i=[];var s=false;var o=",";var u="\r\n";a();if(typeof t==="string")t=JSON.parse(t);if(t instanceof Array){if(!t.length||t[0]instanceof Array)return l(null,t);else if(typeof t[0]==="object")return l(f(t[0]),t)}else if(typeof t==="object"){if(typeof t.data==="string")t.data=JSON.parse(t.data);if(t.data instanceof Array){if(!t.fields)t.fields=t.data[0]instanceof Array?t.fields:f(t.data[0]);if(!(t.data[0]instanceof Array)&&typeof t.data[0]!=="object")t.data=[t.data]}return l(t.fields||[],t.data||[])}throw"exception: Unable to serialize unrecognized input"}function f(n){n=n||{};if(!n.chunkSize)n.chunkSize=Papa.RemoteChunkSize;var r=0,i=0;var s="";var o="";var u,a;var f=new c(y(n));this.stream=function(l){function c(){u=new XMLHttpRequest;if(!t){u.onload=h;u.onerror=p}u.open("GET",l,!t);if(n.step){var e=r+n.chunkSize-1;if(i&&e>i)e=i;u.setRequestHeader("Range","bytes="+r+"-"+e)}u.send();if(t&&u.status==0)p();else r+=n.chunkSize}function h(){if(u.readyState!=4)return;if(u.status<200||u.status>=400){p();return}s+=o+u.responseText;o="";var i=!n.step||r>d(u);if(!i){var l=s.lastIndexOf("\n");if(l<0)l=s.lastIndexOf("\r");if(l>-1){o=s.substring(l+1);s=s.substring(0,l)}else{a();return}}var c=f.parse(s);s="";if(t){e.postMessage({results:c,workerId:Papa.WORKER_ID,finished:i})}else if(b(n.chunk)){n.chunk(c);c=undefined}if(i&&b(n.complete))n.complete(c);else if(c&&c.meta.aborted&&b(n.complete))n.complete(c);else if(!i)a()}function p(){if(b(n.error))n.error(u.statusText);else if(t&&n.error){e.postMessage({workerId:Papa.WORKER_ID,error:u.statusText,finished:false})}}function d(e){var t=e.getResponseHeader("Content-Range");return parseInt(t.substr(t.lastIndexOf("/")+1))}if(t){a=function(){c();h()}}else{a=function(){c()}}a()}}function l(n){n=n||{};if(!n.chunkSize)n.chunkSize=Papa.LocalChunkSize;var r=0;var i="";var s="";var o,u,a;var f=new c(y(n));var l=typeof FileReader==="function";this.stream=function(u){function c(){if(r<u.size)h()}function h(){var e=Math.min(r+n.chunkSize,u.size);var t=o.readAsText(a.call(u,r,e),n.encoding);if(!l)p({target:{result:t}})}function p(o){r+=n.chunkSize;i+=s+o.target.result;s="";var a=r>=u.size;if(!a){var l=i.lastIndexOf("\n");if(l<0)l=i.lastIndexOf("\r");if(l>-1){s=i.substring(l+1);i=i.substring(0,l)}else{c();return}}var h=f.parse(i);i="";if(t){e.postMessage({results:h,workerId:Papa.WORKER_ID,finished:a})}else if(b(n.chunk)){n.chunk(h,u);h=undefined}if(a&&b(n.complete))n.complete(undefined,u);else if(h&&h.meta.aborted&&b(n.complete))n.complete(h,u);else if(!a)c()}function d(){if(b(n.error))n.error(o.error,u);else if(t&&n.error){e.postMessage({workerId:Papa.WORKER_ID,error:o.error,file:u,finished:false})}}var a=u.slice||u.webkitSlice||u.mozSlice;if(l){o=new FileReader;o.onload=p;o.onerror=d}else o=new FileReaderSync;c()}}function c(e){function s(){if(i&&n){c("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to comma");n=false}if(o())u();return a()}function o(){return e.header&&r.length==0}function u(){if(!i)return;for(var e=0;o()&&e<i.data.length;e++)for(var t=0;t<i.data[e].length;t++)r.push(i.data[e][t]);i.data.splice(0,1)}function a(){if(!i||!e.header&&!e.dynamicTyping)return i;for(var t=0;t<i.data.length;t++){var n={};for(var s=0;s<i.data[t].length;s++){if(e.dynamicTyping){var o=i.data[t][s];if(o=="true")i.data[t][s]=true;else if(o=="false")i.data[t][s]=false;else i.data[t][s]=l(o)}if(e.header){if(s>=r.length){if(!n["__parsed_extra"])n["__parsed_extra"]=[];n["__parsed_extra"].push(i.data[t][s])}n[r[s]]=i.data[t][s]}}if(e.header){i.data[t]=n;if(s>r.length)c("FieldMismatch","TooManyFields","Too many fields: expected "+r.length+" fields but parsed "+s,t);else if(s<r.length)c("FieldMismatch","TooFewFields","Too few fields: expected "+r.length+" fields but parsed "+s,t)}}if(e.header&&i.meta);i.meta.fields=r;return i}function f(t){var n=[","," ","|",";",Papa.RECORD_SEP,Papa.UNIT_SEP];var r,i,s;for(var o=0;o<n.length;o++){var u=n[o];var a=0,f=0;s=undefined;var l=(new h({delimiter:u,preview:10})).parse(t);for(var c=0;c<l.data.length;c++){var p=l.data[c].length;f+=p;if(typeof s==="undefined"){s=p;continue}else if(p>1){a+=Math.abs(p-s);s=p}}f/=l.data.length;if((typeof i==="undefined"||a<i)&&f>1.99){i=a;r=u}}e.delimiter=r;return{successful:!!r,bestDelimiter:r}}function l(e){var n=t.test(e);return n?parseFloat(e):e}function c(e,t,n,r){i.errors.push({type:e,code:t,message:n,row:r})}var t=/^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i;var n;var r=[];var i={data:[],errors:[],meta:{}};e=y(e);this.parse=function(t){n=false;if(!e.delimiter){var r=f(t);if(r.successful)e.delimiter=r.bestDelimiter;else{n=true;e.delimiter=","}i.meta.delimiter=e.delimiter}if(b(e.step)){var u=e.step;e.step=function(e,t){i=e;if(o())s();else u(s(),t)}}i=(new h(e)).parse(t);return s()}}function h(e){function E(){while(l<r.length){if(y)break;if(a>0&&g>=a)break;if(w)return x();if(f=='"')T();else if(c)N();else C();S()}return x()}function S(){l++;f=r[l]}function x(){if(y)I("Abort","ParseAbort","Parsing was aborted by the user's step function");if(c)I("Quotes","MissingQuotes","Unescaped or mismatched quotes");_();if(!b(o))return U()}function T(){if(j()&&!B())c=!c;else{A();if(c&&B())l++;else I("Quotes","UnexpectedQuotes","Unexpected quotes")}}function N(){if(P(l)||H(l))h++;A()}function C(){if(f==i)O();else if(P(l)){M();S()}else if(H(l))M();else if(k())L();else A()}function k(){if(!s)return false;var e=l==0||H(l-1)||P(l-2);return e&&r[l]===s}function L(){while(!P(l)&&!H(l)&&l<r.length){S()}}function A(){p[v][m]+=f}function O(){p[v].push("");m=p[v].length-1}function M(){_();h++;g++;p.push([]);v=p.length-1;O()}function _(){D();if(b(o)){if(p[v])o(U(),t);R()}}function D(){if(p[v].length==1&&n.test(p[v][0])){if(e.keepEmptyRows)p[v].splice(0,1);else p.splice(v,1);v=p.length-1}}function P(e){return e<r.length-1&&(r[e]=="\r"&&r[e+1]=="\n"||r[e]=="\n"&&r[e+1]=="\r")}function H(e){return r[e]=="\r"||r[e]=="\n"}function B(){return!j()&&l<r.length-1&&r[l+1]=='"'}function j(){return!c&&F(l-1)||F(l+1)}function F(e){if(typeof e!="number")e=l;var t=r[e];return e<=-1||e>=r.length||t==i||t=="\r"||t=="\n"}function I(e,t,n){d.push({type:e,code:t,message:n,line:h,row:v,index:l})}function q(e){r=e;c=false;l=0,g=0,h=1;R();p=[[""]];f=r[l]}function R(){p=[];d=[];v=0;m=0}function U(){return{data:p,errors:d,meta:{lines:h,delimiter:i,aborted:y}}}var t=this;var n=/^\s*$/;var r;var i;var s;var o;var u;var a;var f;var l;var c;var h;var p;var d;var v;var m;var g;var y=false;var w=false;e=e||{};i=e.delimiter;s=e.comments;o=e.step;a=e.preview;if(typeof i!=="string"||i.length!=1||Papa.BAD_DELIMITERS.indexOf(i)>-1)i=",";if(s===true)s="#";else if(typeof s!=="string"||s.length!=1||Papa.BAD_DELIMITERS.indexOf(s)>-1||s==i)s=false;this.parse=function(e){if(typeof e!=="string")throw"Input must be a string";q(e);return E()};this.abort=function(){y=true}}function p(){var e="worker"+String(Math.random()).substr(2);document.write('<script id="'+e+'"></script>');return document.getElementById(e).previousSibling.src}function d(){if(!Papa.WORKERS_SUPPORTED)return false;var t=new e.Worker(n);t.onmessage=v;t.id=i++;r[t.id]=t;return t}function v(e){var t=e.data;var n=r[t.workerId];if(t.error)n.userError(t.error,t.file);else if(t.results&&t.results.data){if(b(n.userStep)){for(var i=0;i<t.results.data.length;i++){n.userStep({data:[t.results.data[i]],errors:t.results.errors,meta:t.results.meta})}delete t.results}else if(b(n.userChunk)){n.userChunk(t.results,t.file);delete t.results}}if(t.finished){if(b(r[t.workerId].userComplete))r[t.workerId].userComplete(t.results);r[t.workerId].terminate();delete r[t.workerId]}}function m(t){var n=t.data;if(typeof Papa.WORKER_ID==="undefined"&&n)Papa.WORKER_ID=n.workerId;if(typeof n.input==="string"){e.postMessage({workerId:Papa.WORKER_ID,results:Papa.parse(n.input,n.config),finished:true})}else if(n.input instanceof File){var r=Papa.parse(n.input,n.config);if(r)e.postMessage({workerId:Papa.WORKER_ID,results:r,finished:true})}}function g(e){if(typeof e!=="object")e={};var t=y(e);if(typeof t.delimiter!=="string"||t.delimiter.length!=1||Papa.BAD_DELIMITERS.indexOf(t.delimiter)>-1)t.delimiter=s.delimiter;if(typeof t.header!=="boolean")t.header=s.header;if(typeof t.dynamicTyping!=="boolean")t.dynamicTyping=s.dynamicTyping;if(typeof t.preview!=="number")t.preview=s.preview;if(typeof t.step!=="function")t.step=s.step;if(typeof t.complete!=="function")t.complete=s.complete;if(typeof t.encoding!=="string")t.encoding=s.encoding;if(typeof t.worker!=="boolean")t.worker=s.worker;if(typeof t.download!=="boolean")t.download=s.download;if(typeof t.keepEmptyRows!=="boolean")t.keepEmptyRows=s.keepEmptyRows;return t}function y(e){if(typeof e!=="object")return e;var t=e instanceof Array?[]:{};for(var n in e)t[n]=y(e[n]);return t}function b(e){return typeof e==="function"}var t=!e.document,n;var r={},i=0;var s={delimiter:"",header:false,dynamicTyping:false,preview:0,step:undefined,encoding:"",worker:false,comments:false,complete:undefined,download:false,chunk:undefined,keepEmptyRows:false};e.Papa={};e.Papa.parse=u;e.Papa.unparse=a;e.Papa.RECORD_SEP=String.fromCharCode(30);e.Papa.UNIT_SEP=String.fromCharCode(31);e.Papa.BYTE_ORDER_MARK="﻿";e.Papa.BAD_DELIMITERS=["\r","\n",'"',e.Papa.BYTE_ORDER_MARK];e.Papa.WORKERS_SUPPORTED=!!e.Worker;e.Papa.LocalChunkSize=1024*1024*10;e.Papa.RemoteChunkSize=1024*1024*5;e.Papa.Parser=h;e.Papa.ParserHandle=c;e.Papa.NetworkStreamer=f;e.Papa.FileStreamer=l;if(e.jQuery){var o=e.jQuery;o.fn.parse=function(t){function i(){if(r.length==0){if(b(t.complete))t.complete();return}var e=r[0];if(b(t.before)){var n=t.before(e.file,e.inputElem);if(typeof n==="object"){if(n.action=="abort"){s("AbortError",e.file,e.inputElem,n.reason);return}else if(n.action=="skip"){u();return}else if(typeof n.config==="object")e.instanceConfig=o.extend(e.instanceConfig,n.config)}else if(n=="skip"){u();return}}var i=e.instanceConfig.complete;e.instanceConfig.complete=function(t){if(b(i))i(t,e.file,e.inputElem);u()};Papa.parse(e.file,e.instanceConfig)}function s(e,n,r,i){if(b(t.error))t.error({name:e},n,r,i)}function u(){r.splice(0,1);i()}var n=t.config||{};var r=[];this.each(function(t){var i=o(this).prop("tagName").toUpperCase()=="INPUT"&&o(this).attr("type").toLowerCase()=="file"&&e.FileReader;if(!i||!this.files||this.files.length==0)return true;for(var s=0;s<this.files.length;s++){r.push({file:this.files[s],inputElem:this,instanceConfig:o.extend({},n)})}});i();return this}}if(t)e.onmessage=m;else if(Papa.WORKERS_SUPPORTED)n=p()})(this);