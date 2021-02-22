//version:1.0.5
/* abc new version*/
// this is a global variable
//version:1.0.1
var checkVal = "";
var stepCntr = 0;
var defDdText = "--select--";
(function ($) {
     //to set multiselect dropdown default value
    if($("#formmangr-dd-ms-dispname").length >0)
        defDdText = $("#formmangr-dd-ms-dispname").val();
    $('.formmangr-dd-ms').multiSelect({noneText: defDdText});
    
    $(".formmangr-button").on("click", function(e){ 
            e.preventDefault(); 
            var inputFields = ["first_name","last_name","city","state","street_address","zip","phone","email","occupants","move_in","comment","unit_type","referral"];
            var dataFieldsKPC = ["first_name","last_name","phone","email","occupants","move_in","unit_type","comment"];
            var error_free = true; 
            var formid = "#"+$(this).parents("form").attr("id");  //alert(formid); 
            $(formid+' .error').css("display","none");//reset all errormsg
            $(formid+' .error').text("");//reset all errormsg
            for (var i = 0; i < inputFields.length; i++) { 
                error_free = validateInputRequiredFields(formid,inputFields[i],error_free);               
            }
            //require field validation in case of multiple-select dd unit type
            if($(formid + " #formmangr-dd-ms-dispname").length >0 && ($(formid + " #formmangr-dd-ms-dispname").attr("aria-required")=="true") && $(formid + " #unit_type_field_name").val() == null) {
                //alert($(formid + " #unit_type_field_name").val());
                if($(formid + " #unit_type_field_name").parent('div.formmangr-field').find('.error').text()==""){
                    $(formid + " #unit_type_field_name").parent('div.formmangr-field').find('.error').text($(formid + " #unit_type_field_name").parent().find('label span').html()+ " must be filled out");
                }
                $(formid + " #unit_type_field_name").parent('div.formmangr-field').find('.error').css("display","block");         
                error_free = false;                
            }
            if($(formid + " #contact_by_field_name_email").length >0 || $(formid + " #contact_by_field_name_phone").length >0) {
                var checkValue = $("input[name='contactby']:checked").val();
                if(($(formid + " #contact_by_field_name_email").attr("aria-required")=="true") && (checkValue == undefined)){
                    if($(formid + " #contact_by_field_name_email").parent('div.formmangr-field').find('.error').text()==""){
                        $(formid + " #contact_by_field_name_email").parent('div.formmangr-field').find('.error').text("This field is required");
                    }
                    $(formid + " #contact_by_field_name_email").parent('div.formmangr-field').find('.error').css("display","block");
                    error_free = false; //return false;
                }
            }
            if($(formid + " #pets_field_name_yes").length >0 || $(formid + " #pets_field_name_no").length >0) {
                var radioValue = $("input[name='petgrp']:checked").val();
                if(($(formid + " #pets_field_name_yes").attr("aria-required")=="true") && (radioValue == undefined)){
                    if($(formid + " #pets_field_name_yes").parent('div.formmangr-field').find('.error').text()==""){
                        $(formid + " #pets_field_name_yes").parent('div.formmangr-field').find('.error').text("This field is required");
                    }
                    $(formid + " #pets_field_name_yes").parent('div.formmangr-field').find('.error').css("display","block");
                    error_free = false; //return false;
                }
                
            }
            if($(formid + " #time_to_call_field_name_from").length >0 || $(formid + " #time_to_call_field_name_to").length >0) {                
                var timeToCallFrom = $("#time_to_call_field_name_from").val();
                var timeToCallTo = $("#time_to_call_field_name_to").val();
                if($("#time_to_call_field_name_from").attr("aria-required")=="true" && ((timeToCallFrom == "") || (timeToCallTo == ""))){
                    if($(formid + " #time_to_call_field_name_from").parent('div.formmangr-field').find('.error').text()==""){
                        $(formid + " #time_to_call_field_name_from").parent('div.formmangr-field').find('.error').text("Time to call must be fill out");
                    }
                    $(formid + " #time_to_call_field_name_from").parent('div.formmangr-field').find('.error').css("display","block");                  
                    error_free = false; //return false;
                }
            }
            if($(formid + " #email_field_name").length >0 && $(formid + " #email_field_name").val() !==""){
                var emailId = $(formid + " #email_field_name").val();    
                if(isEmail(emailId) == false){
                    $(formid + " #email_field_name").parent('div.formmangr-field').find('.error').append("Invalid Email").css("display","block");               
                    error_free = false; //return false;
                }
            }
            if($(formid + " #phone_field_name").length >0 && $(formid + " #phone_field_name").val() !==""){
                var phoneNo = $(formid + " #phone_field_name").val();    
                if(phone_validate(phoneNo) == false){
                    $(formid + " #phone_field_name").parent('div.formmangr-field').find('.error').append("Invalid Phone").css("display","block");               
                    error_free = false; //return false;
                }
            }
            var formId = $(formid).attr("data-form-id"); 
            
            //for KPC api call integration
            var kpc_call = "no";
            var fdataObj = new Object();
            if($(formid + " #kpc_commId").length >0){
                var kpc_comId = $(formid + " #kpc_commId").val();              
                for (var c = 0; c < dataFieldsKPC.length; c++) { 
                    fdataObj = getFields4KPC(formid,dataFieldsKPC[c],fdataObj);              
                }
                fdataObj["communityId"] = kpc_comId;
                kpc_call = "yes";                                 
            }
            
            //alert(error_free);
            if (error_free == true){
                var dataStr = "&form_id="+formId;
                for (var i = 0; i < inputFields.length; i++) { 
                    dataStr = getFieldVal(formid,inputFields[i],dataStr);              
                }
                if (checkValue !== null && checkValue !== undefined){
                    dataStr = dataStr+"&contact_by="+checkValue;
                }
                if (radioValue !== null && radioValue !== undefined){
                    dataStr = dataStr+"&pets="+radioValue;
                }
                if (timeToCallFrom !== null && timeToCallFrom !== "" && timeToCallFrom !== undefined && timeToCallTo !== undefined && timeToCallTo !== null && timeToCallTo !== ""){
                    dataStr = dataStr+"&time_to_call_from="+timeToCallFrom;
                    dataStr = dataStr+"&time_to_call_to="+timeToCallTo;
                }

                //alert(dataStr);                
                //saveFormData(dataStr,formid);	
                saveFormData(dataStr,formid,kpc_call,fdataObj);
            }else{
                event.preventDefault(); 
            }
            
            
            
    });
    function saveFormData(dataStr,formid,kpc_call,fdataObj){    
        //alert(dataStr);
        $("#send-form-loading").css('display','block');
        $.ajax({
                url: fm_plgn_ajax_obj.ajaxurl,
                type:'POST',
                data: "action=save_form_data"+ dataStr, 
                success: function(res){
                    if(kpc_call == "yes"){                        
                        createProspect(fdataObj);
                    }
                    $("#send-form-loading").css('display','none');
                    res = res.slice(0,-1);
                    //alert(res);
                    $("#form-message").html(res);
                    //var formId = str_replace("#","",formid);
                    $(formid)[0].reset();// Reset all form data
                    $(formid+' .multi-select-button').html(defDdText);//reset if multiselect dd
//                    setTimeout(function() { 
//                        $('#form-message').fadeOut('fast'); 
//                    }, 5000); 
                    return false; // Prevent page refresh
                }
          });
        return false;
    }
    function validateInputRequiredFields(formid,ipfid,error_free){
        var fid = " #" + ipfid + "_field_name";
        //alert($(formid + ipfid).length);
        if($(formid + fid).length >0 ) {
            //alert($(formid + fid).val());
            if(($(formid + fid).attr("aria-required")=="true") && ($(formid + fid).val() == "")){
                if($(formid + fid).parent('div.formmangr-field').find('.error').text()==""){
                    $(formid + fid).parent('div.formmangr-field').find('.error').text($(formid + fid).parent().find('label span').html()+ " must be filled out");
                }
                $(formid + fid).parent('div.formmangr-field').find('.error').css("display","block");         
                error_free = false;                
            }
        }
        return error_free;
    }

    function isEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }
    function phone_validate(phno){ 
        //var regexPattern=/([0-9]{10})|(\([0-9]{3}\)\s+[0-9]{3}\-[0-9]{4})/;    // regular expression pattern
        var regexPattern=/^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;//reg exprtn for phn no if types  (541)-753-6010, 541-753-6010, 541753-6010, or 541753-6010.
        return regexPattern.test(phno); 
    } 
    function getFieldVal(formid,ipfid,dataStr){
        var fid = " #" + ipfid + "_field_name";
        if($(formid + fid).length >0 && $(formid + fid).val() !== "") {
            dataStr = dataStr+"&"+ipfid+"="+$(formid + fid).val();
        }
        return dataStr;
    }
    function getFields4KPC(formid,ipfid,fdataObj){
        var fid = " #" + ipfid + "_field_name";
        if($(formid + fid).length >0 && $(formid + fid).val() !== "") {
//            if(ipfid == "unit_type"){                
//                fdataObj[ipfid] = evalKpcBedrooms(formid);
//            }else
                fdataObj[ipfid] = $(formid + fid).val();
        }else{
            fdataObj[ipfid] = null;
        }
        return fdataObj;
    }
    function evalKpcBedrooms(formid){
        var bedArry =[];                
        $(formid + " .formmangr-dd-ms option:selected").each(function () {
            var $this = $(this);
            if ($this.length) {
                //var selText = ($this.text()).split("|");
                if(($this.text().toLowerCase()).indexOf("1 bed") !== -1){
                    bedArry.push("1_BEDROOM");
                }else if(($this.text().toLowerCase()).indexOf("2 bed") !== -1){
                     bedArry.push("2_BEDROOMS");
                }else if((($this.text().toLowerCase()).indexOf("3 bed") !== -1) || (($this.text().toLowerCase()).indexOf("4 bed")) !== -1){
                     bedArry.push("3_OR_MORE_BEDROOMS");
                }
            }
        });
        var unique = bedArry.filter( onlyUnique ); 
        return unique;
    }
    function onlyUnique(value, index, self) { 
        return self.indexOf(value) === index;
    }
    //To change hidden kpcCommunityId value on dropdown selection
    $(".formmangr-dd-single-select").change(function(){        
        var attrkpccomid = $('option:selected', this).attr('kpc-comid');       
        if (typeof attrkpccomid !== typeof undefined && attrkpccomid !== false) {
            //alert(attrkpccomid);
            $("#kpc_commId").val(attrkpccomid);
        }        
    });
//    const API_KEY = "syndication-prospect-TEST-KEY";   //for testing
//    const endpoint = "https://stage-syndication.knockrentals.com/prospect"; //for testing
    const API_KEY = "1VZsLVqhwT3U2XyiQLlkf2EzIZiGyKTn8BjGvfoq";    
    const endpoint = "https://syndication.knockrentals.com/prospect";    
    const createProspect = async (formData) => {
        //alert(formData["unit_type"]);
      const req = {
        "communityId": formData["communityId"],
        "sourceTitle": "Property Website",
        "firstName": formData["first_name"],
        "lastName": formData["last_name"],
        "email": formData["email"],
        "phone": formData["phone"],
        "moveDate": formData["move_in"],
        "unit": formData["unit_type"],
        //"bedrooms": ["STUDIO"],
        "occupants": formData["occupants"],
        //"leaseTermMonths": 12,
        //"minBudget": 1000,
        //"maxBudget": 2000,
        "autorespond": true,
        "message": formData["comment"]
      };

      const res = await fetch(endpoint, {
        body: JSON.stringify(req),
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY
        },
        method: "POST"
      });

      const resp = await res.json();
      
      if (res.status === 200) {
        // Success, e.g. { id: '123' }        
        console.log(resp);
        //alert("KPC call SUCCESS!");
        //return "SUCCESS";
      } else {
        // Failure: details at resp.errorMessage
        //alert(resp);
        console.error(resp);
        //return "ERROR";
      }
    };
    $(document).ready(function() { 

    });
    
})(jQuery);


//if($(formid + " input#first_name_field_name").length >0 ) {
//            //alert($("#" + formid + " #first_name_field_name").val());
//            if(($(formid + " #first_name_field_name").attr("aria-required")=="true") && ($(formid + " #first_name_field_name").val() == "")){
//            $(formid + " #first_name_field_name").parent('div.formmangr-field').find('.error').text("Name must be filled out");    
//            //alert("Name must be filled out");
//                return false;
//            }
