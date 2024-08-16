const socket = io()

  const deleteProduct = document.querySelectorAll('.deleteProduct');

    deleteProduct.forEach(button =>  {
      button.addEventListener('click', async () => {
          const productId = button.getAttribute('data-id');
        try {

            await socket.emit('deleteProduct', productId );

            alert('Producto eliminado');
            
        } catch (error) {
            console.error(err)
            res.status(500).json({ error: 'No se puede eliminar el producto', err });            
        }
      });
  });

