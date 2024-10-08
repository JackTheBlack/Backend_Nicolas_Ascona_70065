
socket = io()

let cartButton=document.getElementById("cartButton");
const productsList= document.getElementById("productsList");
let sortBox=document.getElementById('filterStock');
const cartContainer = document.querySelector('.cart-container');
const cartId = cartContainer.getAttribute("cart-id");



const urlParams = new URLSearchParams(window.location.search);
const stockFilter = urlParams.get('stockFilter');

// Verificar si el parámetro 'stockFilter' es igual a '1'
if (stockFilter === '1&') {
  // Si es igual a '1', mostrar el div o marcar el checkbox
  document.getElementById('stockMessage').style.display = 'block';
  document.getElementById('filterStock').checked = true;
}


socket.on('updateStock', async (productId, newStock) => {
  console.log("sdsdsds")

    // Encontrar el elemento del DOM correspondiente al producto que necesita actualización de stock
    const productDiv = document.getElementById(productId);

    if (productDiv) {
        // Buscar el elemento <strong> con id="stock" dentro del div del producto
        const stockElement = productDiv.querySelector('#stock');

        if (stockElement) {
            // Actualizar el contenido con el nuevo stock
            stockElement.innerHTML = `Stock: ${newStock}`;
        }
    }
});

productsList.addEventListener('click', async(event) =>{
  // Verificar si el clic fue en un botón con la clase 'deleteButton'
  

  if (event.target && event.target.classList.contains('addButton')) {
   // Obtener el valor del botón (id del producto)
   const productId = event.target.value;
   
   

    try{
      const response = await fetch(`/carts/${cartId}/product/${productId}`, {
        method: 'POST',
      });
    }catch(e){
        console.log(e)
    }



    
   socket.emit("addToCart",{productId,cartId})}
})



document.querySelectorAll('input[name="sortOrder"]').forEach((radio) => {
    radio.addEventListener('change', function () {
      const sortOrder = this.value;
      window.location.href = `/?sort=${sortOrder}`;
    });
  });



// Filtro de stock
sortBox.addEventListener('change', function () {
    applyFiltersAndSort();
 
    
  });
  
  


  function applyFiltersAndSort() {
    const sortOrder = document.querySelector('input[name="sortOrder"]:checked')?.value || '';
    const filterStock = document.getElementById('filterStock').checked ? '1' : '';
  
    let url = `/?`;
    if (sortOrder) {
      url += `sort=${sortOrder}&`;
    }
    if (filterStock) {
      url += `stockFilter=${filterStock}&`;
    }
  
    window.location.href = url;
 
     
 
  }


  cartButton.addEventListener("click",function (event){

window.location.href="/cart"
  
  })