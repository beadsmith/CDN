// script to poup the cookie testing page
// djf 3-1-13
 
// Get named HTML object
function GetObject(name)
{
	var o=null;
	if(document.getElementById)
		o=document.getElementById(name);
	else if(document.all)
		o=document.all.item(name);
	else if(document.layers)
		o=document.layers[name];
	if (o==null && document.getElementsByName)
	{
		var e=document.getElementsByName(name);
		if (e.length==1) o=e[0];
	}
	return o;
}
function setvar(nm,vl)
{
	var dta="";
	var allck=document.cookie;
	var pos=allck.indexOf("dta=");
	if (pos!=-1)
	{
		var start=pos+4;
		var end=allck.indexOf(";", start);
		if (end==-1) end=allck.length;
		dta=unescape(allck.substring(start, end));
	}
	var a=dta.split(",");
	for (var i=0; i<a.length; i++)
	{
		if (a[i].substr(0,nm.length+1)==nm+"=")
			break;
	}
	a[i]=nm+"="+vl;
	dta=a.join(",");
	if (dta.substr(0,1)==',') dta=dta.substr(1);
	var exp=new Date((new Date()).getTime()+20*60000); // expire in 20 mins
	document.cookie="dta="+escape(dta)+"; expires="+exp.toGMTString();
}
function makediv(dividname){
var divblock=document.createElement("div")
divblock.setAttribute("id", dividname)
document.body.appendChild(divblock)
}
function getvar(nm)
{
	var value=null;
	var allck=document.cookie;
	var pos=allck.indexOf("dta=");
	if (pos!=-1)
	{
		var start=pos+4;
		var end=allck.indexOf(";", start);
		if (end==-1) end=allck.length;
		var dta=unescape(allck.substring(start, end));
		pos=dta.indexOf(nm+"=");
		if (pos!=-1)
		{
			start=pos+nm.length+1;
			end=dta.indexOf(",", start);
			if (end==-1) end=dta.length;
			value=dta.substring(start, end);
		}
	}
	return value;
}
$(document).ready(function() {	
// try to store a cookie, if failed show popup
var vc=getvar("vcount");
if (vc==null) setvar("vcount",0); else setvar("vcount",parseInt(vc)+1);
vc=getvar("vcount");
if (vc==null){	 var t=setTimeout("showmodal()",1000); }
	//select all the a tag with name equal to modal
//if dialog is clicked
	$('#cookiedialog').click(function (e) {
		//Cancel the link behavior
		// e.preventDefault();
		$('#mask').hide();
		$('#cookiedialog').hide();
	});		
	//if mask is clicked
//	$('#mask').click(function () {
//		$(this).hide();
//		$('.window').hide();
//	});			
});
function hidecookiepopup() { 		$('#cookiedialog').hide();	$('#mask').hide(); }
function showmodal() {
	//Get the screen height and width
	// Check Existence of Mask and Dialog 
if ($("#mask").length < 1){
 // need to create div 
 makediv("mask");
}
if ($("cookiedialog").length < 1){
 // need to create div 
 makediv("cookiedialog");
}
// .window{position:absolute;left:0;top:0;width:440px;height:200px;display:none;z-index:9999;padding:20px;}
// #dialog{width:800px;height:580px;padding:10px;background-color:#ffffff;}

$('#cookiedialog').css({'width':'800px','height':'580px','padding':'10px','background': 'white'});
$('#cookiedialog').css({'display':'none','z-index':'9999','position':'absolute','color':'black'});
$('#cookiedialog').html('<div style=float:left> Beadsmith Site Notice</div><div style=float:right><a href="javascript:hidecookiepopup();"> <img src="https://img5.helby.com/webimages/close_pop.png"></a> </div><iframe src="https://iws.helby.com/static/Cookiefail.html" style="margin:0; padding:0; width:100%; height: 90%" name="cokieframe" ></iframe>');
		var maskHeight = $(document).height();
		var maskWidth = $(window).width();
		//Set heigth and width to mask to fill up the whole screen
	//	$('#mask').css({'width':maskWidth,'height':maskHeight});
$('#mask').css({'width':maskWidth,'height':maskHeight,'position':'absolute','left':'0','top':'0','z-index':'9000','background-color':'#000','display':'none'});		
		//transition effect		
		$('#mask').fadeIn(1000);	
		$('#mask').fadeTo("slow",0.8);	
		//Get the window height and width
		var winH = $(window).height();
		var winW = $(window).width();
		//Set the popup window to center
		$('#cookiedialog').css('top',  winH/2-$('#cookiedialog').height()/2);
		$('#cookiedialog').css('left', winW/2-$('#cookiedialog').width()/2);
		//transition effect
		$('#cookiedialog').fadeIn(2000); 
}



