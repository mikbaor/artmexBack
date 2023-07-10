# REGISTRO NUEVO CHOFER

POST  http://localhost:3005/chofer/create

{
  "dateRegister": "2023-05-19",
  "firstName": "John",
  "lastName": "Doe",
  "license": "ABC123",
  "company": "XYZ Company",
  "images": [
    "<imagen1>",
    "<imagen2>"
  ]
}

<form .action="/create" method="post" enctype="multipart/form-data">
  <input type="file" name="image" />
  <input type="file" name="image" />
  <!-- Otros campos del formulario -->
  <button type="submit">Enviar</button>
</form>



# TODOS LOS CHOFERES

GET  http://localhost:3005/chofer/all




