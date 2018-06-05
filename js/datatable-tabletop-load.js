// URL beginning and end, which will be used with the key
// To give Tabletop a URL
var google_docs_one = 'https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=';
var google_docs_two = '&output=html';
// https://docs.google.com/spreadsheet/pub?hl=en_US&hl=en_US&key=
var link = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQZEzAfmfmdmsuolTLt4bjR9eEaCLTc6NUEYk3HVGBCJAu4SggCES5MkPoQ3LvIyodmFGdFJ39HYip8/pubhtml';
// Google Docs spreadsheet key
//var spreadsheet_key = '1hHJJmRBA1D6-g9wtfvnjvsndP-NxgyzOmFJBC8L2PPQ';
// san diego var spreadsheet_key = '1OBzkmI1PZIu2jwLhSWbyGFKCVh65Y7e4mi7f_qQo3Ig'
var spreadsheet_key = '1FF0VlPy77z5LMZrOa6ohh7Xw0itB75pOiuTHaHrau5U'
// Template sources and what DIVs they will appear in
var templates = [
    {
        "templatesource": "#datatable-template",
        "templatehtml": "#searchable-table tbody",
        "sheet": "Sheet1"
    }
];

// DataTables formatting options
// More options: http://datatables.net/plug-ins/sorting

// Formatted numbers: i.e. numbers with commas
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "formatted-num-pre": function ( a ) {
        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
        return parseFloat( a );
    },
    "formatted-num-asc": function ( a, b ) {
        return a - b;
    },
    "formatted-num-desc": function ( a, b ) {
        return b - a;
    }
});
// Currency
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "currency-pre": function ( a ) {
        a = (a==="-") ? 0 : a.replace( /[^\d\-\.]/g, "" );
        return parseFloat( a );
    },

    "currency-asc": function ( a, b ) {
        return a - b;
    },

    "currency-desc": function ( a, b ) {
        return b - a;
    }
});
// Percentages
jQuery.extend( jQuery.fn.dataTableExt.oSort, {
    "percent-pre": function ( a ) {
        var x = (a == "-") ? 0 : a.replace( /%/, "" );
        return parseFloat( x );
    },

    "percent-asc": function ( a, b ) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "percent-desc": function ( a, b ) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});

// Load up the DataTable
function loadDataTable() {
    // Load Datatables after Tabletop is loaded
    $('#searchable-table').dataTable({
        "bAutoWidth": false,
        "oLanguage": {
            "sLengthMenu": "_MENU_ records per page"
        },
        "iDisplayLength": 25,
        "aaSorting": [[ 0, "asc" ]],
        "aoColumns": [
           {
                "sWidth": "10%"
                // "sType": "formatted-num"
            },{
                "sWidth": "22.5%"
                // "sType": "formatted-num"
            },{
                "sWidth": "22.5%"
                // "sType": "formatted-num"
            },{
                "sWidth": "22.5%"
                  // "sType": "formatted-num"
            },{
                "sWidth": "22.5%"
            }
        ],
        // Fix thead to top of page when scrolling past it
        "initComplete": function(settings, json) {
            $('#searchable-table').show();
        }
    });
// Close loadDataTable
};

// Use Handlebars to load data from Tabletop to page
function loadToDOM(tabletop_data, tabletop) {
    // Loop through templates
    _.each(templates, function(element, num_templates) {
    	// Grab HTML of template and compile with Handlebars
    	var template_html = element['templatehtml'];
    	var source = $(element["templatesource"] + "").html();
    	var sheet = element["sheet"];
        var handlebarscompile = Handlebars.compile(source);

		// Render the templates onto page
    var info = handlebarscompile( tabletop.sheets(sheet) );
    // add bullet points and line breaks
    info_replaced = info.replace(/,/g, '<br>• ');
    info_replaced = info_replaced.replace(/:">/g, ':\">• ');
    info_replaced = info_replaced.replace(/\//g, '\/<br>');
    // remove <br> from html code, remove bullet points from ID col
    info_replaced = info_replaced.replace(/<\/<br>/g, '</');
    info_replaced = info_replaced.replace(/ID:">• /g,'ID:">')
		$(template_html).append( info_replaced );
	// Close each statement
    }, this);

    loadDataTable();
}


// Pull data from Google spreadsheet via Tabletop
function initializeTabletopObject(){
	Tabletop.init({
    	key: google_docs_one + spreadsheet_key + google_docs_two,
      //key: link,
      callback: loadToDOM,
    	simpleSheet: false,
    	debug: false
    });
}

// Load Tabletop
initializeTabletopObject();


//google pie chart
