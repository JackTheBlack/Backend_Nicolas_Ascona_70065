
socket = io()

const addToCartButtons = document.querySelectorAll('.addToCartButton');

addToCartButtons.forEach(button =>  {
  button.addEventListener('click', async () => {
      const productId = button.getAttribute('data-id');
    try {
        await socket.emit('addToCart', productId );

        alert('Producto agregado al carrito');
        
    } catch (error) {
        console.error(err)
        res.status(500).json({ error: 'No se puede agregar al carrito', err });            
    }
  });
});