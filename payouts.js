// API key 
var apiKey=""
// GraphQL database
var graphQL=""

if (apiKey == '' || graphQL==''){
  throw new Error("Please provide API key and GraphQL url first");
}

function fractionToDollars(t){
  switch (t) {
    case 0:
        return "";
    case .1:
        return "$";
    case .3:
        return "$$";
    case .5:
        return "$$$";
    case .8:
        return "$$$$";
    case 1:
        return "$$$$$";
    default:
        return ""
    }
}

function fetchData() {
    return fetch(graphQL, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "x-api-key": apiKey
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
fetchData();

function fetchReward(repo){
  const [ owner, name] = repo.split('/');
  fetch(graphQL, {
    method: "POST",
    headers: {
        "x-api-key": apiKey
    },
    body: JSON.stringify({
        query: /* GraphQL */ `
        query GetBountyMetrics($owner: String!, $name: String!) {
            getBountyMetrics(owner: $owner, name: $name) {
            bounty_reward
            popularity_score
            merge_chance
            }
        }`,
        variables: {
            owner,
            name
        }
    }),
})
.then(response => response.json())
.then(({ data }) => buildTable(cwe, data.getBountyMetrics.bounty_reward));
}

function sortFunction(a, b) {
 return a['number'] - b['number'];
}

var cwe = '';
function buildTable(data, reward = 0){
  cwe = data  
  data.sort(sortFunction);
  rows = document.getElementById('rows');
  rows.innerHTML='';
  for (i = 0; i < data.length; i++){
      item = data[i];
      tr = document.createElement('tr');
      tr.innerHTML="<td>"+item.number+"</td><td>"+item.title+"</td><td>"+item.description+"</td><td>" + item.pricing_multiplier +"</td><td>" + fractionToDollars(item.pricing_multiplier)+"</td><td>"+reward * item.pricing_multiplier +"</td><td>"+ reward * item.pricing_multiplier * 0.25+"</td>";
      rows.appendChild(tr);
  }
}

var readyStateCheckInterval = setInterval(function() {
  if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);
      document.getElementById('query').addEventListener('submit', submitForm);
  }
}, 10);

function submitForm(e){
  e.preventDefault();
  fetchReward(document.getElementById('repo').value)
  return false;
}