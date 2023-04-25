function itemSearch() {
    let input, itemBoxes, name;

    input = document.getElementById('search');
    itemBoxes = document.getElementsByClassName('itemBox');
    filter = input.value.toUpperCase();
    for (let i = 0; i < itemBoxes.length; i++){
        text = itemBoxes[i].innerText;

        if(text.toUpperCase().indexOf(filter) > -1) {
            itemBoxes[i].id = "";
        }
        else{
            itemBoxes[i].id = "hidden";
        }
        
    }
}