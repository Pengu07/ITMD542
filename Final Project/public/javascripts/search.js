function itemSearch() {
    let input, table, row, name, rarity, source, nameText, rarityText, sourceText, level, levelText;

    input = document.getElementById('search');
    table = document.getElementById('table');
    row = table.getElementsByTagName('tr');
    filter = input.value.toUpperCase();

    for (let i = 0; i < row.length; i++){
        name = row[i].getElementsByTagName('td')[0]
        rarity = row[i].getElementsByTagName('td')[1]
        source = row[i].getElementsByTagName('td')[2]
        level = row[i].getElementsByTagName('td')[3]

        if(name || rarity || source){
            nameText = name.textContent || name.innerText;
            rarityText = rarity.textContent || rarity.innerText;
            sourceText = source.textContent || source.innerText;
            levelText = level.textContent || level.innerText;

            if(nameText.toUpperCase().indexOf(filter) > -1) {
                row[i].style.display = "";
            }
            else if(rarityText.toUpperCase().indexOf(filter) > -1){
                row[i].style.display = "";
            }
            else if(sourceText.toUpperCase().indexOf(filter) > -1){
                row[i].style.display = "";
            }
            else if(levelText.toUpperCase().indexOf(filter) > -1){
                row[i].style.display = "";
            }
            else{
                row[i].style.display = "none";
            }
        }
    }
}

function sourceSearch() {
    let input, table, row, name, location, type, nameText, locationText, typeText;

    input = document.getElementById('search');
    table = document.getElementById('table');
    row = table.getElementsByTagName('tr');
    filter = input.value.toUpperCase();

    for (let i = 0; i < row.length; i++){
        name = row[i].getElementsByTagName('td')[0]
        location = row[i].getElementsByTagName('td')[1]
        type = row[i].getElementsByTagName('td')[2]

        if(name || location || type){
            nameText = name.textContent || name.innerText;
            locationText = location.textContent || location.innerText;
            typeText = type.textContent || type.innerText;
            if(nameText.toUpperCase().indexOf(filter) > -1) {
                row[i].style.display = "";
            }
            else if(locationText.toUpperCase().indexOf(filter) > -1){
                row[i].style.display = "";
            }
            else if(typeText.toUpperCase().indexOf(filter) > -1){
                row[i].style.display = "";
            }
            else{
                row[i].style.display = "none";
            }
        }
    }
}

function userSearch() {
    let input, table, row, username, firstName, lastName, usernameText, firstNameText, lastNameText;

    input = document.getElementById('search');
    table = document.getElementById('table');
    row = table.getElementsByTagName('tr');
    filter = input.value.toUpperCase();

    for (let i = 0; i < row.length; i++){
        username = row[i].getElementsByTagName('td')[0]
        firstName = row[i].getElementsByTagName('td')[1]
        lastName = row[i].getElementsByTagName('td')[2]

        if(username || firstName || lastName){
            usernameText = username.textContent || username.innerText;
            firstNameText = firstName.textContent || firstName.innerText;
            lastNameText = lastName.textContent || lastName.innerText;
            if(usernameText.toUpperCase().indexOf(filter) > -1) {
                row[i].style.display = "";
            }
            else if(firstNameText.toUpperCase().indexOf(filter) > -1){
                row[i].style.display = "";
            }
            else if(lastNameText.toUpperCase().indexOf(filter) > -1){
                row[i].style.display = "";
            }
            else{
                row[i].style.display = "none";
            }
        }
    }
}