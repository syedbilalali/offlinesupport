try
{
    function showToast(added, type) {
        alert("Before Toast");
        $().toastmessage(type, added);
       // alert("After Toast");
    }
    function pageLoad(sender, args) {
        $(document).ready(function () {
            console.log("Page load Running..");
            //if ($('#lbl').val() == 'Vaibhav Pandit') {
                var sm = Sys.WebForms.PageRequestManager.getInstance();
                if (!sm.get_isInAsyncPostBack()) {
                    sm.add_beginRequest(onBeginRequest);
                    sm.add_endRequest(onRequestDone);
                }
                function onBeginRequest(sender, args) {
                    $('#divPleaseWait').show();
                }
                function onRequestDone() {
                    $('#divPleaseWait').hide();
                }
                $(".gvDatatable").prepend($("<thead></thead>").append($(this).find(".gvDatatable tr:first"))).dataTable();
                $('.selectCustom').select2();
                $('.selectCustom1').select2({
                    dropdownParent: $('#ContentPlaceHolder1_Panel1')
                });
                $('#txtAddress').blur(function () {
                    var address = $('#txtAddress').val();
                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        url: "http://maps.googleapis.com/maps/api/geocode/json",
                        data: { 'address': address, 'sensor': false },
                        success: function (data) {
                            if (data.results.length) {
                                $('#txtLatitude').val(data.results[0].geometry.location.lat);
                                $('#txtLongitude').val(data.results[0].geometry.location.lng);
                                $('#txtAddress').css('border-color', '');
                            } else {
                                $('#txtAddress').css('border-color', 'red');
                                $('#txtLatitude').val('');
                                $('#txtLongitude').val('');
                            }
                        }
                    });
                });
                //});
                $('.alphaNumber').keyup(function (e) {
                    if (/[^a-zA-Z0-9&/ ]/g.test(this.value)) {
                        this.value = this.value.replace(/[^a-zA-Z0-9 &,/-]/g, '');
                    }
                });
                $('.alpha').keyup(function (e) {
                    if (/[^a-zA-Z ]/g.test(this.value)) {
                        this.value = this.value.replace(/[^a-zA-Z ]/g, '');
                    }
                });
                $('.number').keyup(function (e) {
                    if (/[^0-9]/g.test(this.value)) {
                        this.value = this.value.replace(/[^0-9]/g, '');
                    }
                });
                //$(document).ajaxStart(function () {
                //    $('#divPleaseWait').slideDown();
                //});

                //$(document).ajaxComplete(function () {
                //    $('#divPleaseWait').slideUp(2000);
                //});
            //}
            //}
        });
    }

} catch (err) {
    console.log(" There is error in the Custom.js");
}