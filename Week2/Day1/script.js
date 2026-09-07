function add() {
    let a = Number(document.getElementById("a").value);
    let b = Number(document.getElementById("b").value);

    let c = a + b;

    document.getElementById("c").innerHTML = "c = " + c;
    console.log("a = " + a + ", b = " + b + ", c = " + c);
}