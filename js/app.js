$(function(){

  var edit = false; 
  console.log("JQuery Is Working...");
  $('#task-result').hide();
  fetchTasks();
  // $('[data-toggle="tooltip"]').tooltip();

  $('#search').keyup(function(e){
    if($('#search').val()){

    let search = $('#search').val();
    $.ajax({
      url: 'task-search.php',
      type: 'POST',
      data: { search },
      success: function(reponse){
        var task = JSON.parse(reponse);
        var template = '';
        task.forEach(task => {
          template += `<li>
          ${task.name}
          </li>`;
        });
        $('#container').html(template);
        $('#task-result').show();
      }
    });
    }
    
  });

  $('#task-form').submit(function(e){
    const postData = {
      name: $('#name').val(),
      description: $('#description').val(),
      id: $('#taskId').val(),
    };

    var url =  edit === false ? 'task-add.php' : 'task-update.php';

    $.post(url, postData, function(r){
      var y = r.split('|');
      if(y[0] == 0){
        var Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000});
          Toast.fire({icon: 'info',
          title: y[1]});
      }
      else if(y[0] == 1){
      fetchTasks();
      $('#task-form').trigger('reset');
      var Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000});
        Toast.fire({icon: 'success',
        title: y[1]});
        edit = false;  
      }
      else if(y[0] == 2){
        var Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000});
          Toast.fire({icon: 'error',
          title: y[1]});
      }
      
      //alertify.success(response);
    });
    e.preventDefault();
  });


  function fetchTasks(){
  $.ajax({
    url: 'task-list.php',
    type: 'GET',
    success: function(response){
      var tasks = JSON.parse(response);
      var template = '';
      tasks.forEach(task =>{
        template += `
        <tr dataId="${task.id}">

          <td >${task.id}</td>
          <td>${task.name}</td>
          <td>${task.description}</td>
          <td class="text-center">
          <button class="task-delete btn btn-danger " type="button">
          <i class="fas fa-trash-alt"></i>
          </button>
          </td>

          <td class="text-center">
          <button class="task-item btn btn-primary" type="button">
          <i class="fas fa-edit"></i>
          </button>
          </td>


        </tr>
        `;
      });
      $('#tasks').html(template);
    }
  });
}

$(document).on('click', '.task-delete', function(e) {
  // if(confirm('Are you sure you want to delete it?')){
  e.preventDefault();
  Swal.fire({ 
    title: '¿Seguro que desea eliminar el registro?',
    text: 'Una vez hecho este proceso no podrá recuperar su información', 
    icon: 'warning', 
    showCancelButton: true, 
    confirmButtonText: 'Aceptar', 
    cancelButtonText: "Cancelar", 
    confirmButtonColor: '#3085d6', 
    cancelButtonColor: '#d33', }).then((result) => { 
      if (result.value) { 
  var element = $(this)[0].parentElement.parentElement;
  var id = $(element).attr('dataId');
  $.post('task-delete.php', {id}, function(r){
    var y = r.split('|');
    if(y[0] == 1){
     fetchTasks();
    var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000});
      Toast.fire({icon: 'success',
      title: y[1]}); 
    }
    else if(y[0] == 2){
      var Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000});
        Toast.fire({icon: 'error',
        title: y[1]});
    }
    
    //alertify.success(response);
  });
        //document.formulario_registro.submit(); 
      } 
      return false; 
    });
  
// }
});

$(document).on('click', '.task-item', function() {
  var element = $(this)[0].parentElement.parentElement;
  var id = $(element).attr('dataId');
  $.post('task-single.php', {id}, function(response){
    const task = JSON.parse(response);
    $('#taskId').val(task.id);
    $('#name').val(task.name); 
    $('#description').val(task.description);
    edit = true;
  });
});


});
