

function calculate() {

    let science = Number(document.getElementById("science").value);
    let math = Number(document.getElementById("math").value);
    let english = Number(document.getElementById("english").value);
    let computer = Number(document.getElementById("computer").value);
    let nepali = Number(document.getElementById("nepali").value);
    let social = Number(document.getElementById("social").value);
    let accounting = Number(document.getElementById("accounting").value);
    let economics = Number(document.getElementById("economics").value);

    let total = science + math + english + computer +
        nepali + social + accounting + economics;

    let result = document.getElementById("result");
    if (total >= 640) {
        result.innerHTML = "Total Marks: " + total + "/800<br>Result: DISTINCTION";
        result.style.color = "green";

    } else if (total >= 320) {
        result.innerHTML = "Total Marks: " + total + "/800<br>Result: PASS";
        result.style.color = "blue";

    } else {
        result.innerHTML = "Total Marks: " + total + "/800<br>Result: FAIL";
        result.style.color = "red";
    }

}