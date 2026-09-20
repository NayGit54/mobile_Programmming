$(document).ready(function () {

    // when I click the QR button, I want to open my QR popup
    $("#qr").click(function () {

        // removing any old QR code before creating a new one
        $("#qrcode").empty();

        // adding my profile information inside the QR code
        let profileInformation =
            "Name: Nayan R Burlakoti\n" +
            "Address: Raniban, Kathmandu\n" +
            "Email: nayan@example.com\n" +
            "Phone: 9768770214\n" +
            "Program: BSc IT\n" +
            "College: PGS";

        // creating the QR code inside my qrcode div
        new QRCode(document.getElementById("qrcode"), {
            text: profileInformation,
            width: 180,
            height: 180
        });

        // showing my QR popup
        $("#qrPopup").css("display", "flex");
    });


    // when I click the X button, I want to close the popup
    $("#closePopup").click(function () {

        // hiding my QR popup
        $("#qrPopup").hide();

    });


    // I can also close the popup by clicking outside the QR box
    $("#qrPopup").click(function (event) {

        // checking if I clicked the popup background
        if (event.target === this) {

            // hiding the popup
            $("#qrPopup").hide();

        }

    });

});