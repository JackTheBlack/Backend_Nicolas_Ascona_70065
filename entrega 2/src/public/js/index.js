
const socket = io()

let user;
let chatBox = document.getElementById("chatBox")
let button =document.getElementById("deleteBtn");
let btn=document.getElementById("deleteBtn");
let addProductForm=document.getElementById("addProductForm");
let productsList = document.getElementById('productsList');

//socket.emit('message', "Soy el mensaje enviados")


///////////////////////ADDD//////////////////////////////////////////

addProductForm.addEventListener('click', ()=> {
            // Prevenir el envío del formulario

            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const code = document.getElementById('code').value;
            const price = Number(document.getElementById('price').value);
            const status = document.getElementById('status').checked;
            const stock = Number(document.getElementById('stock').value);
            const category = document.getElementById('category').value;
            const thumbnails = document.getElementById('thumbnails').value.split(',');

            const productData = {
               
                title: title,
                description: description,
                code: code,
                price: price,
                status: status,
                stock: stock,
                category: category,
                thumbnails: thumbnails
            };


            console.log(productData);
            socket.emit("addProduct",productData);
            // Aquí puedes enviar la data a tu servidor o realizar cualquier otra acción necesaria
        });

        socket.on("deleted",data=>{
          const id=Number(data)
          const productElement = document.getElementById(id);
          if (productElement) {
            productElement.remove();
          }
        })



        socket.on("newList",data=>{
          const newProduct = document.createElement('li');
    newProduct.textContent = `${data.id} - $${data.price} `;
    
    const deleteButton = document.createElement('button');
    deleteButton.style.marginLeft = '5px';
    deleteButton.className = 'deleteButton';
    deleteButton.value = data.id;
    deleteButton.textContent = 'Eliminar';

    newProduct.appendChild(deleteButton);
    productsList.appendChild(newProduct);
        })

/////////////////////////DELETE////////////////////////////////////////////////////////

productsList.addEventListener('click', function(event) {
     // Verificar si el clic fue en un botón con la clase 'deleteButton'
     if (event.target && event.target.classList.contains('deleteButton')) {
      // Obtener el valor del botón (id del producto)
      const productId = event.target.value;
      event.target.closest('li').remove();
      socket.emit("delete",productId)
  }

 
})

/*
btn.addEventListener("click",()=>{
  let id=document.getElementById("productId");

  socket.emit("boton",id.value)
})
*/
/////////////////////// ADD PRODUCT///////////////////////////



chatBox.addEventListener("keyup", evt => {
  if (evt.key === "Enter") {
      if (chatBox.value.trim().length > 0) {
          socket.emit("message", { user: "yo", message: chatBox.value })
          chatBox.value = ""
      }
  }
})


socket.on("messageLogs", data => {
  let log = document.getElementById("messageLogs")
  let messages = ""
  
  data.forEach(message => {
      messages = messages + `Usuario dice: ${message.message}</br>`
  })
  log.innerHTML = messages
})













//logica para traer el contenido del input en el formulario