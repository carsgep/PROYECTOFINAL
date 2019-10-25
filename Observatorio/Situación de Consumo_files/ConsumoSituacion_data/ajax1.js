$(document).ready(function () {
    var Depto = "";

    $('#selectAll').click(function (event) {  //on click 
        if (this.checked) { // check select status
            $('.chkclass').each(function () { //loop through each checkbox
                this.checked = true;  //select all checkboxes
            });
            //var html = "<input type='text' value='Todos los departamentos' id='iptDepto' class='iptDepto' onclick=\"showDiv('divDepto')\" />";
            // $('#imgSel').html(html);
        } else {
            $('.chkclass').each(function () { //loop through each checkbox
                this.checked = false; //deselect all checkboxes
            });
            //var html = "<img src=\"../Images/select.png\" onclick=\"showDiv('divDepto');\" />";
            //$('#imgSel').html(html);
        }
    });
});

function showDiv(div) {
    $("#" + div).toggle(100);
    nomDeptos();
}

function hideDiv(div) {
    $("#" + div).hide(100);
    nomDeptos();
}

function nomDeptos() {
    var id;
    var Depto = "";
    var valDepto = "";

    if ($('#selectAll').is(":checked")) {
        Depto = "Todos";
    }
    else {
        $("input[name='Depto[]']:checked").each(function () {
            id = $(this).val();

            if (id == "00")
                Depto = "Internacional";
            else if (id == "00" && Depto != "")
                Depto = Depto + ", Internacional";
            else if (Depto == "")
                Depto = $('#' + id).val();
            else
                Depto = Depto + ", " + $('#' + id).val();
        });
    }

    if (Depto != "")
        var html = "<input type='text' value='" + Depto + "' id='iptDepto' class='iptDepto' onclick=\"showDiv('divDepto')\" />";
    else
        var html = "<img src=\"../Images/select.png\" onclick=\"showDiv('divDepto');\" />";
    $('#imgSel').html(html);
}

function unCheck() {

    if ($('#selectAll').is(":checked")) {
        //$('#selectAll').is(":checked")
        $("#selectAll").removeAttr("checked");
    }
}

/***************** LOADER *******************************/
function ajaxindicatorstart(text) {
    jQuery('body').append('<div id="resultLoading" style="display:none"><div><img src="../Images/visor-load.gif"><div>' + text + '</div></div></div>');

    jQuery('#resultLoading').css({
        'width': '100%',
        'height': '100%',
        'position': 'fixed',
        'z-index': '10000000',
        'top': '0',
        'left': '0',
        'right': '0',
        'bottom': '0',
        'margin': 'auto'
    });

    jQuery('#resultLoading .bg').css({
        'background': '#000000',
        'opacity': '0.7',
        'width': '100%',
        'height': '100%',
        'position': 'absolute',
        'top': '0'
    });

    jQuery('#resultLoading>div:first').css({
        'width': '250px',
        'height': '75px',
        'text-align': 'center',
        'position': 'fixed',
        'top': '0',
        'left': '0',
        'right': '0',
        'bottom': '0',
        'margin': 'auto',
        'font-size': '16px',
        'z-index': '10',
        'color': '#ffffff'

    });

    jQuery('#resultLoading .bg').height('100%');
    jQuery('#resultLoading').fadeIn(300);
    jQuery('body').css('cursor', 'wait');
}

function ajaxindicatorstop() {
    jQuery('#resultLoading .bg').height('100%');
    jQuery('#resultLoading').fadeOut(300);
    jQuery('body').css('cursor', 'default');
}
/***************** LOADER *******************************/


/*function closeDiv() {
    $("#divMpal").hide();
    $("#opacoDiv").hide();
}*/

var tableErr;
var options = {
    "dom": '<f<"toolbar_0">t>',
    paging: false,
    //"bPaginate": false,
    //"pagingType": "full_numbers",
    "aaSorting": [],
    "language": {
        "decimal": ",",
        "thousands": "."
    },
};

function initDataTable(opt) {
    if (opt == 1)
        tableErr = $('#tblDatos').dataTable(options);
    else {
 
        tableErr = $('#tblDatos').dataTable(
        {
            //"dom": '<lipf<"toolbar_0">t>',
            "dom": '<f<"toolbar_0">t>',
            paging: false,
            //"pagingType": "full_numbers",
            "aaSorting": [],
            "language": {
                "decimal": ",",
                "thousands": "."
            },
            "bSort": false
        });

        // Order by the grouping
        $('#tblDatos tbody').on('click', 'tr.group', function () {       
            var currentOrder = table.order()[0];
            if (currentOrder[0] === 2 && currentOrder[1] === 'asc') {
                table.order([2, 'desc']).draw();
            }
            else {
                table.order([2, 'asc']).draw();
            }
        });
    }
}

function fnCollapseGroup(sGroup) {
    $("#td_" + sGroup).removeClass("expanded-group");
    $("#td_" + sGroup).addClass("collapsed-group");

    $('.group-item-' + sGroup).each(function () {
        $(this).hide();
    });

    /*tableErr.fnDestroy();
    initDataTable(0);*/
}

function fnExpandGroup(sGroup) {
    $("#td_" + sGroup).removeClass("collapsed-group");
    $("#td_" + sGroup).addClass("expanded-group");

    $('.group-item-' + sGroup).each(function () {
        $(this).show();
    });

    //initDataTable(0);
}

function ConsultarInc(id, value) {
    var Depto = "";
    var divTbl = "tblDatos";
    var Droga = $('#Droga').val();
    var dataType = "html";
    var grId = "";

    var iptAcc = 0;
    var trClass = "";
    var Desde = $('#fechaDesde').val();
    var Hasta = $('#fechaHasta').val();
    var total = Desde - Hasta;

    if (id == 0) {
        $("input[name='Depto[]']:checked").each(function () {
            Depto = Depto + "'" + $(this).val() + "', ";
            //Depto = Depto + $(this).val() + ", ";
        });
        Depto = Depto.substring(0, Depto.length - 2);
        //Depto = Depto + "'";
    }
    else {
        //Depto = "'" + value + "'";
        Depto = value;
        iptAcc = $('#ipt-' + Depto).val();
        trClass = $('#td_' + Depto).attr('class');
    }
    var html1 = "<div class='txtExport'>Exportar a: <!--div class='csv'></div-->" +
                    "<div class='pdf' onclick='ExportPdf(\"Inc\", 1, \"" + value + "\");'></div>" +
                    "<!--div class='txt'></div-->" +
                    "<div class='xlsx' onclick='ExportExcel(\"Inc\", 1, \"" + value + "\");'></div>" +
                    "<div id='titulo' class='divTitulo'><br /><br />";

     if (Desde == "" || Hasta == "" || Depto == "" || Droga == "") {
        displayModelMsg("Debe seleccionar un valor para cada variable");
        $('#bigBox').hide();
    }
    
   else if (Desde > Hasta) {
        displayModelMsg("La fecha inicial debe ser menor a la fecha final para realizar la consulta");
        $('#bigBox').hide();
    }
    else {       
        $('#bigBox').show();
        if (id != 0)
            dataType = "json";

        if (iptAcc == '1') {

            fnExpandGroup(Depto);
            $('#ipt-' + Depto).val('2');
        }
        else if (iptAcc == '2') {

            fnCollapseGroup(Depto);
            $('#ipt-' + Depto).val('1');
        }
        else {


            $.ajax({
                type: "POST",
                async: true,
                url: 'ConsultarInc',
                data: { 'id': id, 'Desde': $('#fechaDesde').val(), 'Hasta': $('#fechaHasta').val(), 'Depto': Depto, 'Droga': Droga },
                datatype: "html",
                success: function (data) {
                    var respuesta = JSON.parse(data);
              
                    var html = html1 + respuesta["Data"]["titulo"] + "<br /><br /><p id='subtituloIcautaciones' class='titulo3'></p><br /></div></div>";
              
           
                    if (id == 0) { 
                        $('#result').html(respuesta["Data"]["tabla"]);
                        initDataTable(1);
                        $("div.toolbar_0").html(html);
                        var unidades = respuesta["Data"]["unidades"];
                        var subtitulo = respuesta["Data"]["droga"] + " (Valores en " + unidades.charAt(0).toUpperCase() + unidades.slice(1).toLowerCase() + ")";
                        $("#subtituloIcautaciones").text(subtitulo);
                    }
                    else {               
                     
                        $('#ipt-' + Depto).val('2');
                        $("#td_" + Depto).removeClass("collapsed-group");
                        $("#td_" + Depto).addClass("expanded-group");
                        grId = "#group-id-" + Depto;
                        tableErr.fnDestroy();
                        $(respuesta["Data"]["tabla"]).insertAfter(grId);
                         initDataTable(2);
                         $("div.toolbar_0").html(html);
                    }
                },
                error: function () {
                    displayModelMsg("Se ha presentado un error en la consulta, intentelo más tarde, si persiste el error comuniquese con el administrador del sistema al correo: odc@minjusticia.gov.co", "Error");                
                }
            });
        }
    }
}

function ConsultarErr(id, value) {
    var Depto = "";
    var divTbl = "";
    var Cultivo = $('#Cultivo').val();
    var dataType = "html";
    var grId = "";
    divTbl = "tblDatos";

    var iptAcc = 0;
    var trClass = "";
    var Desde = $('#fechaDesde').val();
    var Hasta = $('#fechaHasta').val();
    var total = Desde - Hasta;

    if (id == 0) {
        $("input[name='Depto[]']:checked").each(function () {
            Depto = Depto + "'" + $(this).val() + "', ";
        });
        Depto = Depto.substring(0, Depto.length - 2);
    }
    else {
        // Depto = "'" + value + "'";
        Depto = value;
        iptAcc = $('#ipt-' + Depto).val();
        trClass = $('#td_' + Depto).attr('class');
    }

    var html1 = "<div class='txtExport'>Exportar a: <!--div class='csv'></div-->" +
                    "<div class='pdf' onclick='ExportPdf(\"Err\", 1, \"" + value + "\");'></div>" +
                    "<!--div class='txt'></div-->" +
                    "<div class='xlsx' onclick='ExportExcel(\"Err\", 1, \"" + value + "\");'></div>" +
                    "<div id='titulo' class='divTitulo'><br /><br />";

   
     if (Desde == "" || Hasta == "" || Depto == "" || Cultivo == "" || $('#TipoErr').val() == "") {
        displayModelMsg("Debe seleccionar un valor para cada variable");
        $('#bigBox').hide();
     }
     else if (Desde > Hasta) {

         displayModelMsg("La fecha inicial debe ser menor a la fecha final para realizar la consulta");
         $('#bigBox').hide();
     }
    else {
        $('#bigBox').show();

        if (id != 0)
            dataType = "json";

        if (iptAcc == '1') {      
            fnExpandGroup(Depto);
            $('#ipt-' + Depto).val('2');
        }
        else if (iptAcc == '2') {  
            fnCollapseGroup(Depto);
            $('#ipt-' + Depto).val('1');
        }
        else {
            $.ajax({
                type: "POST",
                async: true,
                url: 'ConsultarErr',
                data: { 'id': id, 'Desde': Desde, 'Hasta': Hasta, 'Depto': Depto, 'Cultivo': Cultivo, 'TipoErr': $('#TipoErr').val() },
                datatype: dataType,
                success: function (dat) {
                    var arr = dat.split("&&&");
                    var html = html1 + arr[0] + "<br /></div></div>"
                    var data = arr[1];
                    if (id == 0) {
                        $('#result').html(data);
                        initDataTable(1);

                        $("div.toolbar_0").html(html1);
                    }
                    else {
                        $('#ipt-' + Depto).val('2');
                        $("#td_" + Depto).removeClass("collapsed-group");
                        $("#td_" + Depto).addClass("expanded-group");

                        grId = "#group-id-" + Depto;
                        tableErr.fnDestroy();

                        $(data).insertAfter(grId);

                        initDataTable(2);

                        $("div.toolbar_0").html(html1);
                    }
                },
                error: function () {
                    displayModelMsg("Se ha presentado un error en la consulta, intentelo más tarde, si persiste el error comuniquese con el administrador del sistema al correo: odc@minjusticia.gov.co", "Error");
                }
            });
        }
    }
}

function ConsultarCultI(id, value) {
    var Depto = "";
    var Cultivo = $('#Cultivo').val();
    var Desde = $('#fechaDesde').val();
    var Hasta = $('#fechaHasta').val();
    var dataType = "html";
    var divTbl = "tblDatos";
    var iptAcc = 0;
    var trClass = "";
    var total = Desde - Hasta;

    if (id == 0) {
        $("input[name='Depto[]']:checked").each(function () {
            Depto = Depto + $(this).val() + ",";
        });
        Depto = Depto.substring(0, Depto.length - 1);
    }
    else {
        //Depto = "'''" + value + "'''";
        Depto = value;
        iptAcc = $('#ipt-' + Depto).val();
        trClass = $('#td_' + Depto).attr('class');
    }


    var html1 = "<div class='txtExport'>Exportar a: <!--div class='csv'></div-->" +
                    "<div class='pdf' onclick='ExportPdf(\"Cul\", 1, \"" + value + "\");'></div>" +                   
                    "<div class='xlsx' onclick='ExportExcel(\"Cul\", 1, \"" + value + "\");'></div>" +
                    "<div id='titulo' class='divTitulo'><br /><br />";



    if (Desde > Hasta) {
        displayModelMsg("La fecha inicial debe ser menor a la fecha final para realizar la consulta");
        $('#bigBox').hide();
    }
    else if (Desde == "" || Hasta == "" || Depto == "" || Cultivo == "") {
        displayModelMsg("Debe seleccionar un valor para cada variable");
        $('#bigBox').hide();
    }
    else {
        $('#bigBox').show();

        if (id != 0)
            dataType = "json";

        if (iptAcc == '1') {     
            fnExpandGroup(Depto);
            $('#ipt-' + Depto).val('2');
        }
        else if (iptAcc == '2') {
            fnCollapseGroup(Depto);
            $('#ipt-' + Depto).val('1');
        }
        else {
            $.ajax({
                type: "POST",
                async: true,
                //url: 'Reportes/ConsultarCultI',
                url: 'ConsultarCultI',
                data: { 'id': id, 'Desde': Desde, 'Hasta': Hasta, 'Depto': Depto, 'Cultivo': Cultivo },
                datatype: dataType,
                success: function (dat) {  
                    
                    var arr = dat.split("&&&");
                    var data = arr[1];
                    var html =html1+arr[0]+"<br /></div></div>";

                    if (id == 0) {
                        $('#result').html(data);
                        initDataTable(1);

                        $("div.toolbar_0").html(html);
                    }
                    else {
                        $('#ipt-' + Depto).val('2');
                        $("#td_" + Depto).removeClass("collapsed-group");
                        $("#td_" + Depto).addClass("expanded-group");

                        grId = "#group-id-" + Depto;
                        tableErr.fnDestroy();

                        $(data).insertAfter(grId);

                        initDataTable(2);

                        $("div.toolbar_0").html(html);
                    }
                },
                error: function () {
                    displayModelMsg("Se ha presentado un error en la consulta, intentelo más tarde, si persiste el error comuniquese con el administrador del sistema al correo: odc@minjusticia.gov.co", "Error");
                }
            });
        }
    }
}


function ConsultarInfSQ(id, value) {
    var Depto = "";
    var divTbl = "tblDatos";
    var Elemento = $('#Elemento').val();
    var Desde = $('#fechaDesde').val();
    var Hasta = $('#fechaHasta').val();
    var dataType = "html";
    var grId = "";

    var iptAcc = 0;
    var trClass = "";
    var total = Desde - Hasta;

    if (id == 0) {
        $("input[name='Depto[]']:checked").each(function () {
            Depto = Depto + $(this).val() + ",";
        });
        Depto = Depto.substring(0, Depto.length - 1);
    }
    else {
        //Depto = "'''" + value + "'''";
        Depto = value;
        iptAcc = $('#ipt-' + Depto).val();
        trClass = $('#td_' + Depto).attr('class');
    }

    var html1 = "<div class='txtExport'>Exportar a: <!--div class='csv'></div-->" +
                    "<div class='pdf' onclick='ExportPdf(\"ISq\", 1, \"" + value + "\");'></div>" +
                    "<!--div class='txt'></div-->" +
                    "<div class='xlsx' onclick='ExportExcel(\"ISq\", 1, \"" + value + "\");'></div>" +
                    "<div id='titulo' class='divTitulo'><br /><br />";

  
     if (Desde == "" || Hasta == "" || Depto == "" || Elemento == "") {
        displayModelMsg("Debe seleccionar un valor para cada variable");
        $('#bigBox').hide();
    }
    else if (Desde > Hasta) {
        displayModelMsg("La fecha inicial debe ser menor a la fecha final para realizar la consulta");
        $('#bigBox').hide();
    }
    else {
        $('#bigBox').show();

        if (id != 0)
            dataType = "json";

        if (iptAcc == '1') {
            fnExpandGroup(Depto);
            $('#ipt-' + Depto).val('2');
        }
        else if (iptAcc == '2') {        
            fnCollapseGroup(Depto);
            $('#ipt-' + Depto).val('1');
        }
        else {

            $.ajax({
                type: "POST",
                async: true,
                //url: 'Reportes/ConsultarInfSQ',
                url: 'ConsultarInfSQ',
                data: { 'id': id, 'Desde': Desde, 'Hasta': Hasta, 'Depto': Depto, 'Elemento': Elemento },
                datatype: dataType,
                success: function (dat) {

                    var respuesta = JSON.parse(dat);
                    var html = html1 + respuesta["Data"]["titulo"] + "<br /></div></div>";
                    var data = respuesta["Data"]["tabla"];

                    if (id == 0) {
                        $('#result').html(data);
                        initDataTable(1);

                        $("div.toolbar_0").html(html);
                    }
                    else {
                        $('#ipt-' + Depto).val('2');
                        $("#td_" + Depto).removeClass("collapsed-group");
                        $("#td_" + Depto).addClass("expanded-group");

                        grId = "#group-id-" + Depto;
                        tableErr.fnDestroy();

                        $(data).insertAfter(grId);

                        initDataTable(2);

                        $("div.toolbar_0").html(html);
                    }
                },
                error: function () {
                    displayModelMsg("Se ha presentado un error en la consulta, intentelo más tarde, si persiste el error comuniquese con el administrador del sistema al correo: odc@minjusticia.gov.co", "Error");
                }
            });
        }
    }
}


function ConsultarInfLabs(id, value) {
    var Depto = "";
    var divTbl = "tblDatos";
    var Elemento = $('#Elemento').val();
    var Desde = $('#fechaDesde').val();
    var Hasta = $('#fechaHasta').val();
    var dataType = "html";
    var grId = "";

    var iptAcc = 0;
    var trClass = "";
    var total = Desde - Hasta;

    if (id == 0) {
        $("input[name='Depto[]']:checked").each(function () {
            Depto = Depto + $(this).val() + ",";
        });
        Depto = Depto.substring(0, Depto.length - 1);
    }
    else {
        //Depto = "'''" + value + "'''";
        Depto = value;
        iptAcc = $('#ipt-' + Depto).val();
        trClass = $('#td_' + Depto).attr('class');
    }

    var html1 = "<div class='txtExport'>Exportar a: <!--div class='csv'></div-->" +
                    "<div class='pdf' onclick='ExportPdf(\"ILab\", 1, \"" + value + "\");'></div>" +
                    "<!--div class='txt'></div-->" +
                    "<div class='xlsx' onclick='ExportExcel(\"ILab\", 1, \"" + value + "\");'></div>" +
                    "<div id='titulo' class='divTitulo'><br /><br />";

   
    if (Desde == "" || Hasta == "" || Depto == "" || Elemento == "") {
        displayModelMsg("Debe seleccionar un valor para cada variable");
        $('#bigBox').hide();
    }
    else if (Desde > Hasta) {
        displayModelMsg("La fecha inicial debe ser menor a la fecha final para realizar la consulta");
        $('#bigBox').hide();
    }
    else {
        $('#bigBox').show();

        if (id != 0)
            dataType = "json";

        if (iptAcc == '1') {       
            fnExpandGroup(Depto);
            $('#ipt-' + Depto).val('2');
        }
        else if (iptAcc == '2') {      
            fnCollapseGroup(Depto);
            $('#ipt-' + Depto).val('1');
        }
        else {           
            $.ajax({
                type: "POST",
                async: true,
                //        url: 'Reportes/ConsultarInfLabs',
                url: 'ConsultarInfLabs',
                data: { 'id': id, 'Desde': Desde, 'Hasta': Hasta, 'Depto': Depto, 'Elemento': Elemento },
                datatype: "html",
                success: function (dat) {   
                    var respuesta = JSON.parse(dat);
                        
                    var html = html1 + respuesta["Data"]["titulo"] + "<br /></div></div>";
                    var data = respuesta["Data"]["tabla"];
                   
                    if (id == 0) {
                        $('#result').html(data);
                        initDataTable(1);
                        $("div.toolbar_0").html(html);
                    }
                    else {
                        $('#ipt-' + Depto).val('2');
                        $("#td_" + Depto).removeClass("collapsed-group");
                        $("#td_" + Depto).addClass("expanded-group");

                        grId = "#group-id-" + Depto;
                        tableErr.fnDestroy();

                        $(data).insertAfter(grId);

                        initDataTable(2);

                        $("div.toolbar_0").html(html);
                    }
                },
                error: function () {
                    displayModelMsg("Se ha presentado un error en la consulta, intentelo más tarde, si persiste el error comuniquese con el administrador del sistema al correo: odc@minjusticia.gov.co", "Error");
                }
            });
        }
    }
}


function ConsultarBalanceAntidrogas() {
    var Depto = "";
    //var nomDepto = "";
    var Desde = $('#fechaDesde').val();
    var Hasta = $('#fechaHasta').val();

    $("input[name='Depto[]']:checked").each(function () {
        Depto = Depto + $(this).val() + ",";
        //nomDepto = nomDepto + $("#"+Depto).val() + " -";
    });
    Depto = Depto.substring(0, Depto.length - 1);

    var html1 = "<div class='txtExport' style='margin-top: 20px;'>Exportar a:<div class='pdf' onclick='ExportPdfBal();'></div><div class='xlsx' onclick='ExportExcelBal();'>" +
        "</div><div id='divTitulo2' class='divTitulo2'><br /><br />" +
        "<p class='titulo'>";

    //nomDepto = nomDepto.substring(0, Depto.length - 1);
    if (Desde > Hasta) {
        displayModelMsg("La fecha inicial debe ser menor a la fecha final para realizar la consulta");
        $('#bigBox').hide();
    }
    else if (Desde == "" || Hasta == "") {
        displayModelMsg("Debe seleccionar un valor para cada variable");
        $('#bigBox').hide();
    }
    else {
        $('#bigBox').show();

        $.ajax({
            type: "POST",
            async: true,
            url: 'ConsultarBalanceAntidrogas',
            data: { 'Desde': $('#fechaDesde').val(), 'Hasta': $('#fechaHasta').val(), 'Depto': Depto },
            // data: { 'Desde': $('#fechaDesde').val(), 'Hasta': $('#fechaHasta').val(), 'Depto': Depto, 'nomDepto': nomDepto },
            datatype: "html",
            success: function (resp) {             
                var arr = resp.split("&&&");
                var data = arr[1];
                var html = html1 + arr[0] + "</p><br /><br /></div></div><br>";

                $('#result').html(html+data);
                for (var i = 1; i <= 6; i++) {
                    if (i == 1) {
                        $('#tblDatos_' + i).DataTable({
                            "dom": '<<"toolbar">>',
                            "language": {
                                "decimal": ",",
                                "thousands": "."
                            }
                        });
                    //    $("div.toolbar").html(html);
                    } else {
                        $('#tblDatos_' + i).DataTable({
                            "dom": '<>',
                            "language": {
                                "decimal": ",",
                                "thousands": "."
                            }
                        });
                    }
                }
            },
            error: function () {
                displayModelMsg("Se ha presentado un error en la consulta, intentelo más tarde, si persiste el error comuniquese con el administrador del sistema al correo: odc@minjusticia.gov.co", "Error");
            }
        });
    }
}

function ConsultarParques() {
    $('#bigBox').show();

    divTbl = "tblDatos";
    AnnioIni = $('#AnnioIni').val();
    AnnioFin = $('#AnnioFin').val();

   
   if (AnnioIni == "" || AnnioFin == "") {
        displayModelMsg("Debe seleccionar un año inicial y un año final");
        $('#bigBox').hide();
   }
   else if (AnnioIni > AnnioFin) {
       displayModelMsg("El año inicial debe ser menor o igual al año final para realizar la consulta");
       $('#bigBox').hide();
   }
    else {
        var html1 = "<div class='txtExport'>Exportar a: <!--div class='csv'></div-->" +
                       "<div class='pdf' onclick='ExportPdf(\"Par\", 1, " + AnnioIni + " - " + AnnioFin + ");'></div>" +
                       "<!--div class='txt'></div-->" +
                       "<div class='xlsx' onclick='ExportExcelEsp(\"Par\", " + AnnioIni + "," + AnnioFin + ");'></div>" +
                       "<div id='titulo' class='divTitulo'><br /><br /><p class='titulo'>PARQUES</p><br /><br /><p class='titulo3'> Hectáreas " +
                       AnnioIni + " - " + AnnioFin + "</p><br /></div></div>";

        $.ajax({
            type: "POST",
            async: true,
            //        url: 'Reportes/ConsultarInfLabs',
            url: 'ConsultarParques',
            data: { 'AnnioIni': $('#AnnioIni').val(), 'AnnioFin': $('#AnnioFin').val() },
            datatype: "html",
            success: function (data) {
                $('#result').html(data);

                $('#' + divTbl).DataTable({
                    "dom": '<f<"toolbar_1">t>',
                    paging: false,
                    //"pagingType": "full_numbers",
                    //"scrollX": "960px",
                    "language": {
                        "decimal": ",",
                        "thousands": "."
                    }
                });
                $("div.toolbar_1").html(html1);
            },
            error: function () {
                displayModelMsg("Se ha presentado un error en la consulta, intentelo más tarde, si persiste el error comuniquese con el administrador del sistema al correo: odc@minjusticia.gov.co", "Error");
                //$('#result').html("No Existen datos");
            }
        });
    }
}

function ConsultarResguardos() {
    $('#bigBox').show();

    divTbl = "tblDatos";
    AnnioIni = $('#AnnioIni').val();
    AnnioFin = $('#AnnioFin').val();
     if (AnnioIni == "" || AnnioFin == "") {
            displayModelMsg("Debe seleccionar un año inicial y un año final");
            $('#bigBox').hide();
     }
     else if (AnnioIni > AnnioFin) {
        displayModelMsg("El año inicial debe ser menor o igual al año final para realizar la consulta");
        $('#bigBox').hide();
    }    
    else {
        var html1 = "<div class='txtExport'><!--div class='csv'>Exportar a: </div-->" +
                       "<div class='pdf' onclick='ExportPdf(\"Res\", 1, " + AnnioIni + " - " + AnnioFin + ");'></div>" +
                       "<!--div class='txt'></div-->" +
                       "<div class='xlsx' onclick='ExportExcelEsp(\"Res\", " + AnnioIni + "," + AnnioFin + ");'></div>" +
                       "<div id='titulo' class='divTitulo'><br /><br /><p class='titulo'>RESGUARDOS INDÍGENAS</p><br /><br /><p class='titulo3'>" + AnnioIni + " - " + AnnioFin + "</p><br /></div></div>";

        $.ajax({
            type: "POST",
            async: true,
            //        url: 'Reportes/ConsultarInfLabs',
            url: 'ConsultarResguardos',
            data: { 'AnnioIni': $('#AnnioIni').val(), 'AnnioFin': $('#AnnioFin').val() },
            datatype: "html",
            success: function (data) {
                $('#result').html(data);

                $('#' + divTbl).DataTable({
                    "dom": '<f<"toolbar_1">t>',
                    paging: false,
                    "pagingType": "full_numbers",
                    //"scrollX": "960px",
                    "language": {
                        "decimal": ",",
                        "thousands": "."
                    }
                });
                $("div.toolbar_1").html(html1);
            },
            error: function () {
                displayModelMsg("Se ha presentado un error en la consulta, intentelo más tarde, si persiste el error comuniquese con el administrador del sistema al correo: odc@minjusticia.gov.co", "Error");
            }
        });
    }
}

function ConsultarConsejos() {
    $('#bigBox').show();

    divTbl = "tblDatos";
    AnnioIni = $('#AnnioIni').val();
    AnnioFin = $('#AnnioFin').val();

    if (AnnioIni > AnnioFin) {
        displayModelMsg("El año inicial debe ser menor o igual al año final para realizar la consulta");
        $('#bigBox').hide();
    }
    else if (AnnioIni == "" || AnnioFin == "") {
        displayModelMsg("Debe seleccionar un año inicial y un año final");
        $('#bigBox').hide();
    }
    else {
        var html1 = "<div class='txtExport'><!--div class='csv'>Exportar a: </div-->" +
                       "<div class='pdf' onclick='ExportPdf(\"Con\", 1, " + AnnioIni + " - " + AnnioFin + ");'></div>" +
                       "<!--div class='txt'></div-->" +
                       "<div class='xlsx' onclick='ExportExcelEsp(\"Con\", " + AnnioIni + "," + AnnioFin + ");'></div>" +
                       "<div id='titulo' class='divTitulo'><br /><br /><p class='titulo'>CONSEJOS COMUNITARIOS</p><br /><br /><p class='titulo3'>"
                       + AnnioIni + " - " + AnnioFin + "</p><br /></div></div>";

        $.ajax({
            type: "POST",
            async: true,
            //        url: 'Reportes/ConsultarInfLabs',
            url: 'ConsultarConsejos',
            data: { 'AnnioIni': $('#AnnioIni').val(), 'AnnioFin': $('#AnnioFin').val() },
            datatype: "html",
            success: function (data) {
                $('#result').html(data);

                $('#' + divTbl).DataTable({
                    "dom": '<f<"toolbar_1">t>',
                    paging: false,
                    //"pagingType": "full_numbers",
                    //"scrollX": "960px",
                    "language": {
                        "decimal": ",",
                        "thousands": "."
                    }
                });
                $("div.toolbar_1").html(html1);
            },
            error: function () {
                displayModelMsg("Se ha presentado un error en la consulta, intentelo más tarde, si persiste el error comuniquese con el administrador del sistema al correo: odc@minjusticia.gov.co", "Error");
            }
        });
    }
}


//function ExportExcel(id, idR, Desde, Hasta, Depto, Droga){
function ExportExcel(id, idR, value) {
    var Droga = "";
    var TipoErr = "";
    var Depto = "";
    var Depto2 = [];
    var nomDpt = [];

    if (id == 'Err') {
        TipoErr = $('#TipoErr').val();
        Droga = $('#Cultivo').val();
    } else if (id == 'ISq' || id == 'ILab') {
        Droga = $('#Elemento').val();
    }
    else if (id == 'Cul') {
        Droga = $('#Cultivo').val();
    }
    else {
        Droga = $('#Droga').val();
    }

    if (id == "Inc" || id == "Err") {
        //Depto = '"';
        $("input[name='Depto[]']:checked").each(function () {
            Depto = Depto + "'" + $(this).val() + "',";

        });
        Depto = Depto.substring(0, Depto.length - 1);
        //Depto = Depto + '"';
    } else {
        $("input[name='Depto[]']:checked").each(function () {
            Depto = Depto + $(this).val() + ",";
        });
        Depto = Depto.substring(0, Depto.length - 1);
    }



    $.ajax({
        type: "POST",
        async: true,
        url: 'ExportToExcel',
        //data: { 'id': id, 'idR': idR, 'Desde':Desde, 'Hasta': Hasta, 'Depto': Depto, 'Sust': Droga, 'TipoErr': TipoErr },
        data: { 'id': id, 'idR': idR, 'Desde': $('#fechaDesde').val(), 'Hasta': $('#fechaHasta').val(), 'Depto': Depto, 'nomDpt': nomDpt, 'Sust': Droga, 'TipoErr': TipoErr },
        dataType: 'html',
        success: function (returnValue) {
            window.open(returnValue, "_blank");
        },
        error: function () {
            displayModelMsg(returnValue, "Error");
        }
    });
   
}

function ExportExcelEsp(id, annioIni, annioFin) {
    $.ajax({
        type: "POST",
        async: true,
        url: 'ExportToExcelEsp',
        //data: { 'id': id, 'idR': idR, 'Desde':Desde, 'Hasta': Hasta, 'Depto': Depto, 'Sust': Droga, 'TipoErr': TipoErr },
        data: { 'id': id, 'annioIni': annioIni, 'annioFin': annioFin },
        dataType: 'html',
        success: function (returnValue) {
            window.open(returnValue, "_blank");
            //$('#result').html(data);
        },
        error: function () {  
            displayModelMsg(returnValue, "Error");
        }
    });
}

function ExportPdf(id, idR, value) {
    var Droga = "";
    var TipoErr = "";
    var Depto = "";
    var Desde = $('#fechaDesde').val();
    var Hasta = $('#fechaHasta').val();

    if (id == 'Err') {
        TipoErr = $('#TipoErr').val();
        Droga = $('#Cultivo').val();
    } else if (id == 'ISq' || id == 'ILab') {
        Droga = $('#Elemento').val();
    }
    else if (id == 'Cul') {
        Droga = $('#Cultivo').val();
    }
    else if (id == 'Par' || id == 'Con' || id == 'Res') {
        Droga = "";
        Desde = $('#AnnioIni').val();
        Hasta = $('#AnnioFin').val();
    }
    else {
        Droga = $('#Droga').val();
    }


    if (idR == 1) {
        if (id == "Inc" || id == "Err") {
            //Depto = '"';
            $("input[name='Depto[]']:checked").each(function () {
                Depto = Depto + "'" + $(this).val() + "',";

            });
            Depto = Depto.substring(0, Depto.length - 1);
            //Depto = Depto + '"';
        } else {
            $("input[name='Depto[]']:checked").each(function () {
                Depto = Depto + $(this).val() + ",";
            });
            Depto = Depto.substring(0, Depto.length - 1);
        }
        /* $("input[name='Depto[]']:checked").each(function () {
             Depto = Depto + "'" + $(this).val() + "',+";
         });
         Depto = Depto.substring(0, Depto.length - 2);*/
    }
    else if (id == 'Par' || id == 'Con' || id == 'Res')
        Depto = "";
    else
        Depto = value;

    $.ajax({
        type: "POST",
        async: true,
        url: 'ExportToPdf',
        data: { 'id': id, 'idR': idR, 'Desde': Desde, 'Hasta': Hasta, 'Depto': Depto, 'Sust': Droga, 'TipoErr': TipoErr },
        datatype: "json",
        success: function (data) {
            // exportToPDF(fileId);
            var nav = navigator.userAgent.toLowerCase();
            if (nav.indexOf("chrome") > -1) {
                var a = document.createElement('a');
                a.href = data;
                a.download = data.split('/')[2];
                a.click();
            }
            else {
                window.open(data, "_blank");
            }

        },

        error: function () {
            displayModelMsg(data, "Error");
        }
    });
}

function ExportExcelBal() {
    var Depto = "";
    var Desde = $('#fechaDesde').val();
    var Hasta = $('#fechaHasta').val();

    $("input[name='Depto[]']:checked").each(function () {
        Depto = Depto + $(this).val() + ",";
    });
    Depto = Depto.substring(0, Depto.length - 1);

    $.ajax({
        type: "POST",
        async: true,
        url: 'ExportToExcelBal',
        data: { 'Desde': Desde, 'Hasta': Hasta, 'Depto': Depto },
        datatype: "html",
        success: function (data) {

            window.open(data, "_blank");
        },
        error: function () {
            displayModelMsg("data", "Error");
        }
    });
}

function ExportPdfBal() {
    var Depto = "";
    var Desde = $('#fechaDesde').val();
    var Hasta = $('#fechaHasta').val();

    $("input[name='Depto[]']:checked").each(function () {
        Depto = Depto + $(this).val() + ",";
    });
    Depto = Depto.substring(0, Depto.length - 1);

    $.ajax({
        type: "POST",
        async: true,
        url: 'ExportToPdfBal',
        data: { 'Desde': Desde, 'Hasta': Hasta, 'Depto': Depto },
        datatype: "html",
        success: function (data) {
            //window.open(data, "_blank");
            var nav = navigator.userAgent.toLowerCase();
            if (nav.indexOf("chrome") > -1) {
                var a = document.createElement('a');
                a.href = data;
                a.download = data.split('/')[2];
                a.click();
            }
            else {
                window.open(data, "_blank");
            }

        },
        error: function () {
            displayModelMsg("Error " + data);
        }
    });
}

function displayModelMsg(message, title) {
    el = document.getElementById("overlay");
    el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
    document.getElementById("divMensaje").innerHTML = message;
    if (title != undefined) {
        document.getElementById("divTitle").innerHTML = title;
    }
}


/********* CONSUMO SITUACIÓN **********/
function cambiaElementos(Base, idLista) {
    var pob = "";
    var par2 = "";
    var Estudio = $("#Estudio").val();
    var Sust = "";

    if (idLista != "Clase") {
        var dd = document.getElementById(idLista);
        dd.options.length = 0;
        //dd.options[0] = new Option("Espere...");
        dd.selectedIndex = 0;
        dd.disabled = true;
    }

    //if (idLista == "Region") {
    var Est = Estudio.split("-");

    if (Est[0] == "Nacional")
        pob = "General";
    else if (Est[0] == "Escolares")
        pob = "Estudiantes";
    //}
    if (idLista != "Region" && idLista != "Sustancia") {
        Sust = $("#Sustancia").val();
    }
    if (idLista == "Clase") {
        par2 = $("#Indicador").val();
    }

    if ((Base == "Nacional-2008" || Base == "Escolares-2011" || Base == "Nacional-2013") && idLista == "Indicador") {
        //dd.options[0] = new Option("--");
        $("#" + idLista).multipleSelect();
        $("#" + idLista).multipleSelect('uncheckAll');
    }
    else {
        $.ajax({
            type: "POST",
            async: true,
            url: 'GenerarListas',
            data: { 'Base': Base, 'idLista': idLista, 'Poblacion': pob, 'Annio': Est[1], 'Sust': Sust, 'Par2': par2 },
            datatype: "json",
            success: function (data) {            
                if (idLista != "Clase") {
                    $.each(data, function (i, item) {
                        dd.options[i] = new Option(item.Text, item.Value);
                    });
                    dd.disabled = false;
                    if (idLista == "Region") {
                        $("#" + idLista).multipleSelect();
                        $("#" + idLista).multipleSelect('uncheckAll');
                    }
                    else if (idLista == "Indicador") {
                        $("#" + idLista).multipleSelect();
                        $("#" + idLista).multipleSelect('uncheckAll');
                    }
                }
                else if (idLista == "Clase") {
                    var str = "";
                    $.each(data, function (i, item) {
                        str = str + "," + item.Text;
                    });
                    str = str.substr(1);
                    $("#txtClase").val(str);
                }
                /*else {
                    dd.options[0] = new Option("--", "");
                    //$("#Clase").multipleSelect('uncheckAll');
                    dd.disabled = true;
                }*/
            },
            error: function () {
                displayModelMsg("Error " + data);
            }
        });
    }
}

function ConsultarConsSituacion() {
    var Estudio = $("#Estudio").val();
    var Est = Estudio.split("-");
    var divTbl = "tblDatos";

    if (Est[0] == "Nacional")
        pob = "General";
    else if (Est[0] == "Escolares")
        pob = "Estudiantes";

    var Region = $("#Region").multipleSelect("getSelects");
    var Sustancia = $("#Sustancia").val();
    var Indicador = $("#Indicador").multipleSelect("getSelects");
    var Desagregacion = $("#Desagregacion").val();
    var Clase = "";

    if (Desagregacion == "Total")
        Clase = "N/A";
    else {
        Clase = $("#txtClase").val();
    }


   if (Estudio == "--" || Region == "" || Sustancia == "--" || Indicador == "" || Desagregacion == "--") {
        displayModelMsg("Debe seleccionar un valor para cada variable");
        $('#bigBox').hide();
    }
    else if (Desagregacion != "Total" && Desagregacion != "--" && Desagregacion != "" && Clase == "") {
        displayModelMsg("Debe seleccionar un valor para cada variable");
        $('#bigBox').hide();
    }
    else if (Indicador.length > 3) {
        displayModelMsg("Se deben seleccionar máximo tres opciones para el Indicador");
    }
    else {
        $('#bigBox').show();
        console.log("Clase -- ");
        console.log(Clase);

        $.ajax({
            type: "POST",
            async: true,
            url: 'ConsultarConsSituacion',
            data: { 'Estudio': pob, 'Annio': Est[1], 'Region': Region.toString(), 'Sust': Sustancia, 'Ind': Indicador.toString(), 'Desag': Desagregacion, 'Clase': Clase },
            datatype: 'html',
            success: function (data) {
                     
                var arra=  data.split("&&&");
                var titulo = "<div class='txtExport'>Exportar a: " +
                   "<div class='pdf' onclick='ExportPdfConsSitu();'></div>" +
                   "<div class='xlsx' onclick='ExportExcelConsSitu();'></div>" +
                   "<div id='titulo' class='divTitulo'>" + arra[0] + "</div></div>";
                $('#result').html(arra[1]);
                //initDataTable(1);
                $('#' + divTbl).DataTable({
                    "dom": '<f<"toolbar_1">t>',
                    paging: false,
                    //"pagingType": "full_numbers",
                    //"scrollX": "960px",
                    "language": {
                        "decimal": ",",
                        "thousands": "."
                    }
                });
                $("div.toolbar_1").html(titulo);
            },
            error: function () {
                displayModelMsg("Se ha presentado un error en la consulta, intentelo más tarde, si persiste el error comuniquese con el administrador del sistema al correo: odc@minjusticia.gov.co", "Error");
            }
        });
    }
}

function ExportExcelConsSitu() {
    var Estudio = $("#Estudio").val();
    var Est = Estudio.split("-");
    var divTbl = "tblDatos";

    if (Est[0] == "Nacional")
        pob = "General";
    else if (Est[0] == "Escolares")
        pob = "Estudiantes";

    var Region = $("#Region").multipleSelect("getSelects");
    var Sustancia = $("#Sustancia").val();
    var Indicador = $("#Indicador").multipleSelect("getSelects");
    var Desagregacion = $("#Desagregacion").val();


    var Clase = "";

    if (Desagregacion == "Total")
        Clase = "N/A";
    else {
        Clase = $("#txtClase").val();
    }
    console.log(Clase);
    ///var Clase = $("#Clase").multipleSelect("getSelects");

    $.ajax({
        type: "POST",
        async: true,
        url: 'ExportToExcelConsSitu',
        data: { 'Estudio': pob, 'Annio': Est[1], 'Region': Region.toString(), 'Sust': Sustancia, 'Ind': Indicador.toString(), 'Desag': Desagregacion, 'Clase': Clase },
        dataType: 'html',
        success: function (returnValue) {
            window.open(returnValue, "_blank");
            //$('#result').html(data);
        },
        error: function () {       
            displayModelMsg(returnValue, "Error");
        }
    });
}


function ExportPdfConsSitu() {
    var Estudio = $("#Estudio").val();
    var Est = Estudio.split("-");
    var divTbl = "tblDatos";

    if (Est[0] == "Nacional")
        pob = "General";
    else if (Est[0] == "Escolares")
        pob = "Estudiantes";

    var Region = $("#Region").multipleSelect("getSelects");
    var Sustancia = $("#Sustancia").val();
    var Indicador = $("#Indicador").multipleSelect("getSelects");
    var Desagregacion = $("#Desagregacion").val();

    
    var Clase = "";

    if (Desagregacion == "Total")
        Clase = "N/A";
    else {
        Clase = $("#txtClase").val();
    }

    var cantCol = Clase.split(",").length * Indicador.length;
   
    console.log(Clase);
    $.ajax({
        type: "POST",
        async: true,
        url: 'ExportToPdfConsSitu',
        data: { 'Estudio': pob, 'Annio': Est[1], 'Region': Region.toString(), 'Sust': Sustancia, 'Ind': Indicador.toString(), 'Desag': Desagregacion, 'Clase': Clase.toString(), 'cantCol': cantCol },
        datatype: "json",
        success: function (data) {
            // exportToPDF(fileId);
            var nav = navigator.userAgent.toLowerCase();
            if (nav.indexOf("chrome") > -1) {
                var a = document.createElement('a');
                a.href = data;
                a.download = data.split('/')[2];
                a.click();
            }
            else {
                window.open(data, "_blank");
            }

        },

        error: function () {
            displayModelMsg(data, "Error");
        }
    });
}
/********* CONSUMO SITUACIÓN **********/


/********* CONSUMO CONSECUENCIA **********/

function ListarOpcConsec(idLista) {
    var Indicador = $("#Tipo").val(); 


    if (idLista == "Annio") {
        var dd = document.getElementById("Inicial");
        dd.options.length = 0;


        var dd1 = document.getElementById("Final");
        dd1.options.length = 0;

    }
    else {
        var dd = document.getElementById(idLista);
        dd.options.length = 0;

        dd.disabled = true;
    }



    $.ajax({
        type: "POST",
        async: true,
        url: 'ListarOpcConsec',

        data: { 'Indicador': Indicador, 'idLista': idLista },
        datatype: "json",
        success: function (data) {

            $.each(data, function (i, item) {
                dd.options[i] = new Option(item.Text, item.Value);
                if (idLista == "Annio")
                    dd1.options[i] = new Option(item.Text, item.Value);
            });
            dd.disabled = false;
            if (idLista == "Depto") {
                $("#" + idLista).multipleSelect();
                $("#" + idLista).multipleSelect('uncheckAll');
            }
        },
        error: function () {
            displayModelMsg("Error " + data);
        }
    });
}


function ConsultarConsConsec() {
    var Tipo = $("#Tipo").val();
    var Sust = $("#Sustancia").val();
    var Inicial = $("#Inicial").val();
    var Final = $("#Final").val();
    var divTbl = "tblDatos";

    var Depto = $("#Depto").multipleSelect("getSelects");


  if (Tipo == "--" || Sustancia == "" || Inicial == "" || Final == "--" || Depto == "") {
         displayModelMsg("Debe seleccionar un valor para cada variable");
         $('#bigBox').hide();
     }
     else if (Inicial > Final) {
         displayModelMsg("El año inicial debe ser menor al año final");
         $('#bigBox').hide();
     }
     else {
         $('#bigBox').show();

      
         $.ajax({
             type: "POST",
             async: true,
             url: 'ConsultarConsConsecuencia',
             data: { 'Tipo': Tipo, 'Depto': Depto.toString(), 'Sustancia': Sust, 'Inicial': Inicial, 'Final': Final },
             datatype: 'html',
             success: function (data) {

                 var arr = data.split("&&&");
                var titulo = "<div class='txtExport'>Exportar a: " +
                   "<div class='pdf' onclick='ExportPdfConsConsec();'></div>" +
                   "<div class='xlsx' onclick='ExportExcelConsConsec();'></div>" +
                   "<div id='titulo' class='divTitulo'><br /><br />" + arr[0] + "<br /><br /></div></div>";
                $('#result').html(arr[1]);        

                 $('#' + divTbl).DataTable({
                     "dom": '<f<"toolbar_1">t>',
                     paging: false,
                     "language": {
                         "decimal": ",",
                         "thousands": "."
                     }
                 });
                 $("div.toolbar_1").html(titulo);

              
             },
             error: function () {
                 displayModelMsg("Se ha presentado un error en la consulta, intentelo más tarde, si persiste el error comuniquese con el administrador del sistema al correo: odc@minjusticia.gov.co", "Error");
             }
         });
     }
}

function ExportExcelConsConsec() {
    var Tipo = $("#Tipo").val();
    var Sust = $("#Sustancia").val();
    var Inicial = $("#Inicial").val();
    var Final = $("#Final").val();
    var Depto = $("#Depto").multipleSelect("getSelects");

    $.ajax({
        type: "POST",
        async: true,
        url: 'ExportToExcelConsConsec',
        data: { 'Tipo': Tipo, 'Depto': Depto.toString(), 'Sustancia': Sust, 'Inicial': Inicial, 'Final': Final },
        dataType: 'html',
        success: function (returnValue) {

            window.open(returnValue, "_blank");
            //$('#result').html(data);
        },
        error: function () {

            displayModelMsg(returnValue, "Error");
        }
    });
}

function ExportPdfConsConsec() {
    var Tipo = $("#Tipo").val();
    var Sust = $("#Sustancia").val();
    var Inicial = $("#Inicial").val();
    var Final = $("#Final").val();
    var Depto = $("#Depto").multipleSelect("getSelects");

    $.ajax({
        type: "POST",
        async: true,
        url: 'ExportPdfConsConsec',
        data: { 'Tipo': Tipo, 'Depto': Depto.toString(), 'Sustancia': Sust, 'Inicial': Inicial, 'Final': Final },
        dataType: 'html',
        success: function (data) {

            var nav = navigator.userAgent.toLowerCase();
            if (nav.indexOf("chrome") > -1) {

                var a = document.createElement('a');
                a.href = data;
                a.download = data.split('/')[2];
                a.click();
            }
            else {
                window.open(data, "_blank");
            }

        },
        error: function () {
            displayModelMsg(data, "Error");
        }
    });
}
/********* CONSUMO CONSECUENCIA **********/


/*************UACT - FAMILIAS GUARDABOSQUES***************/
function ListarOpcFamG() {
    var Per = $("#Periodicidad").val();

    var dd = document.getElementById("Desde");
    dd.options.length = 0;
    dd.options[0] = new Option("Espere...");
    dd.selectedIndex = 0;
    dd.disabled = true;

    var dd1 = document.getElementById("Hasta");
    dd1.options.length = 0;
    dd1.options[0] = new Option("Espere...");
    dd1.selectedIndex = 0;
    dd1.disabled = true;

    $.ajax({
        type: "POST",
        async: true,
        url: 'ListarOpcFamG',
        data: { 'Periodicidad': Per },
        datatype: "json",
        success: function (data) {

            $.each(data, function (i, item) {
                dd.options[i] = new Option(item.Text, item.Value);
                dd1.options[i] = new Option(item.Text, item.Value);
            });
            dd.disabled = false;
            dd1.disabled = false;
        },
        error: function () {
            displayModelMsg("Error " + data);
        }
    });
}

function ConsultarFamG(desagregacion, depto) {
    var Period = $("#Periodicidad").val();
    var Desde = $("#Desde").val();
    var Hasta = $("#Hasta").val();
    var Indic = $("#Indicador").val();
    var divTbl = "tblDatos";
    var iptAcc = '0';

    var subt = "";

    if ((typeof desagregacion == "undefined") && (typeof depto == "undefined")) {
        desagregacion = 0;
        depto = $("#Depto").multipleSelect("getSelects").toString();
    }
    else
        iptAcc = $('#ipt-' + depto).val();

    if (Indic == "Familias")
        subt = "Familias Atendidas";
    else
        subt = "Inversión";

    var html1 = "<div class='txtExport'>Exportar a: " +
                   "<div class='pdf' onclick='ExportFamG(\"P\");'></div>" +
                   "<div class='xlsx' onclick='ExportFamG(\"E\");'></div>" +
                   "<div id='titulo' class='divTitulo'><br /><br />";

    if (Period == "--" || Desde == "" || Hasta == "" || Indic == "--" || depto == "") {
        displayModelMsg("Debe seleccionar un valor para cada opción");
        $('#bigBox').hide();
    }
    else if (Desde > Hasta) {
        displayModelMsg("El valor del campo Desde debe ser menor al valor del campo Hasta");
        $('#bigBox').hide();
    }
    else {
        
        if (iptAcc == '1') {
            fnExpandGroup(depto);
            $('#ipt-' + depto).val('2');
        }
        else if (iptAcc == '2') {
            fnCollapseGroup(depto);
            $('#ipt-' + depto).val('1');
        }else{

            $('#bigBox').show();
            $.ajax({
                type: "POST",
                async: true,
                url: 'ConsultarFamG',
                data: { 'Period': Period, 'Desde': Desde, 'Hasta': Hasta, 'Depto': depto, 'Indic': Indic, 'Desagregacion': desagregacion },
                datatype: 'html',
                success: function (dat) {

                    var arr = dat.split("&&&");
                    var html =html1+ arr[0] + "<br /><br /></div></div>";
                    var data = arr[1];

                    if (desagregacion == 0) {
                        $('#result').html(data);
                        initDataTable(1);
                        $("div.toolbar_0").html(html);
                    }
                    else {
                        $('#ipt-' + depto).val('2');
                        $("#td_" + depto).removeClass("collapsed-group");
                        $("#td_" + depto).addClass("expanded-group");
                        grId = "#group-id-" + depto;
                        tableErr.fnDestroy();
                        $(data).insertAfter(grId);
                        initDataTable(2);
                        $("div.toolbar_0").html(html);
                    }
                },
                error: function () {
                    displayModelMsg("Se ha presentado un error en la consulta, intentelo más tarde, si persiste el error comuniquese con el administrador del sistema al correo: odc@minjusticia.gov.co", "Error");
                }
            });
        }

    }
}


function ExportFamG(tipoRep) {
    var Period = $("#Periodicidad").val();
    var Desde = $("#Desde").val();
    var Hasta = $("#Hasta").val();
    var Indic = $("#Indicador").val();
    var divTbl = "tblDatos";
    var Depto = $("#Depto").multipleSelect("getSelects");

    var nomMetodo = "";
    var dataType = "";

    if (Indic == "Familias")
        subt = "Familias Atendidas";
    else
        subt = "Inversión";

    if (tipoRep == "P") {
        nomMetodo = "ExportPdfFamG";
        dataType = "json";
    }
    else {
        nomMetodo = "ExportXlsFamG";
        dataType = "html";
    }

    $.ajax({
        type: "POST",
        async: true,
        url: nomMetodo,
        data: { 'Period': Period, 'Desde': Desde, 'Hasta': Hasta, 'Depto': Depto.toString(), 'Indic': Indic, 'txtIndic': subt },
        dataType: "html",
        success: function (data) {
            if (tipoRep == "P") {
                var nav = navigator.userAgent.toLowerCase();
                if (nav.indexOf("chrome") > -1) {

                    var a = document.createElement('a');
                    a.href = data;
                    a.download = data.split('/')[2];
                    a.click();
                }
                else {
                    window.open(data, "_blank");
                }
            }
            else
                window.open(data, "_blank");
        },
        error: function (data) {

            displayModelMsg(data, "Error");
        }
    });
}

/*************UACT - FAMILIAS GUARDABOSQUES***************/



/*************UACT - Implementaciones Territoriales***************/
function ListarOpcImplTrr() {
    var Programa = $("#Programa").val();

    var dd = document.getElementById("Desde");
    dd.options.length = 0;
    dd.options[0] = new Option("Espere...");
    dd.selectedIndex = 0;
    dd.disabled = true;

    var dd1 = document.getElementById("Hasta");
    dd1.options.length = 0;
    dd1.options[0] = new Option("Espere...");
    dd1.selectedIndex = 0;
    dd1.disabled = true;

    /*if (Programa == "Respuesta Rápida") {
        var dd1 = document.getElementById("Indicador");
        dd1.options.length = 0;
        dd1.options[0] = new Option("N/A");
        dd1.selectedIndex = 0;
        dd1.disabled = true;
    }
    else {*/
    $.ajax({
        type: "POST",
        async: true,
        url: 'ListarImplTrr',
        data: { 'Programa': Programa },
        datatype: "json",
        success: function (data) {
            $.each(data, function (i, item) {
                dd.options[i] = new Option(item.Text, item.Value);
                dd1.options[i] = new Option(item.Text, item.Value);
            });
            dd.disabled = false;
            dd1.disabled = false;
        },
        error: function () {
            displayModelMsg("Error " + data);
        }
    });
    //}
}

function ConsultarImplTrr(desagregacion, depto) {


    var Programa = $("#Programa").val();
    var Desde = $("#Desde").val();
    var Hasta = $("#Hasta").val();
    var Indic = $("#Indicador").val();
    var divTbl = "tblDatos";  
    var subt = "";
    var htmlIndic = "";
    var iptAcc = 0;
    
      

    if ((typeof desagregacion == "undefined") && (typeof depto == "undefined")){
        desagregacion = 0;
        depto = $("#Depto").multipleSelect("getSelects").toString();        
    }
    else   
        iptAcc = $('#ipt-' + depto).val();   
    


   /* if (Programa != "Respuesta Rápida")
        htmlIndic = "<p class='titulo4'>Indicador: " + $("#Indicador option:selected").text() + "</p>";
    else
        htmlIndic = "<p class='titulo4'>Indicador: Indicador de Cobertura – Valor Inversión en $</p>";*/

    var html1 = "<div class='txtExport'>Exportar a: " +
                   "<div class='pdf' onclick='ExportImplTrr(\"P\");'></div>" +
                   "<div class='xlsx' onclick='ExportImplTrr(\"E\");'></div>" +
                   "<div id='titulo' class='divTitulo'><br /><br />";

    if (Programa != "Respuesta Rápida" && Programa != "--" && (Indic == "" || Indic == "--")) {
        displayModelMsg("Debe seleccionar un valor para cada opción");
        $('#bigBox').hide();
    }
    else if (Programa == "--" || Desde == "" || Hasta == "" || Depto == "") {
        displayModelMsg("Debe seleccionar un valor para cada opción");
        $('#bigBox').hide();
    }
    else if (Desde > Hasta) {
        displayModelMsg("El valor del campo Desde debe ser menor al valor del campo Hasta");
        $('#bigBox').hide();
    }
   
    else {


         if (iptAcc == '1') {

            fnExpandGroup(depto);
            $('#ipt-' + depto).val('2');

        }
        else if (iptAcc == '2') {

            fnCollapseGroup(depto);
            $('#ipt-' + depto).val('1');

        }else{

                $('#bigBox').show();

                $.ajax({
                    type: "POST",
                    async: true,
                    url: 'ConsultarImplTrr',
                    data: { 'Programa': Programa, 'Desde': Desde, 'Hasta': Hasta, 'Depto': depto, 'Indic': Indic, 'Desagregacion': desagregacion },
                    datatype: 'html',
                    success: function (dat) {

                        var arr = dat.split("&&&");
                        var html = html1 + arr[0] + "<br /><br /></div></div>";
                        var data = arr[1];

                        if (desagregacion == 0) {

                            $('#result').html(data);
                            initDataTable(1);
                            $("div.toolbar_0").html(html);

                        }
                        else {

                            $('#ipt-' + depto).val('2');
                            $("#td_" + depto).removeClass("collapsed-group");
                            $("#td_" + depto).addClass("expanded-group");

                            grId = "#group-id-" + depto;
                            tableErr.fnDestroy();

                            $(data).insertAfter(grId);

                            initDataTable(2);

                            $("div.toolbar_0").html(html);

                        }
                    },
                    error: function () {
                        displayModelMsg("Se ha presentado un error en la consulta, intentelo más tarde, si persiste el error comuniquese con el administrador del sistema al correo: odc@minjusticia.gov.co", "Error");
                    }
                

                });

        }
    }
}


function ExportImplTrr(tipoRep) {
    var Programa = $("#Programa").val();
    var Desde = $("#Desde").val();
    var Hasta = $("#Hasta").val();
    var Indic = $("#Indicador").val();
    var divTbl = "tblDatos";
    var Depto = $("#Depto").multipleSelect("getSelects");

    var nomMetodo = "";
    var dataType = "";

    if (tipoRep == "P") {
        nomMetodo = "ExportPdfImplTrr";
    }
    else {
        nomMetodo = "ExportXlsImplTrr";
    }

    console.log(nomMetodo);

    $.ajax({
        type: "POST",
        async: true,
        url: nomMetodo,
        data: { 'Programa': Programa, 'Desde': Desde, 'Hasta': Hasta, 'Depto': Depto.toString(), 'Indic': Indic },
        dataType: "html",
        success: function (data) {
            if (tipoRep == "P") {
                var a = document.createElement('a');
                a.href = data;
                a.download = data.split('/')[2];
                a.click();
            }
            else
                window.open(data, "_blank");
        },
        error: function (data) {

            displayModelMsg(data, "Error");
        }
    });
}
/*************UACT - Implementaciones Territoriales***************/


/*****************************INPEC***********************************/
function ListarOpcInpec() {
    var Indicador = $("#Indicador").val();

    var dd = document.getElementById("Tema");
    dd.options.length = 0;
    dd.options[0] = new Option("Espere...");
    dd.selectedIndex = 0;
    dd.disabled = true;

    $.ajax({
        type: "POST",
        async: true,
        url: 'ListarOpcInpec',
        data: { 'Indicador': Indicador },
        datatype: "json",
        success: function (data) {

            $.each(data, function (i, item) {
                dd.options[i] = new Option(item.Text, item.Value);
            });
            dd.disabled = false;
            $("#Tema").multipleSelect({
                placeholder: "Seleccione"
            });
            $("#Tema").multipleSelect('uncheckAll');
        },
        error: function () {
            displayModelMsg("Error " + data);
        }
    });
}

function ConsultarInpec() {
    var Indicador = $("#Indicador").val();
    var Tema = $("#Tema").multipleSelect("getSelects");

    if (($("#Tema option:not(:selected)").length - Tema.length) < 1 )
        Tema = "Todos";

    var TemaSeleccion = $('#Tema').val();

    var txtInd = $("#Indicador option:selected").text();

    var html1 = "<div class='txtExport'>Exportar a: " +
                   "<div class='pdf' onclick='ExportInpec(\"P\");'></div>" +
                   "<div class='xlsx' onclick='ExportInpec(\"E\");'></div>" +
                   "<div id='titulo' class='divTitulo'><br /><br />";


    if (Indicador == "--" && Tema == "Todos") {
        displayModelMsg("Debe seleccionar un valor para cada opción");
        $('#bigBox').hide();
    }
    else if (Tema == "") {
        displayModelMsg("Debe seleccionar un valor para cada opción");
        $('#bigBox').hide();
    }
    else {
        $('#bigBox').show();

        $.ajax({
            type: "POST",
            async: true,
            url: 'ConsultarInpec',
            data: { 'Indicador': Indicador, 'Tema': Tema.toString() },
            datatype: 'html',
            success: function (dat) {
                var arr = dat.split("&&&");
                var html = html1 + arr[0] + "<br /><p class='titulo4'>" + txtInd + "</p><br /><br /></div></div>";
                var data = arr[1];

                $('#result').html(data);
                $('#tblDatos').DataTable({
                    "dom": '<f<"toolbar_1">t>',
                    paging: false,
                    "language": {
                        "decimal": ",",
                        "thousands": "."
                    }
                });
                $("div.toolbar_1").html(html);
            },
            error: function () {
                displayModelMsg("Se ha presentado un error en la consulta, intentelo más tarde, si persiste el error comuniquese con el administrador del sistema al correo: odc@minjusticia.gov.co", "Error");
            }
        });
    }
}


function ExportInpec(tipoRep) {
    var Indicador = $("#Indicador").val();
    var Tema = $("#Tema").multipleSelect("getSelects");

    var txtInd = $("#Indicador option:selected").text();

    var nomMetodo = "";
    var dataType = "";

    if (tipoRep == "P") {
        nomMetodo = "ExportPdfInpec";
    }
    else {
        nomMetodo = "ExportXlsInpec";
    }

    $.ajax({
        type: "POST",
        async: true,
        url: nomMetodo,
        data: { 'Indicador': Indicador, 'Tema': Tema.toString(), 'txtInd': txtInd },
        dataType: "html",
        success: function (data) {
            if (tipoRep == "P") {
                var a = document.createElement('a');
                a.href = data;
                a.download = data.split('/')[2];
                a.click();
            }
            else
                window.open(data, "_blank");
        },
        error: function (data) {
            displayModelMsg(data, "Error");
        }
    });
}

/*****************************INPEC***********************************/