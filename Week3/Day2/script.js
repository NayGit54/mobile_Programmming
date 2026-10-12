$(document).ready(function () {

    // GET & SET
    // These methods are used to read information from the page
    // and also change information on the page.

    $(document).ready(function () {

        // SHOW NAME
        // When the "Show Name" button is clicked,
        // get the text from the student name.
        $("#show-name").click(function () {

            // GET: Read the current text from #student-name
            let name = $("#student-name").text();

            // Display the name we got inside the #output area
            $("#output").text(name);
        });


        // CHANGE NAME
        // When the "Change Name" button is clicked,
        // change the student's name to my name.
        $("#change-name").click(function () {

            // SET: Change the text inside #student-name
            $("#student-name").text("Nayan Burlakoti");
        });


        // SHOW BIO
        // When the "Show Bio" button is clicked,
        // get the HTML content from the student's bio.
        $("#show-bio").click(function () {

            // GET: Read the HTML content from #student-bio
            let bio = $("#student-bio").html();

            // Display the bio content inside the output area
            $("#output").text(bio);
        });


        // GET INPUT
        // When the "Get Input" button is clicked,
        // read whatever the user has typed in the input box.
        $("#get-input").click(function () {

            // GET: Read the value from the input field
            let nickname = $("#nickname-input").val();

            // Display the nickname inside the output area
            $("#output").text(nickname);
        });


        // SET INPUT
        // When the "Set Input" button is clicked,
        // automatically put "jQuery Pro" into the input box.
        $("#set-input").click(function () {

            // SET: Change the value of the input field
            $("#nickname-input").val("This is good");
        });

    });


    // CSS CLASSES

    // adding highlight class to my profile card
    $("#highlight-card").click(function () {
        $("#profile-card").addClass("highlighted");
    });


    // removing highlight class from my profile card
    $("#remove-highlight").click(function () {
        $("#profile-card").removeClass("highlighted");
    });


    // turning dark mode on and off
    $("#toggle-dark").click(function () {
        $("#profile-card").toggleClass("dark-mode");
    });


    // toggling the rounded class on my profile photo
    $("#toggle-rounded").click(function () {
        $("#profile-photo").toggleClass("rounded");
    });



    // CSS METHOD

    // changing my profile card background to red
    $("#red-bg").click(function () {
        $("#profile-card").css("background-color", "#e74c3c");
    });


    // resetting my profile card background to white
    $("#reset-bg").click(function () {
        $("#profile-card").css("background-color", "white");
    });



    // HIDE & SHOW

    // hiding my profile photo slowly
    $("#hide-photo").click(function () {
        $("#profile-photo").hide("slow");
    });


    // showing my profile photo slowly
    $("#show-photo").click(function () {
        $("#profile-photo").show("slow");
    });


    // toggling my bio visibility
    $("#toggle-bio").click(function () {
        $("#student-bio").toggle();
    });



    // FADE EFFECTS

    // fading out my entire profile card
    $("#fade-out").click(function () {
        $("#profile-card").fadeOut();
    });


    // fading my profile card back in
    $("#fade-in").click(function () {
        $("#profile-card").fadeIn();
    });


    // changing my profile card opacity to 50%
    $("#fade-half").click(function () {
        $("#profile-card").fadeTo("slow", 0.5);
    });



    // SLIDE EFFECTS

    // sliding my skills list up and hiding it
    $("#slide-up").click(function () {
        $("#skills-list").slideUp();
    });


    // sliding my skills list down and showing it
    $("#slide-down").click(function () {
        $("#skills-list").slideDown();
    });


    // toggling my skills list between up and down
    $("#slide-toggle").click(function () {
        $("#skills-list").slideToggle();
    });



    // ANIMATE

    // moving my profile card to the right and bringing it back
    // I am using chaining so both animations happen one after another
    $("#animate-card").click(function () {

        $("#profile-card")
            .animate({ marginLeft: "200px" }, 1000)
            .animate({ marginLeft: "0px" }, 1000);

    });



    // EVENTS

    // adding shadow to my photo when the mouse enters
    $("#profile-photo").mouseenter(function () {
        $(this).addClass("shadow");
    });


    // removing shadow when the mouse leaves my photo
    $("#profile-photo").mouseleave(function () {
        $(this).removeClass("shadow");
    });


    // showing the pressed key when I type in my nickname input
    $("#nickname-input").keydown(function (event) {
        $("#output").text("Key pressed: " + event.key);
    });

});