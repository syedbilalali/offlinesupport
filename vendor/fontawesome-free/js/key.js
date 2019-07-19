console.log(" Key Setup Running ");
document.addEventListener("keydown", function (event) {
    switch (event.keyCode) {
        case 118 :
            document.getElementById("btnPay").click();
            SweetAlertInfo(" Btn Pay Click ");
            break;
        case 119:
            document.getElementById("btnHold").click();
            SweetAlertInfo(" Btn Pay Click ");
            break;
        case 120:
            document.getElementById("Button4").click();
            SweetAlertInfo(" Btn Pay Click ");
            break;
        case 115:
            document.getElementById("btnReturn").click();
            SweetAlertInfo(" Btn Pay Click ");
            break;
        case 122:
            document.getElementById("btn_Retrieve").click();
            SweetAlertInfo(" Btn Pay Click ");
            break;
        case 27:
            document.getElementById("btnCancel").click();
            SweetAlertInfo(" Btn Cancel Click ");
            break;
        default:
            break;
    }
});