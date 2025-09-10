window.onload = function() {
    const btnInterac = document.getElementsByClassName('btn-interac');
    for (let i = 0; i < btnInterac.length; i++) {
        btnInterac[i].addEventListener('click', function() {
            document.getElementById("miBoton").innerHTML = `Cantidad: ${btnInterac[i].innerHTML}`;
        });
    }
}