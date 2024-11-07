//Integrantes del grupo: Camila Farro, Camila Nogueira, Camila Rocca, Fernanda Rigali, Stefanie Corone

document.addEventListener('DOMContentLoaded', function() {

  const btnBuscar = document.getElementById('btnGet1');
  const btnAgregar = document.getElementById('btnPost');
  const btnPut = document.getElementById('btnPut');
  const btnEliminar = document.getElementById('btnDelete');
  const btnSendChanges = document.getElementById('btnSendChanges');
  const apiUrl = "https://672c9fcd1600dda5a9f9320c.mockapi.io/users";
  

  function toggleButton(button, inputs) {
    button.disabled = inputs.some(input => input.value.trim() === "");
  }

  document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", () => {
      toggleButton(btnAgregar, [document.getElementById('inputPostNombre'), document.getElementById('inputPostApellido')]);
      toggleButton(btnPut, [document.getElementById('inputPutId')]);
      toggleButton(btnEliminar, [document.getElementById('inputDelete')]);
    });
  });

//Botón Buscar 
btnBuscar.addEventListener('click', function(){
    let busqueda = document.getElementById('inputGet1Id').value
  
    if (busqueda === ""){
        fetch("https://672c9fcd1600dda5a9f9320c.mockapi.io/users")
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
          mostrarResultados(data);
          
        })
        .catch(error => {
          console.error("Fetch error:", error);
        });
    } else {
        fetch(`https://672c9fcd1600dda5a9f9320c.mockapi.io/users/${busqueda}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
          mostrarResultados(data);
        
        })
        .catch(error => {
          console.error("Fetch error:", error);
          alert('No se encontraron resultados para su búsqueda');
        });
    }

})

// Botón Agregar
btnAgregar.addEventListener('click', function() {
    const name = document.getElementById('inputPostNombre').value.trim();
    const lastname = document.getElementById('inputPostApellido').value.trim();

    if (name === '' || lastname === '') {
        alert("Por favor, complete ambos campos.");
        return;
    }

    const nuevoUsuario = {name, lastname };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUsuario)
    })
    .then(response => {
        if (!response.ok) throw new Error("Error al agregar el registro");
        return response.json();
    })
    .then(() => {
        alert("Usuario agregado exitosamente");
        btnBuscar.click();
        fetchAllUsers();
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Hubo un problema al agregar al usuario.");
    });
});


// Modifica datos del usuario
btnPut.addEventListener('click', async () => {
  const id = document.getElementById('inputPutId').value.trim();

  if (id=="") {
    alert('Ingrese un ID válido para modificar');
    return;
  }

  try {
    // Fetch user by ID
    const response = await fetch(`https://672c9fcd1600dda5a9f9320c.mockapi.io/users/${id}`);
if (!response.ok) {
  alert('No se encontró el usuario con ese ID.');
  return;
}
    const user = await response.json();

    // Update user data (assuming input fields for modification)
    user.name = document.getElementById('inputPutNombre').value.trim();
    user.lastname = document.getElementById('inputPutApellido').value.trim();

    // Update user on server (PUT request)
    const updateResponse = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    if (!updateResponse.ok) {
      throw new Error("Error al modificar el usuario");
    }

    // Update user data locally (optional, for immediate display)
    console.log("Usuario modificado exitosamente");
    $('#dataModal').modal('show');
    //document.getElementById('inputPutId').value = '';
    //document.getElementById('inputPutNombre').value = '';
    //document.getElementById('inputPutApellido').value = '';
    //alert("Modificación exitosa");

  } catch (error) {
    console.error("Error al modificar:", error);
    alert("se encontró problemas al modificar el usuario");
  }
});

btnSendChanges.addEventListener('click', async () => {
  const id = document.getElementById('inputPutId').value.trim();
  const name = document.getElementById('inputPutNombre').value.trim();
  const lastname = document.getElementById('inputPutApellido').value.trim();

  if (!name || !lastname) {
    alert("Complete ambos campos");
    return;
  }

  try {
    // Realizar la solicitud PUT para actualizar el usuario
    const response = await fetch(`${apiUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, lastname })
    });

    if (!response.ok) {
      throw new Error('Error al modificar usuario');
    }

    // Cerrar el modal y limpiar campos
    $('#dataModal').modal('hide');
    document.getElementById('inputPutId').value = '';
    document.getElementById('inputPutNombre').value = '';
    document.getElementById('inputPutApellido').value = '';

    alert("Modificación exitosa");
    fetchAllUsers();
  } catch (error) {
    console.error("Error al modificar:", error);
    alert("Se encontró un problema al modificar el usuario");
  }
});

function mostrarError(mensaje) {
  console.error(mensaje);
  alert(mensaje);
}

  
// Botón eliminar

btnEliminar.addEventListener('click', function() {
    const id = document.getElementById('inputDelete').value.trim();
    console.log(id)
    if (id === '') {
        alert("Por favor, ingresa un ID para eliminar.");
        return;
    }
    
    if (confirm(`¿Estás seguro de que deseas eliminar el usuario con ID ${id}?`)) {
        fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al intentar eliminar el usuario.");
            }
            alert("Usuario eliminado exitosamente.");
            document.getElementById('inputDelete').value = '';
            btnBuscar.click();
            fetchAllUsers();
        })
        .catch(error => {
            console.error("Error en la petición de DELETE:", error);
            alert("Hubo un problema al eliminar el usuario.");
        });
    }
});

    function mostrarResultados (data){
    let listaRespuesta = document.getElementById('results')
    listaRespuesta.innerHTML =""
    if (Array.isArray(data)){
        data.forEach(element => {
            listaRespuesta.innerHTML += `
            <li> ID: ${element.id}</li>
            <li> NAME: ${element.name} </li>
            <li> LASTNAME: ${element.lastname}</li>
            <br>`;
        });
    } else {    
        listaRespuesta.innerHTML += `
            <li> ID: ${data.id}</li>
            <li> NAME: ${data.name} </li>
            <li> LASTNAME: ${data.lastname}</li>
            <br>`;
    }}



// Función para actualizar la lista de usuarios
function fetchAllUsers() {
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) throw new Error("Error al obtener lista de usuarios");
      return response.json();
    })
    .then(data => mostrarResultados(data))
    .catch(error => mostrarError("Hubo un problema al cargar la lista de usuarios"));
}

fetchAllUsers();

});

  