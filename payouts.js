function fetchData() {
    return fetch("https://heretheurlforgraphqlhuntruses", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-api-key": "api-key"
        },
        body: JSON.stringify({
           query: /* GraphQL */ `
           query ListCwEs($limit: Int) {\n          query: listCWEs(limit: $limit) {\n            items {\n              id\n              title\n              description\n              pricing_multiplier\n              number\n            }\n          }\n        }`,variables: {
                "limit":"1000"
            }
        }),
         
    })
    .then(response => response.json()).then(data => buildTable(data.data.query.items))
};
test = fetchData();



function sortFunction(a, b) {
 return a['number'] - b['number'];
}
function buildTable(data){
  data.sort(sortFunction);
  for (i = 0; i < data.length; i++){
      item = data[i];
      tr = document.createElement('tr');
      tr.innerHTML="<td>"+item.number+"</td><td>"+item.title+"</td><td>"+item.description+"</td><td>" + item.pricing_multiplier + "</tr>";
      rows = document.getElementById('rows');
      rows.appendChild(tr);
  }
}
