$(document).ready(function(){
	var amountUsersWithoutAP = 0;
	var apSum = 0;
	var KEYCODE_ESC = 27;
	$.getJSON("http://94.247.168.234/bls/index.php?controller=user&action=all&format=json&callback=?", function(data){
		users = data || [{id:1,ap:1000,username:"Test (no users retrieved from system)"}];
		$.each(users, function(i, user){
			var htmlClass = 'user';
			if (user.ap == 0){
				htmlClass += ' zero_ap';
				amountUsersWithoutAP++;
			}
			
			var row = document.createElement("tr");
			row.className = htmlClass;
			row.id = 'user_' + user.id;
			
			var usernameColumn = document.createElement("td");
			usernameColumn.innerHTML = '<a href="http://www.wintergate.se/index.php?controller=user&action=show&id=' + user.id + '">' + user.username + '</a>';
			usernameColumn.className = 'username';
			
			var apColumn = document.createElement("td");
			//apColumn.innerHTML = thousandSeparator(user.ap, " ");	// Not used since it prevents sorting by integer order.
			apColumn.innerHTML = parseInt(user.ap);
			apColumn.className = 'ap';
			
			row.appendChild(usernameColumn);
			row.appendChild(apColumn);
			$("#users tbody").append(row);
			
			apSum += user.ap;

		}); // end $.each()
		
		var tfoot = document.createElement("tfoot");
		var row = document.createElement("tr");
		var userTotalColumn = document.createElement("th");
		userTotalColumn.innerHTML = users.length + ' användare (' + amountUsersWithoutAP + ' utan AP)';
		var apTotalColumn = document.createElement("th");
		apTotalColumn.innerHTML = thousandSeparator(apSum, ' ') + ' AP';
		
		row.appendChild(userTotalColumn);
		row.appendChild(apTotalColumn);
		tfoot.appendChild(row);
		$("#users").append(tfoot);
		
		$("#users").dataTable({
			"aaSorting": [[ 1, "desc" ], [ 0, "asc" ]],
			"aoColumns": [ 
						{ "sType": "html" },
						{ "sType": "numeric"}
			],
			"bPaginate": false,
			"bLengthChange": false,
			"bFilter": true,
			"bInfo": false,
			"bAutoWidth": false,
			"oLanguage": {
				"sSearch": "Sök:"
			}
		});
		
		clearSearchBox();
	}); // end $.getJSON()
	
	$(document).keyup(function(e){
		if(e.keyCode == KEYCODE_ESC){
			clearSearchBox();
		}
	});
}); // end $(document).ready()

function clearSearchBox(){
	$("#users_filter input").val("");
	$("#users_filter input").focus();
	$("#users_filter input").submit();
}

/*
* thousandSeparator (NUMBER n, STRING separator) STRING
* or
* thousandSeparator (String n, STRING sep) STRING
*
* Convert a number to the format xxx,xxx,xxx.xxxx
* Accepts integers, floating point or string
*
* Does not accept exponential notation, etc.
*
* n – the number to be formatted
* sep – the separator character. if skipped, “,” is used
*/
function thousandSeparator(n,sep) {
	var sRegExp = new RegExp('(-?[0-9]+)([0-9]{3})'), sValue=n+"";
	if (sep === undefined) {
	sep=',';
	}
	while(sRegExp.test(sValue)) {
	sValue = sValue.replace(sRegExp, '$1'+sep+'$2');
	}
	return sValue;
}