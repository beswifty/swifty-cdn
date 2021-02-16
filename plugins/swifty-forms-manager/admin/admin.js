(function ($) {
    var allPanels = $('.fb-fields-accordion .accordion > dd').hide();
    $('.fb-fields-accordion .accordion > dt > a').click(function () {
        $this = $(this);
        $target = $this.parent().next();
        $('span.toggle').html('+');
        $('span.toggle', this).html('-');
        if (!$target.hasClass('active')) {
//         activepanelH = ($('.accordion > dd.active').height())+($('.accordion > dt.active').height());  
//          console.log(activepanelH);
            allPanels.removeClass('active').slideUp();
            $('.accordion > dt').removeClass('active');
            $target.addClass('active').slideDown();
            $(this).parent().addClass('active');
//        $('html, body').animate({
//            scrollTop: $target.offset().top - activepanelH - 180
//        }, 600);
        } else {
            $target.removeClass('active').slideUp();
            $(this).parent().removeClass('active');
        }

        return false;
    });
    
    //to expand and minimize email notifications accordian
    var enotificationsAllPanels = $('.email-notifications-accordion .accordion > dd').hide();
    $("#tab-3").on("click",".email-notifications-accordion .accordion > dt > a", function(e){    
        e.preventDefault();
        //alert("hello");
        $this = $(this);
        $target = $this.parent().next();
//        $('span.toggle').html('+');
//        $('span.toggle', this).html('-');
        if (!$target.hasClass('active')) {
            enotificationsAllPanels.removeClass('active').slideUp();
            $('.email-notifications-accordion .accordion > dt').removeClass('active');
            $target.addClass('active').slideDown();
            $(this).parent().addClass('active');
        } else {
            $target.removeClass('active').slideUp();
            $(this).parent().removeClass('active');
        }
        return false;
    });
    
    function field_enabling() {
        $('li.single-fb-field').each(function () {
            var fieldname = $(this).attr('field-data');
            if ($('input[type=checkbox]', this).is(':checked')) {
                $('.fb-fields-accordion dl.accordion dt[field-trigger="' + fieldname + '"]').addClass('open');
            }
        });
        $('.fb-fields-accordion .accordion').addClass('show');
        $('.fb-fields-accordion .loader').removeClass('show');
    }
    //To load all existing tinymce editors
    function loadTinymceEditors(){
        var notif_txt_editors = $('#e_notification_list dt').length;
        for(var counter=1; counter<=notif_txt_editors; counter++){
            var editorId = '#econt_editor_'+counter;
            
            //init tineMCE
            tinyMCE.init({
                selector : "textarea"+editorId,
                menubar: false,
                toolbar: 'mybutton undo redo styleselect bold italic alignleft aligncenter alignright bullist numlist outdent indent code',
                setup: function(editor) {
                    var jsonArry = [];
                    var checkbxList = ["first_name","last_name","city","state","street_address","zip","phone","email","occupants","move_in","comment","unit_type","referral","pets","contact_by","time_to_call_from","time_to_call_to"];
                    $(':checkbox:checked').each(function(i){
                        var lblVal = $(this).val();
                        var lblTxt = lblVal.replace("_", " ");
                        lblTxt = lblTxt.charAt(0).toUpperCase()+lblTxt.slice(1);
                        if(checkbxList.indexOf($(this).val()) > -1){
                            jsonArry.push({
                                text: lblTxt,
                                type: "menuitem",
                                onclick: function() {editor.insertContent('&nbsp;{'+lblVal+'}&nbsp;');}
                            });
                        }                        
                    });
                    jsonArry.push({text: "Site url",onclick: function() {editor.insertContent('&nbsp;{site_url}&nbsp;');},type: "menuitem"});
                    jsonArry.push({text: "Form name",onclick: function() {editor.insertContent('&nbsp;{form_name}&nbsp;');},type: "menuitem"});
                    jsonArry.push({text: "All fields",onclick: function() {editor.insertContent('&nbsp;{all_fields}&nbsp;');},type: "menuitem"});
                editor.addButton('mybutton', {
                    type: 'menubutton',
                    text: 'Magic codes',
                    icon: false,
                    menu: jsonArry
                  });
                }
            });
            tinyMCE.execCommand('mceAddEditor', true, editorId);  
        }        
    }
    
    $(window).load(function () {
        //alert(tinymce.majorVersion + '/////' + tinymce.minorVersion);
        field_enabling();
        loadTinymceEditors();
    });
    
    $('li.single-fb-field input[type=checkbox]').change(function () {
        var fieldname = $(this).parent().parent().attr('field-data');
        if ($(this).is(':checked')) {
            $('.fb-fields-accordion dl.accordion dt[field-trigger="' + fieldname + '"]').addClass('open');
        } else {
            $('.fb-fields-accordion dl.accordion dt[field-trigger="' + fieldname + '"]').removeClass('open');
        }
    });
    //To show hide conditions for email notifications
    $("#tab-3").on("click","#showAdvCondChk", function(e){  
           if ($(this).parent().parent().find("#showAdvCondChk").is(':checked')) {              
               $(this).parent().parent().find(".common-fieldgroup.advCond").show();
           } else{               
               $(this).parent().parent().find(".common-fieldgroup.advCond").hide();
           }
           
    });
    
    //To add new email notification dynamically
    $('#add_email_notification').click(function (e) {
        e.preventDefault();   
        var fieldsDDHtml = getSelectedFieldsDD("default");
        var notif_cnt = ($('#e_notification_list dt').length)+1 ;  
        var default_email = $("#email_add_pinfo").val();
        
        var appndStr ='<dt field-trigger="email_notification_'+notif_cnt+'" class=""><a href="#" class="menuName">Email Notification '+notif_cnt+'</a><span remove-index="'+notif_cnt+'" class="removeENotif">Remove</span></dt>';
        appndStr = appndStr + '<dd class="sfb-field-settings dd-notif-entry" style="display:none">';
        appndStr = appndStr + '<div class="common-fieldgroup"><label for="form_email_to">To:</label><input type="text" name="form_email_to_'+notif_cnt+'" value="'+default_email+'" class="sfb-common-field email-to-selectn"></div>';
        appndStr = appndStr + '<div class="common-fieldgroup"><label for="form_email_to">Subject:</label><input type="text" name="form_email_subject_'+notif_cnt+'" value="New form entry for {form_name}" class="email-sub-selectn"></div><br>'; 
        appndStr = appndStr + '<div class="common-fieldgroup"><input id="showAdvCondChk" type="checkbox" name="advanceCondtn_'+notif_cnt+'" value="no" /><span>Do you want to add condition</span></div><br>';
        appndStr = appndStr + '<div class="common-fieldgroup advCond" style="display:none;"><label for="form_onfield_conditn">Select field for condition:</label><select id="form_field_conditn_'+notif_cnt+'" name="form_field_conditn_'+notif_cnt+'" class="fieldsToAddConditionDd notif-cond-selectn" placeholder="Select">'+fieldsDDHtml+'</select></div>';
        appndStr = appndStr + '<div class="common-fieldgroup advCond" style="display:none;"><label for="form_onfield_conditn_val">Value:</label><input type="text" name="form_onfield_conditn_val_'+notif_cnt+'" value="" class="sfb-common-field notif-cond-val-selectn"></div><br>';
        appndStr = appndStr + '<textarea id="econt_editor_'+notif_cnt+'" name="econt_editor_'+notif_cnt+'" style="width: 99%; height: 150px;">{all_fields}</textarea>';
        appndStr = appndStr + '</dd>'
        $("#e_notification_list dl.accordion").append(appndStr);
        $('#email_notifications_count').val(notif_cnt); //set email notifications count to hidden field
        var editorId = '#econt_editor_'+notif_cnt;
                      
        //init tineMCE
        tinyMCE.init({
            selector : "textarea"+editorId,
            menubar: false,
            toolbar: 'mybutton undo redo styleselect bold italic alignleft aligncenter alignright bullist numlist outdent indent code',
            setup: function(editor) {
            var jsonArry = [];
            var checkbxList = ["first_name","last_name","city","state","street_address","zip","phone","email","occupants","move_in","comment","unit_type","referral","pets","contact_by","time_to_call_from","time_to_call_to"];
            $(':checkbox:checked').each(function(i){  
                var lblVal = $(this).val();
                var lblTxt = lblVal.replace("_", " ");
                lblTxt = lblTxt.charAt(0).toUpperCase()+lblTxt.slice(1);
                if(checkbxList.indexOf($(this).val()) > -1){
                    jsonArry.push({
                        text: lblTxt,
                        type: "menuitem",
                        onclick: function(){editor.insertContent('&nbsp;{'+lblVal+'}&nbsp;');}
                    });
                }                
            });         
            jsonArry.push({text: "Site url",onclick: function() {editor.insertContent('&nbsp;{site_url}&nbsp;');},type: "menuitem"});
            jsonArry.push({text: "Form name",onclick: function() {editor.insertContent('&nbsp;{form_name}&nbsp;');},type: "menuitem"});
            jsonArry.push({text: "All fields",onclick: function() {editor.insertContent('&nbsp;{all_fields}&nbsp;');},type: "menuitem"});
            editor.addButton('mybutton', {
                type: 'menubutton',
                text: 'Magic codes',
                icon: false,
                menu: jsonArry
              });
            }     
//            toolbar: 'undo redo | formatselect | ' +
//            'bold italic backcolor | alignleft aligncenter ' +
//            'alignright alignjustify | bullist numlist outdent indent | ' +
//            'removeformat'             
        });
        tinyMCE.execCommand('mceAddEditor', true, editorId);                                      
    });
    
     //To remove selected email notification
    $("#tab-3").on("click",".removeENotif", function(e){ //user click on remove text
        e.preventDefault(); 
        var confirmDelete = confirm("Are you sure you want to delete this notification entry?");
        if (confirmDelete == true) {
            tinyMCE.execCommand('mceFocus', false, '#econt_editor_'+$(this).attr('remove-index'));                    
            tinyMCE.execCommand('mceRemoveControl', false, '#econt_editor_'+$(this).attr('remove-index'));
            $(this).parent('dt').next('dd').remove(); 
            $(this).parent('dt').remove();
            $('.dd-notif-entry').each(function(i, obj) {
                var n = i+1;
                $(this).prev("dt").attr("field-trigger","email_notification_"+n);
                $(this).prev("dt").find(".menuName").text('Email Notification'+n);
                $(this).prev("dt").find(".removeENotif").attr('remove-index',n);

                $(this).find(".email-to-selectn").attr("name","form_email_to_"+n);
                $(this).find(".email-sub-selectn").attr("name","form_email_subject_"+n);
                $(this).find("select").attr("id","form_field_conditn_"+n);
                $(this).find(".notif-cond-val-selectn").attr("name","form_onfield_conditn_val_"+n);
                $(this).find("textarea").attr("id","econt_editor_"+n);
            });
            var notif_cnt = $('#e_notification_list dt').length;
            $('#email_notifications_count').val(notif_cnt);
        }
    });
    function getSelectedFieldsDD(selectedVal){        
        var returnTxt = '<option value="--Select--">--Select--</option>';        
        var checkbxList = ["first_name","last_name","city","state","street_address","zip","phone","email","occupants","move_in","comment","unit_type","referral","pets","contact_by","time_to_call_from","time_to_call_to"];
        $(':checkbox:checked').each(function(i){             
            if(checkbxList.indexOf($(this).val()) > -1){
                //alert("#"+"mgc_"+$(this).val());
                var selectedTxt = "";
                if(selectedVal == "cond_"+$(this).val()){
                    var selectedTxt = "selected";
                }
                returnTxt = returnTxt+'<option value="'+"cond_"+$(this).val()+'" '+selectedTxt+'>'+$(this).val()+'</option>';

            }
        });
        return returnTxt;
    }
    
    $(document).ready(function() {   
        //For display tabs
        $("#tab-2,#tab-3").css("display","none");
        $('ul.fb-tabs li').click(function(e){ 
            //alert($(this).attr("data-trigger"));
            tabName =$(this).attr("data-trigger");
            $(".tab-content").css("display","none");
            $(".single-tab").removeClass("active");
            $(tabName).css("display","block");
            $(this).addClass("active");
            if(tabName == "#tab-3"){
               showSelectedMagicCodes();
               updateDDCondFields();
               updateDDInTinymceEditor();
               displayDefaultEmailNotif();
            }
        });

        //For adding dynamic input fields
        //For Unit Type
	var wrapper = $(".unit_type_options"); //Fields wrapper
	var add_button = $("#unit_type_opbtn"); //Add button ID
	var max_fields = 20; //maximum input boxes allowed	
        var x = ($('.dyn_ut_ip_opt').length)+1;//initlal dynamic text box count for unit type       
	$(add_button).click(function(e){ //on add input button click
		e.preventDefault(); 
		if(x < max_fields){ //max input box allowed			
			$(wrapper).append('<div data-index="'+x+'"><label>Option Text</label><input type="text" class="dyn_ut_ip_opt" name="unit_type_option_'+x+'"/><label>Option Value</label><input type="text" name="val_unit_type_option_'+x+'"/><a href="#" class="remove_field">Remove</a></div>'); //add input box
                        x++; //text box increment
		}
	});	
	$(wrapper).on("click",".remove_field", function(e){ //user click on remove text
		e.preventDefault(); $(this).parent('div').remove(); x--;
                $('.dyn_ut_ip_opt').each(function(i, obj) {
                    var n = i+1;
                    $(this).attr("name","unit_type_option_"+n);
                    $(this).parent("div").attr("data-index",n);
                });
	});
        
        //For Referral
        var wrapper1 = $(".referral_options"); //Fields wrapper
	var add_button1 = $("#referral_opbtn"); //Add button ID         	
	var y = ($('.dyn_ref_ip_opt').length)+1;//initlal dynamic text box count for referral
	$(add_button1).click(function(e){ //on add input button click
		e.preventDefault();                
		if(y < max_fields){ //max input box allowed			
			$(wrapper1).append('<div data-index="'+y+'"><label>Option Text</label><input type="text" class="dyn_ref_ip_opt" name="referral_option_'+y+'"/><label>Option Value</label><input type="text" class="dyn_ref_ip_opt_val" name="val_referral_option_'+y+'"/><a href="#" class="remove_field">Remove</a></div>'); //add input box
                        y++; //text box increment
		}
	});	
	$(wrapper1).on("click",".remove_field", function(e){ //user click on remove text
		e.preventDefault(); $(this).parent('div').remove(); y--;
                $('.dyn_ref_ip_opt').each(function(i, obj) {
                    var n = i+1;
                    $(this).attr("name","referral_option_"+n);
                    $(this).parent("div").attr("data-index",n);
                    $(this).siblings(".dyn_ref_ip_opt_val").attr("name","val_referral_option_"+n);
                });
//                $('.dyn_ref_ip_opt_val').each(function(i, obj) {
//                    var n = i+1;
//                    $(this).attr("name","val_referral_option_"+n);
//                });
	});
        
        function showSelectedMagicCodes(){
            $(".show-hide").css("display","none");
            var checkbxList = ["first_name","last_name","city","state","street_address","zip","phone","email","occupants","move_in","comment","unit_type","referral","pets","contact_by","time_to_call_from","time_to_call_to"];
            $(':checkbox:checked').each(function(i){                
                if(checkbxList.indexOf($(this).val()) > -1){
                    //alert("#"+"mgc_"+$(this).val());
                    $("#"+"mgc_"+$(this).val()).css("display","block");
                }
            });
        }
        function updateDDCondFields(){ 
            var notif_cnt = ($('#e_notification_list dt').length);            
            for(var counter=1; counter<=notif_cnt; counter++){              
                var selectedVal = $('#form_field_conditn_'+counter+' :selected').val();
                //alert(selectedVal);
                var ddHtml = getSelectedFieldsDD(selectedVal);
                $("#form_field_conditn_"+counter).html(ddHtml);
            }
            
        }
        function updateDDInTinymceEditor(){
            var notif_cnt = ($('#e_notification_list dt').length) ; 
            tinyMCE.editors=[]; // remove any existing references
                tinyMCE.remove(); 
            //tinymce.EditorManager.editors = []; 
            for(var counter=1; counter<=notif_cnt; counter++){
                var editorId = '#econt_editor_'+counter;
                
                //tinyMCE.get(editorId).remove();    
                //init tineMCE
                
                tinyMCE.init({
                    selector : "textarea"+editorId,
                    menubar: false,
                    toolbar: 'mybutton undo redo styleselect bold italic alignleft aligncenter alignright bullist numlist outdent indent code',
                    setup: function(editor) {
                        var jsonArry = [];
                        var checkbxList = ["first_name","last_name","city","state","street_address","zip","phone","email","occupants","move_in","comment","unit_type","referral","pets","contact_by","time_to_call_from","time_to_call_to"];
                        $(':checkbox:checked').each(function(i){
                            var lblVal = $(this).val();
                            var lblTxt = lblVal.replace("_", " ");
                            lblTxt = lblTxt.charAt(0).toUpperCase()+lblTxt.slice(1);
                            if(checkbxList.indexOf($(this).val()) > -1){
                                jsonArry.push({
                                    text: lblTxt,
                                    type: "menuitem",
                                    onclick: function() {editor.insertContent('&nbsp;{'+lblVal+'}&nbsp;');}
                                });
                            }                        
                        });
                        jsonArry.push({text: "Site url",onclick: function() {editor.insertContent('&nbsp;{site_url}&nbsp;');},type: "menuitem"});
                        jsonArry.push({text: "Form name",onclick: function() {editor.insertContent('&nbsp;{form_name}&nbsp;');},type: "menuitem"});
                        jsonArry.push({text: "All fields",onclick: function() {editor.insertContent('&nbsp;{all_fields}&nbsp;');},type: "menuitem"});
							
                        editor.addButton('mybutton', {
                            type: 'menubutton',
                            text: 'Magic codes',
                            icon: false,
                            menu: jsonArry
                        });
                    }
                });                
            }        
        }
        function displayDefaultEmailNotif(){
            var notf_no = $("#tab-3 dl.accordion dt").length;
            if(notf_no==0){
                $("#add_email_notification").click();
                $('dl.accordion dt[field-trigger="email_notification_1"]').addClass('active');
                $('dl.accordion dt[field-trigger="email_notification_1"]').next("dd").addClass('active').css("display","block");
            }               
        }
        
    });
})(jQuery);


