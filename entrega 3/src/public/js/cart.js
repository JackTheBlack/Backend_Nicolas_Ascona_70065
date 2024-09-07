
const socket = io()


  const deleteProduct = document.querySelectorAll('deleteProduct');
  const productCartList=document.getElementById("productList");
  const cartContainer = document.querySelector('.products-cart-container');
  const cartId = cartContainer.getAttribute("cart-id");
  localStorage.setItem("cartId",cartId);

  // Guardar el cartId en localStorage

  productsList.addEventListener('click',  async (event)=> {
    // Verificar si el clic fue en un botón con la clase 'deleteButton'
    let quantity;
  
    if (event.target && event.target.classList.contains('deleteProduct')) {
     // Obtener el valor del botón (id del producto)
      quantity = event.target.getAttribute('data-quantity'); 
       
     const productId = event.target.value;
     try {
      const response = await fetch(`/carts/${cartId}/product/${productId}`, {
          method: 'DELETE',
      });

      if (response.ok) {
          alert('Producto eliminado del carrito exitosamente!');
          // Recarga la página para reflejar los cambios
          location.reload();
      } else {
        console.log(response,"ggfgf");
          alert('Hubo un problema al eliminar el producto del carritooo.',response);
      }
  } catch (error) {
      console.error('Error:', error);
    
   
  }
  
     socket.emit("removeProduct",{quantity,productId,cartId})}
  })
  




