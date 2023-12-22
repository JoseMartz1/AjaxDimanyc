$(document).ready(function () {
	function validar_beneficiario(beneficiario) {
		var mensaje = true;
		var patt = /[A-Z]{1}[AEIOUX]{1}[A-Z]{2}[0-9]{2}(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[HM]{1}(AS|BC|BS|CC|CS|CH|CL|CM|DF|DG|GT|GR|HG|JC|MC|MN|MS|NT|NL|OC|PL|QT|QR|SP|SL|SR|TC|TS|TL|VZ|YN|ZS|NE)[B-DF-HJ-NP-TV-Z]{3}[0-9A-Z]{1}[0-9]{1}$/;
		var test = patt.test(beneficiario.toUpperCase());

		if (beneficiario.trim().length == 0) {
			mensaje = "La CURP es requerida, no debe contener caracteres especiales ni espacios";
		} else if (test == false) {
			//if(beneficiario.trim().length == 18){
			mensaje = "CURP invÃ¡lida";
			//}
		}

		return mensaje;
	}
	$("input[name='CURP']").on("keyup change", function () {
		$("#msg").text("");
		$("#resultado").html("");

		var beneficiario = $(this).val();

		if (beneficiario.length == 18) {
			var mensaje = validar_beneficiario(beneficiario);

			if (mensaje == true) {
				$("#buscar").attr("disabled", false);

			} else {
				$("#buscar").attr("disabled", true);
				$("#msg").text(mensaje);
			}
		} else {
			$("#buscar").attr("disabled", true);
			$("#msg").text("CURP invÃ¡lida");
		}

	});
	$("input[name='CURP']").on("keypress", function (e) {
		$("#msg").text("");
		$("#resultado").html("");

		var beneficiario = $(this).val();
		if (beneficiario.length == 18) {
			var mensaje = validar_beneficiario(beneficiario);

			if (mensaje == true) {
				$("#buscar").attr("disabled", false);
				if (e.which == 13) {
					buscar_beneficiario();
				}
			} else {
				$("#buscar").attr("disabled", true);
				$("#msg").text(mensaje);
			}
		} else {
			$("#buscar").attr("disabled", true);
			$("#msg").text("CURP invÃ¡lida");
		}

	});

	$("#login").on("click", function (e) {
		var habilitar = $("#captcha").is(':visible');
		if (habilitar == true) {
			Swal.fire({
				allowOutsideClick: false,
				html: '<span class = "normal">Ingresa tu usuario</span><br>' +
					'<input id="swal-input1" class="swal2-input"><br>' +
					'<span class = "normal">Ingresa tu contraseÃ±a</span><br>' +
					'<input id="swal-input2" class="swal2-input" type = "password">',
				width: 500,
				confirmButtonColor: '#10312B',
				confirmButtonText: 'Siguiente'
			}).then((result) => {
				if (result.isConfirmed) {
					let user = $('#swal-input1').val();
					let pass = $('#swal-input2').val();
					$.ajax({
						type: "POST",
						url: "metodos/usuarios.php",
						data: {
							user: user,
							pass: pass,
						},
						dataType: "json",
						crossDomain: true,
						success: function (data) {
							if (data.VALIDADO == "1") {
								$("#captcha").hide();
								Swal.fire({
									text: 'Bienvenido',
									confirmButtonColor: '#10312B',
									confirmButtonText: 'Continuar'
								});
							} else {
								Swal.fire({
									text: 'Usuario o contraseÃ±a no validos',
									confirmButtonColor: '#691C32',
									confirmButtonText: 'Salir'
								});
							}
						}
					});
				}
			})
		} else {
			Swal.fire({
				allowOutsideClick: false,
				text: 'Â¿Desea cerrar la sesiÃ³n?',
				width: 500,
				confirmButtonColor: '#691C32',
				confirmButtonText: 'Cerrar',
				showDenyButton: true,
				denyButtonText: 'Continuar',
				denyButtonColor: '#10312B',
			}).then((result) => {
				if (result.isConfirmed) {
					$("#captcha").show();
				}
			})
		}
	});

	function buscar_beneficiario() {
		var habilitar = $("#captcha").is(':visible');
		var formulario = $("#formulario").serialize();
		formulario = formulario;
		var sub_formulario = formulario.substring(0, 23);
		var sub_formulario2 = formulario.substring(24, formulario.length);
		sub_formulario = sub_formulario.toUpperCase();
		formulario = sub_formulario + '&' + sub_formulario2 + '&habilitar=' + habilitar;
		$("#buscar").attr("disabled", true);
		$("#text").attr("disabled", true);
		//Habilitar timer 
		setTimeout(() => { $("#buscar").attr("disabled", false); }, "5000");
		setTimeout(() => { $("#text").attr("disabled", false); }, "5000");
		$.ajax({
			type: "POST",
			url: "metodos/wrapper.php",
			data: formulario,
			data: formulario,
			dataType: "json",
			crossDomain: true,
			success: function (data) {
				if (habilitar == true) {
					grecaptcha.reset();
				}
				if (data.status == 200) {
					var now = new Date();
					var hours = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
					var status = data.datos.SITUACION_INSCRIPCION_ACTUAL;
					if (status == "ACTIVA" || status == "EN REVISION" || status == "BAJA") {
						//Direccion de adscripcion
						let sucursalOrigen = data.datos.SUCURSAL_ADSCRIPCION;
						let direccionOrigen = data.datos.DIRECCION_ADSCRIPCION;
						//Variables globales 
						var periodos = data.datos.PERIODOS_2023;
						//Primero periodo 2023
						var emision2023 = data.datos.EMISION_2023;
						var modalidadFebrero2023 = data.datos.FORMA_ENTREGA_APOYO_2023;
						var liquidadoraFebrero2023 = data.datos.INSTITUCION_LIQUIDADORA_2023;
						var pagadoFeb2023 = data.datos.PAGADO_2023;
						if (emision2023 == null || emision2023 == undefined || emision2023 == "") {
							emision2023 = "0";
						}
						if (pagadoFeb2023 == "" && emision2023 == "1") {
							pagadoFeb2023 = "0";
						}
						//Grupo Familiar
						var grupo = data.datos.DATOS_FAMILIA;
						var banco = data.datos.BANCARIZACION;
						//Fecha del sistema y conversion
						var fechaSistema = new Date();
						var convfSistema = Date.parse(fechaSistema);
						//SePARAR DATOS
						var liquidadoraFebrero = separarLiquidadora(data.datos.LIQUIDADORA_FEB);
						var liquidadoraJunio = separarLiquidadora(data.datos.LIQUIDADORA_JUN);
						var liquidadoraSeptiembre2022 = separarLiquidadora(data.datos.LIQUIDADORA_SEPOCT_2022);
						//Se mandan a traer los indices de los array
						//Variables Febrero
						var sub_LiquidadoraFebrero = liquidadoraFebrero[0];
						var sub_ModalidadFebrero = liquidadoraFebrero[1];
						//Variables Junio
						var sub_LiquidadoraJunio = liquidadoraJunio[0];
						var sub_ModalidadJunio = liquidadoraJunio[1];
						//Variables Septiembre2022
						var sub_LiquidadoraSeptiembre2022 = liquidadoraSeptiembre2022[0];
						var sub_ModalidadSeptiembre2022 = liquidadoraSeptiembre2022[1];
						//Programa
						var programaActual = siglas(data.datos.PROGRAMA)
						//Variable pendiente para el buzon de mensajes
						let pendiente = 0;
						let formulario1 = 0;
						let formulario2 = 0;
						//let formulario3 = 0;
						let formulario4 = 0;
						//let formulario5 = 0;
						//Arreglo modulo sucursal 
						if (data.datos.PROGRAMA == "BUEEMS") {
							var arregloSucursal = data.datos.SUCURSAL_BANCO_AZTECA;
							var azteca = data.datos.SUCURSAL_BANCO_AZTECA;
						} else {
							var arregloSucursal = "";
							var azteca = "";
						}
						//Fin de las variables globales
						var contenido =
							'<div class="card card-resultado">' +
							'<div class="card-body">' +
							//
							'<div class="row">' +
							'<div class = "col-md-12" style="display: flex; align-items: center; flex-direction: column;">' +
							'<div class = "row">' +
							'<img src="img/iconosV4/' + imagen(data.datos.PROGRAMA) + '" class = "logoResponsive">' +
							'</div>' +
							'</div>' +
							'</div>' +
							'<br>' +
							//Resultados del padron
							'<div class="row">';
						if (status == "EN REVISION") {
							pendiente = pendiente + 1;
							contenido = contenido +
								'<div class="col-3 icon text-center">' +
								'<img src="img/iconosV4/alert.svg">' +
								'</div>' +
								'<div class="col-9 resultado-text">' +
								'<div class="row">' +
								'<div><span class = "texto">Tu estatus es <span class="textoPendiente title-heading">' + status + ' </span></span><img src = "img/iconosV4/interrogacion.svg" data-toggle="tooltip" data-placement="right" title = "Revisa tu buzÃ³n de mensajes" ><br>' +
								'<span class = "info">Fecha de consulta: ' + now.toLocaleDateString() + '</span><br>' +
								'<span class = "info">Hora de consulta: ' + hours + ' hrs</span><br>' +
								'<span class = "info">Programa Vigente: <b>' + programaActual + '</b></span>' +
								'</div>' +
								'</div>' +
								'</div>';
						} else {
							contenido = contenido +
								'<div class="col-3 icon text-center">';
							if (status == "ACTIVA") {
								contenido = contenido +
									'<img src="img/check.svg">' +
									'</div>' +
									'<div class="col-9 resultado-text">' +
									'<div class="row">' +
									'<div><span class = "texto">Tu estatus es <span class="textoTitulo title-heading">' + status + '</span></span>';
								if (data.datos.PROGRAMA == "BASICA") {
									if (data.datos.EN_REVISION == "1") {
										contenido = contenido + '<a href="#becas"><img src = "img/iconosV4/interrogacion.svg" data-toggle="tooltip" data-placement="right" title = "Revisa tu buzÃ³n de mensajes" ></img></a>';
									}
								}
								contenido = contenido +
									'<br>';
							} else {
								contenido = contenido +
									'<img src="img/iconosV4/x-estatus-baja.svg" class="icon-resultado">' +
									'</div>' +
									'<div class="col-9 resultado-text">' +
									'<div class="row">' +
									'<div><span class = "texto">Tu estatus es <span class="textoBaja title-heading">' + status + '</span></span><br>';
							}
							contenido = contenido +
								'<span class = "info">Fecha de consulta: ' + now.toLocaleDateString() + '</span><br>' +
								'<span class = "info">Hora de consulta: ' + hours + ' hrs</span><br>' +
								'<span class = "info">Programa Vigente: <b>' + programaActual + '</b></span><br>';
							if (data.datos.PERIODO_INCORPORACION != null && data.datos.PERIODO_INCORPORACION != "" && data.datos.PERIODO_INCORPORACION != undefined) {
								contenido = contenido +
									'<span class = "info">Fecha de incorporaciÃ³n al padrÃ³n: <b>' + data.datos.PERIODO_INCORPORACION + '</b></span>';
							}
							contenido = contenido +
								'</div>' +
								'</div>' +
								'</div>';
						}
						//Modelado inscripcion

						//Fin
						contenido = contenido +
							'</div>' +
							'<div class="row">' +
							'<div class="col-12 resultado-line">' +
							'<div class="row">' +
							'<div class="col-3 icon text-center">' +
							'<img src="img/iconosV4/becario.svg">' +
							'</div>' +
							'<div class="col-9 resultado-text">' +
							'<div class="row">';
						if (data.datos.PROGRAMA == "BASICA") {
							contenido = contenido +
								'<span class = "becario"><b>InformaciÃ³n de la o el becario de referencia</b></span>';
						} else {
							contenido = contenido +
								'<span class = "becario"><b>InformaciÃ³n de la o el becario</b></span>';
						}
						contenido = contenido +
							'</div>' +
							'<div class="row">' +
							'<span class = "info">CURP: <b>' + data.datos.CURP + '</b></span>' +
							'</div>';
						//Integrante ID
						if (data.datos.INTEGRANTE_ID != "" && data.datos.INTEGRANTE_ID != undefined && data.datos.INTEGRANTE_ID != null) {
							contenido = contenido +
								'<div class="row">' +
								'<span class = "info">Identificador del becario: <b>' + data.datos.INTEGRANTE_ID + '</b></span>' +
								'</div>';
							//Fin tutor
						}
						//Inicio tutor
						if (data.datos.PROGRAMA == "BASICA" && data.datos.CURP_TUTOR != "" && data.datos.CURP_TUTOR != undefined && data.datos.CURP_TUTOR != null) {
							contenido = contenido +
								'<div class="row">' +
								'<span class = "info">Representante de la familia: <b>' + data.datos.CURP_TUTOR + '</b></span>' +
								'</div>';
							//Fin tutor
						}
						//FAMILIA en caso de basica
						if (data.datos.PROGRAMA == "BASICA" && data.datos.FAMILIA != "" && data.datos.FAMILIA != undefined && data.datos.FAMILIA != null) {
							contenido = contenido +
								'<div class="row">' +
								'<span class = "info">Identificador de la familia: <b>' + data.datos.FAMILIA + '</b></span>' +
								'</div>';
							//Fin tutor
						}
						//Fin 
						if (data.datos.CCT != null && data.datos.CCT != "" && data.datos.CCT != undefined) {
							contenido = contenido +
								'<div class="row">' +
								'<span class = "info">CCT: <b>' + data.datos.CCT + '</b></span>' +
								'</div>';
						}
						if (data.datos.PROGRAMA == 'BASICA') {
							contenido = contenido +
								'<br>' +
								'<div class = "row">' +
								'<span class = "info">Grupo Familiar</span>' +
								'<span class = "mostrarGrupo normal" onClick = "mostrarGrupo()" id = "Familia">Ver \u25B6</span>' +
								'</div>' +
								//Aqui se va a agregar la composicion familiar
								'<div class = "row">' +
								'<div class = "col-12">' +
								'<div id = "familia" style="display: none; text-align: justify">' +
								'<br>';
							for (var datos in grupo) {
								var cct = grupo[datos].CCT;
								var curpInt = grupo[datos].CURP;
								var tipo_persona = grupo[datos].TIPO_PERSONA;
								contenido = contenido +
									'<div class = "separador">' +
									'<span class = "info">CURP Integrante: <b>' + curpInt + '</b></span><br>';
								if (cct != null && cct != "") {
									contenido = contenido +
										'<span class = "info">CCT: <b>' + cct + '</b></span><br>';
								}
								contenido = contenido +
									'<span class = "info">Tipo de Persona: <b>' + tipoconversion(tipo_persona) + '</b></span><br>' +
									'</div>' +
									'<br>';
							}
							contenido = contenido +
								'</div>' +
								'</div>' +
								'</div>';
							//Fin 
						}
						//CLAVE SARE
						if (data.datos.NOMBRE_SARE != null && data.datos.NOMBRE_SARE != "") {
							contenido = contenido +
								'<div class="row">' +
								'<span class = "info">SARE de adscripciÃ³n: <b>' + data.datos.NOMBRE_SARE + '</b></span>' +
								'</div>';
						}
						if (data.datos.DIRECCION_SARE != null && data.datos.DIRECCION_SARE != "") {
							contenido = contenido +
								'<div class="row">' +
								'<span class = "info">DirecciÃ³n SARE de adscripciÃ³n: <b>' + data.datos.DIRECCION_SARE + '</b></span>' +
								'</div>';
						}
						//Sucursal de adscripcion
						if (sucursalOrigen != "" && direccionOrigen != "") {
							contenido = contenido +
								'<div class="row">' +
								'<span class = "info">Sucursal de adscripciÃ³n del Banco del Bienestar: <b>' + sucursalOrigen + '</b></span>' +
								'<span class = "info">DirecciÃ³n: <b>' + direccionOrigen + '</b></span>' +
								'</div>';
						}
						//Fin
						contenido = contenido +
							'</div>' +
							'</div>' +
							'</div>' +
							'</div>';
						//Apartado nuevo de las becas 
						var arregloBancarizacion = data.datos.BANCARIZACION;
						var medioPendiente = "";
						var formalizacion = "";
						var estrategia_DGOVAC = "";
						//Inicia modulo de bancarizacion 
						if (arregloBancarizacion.length != 0 || (arregloBancarizacion.length == 0 && data.datos.PROCESO_BANCARIZACION == 1)) {
							contenido = contenido +
								'<div class="row">' +
								'<div class="col-12 resultado-line">' +
								'<div class="row">' +
								'<div class="col-3 icon text-center">' +
								'<img src="img/iconosV4/tarjeta_bienestar_2.png">' +
								'</div>' +
								'<div class = "col-9 resultado-text">' +
								'<span class = "info">BancarizaciÃ³n</span><br>' +
								'</div>' +
								'</div>' +
								'<div class = "row">' +
								'<span class = "mostrar normal" onClick = "mostrarBeca()" id = "spanBeca">Ocultar \u25B6</span>' +
								'<div id = "beca" style="display: block; text-align: justify" class = "col-12">' +
								'<br>';
							if (arregloBancarizacion == "PENDIENTE" || (arregloBancarizacion.length == 0 && data.datos.PROCESO_BANCARIZACION == 1)) {
								contenido = contenido +
									'<div class = "row">' +
									//Parte de arriba que controla los Items
									'<div class = "contenedorUno">' +
									'<div class = "row">' +
									//Item 1
									'<div class = "col-4 contenedorTimeline">' +
									'<img src="img/check_relleno.svg" class = "contenedorItem">' +
									'</div>' +
									//Item 2
									'<div class = "col-4 contenedorTimeline">' +
									'<img src="img/iconosV4/alert.svg" class = "contenedorItem">' +
									'</div>' +
									//Item 3
									'<div class = "col-4 contenedorTimeline">' +
									'<img src="img/iconosV4/alert.svg" class = "contenedorItem">' +
									'</div>' +
									'</div>' +
									'</div>' +
									//Este solo controla la linea divisoria, por eso va vacio 
									'<div class = "contenedorDos">' +
									'<div class = "row">' +
									//Texto Item 1
									'<div class = "col-4 contenedorTimelineTexto">' +
									'<span class = "normal">Tarjeta en proceso de asignaciÃ³n</span>' + //Todos aquellos que sabemos que su modalidad de pago va a pasar a ser banco del bienestar
									'</div>' +
									//Texto Item 2
									'<div class = "col-4 contenedorTimelineTexto">' +
									'<span class = "normal">AsignaciÃ³n de cita para la entrega de tu tarjeta</span>' +
									'</div>' +
									//Texto Item 3
									'<div class = "col-4 contenedorTimelineTexto">' +
									'<span class = "normal">La tarjeta esta lista para recibir tu beca</span>' +
									'</div>' +
									'</div>' +
									'</div>' +
									//Fin modulo timeline */
									'</div>';
								contenido = contenido +
									'<div class = "row">' +
									'<div class = "col-12">' +
									'<span class = "normal">' +
									'Estimada/o beneficiaria/o de los Programas de Becas para el Bienestar Benito JuÃ¡rez. <br><br>Â¡Felicidades! Ahora recibirÃ¡s tu beca en una tarjeta del Banco del Bienestar.<br><br>Revisa constantemente este apartado para conocer el dÃ­a, hora y lugar a donde deberÃ¡s acudir para recogerla.<br><br>';
								if (arregloBancarizacion == "PENDIENTE") {
									formulario1 = formulario1 + 1;
									contenido = contenido +
										'Si por algÃºn motivo, tu tarjeta no puede ser entregada, por favor llena el <a href = "#becas">formulario</a> que se encuentra en nuestra Ventanilla Virtual y selecciona la frase â€œAcudÃ­ a la cita en donde me entregarÃ­an mi tarjeta del Banco del Bienestar pero no me atendieronâ€.<br>';
								}
								//Formulario 2
								if (arregloBancarizacion == "PENDIENTE") {
									formulario2 = formulario2 + 1;
									contenido = contenido +
										'Si han pasado 45 dÃ­as desde que la recibiste y aÃºn no tienes el depÃ³sito de tu beca, por favor llena el <a href = "#becas">formulario</a> que se encuentra en nuestra Ventanilla Virtual y selecciona la frase â€œYa pasaron 45 dÃ­as o mÃ¡s desde que tengo mi tarjeta y aÃºn no recibo el depÃ³sito de mi becaâ€.';
								}
								//

								contenido = contenido +
									'Estamos trabajando para atenderte lo mÃ¡s pronto posible.<br><br>Â¡TÃº y tu familia nos inspiran a #BecarParaTransformar!' +
									'</span>' +
									'</div>' +
									'</div>';

							} else {
								for (var datos in banco) {
									recalendarizacion = banco[datos].MODIFICACION_PROGRAMACION;
									reprogramacion = banco[datos].RECALENDARIZACION;
									medioPendiente = banco[datos].DESC_EST_FORMZ_UPD;
									vigencia = banco[datos].DESC_VIG_FORMZ_UPD;
									estrategia_DGOVAC = banco[datos].TIPO_ESTRATEGIA_DGOVAC;
									formalizacion = banco[datos].FECHA_FORMALIZACION;
									var sucursal = banco[datos].SUCURSAL;
									var direccionSucursal = banco[datos].DIRECCION_SUCURSAL;
									var fechaHora = banco[datos].FECHA_HORA;
									var remesa = banco[datos].NUMERO_REMESA;
									if (medioPendiente == "MEDIO PENDIENTE DE ENTREGAR" && (estrategia_DGOVAC == "SUCURSAL" || estrategia_DGOVAC == "SUCURSAL EXTENSION")) {
										var inFecha = fechaHora.indexOf(",");
										var lonFechaBanco = fechaHora.length;
										var fecha = fechaHora.substring(0, inFecha);
										var hora = fechaHora.substring(inFecha + 1, lonFechaBanco);
									}
								}
								contenido = contenido +
									'<div class = "row">' +
									'<div class = "col-3">' +
									'</div>' +
									'<div class = "col-9" style = "display: flex; align-items: center; justify-content: start;">';
								if (data.datos.PROGRAMA == "BUEEMS" && (estrategia_DGOVAC != null && estrategia_DGOVAC != "" && estrategia_DGOVAC != undefined)) {
									if (estrategia_DGOVAC == "ESCUELA POR ESCUELA" || estrategia_DGOVAC == "SEDE OPERATIVA TEMPORAL") {
										contenido = contenido +
											'<div class = "contenedor_Estrategia"><span class = "etiqueta_Estrategia"><b>RecibirÃ¡s tu tarjeta a travÃ©s de la estrategia EscuelaxEscuela</b></span></div>';
									} else if (estrategia_DGOVAC == "SUCURSAL" || estrategia_DGOVAC == "SUCURSAL EXTENSION") {
										contenido = contenido +
											'<div class = "contenedor_Estrategia"><span class = "etiqueta_Estrategia"><b>RecibirÃ¡s tu tarjeta en una sucursal del Banco del Bienestar</b></span></div>';
									}
								}

								contenido = contenido +
									'</div>' +
									'</div>' +
									'<div class = "row">' +
									//Parte de arriba que controla los Items
									'<div class = "contenedorUno">' +
									'<div class = "row">' +
									//Item 1
									'<div class = "col-4 contenedorTimeline">' +
									'<img src="img/check_relleno.svg" class = "contenedorItem">' +
									'</div>' +
									//Item 2
									'<div class = "col-4 contenedorTimeline">';
								if ((fecha == "" || fecha == undefined) && medioPendiente == "MEDIO PENDIENTE DE ENTREGAR") {
									contenido = contenido +
										'<img src="img/iconosV4/alert.svg" class = "contenedorItem">';
								} else if (((fecha != "" && fecha != undefined) && medioPendiente == "MEDIO PENDIENTE DE ENTREGAR") || (medioPendiente == "MEDIO ENTREGADO / FORMALIZADO")) {
									contenido = contenido +
										'<img src="img/check_relleno.svg" class = "contenedorItem">';
								}
								contenido = contenido +
									'</div>' +
									//Item 3
									'<div class = "col-4 contenedorTimeline">';
								if (medioPendiente == "MEDIO ENTREGADO / FORMALIZADO") {
									contenido = contenido +
										'<img src="img/check_relleno.svg" class = "contenedorItem">';
								} else {
									contenido = contenido +
										'<img src="img/iconosV4/alert.svg" class = "contenedorItem">';
								}
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									//Este solo controla la linea divisoria, por eso va vacio 
									'<div class = "contenedorDos">' +
									'<div class = "row">' +
									//Texto Item 1
									'<div class = "col-4 contenedorTimelineTexto">' +
									'<span class = "normal">Tarjeta en proceso de asignaciÃ³n</span>' + //Todos aquellos que sabemos que su modalidad de pago va a pasar a ser banco del bienestar
									'</div>' +
									//Texto Item 2
									'<div class = "col-4 contenedorTimelineTexto">';
								if (fecha == "" && medioPendiente == "MEDIO PENDIENTE DE ENTREGAR") {
									contenido = contenido +
										'<span class = "normal">AsignaciÃ³n de cita para la entrega de tu tarjeta</span>';
								} else if ((fecha != "" && medioPendiente == "MEDIO PENDIENTE DE ENTREGAR") || (medioPendiente == "MEDIO ENTREGADO / FORMALIZADO")) {
									if (medioPendiente == "MEDIO ENTREGADO / FORMALIZADO") {
										contenido = contenido +
											'<span class = "normal">Ya recogiste tu tarjeta</span>';
									} else {
										contenido = contenido +
											'<span class = "normal">Tu cita para recoger tu tarjeta, ha sido asignada</span>';
									}
								}
								contenido = contenido +
									'</div>' +
									//Texto Item 3
									'<div class = "col-4 contenedorTimelineTexto">';
								if (medioPendiente == "MEDIO ENTREGADO / FORMALIZADO" && pagadoFeb2023 == "1") {
									contenido = contenido +
										'<span class = "normal">La tarjeta esta lista para recibir tu beca</span>';
								} else {
									contenido = contenido +
										'<span class = "normal">La tarjeta esta lista para recibir tu beca</span>';
								}
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									//Fin modulo timeline */
									'</div>';

								//Fin timeline
								if ((estrategia_DGOVAC == "ESCUELA POR ESCUELA" || estrategia_DGOVAC == "SEDE OPERATIVA TEMPORAL") && medioPendiente == "MEDIO PENDIENTE DE ENTREGAR") {
									formulario2 = formulario2 + 1;
									//Cuando se tengan datos 
									contenido = contenido +
										'<div class = "row">' +
										'<div class = "col-12">' +
										'<span class = "normal">' +
										'Estimada/o beneficiaria/o de la Beca Universal para el Bienestar Benito JuÃ¡rez de EducaciÃ³n Media Superior<br><br>' +
										'Consulta constantemente la <a href = "https://bit.ly/EscuelaXEscuela" target = "_blank">programaciÃ³n</a> para saber cuÃ¡ndo y dÃ³nde recibirÃ¡s tu tarjeta.<br><br>';
									/* Formulario 2*/
									contenido = contenido +
										'Si han pasado 45 dÃ­as desde que la recibiste y aÃºn no tienes el depÃ³sito de tu beca, por favor llena el <a href = "#becas">formulario</a> que se encuentra en nuestra Ventanilla Virtual y selecciona la frase â€œYa pasaron 45 dÃ­as o mÃ¡s desde que tengo mi tarjeta y aÃºn no recibo el depÃ³sito de mi becaâ€.<br><br>';
									/*Fin  */
									if (data.datos.PROGRAMA == "BUEEMS") {
										formulario4 = formulario4 + 1;
										contenido = contenido +
											'Â¿No pudiste acudir por tu tarjeta? Por favor, llena el <a href = "#becas">formulario</a> que se encuentra en nuestra Ventanilla Virtual y selecciona la frase â€œAÃºn no tengo mi tarjeta del Banco del Bienestarâ€<br><br>';
									}
									contenido = contenido +
										'Â¡Nosotros nos pondremos en contacto contigo para brindarte una soluciÃ³n!<br><br>' +
										'TÃº y tu familia nos inspiran a #BecarParaTransformar' +
										'</span>' +
										'</div>' +
										'</div>';
								} else {
									if (((fecha != "" && fecha != undefined) && (hora != "" && hora != undefined) && medioPendiente == "MEDIO PENDIENTE DE ENTREGAR") && estrategia_DGOVAC != "EN REVISION") {
										formulario1 = formulario1 + 1;
										formulario2 = formulario2 + 1;
										contenido = contenido +
											'<div class = "row">' +
											'<div class = "col-12">' +
											'<span class = "normal">' +
											'Estimada/o beneficiaria/o de los Programas de Becas para el Bienestar Benito JuÃ¡rez<br><br>' +
											'Â¡Felicidades! La tarjeta del Banco del Bienestar en la que recibirÃ¡s tus prÃ³ximas becas estÃ¡ lista para que la recojas en:<br><br>' +
											'<b>Sede/Sucursal:</b> ' + sucursal + ' <b>DirecciÃ³n: </b>' + direccionSucursal +
											'<br><br><b>Fecha:</b> ' + fecha +
											'<br><br><b>Hora:</b> ' + hora +
											'<br><br><b>DocumentaciÃ³n: </b>' +
											'<span class = "mostrarGrupo normal" onClick = "mostrarDocumentos()" id = "Documentos">Ver \u25B6</span>' +
											'<div class = "row">' +
											'<div class = "col-12">' +
											'<div id = "documentos" style="display: none; text-align: justify">';
										//Para saber si es menor o mayor de edad dada la documentacion 
										let nacimiento = data.datos.FECHA_NACIMIENTO;
										//Fecha de nacimiento en milisegundos
										let nacimiento_milisegundos = formularioTiempo(nacimiento);
										//Fecha de cita en milisegundos
										let habilitaFormulario = formularioTiempo(fecha);
										//18 aÃ±os en milisegundos
										let aÃ±os_milisegundos = '567648000000';
										//Diferencia en milisegundos de la cita con la fecha de nacimiento
										let residuo_milisegundos = habilitaFormulario - nacimiento_milisegundos;
										//Si el residuo es igual o mayor a 18 aÃ±os en milisegundos, entonces eres mayor de edad 
										if (residuo_milisegundos >= aÃ±os_milisegundos) {
											//Documentacion acorde a la mayoria de edad
											contenido = contenido +
												'<br><span class = "normal">' +
												'Presenta los siguientes documentos en <b>ORIGINAL</b> y <b>DOS COPIAS</b> de los siguientes documentos. Deben estar en <b>BUEN ESTADO</b>, ser <b>VIGENTES</b> y tener <b>FOTOGRAFÃA, obligatoriamente</b><br><br>' +
												'1.- <b>IdentificaciÃ³n oficial</b> <br>' +
												'<b>Elige alguna de las siguientes:</b>' +
												'</span>' +
												'<ul>' +
												'<li><span class = "normal">Credencial para votar del Instituto Nacional Electoral</span></li>' +
												'<li><span class = "normal">Pasaporte</span></li>' +
												'<li><span class = "normal">Cartilla del Servicio Militar Nacional liberada (hombres)</span></li>' +
												'<li><span class = "normal">Documentos migratorios</span></li>' +
												'<li><span class = "normal">Credencial de servicios mÃ©dicos de alguna instituciÃ³n pÃºblica de salud o seguridad social como carnets y documentos de acreditaciÃ³n de servicios mÃ©dicos</span></li>' +
												'<li><span class = "normal">Credencial de jubilada/o o pensionada/o emitida por alguna instituciÃ³n de seguridad social</span></li>' +
												'<li><span class = "normal">Credenciales emitidas por autoridades federales, estatales y municipales</span></li>' +
												'<li><span class = "normal">Constancia de autoridad local, con las siguientes caracterÃ­sticas: <br>' +
												'- Vigencia no mayor a 6 meses<br>' +
												'- Nombre completo de la o el solicitante, fecha de nacimiento, domicilio completo, fotografÃ­a y firma o huella digital<br>' +
												'- Nombre completo de la autoridad local, firma y sellos oficiales' +
												'</span></li>' +
												'<li><span class = "normal">Las identificaciones que apruebe la ComisiÃ³n Nacional Bancaria y de Valores</span></li>' +
												'</ul>' +
												'<span class = "normal">2.- <b>Comprobante de domicilio (vigencia no mayor a 3 meses)</b>' +
												//Nuevo
												'<b>Elige alguna de las siguientes: <br>Vigencia no mayor a 3 meses</b>' +
												'</span>' +
												'<ul>' +
												'<li><span class = "normal">Recibo de luz</span></li>' +
												'<li><span class = "normal">Recibo de agua</span></li>' +
												'<li><span class = "normal">Recibo o factura de gas natural</span></li>' +
												'<li><span class = "normal">Boleta del pago predial</span></li>' +
												'<li><span class = "normal">Recibo de telÃ©fono (excepto telefonÃ­a celular)</span></li>' +
												'<li><span class = "normal">Estados de cuenta bancarios</span></li>' +
												'<li><span class = "normal">Credenciales emitidas por autoridades federales, estatales y municipales</span></li>' +
												'<li><span class = "normal">Comprobante de inscripciÃ³n ante el Registro Federal de Contribuyentes</span></li>' +
												'</ul>' +
												'<span class = "normal"><b>Vigencia no mayor a 6 meses</b><br>' +
												'</span>' +
												'<ul>' +
												'<li><span class = "normal">Constancia de autoridad local, con las siguientes caracterÃ­sticas: <br>' +
												'- Vigencia no mayor a 6 meses<br>' +
												'- Nombre completo de la o el solicitante, fecha de nacimiento, domicilio completo, fotografÃ­a y firma o huella digital<br>' +
												'- Nombre completo de la autoridad local, firma y sellos oficiales' +
												'</span></li>' +
												'</ul>' +
												//
												'<span class = "normal"><b>Vigencia no mayor a 1 aÃ±o</b><br>' +
												'</span>' +
												'<ul>' +
												'<li><span class = "normal">Comprobante anual de impuesto predial</span></li>' +
												'<li><span class = "normal">Comprobante anual de suministro de agua</span></li>' +
												'<li><span class = "normal">Contrato de arrendamiento registrado ante la autoridad fiscal</span></li>' +
												'</ul>' +
												//Fin nuevo 
												'<span class = "normal">' +
												'<b>IMPORTANTE</b>: Si recibirÃ¡s tu tarjeta en una sucursal del Banco del Bienestar, imprime o toma una captura de pantalla de los datos de tu cita indicados en el apartado BancarizaciÃ³n en el Buscador de Estatus y presÃ©ntala junto con tu documentaciÃ³n para agilizar la atenciÃ³n.' +
												'</span>';
										} else {
											//Documentacion acorde a la menoria de edad
											contenido = contenido +
												'<span class = "normal">' +
												'Presenta los siguientes documentos en <b>ORIGINAL</b> y <b>DOS COPIAS</b> de los siguientes documentos. Deben estar en <b>BUEN ESTADO</b>, ser <b>VIGENTES</b> y tener <b>FOTOGRAFÃA, obligatoriamente</b><br><br>' +
												'1.- <b>IdentificaciÃ³n de la o el becario</b> <br>' +
												'<b>Elige alguna de las siguientes:</b>' +
												'</span>' +
												'<ul>' +
												'<li><span class = "normal">Credencial escolar emitida por la autoridad educativa con las siguientes caracterÃ­sticas:<br>' +
												'<b>OBLIGATORIAS</b><br>' +
												'- Nombre de la instituciÃ³n educativa<br>' +
												'- Nombre de la o el alumno<br>' +
												'- CURP de la o el alumno o nÃºmero de identificaciÃ³n (matrÃ­cula, control, id alumno)<br>' +
												'- Fotografia de la o el alumno <br>' +
												'- Vigencia<br>' +
												'<b>OPCIONALES</b><br>' +
												'- Firma de autorizaciÃ³n de la o el director o representante de la instituciÃ³n educativa<br>' +
												'- Firma de la o el alumno' +
												'</span></li>' +
												'<li><span class = "normal">Documentos migratorios</span></li>' +
												'<li><span class = "normal">Pasaporte</span></li>' +
												'<li><span class = "normal">Constancia de autoridad local, con las siguientes caracterÃ­sticas:<br>' +
												'- Vigencia no mayor a 6 meses<br>' +
												'- Nombre completo de la o el solicitante, fecha de nacimiento, domicilio completo, fotografÃ­a y firma o huella digital<br>' +
												'- Nombre completo de la autoridad local, firma y sellos oficiales' +
												'</span></li>' +
												'</ul>' +
												'<span class = "normal">2.- <b>Comprobante de domicilio (vigencia no mayor a 3 meses)</b>' +
												//Nuevo
												'<b>Elige alguna de las siguientes: <br>Vigencia no mayor a 3 meses</b>' +
												'</span>' +
												'<ul>' +
												'<li><span class = "normal">Recibo de luz</span></li>' +
												'<li><span class = "normal">Recibo de agua</span></li>' +
												'<li><span class = "normal">Recibo o factura de gas natural</span></li>' +
												'<li><span class = "normal">Boleta del pago predial</span></li>' +
												'<li><span class = "normal">Recibo de telÃ©fono (excepto telefonÃ­a celular)</span></li>' +
												'<li><span class = "normal">Estados de cuenta bancarios</span></li>' +
												'<li><span class = "normal">Credenciales emitidas por autoridades federales, estatales y municipales</span></li>' +
												'<li><span class = "normal">Comprobante de inscripciÃ³n ante el Registro Federal de Contribuyentes</span></li>' +
												'</ul>' +
												'<span class = "normal"><b>Vigencia no mayor a 6 meses</b><br>' +
												'</span>' +
												'<ul>' +
												'<li><span class = "normal">Constancia de autoridad local, con las siguientes caracterÃ­sticas: <br>' +
												'- Vigencia no mayor a 6 meses<br>' +
												'- Nombre completo de la o el solicitante, fecha de nacimiento, domicilio completo, fotografÃ­a y firma o huella digital<br>' +
												'- Nombre completo de la autoridad local, firma y sellos oficiales' +
												'</span></li>' +
												'</ul>' +
												//
												'<span class = "normal"><b>Vigencia no mayor a 1 aÃ±o</b><br>' +
												'</span>' +
												'<ul>' +
												'<li><span class = "normal">Comprobante anual de impuesto predial</span></li>' +
												'<li><span class = "normal">Comprobante anual de suministro de agua</span></li>' +
												'<li><span class = "normal">Contrato de arrendamiento registrado ante la autoridad fiscal</span></li>' +
												'</ul>' +
												//Fin nuevo 
												'3.- <b>IdentificaciÃ³n oficial de la o el acompaÃ±ante que lo acredite como mayor de edad</b> <br>' +
												'<b>Elige alguna de las siguientes:</b>' +
												'</span>' +
												'<ul>' +
												'<li><span class = "normal">Credencial para votar del Instituto Nacional Electoral</span></li>' +
												'<li><span class = "normal">Pasaporte</span></li>' +
												'<li><span class = "normal">Cartilla del Servicio Militar Nacional liberada (hombres)</span></li>' +
												'<li><span class = "normal">Documentos migratorios</span></li>' +
												'<li><span class = "normal">Credencial de servicios mÃ©dicos de alguna instituciÃ³n pÃºblica de salud o seguridad social como carnets y documentos de acreditaciÃ³n de servicios mÃ©dicos</span></li>' +
												'<li><span class = "normal">Credencial de jubilada/o o pensionada/o emitida por alguna instituciÃ³n de seguridad social</span></li>' +
												'<li><span class = "normal">Credenciales emitidas por autoridades federales, estatales y municipales</span></li>' +
												'<li><span class = "normal">Constancia de autoridad local, con las siguientes caracterÃ­sticas: <br>' +
												'- Vigencia no mayor a 6 meses<br>' +
												'- Nombre completo de la o el solicitante, fecha de nacimiento, domicilio completo, fotografÃ­a y firma o huella digital<br>' +
												'- Nombre completo de la autoridad local, firma y sellos oficiales' +
												'</span></li>' +
												'<li><span class = "normal">Las identificaciones que apruebe la ComisiÃ³n Nacional Bancaria y de Valores</span></li>' +
												'</ul>' +
												'4.- <b>Documentos que acrediten el parentesco de la o el acompaÃ±ante dependiendo cuÃ¡l sea el caso</b> <br>' +
												'Madre o padre<br>' +
												'- Acta de nacimiento de la o el menor en donde en el apartado â€œpadre o madreâ€ se seÃ±ale su nombre<br>' +
												'Abuela o abuelo <br>' +
												'- Acta de nacimiento de la o el becario en donde en el apartado â€œabuela o abueloâ€ se seÃ±ale su nombre (Si el acta de nacimiento no tiene el nombre de la o el abuelo, se deberÃ¡ presentar el acta de nacimiento de la madre o padre de la o el becario en donde se acredite el parentesco con la o el abuelo)<br>' +
												'Hermana o hermano <br>' +
												'- Acta de nacimiento de la o el becario<br>' +
												'- Acta de nacimiento en donde se identifique que los nombres de su madre y/o padre son los mismos que los de la o el becario<br>' +
												'Tutora o tutor <br>' +
												'- ResoluciÃ³n del juez donde se acredite como tutora o tutor legal o, en caso de que la o el becario menor de edad  estÃ© a cargo de una instituciÃ³n, se deberÃ¡ presentar la documentaciÃ³n correspondiente<br>' +
												'<br><b>IMPORTANTE</b>: Si recibirÃ¡s tu tarjeta en una sucursal del Banco del Bienestar, imprime o toma una captura de pantalla de los datos de tu cita indicados en el apartado BancarizaciÃ³n en el Buscador de Estatus y presÃ©ntala junto con tu documentaciÃ³n para agilizar la atenciÃ³n.' +
												'</span>';
										}
										//Fin			
										contenido = contenido +
											'</div>' +
											'</div>' +
											'</div>' +
											'<br><b>Remesa:</b> ' + remesa +
											'<br><br>Recuerda que es muy importante que acudas a recoger tu tarjeta en el dÃ­a y la hora que te corresponde, de lo contrario, <b>la entrega se reprogramarÃ¡</b>.<br><br>';
										/*Formulario*/
										contenido = contenido +
											'Si por algÃºn motivo, tu tarjeta no puede ser entregada, por favor llena el <a href = "#becas">formulario</a> que se encuentra en nuestra Ventanilla Virtual y selecciona la frase â€œAcudÃ­ a la cita en donde me entregarÃ­an mi tarjeta del Banco del Bienestar pero no me atendieronâ€.<br><br>';
										/*Formulario*/
										/* Formulario 2*/
										contenido = contenido +
											'Si han pasado 45 dÃ­as desde que la recibiste y aÃºn no tienes el depÃ³sito de tu beca, por favor llena el <a href = "#becas">formulario</a> que se encuentra en nuestra Ventanilla Virtual y selecciona la frase â€œYa pasaron 45 dÃ­as o mÃ¡s desde que tengo mi tarjeta y aÃºn no recibo el depÃ³sito de mi becaâ€.<br><br>';
										/*Fin  */
										contenido = contenido +
											'TÃº nos inspiras a becar para transformar' +
											'</span>' +
											'</div>' +
											'</div>';
									} else if (medioPendiente == "MEDIO ENTREGADO / FORMALIZADO") {
										if (pagadoFeb2023 == "1" && data.datos.PAGADO_2023E2 == "1") {
											contenido = contenido +
												'<div class = "row">' +
												'<div class = "col-12">' +
												'<span class = "normal">' +
												'Estimada/o beneficiaria/o de los Programas de Becas para el Bienestar Benito JuÃ¡rez<br><br>' +
												'Tu proceso de bancarizaciÃ³n ha concluido. Recuerda que puedes conocer el estatus y la fecha del depÃ³sito de tus prÃ³ximas becas en la secciÃ³n Becas Emitidas. En caso de robo o extravÃ­o de tu tarjeta, llama al 800 900 2000.<br><br>' +
												'Puedes descargar la App Banco del Bienestar MÃ³vil para Android o IOS para consultar tu saldo y movimientos.<br><br>' +
												'No compartas tus datos bancarios con nadie, NUNCA te llamaremos para solicitar informaciÃ³n como tu nÃºmero de seguridad o nÃºmero de tarjeta. Â¡No caigas en fraudes!<br><br>' +
												'TÃº y tu familia nos inspiran a #BecarParaTransformar' +
												'</span>' +
												'</div>' +
												'</div>';

										} else {
											formulario1 = formulario1 + 1;
											formulario2 = formulario2 + 1;
											contenido = contenido +
												'<div class = "row">' +
												'<div class = "col-12">' +
												'<span class = "normal">' +
												'Estimada/o beneficiaria/o de los Programas de Becas para el Bienestar Benito JuÃ¡rez<br><br>' +
												'Â¿Recibiste tu tarjeta del Banco del Bienestar este 2023 o en aÃ±os anteriores?<br><br>';
											/*Formulario Uno */
											contenido = contenido +
												'Si por algÃºn motivo, tu tarjeta no puede ser entregada, por favor llena el <a href = "#becas">formulario</a> que se encuentra en nuestra Ventanilla Virtual y selecciona la frase â€œAcudÃ­ a la cita en donde me entregarÃ­an mi tarjeta del Banco del Bienestar pero no me atendieronâ€.<br>';
											/* */
											//
											contenido = contenido +
												'Si han pasado 45 dÃ­as desde que la recibiste y aÃºn no tienes el depÃ³sito de tu beca, por favor llena el <a href = "#becas">formulario</a> que se encuentra en nuestra Ventanilla Virtual y selecciona la frase â€œYa pasaron 45 dÃ­as o mÃ¡s desde que tengo mi tarjeta y aÃºn no recibo el depÃ³sito de mi becaâ€. <br><br>' +
												'Â¡Nosotros nos pondremos en contacto contigo para brindarte una soluciÃ³n!<br><br>' +
												'TÃº nos inspiras a #BecarParaTransformar' +
												'</span>' +
												'</div>' +
												'</div>';
										}

									} else if ((medioPendiente == "MEDIO PENDIENTE DE ENTREGAR" && (fecha == "" || fecha == undefined) && (hora == "" || hora == undefined)) || estrategia_DGOVAC == "EN REVISION") {
										formulario1 = formulario1 + 1;
										formulario2 = formulario2 + 1;
										contenido = contenido +
											'<div class = "row">' +
											'<div class = "col-12">' +
											'<span class = "normal">' +
											'Estimada/o beneficiaria/o de los Programas de Becas para el Bienestar Benito JuÃ¡rez <br><br>' +
											'Â¡Felicidades! Ahora recibirÃ¡s tu beca en una tarjeta del Banco del Bienestar.<br><br>' +
											'Revisa constantemente este apartado para conocer el dÃ­a, hora y lugar a donde deberÃ¡s acudir para recogerla.<br><br>' +
											'Si por algÃºn motivo, tu tarjeta no puede ser entregada, por favor llena el <a href = "#becas">formulario</a> que se encuentra en nuestra Ventanilla Virtual y selecciona la frase â€œAcudÃ­ a la cita en donde me entregarÃ­an mi tarjeta del Banco del Bienestar pero no me atendieronâ€.<br><br>';
										/* Formulario 2*/
										contenido = contenido +
											'Si han pasado 45 dÃ­as desde que la recibiste y aÃºn no tienes el depÃ³sito de tu beca, por favor llena el <a href = "#becas">formulario</a> que se encuentra en nuestra Ventanilla Virtual y selecciona la frase â€œYa pasaron 45 dÃ­as o mÃ¡s desde que tengo mi tarjeta y aÃºn no recibo el depÃ³sito de mi becaâ€.<br><br>';
										/*Fin  */
										contenido = contenido +
											'Estamos trabajando para asignarte una cita lo mÃ¡s pronto posible.<br><br>' +
											'Â¡TÃº y tu familia nos inspiran a #BecarParaTransformar!' +
											'</span>' +
											'</div>' +
											'</div>';
									}
								}
							}
							contenido = contenido +
								'</div>' +
								'</div>' +
								'</div>' +
								'</div>';
						}
						//Termina Aqui -------------------------------------
						//Modulo Banco Azteca
						if (arregloSucursal.length != 0 && data.datos.PROGRAMA == "BUEEMS") {
							//Cuerpo del modulo
							contenido = contenido +
								'<div class="row">' +
								'<div class="col-12 resultado-line">' +
								'<div class="row">' +
								'<div class="col-3 icon text-center">' +
								'<img src="img/iconosV4/azteca.png">' +
								'</div>' +
								'<div class = "col-9 resultado-text">' +
								'<span class = "info">Recupera el acceso a tu app Bienestar Azteca</span><br>' +
								'</div>' +
								'</div>' +
								'<div class = "row barra">' +
								'<span class = "mostrar normal" onClick = "mostrarAzteca()" id = "spanAzteca">Ver \u25B6</span>' +
								'<div id = "azteca" style="display: none">' +
								'<br>';
							if (arregloSucursal.length > 0) {
								//
								let sucursalAzteca = "";
								let direccionSucursalAzteca = "";
								let fecha = "";
								let hora = "";
								for (var datos in azteca) {
									sucursalAzteca = azteca[datos].SUCURSAL;
									direccionSucursalAzteca = azteca[datos].DIRECCION_SUCURSAL;
									fecha = azteca[datos].FECHA_ATENCION;
									hora = azteca[datos].HORARIO_ATENCION;
								}
								//Para saber si es menor o mayor de edad dada la documentacion 
								let nacimiento = data.datos.FECHA_NACIMIENTO;
								//Fecha de nacimiento en milisegundos
								let nacimiento_milisegundos = formularioTiempo(nacimiento);
								//Fecha de cita en milisegundos
								let habilitaFormulario = formularioTiempo(fecha);
								//18 aÃ±os en milisegundos
								let aÃ±os_milisegundos = '567648000000';
								//Diferencia en milisegundos de la cita con la fecha de nacimiento
								let residuo_milisegundos = habilitaFormulario - nacimiento_milisegundos;
								//Para habilitar el formulario
								contenido = contenido +
									'<span class = "normal">' +
									'Estimada becaria/o del Programa Universal de Becas para el Bienestar Benito JuÃ¡rez de EducaciÃ³n Media Superior<br><br>' +
									'Tu cita ya estÃ¡ programada para que acudas a Banco Azteca y recuperes el acceso a tu app Bienestar Azteca.<br><br>' +
									'Sucursal: ' + sucursalAzteca +
									'<br><br>DirecciÃ³n: ' + direccionSucursalAzteca +
									'<br><br>Fecha: ' + fecha +
									'<br><br>Hora: ' + hora +
									'<br><br>Documentacion:<br><br>';
								//Si el residuo es igual o mayor a 18 aÃ±os en milisegundos, entonces eres mayor de edad 
								if (residuo_milisegundos >= aÃ±os_milisegundos) {
									//Documentacion acorde a la mayoria de edad
									contenido = contenido +
										'â— INE vigente <br>' +
										'â— CURP <br>' +
										'â— Celular con la app Bienestar Azteca instalada <br>' +
										'â— ImpresiÃ³n o captura de pantalla de la fecha y hora de tu cita <br><br>';
								} else {
									//Menoria de edad
									contenido = contenido +
										'PresÃ©ntate con tu madre, padre, abuela, abuelo, hermana o hermano mayores de edad, tutora o tutor y lleva contigo: <br>' +
										'â— Acta de nacimiento original <br>' +
										'â— CURP <br>' +
										'â— INE vigente de tu madre, padre, abuela, abuelo, hermana o hermano mayores de edad, tutora o tutor <br>' +
										'â— Celular con la app Bienestar Azteca instalada <br>' +
										'â— ImpresiÃ³n o captura de pantalla de la fecha y hora de tu cita<br><br>';
								}
								contenido = contenido +
									'Â¡Es muy importante que asistas a la sucursal Ãºnicamente el dÃ­a y la hora indicada!<br><br>';
								/*if (habilitaFormulario <= convfSistema) {
									formulario3 = formulario3 + 1;
									contenido = contenido +
										'Si asististe puntual a tu cita, con tu documentaciÃ³n completa y, con tu madre, padre, abuela, abuelo, hermana o hermano mayores de edad, tutora o tutor, en caso de que seas menor de edad, y aÃºn asÃ­ no recibiste atenciÃ³n en la sucursal, llena el <a href = "#becas">formulario</a> que se encuentra en nuestra Ventanilla Virtual y selecciona la frase â€œAsistÃ­ a mi cita para recuperaciÃ³n de cuenta en Banco Azteca y no fue exitosaâ€ para reportarnos la incidencia.<br><br>';
								}
								formulario5 = formulario5 + 1;*/
								contenido = contenido +
									//'Si cambiaste o perdiste tu celular, no puedes entrar al correo que registraste en tu app Bienestar Azteca, olvidaste las respuestas a tus preguntas de seguridad y/o acudiste a nuestras oficinas a actualizar tus datos y aÃºn no tienes acceso a tu app, llena el <a href = "#becas">formulario</a> que se encuentra en nuestra Ventanilla Virtual y selecciona la frase â€œNo tengo acceso a mi app Bienestar Azteca o estÃ¡ bloqueada y aÃºn tengo saldo en mi cuentaâ€.<br><br>' +
									'TÃº nos inspiras a #BecarParaTransformar' +
									'</span>';
							} /*else {
								formulario5 = formulario5 + 1;
								contenido = contenido +
									'<span class = "normal">' +
									'Estimada/o becaria/o del Programa Universal de Becas para el Bienestar Benito JuÃ¡rez de EducaciÃ³n Media Superior<br><br>' +
									'Si cambiaste o perdiste tu celular, no puedes entrar al correo que registraste en tu app Bienestar Azteca, olvidaste las respuestas a tus preguntas de seguridad y/o acudiste a nuestras oficinas a actualizar tus datos y aÃºn no tienes acceso a tu app, llena el <a href = "#becas">formulario</a> que se encuentra en nuestra Ventanilla Virtual y selecciona la frase â€œNo tengo acceso a mi app Bienestar Azteca o estÃ¡ bloqueada y aÃºn tengo saldo en mi cuenta".<br><br>' +
									'Â¡Nosotros nos pondremos en contacto contigo para brindarte una soluciÃ³n!<br><br>Recuerda que tÃº nos inspiras a #BecarParaTransformar' +
									'</span>';
							}*/
							contenido = contenido +
								'</div>' +
								'</div>' +
								'</div>' +
								'</div>';
						}
						//
						//Becas Emitidas
						//Inicia Aqui Modulo Becas Emitidas// -----------------------------
						if (((data.datos.SITUACION_ENTREGA_SEPOCT_2022 != null && data.datos.SITUACION_ENTREGA_SEPOCT_2022 != "") || (data.datos.SITUACION_ENTREGA_JUN != null && data.datos.SITUACION_ENTREGA_JUN != "") ||
							(data.datos.SITUACION_ENTREGA_FEB != null && data.datos.SITUACION_ENTREGA_FEB != "")) || (emision2023 == "1" || data.datos.EMISION_2023E2 == "1" || data.datos.EMISION_23EMISION3 == "1")) {
							contenido = contenido +
								'<div class="row" id="becas">' +
								'<div class="col-12 resultado-line">' +
								'<div class="row">' +
								'<div class="col-3 icon text-center">' +
								'<img src="img/iconosV4/Becas-emitidas.svg">' +
								'</div>' +
								'<div class = "col-9 resultado-text">' +
								'<span class = "info">Becas emitidas </span>';
							var total_pagos = data.datos.TOTAL_PAGOS;
							if ((data.datos.PROGRAMA == "BUEEMS" || data.datos.PROGRAMA == "JEF") && (data.datos.TOTAL_PAGOS != "" && data.datos.TOTAL_PAGOS != null && data.datos.TOTAL_PAGOS != undefined)) {
								if (data.datos.PROGRAMA == 'BUEEMS') {
									if (total_pagos > 30) {
										total_pagos = 30;
									}
									contenido = contenido +
										'<br>' +
										'<span class = "normal">Total de pagos: ' + total_pagos + '/30</span>';
								} else {
									if (total_pagos > 45) {
										total_pagos = 45;
									}
									contenido = contenido +
										'<br>' +
										'<span class = "normal">Total de pagos: ' + total_pagos + '/45</span>';
								}
							}
							contenido = contenido +
								'</div>' +
								'</div>' +
								'<div class = "row barra">' +
								'<br>';
							//Validacion de los modulos
							contenido = contenido +
								'<div class = "col-12" style = "display: flex; align-items: center; justify-content: center;">';
							if ((data.datos.SITUACION_ENTREGA_SEPOCT_2022 != null && data.datos.SITUACION_ENTREGA_SEPOCT_2022 != "") || (data.datos.SITUACION_ENTREGA_JUN != null && data.datos.SITUACION_ENTREGA_JUN != "") ||
								(data.datos.SITUACION_ENTREGA_FEB != null && data.datos.SITUACION_ENTREGA_FEB != "")) {
								contenido = contenido +
									'<div class = "separadorPago contenedorFecha" onClick = "pagos2022()" style="cursor: pointer" id = "div2022">' +
									'<span id = "2022">2022</span>' +
									'</div>';
							}
							if ((emision2023 == "1" || data.datos.EMISION_2023E2 == "1" || data.datos.EMISION_23EMISION3 == "1")) {
								contenido = contenido +
									'<div class = "separadorPago contenedorFecha" onClick = "pagos2023()" style="cursor: pointer" id = "div2023">' +
									'<span id = "2023">2023</span>' +
									'</div>';
							}
							contenido = contenido +
								'</div>' +
								'</div>';
							contenido = contenido +
								'<div class = "row barra">';
							//Periodo 2022--------------------------------------------------------------------------------------------
							contenido = contenido +
								'<div class = "col-12" style = "display: none" id = "pagos2022">';
							//Inicia periodo febrero mayo
							liquidadora = data.datos.LIQUIDADORA_FEB;
							if (liquidadora != null && liquidadora != "" && liquidadora != undefined) {
								contenido = contenido +
									'<div class = "separador">' +
									'<span class = "bold" onClick = "febrero2022()" id = "spanSuperior" style="cursor: pointer">Primera EmisiÃ³n \u25B6</span>' +
									'<div id = "verFebrero2022" style="display: none">' +
									'<div class="timeline-item">' +
									'<span class = "bold">Programa: </span><span class = "normal">' + programaActual + '</span><br>';
								//Nuevo modulo para la liquidadora
								contenido = contenido +
									'<span class = "bold">Liquidadora asignada al becario (a): </span><span class = "normal">' + sub_LiquidadoraFebrero + '</span><br>';
								if (data.datos.PROGRAMA == "BASICA") {
									contenido = contenido +
										'<span class = "bold">Periodo de pago: </span><span class = "normal">ENERO, FEBRERO, MARZO Y ABRIL</span><br>';
								} else {
									contenido = contenido +
										'<span class = "bold">Periodo de pago: </span><span class = "normal">FEBRERO, MARZO, ABRIL Y MAYO</span><br>';
								}
								contenido = contenido +
									'<span class = "bold">Medio de pago vigente: </span><span class = "normal">' + sub_ModalidadFebrero + '</span><br>' +
									'<span class = "bold">Estatus del pago: </span><span class = "normal">' + data.datos.SITUACION_ENTREGA_FEB + '</span><br>';
								if (data.datos.FECHA_PAGO_FEB != null && data.datos.FECHA_PAGO_FEB != "" && data.datos.FECHA_PAGO_FEB != undefined) {
									contenido = contenido +
										'<span class = "bold">Fecha de pago: </span><span class = "normal">' + data.datos.FECHA_PAGO_FEB + '</span>';

								}
								//Fin Liquidadora
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									'<br>';
							}
							//Fin periodo febrero mayo
							//Inicio periodo junio julio
							liquidadora = data.datos.LIQUIDADORA_JUN;
							if (liquidadora != null && liquidadora != "" && liquidadora != undefined) {
								contenido = contenido +
									'<div class = "separador">' +
									'<span class = "bold" onClick = "junio2022()" id = "spanSuperior" style="cursor: pointer">Segunda EmisiÃ³n \u25B6</span>' +
									'<div id = "verJunio2022" style="display: none">' +
									'<div class="timeline-item">' +
									'<span class = "bold">Programa: </span><span class = "normal">' + programaActual + '</span><br>';
								//Nuevo modulo para la liquidadora
								contenido = contenido +
									'<span class = "bold">Liquidadora asignada al becario (a): </span><span class = "normal">' + sub_LiquidadoraJunio + '</span><br>';
								if (data.datos.PROGRAMA == "BASICA") {
									contenido = contenido +
										'<span class = "bold">Periodo de pago: </span><span class = "normal">MAYO Y JUNIO</span><br>';

								} else {
									contenido = contenido +
										'<span class = "bold">Periodo de pago: </span><span class = "normal">JUNIO Y JULIO</span><br>';
								}
								contenido = contenido +
									'<span class = "bold">Medio de pago vigente: </span><span class = "normal">' + sub_ModalidadJunio + '</span><br>' +
									'<span class = "bold">Estatus del pago: </span><span class = "normal">' + data.datos.SITUACION_ENTREGA_JUN + '</span><br>';
								if (data.datos.FECHA_PAGO_JUN != null && data.datos.FECHA_PAGO_JUN != "" && data.datos.FECHA_PAGO_JUN != undefined) {
									contenido = contenido +
										'<span class = "bold">Fecha de pago: </span><span class = "normal">' + data.datos.FECHA_PAGO_JUN + '</span>';

								}
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									'<br>';
							}
							//------NUEVO PERIODO DE SEPTIEMBRE-OCTUBRE------------------------------------------------------------------------------------------------------
							liquidadora = data.datos.LIQUIDADORA_SEPOCT_2022;
							if (liquidadora != null && liquidadora != "" && liquidadora != undefined) {
								contenido = contenido +
									'<div class = "separador">' +
									'<span class = "bold" onClick = "septiembre2022()" id = "spanSuperior" style="cursor: pointer">Tercera EmisiÃ³n \u25B6</span>' +
									'<div id = "verSeptiembre2022" style="display: none">' +
									'<div class="timeline-item">' +
									'<span class = "bold">Programa: </span><span class = "normal">' + programaActual + '</span><br>';
								//Nuevo modulo para la liquidadora
								if (sub_LiquidadoraSeptiembre2022 == "BANCO AZTECA" && (data.datos.ESTADO_ID == "5" || data.datos.ESTADO_ID == "7" || data.datos.ESTADO_ID == "15" || data.datos.ESTADO_ID == "17" || data.datos.ESTADO_ID == "18") && sub_ModalidadSeptiembre2022 == "AVISO DE COBRO/ORDEN DE PAGO") {
									contenido = contenido +
										'<span class = "bold">Liquidadora asignada al becario (a): </span><span class = "normal">' + sub_LiquidadoraSeptiembre2022 + '*</span><br>' +
										'<span class = "bold">Periodo de pago: </span><span class = "normal">SEPTIEMBRE, OCTUBRE, NOVIEMBRE Y DICIEMBRE</span><br>' +
										'<span class = "bold">Medio de pago vigente: </span><span class = "normal">' + sub_ModalidadSeptiembre2022 + '</span><br>';
								} else {
									contenido = contenido +
										'<span class = "bold">Liquidadora asignada al becario (a): </span><span class = "normal">' + sub_LiquidadoraSeptiembre2022 + '</span><br>' +
										'<span class = "bold">Periodo de pago: </span><span class = "normal">SEPTIEMBRE, OCTUBRE, NOVIEMBRE Y DICIEMBRE</span><br>' +
										'<span class = "bold">Medio de pago vigente: </span><span class = "normal">' + sub_ModalidadSeptiembre2022 + '</span><br>';
								}
								contenido = contenido +
									'<span class = "bold">Estatus del pago: </span><span class = "normal">' + data.datos.SITUACION_ENTREGA_SEPOCT_2022 + '</span><br>';
								if (data.datos.FECHA_PAGO_SEPOCT_2022 != null && data.datos.FECHA_PAGO_SEPOCT_2022 != "" && data.datos.FECHA_PAGO_SEPOCT_2022 != undefined) {
									contenido = contenido +
										'<span class = "bold">Fecha de pago: </span><span class = "normal">' + data.datos.FECHA_PAGO_SEPOCT_2022 + '</span>';

								}
								contenido = contenido +
									'</div>' +
									'</div>' + //Se agrego un div para 2023
									'</div>';
							}
							//PRIMERA EMISION DEL 2023
							contenido = contenido +
								'</div>' +
								'<div class = "col-12" style = "display: none" id = "pagos2023">';
							if (emision2023 == "1") {
								contenido = contenido +
									'<div class = "separador">' +
									'<span class = "bold" onClick = "febrero2023()" id = "spanSuperior" style="cursor: pointer">Primera EmisiÃ³n \u25B6</span>' +
									'<div id = "verSeptiembre" style="display: none">' +
									'<div class="timeline-item">';
								if (pagadoFeb2023 == "1") {
									contenido = contenido +
										'<img src="img/check_relleno.svg" style = "width: 25px;"><br>';
								} else if (pagadoFeb2023 == "0" && (data.datos.ESTATUS_PAGO_2023 != "NO PAGADA" && data.datos.ESTATUS_PAGO_2023 != "DEPOSITO RECHAZADO")) {
									contenido = contenido +
										'<img src="img/iconosV4/alert.svg" style = "width: 25px;"><br>';
								} else if (pagadoFeb2023 == "0" && (data.datos.ESTATUS_PAGO_2023 == "NO PAGADA" || data.datos.ESTATUS_PAGO_2023 == "DEPOSITO RECHAZADO")) {
									contenido = contenido +
										'<img src="img/iconosV4/x-estatus-baja.svg" style = "width: 25px;"><br>';
								}

								contenido = contenido +
									'<span class = "bold">Forma de pago: <span class = "normal">' + modalidadFebrero2023 + '</span></span><br>' +
									'<span class = "bold">Recibes tu pago por medio de: <span class = "normal">' + liquidadoraFebrero2023 + '</span></span><br>' +
									'<span class = "bold">Situacion actual del pago: <span class = "normal">' + data.datos.ESTATUS_PAGO_2023 + '</span></span><br>';
								if (data.datos.ESTATUS_PAGO_2023 != "NO PAGADA" && data.datos.ESTATUS_PAGO_2023 != "DEPOSITO RECHAZADO") {
									if (modalidadFebrero2023 == "DEPOSITO EN CUENTA") {
										if (pagadoFeb2023 == "1") {
											contenido = contenido +
												'<span class = "bold">Fecha de depÃ³sito: <span class = "normal">' + data.datos.FECHA_PAGO_2023 + '</span></span><br>';
										} else if (pagadoFeb2023 == "0") {
											contenido = contenido +
												'<span class = "bold">Fecha de depÃ³sito: <span class = "normal">PENDIENTE</span></span><br>';
										}
									} else {
										if (pagadoFeb2023 != "1") {
											contenido = contenido +
												'<span class = "bold">Fecha y lugar programado para la entrega: <span class = "normal"></span></span><br>';
										}
									}
								}
								contenido = contenido +
									'<span class = "bold">Periodos: <span class = "normal">' + periodo(periodos) + '</span></span><br>';
								//Fin 
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									'<br>';
							}
							//SEGUNDA EMISION DEL 2023
							if (data.datos.EMISION_2023E2 == "1") {
								contenido = contenido +
									'<div class = "separador">' +
									'<span class = "bold" onClick = "mayo2023()" id = "spanSuperior" style="cursor: pointer">Segunda EmisiÃ³n \u25B6</span>' +
									'<div id = "verMayo" style="display: none">' +
									'<div class="timeline-item">';
								if (data.datos.PAGADO_2023E2 == "1") {
									contenido = contenido +
										'<img src="img/check_relleno.svg" style = "width: 25px;"><br>';
								} else if ((data.datos.PAGADO_2023E2 == "0" || data.datos.PAGADO_2023E2 == "") && (data.datos.ESTATUS_PAGO_2023E2 != "NO PAGADA" && data.datos.ESTATUS_PAGO_2023E2 != "DEPOSITO RECHAZADO")) {
									contenido = contenido +
										'<img src="img/iconosV4/alert.svg" style = "width: 25px;"><br>';
								} else if ((data.datos.PAGADO_2023E2 == "0" || data.datos.PAGADO_2023E2 == "") && (data.datos.ESTATUS_PAGO_2023E2 == "NO PAGADA" || data.datos.ESTATUS_PAGO_2023E2 == "DEPOSITO RECHAZADO")) {
									contenido = contenido +
										'<img src="img/iconosV4/x-estatus-baja.svg" style = "width: 25px;"><br>';
								}

								contenido = contenido +
									'<span class = "bold">Forma de pago: <span class = "normal">' + data.datos.FORMA_ENTREGA_APOYO_2023E2 + '</span></span><br>' +
									'<span class = "bold">Recibes tu pago por medio de: <span class = "normal">' + data.datos.INSTITUCION_LIQUIDADORA_2023E2 + '</span></span><br>' +
									'<span class = "bold">Situacion actual del pago: <span class = "normal">' + data.datos.ESTATUS_PAGO_2023E2 + '</span></span><br>';
								if (data.datos.ESTATUS_PAGO_2023E2 != "NO PAGADA" && data.datos.ESTATUS_PAGO_2023E2 != "DEPOSITO RECHAZADO") {
									if (data.datos.FORMA_ENTREGA_APOYO_2023E2 == "DEPOSITO EN CUENTA") {
										if (data.datos.PAGADO_2023E2 == "1") {
											contenido = contenido +
												'<span class = "bold">Fecha de depÃ³sito: <span class = "normal">' + data.datos.FECHA_PAGO_2023E2 + '</span></span><br>';
										} else if ((data.datos.PAGADO_2023E2 == "0" || data.datos.PAGADO_2023E2 == "") && (data.datos.FECHA_PAGO_2023E2 != "" && data.datos.FECHA_PAGO_2023E2 != null)) {
											contenido = contenido +
												'<span class = "bold">Fecha de depÃ³sito: <span class = "normal">Recibiras tu pago a partir del ' + data.datos.FECHA_PAGO_2023E2 + '</span></span><br>';
										} else {
											contenido = contenido +
												'<span class = "bold">Fecha de depÃ³sito: <span class = "normal">PENDIENTE</span></span><br>';
										}
										contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE2(data.datos.PERIODOS_2023E2) + '</span></span><br>';
									} else {
										//
										if ((data.datos.PAGADO_2023E2 != "1") &&
											(data.datos.FECHA_PROGRAMADA_SOT_2023E2 != "" && data.datos.FECHA_PROGRAMADA_SOT_2023E2 != null) && (data.datos.DIR_PROGRAMADA_SOT_2023E2 != "" && data.datos.DIR_PROGRAMADA_SOT_2023E2 != null)
											&& (data.datos.ESTADO_ID != "12" && data.datos.ESTADO_ID != "15")) {
											contenido = contenido +
												'<span class = "bold">Fecha y lugar programado para la entrega: <span class = "normal">' + data.datos.FECHA_PROGRAMADA_SOT_2023E2 + ' ' + data.datos.DIR_PROGRAMADA_SOT_2023E2 + '</span></span><br>';
										}
										contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE2(data.datos.PERIODOS_2023E2) + '</span></span><br>';
										if ((data.datos.FECHA_PROGRAMADA_SOT_2023E2 != "" && data.datos.FECHA_PROGRAMADA_SOT_2023E2 != null) && (data.datos.DIR_PROGRAMADA_SOT_2023E2 != "" && data.datos.DIR_PROGRAMADA_SOT_2023E2 != null)
											&& (data.datos.ESTADO_ID != "12" && data.datos.ESTADO_ID != "15")) {
											contenido = contenido +
												'<br><span class = "piePagina">Esta informaciÃ³n se actualiza cada 24 horas y el lugar y/o fecha podrÃ­an variar por situaciones extraordinarias. Por favor ingresa <a href="https://www.gob.mx/becasbenitojuarez/articulos/segundo-pago-de-becas-benito-juarez-2023" target="_blank">aquÃ­</a> para corroborar la programaciÃ³n estatal y/o consulta directamente en tu plantel.</span><br>';
										}
									}
								}
								//Fin 
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									'<br>';
							}
							//FIN
							//TERCERA EMISION DEL 2023
							if (data.datos.EMISION_23EMISION3 == "1") {
								contenido = contenido +
									'<div class = "separador">' +
									'<span class = "bold" onClick = "septiembre2023()" id = "spanSuperior" style="cursor: pointer">Tercera EmisiÃ³n \u25B6</span>' +
									'<div id = "verSeptiembre2023" style="display: none">' +
									'<div class="timeline-item">';
								if (data.datos.PAGADO_23EMISION3 == "1") {
									contenido = contenido +
										'<img src="img/check_relleno.svg" style = "width: 25px;"><br>';
								} else if ((data.datos.PAGADO_23EMISION3 == "0" || data.datos.PAGADO_23EMISION3 == "") && (data.datos.ESTATUS_PAGO_23EMISION3 != "NO PAGADA" && data.datos.ESTATUS_PAGO_23EMISION3 != "DEPOSITO RECHAZADO")) {
									contenido = contenido +
										'<img src="img/iconosV4/alert.svg" style = "width: 25px;"><br>';
								} else if ((data.datos.PAGADO_23EMISION3 == "0" || data.datos.PAGADO_23EMISION3 == "") && (data.datos.ESTATUS_PAGO_23EMISION3 == "NO PAGADA" || data.datos.ESTATUS_PAGO_23EMISION3 == "DEPOSITO RECHAZADO")) {
									contenido = contenido +
										'<img src="img/iconosV4/x-estatus-baja.svg" style = "width: 25px;"><br>';
								}

								contenido = contenido +
									'<span class = "bold">Forma de pago: <span class = "normal">' + data.datos.FORMA_ENTREGA_APOYO_23EMI3 + '</span></span><br>' +
									'<span class = "bold">Recibes tu pago por medio de: <span class = "normal">' + data.datos.INSTITUCION_LIQUIDADORA_23EMISION3 + '</span></span><br>' +
									'<span class = "bold">Situacion actual del pago: <span class = "normal">' + data.datos.ESTATUS_PAGO_23EMISION3 + '</span></span><br>';
								if (data.datos.ESTATUS_PAGO_23EMISION3 != "NO PAGADA" && data.datos.ESTATUS_PAGO_23EMISION3 != "DEPOSITO RECHAZADO") {
									if (data.datos.FORMA_ENTREGA_APOYO_23EMI3 == "DEPOSITO EN CUENTA") {
										if (data.datos.PAGADO_23EMISION3 == "1") {
											contenido = contenido +
												'<span class = "bold">Fecha de depÃ³sito: <span class = "normal">' + data.datos.FECHA_PAGO_23EMISION3 + '</span></span><br>';
										} else if ((data.datos.PAGADO_23EMISION3 == "0" || data.datos.PAGADO_23EMISION3 == "") && (data.datos.FECHA_PAGO_23EMISION3 != "" && data.datos.FECHA_PAGO_23EMISION3 != null)) {
											contenido = contenido +
												'<span class = "bold">Fecha de depÃ³sito: <span class = "normal">Recibiras tu pago a partir del ' + data.datos.FECHA_PAGO_23EMISION3 + '</span></span><br>';
										} else {
											contenido = contenido +
												'<span class = "bold">Fecha de depÃ³sito: <span class = "normal">PENDIENTE</span></span><br>';
										}
										contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE3(data.datos.PERIODOS_23EMISION3) + '</span></span><br>';
									} else {
										//
										if ((data.datos.PAGADO_23EMISION3 != "1") &&
											(data.datos.FECHA_PROGRAMADA_SOT_23EMI3 != "" && data.datos.FECHA_PROGRAMADA_SOT_23EMI3 != null) && (data.datos.DIR_PROGRAMADA_SOT_23EMISION3 != "" && data.datos.DIR_PROGRAMADA_SOT_23EMISION3 != null)
											&& (data.datos.ESTADO_ID != "12" && data.datos.ESTADO_ID != "15")) {
											contenido = contenido +
												'<span class = "bold">Fecha y lugar programado para la entrega: <span class = "normal">' + data.datos.FECHA_PROGRAMADA_SOT_23EMI3 + ' ' + data.datos.DIR_PROGRAMADA_SOT_23EMISION3 + '</span></span><br>';
										}
										contenido = contenido +
											'<span class = "bold">Periodos: <span class = "normal">' + periodoE3(data.datos.PERIODOS_23EMISION3) + '</span></span><br>';
										if ((data.datos.FECHA_PROGRAMADA_SOT_23EMI3 != "" && data.datos.FECHA_PROGRAMADA_SOT_23EMI3 != null) && (data.datos.DIR_PROGRAMADA_SOT_23EMISION3 != "" && data.datos.DIR_PROGRAMADA_SOT_23EMISION3 != null)
											&& (data.datos.ESTADO_ID != "12" && data.datos.ESTADO_ID != "15")) {
											contenido = contenido +
												'<br><span class = "piePagina">Esta informaciÃ³n se actualiza cada 24 horas y el lugar y/o fecha podrÃ­an variar por situaciones extraordinarias. Por favor ingresa <a href="https://www.gob.mx/becasbenitojuarez/articulos/segundo-pago-de-becas-benito-juarez-2023" target="_blank">aquÃ­</a> para corroborar la programaciÃ³n estatal y/o consulta directamente en tu plantel.</span><br>';
										}
									}
								}
								//Fin 
								contenido = contenido +
									'</div>' +
									'</div>' +
									'</div>' +
									'<br>';
							}
							//FIN
							contenido = contenido +
								'</div>' + //Div cierra style
								'</div>' + //
								'</div>' +
								'</div>'; //Div que cierra al row
							//} 
						}
						//Fin apartado emisiones pendientes
						//Apartado de causal y fundamentacion en caso de bajas 
						if (status == "BAJA") {
							//Modulo Fundamentacion
							contenido = contenido +
								'<div class="row">' +
								'<div class="col-12 resultado-line">' +
								'<div class="row">' +
								'<div class="col-3 icon text-center">' +
								'<img src="img/script.svg">' +
								'</div>' +
								'<div class="col-9 resultado-text">';
							/*if (data.datos.PROGRAMA == "BASICA") {
								contenido = contenido +
									'<div class="row">' +
									'<span class = "normal">Fundamento Legal (<a href = "https://www.gob.mx/cms/uploads/attachment/file/788915/Reglas_de_Operacion_2023_Educacion_Basica.pdf" target=â€_blankâ€>Reglas de OperaciÃ³n</a>):</span>' +
									'</div>';

							} else if (data.datos.PROGRAMA == "BUEEMS") {
								contenido = contenido +
									'<div class="row">' +
									'<span class = "normal">Fundamento Legal (<a href = "https://www.gob.mx/cms/uploads/attachment/file/788918/Reglas_de_Operacion_2023_Media_Superior.pdf" target=â€_blankâ€>Reglas de OperaciÃ³n</a>):</span>' +
									'</div>';

							} else if (data.datos.PROGRAMA = "JEF") {
								contenido = contenido +
									'<div class="row">' +
									'<span class = "normal">Fundamento Legal (<a href = "https://www.gob.mx/cms/uploads/attachment/file/788921/Reglas_de_Operacion_2023_Superior.pdf" target=â€_blankâ€>Reglas de OperaciÃ³n</a>):</span>' +
									'</div>';
							}*/
							if (data.datos.ETIQUETA_BAJA != "" && data.datos.ETIQUETA_BAJA != null) {
								contenido = contenido +
									'<div class="row">' +
									//Nuevo
									'<div class = "contenedor_Baja"><span class = "etiqueta_Baja"><b>' + data.datos.ETIQUETA_BAJA + '</b></span></div>' +
									'</div>' +
									'<br>';
							}
							if (data.datos.EJERCICIO_FISCAL_BAJA != "" && data.datos.EJERCICIO_FISCAL_BAJA != null && data.datos.EJERCICIO_FISCAL_BAJA != "S/E") {
								contenido = contenido +
									'<div class = "row">' +
									'<span class = "normal">Ejercicio Fiscal de la Baja: <b>' + data.datos.EJERCICIO_FISCAL_BAJA + '</b></span>' +
									'</div>' +
									'<br>';
							}
							if (data.datos.EXPLICACION_MOTIVO_BAJA != "" && data.datos.EXPLICACION_MOTIVO_BAJA != null) {
								contenido = contenido +
									'<div class = "row">' +
									'<span class = "normal">Motivo de baja: <b>' + data.datos.EXPLICACION_MOTIVO_BAJA + '</b></span>' +
									'</div>' +
									'<br>';
							}
							contenido = contenido +
								'<div class = "row">' +
								'<span class = "normal">FundamentaciÃ³n: <b>' + data.datos.FUNDAMENTACION + '</b></span>' +
								'</div>' +
								//Fin
								'</div>' +
								'</div>' +
								'</div>' +
								'</div>';
							//Fin modulo fundamentacion 
							contenido = contenido +
								'<div class="row">' +
								'<div class="col-12 resultado-line">' +
								'<div class="row">' +
								'<div class="col-3 icon text-center">' +
								'<img src="img/email.svg">' +
								'</div>' +
								'<div class="col-9 resultado-text">' +
								'<div class="row">' +
								'<span class = "normal">Â¿Quieres hacer una aclaraciÃ³n?</span>' +
								'</div>' +
								'<div class="row pt-2">' +
								'<span class = "normal">Marca desde cualquier parte del paÃ­s a AtenciÃ³n Ciudadana de la CoordinaciÃ³n Nacional al nÃºmero 55 1162 0300, en un horario de atenciÃ³n de lunes a viernes de 08:00 a 22:00 horas y sÃ¡bado de 9:00 a 14:00 horas (hora del centro de MÃ©xico)</span>' +
								'</div>' +
								'<div class="row pt-2">' +
								'<span class = "normal">Consulta las Reglas de OperaciÃ³n de los Programas de la CoordinaciÃ³n Nacionalde Becas Benito JuÃ¡rez</span>' +
								'</div>' +
								'</div>' +
								'</div>' +
								'</div>' +
								'</div>';
						}
						//
						//Apartado del buzon de mensajes 
						if (data.datos.PROGRAMA == "BASICA" && (pendiente == 1 || data.datos.EN_REVISION == "1")) {
							contenido = contenido + buzonHeader();
							if (pendiente == 1) {
								contenido = contenido +
									'<span class = "normal">' +
									'Estimada/o beneficiaria/o de los Programas de Becas para el Bienestar Benito JuÃ¡rez<br><br>' +
									'Tu estatus en nuestro padrÃ³n de personas beneficiarias es REVISIÃ“N debido a que necesitamos validar la inscripciÃ³n de la o el becario de tu familia.<br><br>' +
									'Sigue estos pasos:<br><br>' +
									'1.	Ingresa al <a href = "https://citas.becasbenitojuarez.gob.mx/agendar-cita" target="_blank">Sistema de Citas</a><br>' +
									'2.	Elige el trÃ¡mite Solicitud de RevisiÃ³n de Estatus<br>' +
									'3.	El dÃ­a de tu cita, acude con tu documentaciÃ³n completa<br><br>' +
									'Ingresa a la siguiente <a href = "https://www.gob.mx/becasbenitojuarez/articulos/que-tramites-puedes-realizar-en-la-coordinacion-nacional-de-becas-para-el-bienestar-benito-juarez-durante-este-mes" target="_blank">liga</a>, verifica la disponibilidad del trÃ¡mite y, Â¡agenda tu cita!<br><br>' +
									'DocumentaciÃ³n: <br><br>' +
									'Presenta <b>ORIGINAL</b> para cotejo y <b>UNA COPIA</b> de los siguientes documentos. Deben estar en <b>BUEN ESTADO</b> y ser <b>VIGENTES</b><br><br>' +
									'1.	<b>IdentificaciÃ³n de la madre, padre, representante (abuela, abuelo, hermana o hermano mayor de edad), tutora o tutor</b><br>' +
									'<b>Elige una de las siguientes:</b><br><br>' +
									'â—	INE<br>' +
									'â—	Pasaporte<br>' +
									'â—	Cartilla de servicio militar (hombres)<br>' +
									'â—	Credencial con fotografÃ­a de servicios mÃ©dicos de una instituciÃ³n pÃºblica de salud o seguridad social<br>' +
									'â—	Credencial con fotografÃ­a de jubilada/o u pensionada/o emitida por una instituciÃ³n de seguridad social<br>' +
									'â—	Constancia de autoridad federal, estatal o municipal, con las siguientes caracterÃ­sticas:<br>' +
									'- Vigencia no mayor a 6 meses<br>' +
									'- Nombre completo de la o el solicitante, fecha de nacimiento, domicilio completo, fotografÃ­a y firma o huella dactilar<br>' +
									'- Nombre completo de la autoridad local, firma y sellos oficiales <br>' +
									'2.	<b>CURP de la madre, padre, representante (abuela, abuelo, hermana o hermano mayor de edad), tutora o tutor </b><br>' +
									'3.	<b>CURP de la o el becario</b><br>' +
									'4.	<b>Acta de nacimiento de la o el becario</b><br>' +
									'La poblaciÃ³n extranjera puede presentar Documentos Migratorios en sustituciÃ³n del acta de nacimiento<br>' +
									'5.	<b>Documento escolar</b><br>' +
									'<b>Elige uno de las siguientes:</b><br><br>' +
									'â—	Constancia de estudios del ciclo escolar vigente (si la solicitud se realiza durante la vigencia del ciclo escolar)<br>' +
									'â—	Credencial escolar con fotografÃ­a<br>' +
									'â—	Formato de inscripciÃ³n o reinscripciÃ³n<br>' +
									'â—	Informe de calificaciones<br>' +
									'â—	Tira de materias<br>' +
									'â—	Constancia de historia acadÃ©mica certificada<br>' +
									'â—	Cualquier otro documento que contenga informaciÃ³n sobre la inscripciÃ³n, con las siguientes caracterÃ­sticas:<br>' +
									'- Vigencia no mayor a 6 meses<br>' +
									'- Nombre completo de la o el alumno<br>' +
									'- CURP de la o el alumno<br>' +
									'- Nombre y clave del centro del trabajo del plantel<br>' +
									'- Firma de la o el director o autoridad educativa<br>' +
									'- Sello de la escuela, cÃ³digo QR o firma electrÃ³nica<br>' +
									'- Ciclo o periodo de inscripciÃ³n de la o el alumno o, en su defecto, fecha de emisiÃ³n y de expediciÃ³n del documento<br><br>' +
									'DespuÃ©s de tu cita, consulta constantemente el Buscador de Estatus para conocer tu estatus final dentro de nuestro padrÃ³n de personas beneficiarias.<br><br>' +
									'Debido a los procesos electorales que se llevan a cabo en Coahuila y Estado de MÃ©xico, estas entidades no podrÃ¡n realizar el trÃ¡mite.<br>'
								'</span>';
							} else if (data.datos.EN_REVISION == "1") {
								contenido = contenido +
									'<span class = "normal">' +
									'Â¡Tu verificaciÃ³n de la inscripciÃ³n fue exitosa! Tu familia recibirÃ¡ la beca correspondiente a la 2Âª emisiÃ³n de 2023 (marzo, abril, mayo y junio). <br><br>' +
									'Mantente al tanto del apartado BancarizaciÃ³n para conocer la fecha de tu prÃ³ximo pago.' +
									'</span>';

							}
							contenido = contenido + buzonPie();
						}
						//Para los formularios 6,7 y 8, las reglas se validaran al final
						/*
						CRITERIOS (CON BASE AL OFICIO ENVIADO)
						Criterios formulario 6 -> BASICA, ACTIVO 
						Criterios formulario 7 -> BASICA O BUEEMS Y ACTIVO
						Criterios formulario 8 -> BASICA, BUEEMS O JEF, MENORES DE EDAD Y ACTIVOS 
						 */
						let formulario6 = 0;
						let formulario7 = 0;
						let formulario8 = 0;
						//Formulario 6
						if (data.datos.PROGRAMA == "BASICA" && data.datos.SITUACION_INSCRIPCION_ACTUAL == "ACTIVA") {
							formulario6 = formulario6 + 1;
						}
						//Formulario 7
						if ((data.datos.PROGRAMA == "BASICA" || data.datos.PROGRAMA == "BUEEMS") && data.datos.SITUACION_INSCRIPCION_ACTUAL == "ACTIVA") {
							formulario7 = formulario7 + 1;
						}
						//Formulario 8
						//Para saber si es menor o mayor de edad
						let nacimiento = data.datos.FECHA_NACIMIENTO_BECARIO;
						//Fecha de nacimiento en milisegundos
						let nacimiento_milisegundos = formularioTiempo(nacimiento);
						//Fecha al dia de hoy en milisegundos
						var hoy = new Date();
						var local = hoy.toLocaleDateString();
						var habilitaFormulario = formularioTiempo(local);
						//18 aÃ±os en milisegundos
						let aÃ±os_milisegundos = '567648000000';
						//Diferencia en milisegundos de la cita con la fecha de nacimiento
						let residuo_milisegundos = habilitaFormulario - nacimiento_milisegundos;
						//Si el residuo es igual o menor a 18 aÃ±os
						if (residuo_milisegundos <= aÃ±os_milisegundos && data.datos.SITUACION_INSCRIPCION_ACTUAL == "ACTIVA") {
							formulario8 = formulario8 + 1;
						}
							if (formulario1 > 0 || formulario2 > 0 || formulario4 > 0 || formulario6 > 0 || formulario7 > 0 || formulario8 > 0) {
								$.ajax({
									type: "POST",
									url: "metodos/procesadorFormularios.php",
									data: {
										formulario1: formulario1,
										formulario2: formulario2,
										//formulario3: formulario3,
										formulario4: formulario4,
										//formulario5: formulario5,
										formulario6: formulario6,
										formulario7: formulario7,
										formulario8: formulario8,
									},
									dataType: "json",
									crossDomain: true,
									success: function (control) {
										let contenido = "";
										contenido = contenido +
											'<div class="row">' +
											'<div class="col-12 resultado-line">' +
											'<div class="row">' +
											'<div class="col-3 icon text-center">' +
											'<img src="img/iconosV4/atencion.svg">' +
											'</div>' +
											'<div class = "col-9 resultado-text">' +
											'<span class = "info">Entra a la <a href="https://buscador.becasbenitojuarez.gob.mx/consulta/formulario/tablero.php?tab=' + data.CODE + '&key=' + data.KEY + '&control=' + control.CONTROLER + '" target = "_blank">Ventanilla Virtual</a> de AtenciÃ³n Ciudadana y ponte en contacto con nosotros</span><br>' +
											'</div>' +
											'</div>' +
											'<div class = "row barra">' +
											'<div>' +
											'<br>' +
											'</div>' +
											'</div>' +
											'</div>';
										$("#formularios").html(contenido);
									}
								});
								contenido = contenido +
									'<div id="formularios"></div>';
							}
							contenido = contenido +
								'</div>' +
								'</div>' +
								'</div>';
							//Termina Aqui -------------------------------------
							$("#resultado").html(contenido);
						} else if (data.status == 200 && data.datos.MENSAJE == "FAVOR DE INGRESAR EL CURP DEL BENEFICIARIO") {
							bootbox.dialog({
								centerVertical: true,
								message: "Favor de ingresar el CURP del beneficiario.",
								closeButton: true
							});
						}
					} else if (data.status == 422) {

						var error = data.message;
						var mensaje = "";
						for (var i in error) {
							var error_msg = error[i];
							mensaje = mensaje + error_msg + "<br>";

						}
						bootbox.dialog({
							centerVertical: true,
							message: mensaje,
							closeButton: true
						});

					} else if (data.status == 424) {
						bootbox.dialog({
							centerVertical: true,
							message: "DEBES DE RESOLVER EL CAPTCHA.",
							closeButton: true
						});

					} else if (data.status == 423) {
						bootbox.dialog({
							centerVertical: true,
							message: "El captcha no se resolviÃ³ de manera correcta.",
							closeButton: true
						});

					} else {
						bootbox.dialog({
							centerVertical: true,
							message: "Â¡OcurriÃ³ un error al buscar el beneficiario!",
							closeButton: true
						});

					}
				},
				error: function (data) {
					console.log('Error:', data);
					bootbox.dialog({
						centerVertical: true,
						message: "Â¡OcurriÃ³ un error al buscar el beneficiario!",
						closeButton: true
					});
				},
				complete: function () {
					setTimeout(function () {
						$("#preloader").fadeOut(500);
					}, 200);
				}
			});
	}
	$("#buscar").on("click", function () {
		buscar_beneficiario();
	});
	$('[data-toggle="tooltip"]').tooltip();

});
//Muestra el apartado de bancarizacion
function mostrarBeca() {
	//Cerrar el div de la timeline y el div del buzon
	var divBecas = document.getElementById("becas");
	var divTarjeta = document.getElementById("tarjeta");
	if (divBecas != null) {
		if (divBecas.style.display === "block") {
			divBecas.style.display = "none";
			document.getElementById("spanBecas").textContent = "Ver \u25B6";
		}
	}
	if (divTarjeta != null) {
		if (divTarjeta.style.display === "block") {
			divTarjeta.style.display = "none";
			document.getElementById("spanTarjeta").textContent = "Ver \u25B6";
		}
	}
	//Abrir el otro div
	var divEmisiones = document.getElementById("beca");
	if (divEmisiones.style.display === "none") {
		divEmisiones.style.display = "block";
		document.getElementById("spanBeca").textContent = "Ocultar \u25BC";
	} else {
		divEmisiones.style.display = "none";
		document.getElementById("spanBeca").textContent = "Ver \u25B6";
	}
}
//Para mostrar Banco Azteca
//Abrir el otro div
function mostrarAzteca() {
	var divAzteca = document.getElementById("azteca");
	if (divAzteca.style.display === "none") {
		divAzteca.style.display = "block";
		document.getElementById("spanAzteca").textContent = "Ocultar \u25BC";
	} else {
		divAzteca.style.display = "none";
		document.getElementById("spanAzteca").textContent = "Ver \u25B6";
	}
}
//Fin 
//Para mostrar buzon
function mostrar() {
	//Cerrar el div de la timeline y el div de emisiones
	var divBecas = document.getElementById("becas");
	var divEmisiones = document.getElementById("emisiones");
	if (divBecas != null) {
		if (divBecas.style.display === "block") {
			divBecas.style.display = "none";
			document.getElementById("spanBecas").textContent = "Ver \u25B6";
		}
	}
	if (divEmisiones != null) {
		if (divEmisiones.style.display === "block") {
			divEmisiones.style.display = "none";
			document.getElementById("spanEmisiones").textContent = "Ver \u25B6";
		}
	}
	//Abrir el otro div
	var divTarjeta = document.getElementById("tarjeta");
	if (divTarjeta.style.display === "none") {
		divTarjeta.style.display = "block";
		document.getElementById("spanTarjeta").textContent = "Ocultar \u25BC";
	} else {
		divTarjeta.style.display = "none";
		document.getElementById("spanTarjeta").textContent = "Ver \u25B6";
	}

}
//Elementos del buzon
function mensajeUno() {
	var divUno = document.getElementById("Uno");
	if (divUno.style.display === "block") {
		divUno.style.display = "none";
	} else if (divUno.style.display === "none") {
		divUno.style.display = "block";
	}
}

function mensajeDos() {
	var divDos = document.getElementById("Dos");
	if (divDos.style.display === "block") {
		divDos.style.display = "none";
	} else if (divDos.style.display === "none") {
		divDos.style.display = "block";
	}
}

function mensajeTres() {
	var divTres = document.getElementById("Tres");
	if (divTres.style.display === "block") {
		divTres.style.display = "none";
	} else if (divTres.style.display === "none") {
		divTres.style.display = "block";
	}
}

function mensajesContador(mensajes) {
	var mensajes = mensajes;
	var arrayContador = [["0", "0"], ["Uno", "1"], ["Dos", "2"], ["Tres", "3"], ["Cuatro", "4"], ["Cinco", "5"], ["Seis", "6"], ["Siete", "7"], ["Ocho", "8"],
	["Nueve", "9"]];
	var i = 0;
	do {
		var numero = arrayContador[i][1];
		var numeroEscrito = arrayContador[i][0];
		i = i + 1;
	} while (numero != mensajes);
	return numeroEscrito;
}
//Funciones para la version 5

function septiembre2023() {
	var divSeptiembre = document.getElementById("verSeptiembre2023");
	if (divSeptiembre.style.display === "block") {
		divSeptiembre.style.display = "none";
	} else if (divSeptiembre.style.display === "none") {
		divSeptiembre.style.display = "block";
	}
}

function mayo2023() {
	var divMayo = document.getElementById("verMayo");
	if (divMayo.style.display === "block") {
		divMayo.style.display = "none";
	} else if (divMayo.style.display === "none") {
		divMayo.style.display = "block";
	}
}

function febrero2023() {
	var divSeptiembre = document.getElementById("verSeptiembre");
	if (divSeptiembre.style.display === "block") {
		divSeptiembre.style.display = "none";
	} else if (divSeptiembre.style.display === "none") {
		divSeptiembre.style.display = "block";
	}
}

function febrero2022() {
	var divSeptiembre = document.getElementById("verFebrero2022");
	if (divSeptiembre.style.display === "block") {
		divSeptiembre.style.display = "none";
	} else if (divSeptiembre.style.display === "none") {
		divSeptiembre.style.display = "block";
	}
}

function junio2022() {
	var divSeptiembre = document.getElementById("verJunio2022");
	if (divSeptiembre.style.display === "block") {
		divSeptiembre.style.display = "none";
	} else if (divSeptiembre.style.display === "none") {
		divSeptiembre.style.display = "block";
	}
}

function septiembre2022() {
	var divSeptiembre = document.getElementById("verSeptiembre2022");
	if (divSeptiembre.style.display === "block") {
		divSeptiembre.style.display = "none";
	} else if (divSeptiembre.style.display === "none") {
		divSeptiembre.style.display = "block";
	}
}
function pagos2022() {
	//Cerrar el div 2023
	var div2023 = document.getElementById("pagos2023");
	if (div2023 != null) {
		if (div2023.style.display === "block") {
			div2023.style.display = "none";
			$('#2023').css({ 'color': '#000000' });
			$('#div2023').css({ 'background-color': '#FFFFFF' });
		}
	}
	//Si no esta abierto
	var div2022 = document.getElementById("pagos2022");
	if (div2022.style.display === "none") {
		div2022.style.display = "block";
		//Cambiar color
		$('#2022').css({ 'color': '#FFFFFF' });
		$('#div2022').css({ 'background-color': '#235B4E' });
	} else {
		div2022.style.display = "none";
		$('#2022').css({ 'color': '#000000' });
		$('#div2022').css({ 'background-color': '#FFFFFF' });
	}

}
function pagos2023() {
	//Cerrar div de pagos 2022
	//Cerrar el div de la timeline y el div del buzon
	var div2022 = document.getElementById("pagos2022");
	if (div2022 != null) {
		if (div2022.style.display === "block") {
			div2022.style.display = "none";
			$('#2022').css({ 'color': '#000000' });
			$('#div2022').css({ 'background-color': '#FFFFFF' });
		}
	}
	//Abrir el correspondiente div
	var div2023 = document.getElementById("pagos2023");
	if (div2023.style.display === "none") {
		div2023.style.display = "block";
		//Cambiar color
		$('#2023').css({ 'color': '#FFFFFF' });
		$('#div2023').css({ 'background-color': '#235B4E' });
	} else {
		div2023.style.display = "none";
		$('#2023').css({ 'color': '#000000' });
		$('#div2023').css({ 'background-color': '#FFFFFF' });
	}
}
//Grupo familar
function mostrarGrupo() {
	var divFamilia = document.getElementById("familia");
	if (divFamilia != null) {
		if (divFamilia.style.display === "block") {
			document.getElementById("Familia").textContent = "Ver \u25B6";
			divFamilia.style.display = "none";
		} else if (divFamilia.style.display === "none") {
			document.getElementById("Familia").textContent = "Ocultar \u25BC";
			divFamilia.style.display = "block";
		}
	}
}
//Documentacion bancarizacion. 
function mostrarDocumentos() {
	var divDocumentos = document.getElementById("documentos");
	if (divDocumentos != null) {
		if (divDocumentos.style.display === "block") {
			document.getElementById("Documentos").textContent = "Ver \u25B6";
			divDocumentos.style.display = "none";
		} else if (divDocumentos.style.display === "none") {
			document.getElementById("Documentos").textContent = "Ocultar \u25BC";
			divDocumentos.style.display = "block";
		}
	}
}

//Funcion formulario tiempo 
function formularioTiempo(fechaB) {
	let fecha = fechaB;
	//Separar la cadena 
	let inDia = fecha.indexOf("/");
	let dia = fecha.substring(0, inDia);
	let mes = fecha.substring(3, 5);
	let longitudPeriodo = fecha.length;
	let anio = fecha.substring(longitudPeriodo - 4, longitudPeriodo);
	var fechaAPI = anio + ", " + mes + ", " + dia;
	var convfecha = new Date(fechaAPI);
	convfecha.toLocaleDateString();
	var milifecha = Date.parse(convfecha);
	return milifecha;
}

function siglas(siglas) {
	let programaSiglas = siglas;
	let programaActual = "";
	switch (programaSiglas) {
		case 'BASICA':
			programaActual = "Becas de EducaciÃ³n BÃ¡sica para el Bienestar Benito JuÃ¡rez";
			break;
		case 'BUEEMS':
			programaActual = "Beca Universal para el Bienestar Benito JuÃ¡rez de EducaciÃ³n Media Superior (BUEEMS)";
			break;
		case 'JEF':
			programaActual = "Beca para el Bienestar Benito JuÃ¡rez de EducaciÃ³n Superior (JEF)";
			break;
	}
	return programaActual;
}


function separarLiquidadora(separar) {
	let liquidadora = separar;
	let resultados = [];
	if (liquidadora != "" && liquidadora != null && liquidadora != undefined) {
		let caracteres = liquidadora.indexOf("-");
		let mod = liquidadora.lenght;
		if (caracteres > 0) {
			var sub_Liquidadora = liquidadora.substring(0, caracteres).trim();
			var sub_Modalidad = liquidadora.substring(caracteres + 1, mod).trim();
			resultados.push(sub_Liquidadora);
			resultados.push(sub_Modalidad);
		}
	} else {
		var sub_Liquidadora = "";
		var sub_Modalidad = "";
		resultados.push(sub_Liquidadora);
		resultados.push(sub_Modalidad);
	}
	return resultados;
}

function tipoconversion(tipo_persona) {
	var tipo_persona = tipo_persona;
	switch (tipo_persona) {
		case '1':
			var texto = "Becario/a"
			return texto
		case '2':
			var texto = "Representante de la familia"
			return texto
		case '3':
			var texto = "Otro"
			return texto
	}
}

function imagen(programa) {
	let imagenPrograma = programa;
	switch (imagenPrograma) {
		case 'BASICA':
			imagenPrograma = "iconoBasica.JPG";
			return imagenPrograma;
		case 'BUEEMS':
			imagenPrograma = "iconoBUEEMS.JPG";
			return imagenPrograma;
		case 'JEF':
			imagenPrograma = "iconoJEF.JPG";
			return imagenPrograma;
	}
}

function periodo(periodo) {
	let periodo_id = periodo;
	let texto = "";
	switch (periodo_id) {
		case "2":
			texto = "ENERO Y FEBRERO";
			return texto;
		case "3":
			texto = "ENERO, FEBRERO Y MARZO";
			return texto;
		case "4":
			texto = "ENERO, FEBRERO, MARZO Y ABRIL";
			return texto;
		case "5":
			texto = "ENERO, FEBRERO, MARZO, ABRIL Y MAYO";
			return texto;
		case "6":
			texto = "ENERO, FEBRERO, MARZO, ABRIL, MAYO Y JUNIO";
			return texto;
		default:
			texto = ""
			return texto;
	}
}

function periodoE2(periodo) {
	let periodo_id = periodo;
	let texto = "";
	switch (periodo_id) {
		case "1":
			texto = "MARZO";
			return texto;
		case "2":
			texto = "MARZO Y ABRIL";
			return texto;
		case "3":
			texto = "MARZO, ABRIL Y MAYO";
			return texto;
		case "4":
			texto = "MARZO, ABRIL, MAYO Y JUNIO";
			return texto;
		default:
			texto = ""
			return texto;
	}
}

function periodoE3(periodos) {
	let periodo_id = periodos;
	let texto = "";
	switch (periodo_id) {
		case "1":
			texto = "SEPTIEMBRE";
			return texto;
		case "2":
			texto = "SEPTIEMBRE Y OCTUBRE";
			return texto;
		case "3":
			texto = "SEPTIEMBRE, OCTUBRE Y NOVIEMBRE";
			return texto;
		case "4":
			texto = "SEPTIEMBRE, OCTUBRE, NOVIEMBRE Y DICIEMBRE";
			return texto;
		default:
			texto = ""
			return texto;
	}
}

function buzonHeader() {
	let texto = '';
	texto = '<div class="row">' +
		'<div class="col-12 resultado-line">' +
		'<div class="row">' +
		'<div class="col-3 icon text-center">' +
		'<img src="img/iconosV4/buzon-mensajes.svg">' +
		'</div>' +
		'<div class = "col-9 resultado-text">' +
		'<span class = "info">BuzÃ³n de mensajes</span><br>' +
		'</div>' +
		'</div>' +
		'<div class = "row barra">' +
		'<span class = "mostrar normal" onClick = "mostrar()" id = "spanTarjeta">Ver \u25B6</span>' +
		'<div id = "tarjeta" style="display: none">' +
		'<br>';
	return texto;
}
function buzonPie() {
	let texto = '';
	texto = '</div>' +
		'</div>' +
		'</div>';
	return texto;
}