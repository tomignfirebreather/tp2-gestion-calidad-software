document.addEventListener('DOMContentLoaded', async (event) => {
    const buscarProducto = document.getElementsByClassName('buscarProducto');
    for (var i = 0; i < buscarProducto.length; i++) {
        buscarProducto[i].addEventListener('click', async function(e) {
            var id = e.target.parentNode.parentNode.id;
            try {
                // Realiza una solicitud POST al servidor con el ID como parte del cuerpo
                const response = await fetch('/products/infoProduct', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'id': id
                    }
                });
                if (response.ok) {
                    window.location.href ='/products/infoProduct';
                } else {
                    console.error('Error en la solicitud al servidor');
                }
            } catch (error) {
                console.error('Error al realizar la solicitud:', error);
            }
        })
    }
});