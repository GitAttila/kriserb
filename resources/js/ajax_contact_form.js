function initFormListener() {
    
    console.log("inside of a function InitFormListener");
    
    $(".contact-submit").on( "click", function() {
        console.log("click event: .contact-submit button")
        $( "#contact-form" ).submit();
    });

    $("#contact-form").submit(function(e) {
        e.preventDefault();

        console.log("Form submitted listener called");

        var inputElements = $("#contact-form").find('input, textarea, select');
        var formValues = {};

        inputElements.each(function() {
            if (this.name) {
                if (this.type == "checkbox" || this.type == "radio") {
                    if (this.checked) {
                        formValues[this.name] = this.value;
                    }
                }else {
                    formValues[this.name] = this.value;
                }
            }
        });

        //console.log("formValues : " + JSON.stringify(formValues));
        $("#send-result").css( "color", "red" );

        $.ajax({
            url: "resources/js/handleajaxform.php",
            method: "POST",
            data: formValues,
            success: function(result) {

                console.log("result : " + JSON.stringify(result));

                //$('div[data-error-id]').text("");
                //$("#send-result").text("");

                if (Object.keys(result.errors).length > 0) {
                    for (var inputName in result.errors) {
                        console.log("error in " + inputName + ": " + result.errors[inputName]);

                        $('div[data-error-id="' + inputName + '"]').text(result.errors[inputName]).hide().slideDown().delay(3000).slideUp();
                        //$('*[name="' + inputName + '"]').effect("shake");
                    }
                }else {
                    console.log("Success");
                    $("#send-result").text("Thank you. Your message has been sent.");
                    $("#send-result").css( "color", "green" );
                    $("#send-result").slideDown().delay(4000).slideUp().promise().done(function() { 
                        $('input').val("");
                        $('textarea').val("");
                    });
                }
            },
            error: function() {
                $("#send-result").text("Sorry... Your message could not have been delivered.");
                $("#send-result").slideDown().delay(4000).slideUp();
                //alert("Formulář se nepodařilo odeslat");
            }
        })
    });
    
}