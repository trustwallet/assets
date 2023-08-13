<!--- Get function parameter if exists --->
<cfset parmLst = "">
<cfloop collection="#url#" item="i">
	<cfif refindnocase('p', i)>
		<cfset parmLst = "#ListAppend(parmLst,i)#">
	</cfif>
</cfloop>

<cfset parmLst="#listsort(parmlst,'textnocase','desc')#">

<cfscript>

// jsrsServer.cf5.inc - cfscript remote scripting server include adopted from
// 	jsrsServer.asp - javascript remote scripting server include
//
// Original Author:  Brent Ashley [jsrs@megahuge.com]
// Cold Fusion 5 version: <etec@etec.com.tw> 
// Date: January 30, 2002
//
// see jsrsClient.js for version info
//
//  see license.txt for copyright and license info


function jsrsDispatch(validFuncs){
  func = jsrsBuildFunc(validFuncs);
  
  if (func neq ""){
    
    retval = Evaluate(func);
    
    if (Len(retval) gt 0){
      jsrsReturn(retval & "");
    } else {
      jsrsReturn("");
   } 
 } else {
    jsrsReturnError("function builds as empty string");
 }
}


function jsrsReturn(payload) {
 
  WriteOutput(
          "<html><head></head><body onload=""p=document.layers?parentLayer:window.parent;p.jsrsLoaded('"
        & url.C & "');"">jsrsPayload:<br>" 
        & "<form name=""jsrs_Form""><textarea name=""jsrs_Payload"" id=""jsrs_Payload"">"
    & jsrsEscape(payload) & "</textarea></form></body></html>");
    
}

function jsrsEscape( str ){
  // escape ampersands so special chars aren't interpreted
  var tmp = REReplaceNoCase(str, "&", "&amp;");
  // escape slashes  with whacks so end tags don't interfere with return html
  return REReplaceNoCase(tmp, "\/" , "\\/"); 
}

/////////////////////////////
//
// user functions


function jsrsReturnError( str ){

  // escape quotes
  cleanStr = REReplaceNoCase(str,"\'","\\'");
  cleanStr = 'jsrsError: ' & REReplaceNoCase(cleanStr,"\", "\\\"); 
  WriteOutput(
      '<html><head></head><body '
      & 'onload="p=document.layers?parentLayer:window.parent;p.jsrsError(\'' & form.C & "','" & URLEncodedFormat(str) & '\');">'
      & cleanStr & '</body></html>' );
 
}

function jsrsArrayToString( a, delim ){
  
  // user function to flatten 1-dim array to string for return to client
  var d = '~';
  if (delim neq "") {
  	d = delim;
  }
  return ArrayToList(a,d);
}

function jsrsBuildFunc(validFuncs) {

  func = "";
  if(ParameterExists(form.F)) {
  	F = form.F;
  } else if (ParameterExists(url.F)){
  	F = url.F;
  }
  	
  if (F neq "") {
    func = F; 
    
    // make sure it's in the dispatch list
    if( Not REFind(UCase(func) ,UCase(validFuncs))) { 
      jsrsReturnError(func & " is not a valid function");
    }
    
    func = func & "(";
    
    for (i = 1; i lte #ListLen(parmLst)#; i = i + 1) {
    	parm = "#Evaluate(ListGetAt(parmLst,i))#";
        parm = "#Mid( parm, 2, Len(parm) - 2 )#";
        func = func & """" & jsrsEvalEscape(parm) & """,";
    }
    
    if ( Right(func, 1) eq "," ) {
       	func = Left(func,Len(func)-1);
    }
    
    func = func & ")";
  }
  return func;
}  

function jsrsEvalEscape( thing ) {
    tmp = Replace( thing, Chr(13) & Chr(10), "\n" );
    return Replace( tmp, """", "\""" );
}
</cfscript>
