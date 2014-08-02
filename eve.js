function sort(a, b) {
    if (a.count > b.count)
        return 1;
    if (a.count < b.count)
        return -1;
    return 0;
};
function build_stats(stats, key) {
    var RESET = 0, row_ctr = 0;
    if (key == 'name' || key == 'zone')
        var row_len = (key == 'name') ? 3 : 2;
        var id = (key == 'name') ? "systems" : "timezones";
    
    var table = document.getElementById(id)
    for (i = 0; i < stats.length; i++) {
        if (row_ctr == RESET) {
            var row = document.createElement('tr');
            table.appendChild(row)
        }
        var data = document.createElement('td');
        data.innerHTML = stats[i][key] + " : " + stats[i]['count'];
        row.appendChild(data);
        row_ctr = (row_ctr < row_len) ? row_ctr+1 : RESET;
    }
};
    
function xhrSlot() {
    if (xhr.readyState < 4) {
        return;
    }
    if (xhr.status !== 200) {
        alert('Error!'); 
        return;
    }
    var systems = {}, zones = {};
    response = JSON.parse(xhr.responseText)
    for (var i = 0; i < response['kills'].length; i++) {
        if (!systems.hasOwnProperty(response['kills'][i].system_name))
            systems[response['kills'][i].system_name] = 1;
        else
            systems[response['kills'][i].system_name]++;
        
        time = response['kills'][i].kill_time.slice(11);
        if (time >= "08:00" && time < "16:00")
            zone = "AU";
        else if (time >= "00:00" && time < "08:00")
            zone = "US";
        else if (time >= "16:00" && time <= "23:59")
            zone = "EU";
        if (!zones.hasOwnProperty(zone))
            zones[zone] = 1;
        else
            zones[zone]++;
    }
    var systems_stats = [], zone_stats = [], i = 0;
    for (x in systems) {
        systems_stats[i] = { name: x, count: systems[x] };
        i++;
    }
    i = 0;
    for (x in zones) {
        zone_stats[i] = { zone: x, count: zones[x] };
        i++;
    }
    
    remove_html = document.getElementById("timezones");
    remove_html.removeChild(remove_html.firstChild);    
    remove_html = document.getElementById("systems");
    for (var i = 0, len = remove_html.childNodes.length; i < len; i++)
        remove_html.removeChild(remove_html.firstChild);
    
    systems_stats.sort(sort).reverse();
    zone_stats.sort(sort).reverse();
    build_stats(zone_stats, 'zone');
    build_stats(systems_stats, 'name'); 
}

function event_slot() {
    var button = document.getElementById("button");
    button.addEventListener('click', event_slot, false);
    //var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = xhrSlot;
    xhr.open('GET', 'http://api.whelp.gg/corporation/98182803', true);
    xhr.send('');

}
xhr = new XMLHttpRequest();
