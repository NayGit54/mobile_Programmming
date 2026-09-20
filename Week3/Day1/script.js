$(document).ready(function () {

    // creating different colors for my profile card
    let colors = [
        "#252525",
        "#3b3b3b",
        "#4a3f35",
        "#36413c",
        "#493b4a"
    ];

    // keeping track of my current color
    let colorIndex = 0;


    // giving my card the first color when I enter the page
    $(".profile-card").css("background-color", colors[colorIndex]);


    // when I click the QR button, I want to open my QR popup
    $("#qr").click(function () {

        // removing the old QR code
        $("#qrcode").empty();

        // adding my profile information
        let profileInformation =
            "Name: Nayan R Burlakoti\n" +
            "Address: Raniban, Kathmandu\n" +
            "Email: nayan@example.com\n" +
            "Phone: 9768770214\n" +
            "Program: BSc IT\n" +
            "College: PGS";

        // creating my QR code
        new QRCode(document.getElementById("qrcode"), {
            text: profileInformation,
            width: 180,
            height: 180
        });

        // showing my QR popup
        $("#qrPopup").css("display", "flex");
    });


    // when I click the X button, I want to close the QR popup
    $("#closePopup").click(function () {

        // hiding my QR popup
        $("#qrPopup").hide();

        // moving to the next color
        colorIndex++;

        // starting from the first color again after reaching the last one
        if (colorIndex >= colors.length) {
            colorIndex = 0;
        }

        // changing the color of my profile card
        $(".profile-card").css(
            "background-color",
            colors[colorIndex]
        );

    });


    // closing the popup when I click outside the QR box
    $("#qrPopup").click(function (event) {

        // checking if I clicked the popup background
        if (event.target === this) {

            // hiding the popup
            $("#qrPopup").hide();

            // changing the card color
            colorIndex++;

            if (colorIndex >= colors.length) {
                colorIndex = 0;
            }

            // applying the new color to my card
            $(".profile-card").css(
                "background-color",
                colors[colorIndex]
            );
        }

    });

});