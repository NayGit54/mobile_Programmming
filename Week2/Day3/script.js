function calculate(operation) {
    let a = Number(document.getElementById("a").value)
    let b = Number(document.getElementById("b").value)
    let result;
    if (operation == 'add') {
        result = a + b;

    }
    else if (operation == 'sub') {
        result = a - b;
    }
    else if (operation == 'div') {
        result = a / b;
    }
    else {
        result = a * b;
    }

    document.getElementById("result").innerText = "Final Calculation is " + result;



}